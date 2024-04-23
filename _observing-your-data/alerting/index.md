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

OpenSearch provides an alerting framework that allows you to define custom rules and conditions based on your specific requirements. These rules can be applied to various data sources, such as logs, metrics, and application data, so that you can detect and respond to a range of events or patterns. By setting up alerts, you can receive notifications through various channels, such as email, messaging platforms, or integrated monitoring tools, ensuring that you're informed immediately about critical events or deviations from expected behavior.

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


## Alerting states

The following table lists the alert states. 

State | Description
:--- | :---
`active` | The alert is ongoing and unacknowledged. Alerts remain in this state until you acknowledge them, delete the trigger associated with the alert, or delete the monitor entirely. Alerts also can be moved out of the active state if the trigger condition is no longer met. For example, if an index has 4,000 documents and a trigger condition is `numOfDocs > 5000`, an active alert is generated when 3,000 documents are added to the index. If the added 3,000 documents are then deleted from the index, the alert changes to the completed state because the condition is no longer triggered.
`acknowledged` | The alert is acknowledged but the root cause is not fixed.
`completed` | The alert is no longer ongoing. Alerts enter this state after the corresponding trigger evaluates to `false`.
`error` | An error occurred while executing the trigger---usually the result of a bad trigger or destination.
Deleted | The monitor or trigger associated with this alert was deleted while the alert was ongoing.

## Next steps

Learn more about the following features:

- [Monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/) for information about monitor types
- [Triggers]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/triggers/) for more information about triggers
- [Actions]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/actions/) for more information about actions
- [Notifications]({{site.url}}{{site.baseurl}}/notifications-plugin/index/)
- [Alerting dashboards and visualizations]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/dashboards-alerting/)