---
layout: default
title: Create Snapshot
parent: Snapshot APIs
grand_parent: REST API reference
nav_order: 10
---

## Create snapshot

Creates a new snapshot within an existing repository.

* To learn more about snapshots, see [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index).

* To view a list of your repositories, see [cat repositories]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/cat-repositories).

* To view a list of your snapsonts, see [cat snapshots]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/cat-snapshots).

### Path parameters

Parameter | Data Type | Description
:--- | :--- | :---
repository | String | Repostory name to contain the snapsnot. |
snapshot | String | Name of Snapshot to create. |

### Query parameters

Parameter | Data Type | Description
:--- | :--- | :---
wait_for_completion | Boolean |  Whether to wait for snapshot creation to complete before continuing. If you include this parameter, the snapshot definition is returned after completion. |

#### Sample requests

You can create snapshots with `POST` or `PUT`. Both HTTP methods are for creation only. If you attempt to use `PUT` to update a snapshot, a `400 Bad Request` is returned along with a message indicating that the snapshot already exists.
{: .note}

The following requests create a snapsnot called `my-first-snapshot` in the `my-s3-repository` repository.

`POST _snapshot/my-s3-repository/my-first-snapshot`

`PUT _snapshot/my-s3-repository/my-first-snapshot`

#### Sample responses

Upon success, the response returns the following JSON object if you do not include the `wait_for_completion` query parameter:

```json
{
  "accepted": true
}
```
If you include the `wait_for_completion` query parameter, the response returns the snapshot definition:

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


### Request body

The request body is optional.

Parameter | Data Type | Description
:--- | :--- | :---
`indices` | String | The indices you want to include in the snapshot. You can use `,` to create a list of indices, `*` to specify an index pattern, and `-` to exclude certain indices. Don't put spaces between items. Default is all indices.
`ignore_unavailable` | Boolean | If an index from the `indices` list doesn't exist, whether to ignore it rather than fail the snapshot. Default is false.
`include_global_state` | Boolean | Whether to include cluster state in the snapshot. Default is true.
`partial` | Boolean | Whether to allow partial snapshots. Default is false, which fails the entire snapshot if one or more shards fails to store.

### Sample requests

#### Request without a body

The following request creates a snapshoted called `my-first-snapshot` in an S3 repository called `my-s3-repository`. A request body is not included because it is optional.

```json
POST _snapshot/my-s3-repository/my-first-snapshot
```

#### Request with a body

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

#### Request with a query parameter

```json
PUT _snapshot/my-s3-repository/3?wait_for_completion=true
```