---
layout: default
title: ML Commons cluster settings
has_children: false
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/cluster-settings/
---

# ML Commons cluster settings

To enhance and customize your OpenSearch cluster for machine learning (ML), you can add and modify several configuration settings for the ML Commons plugin in your 'opensearch.yml' file.


## Run tasks and models on ML nodes only

### Setting

```
plugins.ml_commons.only_run_on_ml_node: false
```

### Description

If `true`, ML Commons tasks and models run machine learning (ML) tasks on ML nodes only. If `false`, tasks and models run on ML nodes first. If no ML nodes exist, tasks and models run on data nodes. Don't set as "false" on production cluster. 

### Values

- Default value: `false`
- Value range: `true` or `false`

## Dispatch tasks to ML node 

### Setting

```
plugins.ml_commons.task_dispatch_policy: round_robin
```

### Description

`round_robin` dispatches ML tasks to ML nodes using round robin routing. `least_load` gathers all an ML nodes' runtime information, like JVM heap memory usage and running tasks, then dispatches tasks to the ML node with the least load. 

### Values

- Dafault value: `round_robin`
- Value range: `round_robin` or `least_load`

## Set number of ML tasks per node

Sets the number of ML tasks that can run on each ML node. When set to `0`, no ML tasks run on any nodes.

### Setting

```
plugins.ml_commons.max_ml_task_per_node: 10
```

### Values

- Default value: `10`
- Value range: [0, 10,000]

## Set number of ML models per node

Sets the number of ML models that can be loaded on to each ML node. When set to `0`, no ML models can load on any node.

### Setting

```
plugins.ml_commons.max_model_on_node: 10
```

### Values

- Default value: `10`
- Value range: [0, 10,000]

## Set sync job intervals 

When returning runtime information with the [profile API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api#profile), ML Commons will run a regular job to sync newly loaded or unloaded models on each node. When set to `0`, ML Commons immediately stops sync up jobs.


### Setting

```
plugins.ml_commons.sync_up_job_interval_in_seconds: 3
```

### Description

When returning runtime information with the [profile API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api#profile), ML Commons will run a regular sync up job to sync up newly loaded or unloaded models on each node. When set to `0`, ML Commons immediately stops sync up jobs.

### Values

- Default value: `3`
- Value range: [0, 86,400]

## Predict monitoring requests

Controls how many predict requests are monitored on one node. If set to `0`, OpenSearch clears all monitoring predict requests in cache and does not monitor for new predict requests.

### Setting

```
plugins.ml_commons.monitoring_request_count: 100
```

### Description

Controls how many upload model tasks can run in parallel on one node. If set to `0`, you cannot upload models to any node.

### Value range

- Default value: `100`
- Value range: [0, 10,000,000]

## Upload model tasks per node

### Setting

```
plugins.ml_commons.max_upload_model_tasks_per_node: 10
```

### Description

Controls how many upload model tasks can run in parallel on one node. If set to `0`, you cannot upload models to any node.

### Values 

- Default value: `10`
- Value range: [0, 10]


## Load model tasks per node

### Setting

```
plugins.ml_commons.max_load_model_tasks_per_node: 10
```

### Description

Controls how many load model tasks can run in parallel on one node. If set as 0, you cannot load models to any node.

### Values 

- Default value: `10`
- Value range: [0, 10]

## Add trusted URL

### Setting

The default URL value for this trusted URL setting is not secure. To ensure the security, please use you own regex string to the trusted repository that contains your models, for example `https://github.com/opensearch-project/ml-commons/blob/2.x/ml-algorithms/src/test/resources/org/opensearch/ml/engine/algorithms/text_embedding/*`.
{: .warning }


```
plugins.ml_commons.trusted_url_regex: <model-repository-url>
```

### Description

The default value allows uploading a model file from any http/https/ftp/local file. You can change this value to restrict trusted model URL

### Values

- Default value: `"^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]"`
- Value range: Java regular expression (regex) string
