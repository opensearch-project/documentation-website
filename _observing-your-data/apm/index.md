---
layout: default
title: Application Performance Monitoring
nav_order: 45
has_children: true
has_toc: false
---

# Application Performance Monitoring
**Introduced 3.5**
{: .label .label-purple }

Application Performance Monitoring (APM) provides real-time monitoring of your distributed applications by combining service topology data with RED metrics (Rate, Errors, Duration). APM gives you a unified view of service health, enabling you to quickly identify performance bottlenecks and failures across your microservices architecture.

The following image shows the APM overview.

![APM overview]({{site.url}}{{site.baseurl}}/images/apm/services-home.png)

## Architecture

The following image shows the APM architecture.

![APM architecture]({{site.url}}{{site.baseurl}}/images/apm/architecture.png)

APM uses the following data pipeline to collect, process, and visualize application telemetry:

1. **OpenTelemetry SDKs** instrument your application code to generate traces, logs, and metrics.
2. **OpenTelemetry Collector** receives telemetry via OTLP (gRPC on port 4317 or HTTP on port 4318), processes it, and routes it to Data Prepper and Prometheus.
3. **Data Prepper** processes traces and generates service maps and RED metrics using the `otel_apm_service_map` processor.
4. **OpenSearch** stores trace data, logs, and service topology information.
5. **Prometheus** stores time-series RED metrics via remote write.
6. **OpenSearch Dashboards** provides the APM user interface for visualization and analysis.

## APM features

APM includes the following features:

- [**Ingesting application telemetry**]({{site.url}}{{site.baseurl}}/observing-your-data/apm/ingesting-application-telemetry/): Configure the OpenTelemetry Collector and Data Prepper pipelines to ingest application traces, logs, and metrics.
- [**Setting up APM**]({{site.url}}{{site.baseurl}}/observing-your-data/apm/setting-up-apm/): Configure datasets, index patterns, data sources, and APM settings in OpenSearch Dashboards.
- [**Services**]({{site.url}}{{site.baseurl}}/observing-your-data/apm/services/): View a centralized catalog of all instrumented services with key performance indicators, per-operation metrics, and dependency information.
- [**Application map**]({{site.url}}{{site.baseurl}}/observing-your-data/apm/application-map/): Explore an interactive topology visualization auto-generated from trace data, with RED metrics overlaid on each service node.

## Prerequisites

To use APM, you need to complete the following prerequisites:

1. **Create an observability workspace**: APM features are only available within Observability workspaces. To learn how to enable and create workspaces, see [Workspace for OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace/).

2. **Enable feature flags**: Add the following settings to your `opensearch_dashboards.yml` file:

   ```yaml
   workspace.enabled: true
   data_source.enabled: true
   explore.enabled: true
   explore.discoverTraces.enabled: true
   explore.discoverMetrics.enabled: true
   ```
   {% include copy.html %}

3. **Configure data sources**: Set up appropriate data sources for your traces, logs, and metrics. For configuration guidance, see [Data sources]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/).

4. **Instrument your applications**: Integrate [OpenTelemetry SDKs](https://opentelemetry.io/docs/instrumentation/) into your application code to generate trace and log data.

APM is distinct from the older [Application analytics]({{site.url}}{{site.baseurl}}/observing-your-data/app-analytics/) and [Trace analytics]({{site.url}}{{site.baseurl}}/observing-your-data/trace/index/) features. APM provides a more integrated experience that combines service topology, RED metrics, and in-context correlations into a single workflow.
{: .note}
