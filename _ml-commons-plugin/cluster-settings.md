---
layout: default
title: ML Commons cluster settings
has_children: false
nav_order: 10
---

# ML Commons cluster settings

This page provides an overview of `opensearch.yml` settings that can be configured for the ML commons plugin.

| **Setting Name** | **Default Value** | **Value Range** | **Description** |
|:---:|:---:|:---:|:---:|
| `plugins.ml_commons.only_run_on_ml_node` | false | true or false | If `true`, ML Commons task and models run machine learning (ML) tasks on ML nodes only. If `false`, tasks and models run on ML nodes first. If no ML nodes exist, tasks and model run on data nodes. Don't set as "false" on production cluster. |
| `plugins.ml_commons.task_dispatch_policy` | round_robin |  round_robin or least_load | Default is `round_robin`. `round_  robin` dispatches ML tasks to ML nodes using round robin routing. `least_load` gathers all an ML nodes' runtime information, like JVM heap memory usage and running tasks, then dispatches tasks to the ML node with the least load. |
| `plugins.ml_commons.sync_up_job_interval_in_seconds` | 10 | From 0 (included) to 86400 (included) | If set as 0, ML Commons immediately stops any syncup jobs |
| `plugins.ml_commons.monitoring_request_coun`t | 100 | From 0 (included) to 10_000_000 (included) | Controls how many predict requests are monitored on one node. If set to `0`, ML Commons cleans up monitoring requests and won't monitor predict requests. |
| `plugins.ml_commons.max_upload_model_tasks_per_node` | 10 | From 0 (included) to 10 (included) | Controls how many upload model tasks can run in parallel on one node. If set as 0, you cannot upload models to any node. |
| `plugins.ml_commons.max_load_model_tasks_per_node` | 10 | From 0 (included) to 10 (included) | Controls how many load model tasks can run in parallel on one node. If set as 0, you cannot load models to any node. |
| `plugins.ml_commons.trusted_url_regex` | `^(https?\|ftp\|file)://[-a-zA-Z0-9+&@#/%?=~_\|!:,.;]*[-a-zA-Z0-9+&@#/%=~_\|]` | Java regex string | The default value allows uploading model file from any http/https/ftp/local file. You can change this value to restrict trusted model URL. |
