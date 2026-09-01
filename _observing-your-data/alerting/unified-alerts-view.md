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

The unified alerts view consolidates alerts from OpenSearch monitors and Prometheus alerting rules into a single view, so you can triage alerts across data sources without switching between tools. In OpenSearch Dashboards, the view appears as the **Alerts** page under **Observability**.

The **Alerts** page can also show anomaly detection and forecasting resources, so you can investigate alerts, anomalies, detectors, and forecasters on one page.

## Enabling the unified alerts view

The unified alerts view is disabled by default. To enable it, add the following line to `opensearch_dashboards.yml`:

```yaml
observability.alertManager.enabled: true
```
{% include copy.html %}

Then restart OpenSearch Dashboards. After the restart, an **Alerts** option appears in the OpenSearch Dashboards main menu under **Observability**.

## Investigating an alert

The **Alerts** tab displays an alert timeline for the selected time range, a faceted filter panel, and a table of individual alerts and anomalies. You can filter the table by data source, type, severity, state, and label.

To investigate an alert, select it in the table to open the alert detail flyout. The flyout shows alert metadata and its source monitor.

The view supports the following alert states: `active`, `pending`, `acknowledged`, `silenced`, `resolved`, and `error`. The supported severity levels are `critical`, `high`, `medium`, `low`, and `info`.

## Investigating anomalies

The **Alerts** tab includes anomaly results from real-time anomaly detectors. Anomalies appear in the same table as alerts and use the `anomaly` state.

When multiple anomaly occurrences belong to the same detector and entity, the table groups them into a single row. Expand the row to inspect individual occurrences, then select an occurrence to open the anomaly detail flyout.

The anomaly detail flyout shows detector and anomaly metadata, anomaly grade, confidence, start time, duration, and feature data. For high-cardinality detectors, the flyout includes detector result context for the selected entity. For single-entity detectors, the flyout shows metric context for the selected anomaly.

If an alert is associated with an anomaly result, the alert detail flyout also shows anomaly context so you can review the anomaly that contributed to the alert without leaving the **Alerts** page.

## Acknowledging alerts

From the **Alerts** tab, you can acknowledge one or more active OpenSearch alerts. Select the alerts in the table and select **Acknowledge**.

For Prometheus data sources, the view is read-only. You cannot acknowledge Prometheus alerts from the unified alerts view.
{: .note}

## Rules

The **Rules** tab lists alerting rules, monitors, anomaly detectors, and forecasters across the selected data sources. You can filter rules by type and status.

If no resources are configured for the selected data sources, the page provides options for creating the following:

- Log or metric alerts
- Anomaly detectors
- Forecasters

The anomaly detection and forecasting options are enabled only when an OpenSearch data source is selected in the data source filter.

### Anomaly detectors

Detectors appear with the **Anomaly Detector** type in the **Type** column. Select a detector to open a flyout that shows the following information:

- Detector and model configuration
- Current status and health

To manage the detector lifecycle from this page, use one of the following options:

- Select one or more detectors and then select **Start** or **Stop** in the action bar.
- Select **Start** or **Stop** in the detector flyout.

### Forecasters

Forecasters appear with the **Forecaster** type. Select a forecaster to open a flyout that shows the following information:

- Forecaster description, index details, and feature definition
- Forecast horizon and interval configuration
- Forecast status and health

From the flyout, you can start or stop the forecaster. To start or stop several forecasters at once, select them in the **Rules** table and then select **Start** or **Stop**.

Forecasters produce forecast output for trend and capacity planning. They don't create alert records in the **Alerts** timeline.

## Notification routing

The **Routing** tab shows how alerts from the selected data sources map to notification channels.

## Related documentation

- [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/index/)
- [Alerting dashboards and visualizations]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/dashboards-alerting/)
- [Monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/)
- [Anomaly detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/)
- [Forecasting]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/index/)
