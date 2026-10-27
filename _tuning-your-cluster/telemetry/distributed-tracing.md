---
layout: default
title: Distributed tracing
parent: Telemetry
nav_order: 20
redirect_from:
  - /observing-your-data/trace/distributed-tracing/
---

# Distributed tracing

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/6750).
{: .warning}

Distributed tracing records the path of requests as they move through an OpenSearch cluster. A _trace_ is the complete path of a single request. A trace contains a series of _spans_, each of which records the start and end time of one operation and can include metadata, such as attributes and events. Use distributed tracing to find the operations that add latency to a request and the source of errors.

Distributed tracing traces requests that OpenSearch processes. To analyze traces from your own applications, see [Trace analytics]({{site.url}}{{site.baseurl}}/observing-your-data/trace/index/).

## Enabling distributed tracing

To enable distributed tracing, first enable the telemetry feature flag and install the `telemetry-otel` plugin. For more information, see [Enabling telemetry]({{site.url}}{{site.baseurl}}/tuning-your-cluster/telemetry/index/#enabling-telemetry).

Then enable tracing:

1. Add the following setting to `opensearch.yml` on each node and restart the node:

   ```yaml
   telemetry.feature.tracer.enabled: true
   ```
   {% include copy.html %}

2. Enable the tracer in the running cluster by updating the dynamic `telemetry.tracer.enabled` setting:

   ```json
   PUT _cluster/settings
   {
     "persistent": {
       "telemetry.tracer.enabled": true
     }
   }
   ```
   {% include copy-curl.html %}

## Configuring trace export


Currently, the distributed tracing feature generates traces and spans for HTTP requests and a subset of transport requests. These traces and spans are initially kept in memory using the OpenTelemetry `BatchSpanProcessor` and are then sent to an exporter based on configured settings. The following are the key components:

1. **Span processors:** As spans conclude on the request path, OpenTelemetry provides them to the `SpanProcessor` for processing and exporting. The OpenSearch distributed tracing framework uses the `BatchSpanProcessor`, which batches spans for specific configurable intervals and then sends them to the exporter. The following configurations are available for the `BatchSpanProcessor`:
    - `telemetry.otel.tracer.exporter.max_queue_size`: Defines the maximum queue size. When the queue reaches this value, it will be written to the exporter. Default is `2048`. 
    - `telemetry.otel.tracer.exporter.delay`: Defines the delay---a time period after which spans in the queue will be flushed, even if there are not enough spans to fill the `max_queue_size`. Default is `2 seconds`.
    - `telemetry.otel.tracer.exporter.batch_size`: Configures the maximum batch size for each export to reduce input/output. This value should always be less than the `max_queue_size`. Default is `512`.
2. **Exporters:** Exporters are responsible for persisting the data. OpenTelemetry provides several out-of-the-box exporters, and OpenSearch supports the following:
    - `LoggingSpanExporter`: Exports spans to a log file, generating a separate file in the logs directory `_otel_traces.log`. Default is `telemetry.otel.tracer.span.exporter.class=io.opentelemetry.exporter.logging.LoggingSpanExporter`.
    - `OtlpGrpcSpanExporter`: Exports spans through gRPC. To use this exporter, you need to install the `otel-collector` on the node. By default, it writes to the http://localhost:4317/ endpoint. To use this exporter, set the following static setting: `telemetry.otel.tracer.span.exporter.class=io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`.

## Identifying traces from a specific cluster
**Introduced 3.10**
{: .label .label-purple }

Spans include the OpenTelemetry resource attribute `service.name`, which most tracing backends use as the primary dimension for grouping and filtering traces. By default, `service.name` is set to `OpenSearch`, so when several clusters export to the same backend, their traces cannot be distinguished from one another.

To identify traces from a specific cluster, configure the `telemetry.otel.service.name` static setting in the `opensearch.yml` file:

```yaml
telemetry.otel.service.name: my-service
```
{% include copy.html %}

Because this is a static setting, it is applied when the node starts and cannot be updated on a running cluster. If the setting is not configured, spans continue to be exported with `service.name` set to `OpenSearch`.

## Sampling

Distributed tracing can generate numerous spans, consuming system resources unnecessarily. To reduce the number of traces, also called _samples_, you can configure different sampling thresholds. By default, sampling is configured to include only 1% of all HTTP requests. Sampling has the following types:

1. **Head sampling:** Sampling decisions are made before initiating the root span of a request. OpenSearch supports two head sampling methods:
    - **Probabilistic:** A blanket limit on incoming requests, dynamically adjustable with the `telemetry.tracer.sampler.probability` setting. This setting ranges between 0 and 1. Default is 0.01, which indicates that 1% of incoming requests are sampled.
    - **On-Demand:** For debugging specific requests, you can send the `trace=true` attribute as part of the HTTP headers, causing those requests to be sampled regardless of the probabilistic sampling setting.
2. **Tail sampling:** To configure tail sampling, follow the instructions in [OpenTelemetry tail sampling documentation](https://opentelemetry.io/docs/concepts/sampling/#tail-sampling). Configuration depends on the type of collector you choose.

## Collection of spans

The `SpanProcessor` writes spans to the exporter, and the choice of exporter defines the endpoint, which can be logs or gRPC. To collect spans by using gRPC, you need to configure the collector as a sidecar process running on each OpenSearch node. From the collectors, these spans can be written to the sink of your choice, such as Jaeger, Prometheus, Grafana, or FileStore, for further analysis.
