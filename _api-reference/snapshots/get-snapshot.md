---
layout: default
title: Get Snapshot
parent: Snapshot APIs
nav_order: 6
---

# Get snapshot
**Introduced 1.0**
{: .label .label-purple }

The Get Snapshot API retrieves information about one or more snapshots within a repository. This information includes details about snapshot creation, included indexes, and status.

* For more information about snapshots, see [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index/).
* To view a list of your repositories, see [Get Snapshot Repository]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-repository/).


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
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |
| `ignore_unavailable` | Boolean | When `false`, the request returns an error for any snapshots that are unavailable. _(Default: `false`)_ |
| `verbose` | Boolean | When `true`, returns additional information about each snapshot such as the version of OpenSearch which took the snapshot, the start and end times of the snapshot, and the number of shards contained in the snapshot. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.get
component: request_body_parameters
-->
<!-- API snapshot.get does NOT have a request_body_parameters component -->
<!-- spec_insert_end -->



## Example request

The following request retrieves information for the `my-first-snapshot` located in the `my-opensearch-repo` repository:

````json
GET _snapshot/my-opensearch-repo/my-first-snapshot
````
{% include copy-curl.html %}

## Example response

```json
{
  "snapshots": [
    {
      "snapshot": "my-snapshot",
      "uuid": "XYZ4Zv7cSnuYev2JpLMJGw",
      "version_id": 136217927,
      "version": "2.0.1",
      "indices": [
        "index-1",
        "index-2",
        ".opensearch-observability"
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
        "total": 5,
        "failed": 0,
        "successful": 5
      }
    }
  ]
}
```

## Response body fields

The response body is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `snapshots` | **Required** | Array of Objects | Array of snapshot status objects. |

Each snapshot object in the `snapshots` array contains the following information:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `snapshot` | String | The name of the snapshot. |
| `repository` | String | The name of the repository containing the snapshot. |
| `uuid` | String | The universally unique identifier for the snapshot. |
| `version_id` | Integer | The build ID of the OpenSearch version that created the snapshot. |
| `version` | String | The OpenSearch version that created the snapshot. |
| `indices` | Array of Strings | The list of indexes included in the snapshot. |
| `data_streams` | Array of Strings | The list of data streams included in the snapshot. |
| `state` | String | The current state of the snapshot. Possible values include `IN_PROGRESS`, `SUCCESS`, `FAILED`, and `PARTIAL`. |
| `include_global_state` | Boolean | Whether the snapshot includes the cluster state. |
| `start_time` | String | The date and time when the snapshot creation process began. |
| `start_time_in_millis` | Long | The time (in milliseconds) when the snapshot creation process began. |
| `end_time` | String | The date and time when the snapshot creation process ended. |
| `end_time_in_millis` | Long | The time (in milliseconds) when the snapshot creation process ended. |
| `duration_in_millis` | Long | The total time (in milliseconds) that the snapshot creation process lasted. |
| `failures` | Array of Objects | Any failures that occurred during snapshot creation. |
| `shards` | Object | Statistics about the shards included in the snapshot. |

<details markdown="block">
  <summary>
    Shard stats fields
  </summary>
  {: .text-delta}

The `shards` object contains the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `total` | Integer | The total number of shards included in the snapshot. |
| `failed` | Integer | The number of shards that failed to be stored in the repository. |
| `successful` | Integer | The number of shards successfully stored in the repository. |

</details>

<details markdown="block">
  <summary>
    Snapshot statistics fields
  </summary>
  {: .text-delta}

The `stats` object contains the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `incremental` | Object | Statistics about incremental snapshot data, including `file_count` and `size_in_bytes`. |
| `total` | Object | Statistics about total snapshot data, including `file_count` and `size_in_bytes`. |
| `start_time_in_millis` | Integer | The time (in milliseconds) when the snapshot process began. |
| `time_in_millis` | Integer | Total time (in milliseconds) the snapshot process took. |

</details>

<details markdown="block">
  <summary>
    Index details fields
  </summary>
  {: .text-delta}

For each index in the `indices` object, the response includes:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `shards_stats` | Object | Statistics about index shards, including counts for various states. |
| `stats` | Object | Detailed statistics about the index snapshot. |
| `shards` | Object | Information about individual shards, including their stage and statistics. |

</details>
