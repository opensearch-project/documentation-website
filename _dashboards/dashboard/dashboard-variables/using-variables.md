---
layout: default
title: Using dashboard variables
parent: Dashboard variables
grand_parent: Creating dashboards
nav_order: 20
---

# Using dashboard variables

You can reference dashboard variables in queries and visualization editors to create dynamic, interactive dashboards.

## Variable syntax

Dashboard variables can be referenced in queries using the following syntax options.

### Simple syntax

Use `$variableName` for most cases:

```sql
source=logs | where service='$service' | stats count() by region
```
{% include copy.html %}

### Braced syntax

Use `${variableName}` when the variable name is followed by other characters without white space:

```sql
source = logs | where ${env}_level = "error"
```
{% include copy.html %}

Braced syntax ensures that the variable name is properly delimited. Without braces, `$env_level` is interpreted as a variable named `env_level` instead of `env`.

## Using variables in queries

Dashboard variables support Piped Processing Language (PPL) and Prometheus Query Language (PromQL). The following examples use PPL.

#### Single-value variable for filtering

The following query filters logs by a single-value variable:

```sql
source=logs | where service='$service' | stats count() by status_code
```
{% include copy.html %}

When `service` is set to `api`, the query resolves to:

```sql
source=logs | where service='api' | stats count() by status_code
```

#### Multi-value variable for filtering

The following query filters logs by a multi-value variable:

```sql
source=logs | where region IN $region | stats count() by service
```
{% include copy.html %}

When `region` has multiple values selected (`us-east`, `us-west`), the query resolves to:

```sql
source=logs | where region IN ('us-east', 'us-west') | stats count() by service
```

#### Multi-value with numbers

When a query variable's options are detected as numeric or Boolean values, multi-values are formatted without quotes:

```sql
source=logs | where status_code IN $status | stats count()
```
{% include copy.html %}

When `status` has multiple numeric values selected, the query resolves to:

```sql
source=logs | where status_code IN (200, 404, 500) | stats count()
```

#### Variable for grouping dimension

The following query uses a variable to control the grouping dimension:

```sql
source=logs | stats count() by `$group_by`
```
{% include copy.html %}

When `group_by` is set to `region`, the query resolves to:

```sql
source=logs | stats count() by region
```

#### Variable for time interval

The following query uses a variable to control the time interval:

```sql
source=logs | stats count() by span(timestamp, $interval)
```
{% include copy.html %}

When `interval` is set to `5m`, the query resolves to:

```sql
source=logs | stats count() by span(timestamp, 5m)
```

#### Variable for metric calculation

The following query uses a variable to control which metric is calculated:

```sql
source=metrics | stats avg($metric) by service
```
{% include copy.html %}

When `metric` is set to `response_time`, the query resolves to:

```sql
source=metrics | stats avg(response_time) by service
```

### Multi-value variable formatting

When a variable allows multiple selections, values are automatically formatted based on the query language.

<table>
  <thead>
    <tr>
      <th>Query language</th>
      <th>String values</th>
      <th>Numeric or Boolean values</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>PPL</td>
      <td><code>('value1', 'value2')</code></td>
      <td><code>(123, 456)</code></td>
    </tr>
    <tr>
      <td>PromQL</td>
      <td><code>(value1|value2)</code></td>
      <td><code>(value1|value2)</code></td>
    </tr>
    <tr>
      <td>Other</td>
      <td><code>value1, value2</code></td>
      <td><code>value1, value2</code></td>
    </tr>
  </tbody>
</table>

### Autocomplete suggestions

Query editors in OpenSearch Dashboards provide autocomplete suggestions for dashboard variables.

1. In the query editor, type `$`. A dropdown appears showing all available dashboard variables.
1. Select a variable from the list or continue typing to filter, as shown in the following image.

   ![Query editor showing autocomplete dropdown with available dashboard variables]({{site.url}}{{site.baseurl}}/images/dashboard-variables/variable_autocomplete.png)
1. Press Enter or Tab to insert the variable.

## Using variables in visualizations

Dashboard variables integrate with the OpenSearch Dashboards visualization editor, which provides full support for dashboard variables when editing visualizations from a dashboard.

### Filtering by a variable value

Variables can serve as filtering conditions within your visualizations. Instead of applying filters to entire dashboards, embed variables directly into PPL queries to create targeted filtering for specific panels.

To filter a visualization by a variable value, follow these steps:

1. Create a `machine_os` variable:
   1. In your Observability workspace, select **Dashboards** in the left navigation.
   1. Open an existing dashboard or select **Create** > **Dashboard** to create a new dashboard. If creating a new dashboard, save it first by entering a title and selecting **Save**.
   1. At the top of the dashboard, select **Add variable**.
   1. In the **Name**, enter `machine_os`. In the **Type**, select **Query**. In the **Options Query**, select `opensearch_dashboards_sample_data_logs`. In the query box, enter the following query:
   
      ```sql
      | FIELDS `machine.os`
      ```
      {% include copy.html %}
   1. Select **Preview** and make sure that you see values such as `win 8`, `ios`, and `win xp` in the **Preview of values**. Then select **Add variable** to save.


1. Filter by a variable value:
   1. Open a new visualization editor by selecting **Create new** in the dashboard and then selecting **Add visualization**. 
   1. In the time filter, select **Last 30 days**.
   1. In the query box, enter the following query:

   ```sql
   | WHERE `machine.os` = '${machine_os}' | STATS avg(memory) BY span(`@timestamp`, 1d) 
   ```
   {% include copy.html %}

   To filter the visualization by `machine_os` values, select the value in the `machine_os` dropdown list (for example, select `win 8`), as shown in the following image.

   ![Visualization editor showing average memory over time filtered by machine_os set to win 8]({{site.url}}{{site.baseurl}}/images/dashboard-variables/filter_case_variable.png)
   
### Selecting a metric dynamically

Use a variable to control which field is used in an aggregation. This lets you switch between metrics (for example, `memory` and `bytes`) without editing the query.

To select a metric dynamically, follow these steps:

1. Create a `log_metric` variable:
   1. In your Observability workspace, select **Dashboards** in the left navigation.
   1. Open an existing dashboard or select **Create** > **Dashboard** to create a new dashboard. If creating a new dashboard, save it first by entering a title and selecting **Save**.
   1. At the top of the dashboard, select **Add variable**.
   1. In the **Name**, enter `log_metric`. In the **Type**, select **Custom**. In the **Custom options**, enter `memory` and press **Enter** to add. Then enter `bytes` and press **Enter** to add. 
   1. Select **Add variable** to save.

1. Use the variable in a visualization:
   1. Open a new visualization editor by selecting **Create new** in the dashboard and then selecting **Add visualization**. 
   1. In the time filter, select **Last 30 days**.
   1. In the query box, enter the following query:

      ```sql
      source=opensearch_dashboards_sample_data_logs
      | stats avg($log_metric) as avg_${log_metric} by span(`timestamp`, 1h) as timestamp, response
      ```
      {% include copy.html %}

   To switch between metrics, select a value in the `log_metric` dropdown list (for example, select `memory` or `bytes`).

   ![Visualization editor showing average memory over time with the log_metric variable set to memory]({{site.url}}{{site.baseurl}}/images/dashboard-variables/metrics_case_variable.png)

### Changing time intervals dynamically

Use a variable to let dashboard viewers switch between time aggregation intervals (for example, `1h`, `6h`, or `1d`) without editing the query.

To change time intervals dynamically, follow these steps:

1. Create an `interval` variable:
   1. In your Observability workspace, select **Dashboards** in the left navigation.
   1. Open an existing dashboard or select **Create** > **Dashboard** to create a new dashboard. If creating a new dashboard, save it first by entering a title and selecting **Save**.
   1. At the top of the dashboard, select **Add variable**.
   1. In the **Name**, enter `interval`. In the **Type**, select **Custom**. In the **Custom options**, enter `1d` and press **Enter** to add. Repeat for `12h`, `6h`, and `1h`.
   1. Select **Add variable** to save.

1. Use the variable in a visualization:
   1. Open a new visualization editor by selecting **Create new** in the dashboard and then selecting **Add visualization**.
   1. In the time filter, select **Last 30 days**.
   1. In the query box, enter the following query:

      ```sql
      source=opensearch_dashboards_sample_data_logs | stats AVG(`bytes`) as avg_bytes, MAX(`bytes`) as max_bytes by span(`timestamp`, $interval)
      ```
      {% include copy.html %}

   To switch between intervals, select a value in the `interval` dropdown list (for example, select `6h`) and select **Update**. The visualization reflects the selected time bucketing, as shown in the following image.

   ![Visualization editor showing avg_bytes and max_bytes over time with the interval variable set to 1d]({{site.url}}{{site.baseurl}}/images/dashboard-variables/interval_case_variable.png)

### Changing aggregation functions dynamically

Use a variable to let dashboard viewers switch between aggregation functions (for example, `avg`, `max`, or `min`) without editing the query.

To change aggregation functions dynamically, follow these steps:

1. Create a `function` variable:
   1. In your Observability workspace, select **Dashboards** in the left navigation.
   1. Open an existing dashboard or select **Create** > **Dashboard** to create a new dashboard. If creating a new dashboard, save it first by entering a title and selecting **Save**.
   1. At the top of the dashboard, select **Add variable**.
   1. In the **Name**, enter `function`. In the **Type**, select **Custom**. In the **Custom options**, enter `avg` and press **Enter** to add. Repeat for `max` and `min`.
   1. Select **Add variable** to save.

1. Use the variable in a visualization:
   1. Open a new visualization editor by selecting **Create new** in the dashboard and then selecting **Add visualization**.
   1. In the time filter, select **Last 30 days**.
   1. In the query box, enter the following query:

      ```sql
      | STATS ${function}(memory) BY span(`@timestamp`, 1d)
      ```
      {% include copy.html %}

   To switch between functions, select a value in the `function` dropdown list (for example, select `max`) and select **Update**. The visualization reflects the selected aggregation function, as shown in the following image.

   ![Visualization editor showing average memory over time with the function variable set to avg]({{site.url}}{{site.baseurl}}/images/dashboard-variables/function_case_variable.png)

## Cascading and cross-panel variables

The following sections describe advanced variable use cases.

### Cascading variables

Create dependent variables for which one variable filters the options of another. For example, select a region first, then select from services available in that region.

Create a `region` variable:

```sql
source=logs | dedup region | fields region
```
{% include copy.html %}

Create a `service` variable that references `region`:

```sql
source=logs | where region='$region' | dedup service | fields service
```
{% include copy.html %}

When the `region` value changes, the `service` variable automatically refreshes its options to show only services in the selected region.

### Cross-panel filtering

Use a single variable to filter multiple visualizations simultaneously. For example, create a `service` variable and reference it in multiple visualization editors.

Visualization editor 1 (request count by service):

```sql
source=logs | where service='$service' | stats count() by status_code
```
{% include copy.html %}

Visualization editor 2 (response time by service):

```sql
source=metrics | where service='$service' | stats avg(response_time)
```
{% include copy.html %}

Changing the `service` variable value updates both visualization editors at once.

## Next steps

- [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/)
