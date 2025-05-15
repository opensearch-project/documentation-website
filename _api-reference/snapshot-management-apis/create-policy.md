---
layout: default
title: Create Snapshot Policy API
parent: Snapshot Management APIs
nav_order: 10
---

# Create Snapshot Policy API
**Introduced 2.4**
{: .label .label-purple }

The Create Snapshot Policy API allows you to define automated snapshot management policies in OpenSearch. 

Snapshot policies help automate your backups by scheduling regular snapshots and managing their lifecycle. Each policy can specify the following:
- A schedule for creating snapshots using cron expressions.
- Which indexes to include in the snapshots.
- How long to retain snapshots.
- When to delete old snapshots.
- Notification settings for success and failure events.


<!-- spec_insert_start
api: sm.create_policy
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_sm/policies/{policy_name}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: sm.create_policy
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `policy_name` | **Required** | String | The name of the snapshot management policy to create. |

<!-- spec_insert_end -->


## Request body fields

The request body is optional. It is a JSON object with the following fields:

| Property | Required | Data type | Description | Default |
| :--- | :--- | :--- | :--- | :--- |
| `creation` | **Required** | Object | Defines when and how often snapshots should be created. | N/A |
| `snapshot_config` | **Required** | Object | Specifies the snapshot settings, including repository, indices to back up, and other snapshot options. | N/A |
| `deletion` | Optional | Object | Configures automatic cleanup of old snapshots based on age or count conditions. | N/A |
| `description` | Optional | String | A human-readable description of the snapshot policy's purpose. | N/A |
| `enabled` | Optional | Boolean | Whether the policy should start executing upon creation. | `true` |
| `notification` | Optional | Object | Configures when and how to send notifications about snapshot operations. | N/A |

<details markdown="block">
  <summary>
    Request body fields: <code>creation</code>
  </summary>
  {: .text-delta}

The configuration for the snapshot creation schedule.

`creation` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `schedule` | **Required** | Object | Defines when snapshots should be created using a cron schedule. |
| `time_limit` | Optional | String | The maximum amount of time for allowed snapshot creation.  |

</details>

<details markdown="block">
  <summary>
    Request body fields: <code>creation</code> > <code>schedule</code>
  </summary>
  {: .text-delta}

`schedule` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `cron` | Object | Defines the snapshot schedule using cron expressions. Required for creating periodic snapshots. |

</details>

<details markdown="block">
  <summary>
    Request body fields: <code>creation</code> > <code>schedule</code> > <code>cron</code>
  </summary>
  {: .text-delta}

`cron` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `expression` | **Required** | String | The standard cron expression that defines when snapshots should be created, such as `0 0 * * *` for daily at midnight. |
| `timezone` | **Required** | String | The timezone used for interpreting the cron expression such as `UTC`, `America/Los_Angeles`. |

</details>

<details markdown="block">
  <summary>
    Request body fields: <code>deletion</code>
  </summary>
  {: .text-delta}

The configuration for snapshot deletion rules and schedule.

`deletion` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `condition` | Object | Defines the criteria for when snapshots should be deleted. |
| `schedule` | Object | Specifies when the deletion process should run. |
| `time_limit` | String | Maximum time allowed for snapshot deletion operations before timing out (e.g., "30m" for thirty minutes). |

</details>

<details markdown="block">
  <summary>
    Request body fields: <code>deletion</code> > <code>condition</code>
  </summary>
  {: .text-delta}

`condition` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `max_age` | String | The maximum age of snapshots to retain. Older snapshots will be deleted. |
| `max_count` | Integer | The naximum number of snapshots to retain. When exceeded, older snapshots will be deleted. |
| `min_count` | Integer | The minimum number of snapshots to retain, regardless of age. |

</details>

<details markdown="block">
  <summary>
    Request body fields: <code>deletion</code> > <code>schedule</code>
  </summary>
  {: .text-delta}

`schedule` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `cron` | Object | Defines when the deletion process should run using cron expressions. |

</details>

<details markdown="block">
  <summary>
    Request body fields: <code>notification</code>
  </summary>
  {: .text-delta}

The configuration for notification settings and conditions.

`notification` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `channel` | Object | Specifies the notification channel to use for sending alerts. |
| `conditions` | Object | Defines which events should trigger notifications. |

</details>

<details markdown="block">
  <summary>
    Request body fields: <code>notification</code> > <code>channel</code>
  </summary>
  {: .text-delta}

`channel` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The unique identifier of the notification channel to use for sending alerts. |

</details>

<details markdown="block">
  <summary>
    Request body fields: <code>notification</code> > <code>conditions</code>
  </summary>
  {: .text-delta}

`conditions` is a JSON object with the following fields:

| Property | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `creation` | Boolean | Whether to send notifications when snapshots are successfully created. | `true` |
| `deletion` | Boolean | Whether to send notifications when snapshots are successfully deleted. | `false` |
| `failure` | Boolean | Whether to send notifications when snapshot operations fail. | `false` |
| `time_limit_exceeded` | Boolean | Whether to send notifications when operations exceed their configured time limits. | `false` |

</details>

<details markdown="block">
  <summary>
    Request body fields: <code>snapshot_config</code>
  </summary>
  {: .text-delta}

The core configuration for how snapshots should be created and managed.

`snapshot_config` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `repository` | **Required** | String | The name of the repository where snapshots will be stored. |
| `date_format` | Optional | String | Format string for the date portion of snapshot names. Default is `yyyy-MM-dd'T'HH:mm:ss`. |
| `ignore_unavailable` | Optional | Boolean | Whether to ignore unavailable indices during snapshot creation. Default is `false`. |
| `include_global_state` | Optional | Boolean | Whether to include cluster state in snapshots. Default is `true`. |
| `indexes` | Optional | String | Pattern specifying which indices to include in snapshots. Default is `*` (all indexes). |
| `metadata` | Optional | Object | Custom metadata to attach to snapshots. |
| `partial` | Optional | Boolean | Whether to allow partial snapshots if some shards fail. Default is `false`. |
| `timezone` | Optional | String | Timezone for date formatting in snapshot names. Default is `UTC`. |

</details>

## Example request

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
{% include copy-curl.html %}

## Example response

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

## Response body fields

The response body is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | **Required** | String | The unique identifier of the created snapshot policy. |
| `_primary_term` | **Required** | Integer | The primary term used for optimistic concurrency control in distributed systems. |
| `_seq_no` | **Required** | Integer | The sequence number used for optimistic concurrency control in distributed systems. |
| `_version` | **Required** | Integer | The internal version number of the policy document. |
| `sm_policy` | **Required** | Object | The complete snapshot management policy configuration as stored in the system. |

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code>
  </summary>
  {: .text-delta}

The complete snapshot management policy configuration.

`sm_policy` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `creation` | **Required** | Object | The snapshot creation schedule and configuration. |
| `description` | **Required** | String | The user-provided description of the policy. |
| `name` | **Required** | String | The name of the snapshot policy. |
| `snapshot_config` | **Required** | Object | The core snapshot configuration settings. |
| `deletion` | Optional | Object | The configuration for automatic snapshot deletion. |
| `enabled` | Optional | Boolean | Whether the policy is currently active. |
| `enabled_time` | Optional | Integer | Unix timestamp (in milliseconds) when the policy was last enabled. |
| `last_updated_time` | Optional | Integer | Unix timestamp (in milliseconds) when the policy was last modified. |
| `notification` | Optional | Object | The notification settings for the policy. |
| `schedule` | Optional | Object | The system-generated schedule metadata for policy execution. |
| `schema_version` | Optional | Integer | The version of the policy schema being used. |

</details>

## Response body fields

The response body is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | **Required** | String | The unique identifier of the created snapshot policy. |
| `_primary_term` | **Required** | Integer | The primary term used for optimistic concurrency control in distributed systems. |
| `_seq_no` | **Required** | Integer | The sequence number used for optimistic concurrency control in distributed systems. |
| `_version` | **Required** | Integer | The internal version number of the policy document. |
| `sm_policy` | **Required** | Object | The complete snapshot management policy configuration as stored in the system. |

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code>
  </summary>
  {: .text-delta}

The complete snapshot management policy configuration.

`sm_policy` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `creation` | **Required** | Object | The snapshot creation schedule and configuration. |
| `description` | **Required** | String | The user-provided description of the policy. |
| `name` | **Required** | String | The name of the snapshot policy. |
| `snapshot_config` | **Required** | Object | The core snapshot configuration settings. |
| `deletion` | Optional | Object | The configuration for automatic snapshot deletion. |
| `enabled` | Optional | Boolean | Whether the policy is currently active. |
| `enabled_time` | Optional | Integer | The unix timestamp (in milliseconds) when the policy was last enabled. |
| `last_updated_time` | Optional | Integer | The unix timestamp (in milliseconds) when the policy was last modified. |
| `notification` | Optional | Object | The notification settings for the policy. |
| `schedule` | Optional | Object | System-generated schedule metadata for policy execution. |
| `schema_version` | Optional | Integer | The version of the policy schema being used. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>creation</code>
  </summary>
  {: .text-delta}

`creation` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `schedule` | **Required** | Object | The configured schedule for snapshot creation. |
| `time_limit` | Optional | String | The maximum duration allowed for snapshot creation operations before timing out. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>creation</code> > <code>schedule</code>
  </summary>
  {: .text-delta}

`schedule` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `cron` | Object | The cron schedule configuration for snapshot creation. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>creation</code> > <code>schedule</code> > <code>cron</code>
  </summary>
  {: .text-delta}

`cron` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `expression` | **Required** | String | The cron expression defining when snapshots will be created. |
| `timezone` | **Required** | String | The timezone used for interpreting the cron expression. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>deletion</code>
  </summary>
  {: .text-delta}

`deletion` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `condition` | Object | The criteria that determine when snapshots should be deleted. |
| `schedule` | Object | The schedule configuration for running deletion operations. |
| `time_limit` | String | The maximum duration allowed for snapshot deletion operations before timing out. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>deletion</code> > <code>condition</code>
  </summary>
  {: .text-delta}

`condition` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `max_age` | String | The maximum age of snapshots to retain (e.g., "7d", "30d"). |
| `max_count` | Integer | The maximum number of snapshots to keep before deleting older ones. |
| `min_count` | Integer | The minimum number of snapshots to retain regardless of age. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>deletion</code> > <code>schedule</code>
  </summary>
  {: .text-delta}

`schedule` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `cron` | Object | The cron schedule configuration for running deletion operations. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>notification</code>
  </summary>
  {: .text-delta}

`notification` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `channel` | Object | The notification channel configuration for sending alerts. |
| `conditions` | Object | The conditions that trigger notifications. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>notification</code> > <code>channel</code>
  </summary>
  {: .text-delta}

`channel` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The unique identifier of the configured notification channel. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>notification</code> > <code>conditions</code>
  </summary>
  {: .text-delta}

`conditions` is a JSON object with the following fields:

| Property | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `creation` | Boolean | Whether notifications are sent for successful snapshot creations. | `true` |
| `deletion` | Boolean | Whether notifications are sent for successful snapshot deletions. | `false` |
| `failure` | Boolean | Whether notifications are sent for failed operations. | `false` |
| `time_limit_exceeded` | Boolean | Whether notifications are sent when operations exceed time limits. | `false` |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>schedule</code>
  </summary>
  {: .text-delta}

`schedule` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `interval` | Object | System-generated interval settings for policy execution. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>schedule</code> > <code>interval</code>
  </summary>
  {: .text-delta}

`interval` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `period` | **Required** | Integer | The number of time units between policy executions. |
| `start_time` | **Required** | Integer | Unix timestamp (in milliseconds) when the interval schedule begins. |
| `unit` | **Required** | String | The time unit for the interval period (Days, Hours, or Minutes). |

</details>








