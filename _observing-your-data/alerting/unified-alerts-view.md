---
layout: default
title: Unified alerts view
parent: Alerting dashboards and visualizations
grand_parent: Alerting
nav_order: 10
---

# Unified alerts view
**Introduced 3.7**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

The unified alerts view consolidates alerts from OpenSearch monitors and Prometheus alerting rules into a single view, so you can triage alerts across data sources without switching between tools.

## Enabling the unified alerts view

The unified alerts view is disabled by default. To enable it, add the following line to `opensearch_dashboards.yml`:

```yaml
observability.alertManager.enabled: true
```
{% include copy.html %}

Then restart OpenSearch Dashboards. After the restart, an **Alerts** option appears in the OpenSearch Dashboards main menu under **Observability**.

## Investigating an alert

The **Alerts** tab displays an alert timeline for the selected time range, a faceted filter panel, and a table of individual alerts. You can filter alerts by data source, severity, state, and label.

To investigate an alert, select it in the table to open the alert detail flyout. The flyout shows alert metadata and its source monitor.

The view supports the following alert states: `active`, `pending`, `acknowledged`, `silenced`, `resolved`, and `error`. The supported severity levels are `critical`, `high`, `medium`, `low`, and `info`.

## Acknowledging alerts

From the **Alerts** tab, you can acknowledge one or more active OpenSearch alerts. Select the alerts in the table and select **Acknowledge**.

For Prometheus data sources, the view is read-only. You cannot acknowledge Prometheus alerts from the unified alerts view.
{: .note}

## Alerting rules

The **Rules** tab lists alerting rules and monitors across the selected data sources. You can filter rules by monitor type and status.

## Notification routing

The **Routing** tab shows how alerts from the selected data sources map to notification channels.

## Related documentation

- [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/index/)
- [Alerting dashboards and visualizations]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/dashboards-alerting/)
- [Monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/)
