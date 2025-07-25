---
layout: default
title: Data Prepper
parent: Trace analytics
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/data-prepper/
redirect_to: https://docs.opensearch.org/latest/data-prepper/
nav_exclude: true
---

# Data Prepper

Data Prepper is an independent component, not an OpenSearch plugin, that converts data for use with OpenSearch. It's not bundled with the all-in-one OpenSearch installation packages.


## Install Data Prepper

To use the Docker image, pull it like any other image:

```bash
docker pull opensearchproject/data-prepper:latest
```

Otherwise, [download](https://opensearch.org/downloads.html) the appropriate archive for your operating system and unzip it.


## Configure pipelines

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

Pipelines can act as the source for other pipelines. In the following example, a pipeline takes data from the OpenTelemetry Collector and uses two other pipelines as sinks:

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

To learn more, see the [Data Prepper configuration reference]({{site.url}}{{site.baseurl}}/monitoring-plugins/trace/data-prepper-reference/).

## Configure the Data Prepper server
Data Prepper itself provides administrative HTTP endpoints such as `/list` to list pipelines and `/metrics/prometheus` to provide Prometheus-compatible metrics data. The port which serves these endpoints, as well as TLS configuration, is specified by a separate YAML file. Example:

```yml
ssl: true
keyStoreFilePath: "/usr/share/data-prepper/keystore.jks"
keyStorePassword: "password"
privateKeyPassword: "other_password"
serverPort: 1234
```

## Start Data Prepper

**Docker**

```bash
docker run --name data-prepper --expose 21890 -v /full/path/to/pipelines.yaml:/usr/share/data-prepper/pipelines.yaml -v /full/path/to/data-prepper-config.yaml:/usr/share/data-prepper/data-prepper-config.yaml opensearchproject/opensearch-data-prepper:latest
```

**macOS and Linux**

```bash
./data-prepper-tar-install.sh config/pipelines.yaml config/data-prepper-config.yaml
```

For production workloads, you likely want to run Data Prepper on a dedicated machine, which makes connectivity a concern. Data Prepper uses port 21890 and must be able to connect to both the OpenTelemetry Collector and the OpenSearch cluster. In the [sample applications](https://github.com/opensearch-project/Data-Prepper/tree/main/examples), you can see that all components use the same Docker network and expose the appropriate ports.
