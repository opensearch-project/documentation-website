---
layout: default
title: Integrating anomaly detection with Dashboard
parent: Anomaly detection
nav_order: 50
---

# Integrating anomaly detection with Dashboard
Introduced 2.9
{: .label .label-purple }

Anomaly detection provides an automated means of detecting harmful outliers and protects your data. When you enable anomaly detection for a metric, OpenSearch applies algorithms to continuously analyze systems and applications, determine normal baselines, and surface anomalies. 

You can connect data visualizations to OpenSearch datasets and then create, run, and view anomaly alarms and results from visualizations in the **Dashboard** app. With only a couple clicks you can bring together traces, metrics, and logs to make your applications and infrastructure fully observable.

<insert example anomaly detection visualization>

## Getting started 

Before getting started, you must have:

- Installed OpenSearch and OpenSearch Dashboards version 2.9 or later. See [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/).
- Installed Alerting and Notifications Dashboards plugins. See [Managing OpenSearch Dashboards plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/) to get started.

## General requirements for anomaly detection visualizations

Anomaly detection visualizations are intended for use with time-series data (real-time or historical). The following visualization types are used frequently for time-series data: line, area, vertical bar, and Time Series Visual Builder (TSVB).

## Configuring admin settings

 You can only access, create, or manage alerts for resources for which you have permissions. Access to anomaly detection dashboards and visualizations is controlled by OpenSearch and OpenSearch Dashboards privileges, and you can manage the settings in **Stack Management**. Access is enabled by default and appears as a feature under **Stack Management** > **Advanced Settings** > **Visualizations**. If the setting is disabled, it does not appear under Stack Management. The setting is disabled at the cluster level through the `opensearch-dashboards.yml` file.

## Creating anomaly detection with Dashboard

To start, first create an anomaly detector:

1. Select **Dashboard** from the OpenSearch Dashboards main menu.
2. From the **Dashboards** window, select **Create** and then choose **Dashboard**.
3. Select **Add an existing**, then select the appropriate visualization from the **Add panels** list. The visualization is added to the dashboard.
4. From the visualization panel, choose the ellipsis icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/ellipsis-icon.png" class="inline-icon" alt="ellipsis icon"/>{:/}).
5. From the **Options** menu, choose **Anomaly Detection** > **Add anomaly detector**.
6. Select **Create new detector**.
7. Input information for **Detector details** and **Model features**. Up to five model features are allowed. 
8. To preview the visualization within the flyout, toggle the **Show visualization** button.
9. Select **Create detector**. Once you have created a new detector, the detector is added to the visualization.  

![Interface of adding a detector]({{site.url}}{{site.baseurl}}/images/dashboards/add-detector.png)

## Adding associated anomaly detectors

Use a single interface to add, view, and edit anomaly detectors that you want to associate to a visualization. Continuing with the visualization and dashboard in the preceding tutorial, follow these steps to associate an anomaly detector to a visualization:
 
1. Select the ellipsis icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/ellipsis-icon.png" class="inline-icon" alt="ellipsis icon"/>{:/}) from the visualization panel, then select **Anomaly Detection**.
2. Select **Associate a detector**.
3. From the **Select detector to associate** dropdown menu, select the detector. Only eligible detectors are listed in the dropdown menu.
4. View the detectors's basic information. To view comprehensive details, select **View detector page** to open the Anomaly Detection plugin page.
5. Select **Associate detector**. An existing detector is now associated to the visualization.

![Interface and confirmation message of associating a detector]({{site.url}}{{site.baseurl}}/images/dashboards/associated-detector.png)

## Refreshing the visualization

Depending on the threshold settings, the visualization refreshes automatically at the specified interval. To manually refresh the visualization, select the **Refresh** button from the Dashboard page.

## Next steps

- [Learn more about Dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/index/)
- [Learn more about anomaly detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/)
