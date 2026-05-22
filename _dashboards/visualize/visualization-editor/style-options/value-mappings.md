---
layout: default
title: Value mappings
parent: Style Options
grand_parent: Visualization editor
nav_order: 115
---

# Value mappings

Value mappings let you replace raw data values with custom labels and colors, making visualizations easier to interpret.

## Mapping types

Value mappings support two types:

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/value-mapping-panel.png" alt="Scatter chart using threshold" width="400">

### Value mapping

Maps a specific value (numerical or categorical) to a custom display text and color. Use this when your data contains discrete states or codes that are more meaningful with human-readable labels.

For example, map the HTTP status code `200` to display as "Success" in green, and `503` to display as "Error" in red.

### Range mapping

Maps a numerical range to a custom display text and color. Use this when continuous values should be grouped into meaningful bands.

For example, map the range [0, 300) to display as "Low" and [300, 800) to display as "Medium".

## Configuration

Each mapping entry has the following options:

| Setting | Description |
| --- | --- |
| **Value / Range** | The target value or numeric range to match. For value mappings, enter a specific value. For range mappings, define a start and end value (start-inclusive, end-exclusive). |
| **Display text** | The label to show in place of the original value. If left blank, the original value is displayed. |
| **Color** | A custom color for the mapped value. If left undefined, a color is automatically assigned. |

## Supported visualizations

Value mappings are currently available in the following chart types:

- State timeline
