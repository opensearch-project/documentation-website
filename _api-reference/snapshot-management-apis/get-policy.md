---
layout: default
title: Get Snapshot Policy API
parent: Snapshot Management APIs
nav_order: 20
---

# Get Snapshot Policy API
**Introduced 2.4**
{: .label .label-purple }

The Get Snapshot Policy API retrieves the configuration details of an existing snapshot management policy. This API is useful for verifying policy settings, auditing snapshot configurations, or getting the current state of a policy before making modifications.

The response includes all policy settings, including creation and deletion schedules, notification configurations, and system-generated metadata such as the last time the policy was enabled or updated. You can use this information to understand how a policy is configured and when it was last modified.

## Endpoints

```json
GET /_plugins/_sm/policies/{policy_name}
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `policy_name` | **Required** | String | The name of the snapshot management policy to retrieve. |

## Example request

```bash
GET /_plugins/_sm/policies/daily-snapshots
```
{% include copy-curl.html %}

## Example response

```json
{
  "_id": "daily-snapshots",
  "_version": 1,
  "_primary_term": 1,
  "_seq_no": 0,
  "sm_policy": {
    "name": "daily-snapshots",
    "description": "Takes daily snapshots of all indexes",
    "enabled": true,
    "enabled_time": 1683849600000,
    "last_updated_time": 1683849600000,
    "schema_version": 1,
    "creation": {
      "schedule": {
        "cron": {
          "expression": "0 0 * * *",
          "timezone": "UTC"
        }
      },
      "time_limit": "1h"
    },
    "deletion": {
      "schedule": {
        "cron": {
          "expression": "0 1 * * *",
          "timezone": "UTC"
        }
      },
      "condition": {
        "max_age": "30d",
        "max_count": 30,
        "min_count": 5
      },
      "time_limit": "30m"
    },
    "snapshot_config": {
      "repository": "my-backup-repo",
      "indexes": "*",
      "ignore_unavailable": false,
      "include_global_state": true,
      "partial": false,
      "date_format": "yyyy-MM-dd'T'HH:mm:ss",
      "timezone": "UTC"
    },
    "notification": {
      "channel": {
        "id": "my-notification-channel"
      },
      "conditions": {
        "creation": true,
        "deletion": false,
        "failure": true,
        "time_limit_exceeded": true
      }
    }
  }
}
```

## Response body fields

The response body is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | **Required** | String | The unique identifier of the snapshot policy. |
| `_primary_term` | **Required** | Integer | The primary term for optimistic concurrency control. Used for cluster coordination. |
| `_seq_no` | **Required** | Integer | The sequence number for optimistic concurrency control. Used for cluster coordination. |
| `_version` | **Required** | Integer | The internal version number of the policy document. Increments with each update. |
| `sm_policy` | **Required** | Object | The complete snapshot management policy configuration. |

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code>
  </summary>
  {: .text-delta}

The complete snapshot management policy configuration.

`sm_policy` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `creation` | **Required** | Object | The configuration settings for snapshot creation. |
| `description` | **Required** | String | The description of the policy's purpose. |
| `name` | **Required** | String | The name of the snapshot policy. Must match the policy_name path parameter. |
| `snapshot_config` | **Required** | Object | The core configuration settings for snapshot operations. |
| `deletion` | Optional | Object | The configuration settings for automatic snapshot deletion. |
| `enabled` | Optional | Boolean | Whether the policy is currently active and executing. |
| `enabled_time` | Optional | Integer | The unix timestamp (in milliseconds) when the policy was last enabled. |
| `last_updated_time` | Optional | Integer | The unix timestamp (in milliseconds) of the last policy modification. |
| `notification` | Optional | Object | The settings for notification delivery and triggers. |
| `schedule` | Optional | Object | The system-generated schedule metadata for policy execution. |
| `schema_version` | Optional | Integer | The version number of the policy schema format. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>creation</code>
  </summary>
  {: .text-delta}

`creation` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `schedule` | **Required** | Object | Defines when snapshots should be created. |
| `time_limit` | Optional | String | The maximum duration allowed for snapshot creation before timing out, such as `1h`. |

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
| `expression` | **Required** | String | The cron expression that defines when snapshots are created `0 0 * * *` for daily at midnight. |
| `timezone` | **Required** | String | The time zone used for interpreting the cron expression, such as `UTC`. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>deletion</code>
  </summary>
  {: .text-delta}

`deletion` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `condition` | Object | The rules that determine when snapshots should be deleted. |
| `schedule` | Object | When deletion operations should run. |
| `time_limit` | String | Maximum duration allowed for deletion operations before timing out . |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>deletion</code> > <code>condition</code>
  </summary>
  {: .text-delta}

`condition` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `max_age` | String | The maximum age of snapshots to retain (e.g., "30d" for 30 days). Older snapshots are eligible for deletion. |
| `max_count` | Integer | The maximum number of snapshots to retain. When exceeded, older snapshots become eligible for deletion. |
| `min_count` | Integer | The minimum number of snapshots to retain, regardless of age. Prevents deletion if count would drop below this number. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>deletion</code> > <code>schedule</code>
  </summary>
  {: .text-delta}

`schedule` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `cron` | Object | The cron schedule configuration for running deletion operations. This contains the same structure as the creation schedule cron job. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>notification</code>
  </summary>
  {: .text-delta}

`notification` is a JSON object with the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `channel` | Object | The configuration for the notification delivery channel. |
| `conditions` | Object | The settings that determine which events trigger notifications. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>notification</code> > <code>channel</code>
  </summary>
  {: .text-delta}

`channel` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `id` | **Required** | String | The unique identifier of the notification channel to use for sending alerts. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>notification</code> > <code>conditions</code>
  </summary>
  {: .text-delta}

`conditions` is a JSON object with the following fields:

| Property | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `creation` | Boolean | Whether to send notifications for successful snapshot creations. | `true` |
| `deletion` | Boolean | Whether to send notifications for successful snapshot deletions. | `false` |
| `failure` | Boolean | Whether to send notifications for any failed operations. | `false` |
| `time_limit_exceeded` | Boolean | Whether to send notifications when operations exceed their time limits. | `false` |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code> > <code>snapshot_config</code>
  </summary>
  {: .text-delta}

`snapshot_config` is a JSON object with the following fields:

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `repository` | **Required** | String | The name of the repository where snapshots are stored. |
| `date_format` | Optional | String | The format string for the date portion of snapshot names. Default is `yyyy-MM-dd'T'HH:mm:ss`. |
| `ignore_unavailable` | Optional | Boolean | Whether to ignore unavailable indexes during snapshot creation. Default is `false`. |
| `include_global_state` | Optional | Boolean | Whether to include cluster state in snapshots. Default is `true`. |
| `indexes` | Optional | String | Pattern specifying which indexes to include in snapshots. Default is `*`. |
| `metadata` | Optional | Object | The custom metadata attached to snapshots created by this policy. |
| `partial` | Optional | Boolean | Whether to allow partial snapshots if some shards fail. Default is `false`. |
| `timezone` | Optional | String | The time zone for date formatting in snapshot names. Default is `UTC`. |

</details>

