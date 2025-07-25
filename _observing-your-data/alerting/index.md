---
layout: default
title: Alerting
nav_order: 70
has_children: true
redirect_from:
  - /monitoring-plugins/alerting/
  - /monitoring-plugins/alerting/index/
canonical_url: https://docs.opensearch.org/latest/observing-your-data/alerting/index/
---

# Alerting
OpenSearch Dashboards
{: .label .label-yellow :}

You can use the Alerting plugin in OpenSearch Dashboards to monitor your data and create alert notifications that trigger when conditions occur in one or more indexes.

You create a monitor with trigger conditions that generate various alert notifications through the message channel you select as a destination. Notifications can be sent to email, Slack, or Amazon Chime.

The monitor you create notifies you when data from one or more OpenSearch indexes meets certain conditions. For example, you might want to notify a [Slack](https://slack.com/) channel if your application logs more than five HTTP 503 errors in one hour, or you might want to page a developer if no new documents have been indexed in the past 20 minutes.

To get started, choose **Alerting** in OpenSearch Dashboards.

![OpenSearch Dashboards side bar with link]({{site.url}}{{site.baseurl}}/images/dashboards-nav.png)

***Figure 1: Alerting plugin in OpenSearch Dashboards***
