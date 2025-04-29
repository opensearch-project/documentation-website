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

* For information about indexes and clusters, see [Introduction to OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/index/).

* For information about data streams, see [Data streams]({{site.url}}{{site.baseurl}}/opensearch/data-streams/).

If open indexes with the same name that you want to restore already exist in the cluster, you must close, delete, or rename the indexes. See [Example request](#example-request) for information about renaming an index. See [Close index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/close-index/) for information about closing an index.
{: .note}

<!-- spec_insert_start
api: snapshot.restore
component: endpoints
-->
## Endpoints
```json
POST /_snapshot/{repository}/{snapshot}/_restore
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: snapshot.restore
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `repository` | **Required** | String | The name of the repository containing the snapshot |
| `snapshot` | **Required** | String | The name of the snapshot to restore. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.restore
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |
| `wait_for_completion` | Boolean | -\| Whether to return a response after the restore operation has completed. When `false`, the request returns a response when the restore operation initializes. When `true`, the request returns a response when the restore operation completes. _(Default: `false`)_ |
| `master_timeout` <br> _DEPRECATED_ | String | _(Deprecated since 2.0: To promote inclusive language, use `cluster_manager_timeout` instead.)_ Explicit operation timeout for connection to cluster-manager node |

<!-- spec_insert_end -->

## Request body fields

The request body is optional. It is a JSON object with the following fields.

| Property | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `indices` | String or Array of Strings | A comma-separated list of data streams, indexes, and aliases to restore from the snapshot. Supports wildcards (`*`). To restore all data streams and indexes, omit this parameter or use `*` or `_all`. | `_all` |
| `ignore_unavailable` | Boolean | When `true`, the request ignores any data streams and indexes that are missing or closed. When `false`, the request returns an error for any missing or closed data streams or indexes. | `false` |
| `include_global_state` | Boolean | When `true`, restores the cluster state from the snapshot. The cluster state includes persistent cluster settings, composable index templates, legacy index templates, ingest pipelines, and ILM policies. | `false` |
| `include_aliases` | Boolean | When `true`, restores index aliases from the original snapshot. When `false`, aliases along with associated indexes are not restored. | `true` |
| `partial` | Boolean | When `true`, allows the restoration of a partial snapshot from indexes with unavailable shards. Only shards that were successfully included in the snapshot will be restored. All missing shards will be recreated as empty. When `false`, the entire restore operation fails if any indexes in the snapshot do not have all primary shards available. | `false` |
| `index_settings` | Object | Index settings to add or change in all restored indexes. Use this parameter to override index settings during snapshot restoration. For data streams, these settings are applied to the restored backing indexes. | N/A |
| `ignore_index_settings` | Array of Strings | A comma-separated list of index settings that you don't want to restore from a snapshot. | N/A |
| `rename_pattern` | String | A pattern to apply to the restored data streams and indexes. Data streams and indexes matching the rename pattern will be renamed according to the `rename_replacement` setting. Uses regular expression syntax that supports referencing the original text. | N/A |
| `rename_replacement` | String | The replacement string used with `rename_pattern` to rename restored data streams and indexes. | N/A |
| `rename_alias_pattern` | String | A pattern to apply to the restored aliases. Aliases matching the pattern will be renamed according to the `rename_alias_replacement` setting. Uses regular expression syntax that supports referencing the original text. | N/A |
| `rename_alias_replacement` | String | The replacement string used with `rename_alias_pattern` to rename restored aliases. | N/A |
| `source_remote_store_repository` | String | The name of the remote store repository of the source index being restored. If not provided, the Snapshot Restore API will use the repository that was registered when the snapshot was created. | N/A |
| `storage_type` | String | Where the authoritative store of the restored indexes' data will be. A value of `local` indicates that all snapshot metadata and index data will be downloaded to local storage. A value of `remote_snapshot` indicates that snapshot metadata will be downloaded to the cluster, but the remote repository will remain the authoritative store of the index data, which will be downloaded and cached as needed. | `local` |

## Example request

The following request restores the `opendistro-reports-definitions` index from `my-first-snapshot`, renaming it to `opendistro-reports-definitions_restored` (because duplicate open index names in a cluster are not allowed):

```json
POST /_snapshot/my-opensearch-repo/my-first-snapshot/_restore
{
  "indices": "opendistro-reports-definitions",
  "ignore_unavailable": true,
  "include_global_state": false,
  "rename_pattern": "(.+)",
  "rename_replacement": "$1_restored",
  "include_aliases": false
}
```
{% include copy-curl.html %}

## Example response

Upon success, the response returns the following JSON object:

```json
{
  "snapshot": {
    "snapshot": "my-first-snapshot",
    "indices": [],
    "shards": {
      "total": 0,
      "failed": 0,
      "successful": 0
    }
  }
}
```

If open indices in a snapshot already exist in a cluster, and you don't delete, close, or rename them, the API returns an error.
{: .note}

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `accepted` | Boolean | Returns `true` if the restore was accepted. Present when the request had `wait_for_completion` set to `false`. |
| `snapshot` | Object | Information about the restored snapshot. |

<details markdown="block">
  <summary>
    Response body fields: <code>snapshot</code>
  </summary>
  {: .text-delta}

`snapshot` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `snapshot` | String | The name of the snapshot that was restored. |
| `indices` | Array of Strings | The list of indexes that were restored. |
| `shards` | Object | Statistics about the restored shards. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code>
  </summary>
  {: .text-delta}

`shards` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `total` | Integer | The total number of shards that were restored. |
| `successful` | Integer | The number of shards that were successfully restored. |
| `failed` | Integer | The number of shards that failed to be restored. |

</details>