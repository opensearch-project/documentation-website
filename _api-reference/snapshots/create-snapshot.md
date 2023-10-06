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

## Path and HTTP methods

```json
PUT /_snapshot/<repository>/<snapshot>
POST /_snapshot/<repository>/<snapshot>
```

## Path parameters

Parameter | Data type | Description
:--- | :--- | :---
repository | String | Repostory name to contain the snapshot. |
snapshot | String | Name of Snapshot to create. |

## Query parameters

Parameter | Data type | Description
:--- | :--- | :---
wait_for_completion | Boolean |  Whether to wait for snapshot creation to complete before continuing. If you include this parameter, the snapshot definition is returned after completion. |

## Request fields

The request body is optional.

Field | Data type | Description
:--- | :--- | :---
`indices` | String | The indices you want to include in the snapshot. You can use `,` to create a list of indices, `*` to specify an index pattern, and `-` to exclude certain indices. Don't put spaces between items. Default is all indices.
`ignore_unavailable` | Boolean | If an index from the `indices` list doesn't exist, whether to ignore it rather than fail the snapshot. Default is false.
`include_global_state` | Boolean | Whether to include cluster state in the snapshot. Default is true.
`partial` | Boolean | Whether to allow partial snapshots. Default is false, which fails the entire snapshot if one or more shards fails to stor

#### Example requests

##### Request without a body

The following request creates a snapshot called `my-first-snapshot` in an S3 repository called `my-s3-repository`. A request body is not included because it is optional.

```json
POST _snapshot/my-s3-repository/my-first-snapshot
```
{% include copy-curl.html %}

##### Request with a body

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

#### Example responses

Upon success, the response content depends on whether you include the `wait_for_completion` query parameter.

##### `wait_for_completion` not included

```json
{
  "accepted": true
}
```

To verify that the snapshot was created, use the [Get snapshot]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot) API, passing the snapshot name as the `snapshot` path parameter.
{: .note}

##### `wait_for_completion` included

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

#### Response fields

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
| remote_store_index_shallow_copy | Boolean | Whether the snapshot of the remote store indexes is captured as a shallow copy. Default is `false`. |