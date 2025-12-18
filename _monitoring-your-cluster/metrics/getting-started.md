---
layout: default
title: Metrics framework
nav_order: 1
has_children: false
has_toc: false
redirect_from:
  - /monitoring-your-cluster/metrics/
canonical_url: https://docs.opensearch.org/latest/monitoring-your-cluster/metrics/getting-started/
---

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/10141).    
{: .warning}

While the OpenSearch Stats APIs offer insight into the inner workings of each node and an OpenSearch cluster as a whole, the statistics lack certain details, such as percentiles, and do not provide the semantics of richer metric types, like histograms. Consequently, identifying outliers within cluster statistics becomes challenging when using only the Stats API. 

The metrics framework feature adds comprehensive metrics support to effectively monitor an OpenSearch cluster. Using the Metrics Framework APIs, plugin, and extension, developers can add new monitoring metrics. In addition, the OpenSearch distribution bundles the `telemetry-otel` plugin, which provides the implementation for metrics instrumentation based on the [OpenTelemetry](https://opentelemetry.io) Java SDK.


## Getting started

The metrics framework feature is experimental as of OpenSearch 2.11. To begin using the metrics framework feature, you need to first enable the `telemetry feature` by using the `opensearch.experimental.feature.telemetry.enabled` feature flag and subsequently by using the metrics framework feature flag. 

Enabling this feature can consume system resources. Before enabling the metrics framework feature, determine whether you have sufficient cluster resources to allocate.
{: .warning}

### Enabling the feature flag on a node using tarball

The `enable` flag is toggled using a Java Virtual Machine (JVM) parameter that is set either in `OPENSEARCH_JAVA_OPTS` or in `config/jvm.options`.

#### Option 1: Enable the experimental feature flag in the `opensearch.yml` file

1. Navigate to your OpenSearch directory using the following command:

  ```bash
  cd \path\to\opensearch
  ```

2. Open your `opensearch.yml` file.
3. Add the following setting to `opensearch.yml`:

  ```yaml
  opensearch.experimental.feature.telemetry.enabled: true
  ```
  {% include copy.html %}

4. Save your changes and close the file.

#### Option 2: Modify jvm.options

To enable the metrics framework feature using `jvm`, add the following line to `config/jvm.options` before starting OpenSearch:

```bash
-Dopensearch.experimental.feature.telemetry.enabled=true
```
{% include copy.html %}

#### Option 3: Enable from an environment variable

You can enable the metrics framework feature with a single command by adding the metrics framework environment variable to the `OPENSEARCH_JAVA_OPTS` command, as shown in the following example:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.telemetry.enabled=true" ./opensearch-2.9.0/bin/opensearch
```
{% include copy.html %}

You can also define the environment variable separately before running OpenSearch by running the following command:

```bash
export OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.telemetry.enabled=true"
 ./bin/opensearch
```
{% include copy.html %}

### Enable with Docker 

If you're running OpenSearch using Docker, add the following line to `docker-compose.yml` under `environment`:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.telemetry.enabled=true"
```
{% include copy.html %}


### Enable the metrics framework feature

Once you've enabled the feature flag, you can enable the metrics framework feature by using the following setting, which enables metrics in the `opensearch.yaml` file:

```bash
telemetry.feature.metrics.enabled: true
```

The metrics framework feature supports various telemetry solutions through plugins. Use the following instructions to enable the `telemetry-otel` plugin:


1. **Publish interval:** The metrics framework feature can locally aggregate metrics with unique information about the configured publish interval and then export those metrics. By default, the interval is 1 minute. However, you can change the interval using the `telemetry.otel.metrics.publish.interval` cluster setting.
2. **Exporters:** Exporters are responsible for persisting the data. OpenTelemetry provides several out-of-the-box exporters. OpenSearch supports the following exporters:
    - `LoggingMetricExporter`: Exports metrics to a log file, generating a separate file in the logs directory `_otel_metrics.log`. Default is `telemetry.otel.metrics.exporter.class=io.opentelemetry.exporter.logging.LoggingMetricExporter`.
    - `OtlpGrpcMetricExporter`: Exports spans through gRPC. To use this exporter, you need to install the `otel-collector` on the node. By default, it writes to the http://localhost:4317/ endpoint. To use this exporter, set the following static setting: `telemetry.otel.metrics.exporter.class=io.opentelemetry.exporter.otlp.metrics.OtlpGrpcMetricExporter`.
  
### Supported metric types

The metrics framework feature supports the following metric types:

1. **Counters:** Counters are continuous and synchronous meters used to track the frequency of events over time. Counters can only be incremented with positive values, making them ideal for measuring the number of monitoring occurrences such as errors, processed or received bytes, and total requests.
2. **UpDown counters:** UpDown counters can be incremented with positive values or decremented with negative values. UpDown counters are well suited for tracking metrics like open connections, active requests, and other fluctuating quantities.
3. **Histograms:** Histograms are valuable tools for visualizing the distribution of continuous data. Histograms offer insight into the central tendency, spread, skewness, and potential outliers that might exist in your metrics. Patterns such as normal distribution, skewed distribution, or bimodal distribution can be readily identified, making histograms ideal for analyzing latency metrics and assessing percentiles.
4. **Asynchronous Gauges:** Asynchronous gauges capture the current value at the moment a metric is read. These metrics are non-additive and are commonly used to measure CPU utilization on a per-minute basis, memory utilization, and other real-time values.

## Monitoring machine learning workflows
Introduced 3.1
{: .label .label-purple }

OpenSearch provides enhanced observability for [machine learning (ML)]({{site.url}}{{site.baseurl}}/ml-commons-plugin/) workflows. Metrics related to ML operations are pushed directly to the core metrics registry, giving you improved visibility into model usage and performance. Additionally, every 5 minutes, a periodic job collects and exports state data, helping you monitor the health and activity of your ML workloads over time.

The static collector job captures the following metrics about different types of created models and agents:

- **Models**: Deployment type (remote, pretrained, or custom), service provider, algorithm, model name, and model type
- **Agents**: LLM interface, model deployment type, service provider, model type, memory type, and model identifier


The following is an example of captured model metrics:

```
{is_hidden=false, service_provider=openai, model=gpt-3.5-turbo, type=llm, deployment=remote, algorithm=REMOTE}
```

The following is an example of captured agent metrics:

```
{_llm_interface=bedrock/converse/claude, model_deployment=remote, is_hidden=false, model_service_provider=bedrock, model_type=llm, memory_type=conversation_index, model=us.anthropic.claude-3-7-sonnet-20250219-v1:0, type=CONVERSATIONAL}
```

To enable ML observability, specify the following settings in `opensearch.yml`:

```yaml
plugins.ml_commons.metrics_collection_enabled: true
plugins.ml_commons.metrics_static_collection_enabled: true
```
{% include copy.html %}
