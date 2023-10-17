---
layout: default
title: Distrbuted tracing 
parent: Trace Analytics
nav_order: 65
---

# Distributed tracing
This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/6750).    
{: .warning}

Distributed tracing is used to monitor and debug distributed systems. You can track the flow of requests through the system and identify performance bottlenecks and errors. A _trace_ is a complete end-to-end path of a request as it flows through a distributed system. It represents the journey of a specific operation as it traverses various components and services in a distributed architecture. In distributed tracing, a single trace contains a series of tagged time intervals called _spans_. Spans have a start and end time and may include other metadata like logs or tags to help classify what happened. 

Use distributed tracing for the following purposes:

- **Optimize performance:** Identifying and resolving bottlenecks, reducing latency in your applications.
- **Troubleshoot errors:** Quickly pinpointing the source of errors or unexpected behavior in your distributed system.
- **Allocate resources:** Optimizing resource allocation by understanding usage patterns of different services.
- **Visualize service dependencies:** Visualizing dependencies between services, helping you to manage architectures. 

## Distributed tracing pipeline

OpenSearch provides a distributed tracing pipeline that can be used to ingest, process, and visualize tracing data with query and alerting functionality. [OpenTelemetry](https://opentelemetry.io/) is an open-source observability framework that provides a set of APIs, libraries, agents, and collectors for generating, capturing, and exporting telemetry data. The distributed tracing pipeline consists of the following components: 

- **Instrumentation:** Instrumenting your application code with OpenTelemetry SDKs.
- **Propagation:** Injecting trace context into requests as they propagate through your system.
- **Collection:** Collecting trace data from your application.
- **Processing:** Aggregating trace data from multiple sources and enriching it with additional metadata.
- **Exporting:** Sending trace data to a backend for storage and analysis. 

OpenSearch is often chosen as the sink for storing trace data.

## Trace analytics

OpenSearch provides a `trace-analytics` plugin for visualizing trace data in real time. The plugin includes prebuilt dashboards for analyzing trace data, such as service maps, latency histograms, and error rates. With OpenSearch's distributed tracing pipeline, you can quickly identify bottlenecks and errors in your applications. See the [Trace analytics]({{site.url}}{{site.baseurl}}/observing-your-data/trace/index/) documentation for more information. 

## Get started

The distributed tracing feature is experimental as of OpenSearch 2.10. To begin using the distributed tracing feature, you need to first enable it using the `opensearch.experimental.feature.telemetry.enabled` feature flag and subsequently activate the tracer, using the dynamic setting `telemetry.tracer.enabled`. It's important to exercise caution when enabling this feature because it can consume system resources. Detailed information on enabling and configuring distributed tracing, including on-demand troubleshooting and request sampling, is described in the following sections.

### Enabling the flag on a node using tarball

The enable flag is toggled using a new Java Virtual Machine (JVM) parameter that is set either in `OPENSEARCH_JAVA_OPTS` or in `config/jvm.options`.

#### Option 1: Enable the experimental feature flag in the `opensearch.yml` file

1. Change to the top directory of your OpenSearch installation:

```bash
cd \path\to\opensearch
```

2. Open your OpenSearch configuration folder, and then open the `opensearch.yml` file with a text editor.
3. Add the following line:

```bash
opensearch.experimental.feature.telemetry.enabled=true
```
{% include copy.html %}

4. Save your changes and close the file.

#### Option 2: Modify jvm.options

Add the following lines to `config/jvm.options` before starting the OpenSearch process to enable the feature and its dependency:

```bash
-Dopensearch.experimental.feature.telemetry.enabled=true
```
{% include copy.html %}

Run OpenSearch:

```bash
./bin/opensearch
```
{% include copy.html %}

#### Option 3: Enable from an environment variable

As an alternative to directly modifying `config/jvm.options`, you can define the properties by using an environment variable. You can enable this feature in a single command when you start OpenSearch or by setting an environment variable.

To add these flags inline when starting OpenSearch, run the following command:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.telemetry.enabled=true" ./opensearch-2.9.0/bin/opensearch
```
{% include copy.html %}

To define the environment variable separately, prior to running OpenSearch, run the following command:

```bash
export OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.telemetry.enabled=true"
 ./bin/opensearch
```
{% include copy.html %}

### Enable with Docker containers

If you’re running Docker, add the following line to `docker-compose.yml` under `environment`:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.telemetry.enabled=true"
```
{% include copy.html %}

### Enable for OpenSearch development

To enable the distributed tracing feature, you must first add the correct properties to `run.gradle` before building OpenSearch. See the [Developer Guide](https://github.com/opensearch-project/OpenSearch/blob/main/DEVELOPER_GUIDE.md#gradle-build) for information about how to use Gradle to build OpenSearch.

Add the following properties to `run.gradle` to enable the feature:

```json
testClusters {
  runTask {
    testDistribution = 'archive'
 if (numZones > 1) numberOfZones = numZones
    if (numNodes > 1) numberOfNodes = numNodes
    systemProperty 'opensearch.experimental.feature.telemetry.enabled', 'true'
    }
 }
 ```
 {% include copy.html %}

### Enable distributed tracing

Once you've enabled the feature flag, you can enable the tracer (which is disabled by default) by using the following dynamic setting that enables tracing in the running cluster:

```bash
telemetry.tracer.enabled=true
```
{% include copy.html %}

## Install the OpenSearch OpenTelemetry plugin

The OpenSearch distributed tracing framework aims to support various telemetry solutions through plugins. The OpenSearch OpenTelemetry plugin `telemetry-otel` is available and must be installed to enable tracing. The following guide provides you with the installation instructions.

### Exporters

Currently, the distributed tracing feature generates traces and spans for HTTP requests and a subset of transport requests. These traces and spans are initially kept in memory using the OpenTelemetry `BatchSpanProcessor` and are then sent to an exporter based on configured settings. The following are the key components:

1. **Span processors:** As spans conclude on the request path, OpenTelemetry provides them to the `SpanProcessor` for processing and exporting. The OpenSearch distributed tracing framework uses the `BatchSpanProcessor`, which batches spans for specific configurable intervals and then sends them to the exporter. The following configurations are available for the `BatchSpanProcessor`:
    - `telemetry.otel.tracer.exporter.max_queue_size`: Defines the maximum queue size. When the queue reaches this value, it will be written to the exporter. Default is `2048`. 
    - `telemetry.otel.tracer.exporter.delay`: Defines the delay---a time period after which spans in the queue will be flushed, even if there are not enough spans to fill the `max_queue_size`. Default is `2 seconds`.
    - `telemetry.otel.tracer.exporter.batch_size`: Configures the maximum batch size for each export to reduce input/output. This value should always be less than the `max_queue_size`. Default is `512`.
2. **Exporters:** Exporters are responsible for persisting the data. OpenTelemetry provides several out-of-the-box exporters, and OpenSearch supports the following:
    - `LoggingSpanExporter`: Exports spans to a log file, generating a separate file in the logs directory `_otel_traces.log`. Default is `telemetry.otel.tracer.span.exporter.class=io.opentelemetry.exporter.logging.LoggingSpanExporter`.
    - `OtlpGrpcSpanExporter`: Exports spans through gRPC. To use this exporter, you need to install the `otel-collector` on the node. By default, it writes to the http://localhost:4317/ endpoint. To use this exporter, set the following static setting: `telemetry.otel.tracer.span.exporter.class=org.opensearch.telemetry.tracing.exporter.OtlpGrpcSpanExporterProvider`.
    - `LoggingSpanExporter`: Exports spans to a log file, generating a separate file in the logs directory `_otel_traces.log`. Default is `telemetry.otel.tracer.span.exporter.class=io.opentelemetry.exporter.logging.LoggingSpanExporter`.

### Sampling

Distributed tracing can generate numerous spans, consuming system resources unnecessarily. To reduce the number of traces, also called _samples_, you can configure different sampling thresholds. By default, sampling is configured to include only 1% of all HTTP requests. Sampling has the following types:

1. **Head sampling:** Sampling decisions are made before initiating the root span of a request. OpenSearch supports two head sampling methods:
    - **Probabilistic:** A blanket limit on incoming requests, dynamically adjustable with the `telemetry.tracer.sampler.probability` setting. This setting ranges between 0 and 1. Default is 0.01, which indicates that 1% of incoming requests are sampled.
    - **On-Demand:** For debugging specific requests, you can send the `trace=true` attribute as part of the HTTP headers, causing those requests to be sampled regardless of the probabilistic sampling setting.
2. **Tail sampling:** To configure tail sampling, follow the instructions in [OpenTelemetry tail sampling documentation](https://opentelemetry.io/docs/concepts/sampling/#tail-sampling). Configuration depends on the type of collector you choose.

### Collection of spans

The `SpanProcessor` writes spans to the exporter, and the choice of exporter defines the endpoint, which can be logs or gRPC. To collect spans by using gRPC, you need to configure the collector as a sidecar process running on each OpenSearch node. From the collectors, these spans can be written to the sink of your choice, such as Jaeger, Prometheus, Grafana, or FileStore, for further analysis.
