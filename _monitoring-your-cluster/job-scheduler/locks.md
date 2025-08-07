---
layout: default
title: Locks API
parent: Job Scheduler
nav_order: 20
redirect_from:
    - /monitoring-plugins/job-scheduler/api/
---

# Job Scheduler Locks API 
Introduced 3.2
{: .label .label-purple }

The Job Scheduler uses a distributed locking mechanism to ensure that only one instance of a job runs at a time across the cluster. The Locks API returns information about all active job locks managed by the Job Scheduler.

## Endpoints

```json
GET /_plugins/_job_scheduler/api/locks
GET /_plugins/_job_scheduler/api/locks/<lock_id>
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `<lock_id>` | String | A unique identifier for the lock, formatted as `"index"-"job_id"` (for example, `.scheduler_sample_extension-jobid1`). The index name and job ID must be separated by a hyphen (`-`).|

## Example request

```json
GET /_plugins/_job_scheduler/api/locks
```
{% include copy-curl.html %}

## Example response

```json
{
  "total_locks": 1,
  "locks": {
    ".scheduler_sample_extension-jobid1": {
      "job_index_name": ".scheduler_sample_extension",
      "job_id": "jobid1",
      "lock_time": 1754410412,
      "lock_duration_seconds": 10,
      "released": false
    }
  }
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `total_locks` | Integer | The total number of active and released locks. |
| `locks` | Map | A map of lock IDs and their associated lock information. |
| `job_index_name` | String | The name of the index in which the job is stored. |
| `job_id` | String | The job ID. |
| `lock_time` | Seconds since the epoch | The time at which the lock was acquired. |
| `lock_duration_seconds` | Integer | The maximum amount of time for which the lock is valid. |
| `released` | Boolean | 	Indicates whether the lock has been released (`true`) or is currently active (`false`). |