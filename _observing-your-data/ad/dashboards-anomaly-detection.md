---
layout: default
title: Setting up anomaly detection in Dashboard 
parent: Anomaly detection
nav_order: 50
---

# Setting up anomaly detection in Dashboard
Introduced 2.8
{: .label .label-purple }

OpenSearch Dashboards anomaly detection is a machine learning (ML)-powered feature that finds anomalies in time-series data and surfaces them via dashboard insights <insert screenshot>. The **Dashboard** app allows you to set up anomaly detection from within the app instead of jumping between the app and the [anomaly detection plugin]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/) page. The Dashboard app gives you one place to:

- 

<insert demo from SME>


## Getting started

The following is useful terminology to understand before getting started with this tutorial:

- _Anomaly detection_ is a technique used in data analysis to identify patterns or data points that deviate from the norm or expected behavior. It can be performed in real time, near real time, or on a scheduled basis.
- _Anomalies_ are data points that deviate unexpectedly from an observed pattern.

For information about the anomaly detection plugin, see [Anomaly Detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/).
{: .note} 

## Prerequisites 

You must be running OpenSearch and OpenSearch Dashboards 2.8 or later.

## Configuring admin settings

 Access to anomaly detection dashboards and visualizations is controlled by OpenSearch and OpenSearch Dashboards privileges. **Stack Management** is the place where you manage advanced settings. The setting is enabled by default and appears as a feature in the **Stack Management > Advanced Settings > Visualizations** window as shown below. If the setting is disabled, it does not appear in this window. The following image shows the enabled settings in the Advanced Settings window.

 <insert UI>

If you are an administrator, you can disable the settings at the cluster level through the `dashboards.yml` configuration file, for example:

```bash
<insert code sample>
```

## Creating anomaly detectors

To create an anomaly detector in the Dashboard app and then visualize the anomalies on a dashboard, follow these steps: 

1. From the OpenSearch Dashboards main menu, select **Discover**.
2. From the <name> window, select the **<name>** sample dataset. You will see a pre-populated dashboard with line chart visualizations.
3. Select the ellipsis icon from the **<name>** visualization pane, and then from the **Options** pop-up window, choose **Anomaly Detection** > **Add anomaly detector**.
4.  Select **Create new detector**.
5. From the Add anomaly detector window, define the metrics and set thresholds under **Detector details** and **Model features**. To view the visualization within this window, toggle the **Show visualization** button.
6. _Optional_: Under **Detector details**, select <option> from the dropdown menu to configure the detector details.
7. _Optional_: Under **Model features**, select <option> from the dropdown menu to configure the evaluation metrics. You can add and delete model features as best suited your use case and data, but you are limited to five model features for that detector.
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

Depending on the threshold settings, the visualization refreshes at the set interval. To manually refresh the visualization to display real-time alerts and anomalies, select **Refresh** on the dashboard window.

## Considerations and limitations

<SME input needed>

- Alerting and anomaly detection visualizations are only supported for line charts containing time series data.
- 
