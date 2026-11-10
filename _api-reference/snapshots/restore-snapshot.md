---
layout: default
title: Restore snapshot
parent: Snapshot APIs
nav_order: 90
---

# Restore Snapshot API
**Introduced 1.0**
{: .label .label-purple }

Restores a snapshot of a cluster or specified data streams and indexes.

If open indexes with the same name that you want to restore already exist in the cluster, you must close, delete, or rename the indexes. You can restore over a closed index only if it has the same number of shards as the index in the snapshot; the restore operation reopens the index. For information about renaming an index, see [Example requests](#example-requests). For information about closing an index, see [Close index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/close-index/). To restore a snapshot to a different cluster, see [Restoring to a different cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#restoring-a-snapshot-to-a-different-cluster). For more information about avoiding conflicts, see [Conflicts and compatibility]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#conflicts-and-compatibility).
{: .note}

## Endpoints

```json
POST _snapshot/{repository}/{snapshot}/_restore
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `repository` | String | Repository containing the snapshot to restore. |
| `snapshot` | String | Snapshot to restore. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `wait_for_completion` | Boolean | Whether to wait for the restore operation to complete before returning a response. If `false`, the request returns `{"accepted": true}` when the restore operation starts. If `true`, the request returns a response containing the restored indexes and shard counts after the restore operation completes. Default is `false`. |

## Request body fields

The following table lists the available request body fields. All request body fields are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `attach_to_data_stream` (Experimental) | Boolean | Whether to attach a restored backing index to a pre-existing data stream of the same name. When `true`, a restored index whose name matches the `.ds-<data_stream>-NNNNNN` backing index convention is attached to a pre-existing data stream of the same name as part of the restore operation, advancing the stream generation as needed. The attached index must map the data stream's timestamp field as a `date`. When `false`, the index is restored as a standalone index. Default is `false`. See [Attach a restored backing index to a data stream](#attach-a-restored-backing-index-to-a-data-stream).|
| `ignore_unavailable` | Boolean | How to handle data streams or indexes that are missing or closed. If `false`, the request returns an error for any data stream or index that is missing or closed. If `true`, the request ignores data streams and indexes that are missing or closed. Defaults to `false`. |
| `ignore_index_settings` | String or Array of strings | The index settings to exclude when restoring from a snapshot. Excluded settings are reset to their default values. Specify a comma-separated string or an array of strings. Some settings, such as `index.number_of_replicas`, can't be excluded. To change them, use `index_settings`. |
| `include_aliases` | Boolean | How to handle index aliases from the original snapshot. If `true`, index aliases from the original snapshot are restored. If `false`, the indexes are restored without their aliases. Defaults to `true`. |
| `include_global_state` | Boolean | Whether to restore the cluster state stored in the snapshot<sup>1</sup>. When `true`, items in the snapshot's cluster state replace existing items with the same names. Default is `false`.|
| `index_settings` | Object | An object containing the settings to add or change in all restored indexes, for example, `{"index.number_of_replicas": 0}`. Use this parameter to override index settings during snapshot restoration. For data streams, these index settings are applied to the restored backing indexes. Some settings, such as `index.number_of_shards`, can't be changed during a restore. |
| `indices` | String | A comma-delimited list of data streams and indexes to restore from the snapshot. Multi-index syntax is supported. By default, a restore operation includes all data streams and indexes in the snapshot. If this argument is provided, the restore operation only includes the data streams and indexes that you specify. |
| `partial` | Boolean | How the restore operation will behave if indexes in the snapshot do not have all primary shards available. If `false`, the entire restore operation fails if any indexes in the snapshot do not have all primary shards available. <br /> <br />If `true`, allows the restoration of a partial snapshot of indexes with unavailable shards. Only shards that were successfully included in the snapshot are restored. All missing shards are recreated as empty. Defaults to `false`. |
| `rename_pattern` | String | The pattern to apply to the restored data streams and indexes. Data streams and indexes matching the rename pattern will be renamed according to the `rename_replacement` setting. <br /><br /> The rename pattern is a regular expression. In `rename_replacement`, use `$1`, `$2`, and so on to reference the groups captured by the pattern, as described in the [Java `Matcher` documentation](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/regex/Matcher.html#appendReplacement(java.lang.StringBuilder,java.lang.String)). <br /> <br /> The request fails if two or more data streams or indexes are renamed to the same name. If you rename a restored data stream, its backing indexes are also renamed. For example, if you rename the logs data stream to `recovered-logs`, the backing index `.ds-logs-1` is renamed to `.ds-recovered-logs-1`. <br /> <br /> If you rename a restored stream, ensure an index template matches the new stream name. If there are no matching index template names, the stream cannot roll over, and new backing indexes are not created.|
| `rename_replacement` | String | The rename replacement string.|
| `rename_alias_pattern` | String | The pattern to apply to the restored aliases. Aliases matching the rename pattern will be renamed according to the `rename_alias_replacement` setting. <br /><br /> The rename pattern is a regular expression. In `rename_alias_replacement`, use `$1`, `$2`, and so on to reference the groups captured by the pattern. <br /> <br /> If two or more aliases are renamed to the same name, these aliases will be merged into one.|
| `rename_alias_replacement` | String | The rename replacement string for aliases.|
| `source_remote_store_repository` | String | The name of the remote segment repository of the source index being restored. Required only when both source and target clusters use remote-backed storage and have different remote store repositories. The specified repository must be registered as read-only on the target cluster before restoring. If not provided, the Snapshot Restore API will use the repositories that were registered when the snapshot was created. |
| `source_remote_translog_repository` | String | The name of the remote translog repository of the source index being restored. Required only when both source and target clusters use remote-backed storage and have different remote store repositories. The specified repository must be registered as read-only on the target cluster before restoring. |
| `storage_type` | String | Where the restored index data is stored. Valid values are:<br> - `local`: All index data and snapshot metadata are downloaded to local storage.<br> - `remote_snapshot`: Snapshot metadata is downloaded to the cluster, but the remote repository remains the authoritative store of the index data. Data is downloaded and cached as necessary to service queries. At least one node in the cluster must have the [`warm` role]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/searchable_snapshot/#configuring-a-node-to-use-searchable-snapshots) in order to restore a snapshot using the type `remote_snapshot`.<br><br>Default is `local`. |

<sup>1</sup>The cluster state includes the following items. When you restore the cluster state, these items replace existing items with the same names in the cluster:
* Persistent cluster settings
* Index templates
* Legacy index templates
* Ingest pipelines

Index State Management (ISM) policies are stored in an index, not in the cluster state, so they are not restored with the cluster state.

## Example requests

The following examples demonstrate different snapshot restore scenarios.

### Basic restore

The following request restores the `restore-test` index from `my-first-snapshot`. The `rename_pattern` and `rename_replacement` combination causes the index to be renamed to `restore-test_restored` because duplicate open index names in a cluster are not allowed.

<!-- spec_insert_start
component: example_code
rest: POST /_snapshot/my-opensearch-repo/my-first-snapshot/_restore
body: |
{
  "indices": "restore-test",
  "ignore_unavailable": true,
  "include_global_state": false,
  "rename_pattern": "(.+)",
  "rename_replacement": "$1_restored",
  "include_aliases": false
}
-->
{% capture step1_rest %}
POST /_snapshot/my-opensearch-repo/my-first-snapshot/_restore
{
  "indices": "restore-test",
  "ignore_unavailable": true,
  "include_global_state": false,
  "rename_pattern": "(.+)",
  "rename_replacement": "$1_restored",
  "include_aliases": false
}
{% endcapture %}

{% capture step1_python %}


response = client.snapshot.restore(
  repository = "my-opensearch-repo",
  snapshot = "my-first-snapshot",
  body =   {
    "indices": "restore-test",
    "ignore_unavailable": true,
    "include_global_state": false,
    "rename_pattern": "(.+)",
    "rename_replacement": "$1_restored",
    "include_aliases": false
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Change index settings during restore

The following request restores the `restore-test` index under the name `restore-test-settings`, sets the number of replicas to `0`, and resets the `index.refresh_interval` setting to its default value. Reducing the number of replicas is useful when you restore a snapshot to a smaller cluster:

```json
POST /_snapshot/my-opensearch-repo/my-first-snapshot/_restore?wait_for_completion=true
{
  "indices": "restore-test",
  "rename_pattern": "(.+)",
  "rename_replacement": "$1-settings",
  "index_settings": {
    "index.number_of_replicas": 0
  },
  "ignore_index_settings": [
    "index.refresh_interval"
  ]
}
```
{% include copy-curl.html %}

### Cross-cluster restore with remote-backed storage

Remote-backed storage is a feature where OpenSearch automatically backs up segments and translogs to remote repositories. When restoring snapshots between clusters that **both use remote-backed storage** with different remote store repositories, use both the `source_remote_store_repository` and `source_remote_translog_repository` parameters. 

The following example restores an index from a snapshot taken on a source cluster to a target cluster. In this example, `source-cluster-snapshots` is the snapshot repository containing the snapshot from the source cluster, `snapshot-1` is the snapshot name, `my-remote-index` is the index to restore, `source-remote-segment-repo` is the remote segment repository from the source cluster (must be registered as read-only on the target cluster), and `source-remote-translog-repo` is the remote translog repository from the source cluster (must be registered as read-only on the target cluster):

<!-- spec_insert_start
component: example_code
rest: POST /_snapshot/source-cluster-snapshots/snapshot-1/_restore
body: |
{
  "indices": "my-remote-index",
  "source_remote_store_repository": "source-remote-segment-repo",
  "source_remote_translog_repository": "source-remote-translog-repo"
}
-->
{% capture step1_rest %}
POST /_snapshot/source-cluster-snapshots/snapshot-1/_restore
{
  "indices": "my-remote-index",
  "source_remote_store_repository": "source-remote-segment-repo",
  "source_remote_translog_repository": "source-remote-translog-repo"
}
{% endcapture %}

{% capture step1_python %}


response = client.snapshot.restore(
  repository = "source-cluster-snapshots",
  snapshot = "snapshot-1",
  body =   {
    "indices": "my-remote-index",
    "source_remote_store_repository": "source-remote-segment-repo",
    "source_remote_translog_repository": "source-remote-translog-repo"
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The target cluster will restore the index and configure it to read remote segments and translogs from the source cluster's remote store repositories.

For the complete step-by-step procedure, see [Restoring snapshots across remote-backed clusters]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#restoring-snapshots-across-remote-backed-clusters).

### Attach a restored backing index to a data stream
**Introduced 3.8**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/8271).
{: .warning}

To attach a restored backing index to a pre-existing data stream with the same name, set `attach_to_data_stream` to `true`. The restored index name must match the `.ds-<data_stream>-NNNNNN` backing index convention, and the index must map the stream's timestamp field as a `date`. The following request restores the `.ds-logs-foo-000001` backing index and attaches it to the existing `logs-foo` data stream, advancing the stream generation as needed:

```json
POST /_snapshot/my-opensearch-repo/my-first-snapshot/_restore
{
  "indices": ".ds-logs-foo-000001",
  "attach_to_data_stream": true
}
```
{% include copy-curl.html %}

To add or remove backing indexes of a data stream without restoring an index from a snapshot, use the [Modify Data Stream API]({{site.url}}{{site.baseurl}}/api-reference/data-stream/modify-data-stream/).

## Example response

By default, the request returns the following response when the restore operation starts:

```json
{
  "accepted": true
}
```

If you set `wait_for_completion` to `true`, the request returns a response after the restore operation completes. The following response is returned for the [Change index settings during restore](#change-index-settings-during-restore) example:

```json
{
  "snapshot": {
    "snapshot": "my-first-snapshot",
    "indices": [
      "restore-test-settings"
    ],
    "shards": {
      "total": 1,
      "failed": 0,
      "successful": 1
    }
  }
}
```

To view the full snapshot details, such as all of the indexes it contains, use the [Get Snapshot API]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot/).

To monitor the progress of a restore operation, use the [CAT Recovery API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-recovery/). Shards being restored from a snapshot have the recovery type `snapshot`:

```json
GET _cat/recovery/restore-test-settings?v&h=index,shard,type,stage,snapshot,repository,files_percent,bytes_percent
```
{% include copy-curl.html %}

The response shows the snapshot and repository from which each shard is restored and the percentage of files and bytes restored so far:

```
index                 shard type     stage snapshot          repository         files_percent bytes_percent
restore-test-settings 0     snapshot done  my-first-snapshot my-opensearch-repo 100.0%        100.0%
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `accepted` | Boolean | Returned instead of the `snapshot` object when `wait_for_completion` is `false`. Indicates that the restore operation has started. |
| `snapshot.snapshot` | String | The snapshot name. |
| `snapshot.indices` | Array | The names of the restored indexes after any renaming. |
| `snapshot.shards` | Object | The total number of restored shards and the numbers of successful and failed shards. |

If open indexes in a snapshot already exist in a cluster, and you don't delete, close, or rename them, the API returns an error similar to the following:

```json
{
  "error" : {
    "root_cause" : [
      {
        "type" : "snapshot_restore_exception",
        "reason" : "[my-opensearch-repo:my-first-snapshot/DdQp-ksUQ66Vd4H9S2fyKw] cannot restore index [restore-test] because an open index with same name already exists in the cluster. Either close or delete the existing index or restore the index under a different name by providing a rename pattern and replacement name"
      }
    ],
    "type" : "snapshot_restore_exception",
    "reason" : "[my-opensearch-repo:my-first-snapshot/DdQp-ksUQ66Vd4H9S2fyKw] cannot restore index [restore-test] because an open index with same name already exists in the cluster. Either close or delete the existing index or restore the index under a different name by providing a rename pattern and replacement name"
  },
  "status" : 500
}
```

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/snapshot/restore`.
