---
layout: default
title: Dashboard variables
has_children: true
nav_order: 75
redirect_from:
  - /dashboards/dashboard-variables/
---

# Dashboard variables
**Introduced 3.7.0**
{: .label .label-purple }

Using dashboard variables, you can create interactive, dynamic dashboards by defining reusable values that can be referenced in visualization queries. Variables can be used for filters, metrics, dimensions, intervals, fields, aggregations, and any other query parameter, eliminating the need to manually edit queries.

Dashboard variables are available in **Observability** workspaces only. To use dashboard variables, create an Observability workspace if you don't already have one.
{: .note}

Use dashboard variables to:

- Change query parameters without editing visualizations.
- Define values once and reference them across multiple visualizations.
- Automatically update visualizations when variable values change.
- Create cascading filters with dependent variables.
- Dynamically control grouping, aggregation, and time intervals.

## Variable types

OpenSearch Dashboards supports two types of variables:

- **Query variables**: Options are dynamically fetched from a data source using a Piped Processing Language (PPL) or Prometheus Query Language (PromQL) query. Use query variables when values change over time or depend on underlying data, such as service names from logs or available regions from metrics.

- **Custom variables**: Options are manually defined as a static list. Use custom variables for predefined categories like environment types (`dev`, `staging`, `prod`) or fixed status codes.

## Variable syntax

You can reference variables in queries using `$variableName` or `${variableName}` syntax:

```sql
source=logs | where service='${service}' | stats count() by region
```
{% include copy.html %}

When you change a variable's value in a dashboard, all visualizations referencing that variable automatically refresh using the new value.

## Enabling dashboard variables

In your `opensearch_dashboards.yml` file, configure the following settings:

```yaml
workspace.enabled: true
explore.enabled: true
```
{% include copy.html %}

Restart OpenSearch Dashboards for the changes to take effect.

## Creating and using dashboard variables

The following tutorial uses the OpenSearch Dashboards sample web logs dataset to create a variable and use it in a visualization.

### Step 1: Create a workspace

1. Navigate to the OpenSearch Dashboards home page.
1. Select **Create workspace**.
1. Enter a workspace name (for example, `My Observability`).
1. Under **Use case**, select **Observability**.
1. Select **Create workspace**.

For more information, see [Create a workspace]({{site.url}}{{site.baseurl}}/dashboards/workspace/create-workspace/).

### Step 2: Set up sample data

1. In the workspace, navigate to **Manage workspace** > **Sample data** and select **Add data** for the web logs dataset.
1. Create an index pattern for the sample data:
   1. Navigate to **Manage workspace** > **Index patterns**.
   1. Select **Create index pattern**.
   1. In the **Index pattern name** field, enter `opensearch_dashboards_sample_data_logs`.
   1. Select **Next step**.
   1. In the **Time field** dropdown, select `timestamp`.
   1. Select **Create index pattern**.

### Step 3: Create a variable

1. Select **Dashboards** in the left navigation.
1. Select **Create** > **Dashboard**.
1. Save the dashboard by entering a title (for example, `Log Analysis`) and selecting **Save**.
1. At the top of the dashboard, select **Add variable**.
1. Configure the following settings:
   - **Name**: `extension`
   - **Type**: **Query**
   - **Dataset**: Select `opensearch_dashboards_sample_data_logs`
   - **Options Query**:

     ```sql
     source=opensearch_dashboards_sample_data_logs | stats count() by extension | fields extension
     ```
     {% include copy.html %}

1. Select **Preview** to verify the results. The preview should display values: `css`, `deb`, `gz`, `rpm`, and `zip`.
1. Select **Add variable** to save.

The `extension` variable now appears at the top of the dashboard with a dropdown.

For more information, see [Managing dashboard variables]({{site.url}}{{site.baseurl}}/dashboards/dashboard-variables/managing-variables/).

### Step 4: Use the variable in a visualization

1. In the dashboard, select **Create new**.
1. Select **Add visualization** to open the visualization editor.
1. In the query editor, enter the following PPL query that references the `$extension` variable:

   ```sql
   | where extension='$extension' | stats count() by response
   ```
   {% include copy.html %}

1. In the `extension` dropdown at the top of the editor, select a value (for example, `css`).
1. Select **Update** to run the query.

The visualization displays the response code distribution filtered by the selected extension, as shown in the following image.

![Visualization editor showing a bar chart of response codes filtered by the selected extension value]({{site.url}}{{site.baseurl}}/images/dashboard-variables/variable-visualization-result.png)

When you change the `extension` value in the dropdown, the visualization automatically updates to reflect the new selection.

If no results appear, expand the time range (for example, **Last 90 days**) using the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/) in the upper-right corner.
{: .tip}

For more information, see [Using dashboard variables]({{site.url}}{{site.baseurl}}/dashboards/dashboard-variables/using-variables/).

## Variable storage

Variables are stored as part of the dashboard saved object in OpenSearch. Each dashboard maintains its own set of variables independently.

The `variablesJSON` attribute in the dashboard saved object contains the variable configurations:

```typescript
{
  type: "dashboard",
  id: "dashboard-id",
  attributes: {
    title: "My Dashboard",
    variablesJSON: "{\"variables\":[...]}"
  }
}
```
{% include copy.html %}

Variable configurations include the following components:

- Metadata (name, label, description, type).
- Options (query definition for query type or custom values for custom type).
- Settings (multi-select, "All" option, sort order, visibility).
- Current values (selected values for each variable).

Current variable values are also synchronized to the dashboard URL so that you can:

- Share dashboards with specific filter values preselected.
- Bookmark dashboards with desired variable states.
- Persist variable selections across page refreshes.
