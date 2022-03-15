---
layout: default
title: Application analytics
nav_order: 80
---

# Application analytics

Application analytics can now create custom Observability Applications to view the availability status of all their systems, where log events can be combined with trace and metric data, into a single view of system health empowering developers and IT Ops to resolve issues faster and with fewer escalations.Application analytics in Observability is where you can select logs, traces, and metrics to be part of an Observability Application that can be monitored for overall health and visualized on one page. This allows you to quickly pivot between logs, traces, and metrics to dig into the source of any issues. Many teams use similar logs and similar traces and need a structured view.

## Get started with application analytics

To get started, choose **Observability** in OpenSearch Dashboards, and then choose **Application analytics**. 

### Create an application

1. Choose **Create application**
1. Enter a name for your application and optionally add a description
1. Do at least one of the following
- Use [PPL]({{site.url}}{{site.baseurl}}/observability-plugin/ppl/index) to specify the base query.
You can't change the base query after the application is created.
{: .note }
- Select services & entities from the dropdown or the service map.
- Select trace groups from the dropdown or the table.
1. Choose **Create**.

### Create a visualization

1. Choose the **Log Events** tab
1. Use [PPL]({{site.url}}{{site.baseurl}}/observability-plugin/ppl/index) to build upon your base query
1. Move to the **Visualizations** tab to see your visualizations
1. Expand the **Save** dropdown menu, enter a nem for your visualization, then choose **Save**.

To see your visualizations, move to the **Panel** tab. 

### Configure availability

In order to configure availability, you must add availability levels to a line type time series metric. Users can use the power of the PPL language to define arbitrary conditions on their logs to create a time series metric.

##### Example
```
source = <index_name> | ... | ... | stats ... by span(<timestamp_field>, 1h)
```

To create an availability level you must configure the following
- color: The color of the availability badge on the home page.
- name: The text in the availability badge on the home page.
- expression: Comparison operator to determine the availability. 
- value: Value to use when calculating availability.

![Configuring availability]({{site.url}}{{site.baseurl}}/images/app_availability_level.gif)


By default, Application analytics shows results from the last 24 hours of your data. To see data from a different timeframe, use the date and time selector.