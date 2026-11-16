---
layout: default
title: Trace analytics
parent: Classic observability apps
nav_order: 20
has_children: true
has_toc: false
redirect_from:
  - /observability-plugin/trace/index/
  - /monitoring-plugins/trace/index/
  - /observing-your-data/trace/
---

# Trace analytics

Trace analytics provides a way to ingest and visualize [OpenTelemetry](https://opentelemetry.io/) data in OpenSearch. This data can help you find and fix performance problems in distributed applications.

Trace analytics is a [classic observability app]({{site.url}}{{site.baseurl}}/observing-your-data/classic-observability-apps/). In an Observability workspace, Trace analytics is not available when both APM and Discover Traces are enabled. To analyze traces in an Observability workspace, see [Traces]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/discover-traces/) and [Application performance monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/apm/index/).

A single operation, such as a user choosing a button, can trigger an extended series of events. The frontend might call a backend service, which calls another service, which queries a database, processes the data, and sends it to the original service, which sends a confirmation to the frontend.

Trace analytics can help you visualize this flow of events and identify performance problems, as shown in the following image.

![Detailed trace view]({{site.url}}{{site.baseurl}}/images/ta-trace.png)

Trace analytics analyzes traces from your applications. OpenSearch can also generate traces for the requests that it processes. For more information, see [Distributed tracing]({{site.url}}{{site.baseurl}}/tuning-your-cluster/monitoring/telemetry/distributed-tracing/).

## Trace analytics with Jaeger data

Trace analytics supports Jaeger trace data. If you use OpenSearch as the backend for Jaeger trace data, you can use the built-in Trace analytics capabilities.

To set up your environment to use Trace analytics, see [Analyzing Jaeger trace data]({{site.url}}{{site.baseurl}}/observing-your-data/trace/trace-analytics-jaeger/).
