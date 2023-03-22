---
layout: default
title: Visualizing alerting monitors and anomaly detectors 
parent: Exploring data
nav_order: 50
---

# Visualizing alerting monitors and anomaly detectors
Introduced 2.8
{: .label .label-purple }

OpenSearch Dashboards' alerting and anomaly detection features allow you to localize and address errors, fraud, or potential issues in your system before they become serious problems and to improve the accuracy of your data and analytics. Common use cases for alerting and anomaly detection include network behavior, application performance, and web application security.

In this tutorial, you'll learn to perform anomaly detection using the Discover application and line chart visualizations. At the end of this tutorial, you should have a good idea of how to use the Discover application to identify potential issues in your data.

The following video provides a quick overview of the steps performed in this tutorial:

<insert demo from SME>

If you need more context about the alerting and anomaly detection plugins in OpenSearch Dashboards, learn more in the documentation under [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/index/).

## Defining terminology

The following is useful terminology to understand before getting started with this tutorial:

- _Anomaly detection_ is a technique used in data analysis to identify patterns or data points that deviate from the norm or expected behavior. It can be performed in real time, near real time, or on a scheduled basis.
- _Alerting_ refers to the process of notifying relevant stakeholders when an anomaly is detected. 
- _Monitors_ are jobs that run on a defined schedule and query OpenSearch indexes.
- _Triggers_ define the conditions that generate events. Trigger alerts can be configured via various channels, such as email, text message, or a dedicated dashboard.
- _Actions_ are what happens after an alert is triggered.

## Getting started

You must be running OpenSearch Dashboards before proceeding with the tutorial. Make sure you're connected to your local OpenSearch Dashboards environment or use `https://localhost:5601`. The username and password are `admin`.

## Creating alerting monitors

By default, when you begin to create the alert monitor workflow with the Discover application, you are presented with a menu-driven interface. This interface provides you with a range of options displayed in full screen, pop up, pull down, or drop down. In the interface, you can define rules to detect certain conditions, customize triggers that automate workflows, and generate actions when conditions are met.

1. From the main menu, select **Discover**.
2. 














## Considerations and limitations

<Need SME input>

- Alerting and anomaly detection is only supported for line chart visualizations containing time series data.
- 

## Further readings

- [Introduction to OpenSearch Alerting](https://opensearch.org/blog/alerting-intro/)
- [What's new: Document-level monitors](https://opensearch.org/blog/whatsnew-document-level-monitors/)