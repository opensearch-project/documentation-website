---
layout: default
title: Get Auto-follow Stats API
parent: Replication APIs
nav_order: 45
---

# Get Auto-follow Stats API
Introduced 1.0
{: .label .label-purple }

The Get Auto-follow Stats API retrieves statistics about auto-follow patterns and their replication activities. This API helps you monitor the performance and status of automatic index replication configured through auto-follow patterns.

<!-- spec_insert_start
api: replication.autofollow_stats
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_replication/autofollow_stats
```
<!-- spec_insert_end -->

## Example request

The following example gets statistics for all configured auto-follow patterns:

```json
GET /_plugins/_replication/autofollow_stats
```
{% include copy-curl.html %}

## Example response

The following example shows a successful API response with statistics for two auto-follow patterns:

```json
{
  "num_success_start_replication": 12,
  "num_failed_start_replication": 1,
  "num_failed_leader_calls": 0,
  "failed_indices": ["logs-2023-error"],
  "autofollow_stats": [
    {
      "name": "logs-pattern",
      "pattern": "logs-*",
      "num_success_start_replication": 10,
      "num_failed_start_replication": 1,
      "num_failed_leader_calls": 0,
      "last_execution_time": 1645729365423,
      "failed_indices": ["logs-2023-error"]
    },
    {
      "name": "metrics-pattern",
      "pattern": "metrics-*",
      "num_success_start_replication": 2,
      "num_failed_start_replication": 0,
      "num_failed_leader_calls": 0,
      "last_execution_time": 1645729245895,
      "failed_indices": []
    }
  ]
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `autofollow_stats` | Array of Objects | A list of statistics for each auto-follow pattern. |
| `failed_indices` | Array of Strings | The list of indexes that failed to replicate across all patterns. |
| `num_failed_leader_calls` | Float | The number of failed calls to the leader cluster across all patterns. |
| `num_failed_start_replication` | Float | The number of failed replication starts across all patterns. |
| `num_success_start_replication` | Float | The number of successful replication starts across all patterns. |

<details markdown="block">
  <summary>
    Response body fields: <code>autofollow_stats</code>
  </summary>
  {: .text-delta}

`autofollow_stats` is an array of JSON objects. Each object represents a single auto-follow pattern and has the following fields:

| Field | Data type | Description |
| :--- | :--- | :--- |
| `failed_indices` | Array of Strings | The list of indexes that failed to replicate for this pattern. |
| `last_execution_time` | Float | When the last execution of this auto-follow pattern occurred. |
| `name` | String | The name of the auto-follow pattern. |
| `num_failed_leader_calls` | Float | The number of failed calls to the leader cluster for this pattern. |
| `num_failed_start_replication` | Float | The number of failed replication starts for this pattern. |
| `num_success_start_replication` | Float | The number of successful replication starts for this pattern. |
| `pattern` | String | The pattern used for auto-following indexes. |
</details>