---
layout: default
title: Scheduled jobs
nav_order: 65
has_children: true
has_toc: false
redirect_from:
  - /tuning-your-cluster/scheduled-jobs/
---

# Scheduled jobs

OpenSearch plugins that run tasks on a schedule use the Job Scheduler plugin to run them. For example, Index State Management uses scheduled jobs to apply policies to indexes, snapshot management uses them to create and delete snapshots, anomaly detection uses them to run detectors, and reporting uses them to generate scheduled reports.

Job Scheduler stores each job in the job index of the plugin that created it. A background sweep periodically searches these indexes for jobs to schedule. To ensure that only one instance of a job runs at a time across the cluster, Job Scheduler acquires a lock before running the job.

## Monitoring scheduled jobs

If a scheduled task, such as an Index State Management policy or a snapshot policy, stops running, use the following APIs to view the state of its job:

- The [Jobs API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/scheduled-jobs/jobs/) lists the jobs on the cluster and shows whether each job is enabled and scheduled.
- The [Locks API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/scheduled-jobs/locks/) lists the locks that jobs currently hold.

## Scheduled job settings

Job Scheduler supports the following settings. All settings are dynamic. For more information about dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

Setting | Data type | Description
:--- | :--- | :---
`plugins.jobscheduler.jitter_limit` | Double | The maximum fraction of a job's interval by which Job Scheduler randomly delays each run of the job. Random delays prevent many jobs from starting at the same time and consuming resources together. For example, if a job runs every 10 minutes and the jitter limit is `0.6`, each run is delayed by a random time between 0 and 6 minutes. Default is `0.6`.
`plugins.jobscheduler.sweeper.period` | Time unit | The interval at which the background sweep searches job indexes for jobs to schedule. Default is `5m`.
`plugins.jobscheduler.sweeper.page_size` | Integer | The number of jobs that the background sweep retrieves in each search request. Default is `100`.
`plugins.jobscheduler.request_timeout` | Time unit | The timeout for the search requests that the background sweep sends to job indexes. Default is `10s`.
`plugins.jobscheduler.retry_count` | Integer | The number of times the background sweep retries a failed search of a job index. Default is `3`.
`plugins.jobscheduler.sweeper.backoff_millis` | Time unit | The initial wait time before the background sweep retries a failed search of a job index. The wait time increases exponentially with each retry. Default is `50ms`.
`plugins.jobscheduler.sweeper.orphan_reconciliation.enabled` | Boolean | Whether the background sweep stops jobs whose job document has been deleted. In a cluster that uses [remote-backed storage]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/index/), a node that stores a replica of a job index does not detect document deletions, so a deleted job can keep running on that node. For example, an Index State Management policy can continue to run after you remove it from an index. Default is `true` on nodes configured for remote-backed storage and `false` on all other nodes.

## Related documentation

- [Job Scheduler]({{site.url}}{{site.baseurl}}/developer-documentation/job-scheduler/index/): Build a plugin that schedules jobs using Job Scheduler.
