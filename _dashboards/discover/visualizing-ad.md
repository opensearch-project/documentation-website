---
layout: default
title: Creating and managing alerts and anomalies using data visualizations 
parent: Exploring data
nav_order: 50
---

# Creating and managing alerts and anomalies using data visualizations
Introduced 2.8
{: .label .label-purple }

OpenSearch Dashboards' alerting and anomaly detection features allow you to localize and address errors, fraud, or potential issues in your system before they become serious problems and to improve the accuracy of your data and analytics. Common use cases for alerting and anomaly detection include network behavior, application performance, and web application security.

In this tutorial, you'll learn to perform anomaly detection using the Discover application and line chart visualizations with OpenSearch sample data. At the end of this tutorial, you should have a good idea of how to use the Discover application and visualizations to monitor your own data.

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

If you need more context about these features in OpenSearch Dashboards, see the OpenSearch documentation for [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/index/) and [Anomaly Detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/). 

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
2. From <window>, select the **<name> sample dataset. You will see a pre-populated dashboard with line chart visualizations.
3. Select the ellipsis icon on the line chart titled **CPU Usage Across World**, then select **Alerting** > **Add alerting monitor**.
4. Select **Create new monitor**.
5. From the **Add alerting monitor** window, configure the **Monitor details** and **Triggers**
6. In **Monitor details**, select <option> from the dropdown menu.
7. In **Triggers**, select <option> from the dropdown menu.
8. In **Notifications**, select <option> from the dropdown menu. 
9. Choose **Create monitor**.

Once you've created a new monitor, the monitor is added both to the visualization itself and the list of alerting monitors under the plugin.  

## Adding an associated monitor



## Creating anomaly detectors

Anomaly detectors identify unusual patterns or outliers in a dataset. Once  you've defined your problem and prepared your data, you can load it into OpenSearch for indexing. In the following steps, you'll continue using the sample dataset that you used in the preceding steps. 

To create an anomaly detector using the Discover application and sample data and to visualize the anomalies on a dashboard, follow these steps: 

1. From the From the OpenSearch Dashboards main menu, select **Discover**.
2. From <window>, select the **<name>** sample dataset. You will see a pre-populated dashboard with line chart visualizations.

## Adding associated detectors



## Considerations and limitations

<SME input needed>

- Alerting and anomaly detection visualizations are only supported for line charts containing time series data.
- 
