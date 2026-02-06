---
layout: default
title: Discover logs
nav_order: 44
redirect_from:
  - /observability-plugin/discover-logs/
---

# Discover logs
Introduced 3.3
{: .label .label-purple }

Discover logs is a powerful log analytics tool that allows you to explore and analyze application logs using Piped Processing Language (PPL). With Discover logs, you can query log data, create visualizations from aggregated results, and add those visualizations to dashboards.

## Overview

Discover logs provides the following capabilities:

- **PPL-based querying**: Use PPL syntax to filter, aggregate, and transform log data.
- **Automatic visualization**: When you use aggregation commands like `stats`, the interface automatically switches to a visualization view.
- **Multiple visualization types**: Choose from Line, Area, Bar, Metric, State timeline, Heatmap, Bar Gauge, and Pie charts.
- **Dashboard integration**: Save visualizations directly to new or existing dashboards.
- **Query management**: Save queries for reuse and access recent queries.

## Prerequisites

Before using Discover logs, ensure the following:

1. **Feature flags enabled**: Add the following settings to your `opensearch_dashboards.yml` file:

   ```yaml
   workspace.enabled: true
   data_source.enabled: true
   explore.enabled: true
   ```
   {% include copy.html %}

2. **Observability workspace**: You must be working within the Observability workspace. Discover logs is only available in this workspace.

3. **Logs dataset configured**: You must have at least one logs dataset configured. See [Datasets]({{site.url}}{{site.baseurl}}/observing-your-data/datasets/) for instructions on creating a logs dataset.

## Accessing Discover logs

To access Discover logs:

1. Open OpenSearch Dashboards and switch to the **Observability** workspace.
2. From the navigation menu, select **Discover** > **Logs**.

## Interface overview

The Discover logs interface consists of the following components:

![Discover logs interface]({{site.url}}{{site.baseurl}}/images/discover-logs/discover-logs-interface.png)

- **PPL editor**: The query bar at the top where you write PPL queries. The editor provides autocomplete suggestions as you type.
- **Dataset selector**: Select which logs dataset to query from the dropdown next to the PPL label.
- **Recent queries**: Access previously run queries.
- **Saved queries**: Access queries you have saved for reuse.
- **Fields panel**: Located on the left side, displays available fields organized into **Selected** fields and **Query** fields sections.
- **Log count histogram**: Shows the distribution of log entries over time. Use the **Interval** selector to adjust the time bucket size.
- **Results area**: Displays query results with two tabs:
  - **Logs**: Shows individual log entries in a table format.
  - **Visualization**: Displays aggregated data as charts when using `stats` commands.
- **Time range selector**: Located in the upper right, allows you to set the time range for your query.

## Querying logs with PPL

Discover logs uses PPL (Piped Processing Language) for querying log data. PPL allows you to chain commands using the pipe character (`|`) to filter, transform, and aggregate data.

### Basic queries

To retrieve all logs from your dataset, simply run a query without any filters. The results appear in the **Logs** tab showing individual log entries.

### Filtering with WHERE clause

Use the `WHERE` clause to filter logs based on field values:

```sql
| WHERE `resource.attributes.service.name` = 'frontend-proxy'
```
{% include copy.html %}

![Filtered logs view]({{site.url}}{{site.baseurl}}/images/discover-logs/discover-logs-filtered.png)

You can combine multiple conditions:

```sql
| WHERE `resource.attributes.service.name` = 'frontend-proxy'
| WHERE `attributes.url.path` in ("/api/cart","/api/checkout")
```
{% include copy.html %}

### PPL autocomplete

The PPL editor provides autocomplete suggestions as you type. This includes:

- PPL commands (`WHERE`, `STATS`, `SORT`, etc.)
- Field names from your dataset
- Functions and operators

### Managing queries

- **Recent queries**: Select **Recent queries** to view and rerun previously executed queries.
- **Saved queries**: Select **Saved queries** to access queries you have saved. To save the current query, select **Actions** > **Save query**.

## Creating visualizations from logs

When you use the `stats` command to aggregate data, Discover logs automatically switches to the **Visualization** tab to display the results as a chart.

### Using the stats command

The `stats` command aggregates data based on specified fields. For example, to count logs per minute grouped by URL path:

```sql
| WHERE `resource.attributes.service.name` = 'frontend-proxy'
| WHERE `attributes.url.path` in ("/api/cart","/api/checkout")
| STATS count() by span(time, 1m), `attributes.url.path`
```
{% include copy.html %}

When you run this query, the interface automatically switches to the **Visualization** tab and displays a chart.

![Visualization from logs]({{site.url}}{{site.baseurl}}/images/discover-logs/discover-logs-visualization.png)

### Visualization types

Select the **Visualization type** dropdown in the Settings panel to choose from the following chart types:

![Visualization type options]({{site.url}}{{site.baseurl}}/images/discover-logs/discover-logs-viz-types.png)

| Type | Description |
|:-----|:------------|
| **Line** | Displays data as connected points, ideal for showing trends over time |
| **Area** | Similar to line charts but with the area below the line filled in |
| **Bar** | Displays data as vertical or horizontal bars for comparing categories |
| **Metric** | Shows a single aggregated value as a large number |
| **State timeline** | Displays state changes over time in a horizontal timeline |
| **Heatmap** | Uses color intensity to represent values in a matrix format |
| **Bar Gauge** | Displays values as horizontal bars with configurable thresholds |
| **Pie** | Shows proportions as slices of a circular chart |

### Visualization settings

The **Settings** panel on the right side provides options to customize your visualization:

- **Fields**: Configure which fields map to the X-Axis, Y-Axis, and Color dimensions. Use the **Switch axes** toggle to swap X and Y axes.
- **Bar/Bucket**: For bar charts, configure bar size (Auto or Manual) and bucket settings (Type, Interval).
- **Thresholds**: Define value thresholds with custom colors.
- **Axes**: Configure axis labels, scales, and formatting.
- **Legend**: Control legend visibility and position.

### Switching axes

For bar charts, you can toggle **Switch axes** in the Fields section to change the chart orientation from vertical to horizontal bars:

![Bar chart with switched axes]({{site.url}}{{site.baseurl}}/images/discover-logs/discover-logs-switch-axes.png)

## Adding visualizations to dashboards

You can save your visualizations directly to dashboards for ongoing monitoring.

1. After creating a visualization, select **Add to dashboard** in the results area.

2. In the **Save and Add to Dashboard** dialog, choose one of the following options:
   - **Save to existing dashboard**: Select an existing dashboard from the dropdown.
   - **Save to new dashboard**: Enter a name for the new dashboard.

3. Enter a name for the saved search in the **Save search** field.

4. Select **Add** to save the visualization to the dashboard.

![Save and Add to Dashboard dialog]({{site.url}}{{site.baseurl}}/images/discover-logs/discover-logs-add-dashboard.png)

## Related documentation

- [Datasets]({{site.url}}{{site.baseurl}}/observing-your-data/datasets/) -- Create and manage logs datasets
- [PPL]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) -- Learn PPL query syntax
- [Correlations]({{site.url}}{{site.baseurl}}/observing-your-data/correlations/) -- Link logs and traces datasets
