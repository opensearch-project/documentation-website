---
layout: default
title: Exploring observability data
nav_order: 30
---

# Exploring observability data

OpenSearch Dashboards provides two sets of observability apps. Which set you use depends on how OpenSearch Dashboards is configured:

- [Classic observability apps]({{site.url}}{{site.baseurl}}/observing-your-data/classic-observability-apps/) are available in the **Observability** menu in classic navigation and require no additional setup.
- [Observability workspace apps]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/) are available in an Observability workspace. To use them, you enable workspaces and the required settings in `opensearch_dashboards.yml` and then create an Observability workspace. Application performance monitoring (APM), service-level objectives (SLOs), and agent monitoring are available only in workspaces.

The following table lists the app that you use for each task in each set.

| Task | Classic observability apps | Observability workspace apps |
|:---|:---|:---|
| Explore logs | [Event analytics]({{site.url}}{{site.baseurl}}/observing-your-data/event-analytics/) | [Logs]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/discover-logs/) |
| Explore traces | [Trace analytics]({{site.url}}{{site.baseurl}}/observing-your-data/trace/index/) | [Traces]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/discover-traces/), [Agent monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/) |
| Explore metrics | [Metric analytics]({{site.url}}{{site.baseurl}}/observing-your-data/prometheusmetrics/) | [Metrics]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/discover-metrics/) |
| Monitor applications | [Application analytics]({{site.url}}{{site.baseurl}}/observing-your-data/app-analytics/) | [Application performance monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/apm/), including [Services]({{site.url}}{{site.baseurl}}/observing-your-data/apm/services/), [Topology map]({{site.url}}{{site.baseurl}}/observing-your-data/apm/application-map/), and [SLOs]({{site.url}}{{site.baseurl}}/observing-your-data/slo/) |
| Build dashboards | [Operational panels]({{site.url}}{{site.baseurl}}/observing-your-data/operational-panels/) | [Dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/index/) |

To combine queries, visualizations, and text in a single document, use [Notebooks]({{site.url}}{{site.baseurl}}/dashboards/notebooks/), which are available in both classic navigation and workspaces.

## Choosing a trace tool

Several apps display trace data. The following table describes each app and where it is available.

| App | Use it to | Where available |
|:---|:---|:---|
| [Trace analytics]({{site.url}}{{site.baseurl}}/observing-your-data/trace/index/) | View prebuilt dashboards of traces and services, including latency, error rate, and throughput, for data ingested using Data Prepper or Jaeger. | Classic navigation and Observability workspaces |
| [Traces]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/discover-traces/) | Search and filter spans and view a single trace as a timeline of its spans. | Observability workspaces |
| [Application performance monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/apm/) | View rate, error, and duration (RED) metrics for each service and a topology map of service dependencies. | Observability workspaces |
| [Agent monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/) | View the steps, tool calls, and token usage of generative AI agents. | Observability workspaces |

In an Observability workspace, APM replaces Trace analytics when APM and Discover Traces are both enabled. For the settings that enable each app, see [Observability workspace apps]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/).

For traces that OpenSearch generates for the requests it processes, see [Distributed tracing]({{site.url}}{{site.baseurl}}/tuning-your-cluster/monitoring/telemetry/distributed-tracing/).
