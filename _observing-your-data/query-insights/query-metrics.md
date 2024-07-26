---
layout: default
title: Query Metrics
parent: Query insights
nav_order: 65
---

# Query Metrics

Query Metrics involves comprehensive instrumentation along the search path to capture key [metrics](#metrics) such as types of aggregations, query types, latency and resource usage per query type.
Open Telemetry is used to instrument the above and the telemetry data can be consumed using the [otel metrics exporters]({{site.url}}{{site.baseurl}}/observing-your-data/trace/distributed-tracing/).


## Configuring query metrics

The following are needed to configure query metrics:

- [Enable Query Insights plugin](#enable-query-insights-plugin)
- [Enable Otel plugin](#enable-otel-plugin)
- [Configuration](#configuration)

### Enable Query Insights plugin
- Need to install the query-insights plugin. See the [following]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/index/) for more details.

### Enable OpenTelemetry plugin
- Need to install the telemetry-otel plugin. See the [following]({{site.url}}{{site.baseurl}}/observing-your-data/trace/distributed-tracing/) for more details.

### Configuration
Configuration to enable the query metrics feature:
```
telemetry.feature.metrics.enabled: true
search.query.metrics.enabled: true
```
{% include copy-curl.html %}

Sample configuration including the telemetry configuration:
```
# Enable query metrics feature
search.query.metrics.enabled: true
telemetry.feature.metrics.enabled: true

# Otel related confuration
opensearch.experimental.feature.telemetry.enabled: true
telemetry.tracer.sampler.probability: 1.0
telemetry.feature.tracer.enabled: true
```
{% include copy-curl.html %}

Configure the query metrics feature using API:
```json
PUT _cluster/settings
{
  "persistent" : {
    "search.query.metrics.enabled" : true
  }
}
```
{% include copy-curl.html %}

Configuration to export metrics and traces using GRPC exporter (can skip this step if you use to use the [default logging exporter](#default-logging-exporter)):
```
telemetry.otel.tracer.span.exporter.class: io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter
telemetry.otel.metrics.exporter.class: io.opentelemetry.exporter.otlp.metrics.OtlpGrpcMetricExporter
```
{% include copy-curl.html %}


## Metrics
Following instrumentation has been added as part of this feature:
- Count of the number of queries per query type (Eg: count of match, regex queries)
- Count of the number of queries per aggregation type (Eg: count of TermsAggregation queries)
- Count of the number of queries per sort order (Eg: count of asc, desc sort queries)
- Histogram for the latency per query type, aggregation type and sort order
- Histogram for the cpu per query type, aggregation type and sort order
- Histogram for the memory query type, aggregation type and sort order

## Default Logging Exporter
If no grpc exporters are configured the metrics and traces are exported to the logs files by default.
Under `opensearch/logs` the telemetry data can be found in the following files:
1. opensearch_otel_metrics.log
2. opensearch_otel_traces.log






