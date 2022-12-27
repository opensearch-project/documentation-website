---
layout: default
title: Job Scheduler Plugin
nav_order: 1
has_children: false
has_toc: false
---

# Job Scheduler plugin

The OpenSearch Job Scheduler plugin provides a framework for developers to accomplish common, scheduled tasks on their cluster when [building their own plugins]({{site.url}}{{site.baseurl}}/job_scheduler/build-plugin.md). You can implement Job Scheduler’s Service Provider Interface (SPI) to take snapshots, manage your data’s lifecycle, run periodic jobs, and more.

To use Job Scheduler, build a plugin that implements interfaces provided in the Job Scheduler library. You can schedule jobs by specifying an interval, or using a Unix cron expression to define a more flexible schedule to execute a job. Job Scheduler has a sweeper that listens for update events on the OpenSearch cluster, and a scheduler that manages when jobs run.

You can install the Job Scheduler plugin by following the instructions at the [OpenSearch plugin installation]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/plugins/) page. The sample-extension-plugin example provided in the [Job Scheduler Github repo](https://github.com/opensearch-project/job-scheduler) provides a complete example of utilizing Job Scheduler when building a plugin.