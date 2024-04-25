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

Alerting in OpenSearch enables proactive monitoring and timely response to potential issues or anomalies within your data and applications. Whether you're building and maintaining applications or ensuring the smooth operation of systems, alerting has a crucial role in maintaining system health and minimizing downtime.

In OpenSearch, you can configure alerts by creating monitors that run on a defined schedule and query indexes. You define triggers that specify conditions for generating alert events, such as thresholds on a specific field. You can also configure actions for the alerts, such as sending notifications through email, Slack, or custom webhooks. OpenSearch Dashboards brings alerting and monitoring directly into the dashboard experience, allowing you to overlay alerts and anomalies visually on time-series charts for enhanced insights. 

An example configuration is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/alerting-config.png" alt="Alerting monitor configuration" width="500"/>

## Key terms

The following table lists alerting terminology commonly used in OpenSearch and throughout the Alerting documentation.

Term | Definition
:--- | :---
Monitor | Job that runs on a defined schedule and queries OpenSearch indexes. The results of these queries are then used as input for one or more triggers.
Trigger | Conditions that, if met, generate alerts.
Alert | Event associated with a trigger. When an alert is created, the trigger performs actions, including sending notifications.
Action | Specific task that is performed when an alert is triggered.
Notification | Message that is sent to users when an alert is triggered.

## Alerting settings

Some key alerting settings in OpenSearch include the ability to customize trigger conditions, severity levels, notification channels, and recurrence intervals for monitors. You can modify settings like notification message templates, throttling to avoid duplicate alerts, and status expiration periods. 

<SME: Do we have specific settings to include in this section? If so, please provide the setting name, description, and default setting.>

## Alerting states

The following table lists the alert states. 

State | Description
:--- | :---
`active` | The alert is ongoing and unacknowledged. Alerts remain in this state until you acknowledge them, delete the trigger associated with the alert, or delete the monitor entirely. Alerts also can be moved out of the active state if the trigger condition is no longer met. For example, if an index has 4,000 documents and a trigger condition is `numOfDocs > 5000`, an active alert is generated when 3,000 documents are added to the index. If the added 3,000 documents are then deleted from the index, the alert changes to the completed state because the condition is no longer triggered.
`acknowledged` | The alert is acknowledged but the root cause is not fixed.
`completed` | The alert is no longer ongoing. Alerts enter this state after the corresponding trigger evaluates to `false`.
`error` | An error occurred while executing the trigger---usually the result of a bad trigger or destination.
Deleted | The monitor or trigger associated with this alert was deleted while the alert was ongoing.

## Creating alerts from within OpenSearch Dashboards

You can create alerts at the cluster-level and from within OpenSearch Dashboards. This documentation is about OpenSearch Dashboards. See [Alerting API](/observing-your-data/alerting/api/) for details about how to programmatically create, update, and manage monitors and alerts.

The following steps guide you through creating a basic monitor:

1. In the **OpenSearch Plugins** main menu, choose **Alerting**.
2. Choose **Create monitor**.
3. Enter the **Monitor details**, including monitor type, method, and schedule.
4. Select a data source from the dropdown list.	
5. Define the metrics in the Query section.	
6. Add a trigger.
7. Add an action.
8. Select **Create**.

## Next steps

Learn more about the following features:

- [Monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/)
- [Triggers]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/triggers/)
- [Actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/)
- [Notifications]({{site.url}}{{site.baseurl}}/notifications-plugin/index/)
- [Alerting dashboards and visualizations]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/dashboards-alerting/)
