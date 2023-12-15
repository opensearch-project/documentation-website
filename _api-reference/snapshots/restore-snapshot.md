---
layout: default
title: Restore Snapshot
parent: Snapshot APIs

nav_order: 9
---

# Restore Snapshot
**Introduced 1.0**
{: .label .label-purple }

Restores a snapshot of a cluster or specified data streams and indices. 

* For information about indices and clusters, see [Introduction to OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/index).

* For information about data streams, see [Data streams]({{site.url}}{{site.baseurl}}/opensearch/data-streams).

If open indexes with the same name that you want to restore already exist in the cluster, you must close, delete, or rename the indexes. See [Example request](#example-request) for information about renaming an index. See [Close index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/close-index) for information about closing an index.
{: .note}

## Path parameters

| Parameter | Data type | Description |
:--- | :--- | :---
repository | String | Repository containing the snapshot to restore. |
| snapshot | String | Snapshot to restore. |

## Query parameters

Parameter | Data type | Description
:--- | :--- | :---
wait_for_completion | Boolean |  Whether to wait for snapshot restoration to complete before continuing. |

### Request fields

All request body parameters are optional.

| Parameter | Data type | Description |
:--- | :--- | :--- 
| ignore_unavailable | Boolean | How to handle data streams or indices that are missing or closed. If `false`, the request returns an error for any data stream or index that is missing or closed. If `true`, the request ignores data streams and indices in indices that are missing or closed. Defaults to `false`. |
| ignore_index_settings | Boolean | A comma-delimited list of index settings that you don't want to restore from a snapshot. |
| include_aliases | Boolean | How to handle index aliases from the original snapshot. If `true`, index aliases from the original snapshot are restored. If `false`, aliases along with associated indices are not restored. Defaults to `true`. |
| include_global_state | Boolean | Whether to restore the current cluster state<sup>1</sup>. If `false`, the cluster state is not restored. If true, the current cluster state is restored. Defaults to `false`.|
| index_settings | String | A comma-delimited list of settings to add or change in all restored indices. Use this parameter to override index settings during snapshot restoration. For data streams, these index settings are applied to the restored backing indices. |
| indices | String | A comma-delimited list of data streams and indices to restore from the snapshot. Multi-index syntax is supported. By default, a restore operation includes all data streams and indices in the snapshot. If this argument is provided, the restore operation only includes the data streams and indices that you specify. |
| partial | Boolean | How the restore operation will behave if indices in the snapshot do not have all primary shards available. If `false`, the entire restore operation fails if any indices in the snapshot do not have all primary shards available. <br /> <br />If `true`, allows the restoration of a partial snapshot of indices with unavailable shards. Only shards that were successfully included in the snapshot are restored. All missing shards are recreated as empty. By default, the entire restore operation fails if one or more indices included in the snapshot do not have all primary shards available. To change this behavior, set `partial` to `true`. Defaults to `false`. |
| rename_pattern | String | The pattern to apply to restored data streams and indices. Data streams and indices matching the rename pattern will be renamed according to `rename_replacement`. <br /><br />The rename pattern is applied as defined by the regular expression that supports referencing the original text. <br /> <br />The request fails if two or more data streams or indices are renamed into the same name. If you rename a restored data stream, its backing indices are also renamed. For example, if you rename the logs data stream to `recovered-logs`, the backing index `.ds-logs-1` is renamed to `.ds-recovered-logs-1`. <br /> <br />If you rename a restored stream, ensure an index template matches the new stream name. If there are no matching index template names, the stream cannot roll over and new backing indices are not created.|
| rename_replacement | String | The rename replacement string. See `rename_pattern` for more information.|
| source_remote_store_repository | String | The name of the remote store repository of the source index being restored. If not provided, the Snapshot Restore API will use the repository that was registered when the snapshot was created.
| wait_for_completion | Boolean | Whether to return a response after the restore operation has completed.  If `false`, the request returns a response when the restore operation initializes.  If `true`, the request returns a response when the restore operation completes. Defaults to `false`. |

<sup>1</sup>The cluster state includes:
* Persistent cluster settings
* Index templates
* Legacy index templates
* Ingest pipelines
* Index lifecycle policies

#### Example request

The following request restores the `opendistro-reports-definitions` index from `my-first-snapshot`. The `rename_pattern` and `rename_replacement` combination causes the index to be renamed to `opendistro-reports-definitions_restored` because duplicate open index names in a cluster are not allowed.

````json
POST /_snapshot/my-opensearch-repo/my-first-snapshot/_restore
{
  "indices": "opendistro-reports-definitions",
  "ignore_unavailable": true,
  "include_global_state": false,              
  "rename_pattern": "(.+)",
  "rename_replacement": "$1_restored",
  "include_aliases": false
}
````

#### Example response

Upon success, the response returns the following JSON object:

````json
{
  "snapshot" : {
    "snapshot" : "my-first-snapshot",
    "indices" : [ ],
    "shards" : {
      "total" : 0,
      "failed" : 0,
      "successful" : 0
    }
  }
}
````
Except for the snapshot name, all properties are empty or `0`. This is because any changes made to the volume after the snapshot was generated are lost. However, if you invoke the [Get snapshot]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot) API to examine the snapshot, a fully populated snapshot object is returned. 

## Response fields

| Field | Data type | Description |
| :--- | :--- | :--- | 
| snapshot | string | Snapshot name. |
| indices | array | Indices in the snapshot. |
| shards | object | Total number of shards created along with number of successful and failed shards. |

If open indices in a snapshot already exist in a cluster, and you don't delete, close, or rename them, the API returns an error like the following:
{: .note}

````json
{
  "error" : {
    "root_cause" : [
      {
        "type" : "snapshot_restore_exception",
        "reason" : "[my-opensearch-repo:my-first-snapshot/dCK4Qth-TymRQ7Tu7Iga0g] cannot restore index [.opendistro-reports-definitions] because an open index with same name already exists in the cluster. Either close or delete the existing index or restore the index under a different name by providing a rename pattern and replacement name"
      }
    ],
    "type" : "snapshot_restore_exception",
    "reason" : "[my-opensearch-repo:my-first-snapshot/dCK4Qth-TymRQ7Tu7Iga0g] cannot restore index [.opendistro-reports-definitions] because an open index with same name already exists in the cluster. Either close or delete the existing index or restore the index under a different name by providing a rename pattern and replacement name"
  },
  "status" : 500
}
````