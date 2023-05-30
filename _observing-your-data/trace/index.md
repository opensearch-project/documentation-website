---
layout: default
title: Trace Analytics
nav_order: 40
has_children: true
has_toc: false
redirect_from:
  - /observability-plugin/trace/index/
  - /monitoring-plugins/trace/index/
---

# Trace Analytics

Trace Analytics provides a way to ingest and visualize [OpenTelemetry](https://opentelemetry.io/) data in OpenSearch. This data can help you find and fix performance problems in distributed applications.

A single operation, such as a user choosing a button, can trigger an extended series of events. The frontend might call a backend service, which calls another service, which queries a database, processes the data, and sends it to the original service, which sends a confirmation to the frontend.

Trace Analytics can help you visualize this flow of events and identify performance problems, as shown in the following image.

![Detailed trace view]({{site.url}}{{site.baseurl}}/images/ta-trace.png)

## Trace Analytics with Jaeger data

Trace Analytics supports Jaeger trace data in the OpenSearch Observability plugin. If you use OpenSearch as the backend for Jaeger trace data, you can use the built-in Trace Analytics capabilities.

To set up your environment to use Trace Analytics, see [Analyze Jaeger trace data]({{site.url}}{{site.baseurl}}/observability-plugin/trace/trace-analytics-jaeger/).
