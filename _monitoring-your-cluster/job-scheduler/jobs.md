---
layout: default
title: Jobs API
parent: Job Scheduler
nav_order: 1
redirect_from:
    - /monitoring-plugins/job-scheduler/api/
---

# Job Scheduler Jobs API 
Introduced 3.2
{: .label .label-purple }

The Jobs API allows the user to see all of the jobs within the Job Scheduler plugin.

## Endpoints

```json
GET /_plugins/_job_scheduler/api/jobs
```

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter |  Data type | Description |
| :--- | :--- | :--- |
| `by_node` | Boolean | ```GET /_plugins/_job_scheduler/api/jobs?by_node ``` Formats the response by returnig the jobs acording to the owning node. Default is false. |

## Request body fields

There are no request body fields.

## Example request

```json
GET /_plugins/_job_scheduler/api/jobs
```
{% include copy-curl.html %}

## Example response

```json
{
  "jobs": [
    {
      "job_type": "reports-scheduler",
      "job_id": "Cuu8Z5gBTcOdmakPQ51t",
      "index_name": ".opendistro-reports-definitions",
      "name": "index_report",
      "descheduled": false,
      "enabled": true,
      "enabled_time": "2025-08-01T22:24:08.044Z",
      "last_update_time": "2025-08-01T22:24:08.044Z",
      "last_execution_time": "none",
      "last_expected_execution_time": "none",
      "next_expected_execution_time": "2025-08-04T02:15:00.000Z",
      "schedule": {
        "type": "cron",
        "expression": "15 2 1,15 * 1",
        "timezone": "Africa/Abidjan",
        "delay": "none"
      },
      "lock_duration": "no_lock",
      "jitter": "none"
    },
    {
      "job_type": "scheduler_sample_extension",
      "job_id": "jobid1",
      "index_name": ".scheduler_sample_extension",
      "name": "sample-job-it",
      "descheduled": false,
      "enabled": true,
      "enabled_time": "1970-07-23T00:27:45.353Z",
      "last_update_time": "1970-07-23T00:27:45.353Z",
      "last_execution_time": "2025-08-01T22:28:45.357484385Z",
      "last_expected_execution_time": "2025-08-01T22:28:45.353111804Z",
      "next_expected_execution_time": "2025-08-01T22:29:45.353111804Z",
      "schedule": {
        "type": "interval",
        "start_time": "1970-07-23T00:27:45.353Z",
        "interval": 1,
        "unit": "Minutes",
        "delay": "none"
      },
      "lock_duration": 10,
      "jitter": "none"
    }
  ],
  "failures": [],
  "total_jobs": 2
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `jobs` | Array | Contains all the jobs reported by the Job Scheduler. |
| `job_type` | String | Shows the plugin that Scheduled the job. |
| `job_id` | String | Unique identifier for the job. |
| `index_name` | String | Identifiest the index where the job information is stored. |
| `name` | String | Name of the job. Not required to be unique. |
| `descheduled` | Boolean | False if the job is scheduled to be executed. True otherwise. |
| `enabled` | Boolean | True if the job is scheduled to be executed. Fallse otherwise. |
| `enabled_time` | String | Shows the time that the job was originaly scheduled. |
| `last_update_time` | String | Time stamp of the last time the job was updated. |
| `last_execution_time` | String | Time Stamp of actual time of the last execution. |
| `last_expected_exection_time` | String | Time stamp of expected time of the last execution. |
| `next_expected_execution_time` | String | Time stamp of next scheduled execution time. |
| `schedule` | object | Shows the schedule that dictates the execution of the job. There are two types of schedules: Cron and Interval. |
| `type` | String | Displays the schedule type: Cron or Interval. |
| `start_time` | String | Time stamp start time associated with the Schedule. Interval schedule type only. |
| `interval` | Integer | Duration between job executions. Ex. minutes, hours, days. Interval schedule type only. |
| `unit` | String | Shows interval unit type. Ex. minutes, hours, days. Interval schedule type only. |
| `delay` | String | Response field description. |
| `expression` | String | Returns the Cron schedule expression. Cron schedule type only. |
| `timezone` | String | Time zone associated with the Cron schedule. Cron schedule type only. |
| `lock_duration` | Integer | Length of the lock during job execution. |
| `jitter` | Integer | Response field description. |
| `failures` | Array | Displays nodes that failed to report jobs. |
| `total_jobs` | Integer | Total number of jobs reported. |