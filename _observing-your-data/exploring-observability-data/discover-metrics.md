---
layout: default
title: Discover metrics
nav_order: 50
parent: Exploring observability data
---

# Discover metrics
**Introduced 3.5**
{: .label .label-purple }

The **Metrics** page in OpenSearch Dashboards provides a dedicated interface for discovering, querying, and visualizing time-series metric data. This page, shown in the following image, is optimized for working with Prometheus metrics using PromQL.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/prometheus.png" alt="Metrics page interface" width="700">

The **Metrics** page is available in observability workspaces. To access the **Metrics** page, navigate to an **Observability** workspace, then in the left navigation, expand **Discover** and select **Metrics**.

## Prerequisites

Before using the **Metrics** page, ensure that you have fulfilled the following prerequisites:

1. **Enable feature flags**: Add the following settings to your `opensearch_dashboards.yml` file:

   ```yaml
   workspace.enabled: true
   data_source.enabled: true
   explore.enabled: true
   explore.discoverMetrics.enabled: true
   ```
   {% include copy.html %}

   After updating the configuration file, restart OpenSearch Dashboards for the changes to take effect.

1. **Create an observability workspace**: You must be working within an observability workspace. The **Metrics** page is only available in this workspace type.

1. **Configure a Prometheus data source**: You must configure a Prometheus data source. For instructions, see [Configuring a Prometheus data source](#configuring-a-prometheus-data-source).

## Configuring a Prometheus data source

Before you start, configure a Prometheus data source using one of the following methods.

### Configuring a Prometheus data source in OpenSearch Dashboards

To configure a Prometheus data source in OpenSearch Dashboards, follow these steps:

1. In the left navigation, go to **Data Administration** > **Data sources**.
1. Select **Create data source**.
1. Select **Prometheus**.
1. Enter a **Data source name** and optional **Description**.
1. Enter the **Prometheus URI** endpoint (for example, `http://prometheus-server:9090`).
1. Configure the **Authentication method**:
   - **No authentication**: Use if your Prometheus server does not require authentication.
   - **Basic authentication**: Enter a username and password.
   - **AWS Signature Version 4**: Use for Amazon Managed Service for Prometheus.
1. Select **Connect**.

### Configuring a Prometheus data source using the API

Alternatively, you can configure a Prometheus data source programmatically. For more information, see [Data sources]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/).

## Query panel

You can write and execute metric queries in the query panel at the top of the **Metrics** page. The query editor provides autocomplete suggestions and syntax highlighting for PromQL.

### Writing queries

Write queries using PromQL syntax. For example:

```json
up{job="prometheus"}
```
{% include copy.html %}

### Running queries

To run a query, enter your query in the query editor and then select the **Refresh** button.

You can run multiple PromQL queries together by separating them with a semicolon (`;`):

```json
up{job="prometheus"};
node_cpu_seconds_total{mode="idle"};
```
{% include copy.html %}

Each query runs independently, and the results are combined in the output.

## Time filter

Use the time filter to specify the time range for your metric data. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-oui.png" class="inline-icon" alt="calendar icon"/>{:/} icon to access the time filter options:

- **Quick select**: Choose a relative time range (for example, the last 15 minutes or the last 1 hour).
- **Commonly used**: Select from predefined time ranges.
- **Custom**: Specify absolute start and end times.
- **Auto-refresh**: Set an automatic refresh interval.

For more information, see [Time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/).

## Viewing results

After running a query, the results are displayed in a tabbed interface containing the following views:

- The **Metrics** tab displays the latest data point for each series in a table format.

- The **Raw** tab shows the latest data point for each series as raw JSON returned by the data source.

- The **Visualization** tab provides interactive charts for your metric data.

#### Configuring visualizations

When the **Visualization** tab is selected, a settings panel appears on the right side of the screen. Use this panel to:

1. **Select a chart type**: Choose from line, bar, pie, gauge, or table visualizations.
2. **Map axes**: Assign fields to the X and Y axes.
3. **Customize styles**: Adjust colors, legends, gridlines, and other visual options.

When you modify the settings, the visualization is updated automatically.
