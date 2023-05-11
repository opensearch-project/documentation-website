---
layout: default
title: Operational panels
nav_order: 60
redirect_from:
  - /observing-your-data/operational-panels/
  - /observability-plugin/operational-panels/
---

# Operational panels

Operational panels in OpenSearch Dashboards are collections of visualizations generated using [Piped Processing Language]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index) (PPL) queries.

## Get started with operational panels

If you want to start using operational panels without adding any data, expand the **Action** menu, choose **Add samples**, and Dashboards adds a set of operational panels with saved visualizations for you to explore.

## Create an operational panel

To create an operational panel and add visualizations:

1. From the **Add Visualization** dropdown menu, choose **Select Existing Visualization** or **Create New Visualization**, which takes you to the [event analytics]({{site.url}}{{site.baseurl}}/observing-your-data/event-analytics) explorer, where you can use PPL to create visualizations.
1. If you're adding already existing visualizations, choose a visualization from the dropdown menu.
1. Choose **Add**.

![Sample operational panel]({{site.url}}{{site.baseurl}}/images/operational-panel.png)

To search for a particular visualization in your operation panels, use PPL queries to search for data you've already added to your panel.
