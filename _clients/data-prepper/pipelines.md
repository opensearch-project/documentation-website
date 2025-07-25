---
layout: default
title: Pipelines
parent: Data Prepper
nav_order: 2
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/pipelines/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/pipelines/
nav_exclude: true
---

# Pipelines

![Data Prepper Pipeline]({{site.url}}{{site.baseurl}}/images/data-prepper-pipeline.png)

To use Data Prepper, you define pipelines in a configuration YAML file. Each pipeline is a combination of a source, a buffer, zero or more preppers, and one or more sinks. For example:

```yml
simple-sample-pipeline:
  workers: 2 # the number of workers
  delay: 5000 # in milliseconds, how long workers wait between read attempts
  source:
    random:
  buffer:
    bounded_blocking:
      buffer_size: 1024 # max number of records the buffer accepts
      batch_size: 256 # max number of records the buffer drains after each read
  processor:
    - string_converter:
        upper_case: true
  sink:
    - stdout:
```

- Sources define where your data comes from. In this case, the source is a random UUID generator (`random`).

- Buffers store data as it passes through the pipeline.

  By default, Data Prepper uses its one and only buffer, the `bounded_blocking` buffer, so you can omit this section unless you developed a custom buffer or need to tune the buffer settings.

- Preppers perform some action on your data: filter, transform, enrich, etc.

  You can have multiple preppers, which run sequentially from top to bottom, not in parallel. The `string_converter` prepper transform the strings by making them uppercase.

- Sinks define where your data goes. In this case, the sink is stdout.

## Examples

This section provides some pipeline examples that you can use to start creating your own pipelines. For more information, see [Data Prepper configuration reference]({{site.url}}{{site.baseurl}}/clients/data-prepper/data-prepper-reference/) guide.

The Data Prepper repository has several [sample applications](https://github.com/opensearch-project/data-prepper/tree/main/examples) to help you get started.

### Log ingestion pipeline

The following example demonstrates how to use HTTP source and Grok prepper plugins to process unstructured log data.

```yml
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

This example uses weak security. We strongly recommend securing all plugins which open external ports in production environments.
{: .note}

### Trace Analytics pipeline

The following example demonstrates how to build a pipeline that supports the [Trace Analytics OpenSearch Dashboards plugin]({{site.url}}{{site.baseurl}}/observability-plugin/trace/ta-dashboards/). This pipeline takes data from the OpenTelemetry Collector and uses two other pipelines as sinks. These two separate pipelines index trace and the service map documents for the dashboard plugin.

```yml
entry-pipeline:
  delay: "100"
  source:
    otel_trace_source:
      ssl: false
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
        hosts: ["https://localhost:9200"]
        insecure: true
        username: admin
        password: admin
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
        insecure: true
        username: admin
        password: admin
        trace_analytics_service_map: true
```

## Migrating from Logstash

Data Prepper supports Logstash configuration files for a limited set of plugins. Simply use the logstash config to run Data Prepper.

```bash
docker run --name data-prepper \
    -v /full/path/to/logstash.conf:/usr/share/data-prepper/pipelines.conf \
    opensearchproject/opensearch-data-prepper:latest
```

This feature is limited by feature parity of Data Prepper. As of Data Prepper 1.2 release, the following plugins from the Logstash configuration are supported:

- HTTP Input plugin
- Grok Filter plugin
- Elasticsearch Output plugin
- Amazon Elasticsearch Output plugin

## Configure the Data Prepper server

Data Prepper itself provides administrative HTTP endpoints such as `/list` to list pipelines and `/metrics/prometheus` to provide Prometheus-compatible metrics data. The port that has these endpoints has a TLS configuration and is specified by a separate YAML file. By default, these endpoints are secured by Data Prepper docker images. We strongly recommend providing your own configuration file for securing production environments. Here is an example `data-prepper-config.yaml`:

```yml
ssl: true
keyStoreFilePath: "/usr/share/data-prepper/keystore.jks"
keyStorePassword: "password"
privateKeyPassword: "other_password"
serverPort: 1234
```

To configure the Data Prepper server, run Data Prepper with the additional yaml file.

```bash
docker run --name data-prepper -v /full/path/to/pipelines.yaml:/usr/share/data-prepper/pipelines.yaml \
    /full/path/to/data-prepper-config.yaml:/usr/share/data-prepper/data-prepper-config.yaml \
    opensearchproject/opensearch-data-prepper:latest
````
