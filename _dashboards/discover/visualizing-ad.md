---
layout: default
title: Creating and managing alerts and anomalies using data visualizations 
parent: Exploring data
nav_order: 50
---

# Creating and managing alerts and anomalies using data visualizations
Introduced 2.8
{: .label .label-purple }

OpenSearch Dashboards' alerting and anomaly detection features allow you to localize and address errors, fraud, or potential issues in your system before they become serious problems and to improve the accuracy of your data and analytics.

Alerts and anomalies are closely related, but they serve different purposes. Alerts inform you of issues that require immediate attention, while anomalies help you detect issues that may not yet have triggered an alert. By using both alerts and anomalies in your monitoring system, you can proactively manage and troubleshoot your system. 

In this tutorial, you'll learn to perform anomaly detection using the **Discover** application and line chart visualizations with OpenSearch sample data. At the end of this tutorial, you should have a good idea of how to use the Discover application and visualizations to monitor your own data. Common use cases for alerting and anomaly detection include network behavior, application performance, and web application security.

The following video provides a quick overview of the steps performed in this tutorial:

<insert demo from SME>


## Getting started

The following is useful terminology to understand before getting started with this tutorial:

- _Anomaly detection_ is a technique used in data analysis to identify patterns or data points that deviate from the norm or expected behavior. It can be performed in real time, near real time, or on a scheduled basis.
- _Alert_ refers to an event associated with a trigger. When an alert is created, the trigger performs actions, which can include sending a notification.. 
- _Monitor_ refers to jobs that run on a defined schedule and query OpenSearch indexes.
- _Trigger_ refers to conditions that generate alerts.
- _Action_ refers to the information that you want the monitor to send out after being triggered. Actions have a destination, a message subject, and a message body.
- _Destination_ refers to a reusable location for an action. Supported locations are Slack, email, or custom webhook.

For an overview of the OpenSearch Alerting and Anomaly Detection plugins, see the OpenSearch documentation for [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/index/) and [Anomaly Detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/).
{: .note} 

## Prerequisites 

This tutorial has the following prerequisites: 

- You must be running OpenSearch Dashboards before proceeding with the tutorial. 
- You must be connected to your local OpenSearch Dashboards environment or `https://localhost:5601`. The username and password are `admin`.
- You have basic familiarity with <prereq?>
- <Other prereq?>

## Configuring admin settings

 Access to alerting and anomaly detection using visualizations is controlled by OpenSearch and OpenSearch Dashboards privileges. **Stack Management** is the place where you manage advanced settings. The setting is enabled by default and appears as a feature in the **Stack Management > Advanced Settings > Visualizations** window as shown below. If the setting is disabled, it does not appear in this window. The following image shows the enabled settings in the Advanced Settings window.

 <insert UI>

If you're an administrator, you can disable the settings at the cluster level through the `dashboards.yml` configuration file, for example:

```bash
<insert code sample>
```

## Creating alerting monitors

By default, when you begin to create the alert monitor workflow with the Discover application, you are presented with a menu-driven interface. This interface provides you with a range of options displayed in full screen, pop up, pull down, or drop down. In the interface, you define the metrics to monitor, set thresholds, customize triggers that automate workflows, and generate actions when conditions are met.

Alerts and anomalies are visualized in line charts on a dashboard. To create an alerting monitor using the Discover application and sample data and to visualize the alerts on a dashboard, follow these steps:  

1. From the OpenSearch Dashboards main menu, select **Discover**.
2. From **<window>**, select the **<name>** sample dataset. You will see a pre-populated dashboard with line chart visualizations.
3. Select the ellipsis icon on the line chart titled **<name>**, then select **Alerting** > **Add alerting monitor**.
4. Select **Create new monitor**.
5. From the **Add alerting monitor** window, configure the **Monitor details** and **Triggers**
6. In **Monitor details**, select <option> from the dropdown menu.
7. In **Triggers**, select <option> from the dropdown menu, and then specify a name and severity level for the trigger.
8. _Optional_: In **Notifications**, select <option> from the dropdown menu, and then customize the notification message and select the Notification channel.
9. Choose **Create monitor**.

Once you've created a new monitor, the monitor is added to the visualization, as shown in the following image.  

 <insert UI>

## Adding an associated monitor

You can add existing monitors to a visualization using the Discover application instead of Stack Management, giving you a single user interface where can add, view, and edit monitors and monitor details. Continuing with the visualization and dashboard in the preceding tutorial, follow these steps to associate an existing monitor to a visualization:

1. From the dashboard, select the ellipsis icon on the **<name>**, then **Alerting**.
2. Select **Associate existing monitor**.
3. From the **Select monitor to associate** dropdown menu, view the list of existing monitors and then select the desired monitor. In this example, select **<name>**. Note that basic information about the monitor is summarized in the window. To view more comprehensive details, select **View monitor page**, which opens the monitor details from the Alerting plugin window. 
4. Verify you have selected the appropriate monitor, and then select **Associate monitor**. 

An existing monitor is now associated to the visualization, as shown in the following image:

 <insert UI>

## Exploring alerting monitor details

Once you have created or associated alerting monitors, you can verify the monitor is generating the alerts and explore the alert details by following these steps:

1. From the dashboard, view the <**name**> visualization. Alerts are indicated with a red triangle. 
2. Hover over a triangle to view the alert count details. To investigate the alert details, select a triangle to activate the pop-up window containing the monitor details. Alternatively, select the ellipsis icon in the visualization pane and choose **View events** to view those details.
3. To explore a specific monitor's details from the visualization pane, select the ellipsis icon, **Alerting**, and **Associated monitors**. 
4. From the Associated monitors window, view the monitor list and then choose an alerting monitor, for example, <**CPU Usage Across World**>. Monitor details such as history, alerts, and associated visualizations, are shown on the monitor page.
5. _Optional_: From the Associated monitors window, unlink a monitor from the visualization by selecting the link icon under **Actions**. This unlinks the monitor from the visualization only; it does not delete the monitor itself.
6. _Optional_: From the Associate monitors window, edit metrics, for example, for the threshold for CPU usage. 


Monitor details are viewable from the dashboard and visualization pane, as shown in the following image:

<insert UI>

## Creating anomaly detectors

Anomaly detectors identify unusual patterns or outliers in a dataset. Once  you've defined your problem and prepared your data, you can load it into OpenSearch for indexing. In the following steps, you'll continue using the sample dataset that you used in the preceding steps. 

To create an anomaly detector using the Discover application and OpenSearch sample data and then visualize the anomalies on a dashboard, follow these steps: 

1. From the From the OpenSearch Dashboards main menu, select **Discover**.
2. From <window>, select the **<name>** sample dataset. You will see a pre-populated dashboard with line chart visualizations.

## Adding associated detectors



## Considerations and limitations

<SME input needed>

- Alerting and anomaly detection visualizations are only supported for line charts containing time series data.
- 
