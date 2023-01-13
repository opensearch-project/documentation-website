---
layout: default
title: Using Gantt charts
parent: Visualization types
grand_parent: Visualize
nav_order: 25
redirect_from:
  - /dashboards/gantt/
---

# Using Gantt charts

Gantt charts are a visualization type that display events, steps, and tasks as horizontal bars. The length of the bars shows the amount of time associated with that event, step, or task. Gantt charts are used to represent a series of events that contain a parent-child relationship. This can be particularly useful in trace analytics, telemetry, and monitoring use cases, in which the users need to understand the overall interaction between traces or events.

# Try it: Create a Gantt chart in OpenSearch Dashboards

This tutorial guides you through creating a simple Gantt chart using Dashboards and OpenSearch sample data.

## Set up the Gantt chart

1. Access Dashboards by connecting to [http://localhost:5601](http://localhost:5601) from a browser.
1. Select **Visualize** from the menu and then select **Create visualization**.
1. Select **Gantt Chart** from the window.
1. Select **opensearch_dashboards_sample_data_logs** in the **New Area/Choose a source** window.
1. Select the calendar icon and set the time filter to **Last 7 days**.

![Screen view of preceding steps]({{site.url}}{{site.baseurl}}/images/dashboards/gantt-1.png)

## Plot data

Continuing with the preceding steps, you'll plot the data for the chart.

1. In the **Metrics** window: 
   1. Select the **Event** dropdown list and then **[insert field name]**.
   1. Select the **Start time** dropdown list and then **[insert field name]**. (The start time is the timestamp for the beginning of an event.)
   1. Select the **Duration** dropdown list and then **[insert field name]**. (The duration is the amount of time to add to the start time.)
2. In the **Results** window, select the number of events you want to display from the **View number of results** dropdown list. The default is 10. Note that events are sequenced from earliest to latest based on **Start time**.
3. (Optional): Select **Panel settings** to adjust axis labels, time format, and colors.
4. Select **Update**.

You've created a Gantt chart that looks like the following visualization. 

[update graphic]