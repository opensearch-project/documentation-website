---
layout: default
title: Classic observability apps
nav_order: 40
has_children: true
has_toc: false
---

# Classic observability apps

In classic navigation, OpenSearch Dashboards provides observability apps in the **Observability** menu. These apps don't require a workspace or additional settings in `opensearch_dashboards.yml`.

The following table describes the apps and lists whether each app is available with a single data source and when [multiple data sources]({{site.url}}{{site.baseurl}}/dashboards/management/multi-data-sources/) are enabled.

| App | Description | Single data source | Multiple data sources |
|:---|:---|:---|:---|
| [Event analytics]({{site.url}}{{site.baseurl}}/observing-your-data/event-analytics/) | Query log events using Piped Processing Language (PPL) and create visualizations from the results. | Yes | No |
| [Trace analytics]({{site.url}}{{site.baseurl}}/observing-your-data/trace/index/) | View dashboards of traces and services, including latency, error rate, and throughput. | Yes | Yes |
| [Metric analytics]({{site.url}}{{site.baseurl}}/observing-your-data/prometheusmetrics/) | Query and visualize metrics stored in Prometheus or in OpenTelemetry metrics indexes in OpenSearch. | Yes | Yes |
| [Application analytics]({{site.url}}{{site.baseurl}}/observing-your-data/app-analytics/) | Combine the logs, traces, and metrics of an application into a single view of its health. | Yes | No |
| [Operational panels]({{site.url}}{{site.baseurl}}/observing-your-data/operational-panels/) | Organize PPL visualizations into dashboards. | Yes | No |
