---
layout: default
title: Alerting
nav_order: 34
has_children: true
redirect_from:
  - /monitoring-plugins/alerting/
---

# Alerting
OpenSearch Dashboards
{: .label .label-yellow :}

OpenSearch Dashboards provides the Alerting plugin that allows you to monitor your data and create notifications that trigger when conditions occur in one or more indexes.

You can create trigger conditions that generate various alert messages depending on the channel you'd li

Alert messages can be sent through multiple communication channels, including: 

* Slack channels


 notifies you when data from one or more OpenSearch indices meets certain conditions. For example, you might want to notify a [Slack](https://slack.com/) channel if your application logs more than five HTTP 503 errors in one hour, or you might want to page a developer if no new documents have been indexed in the past 20 minutes.

To get started, choose **Alerting** in OpenSearch Dashboards.

![OpenSearch Dashboards side bar with link]({{site.url}}{{site.baseurl}}/images/alerting.png)
