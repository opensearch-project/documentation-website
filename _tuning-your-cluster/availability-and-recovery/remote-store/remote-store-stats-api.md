---
layout: default
title: Remote Store Stats API 
nav_order: 20
parent: Remote-backed storage
grand_parent: Availability and recovery
---

# Remote Store Stats API
Introduced 2.8
{: .label .label-purple }

Use the Remote Store Stats API to monitor shard-level remote store performance.

## Path and HTTP methods

```json
GET _remotestore/stats/<index_name>
GET _remotestore/stats/<index_name>/<shard_id>
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`index_name` | String | The index name or index pattern.
`shard_id` | String | The shard ID.

## Remote store stats for an index

Use the following API to get remote store statistics for all shards of an index. 

#### Example request

```json
GET _remotestore/stats/<index_name>
```
{% include copy-curl.html %}

#### Example response

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta }

```json
{
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "stats": [
    {
      "shard_id": "[so][1]",
      "refresh_time_lag_in_millis": 0,
      "refresh_lag": 0,
      "bytes_lag": 0,
      "backpressure_rejection_count": 0,
      "consecutive_failure_count": 0,
      "total_remote_refresh": {
        "started": 56,
        "succeeded": 56,
        "failed": 0
      },
      "total_uploads_in_bytes": {
        "started": 1524670599,
        "succeeded": 1524670599,
        "failed": 0
      },
      "remote_refresh_size_in_bytes": {
        "last_successful": 12711179,
        "moving_avg": 30726409
      },
      "upload_latency_in_bytes_per_sec": {
        "moving_avg": 25276841.3
      },
      "remote_refresh_latency_in_millis": {
        "moving_avg": 964.7
      }
    },
    {
      "shard_id": "[so][0]",
      "refresh_time_lag_in_millis": 5727,
      "refresh_lag": 1,
      "bytes_lag": 0,
      "backpressure_rejection_count": 0,
      "consecutive_failure_count": 0,
      "total_remote_refresh": {
        "started": 57,
        "succeeded": 56,
        "failed": 0
      },
      "total_uploads_in_bytes": {
        "started": 1568138701,
        "succeeded": 1568138701,
        "failed": 0
      },
      "remote_refresh_size_in_bytes": {
        "last_successful": 12705142,
        "moving_avg": 32766119.75
      },
      "upload_latency_in_bytes_per_sec": {
        "moving_avg": 25523682.95
      },
      "remote_refresh_latency_in_millis": {
        "moving_avg": 990.55
      }
    }
  ]
}
```
</details>

### Response fields

The following table lists the available response fields. 

|Field	|Description	|
|:---	|:---	|
|`refresh_time_lag_in_millis`	|The time (in milliseconds) the remote refresh is behind the local refresh.	|
|`refresh_lag`	| The number of refreshes by which the remote store is lagging behind the local store.	|
|`bytes_lag`	| The bytes lag between the remote and local store.	|
|`backpressure_rejection_count`	| The total number of write rejections made because of remote store backpressure.	|
|`consecutive_failure_count`	| The number of consecutive remote refresh failures since the last success.	|
|`total_remote_refresh`	|The total number of remote refreshes.	|
|`total_uploads_in_bytes`	| The total number of bytes in all uploads to the remote store. |
|`remote_refresh_size_in_bytes.last_successful`	|The size of data uploaded in the last successful refresh.	|
|`remote_refresh_size_in_bytes.moving_avg`	|The average size of data (in bytes) uploaded in the last _N_ refreshes. _N_ is defined in `remote_store.segment.pressure.upload_bytes_moving_average_window_size`. For details, see [Remote segment backpressure]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/remote-segment-backpressure/).	|
|`upload_latency_in_bytes_per_sec.moving_avg`	|The average speed of remote store uploads (in bytes per second) for the last _N_ uploads. _N_ is defined in `remote_store.segment.pressure.upload_bytes_per_sec_moving_average_window_size`. For details, see [Remote segment backpressure]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/remote-segment-backpressure/).		|
|`remote_refresh_latency_in_millis.moving_avg`	|The average time taken by a single remote refresh during the last _N_ remote refreshes. _N_ is defined in `remote_store.segment.pressure.upload_time_moving_average_window_size`. For details, see [Remote segment backpressure]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/remote-segment-backpressure/).	|

## Remote store stats for a single shard

Use the following API to get remote store statistics for a single shard.

#### Example request

```json
GET _remotestore/stats/<index_name>/<shard_id>
```
{% include copy-curl.html %}

#### Example response

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta }

```json
{
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "stats": [
    {
      "shard_id": "[so][0]",
      "refresh_time_lag_in_millis": 5727,
      "refresh_lag": 1,
      "bytes_lag": 0,
      "backpressure_rejection_count": 0,
      "consecutive_failure_count": 0,
      "total_remote_refresh": {
        "started": 57,
        "succeeded": 56,
        "failed": 0
      },
      "total_uploads_in_bytes": {
        "started": 1568138701,
        "succeeded": 1568138701,
        "failed": 0
      },
      "remote_refresh_size_in_bytes": {
        "last_successful": 12705142,
        "moving_avg": 32766119.75
      },
      "upload_latency_in_bytes_per_sec": {
        "moving_avg": 25523682.95
      },
      "remote_refresh_latency_in_millis": {
        "moving_avg": 990.55
      }
    }
  ]
}
```
</details>

### Remote store stats for a local shard

Provide the `local` query parameter set to `true` to only fetch the shards present on the node that is serving the request:

```json
GET _remotestore/stats/<index_name>?local=true
```
{% include copy-curl.html %}