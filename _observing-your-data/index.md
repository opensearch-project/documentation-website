---
layout: default
title: Observability
nav_order: 1
has_children: true
has_toc: false
nav_exclude: true
permalink: /observing-your-data/
redirect_from:
  - /observability-plugin/index/
  - /observing-your-data/index/
steps:
  - heading: "Ingest or connect your data"
    description: "Send logs and traces to OpenSearch or connect a Prometheus data source for metrics."
    link: "/observing-your-data/ingesting-observability-data/"
  - heading: "Choose your observability apps"
    description: "Use the classic apps in the **Observability** menu or the apps in an Observability workspace and find the app for each task."
    link: "/observing-your-data/exploring-data/"
  - heading: "Configure alerts"
    description: "To automatically detect anomalies, create monitors that notify you when your data meets a condition."
    link: "/observing-your-data/alerting/index/"
detection_cards:
  - heading: "Alerting"
    description: "Create monitors that query your data on a schedule, define triggers for alert conditions, and perform actions when alerts fire."
    link: "/observing-your-data/alerting/index/"
  - heading: "Anomaly detection"
    description: "Detect anomalies in your time-series data using machine learning with the Random Cut Forest (RCF) algorithm."
    link: "/observing-your-data/ad/index/"
  - heading: "Forecasting"
    description: "Predict future values in your time-series data using the RCF model to anticipate threshold breaches before they occur."
    link: "/observing-your-data/forecast/index/"
  - heading: "Notifications"
    description: "Configure channels for sending alerts through Slack, email, Amazon SNS, webhooks, and other communication services."
    link: "/observing-your-data/notifications/index/"
getting_started_cards:
  - heading: "Get started with log analytics"
    description: "Send web logs to OpenSearch using Fluent Bit and Data Prepper, and then query and visualize them in OpenSearch Dashboards."
    link: "/observing-your-data/log-ingestion/"
  - heading: "Get started with trace analytics"
    description: "Run a sample application that generates traces, send the traces to OpenSearch using Data Prepper, and view them in Trace analytics."
    link: "/observing-your-data/trace/getting-started/"
  - heading: "Get started with metric analytics"
    description: "Connect OpenSearch to a Prometheus data source, and then query and visualize metrics using PPL in Metric analytics."
    link: "/observing-your-data/prometheusmetrics/"
---

# Observability

OpenSearch provides observability capabilities for monitoring applications, infrastructure, and AI agents. You can ingest logs, traces, and metrics, explore and visualize them in OpenSearch Dashboards, and set up alerts that notify you of issues.

---

## Getting started

To get started, choose the type of data that you want to explore. The log and trace analytics tutorials ingest sample data into OpenSearch and explore it in OpenSearch Dashboards.

{% include cards.html cards=page.getting_started_cards %}

---

## Configuring observability

To configure observability for your applications, follow these steps. If your data is already in OpenSearch, start at step 2.

{% include list.html list_items=page.steps %}

---

## Monitoring applications

OpenSearch provides two ways to monitor applications: application performance monitoring (APM) for microservices and web applications, and agent monitoring for generative AI applications.

|  | APM | Agent monitoring |
|---------|-----|--------------|
| **Purpose** | Monitor microservices and web applications | Monitor AI agents and large language models (LLMs) |
| **Metrics** | Rate, error, and duration (RED) metrics | Token usage, model calls, agent steps |
| **Visualization** | Service maps, latency charts, error tracking | Execution graphs (DAGs), trace trees, timelines |
| **Conventions** | OpenTelemetry standard conventions | OpenTelemetry generative AI semantic conventions |
| **Best for** | APIs, microservices, web services | Chatbots, AI agents, LLM applications |

### APM

[APM]({{site.url}}{{site.baseurl}}/observing-your-data/apm/) monitors distributed applications using service topology, RED metrics, and performance tracking. APM requires an Observability workspace, an OpenTelemetry Collector, Data Prepper, and Prometheus.

APM also includes [service-level objectives (SLOs)]({{site.url}}{{site.baseurl}}/observing-your-data/slo/) that let you define availability and latency targets for your services and track their error budgets.

### Agent monitoring

[Agent monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/) traces LLM calls, tool invocations, and token usage in generative AI applications. Agent monitoring requires an Observability workspace, an OpenTelemetry Collector, Data Prepper, and an application instrumented using the OpenTelemetry generative AI semantic conventions.

---

## Alerting and detection

OpenSearch provides the following tools for detecting issues and sending notifications. They work with any index in OpenSearch, including observability data.

{% include cards.html cards=page.detection_cards %}


---

## OpenSearch Observability Stack

The [OpenSearch Observability Stack](https://observability.opensearch.org/) provides a complete, preconfigured observability platform that you can run locally using Docker Compose. The Observability Stack includes:

- All APM and agent trace capabilities.
- A GenAI SDK for Python or TypeScript instrumentation.
- An Agent Health tool for local debugging and evaluation.
- A Docker Compose setup with example applications.
- A preconfigured OpenTelemetry Collector, OpenSearch Data Prepper, and Prometheus.

---

## Reference

- [Observability security]({{site.url}}{{site.baseurl}}/observing-your-data/observability-security/) -- Control which users can view and modify observability objects, such as notebooks and visualizations.
- [Simple Schema for Observability]({{site.url}}{{site.baseurl}}/observing-your-data/ss4o/) -- The index naming conventions and field mappings that some classic observability apps require.