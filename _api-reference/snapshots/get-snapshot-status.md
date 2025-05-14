---
layout: default
title: Get snapshot status
parent: Snapshot APIs
nav_order: 8
---

# Get snapshot status
**Introduced 1.0**
{: .label .label-purple }

The Get Snapshot Status API returns detailed information about a snapshot's state during and after snapshot creation. This API is useful for monitoring snapshot progress and troubleshooting issues.

For information about creating snapshots, see [Create Snapshot]({{site.url}}{{site.baseurl}}/api-reference/snapshots/create-snapshot/).

If you use the Security plugin, you must have the `monitor_snapshot`, `create_snapshot`, or `manage cluster` privileges.
{: .note}


<!-- spec_insert_start
api: snapshot.status
component: endpoints
-->
## Endpoints
```json
GET /_snapshot/_status
GET /_snapshot/{repository}/_status
GET /_snapshot/{repository}/{snapshot}/_status
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: snapshot.status
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `repository` | String | The name of the repository containing the snapshot. |
| `snapshot` | List or String | A comma-separated list of snapshot names. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.status
component: query_parameters
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |
| `ignore_unavailable` | Boolean | Whether to ignore any unavailable snapshots, When `false`, a `SnapshotMissingException` is thrown. _(Default: `false`)_ |

<!-- spec_insert_end -->

## Example request

The following request returns the status of `my-first-snapshot` in the `my-opensearch-repo` repository. Unavailable snapshots are ignored.

````json
GET _snapshot/my-opensearch-repo/my-first-snapshot/_status
{
   "ignore_unavailable": true 
}
````
{% include copy-curl.html %}

## Example response

The following response shows detailed information about the snapshot's status:

```json
{
  "snapshots": [
    {
      "snapshot": "my-first-snapshot",
      "repository": "my-opensearch-repo",
      "uuid": "dCK4Qth-TymRQ7Tu7Iga0g",
      "state": "SUCCESS",
      "include_global_state": true,
      "shards_stats": {
        "initializing": 0,
        "started": 0,
        "finalizing": 0,
        "done": 7,
        "failed": 0,
        "total": 7
      },
      "stats": {
        "incremental": {
          "file_count": 31,
          "size_in_bytes": 24488927
        },
        "total": {
          "file_count": 31,
          "size_in_bytes": 24488927
        },
        "start_time_in_millis": 1660666841667,
        "time_in_millis": 14054
      },
      "indices": {
        ".opensearch-observability": {
          "shards_stats": {
            "initializing": 0,
            "started": 0,
            "finalizing": 0,
            "done": 1,
            "failed": 0,
            "total": 1
          },
          "stats": {
            "incremental": {
              "file_count": 1,
              "size_in_bytes": 208
            },
            "total": {
              "file_count": 1,
              "size_in_bytes": 208
            },
            "start_time_in_millis": 1660666841868,
            "time_in_millis": 201
          },
          "shards": {
            "0": {
              "stage": "DONE",
              "stats": {
                "incremental": {
                  "file_count": 1,
                  "size_in_bytes": 208
                },
                "total": {
                  "file_count": 1,
                  "size_in_bytes": 208
                },
                "start_time_in_millis": 1660666841868,
                "time_in_millis": 201
              }
            }
          }
        }
        // Additional indices data omitted for brevity
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
| `state` | String | The current state of the snapshot. Possible values include `IN_PROGRESS`, `SUCCESS`, `FAILED`, and `PARTIAL`. |
| `include_global_state` | Boolean | Whether the snapshot includes the cluster state. |
| `shards_stats` | Object | Statistics about snapshot shards. |
| `stats` | Object | Detailed statistics about the snapshot. |
| `indices` | Object | Status of indexes included in the snapshot. |

<details markdown="block">
  <summary>
    Shard stats fields
  </summary>
  {: .text-delta}

The `shards_stats` object contains the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `initializing` | Integer | The number of shards in the initial stage of being stored in the repository. |
| `started` | Integer | The number of shards that have started but not completed storing data. |
| `finalizing` | Integer | The number of shards in the finalizing stage of being stored. |
| `done` | Integer | The number of shards successfully stored in the repository. |
| `failed` | Integer | The number of shards that failed to be stored in the repository. |
| `total` | Integer | The total number of shards in the snapshot. |

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



