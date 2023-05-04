---
layout: default
title: Creating alerts with Dashboard 
parent: Alerting
nav_order: 50
---

# Creating alerts with Dashboard
Introduced 2.8
{: .label .label-purple }

Use the **Dashboard** app to set up alerts and display visualizations from within the app instead of jumping between the app and the [alerting plugin]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/index/) page. The Dashboard app gives you one place to:

- Set up, add, and adjust rules and conditions that trigger alerts and notifications.
- Create visualizations to help you quickly see trends and patterns or identify and address issues.
- Build dashboards to stay on top of important metrics and data points in real time.
- Monitor your alerts at-a-glance visuals and share dashboards quickly with team members.  

Getting started with alerting in Dashboard is straightforward. Watch this video for a quick overview of some of the tasks we'll perform in this tutorial. 

<insert demo from SME>

## Prerequisites 

- If you don't already have OpenSearch and OpenSearch Dashboards 2.8 or later, [download or upgrade OpenSearch](https://opensearch.org/docs/latest/install-and-configure/install-opensearch/index/) to get started.
- Understand the visualization requirements.
-   

## Visualization requirements



## Configuring admin settings

 Access to alerting dashboards and visualizations is controlled by OpenSearch and OpenSearch Dashboards privileges. You can manage your settings in **Stack Management**. Access is enabled by default and appears as a feature in the **Stack Management > Advanced Settings > Visualizations** window as shown in the following image. If the setting is disabled, it does not appear in this window.

If you are an administrator, you can disable the settings at the cluster level through the `opensearch-dashboards.yml` configuration file, for example:

```bash
<insert code example>
```

## Creating alerting monitors

By default, when you begin to create the alert monitor workflow with the Dashboard app, you are presented with a menu-driven interface. This interface provides a range of options, displayed in full screen, pop up, pull down, or drop down, to define the metrics to monitor, set thresholds, customize triggers that automate workflows, and generate actions when conditions are met.

To create alerts and display alerting visualizations on a dashboard, follow these steps:  

1. Open OpenSearch Dashboards in your web browser. If you are running Dashboards locally, go to `http://localhost:5601/`. 
2. From the main menu, select **Dashboard**.






3. From **<window>**, select the **<name>** sample dataset. You will see a pre-populated dashboard with line chart visualizations.
4. Select the ellipsis icon from the **<name>** visualization pane, and then from the **Options** flyout, choose **Alerting** > **Add alerting monitor**.
5. Select **Create new monitor**.
6. From the **Add alerting monitor** window, define the metrics and set the thresholds under **Monitor details** and **Triggers**.
7. Under **Monitor details**, select <option> from the dropdown menu.
8. Under **Triggers**, select <option> from the dropdown menu, and then specify a name and severity level for the trigger.
9.  In **Notifications**, select <option> from the dropdown menu, and then customize the notification message and select the Notification channel.
10. Choose **Create monitor**.

Once you have created a new monitor, the monitor is added to the visualization, as shown in the following image.  

<insert UI>

## Associating monitors

You can associate existing monitors with a visualization using the Dashboard app instead of the plugin page, giving you a single interface where can add, view, and edit monitors and monitor details. Continuing with the visualization and dashboard in the preceding tutorial, follow these steps to associate an existing monitor to a visualization:

1. From the dashboard, select the ellipsis icon on the **<name>**, then **Alerting**.
2. Select **Associate existing monitor**.
3. From the **Select monitor to associate** dropdown menu, view the list of existing monitors and then select the desired monitor. In this example, select **<name>**. Note that basic information about the monitor is summarized in the window. To view more comprehensive details, select **View monitor page**, which opens the monitor details from the Alerting plugin page.
4. Verify you have selected the appropriate monitor, and then select **Associate monitor**.

An existing monitor is now associated to the visualization, as shown in the following image:

<insert UI>

## Exploring alerting monitor details

Once you have created or associated alerting monitors, you can verify the monitor is generating the alerts and explore the alert details by following these steps:

1. From the dashboard, view the <**name**> visualization. Alerts are indicated with a red triangle. 
2. Hover over a triangle to view the alert count details. To investigate the alert details, select a triangle to activate the pop-up window containing the monitor details. Alternatively, select the ellipsis icon in the visualization pane and choose **View events** to view those details.
3. Select the ellipsis icon, then **Alerting** > **Associated monitors**.
4. From the Associated monitors window, view the monitor list and then choose an alerting monitor, for example, <**CPU Usage Across World**>. Monitor details such as history, alerts, and associated visualizations, are shown from within the visualization pane.
5. From the Associated monitors window, unlink a monitor from the visualization by selecting the link icon under **Actions**. This unlinks the monitor from the visualization only; it does not delete the monitor itself.
6. From the Associated monitors window, edit the monitor's metrics, for example, the threshold for CPU usage. 


<insert UI>

## Limitations

The following are some limitations you might encounter:

- 

