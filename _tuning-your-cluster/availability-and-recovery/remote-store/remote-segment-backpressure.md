---
layout: default
title: Remote segment backpressure
nav_order: 10
parent: Remote-backed storage
grand_parent: Availability and recovery
---

# Remote segment backpressure

Introduced 2.10
{: .label .label-purple }

Remote segment backpressure is a shard-level rejection mechanism that dynamically rejects indexing requests when the remote segment store falls behind the local committed segments on the primary shard. With remote segment backpressure, you can prevent the lag between the remote store and the local primary store. The lag can be caused by slow or failed remote store interaction, remote store throttling, long garbage collection pauses, or high CPU utilization.

## Thresholds

Remote segment backpressure is activated if any of the following thresholds is breached:

- **Consecutive failure**: The backpressure is activated if there are _N_ or more consecutive failures. The value of _N_ is configurable in `remote_store.segment.pressure.consecutive_failures.limit`.
- **Bytes lag**: The bytes lag is calculated by adding the sizes of all the files that are present in local committed segments but not in the remote store. Backpressure is activated if the bytes lag is greater than _K_ multiplied by the moving average of the size, in bytes, of the files uploaded after each refresh. The variance factor _K_ is configurable in `remote_store.segment.pressure.bytes_lag.variance_factor`. The moving window size is configurable through the `remote_store.moving_average_window_size` setting.
- **Time lag**: The time lag is calculated by comparing the timestamps of the most recent local refresh and the most recent remote store segment upload. Backpressure is activated if the time lag is greater than _K_ multiplied by the moving average of the time taken to upload new segments and metadata files after each refresh. The variance factor _K_ is configurable through the `remote_store.segment.pressure.time_lag.variance_factor` setting. The moving window size is configurable through the `remote_store.moving_average_window_size` setting.  

## Handling segment merges 

At every segment merge, a corresponding refresh is initiated. Because this refresh has new merged segments, the bytes lag instantly spikes. To compensate for this spike, the bytes lag and time lag are evaluated only if the remote store is behind the local primary store by more than one refresh. However, backpressure induced by consecutive failures activates regardless of refresh lag (the number of refreshes by which the remote store is lagging behind the local store).

## Remote segment backpressure settings

Remote segment backpressure adds several settings to the standard OpenSearch cluster settings. The settings are dynamic, so you can change the default backpressure behavior without restarting your cluster. 

The following table lists the settings used for activating backpressure. For threshold calculation, see [Thresholds](#thresholds).

|Setting	|Data type	|Description	|
|:---	|:---	|:---	|
|`remote_store.segment.pressure.enabled`	|Boolean	| If `true`, enables remote segment backpressure. Default is `false`. |
|`remote_store.segment.pressure.consecutive_failures.limit`	|Integer |The minimum consecutive failure count for activating remote segment backpressure. Default is `5`.	|
|`remote_store.segment.pressure.bytes_lag.variance_factor`	|Float | The variance factor that is used together with the moving average to calculate the dynamic bytes lag threshold for activating remote segment backpressure. Default is `10`.	|
|`remote_store.segment.pressure.time_lag.variance_factor`	|Float 	|The variance factor that is used together with the moving average to calculate the dynamic time lag threshold for activating remote segment backpressure. Default is `10`.	|

The following table lists the settings used for statistics.

|Setting	|Data type	|Description	|
|:---	|:---	|:---	|
| `remote_store.moving_average_window_size` | Integer | The moving average window size used to calculate the rolling statistic values exposed through the [Remote Store Stats API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/remote-store-stats-api/). Default is `20`. Minimum enforced is `5`. |

