---
layout: default
title: Create Snapshot
parent: Snapshot APIs
nav_order: 5
---

# Create snapshot
**Introduced 1.0**
{: .label .label-purple }

Creates a snapshot within an existing repository.

* To learn more about snapshots, see [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index).

* To view a list of your repositories, see [Get snapshot repository]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-repository).

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
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |
| `wait_for_completion` | Boolean | When `true`, the request returns a response when the snapshot is complete. When `false`, the request returns a response when the snapshot initializes. _(Default: `false`)_ |
| `master_timeout` <br> _DEPRECATED_ | String | _(Deprecated since 2.0: To promote inclusive language, use `cluster_manager_timeout` instead.)_ Period to wait for a connection to the cluster-manager node. If no response is received before the timeout expires, the request fails and returns an error. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.create
component: request_body_parameters
-->
## Request body fields

The snapshot definition.

The request body is optional. It is a JSON object with the following fields.

| Property | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `feature_states` | Array of Strings | A list of feature states to include in the snapshot. Each feature state includes one or more system indexes which contain related data. You can view a list of features using the Get Feature API.   If `include_global_state` is `true`, all current feature states are included by default. If `include_global_state` is `false`, no feature states are included by default. | N/A |
| `ignore_unavailable` | Boolean | When `true`, the request ignores any data streams and indexes that are missing or closed.  When `false`, the request returns an error for any data streams or indexes that is missing or closed. | N/A |
| `include_global_state` | Boolean | When `true`, includes the current cluster state in the snapshot.  The cluster state includes persistent cluster settings, composable index templates, legacy index templates, ingest pipelines, and ILM policies.  The cluster state also includes data stored in system indexes, such as watches and task records (configurable with `feature_states`). | `true` |
| `indices` | Array of Strings or String | A comma-separated list of data streams, indexes, and aliases used to limit the request. Supports wildcards (`*`). To target all data streams and indexes, omit this parameter or use `*` or `_all`. | N/A |
| `metadata` | Object | The custom metadata attached to a resource. | N/A |
| `partial` | Boolean | When `true`, enables the restoration of a partial snapshot from indexes with unavailable shards.  Only shards that were successfully included in the snapshot will be restored. All missing shards will be recreated as empty.  When `false`, the entire restore operation will fail if one or more indexes included in the snapshot do not have all primary shards available. | `false` |

<details markdown="block" name="snapshot.create::request_body">
  <summary>
    Request body fields: <code>metadata</code>
  </summary>
  {: .text-delta}

The custom metadata attached to a resource.

`metadata` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object |  |

</details>
<details markdown="block" name="snapshot.create::request_body">
  <summary>
    Request body fields: <code>metadata</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.create
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `accepted` | Boolean | Returns `true` if the snapshot was accepted. Present when the request had `wait_for_completion` set to `false`. |
| `snapshot` | Object |  |

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

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>end_time</code>
  </summary>
  {: .text-delta}

A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation.

`end_time` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>end_time</code>
  </summary>
  {: .text-delta}

A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation.

`end_time` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>end_time</code>
  </summary>
  {: .text-delta}

A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation.

`end_time` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>failures</code>
  </summary>
  {: .text-delta}

The list of shard failures that occurred during the snapshot.

`failures` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | The name of the index containing the failed shard. |
| `node_id` | String | The unique identifier for a resource. |
| `reason` | String | The reason for the shard failure. |
| `shard_id` | String | The unique identifier for a resource. |
| `status` | String | The status of the failed shard. |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>metadata</code>
  </summary>
  {: .text-delta}

The custom metadata attached to a resource.

`metadata` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object |  |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>metadata</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code>
  </summary>
  {: .text-delta}

The statistics about the shards included in the snapshot.

`shards` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `failed` | **Required** | Integer |  |
| `successful` | **Required** | Integer |  |
| `total` | **Required** | Integer |  |
| `failures` | _Optional_ | Array of Objects |  |
| `skipped` | _Optional_ | Integer |  |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code>
  </summary>
  {: .text-delta}

`failures` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `reason` | **Required** | Object |  |
| `shard` | **Required** | Integer |  |
| `index` | _Optional_ | String |  |
| `node` | _Optional_ | String |  |
| `status` | _Optional_ | String |  |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code>
  </summary>
  {: .text-delta}

`reason` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | The type of error. |
| `-- freeform field --` | _Optional_ | Object | Any additional information about the error. |
| `caused_by` | _Optional_ | Object |  |
| `reason` | _Optional_ | String | A human-readable explanation of the error, in English. |
| `root_cause` | _Optional_ | Array of Objects |  |
| `stack_trace` | _Optional_ | String | The server stack trace, present only if the `error_trace=true` parameter was sent with the request. |
| `suppressed` | _Optional_ | Array of Objects |  |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code>
  </summary>
  {: .text-delta}

`caused_by` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | The type of error. |
| `-- freeform field --` | _Optional_ | Object | Any additional information about the error. |
| `caused_by` | _Optional_ | Object |  |
| `reason` | _Optional_ | String | A human-readable explanation of the error, in English. |
| `root_cause` | _Optional_ | Array of Objects |  |
| `stack_trace` | _Optional_ | String | The server stack trace, present only if the `error_trace=true` parameter was sent with the request. |
| `suppressed` | _Optional_ | Array of Objects |  |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>root_cause</code>
  </summary>
  {: .text-delta}

`root_cause` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | The type of error. |
| `-- freeform field --` | _Optional_ | Object | Any additional information about the error. |
| `caused_by` | _Optional_ | Object |  |
| `reason` | _Optional_ | String | A human-readable explanation of the error, in English. |
| `root_cause` | _Optional_ | Array of Objects |  |
| `stack_trace` | _Optional_ | String | The server stack trace, present only if the `error_trace=true` parameter was sent with the request. |
| `suppressed` | _Optional_ | Array of Objects |  |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>root_cause</code> > <code>suppressed</code>
  </summary>
  {: .text-delta}

`suppressed` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | The type of error. |
| `-- freeform field --` | _Optional_ | Object | Any additional information about the error. |
| `caused_by` | _Optional_ | Object |  |
| `reason` | _Optional_ | String | A human-readable explanation of the error, in English. |
| `root_cause` | _Optional_ | Array of Objects |  |
| `stack_trace` | _Optional_ | String | The server stack trace, present only if the `error_trace=true` parameter was sent with the request. |
| `suppressed` | _Optional_ | Array of Objects |  |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>root_cause</code> > <code>suppressed</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

Any additional information about the error.

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>root_cause</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

Any additional information about the error.

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>suppressed</code>
  </summary>
  {: .text-delta}

`suppressed` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | The type of error. |
| `-- freeform field --` | _Optional_ | Object | Any additional information about the error. |
| `caused_by` | _Optional_ | Object |  |
| `reason` | _Optional_ | String | A human-readable explanation of the error, in English. |
| `root_cause` | _Optional_ | Array of Objects |  |
| `stack_trace` | _Optional_ | String | The server stack trace, present only if the `error_trace=true` parameter was sent with the request. |
| `suppressed` | _Optional_ | Array of Objects |  |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

Any additional information about the error.

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>root_cause</code>
  </summary>
  {: .text-delta}

`root_cause` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | The type of error. |
| `-- freeform field --` | _Optional_ | Object | Any additional information about the error. |
| `caused_by` | _Optional_ | Object |  |
| `reason` | _Optional_ | String | A human-readable explanation of the error, in English. |
| `root_cause` | _Optional_ | Array of Objects |  |
| `stack_trace` | _Optional_ | String | The server stack trace, present only if the `error_trace=true` parameter was sent with the request. |
| `suppressed` | _Optional_ | Array of Objects |  |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>suppressed</code>
  </summary>
  {: .text-delta}

`suppressed` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `type` | **Required** | String | The type of error. |
| `-- freeform field --` | _Optional_ | Object | Any additional information about the error. |
| `caused_by` | _Optional_ | Object |  |
| `reason` | _Optional_ | String | A human-readable explanation of the error, in English. |
| `root_cause` | _Optional_ | Array of Objects |  |
| `stack_trace` | _Optional_ | String | The server stack trace, present only if the `error_trace=true` parameter was sent with the request. |
| `suppressed` | _Optional_ | Array of Objects |  |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

Any additional information about the error.

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.create::response_body">
  <summary>
    Response body fields: <code>snapshot</code> > <code>start_time</code>
  </summary>
  {: .text-delta}

A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation.

`start_time` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<!-- spec_insert_end -->

## Example requests

### Request without a body

The following request creates a snapshot called `my-first-snapshot` in an S3 repository called `my-s3-repository`. A request body is not included because it is optional.

```json
POST _snapshot/my-s3-repository/my-first-snapshot
```
{% include copy-curl.html %}

### Request with a body

You can also add a request body to include or exclude certain indices or specify other settings:

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

Upon success, the response content depends on whether you include the `wait_for_completion` query parameter.

##### `wait_for_completion` not included

```json
{
  "accepted": true
}
```

To verify that the snapshot was created, use the [Get snapshot]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot) API, passing the snapshot name as the `snapshot` path parameter.
{: .note}

### `wait_for_completion` included

The snapshot definition is returned.

```json
{
  "snapshot" : {
    "snapshot" : "5",
    "uuid" : "ZRH4Zv7cSnuYev2JpLMJGw",
    "version_id" : 136217927,
    "version" : "2.0.1",
    "indices" : [
      ".opendistro-reports-instances",
      ".opensearch-observability",
      ".kibana_1",
      "opensearch_dashboards_sample_data_flights",
      ".opensearch-notifications-config",
      ".opendistro-reports-definitions",
      "shakespeare"
    ],
    "data_streams" : [ ],
    "include_global_state" : true,
    "state" : "SUCCESS",
    "start_time" : "2022-08-10T16:52:15.277Z",
    "start_time_in_millis" : 1660150335277,
    "end_time" : "2022-08-10T16:52:18.699Z",
    "end_time_in_millis" : 1660150338699,
    "duration_in_millis" : 3422,
    "failures" : [ ],
    "shards" : {
      "total" : 7,
      "failed" : 0,
      "successful" : 7
    }
  }
}
```

## Response body fields

| Field | Data type | Description |
| :--- | :--- | :--- | 
| snapshot | string | Snapshot name. |
| uuid | string | Snapshot's universally unique identifier (UUID). |
| version_id | int | Build ID of the Open Search version that created the snapshot. |
| version | float | Open Search version that created the snapshot. |
| indices | array | Indices in the snapshot. |
| data_streams | array | Data streams in the snapshot. |
| include_global_state | boolean | Whether the current cluster state is included in the snapshot. |
| start_time | string | Date/time when the snapshot creation process began. |
| start_time_in_millis | long | Time (in milliseconds) when the snapshot creation process began. |
| end_time | string | Date/time when the snapshot creation process ended. |
| end_time_in_millis | long | Time (in milliseconds) when the snapshot creation process ended. |
| duration_in_millis | long | Total time (in milliseconds) that the snapshot creation process lasted. |
| failures | array | Failures, if any, that occured during snapshot creation. |
| shards | object | Total number of shards created along with number of successful and failed shards. |
| state | string | Snapshot status. Possible values: `IN_PROGRESS`, `SUCCESS`, `FAILED`, `PARTIAL`. |
| remote_store_index_shallow_copy | Boolean | Whether the snapshots of the remote store indexes is captured as a shallow copy. Default is `false`. |
| pinned_timestamp | long      | A timestamp (in milliseconds) pinned by the snapshot for the implicit locking of remote store files referenced by the snapshot. |