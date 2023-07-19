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

To create an alert, do the following: 

- Configure a _monitor_, which is a job that runs on a defined schedule and queries OpenSearch indexes. Required.
- Configure one or more _triggers_, which define the conditions that generate events. Optional.
- Configure _actions_, which is what happens after an alert is triggered. Optional.

## Getting started

To get started with creating alerts:

1. Choose **Alerting** from the OpenSearch Plugins main menu, then **Create monitor**. If alerts exist, you'll see a list of those alerts and the Create monitor button won't appear. In this case, select the **Monitors** tab, then **Create monitor**.   
2. Create a per query, per bucket, per cluster metrics, or per document monitor. For instructions, see [Monitors]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/).
3. Create one or more triggers. For instructions, see [Triggers[({{site.url}}{{site.baseurl}}/observing-your-data/alerting/triggers/)].
4. For Actions, set up a notification channel for the alert. For instructions, see [Actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/).

## Alerting terminology

The following table lists alerting terminology commonly used in OpenSearch.

Term | Definition
:--- | :---
Monitor | A job that runs on a defined schedule and queries OpenSearch indexes. The results of these queries are then used as input for one or more *triggers*.
Trigger | A condition that, if met, generates an *alert*.
Tag | A label that can be applied to multiple queries to combine them with the logical `OR` operation in a per document monitor. You cannot use tags with other monitor types.
Alert | An event associated with a trigger. When an alert is created, the trigger performs *actions*, which can include sending a notification.
Action | The information that you want the monitor to send after being triggered. Actions have a *channel*, a message subject, and a message body.
Channel | A notification channel to use in an action. Supported channels are Amazon Chime, Slack, Amazon Simple Notification Service (Amazon SNS), email, or custom webhook. See [Notifications]({{site.url}}{{site.baseurl}}/notifications-plugin/index/) for more information.
Finding | An entry for an individual document found by a per document monitor query that contains the document ID, index name, and timestamp. Findings are stored in the Findings index `.opensearch-alerting-finding*`.

## Alert states

The following table lists the alert states. 

State | Description
:--- | :---
Active | The alert is ongoing and unacknowledged. Alerts remain in this state until you acknowledge them, delete the trigger associated with the alert, or delete the monitor entirely. Alerts also can be moved out of the active state if the trigger condition is no longer met. For example, if an index has 4,000 documents and a trigger condition is `numOfDocs > 5000`, an active alert is generated when 3,000 documents are added to the index. If the added 3,000 documents are then deleted from the index, the alert changes to the completed state because the condition is no longer triggered.
Acknowledged | The alert is acknowledged but the root cause is not fixed.
Completed | The alert is no longer ongoing. Alerts enter this state after the corresponding trigger evaluates to `false`.
Error | An error occurred while executing the trigger---usually the result of a bad trigger or destination.
Deleted | The monitor or trigger associated with this alert was deleted while the alert was ongoing.
