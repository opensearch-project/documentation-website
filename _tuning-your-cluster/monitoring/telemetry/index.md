---
layout: default
title: Telemetry
parent: Monitoring your cluster
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /tuning-your-cluster/monitoring/telemetry/
---

# Telemetry

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/6750).
{: .warning}

OpenSearch can generate metrics and traces about its own operation and export them using [OpenTelemetry](https://opentelemetry.io/). Use telemetry to monitor cluster performance and to find the requests and operations that consume the most resources.

Enabling telemetry can consume system resources. Before enabling telemetry, determine whether you have sufficient cluster resources to allocate.
{: .warning}

OpenSearch provides the following telemetry features:

- [Metrics]({{site.url}}{{site.baseurl}}/tuning-your-cluster/monitoring/telemetry/metrics/) are counters, histograms, and gauges that OpenSearch records for cluster operations.
- [Distributed tracing]({{site.url}}{{site.baseurl}}/tuning-your-cluster/monitoring/telemetry/distributed-tracing/) records spans for HTTP requests and a subset of transport requests as they move through the cluster.
- [Performance Analyzer]({{site.url}}{{site.baseurl}}/tuning-your-cluster/monitoring/telemetry/performance-analyzer/) adds JVM, disk, thread pool, cache, and per-shard operation metrics to the metrics that OpenSearch records.

## Enabling telemetry

Follow these steps to enable telemetry and install the `telemetry-otel` plugin. Then enable metrics, tracing, or both.

### Step 1: Enable the telemetry feature flag

Enable the `opensearch.experimental.feature.telemetry.enabled` feature flag on each node. For example, add the following line to `opensearch.yml`:

```yaml
opensearch.experimental.feature.telemetry.enabled: true
```
{% include copy.html %}

For other ways to enable the flag, such as using Docker, `jvm.options`, or an environment variable, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

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

Then restart each node. For the settings that each feature supports, see [Metrics]({{site.url}}{{site.baseurl}}/tuning-your-cluster/monitoring/telemetry/metrics/) and [Distributed tracing]({{site.url}}{{site.baseurl}}/tuning-your-cluster/monitoring/telemetry/distributed-tracing/).

## Related documentation

- [Trace analytics]({{site.url}}{{site.baseurl}}/observing-your-data/trace/index/): Analyze traces from your own applications.
- [Logs]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/logs/): Configure OpenSearch log files, including slow logs.
