---
layout: default
title: Setting up alerting dashboards 
parent: Alerting
nav_order: 50
---

# Setting up alerting dashboards
Introduced 2.8
{: .label .label-purple }

The **Dashboard** app allows you create and manage alerts from within the interface instead of jumping between the app and the [alerting plugin]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/index/) page. The Dashboard app gives you one place to:

- Set up, add, and adjust your alerts and notifications
- Build dashboards to stay on top of important metrics and data points in real time
- Monitor your alerts at a glance and share dashboards quickly with team members  

Getting started with alerting in Dashboard is straightforward. Watch the video to learn more. 

<insert demo from SME>

## Terminology

This terminology is commonly used with alerting in OpenSearch Dashboards:

- An _alert_ refers to an event associated with a trigger. When an alert is created, the trigger performs actions, which can include sending a notification. 
- A _monitor_ refers to jobs that run on a defined schedule and query OpenSearch indexes.
- A _trigger_ refers to conditions that generate alerts.
- An _action_ refers to the information that you want the monitor to send out after being triggered. Actions have a destination, a message subject, and a message body.
- A _notification channel_ refers to a reusable location, such as Slack, email, or custom webhook, for an action.

## Prerequisites 

You must be running OpenSearch and OpenSearch Dashboards 2.8 or later.

## Configuring admin settings

 Access to alerting dashboards and visualizations is controlled by OpenSearch and OpenSearch Dashboards privileges. You can manage your settings in **Stack Management**. Access is enabled by default and appears as a feature in the **Stack Management > Advanced Settings > Visualizations** window as shown in the following image. If the setting is disabled, it does not appear in this window.

 <insert UI>

If you are an administrator, you can disable the settings at the cluster level through the `dashboards.yml` configuration file, for example:

```bash
<insert code sample>
```

## Creating alerting monitors

By default, when you begin to create the alert monitor workflow with the Discover application, you are presented with a menu-driven interface. This interface provides you with a range of options displayed in full screen, pop up, pull down, or drop down. In the interface, you define the metrics to monitor, set thresholds, customize triggers that automate workflows, and generate actions when conditions are met.

Alerts and anomalies are visualized in line charts on a dashboard. To create an alerting monitor using the Discover application and sample data and to visualize the alerts on a dashboard, follow these steps:  

1. From the OpenSearch Dashboards main menu, select **Discover**.
1. From **<window>**, select the **<name>** sample dataset. You will see a pre-populated dashboard with line chart visualizations.
1. Select the ellipsis icon from the **<name>** visualization pane, and then from the **Options** pop-up window, choose **Alerting** > **Add alerting monitor**.
1. Select **Create new monitor**.
1. From the **Add alerting monitor** window, define the metrics and set the thresholds under **Monitor details** and **Triggers**.
1. Under **Monitor details**, select <option> from the dropdown menu.
1. Under **Triggers**, select <option> from the dropdown menu, and then specify a name and severity level for the trigger.
1. _Optional_: In **Notifications**, select <option> from the dropdown menu, and then customize the notification message and select the Notification channel.
1. Choose **Create monitor**.

Once you have created a new monitor, the monitor is added to the visualization, as shown in the following image.  

<insert UI>

## Adding an associated monitor

You can add existing monitors to a visualization using the Discover application instead of Stack Management, giving you a single user interface where can add, view, and edit monitors and monitor details. Continuing with the visualization and dashboard in the preceding tutorial, follow these steps to associate an existing monitor to a visualization:

1. From the dashboard, select the ellipsis icon on the **<name>**, then **Alerting**.
1. Select **Associate existing monitor**.
1. From the **Select monitor to associate** dropdown menu, view the list of existing monitors and then select the desired monitor. In this example, select **<name>**. Note that basic information about the monitor is summarized in the window. To view more comprehensive details, select **View monitor page**, which opens the monitor details from the Alerting plugin page. 
1. Verify you have selected the appropriate monitor, and then select **Associate monitor**. 

An existing monitor is now associated to the visualization, as shown in the following image:

<insert UI>

## Exploring alerting monitor details

Once you have created or associated alerting monitors, you can verify the monitor is generating the alerts and explore the alert details by following these steps:

1. From the dashboard, view the <**name**> visualization. Alerts are indicated with a red triangle. 
1. Hover over a triangle to view the alert count details. To investigate the alert details, select a triangle to activate the pop-up window containing the monitor details. Alternatively, select the ellipsis icon in the visualization pane and choose **View events** to view those details.
1. Select the ellipsis icon, then **Alerting** > **Associated monitors**.
1. From the Associated monitors window, view the monitor list and then choose an alerting monitor, for example, <**CPU Usage Across World**>. Monitor details such as history, alerts, and associated visualizations, are shown from within the visualization pane.
1. _Optional_: From the Associated monitors window, unlink a monitor from the visualization by selecting the link icon under **Actions**. This unlinks the monitor from the visualization only; it does not delete the monitor itself.
1. _Optional_: From the Associated monitors window, edit the monitor's metrics, for example, the threshold for CPU usage. 

You also can view the monitor details in  

<insert UI>