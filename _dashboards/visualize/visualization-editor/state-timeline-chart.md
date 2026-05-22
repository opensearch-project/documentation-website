---
layout: default
title: State timeline
parent: Visualization editor
grand_parent: Building data visualizations
nav_order: 90
---

# State timeline

A state timeline displays a series of horizontal bars that represent state changes over time. Each bar, known as a state region, represents a specific state, and its length indicates the duration of that state. Use a state timeline when you want to:

- **Monitor service or system status**: Track whether a server or service is running, degraded, or down over a time range.
- **Observe alert or incident progression**: Display how alerts transition through states like firing, acknowledged, and resolved.

## Field selection

The state timeline supports two data configurations:

| Configuration | Fields | Description |
| --- | --- | --- |
| **Single-category** | X-Axis (time), Color (categorical or numeric) | Displays state changes over time as a single row. The Color field determines the state at each time point, rendered as colored segments along the timeline. |
| **Multi-category** | X-Axis (time), Y-Axis (categorical), Color (categorical or numeric) | Displays state changes over time grouped by the Y-Axis field. Each unique Y-Axis value is rendered as a separate row, and the Color field determines the state within each row. |

### State definitions

States can be defined using either categorical or numerical fields:

- **Categorical fields** represent discrete states, such as `running`, `stopped`, or `degraded`.
- **Numerical fields** can represent states when each numeric value corresponds to a distinct state (for example, HTTP status codes 200, 404, 503).
- For continuous numerical values, use [value mappings]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/style-options/value-mappings/) to define ranges as named states (for example, [0–300) as "Low", [300–800) as "Medium").

## State timeline settings

The following settings let you customize the appearance and behavior of the state timeline.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/state-timeline/state-timeline-style-option.png" alt="State timeline settings panel" width="400">

| Setting | Options | Description |
| --- | --- | --- |
| **Show display text** | On/Off | When enabled and a value mapping with display text is configured, the mapped text is shown inside each state rect. When disabled, no text is displayed. |
| **Row height** | 0–1 | Controls the height of each state bar. A value of 0 produces the minimum bar width, and 1 produces the maximum bar width. |
| **Disconnect values** | Never, Threshold | Controls whether state regions are visually disconnected when gaps exceed a specified duration. **Never** keeps all regions connected. **Threshold** disconnects regions when the gap between data points exceeds the configured threshold. |
| **Threshold (disconnect)** | Duration (e.g., `1h`, `30m`) | Sets the lower bound for disconnecting values. If a gap between consecutive data points exceeds this threshold, the bars are rendered as separate disconnected regions. Specified in the format of number + time unit (for example, `1h` = 1 hour, `30m` = 30 minutes). |
| **Connect null values** | Never, Threshold | Controls how null values (gaps in the data) appear on the chart. **Never** leaves gaps visible. **Threshold** connects gaps only when they fall within the configured threshold. |
| **Threshold (connect)** | Duration (e.g., `1h`, `30m`) | Sets the upper bound for connecting null values. If a gap between data points falls within this threshold, the points are connected, bridging the gap. Specified in the format of number + time unit (for example, `1h` = 1 hour, `30m` = 30 minutes). |

### Value mappings

Value mappings are commonly used with state timelines to map states to customized labels and colors. To learn more, refer to [value mappings]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/style-options/value-mappings/).

### Thresholds

A threshold represents a limit that, when met or exceeded by a data value, is reflected visually through its color. Thresholds are applied directly to state region colors based on each data point's value. To learn more, refer to [thresholds setting]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/style-options/thresholds-setting/).

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
| **Tooltip mode** | All, Hidden | Controls tooltip visibility. **All** shows a tooltip with state and duration details on hover. **Hidden** disables tooltips. |

## Tutorial: Building state timelines

This tutorial walks you through state timeline configurations using sample data.

### Prerequisites

- A running OpenSearch Dashboards instance.
- - An index with time-series data (this tutorial uses a sample web log index with fields such as `@timestamp`, `bytes`, and `response`).

### Step 1: Single-category state timeline

Start with a query that returns a time field and a state field.

**Query:**

```sql
source = <index> | fields timestamp, response
```

After running this query, select **State Timeline** as the chart type. The fields are mapped as follows:

- `timestamp` is mapped to the **X-Axis**.
- `response` is mapped to the **Color**.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/state-timeline/state-timeline-single-cate-field-mapping.png" alt="State timeline field mapping panel" width="400">

The result is a single row of colored segments, where each segment represents a time period during which a particular response status code was recorded.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/state-timeline/state-timeline-single-cate-field.png" alt="Basic state timeline showing request changes over time" width="100%">

### Step 2: Applying value mappings

Use value mappings to assign custom labels and colors to specific state values. For example, to categorize HTTP response codes into meaningful groups:

1. Open the **Value mappings** section in the settings panel.
2. Add a mapping for `200` with the label `Successful` and the color green.
3. Add a mapping for `404` with the label `Error` and the color red.
4. Add a mapping for `503` with the label `Error` and the color red.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/state-timeline/value-mapping-for-reponse.png" alt="Value mappings options" width="400">

The timeline now displays user-configured labels for each data value and uses consistent colors — green for successful responses and red for errors.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/state-timeline/state-timeline-value-mapping.png" alt="State timeline with value mappings applied" width="100%">

### Step 3: Handling data gaps with disconnect and connect settings

In State timeline, each data point's `timestamp` serves as the start time of a state region, and the next data point's `timestamp` marks its end. When data has gaps (missing data points between timestamps), use the **Disconnect values** or **Connect null values** settings to control how these gaps are visualized.

Note: For Disconnect and connect settings, only one can be active at a time.

The following example shows the effect of setting the **Disconnect values** threshold:

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/state-timeline/disconnect-threshold.gif" alt="State timeline with disconnect threshold settings" width="100%">

### Step 4: Multi-category state timeline

Add a categorical grouping field to display multiple rows of state timelines.

**Query:**

```sql
source = <index> | fields timestamp, request, response
```

After running this query, select **State Timeline** as the chart type. The fields are mapped as follows:

- `timestamp` is mapped to the **X-Axis**.
- `request` is mapped to the **Y-Axis**.
- `response` to the **Color** field.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/state-timeline/state-timeline-two-cate-field-mapping.png" alt="State timeline field mapping panel" width="400">
  
The result shows each request path's response status over time, making it easy to identify which endpoints experience frequent instability.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/visualization-editor/state-timeline/state-timeline-grouped.png" alt="State timeline grouped by request" width="100%">

## Next steps

- Explore other chart types available in the [visualization editor]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/).
- Add your visualization to a [dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
