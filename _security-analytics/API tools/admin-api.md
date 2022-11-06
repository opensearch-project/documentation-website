---
layout: default
title: Management APIs
parent: API tools
nav_order: 90
---

# Management APIs

The following APIs can be used for a range of tasks from creating detectors and custom rules to getting and updating mappings.

## Create detector

Creates a new detector.

```json
POST _plugins/_security_analytics/detectors
```

### Parameters

You can specify the following parameters to create a detector.

Parameter | Type | Description 
:--- | :--- |:--- |:--- |
`enabled` | Boolean | Enables the ability to add detectors through the API.
`type` | String | The type is specified as "detector".
`detector_type` | Object | The configuration options for snapshot creation. Required.
`schedule`<br>&nbsp;&nbsp;&nbsp;&nbsp;`period`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`interval` | Integer | The duration of the period expressed as a number.
`schedule`<br>&nbsp;&nbsp;&nbsp;&nbsp;`period`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`unit` | String | The unit of measure for the interval. 



`snapshot_config`<br>&nbsp;&nbsp;&nbsp;&nbsp;`date_format` | String | Snapshot names have the format `<policy_name>-<date>-<random number>`. `date_format` specifies the format for the date in the snapshot name. Supports all date formats supported by OpenSearch. Optional. Default is "yyyy-MM-dd'T'HH:mm:ss".
`snapshot_config`<br>&nbsp;&nbsp;&nbsp;&nbsp;`date_format_timezone` | String | Snapshot names have the format `<policy_name>-<date>-<random number>`. `date_format_timezone` specifies the time zone for the date in the snapshot name. Optional. Default is UTC.
`snapshot_config`<br>&nbsp;&nbsp;&nbsp;&nbsp;`indices` | String | The names of the indexes in the snapshot. Multiple index names are separated by `,`. Supports wildcards (`*`). Optional. Default is `*` (all indexes).
`snapshot_config`<br>&nbsp;&nbsp;&nbsp;&nbsp;`repository` | String | The repository in which to store snapshots. Required.
`snapshot_config`<br>&nbsp;&nbsp;&nbsp;&nbsp;`ignore_unavailable` | Boolean | Do you want to ignore unavailable indexes? Optional. Default is `false`.
`snapshot_config`<br>&nbsp;&nbsp;&nbsp;&nbsp;`include_global_state` | Boolean | Do you want to include cluster state? Optional. Default is `true` because of [Security plugin considerations]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore/#security-plugin-considerations).
`snapshot_config`<br>&nbsp;&nbsp;&nbsp;&nbsp;`partial` | Boolean | Do you want to allow partial snapshots? Optional. Default is `false`.
`snapshot_config`<br>&nbsp;&nbsp;&nbsp;&nbsp;`metadata` | Object | Metadata in the form of key/value pairs. Optional.
`creation` | Object | Configuration for snapshot creation. Required.
`creation`<br>&nbsp;&nbsp;&nbsp;&nbsp;`schedule` | String | The cron schedule used to create snapshots. Required.
`creation`<br>&nbsp;&nbsp;&nbsp;&nbsp;`time_limit` | String | Sets the maximum time to wait for snapshot creation to finish. If time_limit is longer than the scheduled time interval for taking snapshots, no scheduled snapshots are taken until time_limit elapses. For example, if time_limit is set to 35 minutes and snapshots are taken every 30 minutes starting at midnight, the snapshots at 00:00 and 01:00 are taken, but the snapshot at 00:30 is skipped. Optional. 
`deletion` | Object | Configuration for snapshot deletion. Optional. Default is to retain all snapshots.
`deletion`<br>&nbsp;&nbsp;&nbsp;&nbsp;`schedule` | String | The cron schedule used to delete snapshots. Optional. Default is to use `creation.schedule`, which is required.
`deletion`<br>&nbsp;&nbsp;&nbsp;&nbsp;`time_limit` | String | Sets the maximum time to wait for snapshot deletion to finish. Optional. 
`deletion`<br>&nbsp;&nbsp;&nbsp;&nbsp;`delete_condition` | Object | Conditions for snapshot deletion. Optional. 
`deletion`<br>&nbsp;&nbsp;&nbsp;&nbsp;`delete_condition`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`max_count` | Integer | The maximum number of snapshots to be retained. Optional.
`deletion`<br>&nbsp;&nbsp;&nbsp;&nbsp;`delete_condition`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`max_age` | String | The maximum time a snapshot is retained. Optional.
`deletion`<br>&nbsp;&nbsp;&nbsp;&nbsp;`delete_condition`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`min_count` | Integer | The minimum number of snapshots to be retained. Optional. Default is one.
`notification` | Object | Defines notifications for SM events. Optional.
`notification`<br>&nbsp;&nbsp;&nbsp;&nbsp;`channel` | Object | Defines a channel for notifications. You must [create and configure a notification channel]({{site.url}}{{site.baseurl}}/notifications-plugin/api) before setting up SM notifications. Required.
`notification`<br>&nbsp;&nbsp;&nbsp;&nbsp;`channel`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`id` | String | The channel ID of the channel used for notifications. To get the channel IDs of all created channels, use `GET _plugins/_notifications/configs`. Required.
`notification`<br>&nbsp;&nbsp;&nbsp;&nbsp;`conditions` | Object | SM events you want to be notified about. Set the ones you are interested in to `true`.
`notification`<br>&nbsp;&nbsp;&nbsp;&nbsp;`conditions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`creation` | Boolean | Do you want notifications about snapshot creation? Optional. Default is `true`.
`notification`<br>&nbsp;&nbsp;&nbsp;&nbsp;`conditions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`deletion` | Boolean | Do you want notifications about snapshot deletion? Optional. Default is `false`.
`notification`<br>&nbsp;&nbsp;&nbsp;&nbsp;`conditions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`failure` | Boolean | Do you want notifications about creation or deletion failure? Optional. Default is `false`.
`notification`<br>&nbsp;&nbsp;&nbsp;&nbsp;`conditions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`time_limit_exceeded` | Boolean | Do you want notifications when snapshot operations take longer than time_limit? Optional. Default is `false`.





## Update detector

## Delete detector

## Get detector

## Search detector

## Create custom rule

## Update custom rule (not forced)

## Update custom rule (forced)

## Search pre-packaged rules

## Search custom rules

## Delete custom rule (not forced)

## Delete custom rule (forced)

## Get mappings view

## Create mappings

## Get mappings

## Update mappings

## Get alerts

See issue 55  details

## Get findings

## Acknowledge alerts



