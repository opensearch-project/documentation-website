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

In this tutorial, you'll learn to perform anomaly detection using the Discover application and line chart visualizations. At the end of this tutorial, you should have a good idea of how to use the Discover application to monitor your data.

The following video provides a quick overview of the steps performed in this tutorial:

<insert demo from SME>

## Defining terminology

The following is useful terminology to understand before getting started with this tutorial:

- _Anomaly detection_ is a technique used in data analysis to identify patterns or data points that deviate from the norm or expected behavior. It can be performed in real time, near real time, or on a scheduled basis.
- _Alerting_ refers to the process of notifying relevant stakeholders when an anomaly is detected. 
- _Monitors_ are jobs that run on a defined schedule and query OpenSearch indexes.
- _Triggers_ define the conditions that generate events. Trigger alerts can be configured via various channels, such as email, text message, or a dedicated dashboard.
- _Actions_ are what happens after an alert is triggered.

If you need more context about these features in OpenSearch Dashboards, see the OpenSearch documentation for [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/index/) and [Anomaly Detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/). 

## Getting started

You must be running OpenSearch Dashboards before proceeding with the tutorial. Make sure you're connected to your local OpenSearch Dashboards environment or use `https://localhost:5601`. The username and password are `admin`.

## Creating alerting monitors

By default, when you begin to create the alert monitor workflow with the Discover application, you are presented with a menu-driven interface. This interface provides you with a range of options displayed in full screen, pop up, pull down, or drop down. In the interface, you can define rules to detect certain conditions, customize triggers that automate workflows, and generate actions when conditions are met.

1. From the OpenSearch Dashboards main menu, select **Discover**.
2. Choose 


## Configuring admin settings

**Stack Management** is the place where you manage advanced settings. Access to the features is controlled by OpenSearch and OpenSearch Dashboards privileges. If you're an administrator, you can change the settings. If you don't have access, contact your administrator.   

To configure admin settings via the OpenSearch Dashboards UI, follow these steps:

1. 













## Considerations and limitations

<Need SME input>

- Alerting and anomaly detection is only supported for line chart visualizations containing time series data.
- 
