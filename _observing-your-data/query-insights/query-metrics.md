---
layout: default
title: Query metrics
parent: Query insights
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/observing-your-data/query-insights/query-metrics/
---

# Query metrics

Key query [metrics](#metrics), such as aggregation types, query types, latency, and resource usage per query type, are captured along the search path by using the OpenTelemetry (OTel) instrumentation framework. The telemetry data can be consumed using OTel metrics [exporters]({{site.url}}{{site.baseurl}}/observing-your-data/trace/distributed-tracing/#exporters).

## Configuring query metric generation

To configure query metric generation, use the following steps.

### Step 1: Install the Query Insights plugin

For information about installing the Query Insights plugin, see [Installing the Query Insights plugin]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/index/#installing-the-query-insights-plugin).

### Step 2: Install the OpenTelemetry plugin

For information about installing the OpenTelemetry plugin, see [Distributed tracing]({{site.url}}{{site.baseurl}}/observing-your-data/trace/distributed-tracing/).

### Step 3: Enable query metrics

Enable query metrics by configuring the following `opensearch.yml` settings:

```yaml
telemetry.feature.metrics.enabled: true
search.query.metrics.enabled: true
```
{% include copy.html %}

The following is a complete sample configuration that includes a telemetry configuration:

```yaml
# Enable query metrics feature
search.query.metrics.enabled: true
telemetry.feature.metrics.enabled: true

# OTel-related configuration
opensearch.experimental.feature.telemetry.enabled: true
telemetry.tracer.sampler.probability: 1.0
telemetry.feature.tracer.enabled: true
```
{% include copy.html %}

Alternatively, you can configure query metric generation using the API:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.query.metrics.enabled" : true
  }
}
```
{% include copy-curl.html %}

Configure the export of metrics and traces using a gRPC exporter. For more information, see [Exporters]({{site.url}}{{site.baseurl}}/observing-your-data/trace/distributed-tracing/#exporters). You can skip this step if you use the [default logging exporter](#default-logging-exporter):

```yaml
telemetry.otel.tracer.span.exporter.class: io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
telemetry.otel.metrics.exporter.class: io.opentelemetry.exporter.otlp.metrics.OtlpGrpcMetricExporter
```
{% include copy.html %}

## Metrics

Query metrics provide the following measurements:

- The number of queries per query type (for example, the number of `match` or `regex` queries)
- The number of queries per aggregation type (for example, the number of `terms` aggregation queries)
- The number of queries per sort order (for example, the number of ascending and descending `sort` queries)
- Histograms of `latency` for each query type, aggregation type, and sort order
- Histograms of `cpu` for each query type, aggregation type, and sort order
- Histograms of `memory` for each query type, aggregation type, and sort order

## Default logging exporter

By default, if no gRPC exporters are configured, then the metrics and traces are exported to log files. The data is saved in the `opensearch/logs` directory in the following files:

- `opensearch_otel_metrics.log`
- `opensearch_otel_traces.log`
