---
layout: default
title: Thresholds
parent: Style Options
grand_parent: Visualization editor
nav_order: 105
---

# Thresholds

A threshold is a boundary value that, when reached or exceeded by a data point, triggers a visual change in color. Thresholds let you define meaningful ranges so that viewers can immediately understand whether values are within normal, warning, or critical zones.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/scatter-threshold.gif" alt="Scatter chart using threshold" width="100%">

## How thresholds work

The thresholds panel is available in the settings section of supported chart types. It consists of a **base threshold** and any number of additional thresholds you define.

### Base threshold

The base threshold is always present and cannot be deleted. It represents the starting color for values that fall below all other thresholds. You can change its color but not its value.

### Adding thresholds

Select **+ Add threshold** to create a new threshold. Each threshold has two components:

| Component | Description |
| --- | --- |
| **Color** | The color applied to values that fall within this threshold's range. Select from preset colors or choose a custom color. |
| **Value** | The numeric boundary where this threshold begins. Values at or above this number (and below the next threshold) are displayed in this color. |

Thresholds are automatically sorted by value. You can delete any threshold (except the base) by selecting the trash icon.

### How ranges are determined

Thresholds divide the scale into consecutive ranges. Each threshold's range starts at its own value and ends at the next threshold's value. The final threshold's range extends to the maximum of the scale.

For example, given:

- Base color: blue
- Threshold at 500: red
- Threshold at 1200: green

The resulting ranges are:

| Range | Color |
| --- | --- |
| Below 500 | Blue (base) |
| 500 up to (but not including) 1200 | Red |
| 1200 and above | Green |

A data value of 1000 falls within the red range (500–1199) and is displayed in red.

## Threshold behavior by chart type

Thresholds apply differently depending on the visualization type.

### Gauge, metric, and bar gauge

In these chart types, thresholds work closely together with the **Min** and **Max** controls under **Standard options**. The value's color updates dynamically based on which threshold range it falls within:

- **Gauge**: The arc is segmented into colored bands, and the value arc takes on the color of its threshold range.
- **Metric**: The value text or background color reflects the threshold range.
- **Bar gauge**: Each bar is filled with the color corresponding to its value's threshold range.

### Bar, histogram, heatmap, scatter, and state timeline

In these chart types, **Min** and **Max** controls are not available. Thresholds are applied directly to the color of individual data elements — bar fills, point colors, or cell colors — based on each data point's value.

Additionally, for **bar**, **histogram**, and **scatter** charts, a **Threshold lines mode** setting is available to control how threshold boundaries are displayed within the chart:

| Mode | Description |
| --- | --- |
| **Off** | No threshold lines are shown. |
| **Solid lines** | Horizontal lines are drawn at each threshold value. |
| **Dashed lines** | Dashed horizontal lines are drawn at each threshold value. |
| **Dotted lines** | Dotted horizontal lines are drawn at each threshold value. |

### Line and area

Line and area charts are continuous and do not color individual data points by threshold. Instead, thresholds are displayed as **threshold lines** on the chart, providing visual markers that help viewers identify where values cross important boundaries. Use the **Threshold lines mode** setting to control line appearance (Off, Solid, Dashed, or Dotted).

### Table

Thresholds control the color of cell text and background, highlighting values that fall within specific ranges.

## Supported visualizations

The thresholds panel is available in the following chart types:

- Metric
- Gauge
- Bar gauge
- Bar
- Table
- Area
- Line
- Heatmap
- Scatter
- State timeline
- Histogram
