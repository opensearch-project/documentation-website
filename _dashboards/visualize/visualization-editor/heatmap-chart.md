---
layout: default
title: Heatmap
parent: Visualization editor
grand_parent: Building data visualizations
nav_order: 70
---

# Heatmap

A heatmap uses color to represent the magnitude of values in a dataset. Each cell in the map corresponds to a combination of two dimensions, with the cell's color intensity reflecting the value associated with that combination. Use a heatmap when you want to:

- **Identify hotspots or anomalies**: Spot clusters of high or low values in sensor readings, network activity, or error rates.
- **Visualize system performance**: Compare metrics across multiple servers, patterns, or service components in a single view.
  
## Field selection

The heatmap uses the following field mappings:

| Field | Description |
| --- | --- |
| **X-Axis** | A categorical field displayed along the horizontal axis. Each unique value becomes a column in the heatmap grid. |
| **Y-Axis** | A categorical field displayed along the vertical axis. Each unique value becomes a row in the heatmap grid. |
| **Value** | A numeric field whose magnitude determines the color intensity of each cell. Each cell represents the intersection of one X-Axis category and one Y-Axis category. |

## Heatmap settings

The following settings let you customize the appearance and behavior of the heatmap.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/heatmap/heatmap-style-option.png" alt="Heatmap settings panel" width="400">

| Setting | Options | Description |
| --- | --- | --- |
| **Use threshold colors** | On/Off | When enabled, cell colors are determined by threshold ranges rather than the selected color schema. |
| **Color schema** | Greens, Blues, Reds, Greys, Green to Blue, Yellow to Orange | Controls the color theme used to represent value across cells. |
| **Reverse schema** | On/Off | When enabled, the color mapping is inverted: higher values are represented with lighter colors, and lower values with darker colors. |
| **Color scale** | Linear, Log, Sqrt | Defines how data values are mapped to colors. |
| **Scale to data bounds** | On/Off | When enabled, calculates the minimum and maximum values from the dataset and maps the color scale accordingly. |
| **Percentage mode** | On/Off | When enabled, values are converted to percentages and the color scale is normalized between 0 and 1. |
| **Max number of colors** | Number | Controls the maximum number of discrete color bins used in the color scale. |
| **Show labels** | On/Off | When enabled, displays the numeric value as a label inside each cell. |

### Label options

The following settings are available when **Show labels** is enabled:

| Setting | Options | Description |
| --- | --- | --- |
| **Rotate** | On/Off | When enabled, rotates the value labels by 45 degrees for better readability in narrow cells. |
| **Overwrite automatic color** | On/Off | When enabled, allows you to set a custom label color. |
| **Color** | Hex color value | Sets the custom label color when **Overwrite automatic color** is enabled. |

### Thresholds

A threshold represents a limit that, when met or exceeded by a data value, is reflected visually through its color. To learn more, refer to [thresholds setting]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/style-options/thresholds-setting/).

| Setting | Description |
| --- | --- |
| **Base color** | The color applied to values below the first threshold. The base threshold is always present and cannot be deleted, but its color can be changed. |
| **Threshold values** | Define one or more threshold breakpoints. Each threshold specifies a numeric value and a color. |

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

### Legend

The legend summarizes the visual color encodings used in the chart.

| Setting | Options | Description |
| --- | --- | --- |
| **Show legend** | On/Off | Toggle whether the legend is displayed. |
| **Position** | Left, Right, Top, Bottom | Controls where the legend appears relative to the chart. |

### Tooltip

| Setting | Options | Description |
| --- | --- | --- |
| **Tooltip mode** | All, Hidden | Controls tooltip visibility. **All** shows a tooltip with value details on hover. **Hidden** disables tooltips. |

## Tutorial: Building heatmaps

This tutorial walks you through heatmap configurations using sample data. The examples use the sample flights index with fields such as `OriginWeather`, `DestWeather`, and `AvgTicketPrice`.

### Prerequisites

- A running OpenSearch Dashboards instance.
- An index with categorical and numeric data (this tutorial uses the sample flights index).

### Step 1: Basic heatmap

Start with a query that aggregates a numeric metric by two categorical fields.

**Query:**

```sql
source= <index> | where FlightDelay = true | stats avg(FlightDelayMin) as avg_delay by OriginWeather, DestWeather
```

After running this query, select **Heatmap** as the chart type. The fields are mapped as follows:

- `OriginWeather` is mapped to the **X-Axis**.
- `DestWeather` is mapped to the **Y-Axis**.
- `avg_delay` is mapped to the **Value**.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/heatmap/heatmap-fields.png" alt="Heatmap field mapping panel" width="400">

The result is a grid of colored cells where each cell represents the average flight delay minutes for a specific origin-destination weather combination. Darker cells indicate higher values.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/heatmap/heatmap-initial.png" alt="Basic heatmap showing average flight delay minutes by weather conditions" width="100%">

### Step 2: Customizing the color schema and scale

To better distinguish between values, change the color settings:

1. In the **Heatmap** section, change **Color schema** to a different palette (for example, Yellow to Orange) to improve contrast.
2. Enable **Scale to data bounds** to map the color range to the actual min and max of your data rather than calculated bounds.
3. Adjust **Max number of colors** to increase or decrease the granularity of color bins.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/heatmap/heatmap-custom-colors.png" alt="Heatmap with customized color schema and scale" width="100%">

### Step 3: Enabling labels

For precise value reading, enable **Show labels** to display the numeric value inside each cell. If cells are narrow, enable **Rotate** to angle the labels for better readability.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/heatmap/heatmap-with-labels.png" alt="Heatmap with value labels displayed in cells" width="100%">

## Next steps

- Explore other chart types available in the [visualization editor]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/).
- Add your visualization to a [dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
