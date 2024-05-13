---
layout: default
title: Observability
nav_order: 1
has_children: true
nav_exclude: true
permalink: /observing-your-data/
redirect_from:
  - /observability-plugin/index/
  - /observing-your-data/index/
---

# Observability

Observability in OpenSearch is collection of plugins and applications that allow you to visualize and analyze data-driven events. These tools use the Piped Processing Language (PPL) to explore and query data stored in OpenSearch clusters. Observability in OpenSearch includes features like event analytics, operational panels, log analytics, and notebooks, providing a comprehensive workflow for gaining insights, monitoring system performance, and proactively identifying and resolving potential issues.

If you are new to Observability in OpenSearch, the following workflow is recommended:

1. Explore data using [Piped Processing Language]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index).
2. Use [event analytics]({{site.url}}{{site.baseurl}}/observing-your-data/event-analytics) to turn data-driven events into visualizations.
  ![Sample Event Analytics View]({{site.url}}{{site.baseurl}}/images/event-analytics.png)
3. Create [operational panels]({{site.url}}{{site.baseurl}}/observing-your-data/operational-panels) and add visualizations to compare data the way you like.
  ![Sample Operational Panel View]({{site.url}}{{site.baseurl}}/images/operational-panel.png)
4. Use [log analytics]({{site.url}}{{site.baseurl}}/observing-your-data/log-ingestion/) to transform unstructured log data.
5. Use [trace analytics]({{site.url}}{{site.baseurl}}/observing-your-data/trace/index) to create traces and dive deep into your data.
  ![Sample Trace Analytics View]({{site.url}}{{site.baseurl}}/images/observability-trace.png)
6. Leverage [notebooks]({{site.url}}{{site.baseurl}}/observing-your-data/notebooks) to combine different visualizations and code blocks that you can share with team members.
  ![Sample Notebooks View]({{site.url}}{{site.baseurl}}/images/notebooks.png)
