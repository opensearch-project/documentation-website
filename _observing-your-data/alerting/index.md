---
layout: default
title: Alerting
nav_order: 70
has_children: true
redirect_from:
  - /monitoring-plugins/alerting/
  - /monitoring-plugins/alerting/index/
---

# Alerting

To create an alert, you configure a _monitor_, which is a job that runs on a defined schedule and queries OpenSearch indexes. You also configure one or more _triggers_, which define the conditions that generate events. Finally, you configure _actions_, which is what happens after an alert is triggered.

To get started with alerting:

1. Choose **Alerting** from the OpenSearch Plugins main menu and choose **Create monitor**.

2. Create a per query, per bucket, per cluster metrics, or per document monitor. For instructions, see [Create monitors]({{site.url}}{{site.baseurl}}observing-your-data/notifications/index/).

3. For Triggers, create one or more triggers. For instructions, see [Create triggers[()].

4. For Actions, set up a notification channel for the alert. Choose between Slack, Amazon Chime, a custom webhook, email, or Amazon SNS. Notifications require connectivity to the channel. For example, your OpenSearch Service domain must be able to connect to the internet to notify a Slack channel or send a custom webhook to a third-party server. The custom webhook must have a public IP address for an OpenSearch domain to send alerts to it.

# Key terms

Term | Definition
:--- | :---
Monitor | A job that runs on a defined schedule and queries OpenSearch indexes. The results of these queries are then used as input for one or more *triggers*.
Trigger | Conditions that, if met, generate *alerts*.
Tag | A label that can be applied to multiple queries to combine them with the logical `OR` operation in a per document monitor. You cannot use tags with other monitor types.
Alert | An event associated with a trigger. When an alert is created, the trigger performs *actions*, which can include sending a notification.
Action | The information that you want the monitor to send out after being triggered. Actions have a *channel*, a message subject, and a message body.
Channel | A notification channel to use in an action. Supported channels are Amazon Chime, Slack, Amazon  Simple Notification Service (Amazon SNS), email, or custom webhook. See [notifications]({{site.url}}{{site.baseurl}}/notifications-plugin/index/) for more information.
Finding | An entry for an individual document found by a per document monitor query that contains the document ID, index name, and timestamp. Findings are stored in the Findings index `.opensearch-alerting-finding*`.

## Alert states

State | Description
:--- | :---
Active | The alert is ongoing and unacknowledged. Alerts remain in this state until you acknowledge them, delete the trigger associated with the alert, or delete the monitor entirely.
Acknowledged | Alert is acknowledged the alert, but the root cause is not fixed.
Completed | The alert is no longer ongoing. Alerts enter this state after the corresponding trigger evaluates to false.
Error | An error occurred while executing the trigger---usually the result of a bad trigger or destination.
Deleted | Someone deleted the monitor or trigger associated with this alert while the alert was ongoing.
