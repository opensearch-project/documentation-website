---
layout: default
title: OpenSearch Dashboards plugin
parent: Trace Analytics
nav_order: 50
redirect_from:
  - /observability-plugin/trace/ta-dashboards/
  - /monitoring-plugins/trace/ta-dashboards/
---

# Trace Analytics OpenSearch Dashboards plugin

The Trace Analytics plugin for OpenSearch Dashboards provides at-a-glance visibility into your application performance, along with the ability to drill down on individual traces. For installation instructions, see [Standalone OpenSearch Dashboards plugin install]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/).

The **Dashboard** view groups traces together by HTTP method and path so that you can see the average latency, error rate, and trends associated with a particular operation. For a more focused view, try filtering by trace group name.

![Dashboard view]({{site.url}}{{site.baseurl}}/images/ta-dashboard.png)

To drill down on the traces that make up a trace group, choose the number of traces in the column on the right. Then choose an individual trace for a detailed summary.

![Detailed trace view]({{site.url}}{{site.baseurl}}/images/ta-trace.png)

The **Services** view lists all services in the application, plus an interactive map that shows how the various services connect to each other. In contrast to the dashboard, which helps identify problems by operation, the service map helps identify problems by service. Try sorting by error rate or latency to get a sense of potential problem areas of your application.

![Service view]({{site.url}}{{site.baseurl}}/images/ta-services.png)
