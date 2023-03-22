---
layout: default
title: Visualizing alerting monitors and anomaly detectors using a dashboard
parent: Exploring data
nav_order: 50
---

# Visualizing alerting monitors and anomaly detectors using a dashboard
Introduced 2.8
{: .label .label-purple }

With OpenSearch Dashboards' alerting and anomaly detection features, you can localize and address system performance issues before they reach other parts of your system. You have two options in OpenSearch Dashboards to monitor your system and data in OpenSearch Dashboards with alerting and anomaly detection: the Discover application or the Alerting and Anomaly Detection plugins. Examples of common use cases for alerting and anomaly detection in OpenSearch include network behavior, application performance, and web application security.  

![Dashboard view of alerts and anomalies]({{site.url}}{{site.baseurl}}//images/dashboards/alerting-dashboard.png)

## Defining terminology

The following is useful terminology to help you understand what alerting and anomaly detection means in OpenSearch Dashboards:

- _Alerting_ 
- _Anomaly detection_ is the identification of unexpected events, observations, or items that differ from normal behavior.
- _Monitor_ is a job that runs on a defined schedule and queries OpenSearch indexes.
- _Triggers_ define the conditions that generate events.
- _Actions_ are what happens after an alert is triggered.
- _Notifications_ 

## 

In this tutorial you'll learn to use the Discover application to pair anomaly detection with alerting to notify you as soon as an anomaly is detected.

## Related links

- [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/index/) 
- [Anomaly Detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/)
- [Introduction to OpenSearch Alerting](https://opensearch.org/blog/alerting-intro/)
- [What's new: Document-level monitors](https://opensearch.org/blog/whatsnew-document-level-monitors/)