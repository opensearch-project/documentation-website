---
layout: default
title: ML Commons cluster settings
has_children: false
nav_order: 10
---

# ML Commons cluster settings

This page provides an overview of `opensearch.yml` settings that can be configured for the ML commons plugin.


## Run tasks and models on ML nodes only

If `true`, ML Commons tasks and models run machine learning (ML) tasks on ML nodes only. If `false`, tasks and models run on ML nodes first. If no ML nodes exist, tasks and models run on data nodes. Don't set as "false" on production cluster. 

### Setting

```
plugins.ml_commons.only_run_on_ml_node: true
```

### Values

- Default value: `false`
- Value range: `true` or `false`

## Dispatch tasks to ML node 

`round_robin` dispatches ML tasks to ML nodes using round robin routing. `least_load` gathers all an ML nodes' runtime information, like JVM heap memory usage and running tasks, then dispatches tasks to the ML node with the least load.


### Setting

```
plugins.ml_commons.task_dispatch_policy: round_robin
```


### Values

- Dafault value: `round_robin`
- Value range: `round_robin` or `least_load`


## Set sync up job intervals 

When returning runtime information with the [profile API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api#profile), ML Commons will run a regular sync up job to sync up newly loaded or unloaded models on each node. When set to `0`, ML Commons immediately stops sync up jobs.

### Setting

```
plugins.ml_commons.sync_up_job_interval_in_seconds: 10
```

### Values

- Default value: `10`
- Value range: [0, 86,400]

## Predict monitoring requests

Controls how many upload model tasks can run in parallel on one node. If set to `0`, you cannot upload models to any node.

### Setting

```
plugins.ml_commons.monitoring_request_count: 100
```

### Value range

- Default value: `100`
- Value range: [0, 100,000,000]

## Upload model tasks per node

Controls how many upload model tasks can run in parallel on one node. If set to `0`, you cannot upload models to any node.

### Setting

```
plugins.ml_commons.max_upload_model_tasks_per_node: 10
```


### Values 

- Default value: `10`
- Value range: [0, 10]


## Load model tasks per node

Controls how many load model tasks can run in parallel on one node. If set as 0, you cannot load models to any node.

### Setting

```
plugins.ml_commons.max_load_model_tasks_per_node: 10
```

### Values 

- Default value: `10`
- Value range: [0, 10]

## Add trusted URL

The default value allows uploading a model file from any http/https/ftp/local file. You can change this value to restrict trusted model URL.


### Setting

```
plugins.ml_commons.trusted_url_regex: ^(https?\|ftp\|file)://[-a-zA-Z0-9+&@#/%?=~_\|!:,.;]*[-a-zA-Z0-9+&@#/%=~_\|]
```

### Values

- Default value: `^(https?\|ftp\|file)://[-a-zA-Z0-9+&@#/%?=~_\|!:,.;]*[-a-zA-Z0-9+&@#/%=~_\|]`
- Value range: Java regular expression (regex) string
