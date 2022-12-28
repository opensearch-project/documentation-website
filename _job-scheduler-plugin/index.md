---
layout: default
title: Job Scheduler Plugin
nav_order: 1
has_children: false
has_toc: false
---

# Job Scheduler plugin

The OpenSearch Job Scheduler plugin provides a framework that can be used to build schedules for common tasks performed on your cluster. You use the job scheduler’s Service Provider Interface (SPI) to define schedules for cluster management tasks such as taking snapshots, managing your data’s lifecycle, and running periodic jobs. Job Scheduler has a sweeper that listens for updated events on the OpenSearch cluster, and a scheduler that manages when jobs run.

You can install the Job Scheduler plugin by following the standard [OpenSearch plugin installation]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/plugins/) process. The sample-extension-plugin example provided in the [Job Scheduler Github repo](https://github.com/opensearch-project/job-scheduler) provides a complete example of utilizing Job Scheduler when building a plugin. To define schedules, you build a plugin that implements the interfaces provided in the job scheduler library. You can schedule jobs by specifying an interval, or you can use a Unix cron expression to define a more flexible schedule for which to execute a job.