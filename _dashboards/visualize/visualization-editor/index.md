---
layout: default
title: Creating visualizations using queries
nav_order: 50
parent: Building data visualizations
grand_parent: OpenSearch Dashboards
has_children: true
has_toc: false
redirect_from:
  - /dashboards/visualize/visualization-editor/
---

# Creating visualizations using queries

The _visualization editor_ lets you create visualizations by writing [Piped Processing Language (PPL)]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/) or Prometheus Query Language (PromQL) queries. The editor automatically maps query result fields to chart axes and suggests a chart type based on the shape of your data. To open the visualization editor from a dashboard, select **Create new** > **Add visualization**.

## Prerequisites

Before using the visualization editor, complete the following setup steps.

### Step 1: Enable required settings

Add the following settings to your `opensearch_dashboards.yml` file:

```yaml
workspace.enabled: true
explore.enabled: true
```
{% include copy.html %}

After updating the configuration file, restart OpenSearch Dashboards for the changes to take effect.

### Step 2: Create a workspace

The visualization editor requires a workspace. To create a workspace, follow these steps:

1. Navigate to the OpenSearch Dashboards home page.
2. Select **Create workspace**.
3. Enter a workspace name.
4. Select the **Analytics (all features)** use case.
5. Select **Create workspace**.

For more information, see [Create a workspace]({{site.url}}{{site.baseurl}}/dashboards/workspace/create-workspace/).

### Step 3: Configure a data source

The visualization editor requires a dataset associated with your workspace:

- For PPL, configure an index pattern:

    1. Inside your workspace, go to **Index patterns** (under **Management**).
    2. Select **Create index pattern**.
    3. Enter the index name (for example, `opensearch_dashboards_sample_data_logs`).
    4. Select **Next step**.
    5. Select a time field (for example, `@timestamp`).
    6. Select **Create index pattern**.

For more information, see [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/).

- For PromQL (Prometheus data source), configure a Prometheus data source connection for your workspace. For more information, see [Connecting Prometheus to OpenSearch]({{site.url}}{{site.baseurl}}/dashboards/management/connect-prometheus/).

### Step 4 (Optional): Install sample data 

The examples in this documentation use the OpenSearch Dashboards sample datasets. To install the sample datasets, follow these steps:

1. In the left navigation panel, expand **Manage workspace** and select **Sample data**.
1. Select the **Add data** button in the **Sample log data** tile and any others that you want to add. The examples in this section use the sample log data.

For more information, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/getting-started/data-setup/#add-sample-data).

## Navigating the visualization editor UI

The following image shows the main components of the visualization editor.

![Visualization editor interface with callouts]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/visualization-editor-overview.png){: width="100%" }

- The _time filter_ (A) selects the time range for query results.
- The _Update button_ (B) runs or refreshes the query.
- The _query editor_ (C) is where you write PPL queries.
- The _Saved queries_ dropdown (D) saves and loads reusable queries.
- The _configuration panel_ (E) contains the chart type selector, field mappings, and style settings.

## Creating a visualization

To open the visualization editor, use one of the following methods:

- From the left navigation menu, select **Explorer** > **Logs**, then select the **Visualization** tab.
- From a dashboard, select the add panel icon, then select **Add visualization**.

To create a visualization, follow these steps:

1. Select a dataset from the dataset selector in the query bar (for example, **opensearch_dashboards_sample_data_logs**).
1. Write a PPL query in the query editor. If you selected a dataset, start the query with a pipe character (`|`). Otherwise, specify the source explicitly using `source =`. For example, the following query counts log events per hour:

   ```sql
   source = opensearch_dashboards_sample_data_logs | stats count() by SPAN(@timestamp, 1h)
   ```
   {% include copy.html %}

   If `opensearch_dashboards_sample_data_logs` is already selected as the dataset, you can omit the `source`:

   ```sql
   | stats count() by SPAN(@timestamp, 1h)
   ```
   {% include copy.html %}

1. Select **Update** or press **Enter** to run the query.
1. The editor automatically selects a chart type and maps fields to axes based on your query results. To change the chart type, use the **Visualization type** dropdown.
1. To customize the field mapping, use the **Fields** panel.

## Using dashboard variables

You can use dashboard variables to create dynamic, interactive visualizations. Variables let you switch between filter values, metrics, time intervals, and aggregation functions without editing the query. Reference variables in your PPL or PromQL queries using `$variableName` or `${variableName}` syntax.

For more information, see [Dashboard variables]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/dashboard-variables/).

## Saving a visualization

To save a visualization, select **Save** (or **Save and back** if you opened the editor from a dashboard). Enter a name for the visualization and select **Save**.

If you opened the visualization editor from a dashboard, the visualization is automatically added to that dashboard after saving. If you created the visualization from **Explorer** > **Logs**, save it first, then add it to a dashboard manually.

## Saving and reusing queries

To save a PPL query for reuse, select **Saved queries** > **Save query**. In the dialog, configure the following options.

| Option | Description |
| --- | --- |
| **Save as new query** | When selected, saves the query as a new entry rather than overwriting an existing one. |
| **Name** | A name for the saved query. |
| **Description** | An optional description of the query. |
| **Include filters** | When enabled, saves the currently applied filters along with the query. |
| **Include time filter** | When enabled, saves the current time range along with the query. |

Select **Save changes** to save the query.

To load a previously saved query, select **Saved queries** > **Open query**, then select a query from the list and select the **Open query** button. The saved query is loaded into the query editor.

## Visualization types

For a list of supported chart types and their expected data shapes, see [Visualization types]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/viz-types/).

## Configuring visualizations

Shared configuration options (fields, split, axes, tooltip, legend, thresholds, and more) apply across multiple visualization types. For details, see [Configuring visualizations in the visualization editor]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/).

## Related documentation

- [PPL]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/)
- [Dashboard variables]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/dashboard-variables/)
- [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/)
- [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/)
- [Connecting Prometheus to OpenSearch]({{site.url}}{{site.baseurl}}/dashboards/management/connect-prometheus/)

