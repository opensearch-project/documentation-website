---
layout: default
title: Scatter
parent: Visualization editor
grand_parent: Building data visualizations
nav_order: 80
---

# Scatter

A scatter chart visualizes relationships between two numerical variables. Each point on the chart represents an observation from the dataset, with its position determined by the values of the two variables. Use a scatter chart when you want to:

- **Explore correlations**: Determine whether two variables (such as temperature and humidity, or request size and latency) move together, inversely, or independently.
- **Detect outliers**: Identify data points that fall far from the main cluster, indicating anomalies or exceptional observations.
- **Compare groups visually**: Split data by a categorical field to see how different groups (such as regions or device types) distribute across the same two dimensions.

## Field selection

The scatter chart supports three data configurations, each adding a dimension to the visualization:

| Configuration | Fields | Description |
| --- | --- | --- |
| **Two numerical** | X-Axis (numeric), Y-Axis (numeric) | Displays data points showing the relationship between two numerical variables. |
| **Two numerical + one categorical** | X-Axis (numeric), Y-Axis (numeric), Color (categorical) | Displays data points for two numerical variables, with colors indicating categories. |
| **Three numerical + one categorical** | X-Axis (numeric), Y-Axis (numeric), Size (numeric), Color (categorical) | Displays data points for two numerical variables, with colors indicating categories and the third numerical variable controlling the size of the points. |

## Scatter settings

The following settings let you customize the appearance and behavior of the scatter chart.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter/scatter-style-option.png" alt="Scatter chart settings panel" width="400">

| Setting | Options | Description |
| --- | --- | --- |
| **Point size** | Number | Controls the default size of data points when no Size field is mapped. |
| **Shape** | Circle, Square, Diamond, Cross | Controls the shape of each data point. |
| **Filled** | On/Off | When enabled, data points are filled with color. When disabled, only the outline is rendered. |
| **Angle** | 0–360 | Controls the display angle of each data point in degrees. |

### Thresholds

A threshold represents a limit that, when met or exceeded by a data value, is reflected visually through its color. Thresholds are applied directly to point colors based on each data point's value. To learn more, refer to [thresholds setting]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/style-options/thresholds-setting/).

| Setting | Description |
| --- | --- |
| **Base color** | The color applied to values below the first threshold. The base threshold is always present and cannot be deleted, but its color can be changed. |
| **Threshold values** | Define one or more threshold breakpoints. Each threshold specifies a numeric value and a color. |
| **Threshold lines mode** | Controls how threshold boundaries are displayed. Options: Off, Solid lines, Dashed lines, Dotted lines. |

### Axes

The X-axis and Y-axis share the same configuration options. Each axis can be independently customized.

| Setting | Options | Description |
| --- | --- | --- |
| **Show axis** | On/Off | Toggle whether the axis is displayed. |
| **Title** | Free text | A custom label for the axis. |
| **Position** | X-axis: Top, Bottom / Y-axis: Left, Right | Controls the placement of the axis relative to the chart. |
| **Show grid lines** | On/Off | When enabled, displays grid lines extending from the axis into the chart area. |
| **Show labels** | On/Off | When enabled, displays category labels along the axis. |
| **Label alignment** | Horizontal, Vertical, Angled | Controls the rotation of axis labels. Horizontal (0°), Vertical (90°), or Angled (45°). |
| **Truncate after** | Number | Sets the maximum character length for axis labels before they are truncated. |

### Tooltip

| Setting | Options | Description |
| --- | --- | --- |
| **Tooltip mode** | All, Hidden | Controls tooltip visibility. **All** shows a tooltip with value details on hover. **Hidden** disables tooltips. |

### Legend

The legend summarizes the visual encodings (such as color, shape, and size) used in the chart.

| Setting | Options | Description |
| --- | --- | --- |
| **Show legend** | On/Off | Toggle whether the legend is displayed. |
| **Position** | Left, Right, Top, Bottom | Controls where the legend appears relative to the chart. |
| **Legend title** | Free text | A custom title for the legend. Useful for distinguishing between multiple visual encodings. |

## Tutorial: Building scatter charts

This tutorial walks you through progressively more complex scatter chart configurations using sample data. The examples use the sample flights index.

### Prerequisites

- A running OpenSearch Dashboards instance.
- An index with numeric data (this tutorial uses the sample flights index).

### Step 1: Basic two-variable scatter

Start with a query that returns two numeric fields.

**Query:**

```sql
source= <index> | fields AvgTicketPrice, DistanceMiles
```

After running this query, select **Scatter** as the chart type. The fields are mapped as follows:

- `AvgTicketPrice` is mapped to the **X-Axis**.
- `DistanceMiles` is mapped to the **Y-Axis**.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter/scatter-two-numerical-fields-mapping.png" alt="Scatter chart field mapping panel" width="400">

The result is a scatter plot showing the relationship between ticket price and flight distance. Each point represents a single flight.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter/scatter-two-num-fields.png" alt="Basic scatter chart showing average flight price vs distance" width="100%">

This configuration works well with thresholds. For example, open the **Thresholds** section and add a threshold at 6000 (red) to highlight long-distance flights.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter/scatter-with-threshold.png" alt="Basic scatter chart applied thresholds" width="100%">


### Step 2: Adding a color dimension

Add a categorical field to split the data points into color-coded groups.

**Query:**

```sql
source = <index> | fields AvgTicketPrice, DistanceMiles, DestWeather
```

This query returns two numeric fields: `AvgTicketPrice` and `DistanceMiles`. Select `DestWeather` as the **Color** field

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter/scatter-two-numerical-fields-one-color-mapping.png" alt="color-coded scatter chart field mapping panel" width="400">

The result is a scatter plot showing the relationship between ticket price and flight distance. Map `DestWeather` to the **Color** field to split the points into groups — each weather condition is rendered in a distinct color.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter/scatter-two-numerical-one-cate-fields.png" alt="Scatter chart with color-coded weather categories" width="100%">

### Step 3: Adding a size dimension

Add a third numeric field to control point size, creating a bubble chart.

**Query:**

```sql
source = <index> | fields AvgTicketPrice, DistanceMiles, DestWeather, FlightDelayMin
```

This query returns three numeric fields: `AvgTicketPrice`, `DistanceMiles`, and `FlightDelayMin`. Select `DestWeather` as the **Color** field and map `FlightDelayMin` to the **Size** field.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter/scatter-three-numerical-fields-one-color-mapping.png" alt="color-coded scatter chart field mapping panel with size representing flight delay minutes" width="400">

Points now vary in size — larger bubbles represent longer delays. Each color still represents a weather condition, making it possible to identify whether certain weather types correlate with both higher prices and longer delays.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter/scatter-two-numerical-one-cate-fields-one-size.png" alt="Scatter chart with size representing flight delay minutes" width="100%">

## Next steps

- Explore other chart types available in the [visualization editor]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/).
- Add your visualization to a [dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
