---
layout: default
title: Bar gauge
parent: Visualization editor
grand_parent: Building data visualizations
nav_order: 60
---

# Bar gauge

A bar gauge displays numeric values as horizontal or vertical bars against a scale, reducing each field to a single value. While similar to a bar chart, a bar gauge is better suited for comparing values against defined thresholds. Use a bar gauge when you want to:

- **Compare values across categories**: Display how different groups compare on the same scale after reducing each series to a single value.
- **Highlight threshold violations**: Use color-coded thresholds to indicate which categories fall within normal, warning, or critical ranges.

## Field selection

The bar gauge uses the following field mappings:

| Field | Description |
| --- | --- |
| **X-Axis** | Either the categorical field (category labels) or the numerical field (bar values), depending on orientation. When X is categorical and Y is numerical, bars are rendered horizontally. When X is numerical and Y is categorical, bars are rendered vertically. |
| **Y-Axis** | The complementary field to the X-Axis. If X is a category, Y provides the numeric values (and vice versa). |

## Bar gauge settings

The following settings let you customize the appearance and behavior of the bar gauge.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-gauge/bar-gauge-style-option.png" alt="Basic bar gauge showing count by operating system" width="400">

| Setting | Options | Description |
| --- | --- | --- |
| **Display style** | Gradient, Stack, Basic | Controls how the bar fill is rendered. **Gradient** fills the bar with a smooth color gradient generated from thresholds. **Stack** shows distinct colored segments for each threshold range. **Basic** fills the bar with a single solid color from the matching threshold. |
| **Value display** | Value Color, Text Color, Hidden | Controls how the numeric value label is colored. **Value Color** colors the text with the mapped threshold. **Text Color** uses the default text color. **Hidden** hides the value entirely. |
| **Show unfilled area** | On/Off | When enabled, displays a grey background behind the filled portion of each bar, making it easier to see the remaining distance to the maximum. |

### Value options

| Setting | Options | Description |
| --- | --- | --- |
| **Calculation** | Last \*, Last, First \*, First, Min, Max, Mean, Median, Variance, Count, Distinct count, Total | Determines how multiple data points for the same category are reduced to a single value. To learn more, refer to [value calculations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/style-options/value-calculations/). |

### Thresholds

A threshold represents a limit that, when met or exceeded by a data value, is reflected visually through its color. To learn more, refer to [thresholds setting]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/style-options/thresholds-setting/).

| Setting | Description |
| --- | --- |
| **Base color** | The color applied to values below the first threshold. The base threshold is always present and cannot be deleted, but its color can be changed. |
| **Threshold values** | Define one or more threshold breakpoints. Each threshold specifies a numeric value and a color. |

### Standard options

Min and max controls define the scale boundaries and work together with thresholds. When left empty, they are calculated automatically.

| Setting | Description |
| --- | --- |
| **Min** | The lower bound of the bar gauge scale. When the min value falls within a threshold range, it acts as a cutoff — only the portion of the range above the min is considered. If min is below all thresholds, the base color creates a base threshold starting at the min value. |
| **Max** | The upper bound of the bar gauge scale. Thresholds above this value are not applied. |
| **Unit** | An optional unit label applied to the displayed value. |

### Tooltip

| Setting | Options | Description |
| --- | --- | --- |
| **Tooltip mode** | All, Hidden | Controls tooltip visibility. **All** shows a tooltip with value details on hover. **Hidden** disables tooltips. |

## Tutorial: Building bar gauge

This tutorial walks you through bar gauge configurations using sample data. The examples use the sample web logs index with fields `machine.os` and `bytes`.

### Prerequisites

- A running OpenSearch Dashboards instance.
- An index with categorical and numeric data. (this tutorial uses a sample web log with a field such as `machine.os`,`bytes`)

### Step 1: Basic bar gauge with category breakdown

Start with a query that groups a numeric metric by a categorical field.

**Query:**

```sql
source = <index> | stats avg(bytes) by machine.os
```

After running this query, select **Bar Gauge** as the chart type. The fields are mapped as follows:

- `machine.os` is mapped to the **X-Axis** (categorical).
- `avg(bytes)` is mapped to the **Y-Axis** (numerical).

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-gauge/bar-gauge-fields.png" alt="Basic bar gauge showing average bytes by operating system" width="400">

The result is a set of vertical bars, one for each operating system, showing the average bytes for each. The **Show unfilled area** toggle is enabled by default, displaying a grey background behind each bar to indicate the remaining distance to the maximum.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-gauge/bar-gauge-initial.png" alt="Basic bar gauge showing average bytes by operating system" width="100%">

### Step 2: Adding thresholds and display styles

Open the **Thresholds** section and define breakpoints to color-code the bars. For example:

- Base color: green (values below 3000)
- Threshold at 3000: orange (moderate range)
- Threshold at 5000: red (high range)

Then in the **Bar Gauge** section, switch the **Display style** to see different visual treatments:

**Gradient** — Each bar fills with a smooth color transition through the thresholds it passes.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-gauge/bar-gauge-gradient.png" alt="Basic bar gauge showing average bytes by operating system" width="100%">

**Stack** — Each bar is divided into distinct colored segments at threshold boundaries.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-gauge/bar-gauge-stack.png" alt="Bar gauge with stack display style" width="100%">

**Basic** — Each bar uses a single solid color based on the highest threshold value the value reaches.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/bar-gauge/bar-gauge-basic.png" alt="Bar gauge with basic display style" width="100%">

## Next steps

- Explore other chart types available in the [visualization editor]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/).
- Add your visualization to a [dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
