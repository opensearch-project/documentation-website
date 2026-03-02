---
layout: default
title: Exploring observability data
nav_order: 40
has_children: true
has_toc: false
---

# Exploring observability data
**Introduced 3.5**
{: .label .label-purple }

Learn how to explore your observability data using specialized interfaces for logs, metrics, and traces within observability workspaces. These enhanced data exploration capabilities provide purpose-built tools for querying, analyzing, and correlating different types of telemetry data.

OpenSearch provides specialized interfaces for exploring the three pillars of observability data:

- **Logs**: Query and analyze log data using Piped Processing Language (PPL).
- **Metrics**: Explore time-series metric data using PromQL queries.
- **Traces**: Investigate distributed traces and span relationships.

These interfaces work together with datasets and correlations to provide a comprehensive observability experience, enabling you to quickly identify issues, understand system behavior, and troubleshoot problems across your distributed applications.

## Prerequisites

To use these data exploration features, you need to:

- **Create an observability workspace**: These features are only available within Observability workspaces. To learn how to enable and create workspaces, see [Workspace for OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace/).
- **Enable feature flags**: Configure the required settings in your `opensearch_dashboards.yml` file. Each feature page provides the specific configuration needed.
- **Configure data sources**: Set up appropriate data sources for your logs, metrics, and traces. For configuration guidance, see [Data sources]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/).

### Creating an observability workspace

To create an observability workspace, follow these steps:

1. Enable workspaces. For more information, see [Enabling the Worskpace feature]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace/#enabling-the-workspace-feature).
2. On the OpenSearch Dashboards home page, select **Create Workspace** and choose **Observability**. Alternatively, select the plus sign on the **Observability** card to create a new observability workspace.
3. In **Workspace details**, enter a **Name** and optional **Description** for your workspace.
4. Select **Observability** as the use case and then select **Create workspace**.

For detailed instructions, see [Create workspace]({{site.url}}{{site.baseurl}}/dashboards/workspace/create-workspace/).

## Getting started

After creating an observability workspace, follow these steps to get started:

1. **[Datasets]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/datasets/)** -- Learn how to organize your observability data into manageable datasets.
1. **[Discover logs]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/discover-logs/)** -- Explore log data using PPL queries and visualizations.
1. **[Discover traces]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/discover-traces/)** -- Analyze distributed traces and span relationships.
1. **[Discover metrics]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/discover-metrics/)** -- Query and visualize time-series metrics using PromQL.
1. **[Correlations]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/correlations/)** -- Understand how to link trace and log datasets for unified analysis.