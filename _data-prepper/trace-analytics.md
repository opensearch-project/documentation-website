---
layout: default
title: Trace analytics
nav_order: 21
---

# Trace analytics

## Introduction

Data Prepper ingests [Trace Analytics](https://opensearch.org/docs/latest/observability-plugin/trace/index/) into OpenSearch and Amazon OpenSearch Service. Data Prepper is a last mile server-side component which collects telemetry data from [AWS Distro OpenTelemetry collector](https://aws-otel.github.io/docs/getting-started/collector) or [OpenTelemetry collector](https://github.com/open-telemetry/opentelemetry-collector) and transforms it for OpenSearch. The transformed trace data is the visualized using the [OpenSearch Dashboards Observability plugin](https://opensearch.org/docs/latest/observability-plugin/trace/ta-dashboards/), which provides at-a-glance visibility into your application performance, along with the ability to drill down on individual traces.

Here is how all the components work in trace analytics:

![Trace analytics component]({{site.url}}{{site.baseurl}}/images/data-prepper/trace-analytics/trace-analytics-components.png)

In your service environment, you need to run OpenTelemetry collector. You can run it as a sidecar or daemonset for EKS, a sidecar for ECS, or an agent on EC2. You should configure the collector to export trace data to Data Prepper. Then, you need to deploy Data Prepper as an intermediate component and configure it to send the enriched trace data to your OpenSearch cluster or Amazon OpenSearch Service domain. Finally, use OpenSearch Dashboards to visualize and detect problems in your distributed applications.

## Trace analytics pipeline

To achieve trace analytics in Data Prepper, we have three pipelines: `entry-pipeline`, `raw-trace-pipeline` and `service-map-pipeline`.

![Trace analytics pipeline]({{site.url}}{{site.baseurl}}/images/data-prepper/trace-analytics/trace-analytics-feature.jpeg)


### OpenTelemetry trace source

The [OpenTelemetry source](../data-prepper-plugins/otel-trace-source/README.md) accepts trace data from the OpenTelemetry collector. The source depends on [OpenTelemetry Protocol](https://github.com/open-telemetry/opentelemetry-specification/tree/master/specification/protocol). The source officially support transport over gRPC. The source also supports industry-standard encryption (TLS/HTTPS).

### Processor

We have two processor for the Trace Analytics feature,
* *otel_trace_raw* -  This is a processor that receives collection of [Span](../../data-prepper-api/src/main/java/com/amazon/dataprepper/model/trace/Span.java) records sent from [otel-trace-source](../dataPrepper-plugins/otel-trace-source), does stateful processing on extracting and filling-in trace group related fields.
* *otel_trace_group* -  This is a processor that fills in the missing trace group related fields in the collection of [Span](../../data-prepper-api/src/main/java/com/amazon/dataprepper/model/trace/Span.java) records by looking up the OpenSearch backend.
* *service_map_stateful* -  This processor performs the required preprocessing on the trace data and build metadata to display the service-map OpenSearch Dashboards dashboards.

### OpenSearch sink

We have a generic sink that writes the data to OpenSearch as the destination. The [OpenSearch sink](../data-prepper-plugins/opensearch/README.md) has configuration options related to OpenSearch cluster, such as endpoint, SSL, username/password, index name, index template, and index state management.

For the trace analytics feature, the sink has specific configurations which enables the sink to use indices and index templates specific to this feature. Trace analytics specific OpenSearch indices are,

* *otel-v1-apm-span* -  This index stores the output from [otel_trace_raw](../data-prepper-plugins/otel-trace-raw-processor/README.md).
* *otel-v1-apm-service-map* - This index stores the output from the [service_map_stateful](https://github.com/opensearch-project/documentation-website/blob/main/_data-prepper/configuration/processors/service-map-stateful.md).

<!--- ADD TRACE TUNING CONTENT-->

## Pipeline configuration

The following sections describe pipeline configuration.

### Trace analytics pipeline example

The following example demonstrates how to build a pipeline that supports the [OpenSearch Dashboards Observability plugin]({{site.url}}{{site.baseurl}}/observability-plugin/trace/ta-dashboards/). This pipeline takes data from the OpenTelemetry Collector and uses two other pipelines as sinks. These two separate pipelines index trace and the service map documents for the dashboard plugin.

Starting from Data Prepper 2.0, Data Prepper no longer supports `otel_trace_raw_prepper` processor due to the Data Prepper internal data model evolution. 
Instead, users should use `otel_trace_raw`.

```yml
entry-pipeline:
  delay: "100"
  source:
    otel_trace_source:
      ssl: false
  buffer:
    bounded_blocking:
      buffer_size: 10240
      batch_size: 160
  sink:
    - pipeline:
        name: "raw-trace-pipeline"
    - pipeline:
        name: "service-map-pipeline"
raw-pipeline:
  source:
    pipeline:
      name: "entry-pipeline"
  buffer:
    bounded_blocking:
      buffer_size: 10240
      batch_size: 160
  processor:
    - otel_trace_raw:
  sink:
    - opensearch:
        hosts: ["https://localhost:9200"]
        insecure: true
        username: admin
        password: admin
        index_type: trace-analytics-raw
service-map-pipeline:
  delay: "100"
  source:
    pipeline:
      name: "entry-pipeline"
  buffer:
    bounded_blocking:
      buffer_size: 10240
      batch_size: 160
  processor:
    - service_map_stateful:
  sink:
    - opensearch:
        hosts: ["https://localhost:9200"]
        insecure: true
        username: admin
        password: admin
        index_type: trace-analytics-service-map
```

To maintain similar ingestion throughput and latency, scale the `buffer_size` and `batch_size` by the estimated maximum batch size in the client request payload.
{: .tip}


#### Example: otel trace

Example `otel-trace-source` with SSL and Basic Authentication enabled. Note that you will have to change your `otel-collector-config.yaml` accordingly:

```yaml
source:
  otel_trace_source:
    #record_type: event  # Add this when using Data Prepper 1.x. This option is removed in 2.0
    ssl: true
    sslKeyCertChainFile: "/full/path/to/certfile.crt"
    sslKeyFile: "/full/path/to/keyfile.key"
    authentication:
      http_basic:
        username: "my-user"
        password: "my_s3cr3t"
```


#### Example: pipeline.yaml

The following is an example `pipeline.yaml` file without SSL and Basic Authentication for the `otel-trace-pipeline` pipeline:

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
      ssl: false # Change this to enable encryption in transit
      authentication:
        unauthenticated:
  buffer:
    bounded_blocking:
       # buffer_size is the number of ExportTraceRequest from otel-collector the data prepper should hold in memeory. 
       # We recommend to keep the same buffer_size for all pipelines. 
       # Make sure you configure sufficient heap
       # default value is 512
       buffer_size: 512
       # This is the maximum number of request each worker thread will process within the delay.
       # Default is 8.
       # Make sure buffer_size >= workers * batch_size
       batch_size: 8
  sink:
    - pipeline:
        name: "raw-trace-pipeline"
    - pipeline:
        name: "entry-pipeline"
raw-pipeline:
  # Configure same as the otel-trace-pipeline
  workers: 8 
  # We recommend using the default value for the raw-pipeline.
  delay: "3000" 
  source:
    pipeline:
      name: "entry-pipeline"
  buffer:
      bounded_blocking:
         # Configure the same value as in entry-pipeline
         # Make sure you configure sufficient heap
         # The default value is 512
         buffer_size: 512
         # The raw processor does bulk request to your OpenSearch sink, so configure the batch_size higher.
         # If you use the recommended otel-collector setup each ExportTraceRequest could contain max 50 spans. https://github.com/opensearch-project/data-prepper/tree/v0.7.x/deployment/aws
         # With 64 as batch size each worker thread could process upto 3200 spans (64 * 50)
         batch_size: 64
  processor:
    - otel_trace_raw:
    - otel_trace_group:
        hosts: [ "https://localhost:9200" ]
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
        hosts: [ "https://localhost:9200" ]
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
  delay: "100"
  source:
    pipeline:
      name: "entry-pipeline"
  processor:
    - service_map_stateful:
        # The window duration is the maximum length of time the data prepper stores the most recent trace data to evaluvate service-map relationships. 
        # The default is 3 minutes, this means we can detect relationships between services from spans reported in last 3 minutes.
        # Set higher value if your applications have higher latency. 
        window_duration: 180 
  buffer:
      bounded_blocking:
         # buffer_size is the number of ExportTraceRequest from otel-collector the data prepper should hold in memeory. 
         # We recommend to keep the same buffer_size for all pipelines. 
         # Make sure you configure sufficient heap
         # default value is 512
         buffer_size: 512
         # This is the maximum number of request each worker thread will process within the delay.
         # Default is 8.
         # Make sure buffer_size >= workers * batch_size
         batch_size: 8
  sink:
    - opensearch:
        hosts: [ "https://localhost:9200" ]
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

You will need to modify the configuration above for your OpenSearch cluster. Note that it has two
`opensearch` sinks which need to be modified.

You must make the following changes:
* `hosts` - Set to your hosts
* `username` - Provide the OpenSearch username.
* `password` - Provide your OpenSearch password.
* `aws_sigv4` - If you are Amazon OpenSearch Service with AWS signing, set this value to `true`. It will sign requests with the default AWS credentials provider.
* `aws_region` - If you are Amazon OpenSearch Service with AWS signing, set this value to your region.

The the [Data Prepper OpenSearch Sink](https://github.com/opensearch-project/documentation-website/blob/main/_data-prepper/configuration/sinks/opensearch.md) documents
other configurations available for OpenSearch.

## OpenTelemetry Collector

You will have to run OpenTelemetry collector in your service environment. You can find the installation guide of OpenTelemetry collector [here](https://opentelemetry.io/docs/collector/getting-started/#getting-started).  Ensure that you configure the collector with an exporter configured to your Data Prepper. Below is an example `otel-collector-config.yaml` that receives data from various instrumentations and export it to Data Prepper.

### Example otel-collector-config.yaml file

The following is an example `otel-collector-config.yaml` file:

```
receivers:
  jaeger:
    protocols:
      grpc:
  otlp:
    protocols:
      grpc:
  zipkin:

processors:
  batch/traces:
    timeout: 1s
    send_batch_size: 50

exporters:
  otlp/data-prepper:
    endpoint: localhost:21890
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [jaeger, otlp, zipkin]
      processors: [batch/traces]
      exporters: [otlp/data-prepper]
```

After you run OpenTelemetry in your service environment, you must configure your application to use the OpenTelemetry collector. The OpenTelemetry collector typically runs alongside your application.

## Next steps and more information

The [OpenSearch Dashboards Observability plugin]({{site.url}}{{site.baseurl}}/observability-plugin/trace/ta-dashboards/) documentation provides additional details on configuring OpenSearch for viewing trace analytics. In particular, it documents how to use OpenSearch Dashboards.

<!--- Adjust this section after adding in Trace tuning content

The [Trace Tuning page](trace_tuning.md) has information to help you tune and scale Data Prepper for
trace analytics use cases.

--->

## Migrating to Data Prepper 2.0

Starting in Data Prepper 1.4, the trace processing uses Data Prepper's Event model. This allows pipeline authors the ability to configure other processors to modify spans or traces. To provide a migration path, Data Prepper 1.4 introduced the following changes.
* The `otel_trace_source` has an optional parameter `record_type` which can be set to `event`. When configured, it will output event objects.
* The `otel_trace_raw` replaces `otel_trace_raw_prepper` for event-based spans.
* The `otel_trace_group` replaces `otel_trace_group_prepper` for event-based spans.

In Data Prepper 2.0, the `otel_trace_source` will only output Events. Data Prepper 2.0 also removes
`otel_trace_raw_prepper` and `otel_trace_group_prepper` entirely. To help migrate to 2.0,
you can configure your trace pipeline using the Event model.
