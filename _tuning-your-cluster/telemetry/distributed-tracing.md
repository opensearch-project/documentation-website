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

OpenSearch generates traces for HTTP requests and a subset of transport requests. OpenSearch keeps completed spans in memory and sends them to an exporter in batches. To configure the export, specify the following static settings in `opensearch.yml`.

Setting | Description
:--- | :---
`telemetry.otel.tracer.exporter.max_queue_size` | The maximum number of spans kept in memory. When the queue is full, OpenSearch drops new spans. Default is `2048`.
`telemetry.otel.tracer.exporter.batch_size` | The maximum number of spans sent to the exporter in a single batch. Must be less than `telemetry.otel.tracer.exporter.max_queue_size`. Default is `512`.
`telemetry.otel.tracer.exporter.delay` | The interval at which OpenSearch sends spans to the exporter, even if the batch is not full. Default is `2s`.
`telemetry.otel.tracer.span.exporter.class` | The exporter that persists the spans. Valid values are `io.opentelemetry.exporter.logging.LoggingSpanExporter`, which writes spans to the `<cluster-name>_otel_traces.log` file in the logs directory, and `io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter`, which sends spans to an OpenTelemetry Collector using gRPC. Default is `io.opentelemetry.exporter.logging.LoggingSpanExporter`.

To send spans to an OpenTelemetry Collector, run the collector on each node and add the following setting to `opensearch.yml`. By default, the exporter sends spans to the `http://localhost:4317/` endpoint. From the collector, you can send spans to a tracing backend, such as Jaeger or OpenSearch:

```yaml
telemetry.otel.tracer.span.exporter.class: io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
```
{% include copy.html %}

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

Tracing every request consumes system resources. To reduce the number of traces that OpenSearch records, OpenSearch samples requests. Spans that belong to an existing trace follow the sampling decision made for the first span in the trace. For a request that starts a new trace, OpenSearch makes the sampling decision before creating the first span, in the following order:

1. If the request contains the `trace` HTTP header, OpenSearch uses its value. A value of `true` records the trace, and a value of `false` drops it, regardless of the sampling probability.
1. Otherwise, OpenSearch records the trace with the probability configured in the dynamic `telemetry.tracer.sampler.probability` setting. The setting accepts values from 0 to 1. Default is `0.01`, which samples 1% of requests. Transport requests that start a new trace, such as internal requests between nodes, are sampled at a lower rate.

For example, the following request samples 5% of requests:

```json
PUT _cluster/settings
{
  "persistent": {
    "telemetry.tracer.sampler.probability": 0.05
  }
}
```
{% include copy-curl.html %}

To debug a specific request, send it with the `trace` header set to `true`:

```bash
curl -H "trace: true" "http://localhost:9200/_search"
```
{% include copy.html %}

OpenSearch does not support tail sampling, in which the sampling decision is made after a trace is complete. To use tail sampling, export all spans to an OpenTelemetry Collector and configure tail sampling in the collector. For more information, see the [OpenTelemetry sampling documentation](https://opentelemetry.io/docs/concepts/sampling/#tail-sampling).
