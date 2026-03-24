---
layout: default
title: Trace analytics
nav_order: 70
has_children: true
has_toc: false
redirect_from:
  - /observability-plugin/trace/index/
  - /monitoring-plugins/trace/index/
  - /observing-your-data/trace/
---

# Trace analytics

Trace analytics provides a way to ingest and visualize [OpenTelemetry](https://opentelemetry.io/) data in OpenSearch. This data can help you find and fix performance problems in distributed applications.

A single operation, such as a user choosing a button, can trigger an extended series of events. The frontend might call a backend service, which calls another service, which queries a database, processes the data, and sends it to the original service, which sends a confirmation to the frontend.

Trace analytics can help you visualize this flow of events and identify performance problems, as shown in the following image.

![Detailed trace view]({{site.url}}{{site.baseurl}}/images/ta-trace.png)

## Trace analytics with Jaeger data

Trace analytics supports Jaeger trace data in the OpenSearch Observability plugin. If you use OpenSearch as the backend for Jaeger trace data, you can use the built-in Trace analytics capabilities.

To set up your environment to use Trace analytics, see [Analyze Jaeger trace data]({{site.url}}{{site.baseurl}}/observability-plugin/trace/trace-analytics-jaeger/).
