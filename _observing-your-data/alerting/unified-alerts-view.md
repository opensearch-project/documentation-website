---
layout: default
title: Unified Alerts View
parent: Alerting
nav_order: 55
---

# Unified Alerts View
Introduced 3.7
{: .label .label-purple }

This feature is experimental and should not be used in production. The interface, APIs, and behavior may change in future releases.
{: .warning}

The Unified Alerts View is a new surface in OpenSearch Dashboards that consolidates alerts from multiple data sources—OpenSearch Alerting monitors and Prometheus alerting rules—into a single, filterable view. It is delivered behind a feature flag and shown in the application chrome with a **Beta** badge.

## Overview

The Unified Alerts View lets you:

- See alert history and currently firing alerts from one or more data sources in a single timeline and table.
- Filter alerts by data source, severity, state, and label.
- Acknowledge OpenSearch alerts and drill into per-alert and per-monitor details.
- Review alerting rules and notification routing across the same set of data sources.

## Requirements

To use the Unified Alerts View, your environment must meet the following requirements:

- OpenSearch 3.7 or later.
- OpenSearch Dashboards 3.7 or later.

### Required OpenSearch plugins

The following OpenSearch plugins must be installed on the cluster:

- [SQL plugin](https://github.com/opensearch-project/sql) (`opensearch-sql`)
- [Alerting plugin](https://github.com/opensearch-project/alerting) (`opensearch-alerting`)

## Enabling the Unified Alerts View

The Unified Alerts View ships disabled by default. To turn it on, add the following line to `opensearch_dashboards.yml` and restart OpenSearch Dashboards:

```yaml
observability.alertManager.enabled: true
```
{% include copy.html %}

Toggling this setting requires a restart to take effect.

## Accessing the Unified Alerts View

After the feature flag is enabled and OpenSearch Dashboards is restarted, an **Alerts** application appears in the OpenSearch Dashboards main menu under **Observability**. While the application is open, the chrome displays a **Beta** badge.

## Using the view

The Unified Alerts View is organized into three tabs: **Alerts**, **Rules**, and **Routing**. A data source selector and time-range picker are available above each tab.

### Alerts tab

The **Alerts** tab is the default. It displays an alert timeline for the selected time range, a faceted filter panel, and a drill-down table of individual alerts. From the table, you can:

- Open an alert detail flyout to inspect the alert and its source monitor.
- Acknowledge an active OpenSearch alert.

The view recognizes the alert states `active`, `pending`, `acknowledged`, `silenced`, `resolved`, and `error`, and the severities `critical`, `high`, `medium`, `low`, and `info`.

### Rules tab

The **Rules** tab lists alerting rules and monitors discovered across the selected data sources, with filters for monitor type and status.

### Routing tab

The **Routing** tab shows how alerts from the selected data sources map to notification channels.

## Limitations

The Unified Alerts View has the following limitations:

- The feature is experimental and ships disabled by default. The interface, APIs, and behavior may change in future releases.
- Toggling the feature flag requires an OpenSearch Dashboards restart.
- For Prometheus data sources, the view is read-only and may show only currently active alerts when historical alert data is unavailable.

## Related documentation

- [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/index/)
- [Monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/)
- [Alerting dashboards and visualizations]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/dashboards-alerting/)
