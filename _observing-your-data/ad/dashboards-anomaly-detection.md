---
layout: default
title: Anomaly detection visualizations and dashboards
parent: Anomaly detection
nav_order: 50
---

# Anomaly detection dashboards and visualizations
Introduced 2.9
{: .label .label-purple }

OpenSearch provides an automated means of detecting harmful outliers and protecting your data when you enable anomaly detection. When applied to metrics, OpenSearch uses algorithms to continuously analyze systems and applications, determine normal baselines, and surface anomalies. 

You can connect data visualizations to OpenSearch datasets and then create, run, and view anomaly alarms and results from visualizations in the **Dashboard** interface. With only a couple of steps, you can bring together traces, metrics, and logs to make your applications and infrastructure fully observable.

## Getting started 

Before getting started, you must have:

- Installed OpenSearch and OpenSearch Dashboards version 2.9 or later. See [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/).
- Installed the Anomaly Detection plugin version 2.9 or later. See [Installing OpenSearch plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins).
- Installed the Anomaly Detection Dashboards plugin version 2.9 or later. See [Managing OpenSearch Dashboards plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/) to get started.

## General requirements for anomaly detection visualizations

Anomaly detection visualizations are displayed as time-series charts that give you a snapshot of when anomalies have occurred from different anomaly detectors you have configured for the visualization. You can display up to 10 metrics on your chart, and each series can be shown as a line on the chart.

Keep in mind the following requirements when setting up or creating anomaly detection visualizations. The visualization:

- Must be a [Vizlib line chart](https://community.vizlib.com/support/solutions/articles/35000107262-vizlib-line-chart-introduction)
- Must contain at least a Y-axis metric aggregation
- Must not have non-Y-axis metric aggregation types
- Must use the date histogram aggregation type for the X-axis bucket
- Must have an X-axis on the bottom
- Must define one X-axis aggregation bucket
- Must have a valid time-based X-axis

## Configuring admin settings

Users can only access, create, or manage anomaly detectors for resources for which they have permissions. Access to anomaly detection dashboards and visualizations is controlled by OpenSearch and OpenSearch Dashboards permissions. It is enabled by default and appears as a feature under **Dashboards Management** > **Advanced Settings** > **Visualization**. If the setting is disabled, it does not appear under **Dashboards Management**. You can disable the setting at the cluster level in the `opensearch-dashboards.yml` file.

## Creating anomaly detectors

To start, first create an anomaly detector:

1. Select **Dashboard** from the OpenSearch Dashboards main menu.
2. From the **Dashboards** window, select **Create** and then choose **Dashboard**.
3. Select **Add an existing**, then select the appropriate visualization from the **Add panels** list. The visualization is added to the dashboard.
4. From the visualization panel, choose the ellipsis icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/ellipsis-icon.png" class="inline-icon" alt="ellipsis icon"/>{:/}).
5. From the **Options** menu, choose **Anomaly Detection** > **Add anomaly detector**.
6. Select **Create new detector**.
7. Input information for **Detector details** and **Model features**. Up to five model features are allowed. 
8. To preview the visualization within the flyout, toggle the **Show visualization** button.
9. Select **Create detector**. Once you have created a new detector, the detector is added to the visualization, as shown in the following image.  

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/add-detector.png" alt="Interface of adding a detector" width="800" height="800">

## Adding anomaly detectors to visualizations

Use a single interface to add, view, and edit anomaly detectors that you want to associate with a visualization. Continuing with the visualization and dashboard in the preceding tutorial, follow these steps to associate an anomaly detector with a visualization:
 
1. Select the ellipsis icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/ellipsis-icon.png" class="inline-icon" alt="ellipsis icon"/>{:/}) from the visualization panel, then select **Anomaly Detection**.
2. Select **Associate a detector**.
3. From the **Select detector to associate** dropdown menu, select the detector. Only eligible detectors are listed in the dropdown menu.
4. View basic information about the detectors. To view comprehensive details, select **View detector page** to open the Anomaly Detection plugin page.
5. Select **Associate detector**. An existing detector is now associated to the visualization, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/anomaly-detect-dashboard.png" alt="Interface and confirmation message of associating a detector" width="800" height="800">

## Refreshing the visualization

Depending on the threshold settings, the visualization refreshes automatically at the specified interval. To manually refresh the visualization, select the **Refresh** button on the Dashboard page.

## Next steps

- [Learn more about the Dashboard application]({{site.url}}{{site.baseurl}}/dashboards/dashboard/index/).
- [Learn more about anomaly detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/).
