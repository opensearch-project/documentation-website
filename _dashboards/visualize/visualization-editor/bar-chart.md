---
layout: default
title: Bar chart
parent: Visualization types
grand_parent: Creating visualizations using queries
great_grand_parent: Building data visualizations
nav_order: 15
---

# Bar chart

A bar chart displays data as vertical or horizontal bars, making it ideal for comparing discrete categories. You can use a Color field to break categories into sub-groups and add threshold lines to flag values higher or lower than a target.

## Creating a bar chart

The following examples build on each other, starting with a basic chart and adding complexity. Before you begin, complete the [prerequisites]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/#prerequisites).

### Basic bar chart

Start with an aggregation query that counts events by category:

```sql
source = opensearch_dashboards_sample_data_flights | stats count() by Carrier
```
{% include copy.html %}

After running this query, the visualization editor automatically selects a **Bar** chart and maps the fields:

- The **X-Axis** displays the `Carrier` field.
- The **Y-Axis** displays the `count()` field.

The result is a bar chart comparing the event count for each carrier, as shown in the following image.

![Basic bar chart showing count by carrier]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-chart-basic-result.png){: width="100%" }

### Grouped bar chart

Add a second dimension to your query to split each category into sub-groups:

```sql
source = opensearch_dashboards_sample_data_flights | stats count() by Carrier, Cancelled
```
{% include copy.html %}

This query groups the count by both carrier and the `Cancelled` field. Select `Cancelled` as the **Color** field to render a separate bar for each cancellation status within each carrier.

The result is a grouped bar chart in which each carrier has two bars side by side---one for non-canceled flights and one for canceled flights---making it easy to compare the flight counts for each cancellation status, as shown in the following image.

![Grouped bar chart showing count by carrier and cancellation status]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-chart-grouped-result.png){: width="100%" }

### Adding thresholds

Use thresholds to add reference lines and color-code bars based on a target value.

Using the same grouped bar chart from the previous example, configure the settings panel:

1. In the **Bar** section, enable **Use threshold colors**.
2. In the **Thresholds** section, select **+ Add threshold**.
3. Set the base color to green (`#00BD6B`) and add a threshold at value `200` with a red color (`#F13939`).
4. Set **Threshold lines mode** to **Dashed lines**, as shown in the following image.

![Bar chart settings with threshold configured at 200]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-chart-threshold-settings.png){: width="400" }

The result shows bars colored according to the threshold rules: bars below 200 appear green, while bars above 200 appear red. A dashed reference line at 200 provides a clear visual anchor, as shown in the following image.

![Bar chart with threshold coloring and dashed reference line at 200]({{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-chart-threshold-result.png){: width="100%" }

## Configuring a bar chart

You can configure the following settings in the configuration panel.

### Fields

In the **Fields** section, configure the fields displayed on each axis.

| Field | Description |
| --- | --- |
| **X-Axis** | Select a categorical or date field that defines the groups along the horizontal axis (for example, `Carrier`). |
| **Y-Axis** | Select one or more numeric fields that determine the height of the bars. When multiple fields are selected, each renders as a separate bar within each category group. |
| **Color** | Select a categorical field to split each category into grouped bars, each rendered in a different color. For example, use a `Cancelled` field to show separate bars for canceled and non-canceled flights within each carrier. |

### Split

In the **Split by** dropdown list, select a field to split the chart into separate elements by value. For more information, see [Split]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/#split).


### Bar

The following settings control the display style and sizing of bars.

| Setting | Description |
| --- | --- |
| **Stack** | Controls whether grouped bars are displayed side by side (**None**) or stacked on top of each other (**Stacked**). |
| **Size** | Controls bar width. **Auto** sizes bars automatically. **Manual** sets a specific width percentage (1–100). |
| **Use threshold colors** | When enabled, the chart colors bars based on the threshold rules defined in the Thresholds section. |
| **Show border** | When enabled, adds a border around each bar. You can configure border width and color. |

### Bucket

The following settings control how data is aggregated within each bar.

| Setting | Description |
| --- | --- |
| **Type** | The aggregation type used to calculate the value for each bucket. Supported values: **Sum**, **Average**, **Min**, **Max**, **Count**. |
| **Interval** | The time interval for grouping data into buckets. Supported values: **Auto**, **Month**, **Day**, **Hour**, **Minute**, **Second**. |

### Thresholds

For information about configuring thresholds, see [Thresholds]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/thresholds/).

### Axes

The X-axis and Y-axis share the same configuration options. For more information, see [Axes]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/configuring-visualizations/#axes).

### Tooltip

Toggle the **Show tooltip** selector to enable or disable tooltips.
