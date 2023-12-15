---
layout: default
title: Snapshot management API
parent: Snapshots
nav_order: 30
has_children: false
grand_parent: Availability and recovery
redirect_from: 
  - /opensearch/snapshots/sm-api/
---

# Snapshot Management API

Use the snapshot management (SM) API to automate [taking snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#take-snapshots). 

---

#### Table of contents
- TOC
{:toc}


---

## Create or update a policy
Introduced 2.1
{: .label .label-purple }

Creates or updates an SM policy.

#### Request

Create:

```json
POST _plugins/_sm/policies/<policy_name> 
```

Update:

```json
PUT _plugins/_sm/policies/<policy_name>?if_seq_no=0&if_primary_term=1
```

You must provide the `seq_no` and `primary_term` parameters for an update request.

### Example

```json
POST _plugins/_sm/policies/daily-policy
{
  "description": "Daily snapshot policy",
  "creation": {
    "schedule": {
      "cron": {
        "expression": "0 8 * * *",
        "timezone": "UTC"
      }
    },
    "time_limit": "1h"
  },
  "deletion": {
    "schedule": {
      "cron": {
        "expression": "0 1 * * *",
        "timezone": "America/Los_Angeles"
      }
    },
    "condition": {
      "max_age": "7d",
      "max_count": 21,
      "min_count": 7
    },
    "time_limit": "1h"
  },
  "snapshot_config": {
    "date_format": "yyyy-MM-dd-HH:mm",
    "timezone": "America/Los_Angeles",
    "indices": "*",
    "repository": "s3-repo",
    "ignore_unavailable": "true",
    "include_global_state": "false",
    "partial": "true",
    "metadata": {
      "any_key": "any_value"
    }
  },
  "notification": {
    "channel": {
      "id": "NC3OpoEBzEoHMX183R3f"
    },
    "conditions": {
      "creation": true,
      "deletion": false,
      "failure": false,
      "time_limit_exceeded": false
    }
  }
}
```

### Response

```json
{
  "_id" : "daily-policy-sm-policy",
  "_version" : 5,
  "_seq_no" : 54983,
  "_primary_term" : 21,
  "sm_policy" : {
    "name" : "daily-policy",
    "description" : "Daily snapshot policy",
    "schema_version" : 15,
    "creation" : {
      "schedule" : {
        "cron" : {
          "expression" : "0 8 * * *",
          "timezone" : "UTC"
        }
      },
      "time_limit" : "1h"
    },
    "deletion" : {
      "schedule" : {
        "cron" : {
          "expression" : "0 1 * * *",
          "timezone" : "America/Los_Angeles"
        }
      },
      "condition" : {
        "max_age" : "7d",
        "min_count" : 7,
        "max_count" : 21
      },
      "time_limit" : "1h"
    },
    "snapshot_config" : {
      "indices" : "*",
      "metadata" : {
        "any_key" : "any_value"
      },
      "ignore_unavailable" : "true",
      "timezone" : "America/Los_Angeles",
      "include_global_state" : "false",
      "date_format" : "yyyy-MM-dd-HH:mm",
      "repository" : "s3-repo",
      "partial" : "true"
    },
    "schedule" : {
      "interval" : {
        "start_time" : 1656425122909,
        "period" : 1,
        "unit" : "Minutes"
      }
    },
    "enabled" : true,
    "last_updated_time" : 1656425122909,
    "enabled_time" : 1656425122909,
    "notification" : {
      "channel" : {
        "id" : "NC3OpoEBzEoHMX183R3f"
      },
      "conditions" : {
        "creation" : true,
        "deletion" : false,
        "failure" : false,
        "time_limit_exceeded" : false
      }
    }
  }
}
```

### Parameters

You can specify the following parameters to create/update an SM policy.

Parameter | Type | Description 
:--- | :--- |:--- |:--- |
`description` | String | The description of the SM policy. Optional.
`enabled` | Boolean | Should this SM policy be enabled at creation? Optional.
`snapshot_config` | Object | The configuration options for snapshot creation. Required.
`snapshot_config.date_format` | String | Snapshot names have the format `<policy_name>-<date>-<random number>`. `date_format` specifies the format for the date in the snapshot name. Supports all date formats supported by OpenSearch. Optional. Default is "yyyy-MM-dd'T'HH:mm:ss".
`snapshot_config.date_format_timezone` | String | Snapshot names have the format `<policy_name>-<date>-<random number>`. `date_format_timezone` specifies the time zone for the date in the snapshot name. Optional. Default is UTC.
`snapshot_config.indices` | String | The names of the indexes in the snapshot. Multiple index names are separated by `,`. Supports wildcards (`*`). Optional. Default is `*` (all indexes).
`snapshot_config.repository` | String | The repository in which to store snapshots. Required.
`snapshot_config.ignore_unavailable` | Boolean | Do you want to ignore unavailable indexes? Optional. Default is `false`.
`snapshot_config.include_global_state` | Boolean | Do you want to include cluster state? Optional. Default is `true` because of [Security plugin considerations]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore#security-considerations).
`snapshot_config.partial` | Boolean | Do you want to allow partial snapshots? Optional. Default is `false`.
`snapshot_config.metadata` | Object | Metadata in the form of key/value pairs. Optional.
`creation` | Object | Configuration for snapshot creation. Required.
`creation.schedule` | String | The cron schedule used to create snapshots. Required.
`creation.time_limit` | String | Sets the maximum time to wait for snapshot creation to finish. If time_limit is longer than the scheduled time interval for taking snapshots, no scheduled snapshots are taken until time_limit elapses. For example, if time_limit is set to 35 minutes and snapshots are taken every 30 minutes starting at midnight, the snapshots at 00:00 and 01:00 are taken, but the snapshot at 00:30 is skipped. Optional. 
`deletion` | Object | Configuration for snapshot deletion. Optional. Default is to retain all snapshots.
`deletion.schedule` | String | The cron schedule used to delete snapshots. Optional. Default is to use `creation.schedule`, which is required.
`deletion.time_limit` | String | Sets the maximum time to wait for snapshot deletion to finish. Optional. 
`deletion.delete_condition` | Object | Conditions for snapshot deletion. Optional. 
`deletion.delete_condition.max_count` | Integer | The maximum number of snapshots to be retained. Optional.
`deletion.delete_condition.max_age` | String | The maximum time a snapshot is retained. Optional.
`deletion.delete_condition.min_count` | Integer | The minimum number of snapshots to be retained. Optional. Default is one.
`notification` | Object | Defines notifications for SM events. Optional.
`notification.channel` | Object | Defines a channel for notifications. You must [create and configure a notification channel]({{site.url}}{{site.baseurl}}/notifications-plugin/api) before setting up SM notifications. Required.
`notification.channel.id` | String | The channel ID of the channel used for notifications. To get the channel IDs of all created channels, use `GET _plugins/_notifications/configs`. Required.
`notification.conditions` | Object | SM events you want to be notified about. Set the ones you are interested in to `true`.
`notification.conditions.creation` | Boolean | Do you want notifications about snapshot creation? Optional. Default is `true`.
`notification.conditions.deletion` | Boolean | Do you want notifications about snapshot deletion? Optional. Default is `false`.
`notification.conditions.failure` | Boolean | Do you want notifications about creation or deletion failure? Optional. Default is `false`.
`notification.conditions.time_limit_exceeded` | Boolean | Do you want notifications when snapshot operations take longer than time_limit? Optional. Default is `false`.

## Get policies
Introduced 2.1
{: .label .label-purple }

Gets SM policies.

#### Request

Get all SM policies:

```json
GET _plugins/_sm/policies
```
You can use a [query string]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) and specify pagination, the field to be sorted by, and sort order:

```json
GET _plugins/_sm/policies?from=0&size=20&sortField=sm_policy.name&sortOrder=desc&queryString=*
```

Get a specific SM policy:

```
GET _plugins/_sm/policies/<policy_name>
```

### Example

```json
GET _plugins/_sm/policies/daily-policy
```

### Response

```json
{
  "_id" : "daily-policy-sm-policy",
  "_version" : 6,
  "_seq_no" : 44696,
  "_primary_term" : 19,
  "sm_policy" : {
    "name" : "daily-policy",
    "description" : "Daily snapshot policy",
    "schema_version" : 15,
    "creation" : {
      "schedule" : {
        "cron" : {
          "expression" : "0 8 * * *",
          "timezone" : "UTC"
        }
      },
      "time_limit" : "1h"
    },
    "deletion" : {
      "schedule" : {
        "cron" : {
          "expression" : "0 1 * * *",
          "timezone" : "America/Los_Angeles"
        }
      },
      "condition" : {
        "max_age" : "7d",
        "min_count" : 7,
        "max_count" : 21
      },
      "time_limit" : "1h"
    },
    "snapshot_config" : {
      "metadata" : {
        "any_key" : "any_value"
      },
      "ignore_unavailable" : "true",
      "include_global_state" : "false",
      "date_format" : "yyyy-MM-dd-HH:mm",
      "repository" : "s3-repo",
      "partial" : "true"
    },
    "schedule" : {
      "interval" : {
        "start_time" : 1656341042874,
        "period" : 1,
        "unit" : "Minutes"
      }
    },
    "enabled" : true,
    "last_updated_time" : 1656341042874,
    "enabled_time" : 1656341042874
  }
}
```

## Explain
Introduced 2.1
{: .label .label-purple }

Provides the enabled/disabled status and the metadata for all policies specified. Multiple policy names are separated with `,`. You can also specify desired policies with a wildcard pattern. 

<img src="{{site.url}}{{site.baseurl}}/images/sm-state-machine.png" alt="SM State Machine" width="150" style="float: left; margin-right: 15px;"/>

SM uses a state machine for snapshot creation and deletion. The image on the left shows one execution period of the creation workflow, from the CREATION_START state to the CREATION_FINISHED state. Deletion workflow follows the same pattern as creation workflow. 

The creation workflow starts in the CREATION_START state and continuously checks if the conditions in the creation cron schedule are met. After the conditions are met, the creation workflow switches to the CREATION_CONDITION_MET state and continues to the CREATING state. The CREATING state calls the create snapshot API asynchronously and then waits for snapshot creation to end in the CREATION_FINISHED state. Once snapshot creation ends, the creation workflow goes back to the CREATION_START state, and the cycle continues. The `current_state` field of `metadata.creation` and `metadata.deletion` returns the current state of the state machine.

#### Request

```json
GET _plugins/_sm/policies/<policy_names>/_explain
```

### Example

```json
GET _plugins/_sm/policies/daily*/_explain
```

### Response

```json
{
  "policies" : [
    {
      "name" : "daily-policy",
      "creation" : {
        "current_state" : "CREATION_START",
        "trigger" : {
          "time" : 1656403200000
        }
      },
      "deletion" : {
        "current_state" : "DELETION_START",
        "trigger" : {
          "time" : 1656403200000
        }
      },
      "policy_seq_no" : 44696,
      "policy_primary_term" : 19,
      "enabled" : true
    }
  ]
}
```

The following table lists all fields for each policy in the response.

Field | Description 
:--- |:--- 
`name` | The name of the SM policy.
`creation` | Information about the latest creation operation. See subfields below.
`deletion` | Information about the latest deletion operation. See subfields below.
`policy_seq_no` <br> `policy_primary_term` | The version of the SM policy.
`enabled` | Is the policy running?

The following table lists all fields in the `creation` and `deletion` objects of each policy.

Field | Description 
:--- |:--- 
`current_state` | The current state of the state machine that runs snapshot creation/deletion as described above.
`trigger.time` | The next creation/deletion execution time in milliseconds since the epoch.
`latest_execution` | Describes the latest creation/deletion execution.
`latest_execution.status` | The execution status of the latest creation/deletion. Possible values are:<br> `IN_PROGRESS`: Snapshot creation/deletion has started. <br> `SUCCESS`: Snapshot creation/deletion has finished successfully. <br> `RETRYING`: The creation/deletion attempt has failed. It will be retried three times. <br> `FAILED`: The creation/deletion attempt failed after three retries. End the current execution period and go to the next execution period. <br> `TIME_LIMIT_EXCEEDED`: The creation/deletion time exceeded the time_limit set in the policy. End the current execution period and go to the next execution period.
`latest_execution.start_time` | The start time of the latest execution in milliseconds since the epoch.
`latest_execution.end_time` | The end time of the latest execution in milliseconds since the epoch.
`latest_execution.info.message` | A user-friendly message describing the status of the latest execution.
`latest_execution.info.cause` | Contains the failure reason if the latest execution fails.
`retry.count` | The number of remaining execution retry attempts.


## Start a policy
Introduced 2.1
{: .label .label-purple }

Starts the policy by setting its `enabled` flag to `true`. 

#### Request

```json
POST  _plugins/_sm/policies/<policy_name>/_start
```

### Example

```json
POST  _plugins/_sm/policies/daily-policy/_start
```

### Response

```json
{
  "acknowledged" : true
}
```

## Stop a policy
Introduced 2.1
{: .label .label-purple }

Sets the `enabled` flag to `false` for an SM policy. The policy will not run until you [start](#start-a-policy) it.

#### Request

```json
POST  _plugins/_sm/policies/<policy_name>/_stop
```

### Example

```json
POST  _plugins/_sm/policies/daily-policy/_stop
```

### Response

```json
{
  "acknowledged" : true
}
```

## Delete a policy
Introduced 2.1
{: .label .label-purple }

Deletes the specified SM policy.

#### Request

```json
DELETE  _plugins/_sm/policies/<policy_name>
```

### Example

```json
DELETE _plugins/_sm/policies/daily-policy
```

### Response

```json
{
  "_index" : ".opendistro-ism-config",
  "_id" : "daily-policy-sm-policy",
  "_version" : 8,
  "result" : "deleted",
  "forced_refresh" : true,
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "_seq_no" : 45366,
  "_primary_term" : 20
}
```