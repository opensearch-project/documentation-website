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

This API returns the locks on all the jobs within the Job Scheduler.
In the OpenSearch Job Scheduler, locks are requested through a distributed locking mechanism to ensure only one instance of a job runs at a time across the cluster.

## Endpoints

```json
GET /_plugins/_job_scheduler/api/locks
GET /_plugins/_job_scheduler/api/<LockID>
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| LockID | String | LockID = "index"-"JobID". Must be delineated by '-'. Example ".scheduler_sample_extension-jobid1" |

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
| total_locks | Integer | Count of total locks. |
| locks | Map | Contains the lockIDs and corresponding lock information returned by the API. |
| job_index_name | String | Index where the job is located. |
| job_id | String | Displays the job ID. |
| lock_time | EpochSecond | Time the lock was acquired. |
| lock_duration_seconds | Integer | Maximum lock duration. How long the lock is valid. |
| released | Boolean | Indicates if the lock is currently active. |