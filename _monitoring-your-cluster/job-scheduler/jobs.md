---
layout: default
title: Jobs API
parent: Job Scheduler
nav_order: 10
redirect_from:
    - /monitoring-plugins/job-scheduler/api/
---

# Job Scheduler Jobs API 
Introduced 3.2
{: .label .label-purple }

The Jobs API allows you to view all Job Scheduler jobs.

## Endpoints

```json
GET /_plugins/_job_scheduler/api/jobs
```

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter |  Data type | Description |
| :--- | :--- | :--- |
| `by_node` | Boolean | Returns the jobs grouped by the node on which they are running. Default is `false`. |

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
| `jobs` | Array | Contains all jobs reported by the Job Scheduler. |
| `job_type` | String | The plugin that scheduled the job. |
| `job_id` | String | The unique identifier of the job. |
| `index_name` | String | The index in which the job information is stored. |
| `name` | String | The job name. The name is not necessarily unique. |
| `descheduled` | Boolean | Indicates whether the job is scheduled to be executed (`false`) or is not scheduled (`true`) by the Job Scheduler. |
| `enabled` | Boolean | Indicates whether the job is active (`true`) or inactive (`false`), as defined by the plugin using the Job Scheduler. |
| `enabled_time` | String | The time when the job was originally scheduled. |
| `last_update_time` | String | The time the job was last updated. |
| `last_expected_exection_time` | String | The time when the job was most recently executed. |
| `next_expected_execution_time` | String | The time when the job is expected to be executed next. |
| `schedule` | Map | The job's execution schedule. Can define a [Cron](#cron-schedule) or [interval](#interval-schedule) schedule. |
| `schedule.type` | String | The schedule type. Valid values are `cron` and `interval`. |
| `lock_duration` | Integer | The maximum amount of time (in seconds) a job can remain locked during execution.|
| `jitter` | Double | A random delay to job execution times to prevent simultaneous runs across the system.|
| `failures` | Array | A list of nodes that failed to report jobs. |
| `total_jobs` | Integer | The total number of jobs reported across all nodes. |

### Interval schedule

The `interval` schedule supports the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `start_time` | String | The schedule start time.  |
| `interval` | Integer | The numeric interval duration between job executions (for example, `10`). |
| `unit` | String | The interval units (for example, `Minutes`, `Hours`, or `Days`). |
| `delay` | String | A fixed amount of time applied to the job before execution. |

### Cron schedule

The `cron` schedule supports the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `expression` | String | A Cron expression defining the schedule. |
| `timezone` | String | The time zone associated with the Cron schedule. |
