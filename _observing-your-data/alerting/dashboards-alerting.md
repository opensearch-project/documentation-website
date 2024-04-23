---
layout: default
title: Alerting dashboards and visualizations 
parent: Alerting
nav_order: 50
---

# Alerting dashboards and visualizations
Introduced 2.9
{: .label .label-purple }

Create, manage, and take action on your alerts in a single, consolidated view and identify and resolve issues quickly through the **Dashboards** application.

## Getting started 

Before getting started with Alerting in OpenSearch Dashboards, you must have:

- Installed OpenSearch and OpenSearch Dashboards version 2.9 or later. See [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/).
- Installed the Alerting and Notifications Dashboards plugins. See [Managing OpenSearch Dashboards plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/) to get started.

## Configuring admin settings

Users can only access, create, or manage alerts for resources for which they have permissions. Access to alerting dashboards and visualizations is controlled by OpenSearch and OpenSearch Dashboards permissions. The setting is enabled by default and is configurable from within **Dashboards Management** > **Advanced Settings** > **Visualization**. If the setting is disabled, it does not appear. 

To disable the setting at the cluster level, set `vis_augmenter.pluginAugmentationEnabled: false` in your `opensearch-dashboards.yml` file.

## General requirements for alerting visualizations

Alerting visualizations are displayed as time-series charts that give you a snapshot of the alert, alert status, last updated time, and reason for the alert. You can display up to 10 metrics on your chart, and each series can be shown as a line on the chart.

Keep in mind the following requirements when setting up or creating alerting visualizations. The visualization:

- Must be a [Vizlib line chart](https://community.vizlib.com/support/solutions/articles/35000107262-vizlib-line-chart-introduction)
- Must contain at least a Y-axis metric aggregation
- Must not have non-Y-axis metric aggregation types
- Must use the date histogram aggregation type for the X-axis bucket
- Must have an X-axis on the bottom
- Must define one X-axis aggregation bucket
- Must have a valid time-based X-axis

## Creating alerting monitors

By default, when you begin to [create an alert monitor]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/index/#creating-an-alert-monitor) workflow using OpenSearch Dashboards, you are presented with a menu-driven interface. This interface provides a range of options that are displayed in full screen, in pop-ups, in pull-downs, or in dropdowns. These options are used to define the metrics that can be monitored, set thresholds, customize triggers that automate workflows, and generate actions when conditions are met. 

Currently, you can only create [per query monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/).

To create a monitor, follow these steps:

1. In the **OpenSearch Plugins** main menu, choose **Alerting**.
2. Choose **Create monitor**.
3. Enter the **Monitor details**, including monitor type, method, and schedule.
4. Select a data source from the dropdown list.	
5. Define the metrics in the Query section.	
6. Add a trigger.
7. Add an action.
8. Select **Create**.

## Associating monitors with visualizations

You can associate certain monitor types with a visualization using the Dashboard interface instead of the plugin page, giving you a single interface through which to add, view, and edit monitor data.

Continuing with the alerting visualization and dashboard created in the preceding section, associate an existing monitor with a visualization by following these steps: 

1. From the visualization panel, choose the ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/ellipsis-icon.png" class="inline-icon" alt="ellipsis icon"/>{:/}) icon.
2. Select **Associated monitors**.
3. From the **Select monitor to associate** dropdown menu, select the monitor. Only eligible monitors are listed in the dropdown menu. 
4. View the monitor's basic information. To view comprehensive details, select **View monitor page** to open the Alerting plugin page.
5. Select **Associate monitor**. An existing monitor is associated with the visualization.

##  Configuring alerts

To configure alerts, follow these steps:

1. Open the alerting dashboard. Alerts are indicated on the visualization with a ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/triangle-icon.png" class="inline-icon" alt="triangle icon"/>{:/}) icon. 
2. Hover over the ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/triangle-icon.png" class="inline-icon" alt="triangle icon"/>{:/}) icon to view high-level data, such as number of alerts. To investigate alert details, select the triangle icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/triangle-icon.png" class="inline-icon" alt="triangle icon"/>{:/}) to open a flyout with more detailed monitor information. Alternatively, select the ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/ellipsis-icon.png" class="inline-icon" alt="ellipsis icon"/>{:/}) icon in the visualization panel and choose **View events**.
3. Select the ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/ellipsis-icon.png" class="inline-icon" alt="ellipsis icon"/>{:/}) icon, then **Alerting** > **Associated monitors**.
4. Choose an alerting monitor from the list. Information such as history, alerts, and associated visualizations is shown within the visualization panel.
5. Unlink or edit a monitor. 
   1. Unlink a monitor from the visualization by selecting the ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/link-icon.png" class="inline-icon" alt="link icon"/>{:/}) icon under **Actions**. This only unlinks the monitor from the visualization; it does not delete the monitor.
   2. Edit the monitor's metrics by selecting the ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/edit-icon.png" class="inline-icon" alt="edit icon"/>{:/}) icon.

## Building alerting quieries



## Related articles 

- See [Monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/) for information about monitor types.
- See [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/index/)
- See [Triggers]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/triggers/) for more information about triggers.
- See [Actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/) for more information about actions.
