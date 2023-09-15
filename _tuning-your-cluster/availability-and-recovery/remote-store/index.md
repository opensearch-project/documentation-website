---
layout: default
title: Remote-backed storage
nav_order: 40
has_children: true
parent: Availability and recovery
redirect_from: 
  - /opensearch/remote/
  - /tuning-your-cluster/availability-and-recovery/remote/
---

# Remote-backed storage


Remote-backed storage offers OpenSearch users a new way to protect against data loss by automatically creating backups of all index transactions and sending them to remote storage. In order to expose this feature, segment replication must also be enabled. See [Segment replication]({{site.url}}{{site.baseurl}}/opensearch/segment-replication/) for additional information.

## Translog

Any index changes, such as indexing or deleting documents, are written to disk during a Lucene commit. However, Lucene commits are expensive operations, so they cannot be performed after every change to the index. Instead, each shard records every indexing operation in a transaction log called *translog*. When a document is indexed, it is added to the memory buffer and recorded in the translog. Frequent refresh operations write the documents in the memory buffer to a segment and then clear the memory buffer. Periodically, a flush performs a Lucene commit, which includes writing the segments to disk using fsync, purging the old translog, and starting a new translog. Thus, a translog contains all operations that have not yet been flushed. 

## Segment replication and remote-backed storage

When neither segment replication nor remote-backed storage is enabled, OpenSearch uses document replication. In document replication, when a write request lands on the primary shard, the request is indexed to Lucene and stored in the translog. After this, the request is sent to the replicas, where, in turn, it is indexed to Lucene and stored in the translog for durability. 

With segment replication, segments are created on the primary shard only and then copied to all replicas. The replicas do not index requests to Lucene, but they do create and maintain a translog.

With remote-backed storage, when a write request lands on the primary shard, the request is indexed to Lucene on the primary shard only. The corresponding translog is then uploaded to remote store. OpenSearch does not send the write request to the replicas, but rather performs a primary term validation to confirm that the request originator shard is still the primary shard. Primary term validation ensures that the acting primary shard fails if it becomes isolated and is unaware of the cluster manager electing a new primary.

## The `index.translog.durability` translog setting

Without remote-backed storage, indexing operations are only persisted to disk when the translog is fsynced. Therefore, any data that has not been written to disk can potentially be lost. 

The `index.translog.durability` setting controls how frequently OpenSearch fsyncs the translog to disk:

- By default, `index.translog.durability` is set to `request`. This means that fsync happens after every request, and all acknowledged write requests persist in case of failure.

- If you set `index.translog.durability` to `async`, fsync happens periodically at the specified `sync_interval` (5 seconds by default). The fsync operation is asynchronous, so acknowledge is sent without waiting for fsync. Consequently, all acknowledged writes since the last commit are lost in case of failure.

With remote-backed storage, the translog is uploaded to a remote store for durability.

`index.translog.durability` is a dynamic setting. To update it, use the following query:

```json
PUT my_index/_settings
{
  "index" : {
    "translog.durability" : "request"
  }
}
```

## Refresh-level and request-level durability

The remote store feature supports two levels of durability:

- Refresh-level durability: Segment files are uploaded to remote store after every refresh. Set the `remote_store` flag to `true` to achieve refresh-level durability. Commit-level durability is inherent, and uploads are asynchronous.

  If you need to refresh an index manually, you can use the `_refresh` API. For example, to refresh the `my_index` index, use the following request:
   
  ```json
  POST my_index/_refresh
  ```

- Request-level durability: Translogs are uploaded before acknowledging the request. Set the `translog` flag to `true` to achieve request-level durability. In this scenario, we recommend to batch as many requests as possible in a bulk request. Batching requests will improve indexing throughput and latency compared to sending individual write requests.

## Enable the feature flag

There are several methods for enabling remote store feature, depending on the install type. You will also need to enable `remote_store` property when creating the index.

Segment replication must also be enabled to use remote-backed storage.
{: .note}

### Enable on a node using a tarball install

The flag is toggled using a new jvm parameter that is set either in `OPENSEARCH_JAVA_OPTS` or in config/jvm.options.

#### Option 1: Modify jvm.options

Add the following lines to `config/jvm.options` before starting the OpenSearch process to enable the feature and its dependency:

```
-Dopensearch.experimental.feature.replication_type.enabled=true
-Dopensearch.experimental.feature.remote_store.enabled=true
```

Run OpenSearch

```bash
./bin/opensearch
```

#### Option 2: Enable from an environment variable

As an alternative to directly modifying `config/jvm.options`, you can define the properties by using an environment variable. This can be done in a single command when you start OpenSearch or by defining the variable with `export`.

To add these flags in-line when starting OpenSearch:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.replication_type.enabled=true -Dopensearch.experimental.feature.remote_store.enabled=true" ./opensearch-{{site.opensearch_version}}/bin/opensearch
```

If you want to define the environment variable separately, prior to running OpenSearch:

```bash
export OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.replication_type.enabled=true -Dopensearch.experimental.feature.remote_store.enabled=true"
./bin/opensearch
```

### Enable with Docker containers

If you're running Docker, add the following line to docker-compose.yml underneath the `opensearch-node` and `environment` section:

````json
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.replication_type.enabled=true -Dopensearch.experimental.feature.remote_store.enabled=true"
````

### Enable for OpenSearch development

To create new indexes with remote-backed storage enabled, you must first enable these features by adding the correct properties to `run.gradle` before building OpenSearch. See the [developer guide](https://github.com/opensearch-project/OpenSearch/blob/main/DEVELOPER_GUIDE.md) for information about to use how Gradle to build OpenSearch.

Add the following properties to `run.gradle` to enable the feature:

```bash
testClusters {
  runTask {
    testDistribution = 'archive'
    if (numZones > 1) numberOfZones = numZones
    if (numNodes > 1) numberOfNodes = numNodes
    systemProperty 'opensearch.experimental.feature.replication_type.enabled', 'true'
    systemProperty 'opensearch.experimental.feature.remote_store.enabled', 'true'
  }
}
```

## Register a remote repository

Now that your deployment is running with the feature flags enabled, the next step is to register a remote repository where backups will be stored. See [Register repository]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#register-repository) for more information.

## Create an index

Remote-backed storage is enabled for an index when it is created. This feature cannot be enabled for indexes that already exist.

For refresh-level durability, include the `remote_store` property to enable the feature and specify a segment repository:

```bash
curl -X PUT "https://localhost:9200/my-index?pretty" -ku admin:admin -H 'Content-Type: application/json' -d'
{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "number_of_replicas": 0,
      "replication": {
        "type": "SEGMENT"
      },
      "remote_store": {
        "enabled": true,
        "repository": "segment-repo"
      }
    }
  }
}
'
```

For request-level durability, in addition to the `remote_store` and segment repository, include the `translog` property and specify a translog repository:

```bash
curl -X PUT "https://localhost:9200/my-index?pretty" -ku admin:admin -H 'Content-Type: application/json' -d'
{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "number_of_replicas": 1,
      "replication": {
        "type": "SEGMENT"
      },
      "remote_store": {
        "enabled": true,
        "repository": "segment-repo",
        "translog": {
          "enabled": true,
          "repository": "translog-repo",
          "buffer_interval": "300ms"
        }
      }
    }
  }
}
'
```

You can have the same repository serve as both the segment repository and translog repository. 
{: .note}

As data is added to the index, it also will be continuously uploaded to remote storage in the form of segment and translog files because of refreshes, flushes, and translog fsyncs to disk. Along with data, other metadata files will be uploaded.
The `buffer_interval` setting specifies the time interval during which translog operations are buffered. Instead of uploading individual translog files, OpenSearch creates a single translog file with all the write operations received during the configured interval. Bundling translog files leads to higher throughput but also increases latency. The default `buffer_interval` value is 100 ms.

Setting `translog.enabled` to `true` is currently an irreversible operation.
{: .warning}

### Restoring from a backup

To restore an index from a remote backup, such as in the event of a node failure, you must first close the index:

```bash
curl -X POST "https://localhost:9200/my-index/_close" -ku admin:admin
```

Restore the index from the backup stored on the remote repository:

```bash
curl -X POST "https://localhost:9200/_remotestore/_restore" -ku admin:admin -H 'Content-Type: application/json' -d'
{
  "indices": ["my-index"]
}
'
```

If the Security plugin is enabled, a user must have the `cluster:admin/remotestore/restore` permission. See [Access control](/security-plugin/access-control/index/) for information about configuring user permissions.
{: .note}

## Potential use cases

You can use remote-backed storage for the following purposes:

- To restore red clusters or indexes
- To recover all data up to the last acknowledged write, regardless of replica count, if `index.translog.durability` is set to `request`

## Known limitations

The following are known limitations of the remote-backed storage feature:

- Writing data to a remote store can be a high-latency operation when compared to writing data on the local file system. This may impact the indexing throughput and latency. For performance benchmarking results, see [issue #6376](https://github.com/opensearch-project/OpenSearch/issues/6376).

