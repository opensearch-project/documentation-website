---
layout: default
title: Operational panels
parent: Classic observability apps
nav_order: 50
redirect_from:
  - /observability-plugin/operational-panels/
---

# Operational panels

Operational panels are dashboards that contain visualizations created using [Piped Processing Language]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) (PPL) queries. You create the visualizations in [Event analytics]({{site.url}}{{site.baseurl}}/observing-your-data/event-analytics/), [Metric analytics]({{site.url}}{{site.baseurl}}/observing-your-data/prometheusmetrics/), or [Application analytics]({{site.url}}{{site.baseurl}}/observing-your-data/app-analytics/) and then add them to a panel. In OpenSearch Dashboards, operational panels are called **Observability dashboards**.

Operational panels are a [classic observability app]({{site.url}}{{site.baseurl}}/observing-your-data/classic-observability-apps/). They are not available when multiple data sources or the new home page are enabled.

To view operational panels, on the top menu, go to **Observability** > **Dashboards**. To explore a set of sample panels and visualizations without adding your own data, select **Add samples**.

## Creating an operational panel

To create an operational panel, follow these steps:

1. On the top menu, go to **Observability** > **Dashboards**.
1. Select **Create Dashboard**.
1. In **Name**, enter a name for the panel, and then select **Create**.

## Adding visualizations

To add a visualization to a panel, open the panel, select **Add visualization**, and then select one of the following options:

- **Select existing visualization**: Select a saved visualization from the list, and then select **Add**.
- **Create new visualization**: Opens the Event analytics explorer. Enter a PPL query, select **Run**, and then select the **Visualizations** tab. To save the visualization to the panel, select **Save**, select the panel in **Custom operational dashboards/application**, enter a **Name**, and then select **Save**.

Operational panels filter every visualization by time, so the index that a visualization queries must contain a field of the `date` type. If the index has no `date` field, the visualization is empty.
{: .note}

## Filtering visualizations

To filter all visualizations in a panel, enter a PPL `where` clause in the search bar at the top of the panel, for example, `where response = '404'`. To change the time range for all visualizations, use the time picker. Then select **Refresh**.

## Managing panels

To reload, rename, duplicate, or delete a panel, open the panel and select **Dashboard Actions**. To delete a panel, enter `delete` in the confirmation dialog.
