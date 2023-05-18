---
layout: default
title: Visualize alerts 
parent: Alerting
nav_order: 50
---

# Visualize alerts
Introduced 2.8
{: .label .label-purple }

Create, manage, and take action on your alerts in a single, consolidated view and identify and resolve issues quickly. Through the Dashboard app:

- Set up, add, and adjust rules and conditions that trigger alerts and notifications.
- Create visualizations to help you quickly see trends and patterns or identify and address issues.
- Build intuitive dashboards to stay on top of important metrics and data points in real time.
- Monitor your alerts in one place with at-a-glance views.

## Getting started 

Before getting started, you must have:

- Installed OpenSearch and OpenSearch Dashboards version 2.8 or later. See [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/).
- Installed Alerting and Notifications Dashboards plugins. See [Managing OpenSearch Dashboards plugins]({{site.url}}{{site.baseurl}}install-and-configure/install-dashboards/plugins/) to get started.

## General requirements for alerting visualizations

Alerting visualizations are displayed as time-series charts that give you a snapshot of the alert, alert status, last updated time, and reason for the alert. You can show up to 10 metrics on your chart, and each series can be shown as a line in the chart.

Keep in mind the following requirements when creating alerting visualizations:

- Must be a Vizlib line chart
- Must contain one Y-axis metric aggregation
- Must not have non-Y-axis metric aggregation types
- Must use date histogram aggregation type for the X-axis bucket
- Must have X-axis on the bottom
- Must define one X-axis aggregation bucket
- Must have a valid time-based X-axis

## Configuring admin settings

 You can only access, create, or manage alerts for resources for which you have permissions. Access to alerting dashboards and visualizations is controlled by OpenSearch and OpenSearch Dashboards privileges, and you can manage the settings in **Stack Management**. Access is enabled by default and appears as a feature in the **Stack Management** > **Advanced Settings** > **Visualizations** window. If the setting is disabled, it does not appear in this window. The setting is disabled at the cluster level through the `opensearch-dashboards.yml` file.

## Creating alerting monitors

By default, when you begin to create the alert monitor workflow using the Dashboard app, you are presented with a menu-driven interface. This interface provides a range of options, displayed in full screen, pop up, pull down, or drop down, to define the metrics to monitor, set thresholds, customize triggers that automate workflows, and generate actions when conditions are met. As of OpenSearch Dashboards version 2.8, you can create query-level monitors only.

#### To create an alerting monitor with Dashboard 

1. Choose **Dashboard** from the OpenSearch Dashboards main menu.
2. Choose a dataset. For example, choose **test line**. A pre-populated dashboard with line chart visualizations is displayed.
3. On the visualization pane, choose the ellipsis icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/ellipsis-icon.png" class="inline-icon" alt="ellipsis icon"/>{:/}). 
4. From the **Options** pop-up menu, choose **Alerting** > **Add alerting monitor**.
5. Select **Create new monitor**.
6. From the **Add alerting monitor** window, define the metrics and set the thresholds under **Monitor details** and **Triggers**, and then customize the **Notifications**.
7. Choose **Create monitor**. Once you have created a new monitor, the monitor is added to the visualization.  

The following image shows the user interface for creating an alerting monitor.

![Create monitor UI]({{site.url}}{{site.baseurl}}/images/dashboards/create-monitor-menu.png)

## Associating monitors

You can associate existing monitors with a visualization using the Dashboard app instead of the plugin page, giving you a single interface where can add, view, and edit monitor data.

#### To associate a monitor

Continuing with the alerting visualization and dashboard created in the preceding tutorial, to associate an existing monitor with a visualization, follow these steps. 

1. On the visualization pane, choose the ellipsis icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/ellipsis-icon.png" class="inline-icon" alt="ellipsis icon"/>{:/}).
2. Select **Associated monitors**.
3. From the **Select monitor to associate** dropdown menu, view the list of monitors and then select a monitor. Only eligible monitors are listed in the dropdown menu. 
4. View the monitor's basic information. To view more comprehensive details, select **View monitor page**, which opens detailed monitor information on the Alerting plugin page.
5. Select **Associate monitor**. An existing monitor is now associated to the visualization.

<insert UI>

## Exploring alerting monitor details

Once you've created or associated alerting monitors, verify the monitor is generating the alerts or explore the alert details by following these steps:

1. From the dashboard, view the visualization. Alerts are indicated with a red triangle. 
2. Hover over a triangle to view the alert count details. To investigate the alert details, select a triangle to activate the pop-up window containing the monitor details. Alternatively, select the ellipsis icon in the visualization pane and choose **View events** to view those details.
3. Select the ellipsis icon, then **Alerting** > **Associated monitors**.
4. From the Associated monitors window, view the monitor list and then choose an alerting monitor, for example, **CPU Usage Across World**. Monitor details such as history, alerts, and associated visualizations, are shown from within the visualization pane.
5. From the Associated monitors window, unlink a monitor from the visualization by selecting the link icon under **Actions**. This unlinks the monitor from the visualization only; it does not delete the monitor itself.
6. From the Associated monitors window, edit the monitor's metrics, for example, the threshold for CPU usage. 

<insert UI>
