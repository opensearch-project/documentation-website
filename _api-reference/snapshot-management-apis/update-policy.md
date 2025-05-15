---
layout: default
title: Update Policy API
parent: Snapshot Management APIs
nav_order: 50
---

# Update Policy API

**Introduced 2.4**
{: .label .label-purple }

The Update Policy API modifies an existing snapshot management policy. This API is useful when you want to change the schedule, snapshot configuration, deletion conditions, or notification settings of a policy without having to delete and recreate it.

To ensure consistency, this operation uses optimistic concurrency control. You must supply the current `primary_term` and `seq_no` of the policy you want to update.

<!-- spec_insert_start
api: sm.update_policy
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_sm/policies/{policy_name}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: sm.update_policy
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `policy_name` | **Required** | String | The name of the snapshot management policy to update. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: sm.update_policy
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `if_primary_term` | **Required** | Integer | The primary term of the policy to update. |
| `if_seq_no` | **Required** | Integer | The sequence number of the policy to update. |

<!-- spec_insert_end -->

## Request body fields

The request body is optional. It is a JSON object with the following fields:

| Property | Required  | Data type | Description   | Default |
| :--- | :--- | :---- | :--- | :--- |
| `creation` | **Required** | Object    | Defines when and how often snapshots should be created.   | N/A   |
| `snapshot_config` | **Required** | Object    | Specifies the snapshot settings, including repository, indexes to back up, and other snapshot options. | N/A  |
| `deletion`  | Optional     | Object    | Configures automatic cleanup of old snapshots based on age or count conditions.                        | N/A     |
| `description`  | Optional  | String    | A human-readable description of the snapshot policy's purpose.                                         | N/A     |
| `enabled` | Optional  | Boolean   | Whether the policy should start executing upon creation.                                               | `true`  |
| `notification` | Optional  | Object    | Configures when and how to send notifications about snapshot operations. | N/A     |

<details markdown="block">
  <summary>
    Request body fields: <code>creation</code>
  </summary>
  {: .text-delta}

The configuration for the snapshot creation schedule.

`creation` is a JSON object with the following fields:

| Property     | Required     | Data type | Description |
| :---| :--- | :--- | :---- |
| `schedule`   | **Required** | Object    | Defines when snapshots should be created using a cron schedule. |
| `time_limit` | Optional     | String    | The maximum amount of time allowed for snapshot creation.       |

</details>

<details markdown="block">
  <summary>
    Request body fields: <code>creation</code> > <code>schedule</code>
  </summary>
  {: .text-delta}

`schedule` is a JSON object with the following fields:

| Property | Data type | Description    |
| :--- | :--- | :---- |
| `cron`   | Object  | Defines the snapshot schedule using cron expressions. Required for creating periodic snapshots. |

</details>

<details markdown="block">
  <summary>
    Request body fields: <code>creation</code> > <code>schedule</code> > <code>cron</code>
  </summary>
  {: .text-delta}

`cron` is a JSON object with the following fields:

| Property   | Required     | Data type | Description   |
| :--- | :---- | :-------- | :---- |
| `expression` | **Required** | String    | The standard cron expression that defines when snapshots should be created, such as `0 0 * * *` for daily at midnight. |
| `timezone`   | **Required** | String    | The timezone used for interpreting the cron expression such as `UTC`, `America/Los_Angeles`.   |

</details>

## Example request

The following example updates the `daily-snapshots` policy:

```json
PUT /_plugins/_sm/policies/daily-snapshots?if_primary_term=1&if_seq_no=5
{
  "enabled": true,
  "description": "Updated policy with a new schedule.",
  "creation": {
    "schedule": {
      "cron": {
        "expression": "0 0 12 * * ?",
        "timezone": "UTC"
      }
    },
    "time_limit": "15m"
  },
  "snapshot_config": {
    "repository": "my-repo",
    "indices": "logs-*",
    "include_global_state": true
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "_id": "daily-snapshots",
  "_primary_term": 1,
  "_seq_no": 6,
  "_version": 2,
  "sm_policy": {
    "name": "daily-snapshots",
    "description": "Updated policy with a new schedule.",
    "enabled": true,
    "creation": {
      "schedule": {
        "cron": {
          "expression": "0 0 12 * * ?",
          "timezone": "UTC"
        }
      },
      "time_limit": "15m"
    },
    "snapshot_config": {
      "repository": "my-repo",
      "indices": "logs-*",
      "include_global_state": true
    },
    "last_updated_time": 1686105472000
  }
}
```

## Response body fields

The response body is a JSON object with the following fields:

| Property  | Required  | Data type | Description    |
| :---- | :--- | :--- | :---- |
| `_id`           | **Required** | String    | The unique identifier of the policy.                    |
| `_primary_term` | **Required** | Integer   | The primary term for optimistic concurrency control.    |
| `_seq_no`       | **Required** | Integer   | The sequence number for optimistic concurrency control. |
| `_version`      | **Required** | Integer   | The version number of the policy document.              |
| `sm_policy`     | **Required** | Object    | The complete snapshot management policy configuration.  |

<details markdown="block">
  <summary>
    Response body fields: <code>sm_policy</code>
  </summary>
  {: .text-delta}

The `sm_policy` object includes the full snapshot management policy definition as it exists after the update.

| Property  | Required     | Data type | Description  |
| :--- | :---- | :--- | :--- |
| `creation`  | **Required** | Object    | The snapshot creation configuration.   |
| `description`  | **Required** | String    | A user-provided description of the snapshot policy. |
| `name`   | **Required** | String    | The unique name of the snapshot policy.    |
| `snapshot_config`   | **Required** | Object    | The snapshot configuration settings.   |
| `deletion`   | Optional     | Object    | The snapshot deletion configuration.   |
| `enabled`    | Optional     | Boolean   | Whether the policy is currently enabled.            |
| `enabled_time`   | Optional     | Integer   | A timestamp indicating when the policy was enabled. |
| `last_updated_time` | Optional     | Integer   | A timestamp of the most recent policy update.       |
| `notification`   | Optional     | Object    | The notification configuration.                     |
| `schedule`    | Optional     | Object    | The internal system-generated schedule metadata.    |
| `schema_version`   | Optional     | Integer   | The internal schema version number of the policy.   |

</details>


