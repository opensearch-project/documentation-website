---
layout: default
title: Creating anomaly detection visualizations
parent: Anomaly detection
nav_order: 50
---

# Creating anomaly detection visulizations
Introduced 2.8
{: .label .label-purple }

 Create, run, and view anomaly alarms and results from visualizations using the **Dashboard** app. With just a couple clicks, you can visualize the data you're interested in and create anomaly detectors on that same data.
 
## Getting started 

Before getting started, you must have:

- Installed OpenSearch and OpenSearch Dashboards version 2.8 or later. See [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/).
- Installed Alerting and Notifications Dashboards plugins. See [Managing OpenSearch Dashboards plugins]({{site.url}}{{site.baseurl}}install-and-configure/install-dashboards/plugins/) to get started.

## General requirements for anomaly detection visualizations

Anomaly detection visualizations are intended for use with streaming time-series data (real-time or historical). The following visualization types are used frequently for time-series data: line, area, vertical bar, and Time Series Visual Builder (TSVB).

## Configuring admin settings

 You can only access, create, or manage alerts for resources for which you have permissions. Access to anomaly detection dashboards and visualizations is controlled by OpenSearch and OpenSearch Dashboards privileges, and you can manage the settings in **Stack Management**. Access is enabled by default and appears as a feature under **Stack Management** > **Advanced Settings** > **Visualizations**. If the setting is disabled, it does not appear under Stack Management. The setting is disabled at the cluster level through the `opensearch-dashboards.yml` file.

## Creating anomaly detectors and visualizing anomaly results

To create an anomaly detector in Dashboard:

1. Select **Dashboard** from the OpenSearch Dashboards main menu.
2. From the <name> window, select the **<name>** sample dataset. You will see a pre-populated dashboard with line chart visualizations.
3. Select the ellipsis icon from the **<name>** visualization pane, and then from the **Options** pop-up window, choose **Anomaly Detection** > **Add anomaly detector**.
4. Select **Create new detector**.
5. From the Add anomaly detector window, define the metrics and set thresholds under **Detector details** and **Model features**. To view the visualization within this window, toggle the **Show visualization** button.
6. Under **Detector details**, select <option> from the dropdown menu to configure the detector details.
7. Under **Model features**, select <option> from the dropdown menu to configure the evaluation metrics. You can add and delete model features as best suited your use case and data, but you are limited to five model features for that detector.
8. Select **Create detector**.

Once you have created a new detector, the detector is added to the visualization, as shown in the following image.  

<insert UI>


### Creating an alerting monitor from the detector

You can set up an alerting monitor based on your detector in one flow from the visualization. To set up an alerting monitor based on the detector created in the preceding steps, follow these steps:

1. In the notification pop-up window that appears after you have created the detector, select **Set up alerts**.
2. Follow the steps described in [Creating alerting monitors](#creating-alerting-monitors).

You now have an alerting monitor and anomaly detector associated with the visualization.

<insert UI>

## Adding associated anomaly detectors

You can add existing detectors to a visualization using the Discover application instead of Stack Management, giving you a single user interface where can add, view, and edit monitors and monitor details. Continuing with the visualization and dashboard in the preceding tutorial, follow these steps to associate an anomaly detector to a visualization: 
 
1. From the dashboard, select the ellipsis icon on the **<name>**, then **Anomaly Detection**.
2. Select **Associate a detector**.
3. From the **Select detector to associate** dropdown menu, view the list of existing monitors and then select the desired monitor. In this example, select **<name>**. Note that basic information about the monitor is summarized in the window. To view more comprehensive details, select **View detector page**, which opens the detector details from the Anomaly Detection plugin page. 
4. Verify you have selected the appropriate detector, and then select **Associate detector**. 

An existing detector is now associated to the visualization, as shown in the following image:

<insert UI>

## Refreshing the visualization

Depending on the threshold settings, the visualization refreshes at the set interval. To manually refresh the visualization to display real-time alerts and anomalies, select **Refresh** from the Dashboard page.
