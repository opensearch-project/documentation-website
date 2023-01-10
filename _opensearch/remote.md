---
layout: default
title: Remote-backed storage
nav_order: 19
---

# Remote-backed storage

Remote-backed storage is an experimental feature. Therefore, we do not recommend the use of remote-backed storage in a production environment. For updates on the progress of remote-backed storage, or if you want leave feedback that could help improve the feature, refer to the issue on [GitHub](https://github.com/opensearch-project/OpenSearch/issues/1968).
{: .warning}

Remote-backed storage offers OpenSearch users a new way to protect against data loss by automatically creating backups of all index transactions and sending them to remote storage. In order to expose this feature, segment replication must also be enabled. See [Segment replication]({{site.url}}{{site.baseurl}}/opensearch/segment-replication/) for additional information.

## Translog

When documents are indexed, updated, or deleted, the data needs to eventually be persisted to disk so it can be recovered in case of failure. However, Lucene commits are expensive operations, and as such cannot be performed after every change to the index. Instead, each shard records every indexing operation in a transaction log called *translog*. When a document is indexed, it is added to the memory buffer and also recorded in the translog. Frequent refresh operations write the documents in the memory buffer to a segment, and clear the memory buffer. Periodically, a flush performs a Lucene commit, which includes writing the segments to disk using `fsync`, purging the old translog, and starting a new translog. 

Thus, a translog contains all operations that have not yet been written to disk. 

## Segment replication and remote-backed storage

When neither segment replication nor remote-backed storage is enabled, OpenSearch uses document replication. In document replication, when a write request lands on the primary shard, the request is indexed to Lucene and stored in the translog as a single unit of transaction for durability. After this, the request is sent to the replicas, where, in turn, it is indexed to Lucene and stored in the translog. 

With segment replication, the segments are created on the primary shard only and then copied to all replicas. The replicas do not index a request to Lucene, but they do create and maintain a translog.

With remote-backed storage, when a write request lands on the primary shard, the request is indexed to Lucene on primary shard only, and then stored in the translog. The translogs are fsynced to local disk and then uploaded into remote store. OpenSearch does not send the write request to the replicas, but rather performs a primary term validation. Primary term validation entails confirming that the request originator shard is still the primary shard. This is necessary to ensure that the acting primary shard fails in case the acting primary is isolated and unaware of the cluster manager electing a new primary.

## Translog settings

Without remote-backed storage, indexing operations are only persisted to disk when the translog is fsynced. Therefore, any data that has not been written to disk can potentially be lost. 

The `index.translog.durability` setting controls how frequently OpenSearch fsyncs the translog to disk:

- By default, `index.translog.durability` is set to `request`. This means that fsync happens after every request, and all acknowledged write requests persist in case of failure.

- If you set` index.translog.durability` to `async`, fsync happens periodically at the specified `sync_interval` (5 seconds by default). The fsync operation is asynchronous, so acknowledge is sent without waiting for fsync. Consequently, all acknowledged writes since the last commit are lost in case of failure.

With remote-backed storage, the translog is not only fsynced to disk, but also uploaded into a remote store.

## Refresh-level and request-level durability

The remote store feature supports two levels of durability:

- Refresh-level durability: Segment files are uploaded to remote store after every refresh. Set the `remote_store` flag to `true` to achieve refresh-level durability. Commit-level durability is inherent, and uploads are asynchronous.

  If you need to activate a refresh manually, you can use the `_refresh` API. For example, to refresh the `my_index` index, use the following request:
   
  ```json
  POST my_index/_refresh
  ```

  To refresh all indexes, use the following request:

  ```json
  POST /_refresh
  ```

- Request-level durability: Translogs are uploaded before acknowledging the request. Set the `translog` flag to `true` to achieve request-level durability. In this scenario, it is beneficial to batch as many requests as possible in a bulk request. This will improve indexing throughput and latency compared to sending individual write requests.

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

When creating the index, include the `remote_store` property to enable the feature and specify a target repository:

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
          "repository": "translog-repo"
        }
      }
    }
  }
}
'
```

The segment repository and translog repository can be the same or different. As data is added to the index, it will also be continuously uploaded to the remote storage in the form of segment and translog files because of refreshes, flushes, and translog fsync to disk. Along with data, other metadata files will be uploaded.

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

If the security plugin is enabled, a user must have the `cluster:admin/remotestore/restore` permission. See [Access control](/security-plugin/access-control/index/) for information about configuring user permissions.
{: .note}

## Potential use cases

You can use remote-backed storage for the following purposes:

- To restore red clusters or indexes
- To recover all data up to the last acknowledged write regardless of replica count if `index.translog.durability` is set to `request`

## Known limitations

The following are known limitations of the remote-backed storage feature:

- Writing data to a remote store can be a high latency operation when compared to writing data on local file system. This may impact the indexing throughput and latency.
- Primary to primary relocation is unstable as handover of upload of translogs from older primary to new is yet to be implemented.
- Garbage collection of the metadata file is not implemented yet.
For other limitations, see the [Remote store known issue list](https://github.com/opensearch-project/OpenSearch/issues/5678).

