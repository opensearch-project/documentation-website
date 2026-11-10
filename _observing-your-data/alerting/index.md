---
layout: default
title: Alerting
nav_order: 110
has_children: true
redirect_from:
  - /monitoring-plugins/alerting/
  - /monitoring-plugins/alerting/index/
  - /observing-your-data/alerting/
---

# Alerting

Alerting lets you monitor your data and automatically send notifications when certain conditions are met. To create an alert, do the following: 

- Configure a _monitor_, which is a job that runs on a defined schedule and queries OpenSearch indexes. Required.
- Configure one or more _triggers_, which define the conditions that generate events. Optional.
- Configure _actions_, which is what happens after an alert is triggered. Optional.

## Key terms

The following table lists alerting terminology commonly used in OpenSearch and throughout the Alerting documentation.

Term | Definition
:--- | :---
Monitor | Job that runs on a defined schedule and queries OpenSearch indexes. The results of these queries are then used as input for one or more triggers.
Trigger | Conditions that, if met, generate alerts. See [Triggers]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/triggers/).
Alert | Event associated with a trigger. When an alert is created, the trigger performs actions, including sending notifications.
Action | Specific task that is performed when an alert is triggered. See [Actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/).
Notification | Message that is sent to users when an alert is triggered. See [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/).

## Alert states

The following table lists the alert states. 

State | Description
:--- | :---
Active | The alert is ongoing and unacknowledged. Alerts remain in this state until you acknowledge them, delete the trigger associated with the alert, or delete the monitor entirely. Alerts also can be moved out of the active state if the trigger condition is no longer met. For example, if an index has 4,000 documents and a trigger condition is `numOfDocs > 5000`, an active alert is generated when 3,000 documents are added to the index. If the added 3,000 documents are then deleted from the index, the alert changes to the completed state because the condition is no longer triggered.
Acknowledged | The alert is acknowledged but the root cause is not fixed.
Completed | The alert is no longer ongoing. Alerts enter this state after the corresponding trigger evaluates to `false`.
Error | An error occurred while executing the trigger---usually the result of a bad trigger or destination.
Deleted | The monitor or trigger associated with this alert was deleted while the alert was ongoing.

## Creating an alert monitor

The following example creates a monitor that generates an alert when a website receives more than 100 requests in a day. The example uses the OpenSearch Dashboards sample web logs. To add the sample data, on the OpenSearch Dashboards home page, select **Add sample data**, and then select **Add data** on the **Sample web logs** card.

To create the monitor, follow these steps:

1. On the top menu, go to **OpenSearch Plugins** > **Alerting**.
1. Select the **Monitors** tab, and then select **Create monitor**.
1. In **Monitor details**, configure the following settings:
   - **Monitor name**: Enter `Daily web traffic`.
   - **Monitor type**: Select **Per query monitor**. For more information about the monitor types, see [Monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/).
   - **Monitor defining method**: Select **Visual editor**.
   - **Schedule**: Keep the default, which runs the monitor every minute.
1. In **Select data**, in **Indexes**, enter `opensearch_dashboards_sample_data_logs` and press Enter. In **Time field**, select `timestamp`.
1. In **Query**, keep the **COUNT OF documents** metric. In **Time range for the last**, enter `1` and select **day(s)**.
1. In **Triggers**, select **Add trigger**, and then configure the trigger:
   - **Trigger name**: Enter `More than 100 requests`.
   - **Severity level**: Keep **1 (Highest)**.
   - **Trigger condition**: Select **IS ABOVE** and enter `100`.

   The trigger preview shows the document count for the selected time range. For more information, see [Triggers]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/triggers/).
1. Optionally, in **Actions**, add an action that sends a notification when the trigger condition is met. Actions require a notification channel. If you don't have one, select **Manage channels** to create one. For more information, see [Actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/) and [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/).
1. Select **Create**.

The monitor runs every minute. Because the sample web logs contain more than 100 requests in a typical day, the trigger condition is met and the monitor generates an alert in the **Active** state. To view the alert, select the **Alerts** tab on the **Alerting** page.

For more information about each setting and to create a per bucket monitor, see [Per query and per bucket monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/per-query-bucket-monitors/). To create other types of monitors, see [Monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/).
