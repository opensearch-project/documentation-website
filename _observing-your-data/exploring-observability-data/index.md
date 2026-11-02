---
layout: default
title: Observability workspace apps
nav_order: 50
has_children: true
has_toc: false
description: "Set up an Observability workspace to explore logs, traces, and metrics in Discover and to use application performance monitoring, service-level objectives, and agent monitoring."
redirect_from:
  - /observing-your-data/exploring-observability-data/
---

# Observability workspace apps
**Introduced 3.5**
{: .label .label-purple }

In an Observability [workspace]({{site.url}}{{site.baseurl}}/dashboards/workspace/index/), OpenSearch Dashboards provides apps for exploring logs, traces, and metrics in Discover, monitoring application performance, tracking service-level objectives (SLOs), and monitoring generative AI agents. Each app is enabled by a setting in `opensearch_dashboards.yml`, which is listed on the app's page.

## Prerequisites

To enable all Observability workspace apps, add the following settings to `opensearch_dashboards.yml`, and then restart OpenSearch Dashboards:

```yaml
workspace.enabled: true
explore.enabled: true                  # Logs
explore.discoverTraces.enabled: true   # Traces, APM, and SLOs
explore.discoverMetrics.enabled: true  # Metrics and APM
explore.agentTraces.enabled: true      # Agent monitoring
datasetManagement.enabled: true        # Datasets and Correlations
observability.slo.enabled: true        # SLOs
```
{% include copy.html %}

To enable only some of the apps, see the Prerequisites section of each app's page for the settings that the app requires.

Workspaces have additional requirements, such as disabling multi-tenancy. For more information, see [Enabling workspaces]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace/#enabling-workspaces).

## Creating an Observability workspace

To create an Observability workspace, follow these steps:

1. On the OpenSearch Dashboards home page, in **My workspaces**, select **Create workspace** on the **Observability** card.
1. In **Workspace details**, enter a **Name** and, optionally, a **Description**.
1. In **Use case and features**, confirm that **Observability** is selected.
1. If you use multiple data sources, select the data sources to associate with the workspace.
1. Select **Create workspace**.

For more information, see [Create a workspace]({{site.url}}{{site.baseurl}}/dashboards/workspace/create-workspace/).

## Exploring and monitoring your data

After you create the workspace, use the apps as follows:

1. Connect your data:
   - Create [datasets]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/datasets/) for your log and trace indexes. The Logs and Traces pages, Correlations, and APM use datasets to find your data.
   - To use Metrics, APM, or SLOs, connect a [Prometheus data source]({{site.url}}{{site.baseurl}}/dashboards/management/connect-prometheus/).
1. Explore your data:
   - Use [Logs]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/discover-logs/) to search, filter, and visualize log data using Piped Processing Language (PPL).
   - Use [Traces]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/discover-traces/) to search and filter spans and view a single trace as a timeline of its spans.
   - Use [Metrics]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/discover-metrics/) to query and visualize Prometheus metrics using PromQL.
   - Use [Correlations]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/correlations/) to link a trace dataset to logs datasets so that you can view the log entries related to a trace.
1. Monitor your applications:
   - Use [application performance monitoring (APM)]({{site.url}}{{site.baseurl}}/observing-your-data/apm/) to view rate, error, and duration (RED) metrics for each service and a topology map of service dependencies.
   - Use [SLOs]({{site.url}}{{site.baseurl}}/observing-your-data/slo/) to define availability and latency targets for your services and track their error budgets.
1. Monitor your AI agents:
   - Use [Agent monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/) to view the LLM calls, tool invocations, and token usage of generative AI agents.
1. Share your results:
   - Add visualizations from the Logs page to [dashboards]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/discover-logs/#adding-visualizations-to-dashboards).
   - Use [Notebooks]({{site.url}}{{site.baseurl}}/dashboards/notebooks/) to combine Markdown text, SQL and PPL queries, and visualizations into reports and runbooks.

## Related documentation

- To learn how logs, traces, and metrics reach OpenSearch, see [Ingesting observability data]({{site.url}}{{site.baseurl}}/observing-your-data/ingesting-observability-data/).
- To choose between the apps that display trace data, see [Choosing a trace tool]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-data/#choosing-a-trace-tool).