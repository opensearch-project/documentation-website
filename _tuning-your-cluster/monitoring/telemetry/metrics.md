---
layout: default
title: Metrics
parent: Telemetry
grand_parent: Monitoring your cluster
nav_order: 10
redirect_from:
  - /monitoring-your-cluster/metrics/
  - /monitoring-your-cluster/metrics/getting-started/
---

# Metrics

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/10141).
{: .warning}

The metrics framework records counters, histograms, and gauges for cluster operations and exports them using the `telemetry-otel` plugin. Histograms support percentiles, which the Stats APIs do not provide, so you can identify outliers in latency and resource usage. Plugins and extensions can add their own metrics using the metrics framework APIs.

## Enabling metrics

To enable metrics, first enable the telemetry feature flag and install the `telemetry-otel` plugin. For more information, see [Enabling telemetry]({{site.url}}{{site.baseurl}}/tuning-your-cluster/monitoring/telemetry/index/#enabling-telemetry).

Then add the following setting to `opensearch.yml` on each node and restart the node:

```yaml
telemetry.feature.metrics.enabled: true
```
{% include copy.html %}

## Configuring metrics export

The `telemetry-otel` plugin aggregates metrics locally and exports them at a configured interval. To configure the export, specify the following static settings in `opensearch.yml`.

Setting | Description
:--- | :---
`telemetry.otel.metrics.publish.interval` | The interval at which metrics are exported. Default is `60s`.
`telemetry.otel.metrics.exporter.class` | The exporter that persists the metrics. Valid values are `io.opentelemetry.exporter.logging.LoggingMetricExporter`, which writes metrics to the `<cluster-name>_otel_metrics.log` file in the logs directory, and `io.opentelemetry.exporter.otlp.metrics.OtlpGrpcMetricExporter`, which sends metrics to an OpenTelemetry Collector using gRPC. Default is `io.opentelemetry.exporter.logging.LoggingMetricExporter`.

To send metrics to an OpenTelemetry Collector, install the collector on each node and add the following setting to `opensearch.yml`. By default, the exporter sends metrics to the `http://localhost:4317/` endpoint:

```yaml
telemetry.otel.metrics.exporter.class: io.opentelemetry.exporter.otlp.metrics.OtlpGrpcMetricExporter
```
{% include copy.html %}

## Supported metric types

The metrics framework supports the following metric types.

Type | Description
:--- | :---
Counter | Records a value that only increases, such as the number of errors, the number of bytes processed, or the total number of requests.
UpDown counter | Records a value that can increase or decrease, such as the number of open connections or active requests.
Histogram | Records the distribution of values, such as request latencies, so that you can calculate percentiles and find outliers. To choose how histograms are exported, see [Histogram aggregation](#histogram-aggregation).
Asynchronous gauge | Records the current value each time the metric is read, such as CPU or memory utilization.

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

The default value is `base2_exponential_bucket_histogram`. The setting applies to all histograms, regardless of the configured exporter. Because this is a static setting, OpenSearch applies it when the node starts, and you cannot change it on a running cluster. If the value is not one of the allowed values, the node fails to start. Changing the setting changes the metric type sent to receivers, so you might need to update dashboards and queries that use the previous metric type.

## Monitoring machine learning workflows
**Introduced 3.1**
{: .label .label-purple }

ML Commons publishes metrics about [machine learning (ML)]({{site.url}}{{site.baseurl}}/ml-commons-plugin/) operations to the metrics framework. Every 5 minutes, a periodic job also collects and exports the state of the models and agents in the cluster.

The periodic job captures the following attributes.

Resource | Captured attributes
:--- | :---
Model | Deployment type (remote, pretrained, or custom), service provider, algorithm, model name, and model type
Agent | Large language model (LLM) interface, model deployment type, service provider, model type, memory type, and model identifier

The following is an example of captured model metrics:

```text
{is_hidden=false, service_provider=openai, model=gpt-4o-mini, type=llm, deployment=remote, algorithm=REMOTE}
```

The following is an example of captured agent metrics:

```text
{_llm_interface=bedrock/converse/claude, model_deployment=remote, is_hidden=false, model_service_provider=bedrock, model_type=llm, memory_type=conversation_index, model=us.anthropic.claude-sonnet-4-6, type=CONVERSATIONAL}
```

To enable ML metrics, first [enable metrics](#enabling-metrics). Then add the following settings to `opensearch.yml` and restart the node:

```yaml
plugins.ml_commons.metrics_collection_enabled: true
plugins.ml_commons.metrics_static_collection_enabled: true
```
{% include copy.html %}

The `plugins.ml_commons.metrics_collection_enabled` setting enables ML operation metrics and is static. The `plugins.ml_commons.metrics_static_collection_enabled` setting enables the periodic job and is dynamic, so you can also update it using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/).
