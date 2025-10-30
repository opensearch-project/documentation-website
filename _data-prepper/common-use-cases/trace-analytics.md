---
layout: default
title: Trace analytics
parent: Common use cases
nav_order: 60
---

# Trace analytics

Trace analytics allows you to collect trace data and customize a pipeline that ingests and transforms the data for use in OpenSearch. The following provides an overview of the trace analytics workflow in OpenSearch Data Prepper, how to configure it, and how to visualize trace data.

## Introduction

When using Data Prepper as a server-side component to collect trace data, you can customize a Data Prepper pipeline to ingest and transform the data for use in OpenSearch. Upon transformation, you can visualize the transformed trace data for use with the Observability plugin inside of OpenSearch Dashboards. Trace data provides visibility into your application's performance, and helps you gain more information about individual traces.

The following flowchart illustrates the trace analytics workflow, from running OpenTelemetry Collector to using OpenSearch Dashboards for visualization.

<img src="{{site.url}}{{site.baseurl}}/images/data-prepper/trace-analytics/trace-analytics-components.jpg" alt="Trace analytics component overview">{: .img-fluid}

To monitor trace analytics, you need to set up the following components in your service environment:
- Add **instrumentation** to your application so it can generate telemetry data and send it to an OpenTelemetry collector.
- Run an **OpenTelemetry collector** as a sidecar or daemonset for Amazon Elastic Kubernetes Service (Amazon EKS), a sidecar for Amazon Elastic Container Service (Amazon ECS), or an agent on Amazon Elastic Compute Cloud (Amazon EC2). You should configure the collector to export trace data to Data Prepper. 
- Deploy **Data Prepper** as the ingestion collector for OpenSearch. Configure it to send the enriched trace data to your OpenSearch cluster or to the Amazon OpenSearch Service domain.
- Use **OpenSearch Dashboards** to visualize and detect problems in your distributed applications.

## Trace analytics pipeline

To monitor trace analytics in Data Prepper, we provide three pipelines: `entry-pipeline`, `raw-trace-pipeline`, and `service-map-pipeline`. The following image provides an overview of how the pipelines work together to monitor trace analytics. 

<img src="{{site.url}}{{site.baseurl}}/images/data-prepper/trace-analytics/trace-analytics-pipeline.jpg" alt="Trace analytics pipeline overview">{: .img-fluid}


### OpenTelemetry trace source
 
The [OpenTelemetry source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/otel-traces/) accepts trace data from the OpenTelemetry Collector. The source follows the [OpenTelemetry Protocol](https://github.com/open-telemetry/opentelemetry-specification/tree/master/specification/protocol) and officially supports transport over gRPC and the use of industry-standard encryption (TLS/HTTPS).

### Processor

There are three processors for the trace analytics feature:

* otel_traces -- The *otel_traces* processor receives a collection of [span](https://github.com/opensearch-project/data-prepper/blob/fa65e9efb3f8d6a404a1ab1875f21ce85e5c5a6d/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/trace/Span.java) records from [*otel-trace-source*]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/otel-trace-source/), and performs stateful processing, extraction, and completion of trace-group-related fields.
* otel_traces_group -- The *otel_traces_group* processor fills in the missing trace-group-related fields in the collection of [span](https://github.com/opensearch-project/data-prepper/blob/298e7931aa3b26130048ac3bde260e066857df54/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/trace/Span.java) records by looking up the OpenSearch backend.
* service_map -- The *service_map* processor performs the required preprocessing for trace data and builds metadata to display the `service-map` dashboards.


### OpenSearch sink

OpenSearch provides a generic sink that writes data to OpenSearch as the destination. The [OpenSearch sink]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/opensearch/) has configuration options related to the OpenSearch cluster, such as endpoint, SSL, username/password, index name, index template, and index state management.

The sink provides specific configurations for the trace analytics feature. These configurations allow the sink to use indexes and index templates specific to trace analytics. The following OpenSearch indexes are specific to trace analytics:

* otel-v1-apm-span -- The *otel-v1-apm-span* index stores the output from the [otel_traces]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/otel-traces/) processor.
* otel-v1-apm-service-map -- The *otel-v1-apm-service-map* index stores the output from the [service_map]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/service-map/) processor.

## Trace tuning

Starting with version 0.8.x, Data Prepper supports both vertical and horizontal scaling for trace analytics. You can adjust the size of a single Data Prepper instance to meet your workload's demands and scale vertically. 

You can scale horizontally by using the core [peer forwarder]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/peer-forwarder/) to deploy multiple Data Prepper instances to form a cluster. This enables Data Prepper instances to communicate with instances in the cluster and is required for horizontally scaling deployments.

### Scaling recommendations

Use the following recommended configurations to scale Data Prepper. We recommend that you modify parameters based on the requirements. We also recommend that you monitor the Data Prepper host metrics and OpenSearch metrics to ensure that the configuration works as expected.

#### Buffer

The total number of trace requests processed by Data Prepper is equal to the sum of the `buffer_size` values in `otel-trace-pipeline` and `raw-trace-pipeline`. The total number of trace requests sent to OpenSearch is equal to the product of `batch_size` and `workers` in `raw-trace-pipeline`. For more information about `raw-trace-pipeline`, see [Trace analytics pipeline]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines).


We recommend the following when making changes to buffer settings:
 * The `buffer_size` value in `otel-trace-pipeline` and `raw-trace-pipeline` should be the same.
 * The `buffer_size` should be greater than or equal to `workers` * `batch_size` in the `raw-trace-pipeline`.
 

#### Workers 

The `workers` setting determines the number of threads that are used by Data Prepper to process requests from the buffer. We recommend that you set `workers` based on the CPU utilization. This value can be higher than the number of available processors because Data Prepper uses significant input/output time when sending data to OpenSearch.

#### Heap

Configure the Data Prepper heap by setting the `JVM_OPTS` environment variable. We recommend that you set the heap value to a minimum value of `4` * `batch_size` * `otel_send_batch_size` * `maximum size of indvidual span`.

As mentioned in the [OpenTelemetry Collector](#opentelemetry-collector) section, set `otel_send_batch_size` to a value of `50` in your OpenTelemetry Collector configuration.

#### Local disk

Data Prepper uses the local disk to store metadata required for service map processing, so we recommend storing only the following key fields: `traceId`, `spanId`, `parentSpanId`, `spanKind`, `spanName`, and `serviceName`. The `service-map` plugin stores only two files, each of which stores `window_duration` seconds of data. As an example, testing with a throughput of `3000 spans/second` resulted in the total disk usage of `4 MB`.

Data Prepper also uses the local disk to write logs. In the most recent version of Data Prepper, you can redirect the logs to your preferred path.


### AWS CloudFormation template and Kubernetes/Amazon EKS configuration files

The [AWS CloudFormation](https://github.com/opensearch-project/data-prepper/blob/main/deployment-template/ec2/data-prepper-ec2-deployment-cfn.yaml) template provides a user-friendly mechanism for configuring the scaling attributes described in the [Trace tuning](#trace-tuning) section.

The [Kubernetes configuration files](https://github.com/opensearch-project/data-prepper/blob/main/examples/dev/k8s/README.md) and [Amazon EKS configuration files](https://github.com/opensearch-project/data-prepper/blob/main/deployment-template/eks/README.md) are available for configuring these attributes in a cluster deployment.

### Benchmark tests

The benchmark tests were performed on an `r5.xlarge` EC2 instance with the following configuration:
 
 * `buffer_size`: 4096
 * `batch_size`: 256
 * `workers`: 8
 * `Heap`: 10 GB
 
This setup was able to handle a throughput of `2100` spans/second at `20` percent CPU utilization.

## Pipeline configuration

The following sections provide examples of different types of pipelines and how to configure each type. 

### Example: Trace analytics pipeline

The following example demonstrates how to build a pipeline that supports the [OpenSearch Dashboards Observability plugin]({{site.url}}{{site.baseurl}}/observability-plugin/trace/ta-dashboards/). This pipeline takes data from the OpenTelemetry Collector and uses two other pipelines as sinks. These two separate pipelines serve two different purposes and write to different OpenSearch indexes. The first pipeline prepares trace data for OpenSearch and enriches and ingests the span documents into a span index within OpenSearch. The second pipeline aggregates traces into a service map and writes service map documents into a service map index within OpenSearch.

Starting with Data Prepper version 2.0, Data Prepper no longer supports the `otel_traces_prepper` processor. The `otel_traces` processor replaces the `otel_traces_prepper` and `otel_trace_raw` processors and supports some of Data Prepper's recent data model changes. The following is an example YAML file configuration:

```yaml
entry-pipeline:
  delay: "100"
  source:
    otel_trace_source:
      ssl: false
  buffer:
    bounded_blocking:
      buffer_size: 500000
      batch_size: 10000
  sink:
    - pipeline:
        name: raw-trace-pipeline
    - pipeline:
        name: service-map-pipeline
raw-trace-pipeline:
  source:
    pipeline:
      name: entry-pipeline
  buffer:
    bounded_blocking:
      buffer_size: 500000
      batch_size: 10000
  processor:
    - otel_traces:
  sink:
    - opensearch:
        hosts: ["https://localhost:9200"]
        insecure: true
        username: admin
        password: admin_password
        index_type: trace-analytics-raw
service-map-pipeline:
  delay: "100"
  source:
    pipeline:
      name: entry-pipeline
  buffer:
    bounded_blocking:
      buffer_size: 500000
      batch_size: 10000
  processor:
    - service_map:
  sink:
    - opensearch:
        hosts: ["https://localhost:9200"]
        insecure: true
        username: admin
        password: admin_password
        index_type: trace-analytics-service-map
```
{% include copy.html %}

To maintain similar ingestion throughput and latency, scale the `buffer_size` and `batch_size` by the estimated maximum batch size in the client request payload. {: .tip}

#### Example: `otel trace`

The following is an example `otel-trace-source` .yaml file with SSL and basic authentication enabled. Note that you will need to modify your `otel-collector-config.yaml` file so that it uses your own credentials. 

```yaml
source:
  otel_trace_source:
    #record_type: event  # Add this when using Data Prepper 1.x. This option is removed in 2.0
    ssl: true
    sslKeyCertChainFile: /full/path/to/certfile.crt
    sslKeyFile: /full/path/to/keyfile.key
    authentication:
      http_basic:
        username: my-user
        password: my_s3cr3t
```
{% include copy.html %}

#### Example: pipeline.yaml

The following is an example `pipeline.yaml` file without SSL and basic authentication enabled for the `otel-trace-pipeline` pipeline:

```yaml
otel-trace-pipeline:
  # workers is the number of threads processing data in each pipeline.
  # We recommend same value for all pipelines.
  # default value is 1, set a value based on the machine you are running Data Prepper
  workers: 8
  # delay in milliseconds is how often the worker threads should process data.
  # Recommend not to change this config as we want the entry-pipeline to process as quick as possible
  # default value is 3_000 ms
  delay: "100"
  source:
    otel_trace_source:
      #record_type: event  # Add this when using Data Prepper 1.x. This option is removed in 2.0
      ssl: false
      authentication:
        unauthenticated:
  buffer:
    bounded_blocking:
      # buffer_size is the number of ExportTraceRequest from otel-collector the Data Prepper should hold in memory. 
      # We recommend to keep the same buffer_size for all pipelines. 
      # Make sure you configure sufficient heap
      # default value is 512
      buffer_size: 500000
      # This is the maximum number of request each worker thread will process within the delay.
      # Default is 8.
      # Make sure buffer_size >= workers * batch_size
      batch_size: 10000
  sink:
    - pipeline:
        name: raw-trace-pipeline
    - pipeline:
        name: entry-pipeline

raw-trace-pipeline:
  # Configure same as the otel-trace-pipeline
  workers: 8
  # We recommend using the default value for the raw-trace-pipeline.
  delay: "3000"
  source:
    pipeline: 
      name: otel-trace-pipeline
  buffer:
    bounded_blocking:
      # Configure the same value as in entry-pipeline
      # Make sure you configure sufficient heap
      # The default value is 512
      buffer_size: 500000
      # The raw processor does bulk request to your OpenSearch sink, so configure the batch_size higher.
      # If you use the recommended otel-collector setup each ExportTraceRequest could contain max 50 spans. https://github.com/opensearch-project/data-prepper/tree/v0.7.x/deployment/aws
      # With 64 as batch size each worker thread could process upto 3200 spans (64 * 50)
      batch_size: 10000
  processor:
    - otel_traces:
    # Optional: only if you want the group-filler stage.
    - otel_traces_group:
        hosts: [ "https://opensearch:9200" ]
        # Change to your credentials
        username: "admin"
        password: "admin"
        # Add a certificate file if you are accessing an OpenSearch cluster with a self-signed certificate
        #cert: /path/to/cert
        # If you are connecting to an Amazon OpenSearch Service domain without
        # Fine-Grained Access Control, enable these settings. Comment out the
        # username and password above.
        #aws_sigv4: true
        #aws_region: us-east-1
  sink:
    - opensearch:
        hosts: [ "https://opensearch:9200" ]
        index_type: trace-analytics-raw
        # Change to your credentials
        username: "admin"
        password: "admin"
        # Add a certificate file if you are accessing an OpenSearch cluster with a self-signed certificate
        #cert: /path/to/cert
        # If you are connecting to an Amazon OpenSearch Service domain without
        # Fine-Grained Access Control, enable these settings. Comment out the
        # username and password above.
        #aws_sigv4: true
        #aws_region: us-east-1

service-map-pipeline:
  workers: 8
  delay: 100
  source:
    pipeline: 
      name: otel-trace-pipeline
  processor:
    - service_map:
        # The window duration is the maximum length of time the data prepper stores the most recent trace data to evaluvate service-map relationships.
        # The default is 3 minutes, this means we can detect relationships between services from spans reported in last 3 minutes.
        # Set higher value if your applications have higher latency.
        window_duration: 180
  buffer:
    bounded_blocking:
      # buffer_size is the number of ExportTraceRequest from otel-collector the Data Prepper should hold in memory. 
      # We recommend to keep the same buffer_size for all pipelines. 
      # Make sure you configure sufficient heap
      # default value is 512
      buffer_size: 500000
      # This is the maximum number of request each worker thread will process within the delay.
      # Default is 8.
      # Make sure buffer_size >= workers * batch_size
      batch_size: 10000
  sink:
    - opensearch:
        hosts: [ "https://opensearch:9200" ]
        index_type: trace-analytics-service-map
        # Change to your credentials
        username: "admin"
        password: "admin"
        # Add a certificate file if you are accessing an OpenSearch cluster with a self-signed certificate
        #cert: /path/to/cert
        # If you are connecting to an Amazon OpenSearch Service domain without
        # Fine-Grained Access Control, enable these settings. Comment out the
        # username and password above.
        #aws_sigv4: true
        #aws_region: us-east-1

```
{% include copy.html %}

You need to modify the preceding configuration for your OpenSearch cluster so that the configuration matches your environment. Note that it has two `opensearch` sinks that need to be modified.
{: .note}

You must make the following changes:
* `hosts` – Set to your hosts.
* `username` – Provide your OpenSearch username.
* `password` – Provide your OpenSearch password.
* `aws_sigv4` – If you are using Amazon OpenSearch Service with AWS signing, set this value to `true`. It will sign requests with the default AWS credentials provider.
* `aws_region` – If you are using Amazon OpenSearch Service with AWS signing, set this value to your AWS Region.

For other configurations available for OpenSearch sinks, see [Data Prepper OpenSearch sink]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/opensearch/).

## OpenTelemetry Collector

You need to run OpenTelemetry Collector in your service environment. Follow [Getting Started](https://opentelemetry.io/docs/collector/getting-started/#getting-started) to install an OpenTelemetry collector. Ensure that you configure the collector with an exporter configured for your Data Prepper instance. The following example `otel-collector-config.yaml` file receives data from various instrumentations and exports it to Data Prepper.

### Example setup using Docker compose

The following is an example configuration for OpenSearch, OpenSearch Dashboards, Data Prepper, and OpenTelemetry Collector using Docker containers.

Create certificates you will use for Data Prepper and store them in the `certs` directory:

```bash
mkdir -p certs

# single self-signed server cert for Data Prepper; adds SAN=DNS:data-prepper
openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout certs/dp.key \
  -out    certs/dp.crt \
  -days 365 \
  -subj "/CN=data-prepper" \
  -addext "subjectAltName = DNS:data-prepper"
```
{% include copy.html %}

Create the following files:

`docker-compose.yaml` file:


```yaml
version: "3.8"

networks:
  opensearch-net:

services:
  opensearch:
    image: opensearchproject/opensearch:3.2.0
    environment:
      - discovery.type=single-node
      - OPENSEARCH_INITIAL_ADMIN_PASSWORD=<strong_password>
      - bootstrap.memory_lock=true
      - "OPENSEARCH_JAVA_OPTS=-Xms1g -Xmx1g"
    ulimits:
      memlock: { soft: -1, hard: -1 }
      nofile: { soft: 65536, hard: 65536 }
    ports:
      - "9200:9200"
      - "9600:9600"
    networks: [opensearch-net]

  dashboards:
    image: opensearchproject/opensearch-dashboards:3.2.0
    environment:
      OPENSEARCH_HOSTS: '["https://opensearch:9200"]'
      OPENSEARCH_USERNAME: admin
      # password must match OpenSearch
      OPENSEARCH_PASSWORD: "<strong_password>"   
    ports:
      - "5601:5601"
    depends_on: [opensearch]
    networks: [opensearch-net]

  data-prepper:
    image: opensearchproject/data-prepper:latest
    command: ["/usr/share/data-prepper/bin/data-prepper"]
    volumes:
      - ./pipelines:/usr/share/data-prepper/pipelines:ro
      - ./config/data-prepper-config.yaml:/usr/share/data-prepper/config/data-prepper-config.yaml:ro
      - ./certs:/usr/share/data-prepper/certs:ro
    ports:
      # Data Prepper control API (HTTP)
      - "4900:4900"
      # OTLP gRPC (TLS)
      - "21890:21890"    
    depends_on: [opensearch]
    networks: [opensearch-net]

  otel-collector:
    image: otel/opentelemetry-collector:latest
    command: ["--config=/etc/otelcol/otel-collector.yaml"]
    volumes:
      - ./otel-collector.yaml:/etc/otelcol/otel-collector.yaml:ro
    depends_on: [data-prepper]
    networks: [opensearch-net]
    ports:
      # OTLP gRPC
      - "4317:4317"
      # OTLP HTTP (optional)
      - "4318:4318"
```
{% include copy.html %}


Follow the [password requirements]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#password-requirements) to set a strong admin password.
{: .note}

`pipelines/pipelines.yaml` file:

```yaml
entry-pipeline:
  source:
    otel_trace_source:
      port: 21890
      ssl: true
      sslKeyCertChainFile: "certs/dp.crt"
      sslKeyFile: "certs/dp.key"
      authentication:
        unauthenticated:
  buffer:
    bounded_blocking:
      buffer_size: 500000
      batch_size: 10000
  sink:
    - pipeline:
        name: raw-trace-pipeline
    - pipeline: 
        name: service-map-pipeline

raw-trace-pipeline:
  source:
    pipeline: 
      name: entry-pipeline
  processor:
    - otel_traces:
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: <strong_password>
        index_type: trace-analytics-raw

service-map-pipeline:
  source:
    pipeline: 
      name: entry-pipeline
  processor:
    - service_map:
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: <strong_password>
        index_type: trace-analytics-service-map
```
{% include copy.html %}

`config/data-prepper-config.yaml` file:

```yaml
# Disable TLS on the Data Prepper REST API (local only)
ssl: false
serverPort: 4900

peer_forwarder:
  ssl: false
  discovery_mode: local_node
```
{% include copy.html %}

`otel-collector.yaml` file:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  otlp:
    endpoint: data-prepper:21890
    tls:
      # TLS is enabled, but hostname/chain is not verified
      insecure_skip_verify: true   
  # optional: see incoming/outgoing spans in logs
  debug:
    verbosity: basic

processors:
  batch: {}

extensions:
  health_check: {}

service:
  extensions: [health_check]
  telemetry:
    logs:
      level: debug
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp, debug]
```
{% include copy.html %}

Start all the containers using the `docker-compose up` command.

Run the following command to start `telemetrygen`, which generates synthetic OpenTelemetry traces for 30 seconds (at approximately 50 spans/sec) and sends them to `otel-collector:4317` over plaintext gRPC:

```bash
docker run --rm --network anton_opensearch-net \
  ghcr.io/open-telemetry/opentelemetry-collector-contrib/telemetrygen:latest \
  traces \
  --otlp-endpoint=otel-collector:4317 \
  --otlp-insecure \
  --duration=30s \
  --rate=50
```
{% include copy.html %}

This will send sample telemetry to the alias `otel-v1-apm-span` and store the documents in the index `otel-v1-apm-span-000001`. The stored documents will have the following structure: 

```json
"hits": [
  {
    "_index": "otel-v1-apm-span-000001",
    "_id": "b7446942445f1f0220cc9e3707dcd7d3/153de4602f5169d3",
    "_score": 1,
    "_source": {
      "traceId": "b7446942445f1f0220cc9e3707dcd7d3",
      "droppedLinksCount": 0,
      "kind": "SPAN_KIND_CLIENT",
      "droppedEventsCount": 0,
      "traceGroupFields": {
        "endTime": "2025-11-11T12:52:42.791867180Z",
        "durationInNanos": 123000,
        "statusCode": 0
      },
      "traceGroup": "lets-go",
      "serviceName": "telemetrygen",
      "parentSpanId": "",
      "spanId": "153de4602f5169d3",
      "traceState": "",
      "name": "lets-go",
      "startTime": "2025-11-11T12:52:42.791744180Z",
      "links": [],
      "endTime": "2025-11-11T12:52:42.791867180Z",
      "droppedAttributesCount": 0,
      "durationInNanos": 123000,
      "events": [],
      "span.attributes.network@peer@address": "1.2.3.4",
      "instrumentationScope.name": "telemetrygen",
      "span.attributes.peer@service": "telemetrygen-server",
      "resource.attributes.service@name": "telemetrygen",
      "status.code": 0
    }
  },
  ...
```
{% include copy.html %}

After you run OpenTelemetry in your service environment, you must configure your application to use the OpenTelemetry Collector. The OpenTelemetry Collector typically runs alongside your application.

## Next steps and more information

The [OpenSearch Dashboards Observability plugin]({{site.url}}{{site.baseurl}}/observability-plugin/trace/ta-dashboards/) documentation provides additional information about configuring OpenSearch to view trace analytics in OpenSearch Dashboards.

For more information about how to tune and scale Data Prepper for trace analytics, see [Trace tuning](#trace-tuning).

## Migrating to Data Prepper 2.0

Starting with Data Prepper version 1.4, trace processing uses Data Prepper's event model. This allows pipeline authors to configure other processors to modify spans or traces. To provide a migration path, Data Prepper version 1.4 introduced the following changes:

* `otel_trace_source` has an optional `record_type` parameter that can be set to `event`. When configured, it will output event objects.
* `otel_traces` replaces `otel_traces_prepper` for event-based spans.
* `otel_traces_group` replaces `otel_traces_group_prepper` for event-based spans.

In Data Prepper version 2.0, `otel_trace_source` will only output events. Data Prepper version 2.0 also removes `otel_traces_prepper` and `otel_traces_group_prepper` entirely. To migrate to Data Prepper version 2.0, you can configure your trace pipeline using the event model.
 
