---
layout: default
title: Metrics framework 
parent: Trace Analytics
nav_order: 65
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

2. Open your `opensearch.yaml` file.
3. Add the following setting to `opensearch.yaml`:

  ```bash
  opensearch.experimental.feature.telemetry.enabled=true
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

If you’re running OpenSearch using Docker, add the following line to `docker-compose.yml` under `environment`:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.telemetry.enabled=true"
```
{% include copy.html %}


### Enable the metrics framework feature

Once you've enabled the feature flag, you can enable the metrics framework feature by using the following setting, which enables metrics in the `opensearch.yaml` file:

```bash
telemetry.feature.metrics.enabled=true
```

The metrics framework feature supports various telemetry solutions through plugins. Use the following instructions to enable the `telemetry-otel` plugin:


1. **Publish interval:** The metrics framework feature can locally aggregate metrics with unique information about the configured publish interval and then export those metrics. By default, the interval is 1 minute. However, you can change the interval using the `telemetry.otel.metrics.publish.interval` cluster setting.
2. **Exporters:** Exporters are responsible for persisting the data. OpenTelemetry provides several out-of-the-box exporters. OpenSearch supports the following exporters:
    - `LoggingMetricExporter`: Exports metrics to a log file, generating a separate file in the logs directory `_otel_metrics.log`. Default is `telemetry.otel.metrics.exporter.class=io.opentelemetry.exporter.logging.LoggingMetricExporter`.
    - `OtlpGrpcMetricExporter`: Exports spans through gRPC. To use this exporter, you need to install the `otel-collector` on the node. By default, it writes to the http://localhost:4317/ endpoint. To use this exporter, set the following static setting: `telemetry.otel.metrics.exporter.class=io.opentelemetry.exporter.otlp.metrics.OtlpGrpcMetricExporter`.
