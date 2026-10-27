---
layout: default
title: Metrics
parent: Telemetry
nav_order: 10
redirect_from:
  - /monitoring-your-cluster/metrics/
  - /monitoring-your-cluster/metrics/getting-started/
---

# Metrics

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/10141).    
{: .warning}

While the OpenSearch Stats APIs offer insight into the inner workings of each node and an OpenSearch cluster as a whole, the statistics lack certain details, such as percentiles, and do not provide the semantics of richer metric types, like histograms. Consequently, identifying outliers within cluster statistics becomes challenging when using only the Stats API. 

The metrics framework feature adds comprehensive metrics support to effectively monitor an OpenSearch cluster. Using the Metrics Framework APIs, plugin, and extension, developers can add new monitoring metrics. The `telemetry-otel` plugin provides the implementation for metrics instrumentation based on the [OpenTelemetry](https://opentelemetry.io) Java SDK. The plugin is not included in the OpenSearch distribution, so you must install it before using the metrics framework.


## Enabling metrics

To enable metrics, first enable the telemetry feature flag and install the `telemetry-otel` plugin. For more information, see [Enabling telemetry]({{site.url}}{{site.baseurl}}/tuning-your-cluster/telemetry/index/#enabling-telemetry).

Then add the following setting to `opensearch.yml` on each node and restart the node:

```yaml
telemetry.feature.metrics.enabled: true
```
{% include copy.html %}

## Configuring metrics export

The `telemetry-otel` plugin aggregates metrics locally and exports them at a configured interval. Use the following settings to configure the export:

- **Publish interval:** By default, metrics are exported every 1 minute. To change the interval, use the `telemetry.otel.metrics.publish.interval` setting.
- **Exporter:** Exporters persist the metrics. OpenSearch supports the following exporters:
    - `LoggingMetricExporter`: Exports metrics to the `<cluster-name>_otel_metrics.log` file in the logs directory. This is the default exporter, set using `telemetry.otel.metrics.exporter.class=io.opentelemetry.exporter.logging.LoggingMetricExporter`.
    - `OtlpGrpcMetricExporter`: Exports metrics using gRPC. To use this exporter, install the OpenTelemetry Collector on the node. By default, the exporter writes to the `http://localhost:4317/` endpoint. To use this exporter, set the following static setting: `telemetry.otel.metrics.exporter.class=io.opentelemetry.exporter.otlp.metrics.OtlpGrpcMetricExporter`.

## Supported metric types

The metrics framework feature supports the following metric types:

1. **Counters:** Counters are continuous and synchronous meters used to track the frequency of events over time. Counters can only be incremented with positive values, making them ideal for measuring the number of monitoring occurrences such as errors, processed or received bytes, and total requests.
2. **UpDown counters:** UpDown counters can be incremented with positive values or decremented with negative values. UpDown counters are well suited for tracking metrics like open connections, active requests, and other fluctuating quantities.
3. **Histograms:** Histograms are valuable tools for visualizing the distribution of continuous data. Histograms offer insight into the central tendency, spread, skewness, and potential outliers that might exist in your metrics. Patterns such as normal distribution, skewed distribution, or bimodal distribution can be readily identified, making histograms ideal for analyzing latency metrics and assessing percentiles. To choose how histograms are exported, see [Histogram aggregation](#histogram-aggregation).
4. **Asynchronous Gauges:** Asynchronous gauges capture the current value at the moment a metric is read. These metrics are non-additive and are commonly used to measure CPU utilization on a per-minute basis, memory utilization, and other real-time values.

## Histogram aggregation
**Introduced 3.10**
{: .label .label-purple }

By default, the `telemetry-otel` plugin exports histograms as OpenTelemetry exponential histograms (`ExponentialHistogram` in OTLP). Some metric receivers do not accept exponential histograms. To export histograms with explicit bucket boundaries (`Histogram` in OTLP), configure the `telemetry.otel.metrics.histogram.aggregation.default` static setting in the `opensearch.yml` file:

```yaml
telemetry.otel.metrics.histogram.aggregation.default: explicit_bucket_histogram
```
{% include copy.html %}

The setting accepts the following case-insensitive values:

- `base2_exponential_bucket_histogram`: Exports histograms as exponential histograms.
- `explicit_bucket_histogram`: Exports histograms with explicit bucket boundaries, using the default boundaries of the OpenTelemetry SDK.

The default value is `base2_exponential_bucket_histogram`, which preserves the behavior of earlier versions. The setting applies to all histograms, regardless of the configured exporter. Because this is a static setting, OpenSearch applies it when the node starts, and you cannot change it on a running cluster. If the value is not one of the allowed values, the node fails to start. Changing the setting changes the metric type sent to receivers, so you might need to update dashboards and queries that use the previous metric type.

## Monitoring machine learning workflows
Introduced 3.1
{: .label .label-purple }

OpenSearch provides enhanced observability for [machine learning (ML)]({{site.url}}{{site.baseurl}}/ml-commons-plugin/) workflows. Metrics related to ML operations are pushed directly to the core metrics registry, giving you improved visibility into model usage and performance. Additionally, every 5 minutes, a periodic job collects and exports state data, helping you monitor the health and activity of your ML workloads over time.

The static collector job captures the following metrics about different types of created models and agents:

- **Models**: Deployment type (remote, pretrained, or custom), service provider, algorithm, model name, and model type
- **Agents**: LLM interface, model deployment type, service provider, model type, memory type, and model identifier


The following is an example of captured model metrics:

```
{is_hidden=false, service_provider=openai, model=gpt-4o-mini, type=llm, deployment=remote, algorithm=REMOTE}
```

The following is an example of captured agent metrics:

```
{_llm_interface=bedrock/converse/claude, model_deployment=remote, is_hidden=false, model_service_provider=bedrock, model_type=llm, memory_type=conversation_index, model=us.anthropic.claude-sonnet-4-6, type=CONVERSATIONAL}
```

To enable ML observability, specify the following settings in `opensearch.yml`:

```yaml
plugins.ml_commons.metrics_collection_enabled: true
plugins.ml_commons.metrics_static_collection_enabled: true
```
{% include copy.html %}
