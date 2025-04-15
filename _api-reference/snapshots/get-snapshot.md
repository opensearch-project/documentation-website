---
layout: default
title: Get Snapshot
parent: Snapshot APIs
nav_order: 6
---

# Get snapshot.
**Introduced 1.0**
{: .label .label-purple }

Retrieves information about a snapshot.

## Endpoints

```json
GET _snapshot/<repository>/<snapshot>/
```


<!-- spec_insert_start
api: snapshot.get
component: endpoints
-->
## Endpoints
```json
GET /_snapshot/{repository}/{snapshot}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: snapshot.get
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `repository` | **Required** | String | A comma-separated list of snapshot repository names used to limit the request. Wildcard (*) expressions are supported. |
| `snapshot` | **Required** | List or String | A comma-separated list of snapshot names to retrieve. Also accepts wildcard expressions. (`*`). - To get information about all snapshots in a registered repository, use a wildcard (`*`) or `_all`. - To get information about any snapshots that are currently running, use `_current`. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.get
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |
| `ignore_unavailable` | Boolean | When `false`, the request returns an error for any snapshots that are unavailable. _(Default: `false`)_ |
| `verbose` | Boolean | When `true`, returns additional information about each snapshot such as the version of OpenSearch which took the snapshot, the start and end times of the snapshot, and the number of shards contained in the snapshot. |
| `master_timeout` <br> _DEPRECATED_ | String | _(Deprecated since 2.0: To promote inclusive language, use `cluster_manager_timeout` instead.)_ Period to wait for a connection to the cluster-manager node. If no response is received before the timeout expires, the request fails and returns an error. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.get
component: request_body_parameters
-->
<!-- API snapshot.get does NOT have a request_body_parameters component -->
<!-- spec_insert_end -->


## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| repository | String | The repository that contains the snapshot to retrieve. |
| snapshot | String | Snapshot to retrieve.

## Query parameters

| Parameter | Data type | Description | 
:--- | :--- | :---
| verbose | Boolean | Whether to show all, or just basic snapshot information. If `true`, returns all information. If `false`, omits information like start/end times, failures, and shards. Optional, defaults to `true`.|
| ignore_unavailable | Boolean | How to handle snapshots that are unavailable (corrupted or otherwise temporarily can't be returned). If `true` and the snapshot is unavailable, the request does not return the snapshot. If `false` and the snapshot is unavailable, the request returns an error. Optional, defaults to `false`.|

## Example request

The following request retrieves information for the `my-first-snapshot` located in the `my-opensearch-repo` repository:

````json
GET _snapshot/my-opensearch-repo/my-first-snapshot
````
{% include copy-curl.html %}

## Example response

Upon success, the response returns snapshot information:

````json
{
  "snapshots" : [
    {
      "snapshot" : "my-first-snapshot",
      "uuid" : "3P7Qa-M8RU6l16Od5n7Lxg",
      "version_id" : 136217927,
      "version" : "2.0.1",
      "indices" : [
        ".opensearch-observability",
        ".opendistro-reports-instances",
        ".opensearch-notifications-config",
        "shakespeare",
        ".opendistro-reports-definitions",
        "opensearch_dashboards_sample_data_flights",
        ".kibana_1"
      ],
      "data_streams" : [ ],
      "include_global_state" : true,
      "state" : "SUCCESS",
      "start_time" : "2022-08-11T20:30:00.399Z",
      "start_time_in_millis" : 1660249800399,
      "end_time" : "2022-08-11T20:30:14.851Z",
      "end_time_in_millis" : 1660249814851,
      "duration_in_millis" : 14452,
      "failures" : [ ],
      "shards" : {
        "total" : 7,
        "failed" : 0,
        "successful" : 7
      }
    }
  ]
}
````

<!-- spec_insert_start
api: snapshot.get
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `snapshots` | **Required** | Array of Objects |  |

<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code>
  </summary>
  {: .text-delta}

`snapshots` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

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
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>end_time</code>
  </summary>
  {: .text-delta}

A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation.

`end_time` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>end_time</code>
  </summary>
  {: .text-delta}

A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation.

`end_time` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>end_time</code>
  </summary>
  {: .text-delta}

A date and time, either as a string whose format depends on the context (defaulting to ISO_8601) or the number of milliseconds since the epoch. OpenSearch accepts both as an input but will generally output a string. representation.

`end_time` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>failures</code>
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
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>metadata</code>
  </summary>
  {: .text-delta}

The custom metadata attached to a resource.

`metadata` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object |  |

</details>
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>metadata</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>shards</code>
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
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>shards</code> > <code>failures</code>
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
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>shards</code> > <code>failures</code> > <code>reason</code>
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
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code>
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
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>root_cause</code>
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
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>root_cause</code> > <code>suppressed</code>
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
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>root_cause</code> > <code>suppressed</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

Any additional information about the error.

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>root_cause</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

Any additional information about the error.

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>suppressed</code>
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
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>caused_by</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

Any additional information about the error.

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>root_cause</code>
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
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>suppressed</code>
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
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>shards</code> > <code>failures</code> > <code>reason</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

Any additional information about the error.

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |

</details>
<details markdown="block" name="snapshot.get::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>start_time</code>
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
