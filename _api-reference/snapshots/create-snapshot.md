---
layout: default
title: Create Snapshot
parent: Snapshot APIs
nav_order: 5
---

# Create snapshot
**Introduced 1.0**
{: .label .label-purple }

The Create Snapshot API creates a snapshot of your cluster's data within an existing repository. Snapshots serve as backups that you can use to restore your data or migrate it between clusters.

* For more information about snapshots, see [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index).
* To view a list of your repositories, see [Get Snapshot Repository]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-repository).

<!-- spec_insert_start
api: snapshot.create
component: endpoints
-->
## Endpoints
```json
POST /_snapshot/{repository}/{snapshot}
PUT  /_snapshot/{repository}/{snapshot}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: snapshot.create
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `repository` | **Required** | String | The name of the repository where the snapshot will be stored. |
| `snapshot` | **Required** | String | The name of the snapshot. Must be unique in the repository. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.create
component: query_parameters
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |
| `wait_for_completion` | Boolean | When `true`, the request returns a response when the snapshot is complete. When `false`, the request returns a response when the snapshot initializes. _(Default: `false`)_ |

<!-- spec_insert_end -->


## Request body fields

The request body is optional. It is a JSON object with the following fields.

| Property | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `indices` | String or Array of Strings | A comma-separated list of data streams, indexes, and aliases to include in the snapshot. Supports wildcards (`*`). To include all data streams and indexes, omit this parameter or use `*` or `_all`. | N/A |
| `ignore_unavailable` | Boolean | When `true`, the request ignores any data streams and indexes that are missing or closed. When `false`, the request returns an error for any data streams or indexes that are missing or closed. | `false` |
| `include_global_state` | Boolean | When `true`, includes the current cluster state in the snapshot. The cluster state includes persistent cluster settings, composable index templates, legacy index templates, ingest pipelines, and ILM policies. The cluster state also includes data stored in system indexes, such as watches and task records (configurable with `feature_states`). | `true` |
| `partial` | Boolean | When `true`, allows the restoration of a partial snapshot if some shards are unavailable. Only shards that were successfully included in the snapshot will be restored. All missing shards will be recreated as empty. When `false`, the entire restore operation will fail if one or more indexes included in the snapshot do not have all primary shards available. | `false` |
| `feature_states` | Array of Strings | A list of feature states to include in the snapshot. Each feature state includes one or more system indexes which contain related data. You can view a list of features using the Get Feature API. If `include_global_state` is `true`, all current feature states are included by default. If `include_global_state` is `false`, no feature states are included by default. | N/A |
| `metadata` | Object | Custom metadata to attach to the snapshot. | N/A |


## Example requests

### Basic request

The following request creates a snapshot called `my-first-snapshot` in an S3 repository called `my-s3-repository`:

```json
POST _snapshot/my-s3-repository/my-first-snapshot
```
{% include copy-curl.html %}

### Request with configuration

You can add a request body to include or exclude specific indices or specify other settings:

```json
PUT _snapshot/my-s3-repository/2
{
  "indices": "opensearch-dashboards*,my-index*,-my-index-2016",
  "ignore_unavailable": true,
  "include_global_state": false,
  "partial": false
}
```
{% include copy-curl.html %}

## Example responses

The response content depends on whether you include the `wait_for_completion` query parameter.

### Without `wait_for_completion`

When `wait_for_completion=false` (the default), the API returns a simple acknowledgment that the snapshot creation has started:

```json
{
  "accepted": true
}
```

To verify that the snapshot was created, use the [Get Snapshot]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot) API, passing the snapshot name as the `snapshot` path parameter.
{: .note}

### With `wait_for_completion=true`

When `wait_for_completion=true`, the API returns detailed information about the completed snapshot:

```json
{
  "snapshot": {
    "snapshot": "5",
    "uuid": "ZRH4Zv7cSnuYev2JpLMJGw",
    "version_id": 136217927,
    "version": "2.0.1",
    "indices": [
      ".opendistro-reports-instances",
      ".opensearch-observability",
      ".kibana_1",
      "opensearch_dashboards_sample_data_flights",
      ".opensearch-notifications-config",
      ".opendistro-reports-definitions",
      "shakespeare"
    ],
    "data_streams": [],
    "include_global_state": true,
    "state": "SUCCESS",
    "start_time": "2022-08-10T16:52:15.277Z",
    "start_time_in_millis": 1660150335277,
    "end_time": "2022-08-10T16:52:18.699Z",
    "end_time_in_millis": 1660150338699,
    "duration_in_millis": 3422,
    "failures": [],
    "shards": {
      "total": 7,
      "failed": 0,
      "successful": 7
    }
  }
}
```

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `accepted` | Boolean | Returns `true` if the snapshot was accepted. Present when the request had `wait_for_completion` set to `false`. |
| `snapshot` | Object | The snapshot creation results. |

<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code>
  </summary>
  {: .text-delta}

`snapshot` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `data_streams` | Array of Strings | The list of data streams included in the snapshot. |
| `duration` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `duration_in_millis` | Integer | The time unit for milliseconds. |
| `end_time` | Object or String | A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation. |
| `end_time_in_millis` | Integer | The time unit for milliseconds. |
| `failures` | Array of Objects | The list of shard failures that occurred during the snapshot. |
| `include_global_state` | Boolean | Whether the snapshot includes the cluster state. |
| `indices` | Array of Strings | The list of indexes included in the snapshot. |
| `metadata` | Object | The custom metadata attached to a resource. |
| `pinned_timestamp` | Integer | The time unit for milliseconds. |
| `reason` | String | The reason for the snapshot creation. |
| `remote_store_index_shallow_copy` | Boolean | Whether the snapshot uses remote store index shallow copy. |
| `shards` | Object | The statistics about the shards included in the snapshot. |
| `snapshot` | String | The name of a resource or configuration element. |
| `start_time` | Object or String | A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation. |
| `start_time_in_millis` | Integer | The time unit for milliseconds. |
| `state` | String | The current state of the snapshot. |
| `uuid` | String | The universally unique identifier. |
| `version` | String | The version of OpenSearch when the snapshot was created. |
| `version_id` | Integer | The internal version number of OpenSearch when the snapshot was created. |

