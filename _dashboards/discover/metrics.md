---
layout: default
title: Metrics
parent: Analyzing data with Discover
nav_order: 30
---

# Metrics
Introduced 3.5
{: .label .label-purple }

The **Metrics** page in OpenSearch Dashboards provides a dedicated interface for discovering, querying, and visualizing time-series metrics data. This page is optimized for working with metrics from Prometheus using PromQL.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/prometheus.png" alt="Metrics page interface" width="700">

## Getting started

Before using the Metrics page, ensure that you have:

- Installed [OpenSearch Dashboards](https://opensearch.org/downloads.html).
- Enabled the following feature flags in your `opensearch_dashboards.yml` configuration:
  ```yaml
  explore.enabled: true
  explore.discoverMetrics.enabled: true
  workspace.enabled: true
  data_source.enabled: true
  ```
- Configured a Prometheus data source using one of the following methods:

**Option 1: Using the UI**

1. In OpenSearch Dashboards, go to **Data Administration** > **Data sources** > **Create data source**.
2. Select **Prometheus**.
3. Enter a **Data source name** and optional **Description**.
4. Enter the **Prometheus URI** endpoint (for example, `http://prometheus-server:9090`).
5. Configure the **Authentication method**:
   - **No authentication**: Use if your Prometheus server does not require authentication.
   - **Basic authentication**: Enter a username and password.
   - **AWS Signature Version 4**: Use for Amazon Managed Service for Prometheus.
6. Select **Connect**.

**Option 2: Using the API**

You can also create a Prometheus data source programmatically. See [Data sources]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/) for more details.

The Metrics page is available in Observability workspaces. To access the Metrics page, select **Metrics** below **Discover** in the OpenSearch Dashboards navigation menu.

## Query panel

The query panel at the top of the Metrics page allows you to write and execute metrics queries. The query editor provides autocomplete suggestions and syntax highlighting for PromQL.

### Writing queries

Write queries using PromQL syntax. For example:

```promql
up{job="prometheus"}
```

To execute a query, enter your query in the query editor and click the **Refresh** button.

### Running multiple queries

You can run multiple PromQL queries together by separating them with a semicolon (`;`). For example:

```promql
up{job="prometheus"};
node_cpu_seconds_total{mode="idle"};
```

Each query runs independently, and results are combined in the output.

## Time filter

Use the time filter to specify the time range for your metrics data. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-oui.png" class="inline-icon" alt="calendar icon"/>{:/} icon to access the time filter options:

- **Quick select**: Choose a relative time range (for example, last 15 minutes, last 1 hour).
- **Commonly used**: Select from predefined time ranges.
- **Custom**: Specify absolute start and end times.
- **Auto-refresh**: Set an automatic refresh interval.

For more information, see [Time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/).

## Viewing results

After executing a query, results are displayed in a tabbed interface with the following views:

### Metrics tab

The Metrics tab displays the latest datapoint for each series in a table format.

### Raw tab

The Raw tab shows the latest datapoint for each series as raw JSON returned by the data source.

### Visualization tab

The Visualization tab provides interactive charts for your metrics data.

#### Configuring visualizations

When the Visualization tab is selected, a settings panel appears on the right side of the screen. Use this panel to:

1. **Select chart type**: Choose from line, bar, pie, gauge, or table visualizations.
2. **Map axes**: Assign fields to the X and Y axes.
3. **Customize styles**: Adjust colors, legends, gridlines, and other visual options.

The visualization automatically updates as you modify settings.
