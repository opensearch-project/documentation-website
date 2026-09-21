---
layout: default
title: Query Panel
parent: Creating visualizations using queries
grand_parent: Building data visualizations
nav_order: 91
redirect_from:
  - /dashboards/visualize/visualization-editor/query-panel/
---

# Query Panel

Use the query panel to choose a query language and dataset, write or build a query, and run it to generate data for a visualization.

The query panel supports Piped Processing Language (PPL), Prometheus Query Language (PromQL), and, when enabled, SQL.

```
explore.sqlSupport.enabled: true
```

AI query generation is available when prompt mode is enabled for the selected dataset.

## Query panel controls

The query panel includes the following controls.

| Control              | Description                                                                                                   |
| :------------------- | :------------------------------------------------------------------------------------------------------------ |
| **Language toggle**  | Switches the editor between PPL, PromQL, SQL, and AI when those options are available.                        |
| **Dataset selector** | Selects the dataset or data source queried by the editor. Available datasets depend on the selected language. |
| **Saved queries**    | Saves the current query or loads a previously saved query.                                                    |
| **Query editor**     | Provides the text editor, or the PromQL editor/builder when PromQL is selected.                               |

![Query Panel]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/query-panel/query-panel.png){: width="100%" }

## Selecting a query language

Use the language toggle to select the query language. The selected language determines which datasets are available and which editor features are shown.

| Language   | Description                                                                                               |
| :--------- | :-------------------------------------------------------------------------------------------------------- |
| **PPL**    | Queries OpenSearch datasets using Piped Processing Language.                                              |
| **PromQL** | Queries Prometheus data sources and displays the PromQL multi-query editor.                               |
| **SQL**    | Queries OpenSearch datasets using SQL. This option appears only when SQL support is enabled.              |
| **AI**     | Generates a query from a natural language prompt. This option appears only when prompt mode is available. |

## Selecting a dataset

Use the dataset selector to choose the data queried by the visualization editor. Dataset availability depends on the selected query language:

- **PPL** and **SQL** use OpenSearch datasets, such as indexes and index patterns.
- **PromQL** uses Prometheus datasets.

## Writing PPL queries

When a dataset is selected, you can start a PPL query. The visualization editor uses the selected dataset as the query source.

For example, if `opensearch_dashboards_sample_data_logs` is selected, you can enter the following query:

```sql
| stats count() by response
```

You can also include the source explicitly:

```sql
source = opensearch_dashboards_sample_data_logs | stats count() by response
```

## Writing PromQL queries

When **PromQL** is selected, the editor displays a multi-query editor. Each query row can be written in **Builder** mode or **Code** mode.

![Promql Panel]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/query-panel/promql-panel.png){: width="60%" }

Use **Builder** mode to build a PromQL query from metric names, label filters, and operations. Use **Code** mode to write PromQL directly. Some code queries cannot be represented in Builder mode, so switching back to Builder mode may not be available for complex queries.

The following example uses builder mode to write a PromQL query:

```sql
sum(rate(go_gc_heap_allocs_bytes_total[50060s]))
```

![Promql Builder]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/query-panel/promql-builder-case.png){: width="100%" }

You can manage PromQL query rows as follows:

- Select **Add query** to add another PromQL query row.
- Use the remove icon to delete a query row.
- Drag query rows to reorder them.
- Click **Update** or press **Command+Enter**(only in code mode) to run the query.

## PromQL query options

PromQL provides per-query options for each query row and shared options for all rows.

![Promql Builder]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/query-panel/per-query-option.png){: width="100%" }

### Series name

Use **Series name** to customize the displayed series name. You can reference metric labels using double braces.

For example, enter {% raw %}`{{job}}`{% endraw %} to name each series by its job label, or enter {% raw %}`{{job}}-{{instance}}`{% endraw %} to combine multiple labels.

The following chart sets **Series name** to {% raw %}`{{operation}}`{% endraw %} and uses the result to build a bar chart.

![Bar chart using operation as the series name]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/query-panel/series-name-operation.png)

### Min step

Use **Min step** to set the lower bound for the PromQL query step. Enter a duration with a unit, such as `15s`, `1m`, or `2h`.

### Max data points

Use **Max data points** to set the maximum number of points returned per series. This option is shared by all PromQL query rows. Leave it empty to use the automatic value.

![Overall query options for max point]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/query-panel/max-point.png)

## Saving and reusing queries

To save a query for reuse, select **Saved queries** > **Save query**. To load a saved query, select **Saved queries** > **Open query**, then choose the query to load.

![Open saved queries]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/query-panel/open-saved-query.png){: width="60%" }
