---
layout: default
title: Remote-backed storage
nav_order: 19
---

# Remote-backed storage

Remote-backed storage offers OpenSearch users a new way to protect against data loss by automatically creating backups of all index transactions and sending them to remote storage. In order to expose this feature, segment replication must also be enabled. See [Segment replication]({{site.url}}{{site.baseurl}}/opensearch/segment-replication/) for additional information.

Remote-backed storage is an experimental feature. Therefore, we do not recommend the use of remote-backed storage in a production environment. For updates on the progress of remote-backed storage, or if you want leave feedback that could help improve the feature, refer to the issue on [GitHub](https://github.com/opensearch-project/OpenSearch/issues/1968).
{: .note}

## Enable the feature

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

Segment replication must also be enabled to use remote-backed storage.
{: .note}

After building OpenSearch with these properties, you must enable the feature for all nodes in your cluster. This can be done by modifying a `config/jvm.options`, or by defining `OPENSEARCH_JAVA_OPS` from the command line.

### Option 1: Modify jvm.options

Add the following lines to `config/jvm.options` before starting the OpenSearch process to enable the feature and its dependency:

```
-Dopensearch.experimental.feature.replication_type.enabled=true
-Dopensearch.experimental.feature.remote_store.enabled=true
```

Run OpenSearch

```bash
./bin/opensearch
```

### Option 2: Enable from an environment variable

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
      "number_of_shards": 1
      "number_of_replicas": 0,
      "replication": {
        "type": "SEGMENT"
      },
      "remote_store": {
        "enabled": true,
        "repository": "my-repo-1"
      }
    }
  }
}
'
```

All data that is added to the index will also be uploaded to the remote storage once it is committed.

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