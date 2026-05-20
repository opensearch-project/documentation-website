---
layout: default
title: Using dashboard variables in the dashboard
parent: Dashboard variables
nav_order: 20
---

# Using dashboard variables in the dashboard

This page covers how to use dashboard variables in the dashboard.

## Variable syntax

Dashboard variables can be referenced in queries using two syntax options:

### Simple syntax

Use `$variableName` for most cases:

```sql
source=logs | where service='$service' | stats count() by region
```

### Braced syntax

Use `${variableName}` when the variable name is followed by other characters without white space:

```sql
source = logs | where ${env}_level = "error"
```

The braced syntax ensures the variable name is properly delimited. Without braces, `$env_level` would look for a variable named `env_level` instead of `env`.

---

## Using variables in query

Dashboard variables work with PPL, PromQL and any future query languages. Take PPL as an example:

### PPL (Piped Processing Language)

**Single-value variable for filtering**:

```sql
source=logs | where service='$service' | stats count() by status_code
```

When `service` is set to `api`, the executed query becomes:

```sql
source=logs | where service='api' | stats count() by status_code
```

**Multi-value variable for filtering**:

```sql
source=logs | where region IN $region | stats count() by service
```

When `region` has multiple values selected (`us-east`, `us-west`), the executed query becomes:

```sql
source=logs | where region IN ('us-east', 'us-west') | stats count() by service
```

**Multi-value with numbers**:

When a Query variable's options are detected as numbers or booleans, multi-values are formatted without quotes:

```sql
source=logs | where status_code IN $status | stats count()
```

Becomes:

```sql
source=logs | where status_code IN (200, 404, 500) | stats count()
```

**Variable for grouping dimension**:

```sql
source=logs | stats count() by `$group_by`
```

When `group_by` is set to `region`, the query becomes:

```sql
source=logs | stats count() by region
```

**Variable for time interval**:

```sql
source=logs | stats count() by span(timestamp, $interval)
```

When `interval` is set to `5m`, the query becomes:

```sql
source=logs | stats count() by span(timestamp, 5m)
```

**Variable for metric calculation**:

```sql
source=metrics | stats avg($metric) by service
```

When `metric` is set to `response_time`, the query becomes:

```sql
source=metrics | stats avg(response_time) by service
```

### Multi-value variable formatting

When a variable allows multiple selections, values are automatically formatted based on the query language:

| Query language | String values | Number/Boolean values |
|----------------|---------------|----------------------|
| PPL | `('value1', 'value2')` | `(123, 456)` |
| PromQL | `(value1\|value2)` | `(value1\|value2)` |
| Other | `value1, value2` | `value1, value2` |

The formatting happens automatically during query interpolation. You don't need to handle the formatting yourself.

### Autocomplete support

Query editors in OpenSearch Dashboards provide autocomplete suggestions for dashboard variables.

1. In the query editor, type `$`.
2. A dropdown appears showing all available dashboard variables.
3. Select a variable from the list or continue typing to filter.
4. Press Enter or Tab to insert the variable.

<img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/variable_autocomplete.png" alt="variables autocomplete">

### Query interpolation

Query interpolation is the process of replacing variable placeholders with their actual values before executing a query.

**How interpolation works:**

1. When a visualization is rendered, the original query text is preserved with variable placeholders (for example, `source=logs | where service=$service`).
2. Before executing the query, the interpolation service detects variable references using the pattern `$variableName` or `${variableName}`.
3. Each placeholder is replaced with the variable's current value.
4. The interpolated query is sent to the data source for execution.

This process is automatic and transparent. You write queries with variable placeholders, and they are executed with actual values.


## Using dashboard variables in dashboard

Dashboard variables integrate with OpenSearch Dashboards visualization editor which provides full support for dashboard variables when editing visualizations from a dashboard.

### Filter selected visualizations
Variables can serve as filtering conditions within your visualizations. Instead of applying filters to entire dashboards, embed variables directly into PPL queries to create targeted filtering for specific panels.

1. Creating a query type variable named `machine_os` by a PPL query in a new dashboard

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/filter_case_1.png" alt="filter case 1">

2. Creating a new visualization editor with the `${machine_os}` variable, save and return to the dashboard

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/filter_case_2.png" alt="filter case 2">

   Visualization editor query:

   ```sql
   | WHERE `machine.os` = '${machine_os}' | STATS avg(memory) BY span(`@timestamp`, 1d) 
   ```

3. Change the `machine_os` options and you can see the visualization change

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/filter_case_3.gif" alt="filter case 3">
   
### Interactive metric selection control visualizations
Variables can serve as metric components, acting as dynamic metric conditions within your visualizations. Embed variables into queries to parameterize which metrics to calculate or display.

1. Creating a custom type variable named `log_metric` with `memory` and `bytes` options in the dashboard

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/metrics_case_1.png" alt="metrics case 1">

2. Creating a new visualization editor with the `${log_metric}` variable, save and return to the dashboard

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/metrics_case_2.png" alt="metrics case 2">

   Visualization editor query:

   ```sql
   source=opensearch_dashboards_sample_data_logs
   | stats avg($log_metric) as avg_${log_metric} by span(`timestamp`, 1h) as timestamp, response
   ```

3. Change the `log_metric` options and you can see the visualization change

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/metrics_case_3.gif" alt="metrics case 3">

### Time interval control visualizations
Variables can serve as time interval components, acting as span conditions within your visualizations. Embed variables into your queries to dynamically control time bucketing and aggregation intervals.

1. Creating a custom type variable named `Interval` with `1d`, `12h`, `6h` and `1h` options in the dashboard

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/interval_case_1.png" alt="interval case 1">

2. Creating a new visualization editor with the `${Interval}` variable, save and return to the dashboard

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/interval_case_2.png" alt="interval case 2">

   Visualization editor query:

   ```sql
   source=opensearch_dashboards_sample_data_logs
   | stats AVG(`bytes`) as avg_bytes, MAX(`bytes`) as max_bytes by span(`timestamp`, $Interval)
   ```

3. Change the `Interval` options and you can see the visualization change

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/interval_case_3.gif" alt="interval case 3">

### Dynamic aggregation functions control visualizations
Variables can serve as aggregation functions, acting as dynamic STATS conditions within your visualizations. Embed variables into queries to parameterize which statistical operations to perform on your data.

1. Creating a custom type variable named `function` with `max`, `min` and `avg` options in the dashboard

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/function_case_1.png" alt="function case 1">

2. Creating a new visualization editor with the `${function}` variable, save and return to the dashboard

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/function_case_2.png" alt="function case 2">

   Visualization editor query:

   ```sql
   | WHERE `machine.os` = '${machine_os}' | STATS ${function}(memory) BY span(`@timestamp`, 1d) 
   ```

3. Change the `function` options and you can see the visualization change

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/function_case_3.gif" alt="function case 3">

## Advanced use cases

### Cascading variables

Create dependent variables where one variable filters the options of another.

**Example**: Select a region first, then select from services available in that region.

1. Create a `region` variable:
   ```sql
   source=logs | dedup region | fields region
   ```

2. Create a `service` variable that references `region`:
   ```sql
   source=logs | where region='$region' | dedup service | fields service
   ```

When the `region` value changes, the `service` variable automatically refreshes its options to show only services in the selected region.

### Cross-panel filtering

Use a single variable to filter multiple visualizations simultaneously.

**Example**: Create a `service` variable and reference it in multiple visualization editors:

**Visualization editor 1** - Request count by service:
```sql
source=logs | where service='$service' | stats count() by status_code
```

**Visualization editor 2** - Response time by service:
```sql
source=metrics | where service='$service' | stats avg(response_time)
```

Changing the `service` variable value updates both visualization editors at once.

## Next steps

- [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/) - Learn more about dashboard features
