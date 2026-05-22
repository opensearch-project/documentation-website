---
layout: default
title: Gauge chart
parent: Visualization editor
grand_parent: Building data visualizations
nav_order: 20
---

# Gauge chart

A gauge chart displays a single numeric value on a semicircular arc, making it ideal for showing how a metric compares against defined thresholds or a target range. Use a gauge chart when you want to:

- **Monitor a KPI against targets**: Show whether a metric (such as average ticket price, CPU usage, or error rate) falls within acceptable, warning, or critical ranges.
- **Summarize a single value**: Reduce a dataset to one meaningful number (for example, the latest value, mean, or total) and display it prominently.

## Field selection

The gauge chart uses the following field mapping:

| Field | Description |
| --- | --- |
| **Value** | A numeric field whose values are reduced to a single number using the configured calculation method. The result is displayed as the gauge's current value. |

## Gauge chart settings

The following settings let you customize the appearance and behavior of the gauge chart.

### Gauge

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/gauge/gauge-chart-style-option.png" alt="Gauge chart settings panel" width="400">

| Setting | Options | Description |
| --- | --- | --- |
| **Use threshold colors** | On/Off | When enabled, the central numeric value adopts the color of the threshold range that the current value falls within. |
| **Show title** | On/Off | Displays a label below the numeric value. Defaults to the field name, but you can override it with custom text. |
| **Title** | Free text | Custom title text displayed below the value when **Show title** is enabled. If left blank, the field name is used. |

### Value options

| Setting | Options | Description |
| --- | --- | --- |
| **Calculation** | Last \*, Last, First \*, First, Min, Max, Mean, Median, Variance, Count, Distinct count, Total | Determines how multiple data points are reduced to the single value shown on the gauge. To learn more, refer to [value calculations]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/style-options/value-calculations/). |

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
| **Min** | The lower bound of the gauge scale. When the min value falls within a threshold range, it acts as a cutoff — only the portion of the range above the min is considered. If min is below all thresholds, the base color creates a base threshold starting at the min value. |
| **Max** | The upper bound of the gauge scale. Thresholds above this value are not applied. |
| **Unit** | An optional unit label applied to the displayed value. |

## Tutorial: Building gauge charts

This tutorial walks you through progressively more complex gauge chart configurations using sample data.

### Prerequisites

- A running OpenSearch Dashboards instance.
- An index with numeric data (this tutorial uses the sample flights index with a field such as `AvgTicketPrice`).

### Step 1: Basic gauge chart

Start with a query that returns a single numeric aggregation.

**Query:**

```sql
source = <index> | FIELDS AvgTicketPrice
```

After running this query, select **Gauge** as the chart type. The visualization automatically applies the **Last** calculation to reduce the series to a single value for display. The field is mapped as follows:

- `avg(AvgTicketPrice)` is mapped to the **Value** field.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/gauge/gauge-chart-value-field.png" alt="Gauge chart field mappings" width="400">

The result is a gauge displaying the last average ticket price with the default green arc.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/gauge/gauge-initial-look.png" alt="Initial gauge chart showing the last average ticket price" width="100%">

### Step 2: Adding thresholds

Define threshold breakpoints to segment the gauge arc into colored ranges that indicate value health.

Using the same query as Step 1, open the **Thresholds** section in the settings panel and add thresholds. For example:

- Base color: green (values below 500)
- Threshold at 500: yellow (moderate price range)
- Threshold at 800: red (high price range)

The arc now shows colored bands — green up to 500, yellow from 500 to 800, and red above 800. Enable **Use threshold colors** to apply the matching threshold color to the displayed value text and the arc.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/gauge/gauge-with-thresholds.png" alt="Gauge chart with color-coded threshold bands" width="100%">

### Step 3: Customizing the gauge scale and adding unit

When monitoring ticket prices, you may want a fixed scale that represents the full expected range and a dedicated unit. Open the **Standard options** section and set:

- **Min**: `500`
- **Max**: `1200`

The gauge now always spans from 500 to 1200, making it easier to compare across split panels.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/gauge/gauge-custom-scale.png" alt="Gauge chart with custom min/max scale and unit" width="100%">

## Next steps

- Explore other chart types available in the [visualization editor]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/).
- Add your visualization to a [dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).