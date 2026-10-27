---
layout: default
title: Telemetry
nav_order: 70
has_children: true
has_toc: false
redirect_from:
  - /tuning-your-cluster/telemetry/
  - /monitoring-your-cluster/
  - /monitoring-your-cluster/index/
---

# Telemetry

OpenSearch can generate metrics and traces about its own operation and export them using [OpenTelemetry](https://opentelemetry.io/). Use telemetry to monitor cluster performance and to find the requests and operations that consume the most resources.

Telemetry is an experimental feature and is not recommended for use in a production environment. Enabling telemetry can consume system resources. Before enabling telemetry, determine whether you have sufficient cluster resources to allocate.
{: .warning}

OpenSearch provides the following telemetry features.

Feature | Description
:--- | :---
[Metrics]({{site.url}}{{site.baseurl}}/tuning-your-cluster/telemetry/metrics/) | Records counters, histograms, and gauges for cluster operations.
[Distributed tracing]({{site.url}}{{site.baseurl}}/tuning-your-cluster/telemetry/distributed-tracing/) | Records spans for HTTP requests and a subset of transport requests as they move through the cluster.
[Performance Analyzer]({{site.url}}{{site.baseurl}}/tuning-your-cluster/telemetry/performance-analyzer/) | Adds JVM, disk, thread pool, cache, and per-shard operation metrics to the metrics that OpenSearch records.

Telemetry describes OpenSearch itself. To analyze traces and logs from your own applications, see [Trace analytics]({{site.url}}{{site.baseurl}}/observing-your-data/trace/index/). To configure OpenSearch log files, including slow logs, see [Logs]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/logs/).

## Enabling telemetry

To enable telemetry, enable the telemetry feature flag and install the `telemetry-otel` plugin on each node. Then enable metrics, tracing, or both.

### Step 1: Enable the telemetry feature flag

Enable the `opensearch.experimental.feature.telemetry.enabled` feature flag on each node using one of the following methods.

To enable the flag in the configuration file, add the following line to `opensearch.yml`:

```yaml
opensearch.experimental.feature.telemetry.enabled: true
```
{% include copy.html %}

To enable the flag as a Java Virtual Machine (JVM) option, add the following line to `config/jvm.options` before starting OpenSearch:

```bash
-Dopensearch.experimental.feature.telemetry.enabled=true
```
{% include copy.html %}

To enable the flag using an environment variable, set `OPENSEARCH_JAVA_OPTS` when you start OpenSearch:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.telemetry.enabled=true" ./bin/opensearch
```
{% include copy.html %}

If you run OpenSearch using Docker Compose, add the flag to the `OPENSEARCH_JAVA_OPTS` variable in the `environment` section of each OpenSearch service in `docker-compose.yml`. Keep any options that the variable already contains, such as heap size settings:

```yaml
- "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m -Dopensearch.experimental.feature.telemetry.enabled=true"
```
{% include copy.html %}

To enable the flag when you run OpenSearch from source, add the following system property to the `runTask` block in `run.gradle`. For more information, see the [OpenSearch Developer Guide](https://github.com/opensearch-project/OpenSearch/blob/main/DEVELOPER_GUIDE.md#gradle-build):

```groovy
testClusters {
  runTask {
    testDistribution = 'archive'
    systemProperty 'opensearch.experimental.feature.telemetry.enabled', 'true'
  }
}
```
{% include copy.html %}

### Step 2: Install the telemetry-otel plugin

The `telemetry-otel` plugin implements telemetry using the OpenTelemetry Java SDK. The plugin is not included in the OpenSearch distribution. To install it, run the following command on each node:

```bash
bin/opensearch-plugin install telemetry-otel
```
{% include copy.html %}

### Step 3: Enable metrics or tracing

Enable the telemetry features that you want to use by adding the following settings to `opensearch.yml`:

```yaml
telemetry.feature.metrics.enabled: true
telemetry.feature.tracer.enabled: true
```
{% include copy.html %}

Then restart each node. For the settings that each feature supports, see [Metrics]({{site.url}}{{site.baseurl}}/tuning-your-cluster/telemetry/metrics/) and [Distributed tracing]({{site.url}}{{site.baseurl}}/tuning-your-cluster/telemetry/distributed-tracing/).
