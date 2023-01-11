---
layout: default
title: Monitoring
nav_order: 12
---

# Monitoring Data Prepper with metrics

Data Prepper can be monitored with metrics using [Micrometer](https://micrometer.io/). There are two types of metrics: JVM and system metrics and plugin metrics. [Prometheus](https://prometheus.io/) is used as the default metrics backend.

## JVM and system metrics

JVM and system metrics are runtime metrics used to monitor Data Prepper instances. They include metrics for classloaders, memory, garbage collection, threads, and others. For more information, see [JVM and system metrics](https://micrometer.io/docs/ref/jvm). 

### Naming

JVM and system metrics follow predefined names in [Micrometer](https://micrometer.io/docs/concepts#_naming_meters), such as `jvm_classes_loaded` and `jvm_memory_used`. 

### Serving

By default, metrics are served from the **/metrics/sys** endpoint on the Data Prepper server. The format is a text Prometheus scrape. This port can be used for any frontend that accepts Prometheus metrics, such as [Grafana](https://prometheus.io/docs/visualization/grafana/). The configuration can be updated to serve metrics to other registries like Amazon CloudWatch, which does not require or host the endpoint but publishes the metrics directly to CloudWatch.

## Plugin metrics

Each plugin (and, if necessary, each class within a plugin) is responsible for posting relevant metrics. Besides custom metrics introduced by specific plugins, the [Data Prepper API](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-api) introduces the following common metrics for plugin types: 

<!--- For editorial review: Need help on how to adjust first sentence to avoid the use of parentheses. It doesn't seem to flow well.--->

1. AbstractBuffer
    - Counter
        - `recordsWritten`: The number of records written into a buffer
        - `recordsRead`: The number of records read from a buffer
        - `recordsProcessed`: The number of records read from a buffer and marked as processed
        - `writeTimeouts`: The count of write timeouts in a buffer
    - Gaugefir 
        - `recordsInBuffer`: The number of records in a buffer
        - `recordsInFlight`: The number of records read from a buffer and being processed by data-prepper downstreams (for example, processor, sink)
    - Timer
        - `readTimeElapsed`: The time elapsed while reading from a buffer
        - `checkpointTimeElapsed`: The time elapsed while checkpointing
2. AbstractProcessor
    - Counter
        - `recordsIn`: The number of records ingressed into a processor
        - `recordsOut`: The number of records egressed from a processor
    - Timer
        - `timeElapsed`: The time elapsed during execution of a processor
3. AbstractSink
    - Counter
        - `recordsIn`: The number of records ingressed into a sink
    - Timer
        - `timeElapsed`: The time elapsed during execution of a sink 

### Naming

Metrics follow a naming convention of **PIPELINE_NAME_PLUGIN_NAME_METRIC_NAME**. For example, a **recordsIn** metric for the **opensearch-sink** plugin in a pipeline named **output-pipeline** has a qualified name of **output-pipeline_opensearch_sink_recordsIn**.

### Serving

By default, metrics are served from the **/metrics/sys** endpoint on the Data Prepper server. The format is a text Prometheus scrape. The format is a text Prometheus scrape. This port can be used for any frontend which accepts Prometheus metrics, such as [Grafana](https://prometheus.io/docs/visualization/grafana/). The configuration can be updated to serve metrics to other registries like CloudWatch which does not require or host the endpoint, but publishes the metrics directly to CloudWatch.
