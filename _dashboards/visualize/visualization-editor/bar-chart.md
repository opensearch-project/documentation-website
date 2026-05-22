---
layout: default
title: Bar chart
parent: Visualization editor
grand_parent: Building data visualizations
nav_order: 40
---

# Bar chart

A bar chart displays data as vertical or horizontal bars, making it ideal for comparing discrete categories. Use a bar chart when you want to:

- **Compare values across categories**: See how different groups (such as airline carriers or regions) compare on a numeric metric.
- **Rank items**: Quickly identify the largest or smallest values in a dataset.
- **Show grouped comparisons**: Use a Color field to break each category into sub-groups displayed side by side.
- **Highlight thresholds**: Add threshold lines and color-code bars to visually flag values above or below a target.

## Field selection

The bar chart uses the following field mappings:

| Field | Description |
| --- | --- |
| **X-Axis** | A categorical or date field that defines the groups along the horizontal axis (for example, `Carrier`). |
| **Y-Axis** | One or more numeric fields that determine the height of the bars. When multiple Y-Axis fields are selected, each renders as a separate bar within each category group. |
| **Color** | A categorical field used to split each category into grouped bars, each rendered in a different color. For example, use a `Cancelled` field to show separate bars for cancelled and non-cancelled flights within each carrier. |

## Bar chart settings

The following settings let you customize the appearance of the bar chart.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-chart-settings.png" alt="Bar chart settings panel" width="400">

### Bar section

| Setting | Options | Description |
| --- | --- | --- |
| **Stack** | None, Stacked | Controls whether grouped bars are displayed side by side (None) or stacked on top of each other (Stacked). |
| **Size** | Auto, Manual | Controls bar width. Auto sizes bars automatically. Manual lets you set a specific width percentage (1–100). |
| **Use threshold colors** | On/Off | When enabled, bars are colored based on the threshold rules defined in the Thresholds section. |
| **Show border** | On/Off | When enabled, adds a border around each bar. You can configure border width and color. |

### Bucket section

| Setting | Options | Description |
| --- | --- | --- |
| **Type** | Sum, Average, Min, Max, Count | The aggregation type used to calculate the value for each bucket. |

### Thresholds section

| Setting | Description |
| --- | --- |
| **+ Add threshold** | Adds a threshold rule. Each threshold defines a color and a numeric value. Bars exceeding the threshold value are colored with the corresponding color when **Use threshold colors** is enabled. A dashed reference line is drawn at the threshold value. |
| **Threshold lines mode** | Controls the style of the threshold reference line (for example, Dashed lines). |

## Tutorial: Building bar charts

This tutorial walks you through building bar charts and customizing them with thresholds.

### Prerequisites

- A running OpenSearch Dashboards instance.
- An index with categorical data (this tutorial uses a sample flights index with fields such as `Carrier` and `Cancelled`).

### Step 1: Basic bar chart

Start with a simple aggregation query that counts events by category.

**Query:**

```sql
source = <index> | stats count() by Carrier
```

After running this query, the visualization editor automatically suggests a **Bar** chart because the query returns one categorical field and one numeric field. The fields are mapped automatically:

- `Carrier` is mapped to the **X-Axis**.
- `count()` is mapped to the **Y-Axis**.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-chart-basic-fields.png" alt="Basic bar chart field mapping showing Carrier on X-Axis and count on Y-Axis" width="400">

The result is a simple bar chart comparing the event count for each carrier.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-chart-basic-result.png" alt="Basic bar chart showing count by carrier" width="100%">

### Step 2: Grouped bar chart with a Color field

Add a second dimension to your query to split each category into sub-groups.

**Query:**

```sql
source = <index> | stats count() by Carrier, Cancelled
```

This query groups the count by both carrier and the `Cancelled` field. Select `Cancelled` as the **Color** field to render a separate bar for each cancellation status within each carrier.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-chart-color-fields.png" alt="Color field selection with Cancelled field" width="400">

The result is a grouped bar chart where each carrier has two bars side by side — one for non-cancelled flights and one for cancelled flights — making it easy to compare their relative proportions.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-chart-grouped-result.png" alt="Grouped bar chart showing count by carrier and cancellation status" width="100%">

### Step 3: Adding thresholds

Thresholds let you add reference lines and color-code bars based on a target value.

Using the same grouped bar chart from Step 2, configure the settings panel:

1. In the **Bar** section, enable **Use threshold colors**.
2. In the **Thresholds** section, click **+ Add threshold**.
3. Set the base color to green (`#00BD6B`) and add a threshold at value `200` with a red color (`#F13939`).
4. Set **Threshold lines mode** to **Dashed lines**.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-chart-threshold-settings.png" alt="Bar chart settings with threshold configured at 200" width="400">

The result shows bars colored based on the threshold rules: bars below 200 appear green, while bars above 200 appear red. A dashed reference line at 200 provides a clear visual anchor.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-chart-threshold-result.png" alt="Bar chart with threshold coloring and dashed reference line at 200" width="100%">

## Next steps

- Explore other chart types available in the [visualization editor]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/).
- Add your visualization to a [dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
