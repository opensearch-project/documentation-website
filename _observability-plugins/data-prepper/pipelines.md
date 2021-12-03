---
layout: default
title: Pipelines
parent: Data Prepper
nav_order: 2
---

# Pipelines

To use Data Prepper, you define pipelines in a configuration YAML file. Each pipeline is a combination of a source, a buffer, zero or more preppers, and one or more sinks:

```yml
sample-pipeline:
  workers: 4 # the number of workers
  delay: 100 # in milliseconds, how long workers wait between read attempts
  source:
    otel_trace_source:
      ssl: true
      sslKeyCertChainFile: "config/demo-data-prepper.crt"
      sslKeyFile: "config/demo-data-prepper.key"
  buffer:
    bounded_blocking:
      buffer_size: 1024 # max number of records the buffer accepts
      batch_size: 256 # max number of records the buffer drains after each read
  prepper:
    - otel_trace_raw_prepper:
  sink:
    - opensearch:
        hosts: ["https:localhost:9200"]
        cert: "config/root-ca.pem"
        username: "ta-user"
        password: "ta-password"
        trace_analytics_raw: true
```

- Sources define where your data comes from. In this case, the source is the OpenTelemetry Collector (`otel_trace_source`) with some optional SSL settings.

- Buffers store data as it passes through the pipeline.

  By default, Data Prepper uses its one and only buffer, the `bounded_blocking` buffer, so you can omit this section unless you developed a custom buffer or need to tune the buffer settings.

- Preppers perform some action on your data: filter, transform, enrich, etc.

  You can have multiple preppers, which run sequentially from top to bottom, not in parallel. The `otel_trace_raw_prepper` prepper converts OpenTelemetry data into OpenSearch-compatible JSON documents.

- Sinks define where your data goes. In this case, the sink is an OpenSearch cluster.

## Examples

This section provides some pipeline examples that you can use to start creating your own pipelines. For more information, see [Data Prepper configuration reference]({{site.url}}{{site.baseurl}}/observability-plugins/data-prepper/data-prepper-reference/) guide.

The Data Prepper repository has several [sample applications](https://github.com/opensearch-project/data-prepper/tree/main/examples) to help you get started.

### Log ingestion pipeline

The following example demonstrates how to use HTTP source and Grok prepper plugins to process unstructured log data.

```yaml
log-pipeline:
  source:
    http:
      ssl: false
  processor:
    - grok:
        match:
          log: [ "%{COMMONAPACHELOG}" ]
  sink:
    - opensearch:
        hosts: [ "https://opensearch:9200" ]
        insecure: true
        username: admin
        password: admin
        index: apache_logs
```

Note: This example uses weak security. We strongly recommend securing all plugins which open external ports in production environments.

### Trace Analytics pipeline

The following example demonstrates how to build a pipeline that supports the [Trace Analytics OpenSearch Dashboards plugin]({{site.url}}{{site.baseurl}}/observability-plugins/trace/ta-dashboards/). This pipeline takes data from the OpenTelemetry Collector and uses two other pipelines as sinks. These two separate pipelines index trace and the service map documents for the dashboard plugin.

```yml
entry-pipeline:
  delay: "100"
  source:
    otel_trace_source:
      ssl: true
      sslKeyCertChainFile: "config/demo-data-prepper.crt"
      sslKeyFile: "config/demo-data-prepper.key"
  sink:
    - pipeline:
        name: "raw-pipeline"
    - pipeline:
        name: "service-map-pipeline"
raw-pipeline:
  source:
    pipeline:
      name: "entry-pipeline"
  prepper:
    - otel_trace_raw_prepper:
  sink:
    - opensearch:
        hosts: ["https://localhost:9200" ]
        cert: "config/root-ca.pem"
        username: "ta-user"
        password: "ta-password"
        trace_analytics_raw: true
service-map-pipeline:
  delay: "100"
  source:
    pipeline:
      name: "entry-pipeline"
  prepper:
    - service_map_stateful:
  sink:
    - opensearch:
        hosts: ["https://localhost:9200"]
        cert: "config/root-ca.pem"
        username: "ta-user"
        password: "ta-password"
        trace_analytics_service_map: true
```
