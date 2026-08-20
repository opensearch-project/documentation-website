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

The unified alerts view consolidates alerts from OpenSearch monitors and Prometheus alerting rules into a single view, so you can triage alerts across data sources without switching between tools. In OpenSearch Dashboards, this experience appears as the **Alerts** page under **Observability**.

The **Alerts** page can also show anomaly detection and forecasting resources, providing a unified experience for investigating alerts, anomalies, detectors, and forecasters from the same workspace.

Anomaly detection and forecasting resources are available in the unified alerts view in OpenSearch 3.8 and later. Creating and managing these resources from the unified alerts view is available in OpenSearch 3.9 and later.

## Enabling the unified alerts view

The unified alerts view is disabled by default. To enable it, add the following line to `opensearch_dashboards.yml`:

```yaml
observability.alertManager.enabled: true
```
{% include copy.html %}

Then restart OpenSearch Dashboards. After the restart, an **Alerts** option appears in the OpenSearch Dashboards main menu under **Observability**.

## Investigating an alert

The **Alerts** tab displays an alert timeline for the selected time range, a faceted filter panel, and a table of individual alerts and anomalies. You can filter them by data source, type, severity, state, and labels.

To investigate an alert, select it in the table to open the alert detail flyout. The flyout shows alert metadata and its source monitor.

If an alert is associated with an anomaly result, the alert detail flyout also shows anomaly context so you can review the anomaly that contributed to the alert without opening a separate Anomaly Detection page.

The view supports the following alert states: `active`, `pending`, `acknowledged`, `silenced`, `resolved`, and `error`. The supported severity levels are `critical`, `high`, `medium`, `low`, and `info`.

Anomalies use the `anomaly` state in this view because they represent detected anomaly results rather than alert lifecycle states.

## Investigating anomalies

The **Alerts** tab can include anomaly results from real-time anomaly detectors. Anomalies are shown with alert results so that you can review operational events in one triage table.

When multiple anomaly occurrences belong to the same detector and entity, the table groups them into a single row. Expand the row to inspect individual occurrences, then select an occurrence to open the anomaly detail flyout.

The anomaly detail flyout shows detector and anomaly metadata, anomaly grade, confidence, start time, duration, and feature data. For high-cardinality detectors, the flyout includes detector result context for the selected entity. For single-stream detectors, the flyout shows metric context for the selected anomaly.

## Acknowledging alerts

From the **Alerts** tab, you can acknowledge one or more active OpenSearch alerts. Select the alerts in the table and select **Acknowledge**.

For Prometheus data sources, the view is read-only. You cannot acknowledge Prometheus alerts from the unified alerts view.
{: .note}

## Rules

The **Rules** tab lists alerting rules, monitors, anomaly detectors, and forecasters across the selected data sources. You can filter rules by type and status.

If no resources are configured for the selected data sources, the page shows a unified empty-state panel. From there, you can create:

- alerts (Logs/Metric)
- anomaly detection
- forecasting

Anomaly detection and forecasting creation cards are only enabled when a standard OpenSearch datasource is selected in the datasource filter.

### Anomaly detection in the Rules tab

The **Rules** tab also includes anomaly detection rules in addition to alert rules.

Detector rows are labeled as **Anomaly Detector** in the **Type** column. Open a detector row to inspect:

- detector and model configuration
- current status and health

You can manage detector lifecycle directly from this page:

- select one or more detectors and use **Start** / **Stop** from the action bar
- use row actions in the detail flyout to start or stop an individual detector

### Forecasting in the Rules tab

Forecasting resources are exposed as **Forecaster** rules.

Selecting a forecaster opens a side panel with:

- forecaster description, index details, and feature definition
- forecast horizon and interval configuration
- forecast status and health
- actions to start or stop forecasters

Forecasters are intended to produce forecast output for trend and capacity planning. They do not create alert records directly in the Alerts timeline like monitor alerts do.

You can also use multi-select on the **Rules** table to start and stop forecasters in batch.

## Notification routing

The **Routing** tab shows how alerts from the selected data sources map to notification channels.

## Related documentation

- [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/index/)
- [Alerting dashboards and visualizations]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/dashboards-alerting/)
- [Monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/)
- [Anomaly detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/)
- [Forecasting]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/index/)
