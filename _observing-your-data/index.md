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
---

# Observability

OpenSearch provides observability capabilities for monitoring applications, infrastructure, and AI agents. You can ingest logs, traces, and metrics, explore and visualize them in OpenSearch Dashboards, and alert on the results.

---

## Getting started

To send logs to OpenSearch and visualize them, follow the [Getting started]({{site.url}}{{site.baseurl}}/observing-your-data/log-ingestion/) tutorial. To learn how logs, traces, and metrics reach OpenSearch, see [Ingesting observability data]({{site.url}}{{site.baseurl}}/observing-your-data/ingesting-observability-data/).

<span class="centering-container">
[Get started]({{site.url}}{{site.baseurl}}/observing-your-data/log-ingestion/){: .btn-dark-blue}
</span>

---

## Exploring and analyzing observability data

OpenSearch Dashboards provides two sets of observability apps:

- [Observability workspace apps]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/) -- Explore logs, traces, and metrics in Discover and use application performance monitoring (APM), service-level objectives (SLOs), and agent monitoring in an Observability workspace.
- [Classic observability apps]({{site.url}}{{site.baseurl}}/observing-your-data/classic-observability-apps/) -- Use Event analytics, Trace analytics, Metric analytics, Application analytics, and Operational panels from the **Observability** menu in classic navigation.

To find the app for your task in each set, see [Exploring observability data]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-data/).

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

[APM]({{site.url}}{{site.baseurl}}/observing-your-data/apm/) monitors distributed applications using service topology, RED metrics, and performance tracking. APM requires the following components:

- An OpenSearch cluster and OpenSearch Dashboards with an Observability workspace and the APM settings enabled. For more information, see [Observability workspace apps]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/).
- An OpenTelemetry Collector.
- [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/).
- Prometheus for metrics storage.
- Applications instrumented using OpenTelemetry.

### Agent monitoring

[Agent monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/) traces LLM calls, tool invocations, and token usage in generative AI applications. Agent monitoring requires the following components:

- An OpenSearch cluster and OpenSearch Dashboards with an Observability workspace and the `explore.enabled` and `explore.agentTraces.enabled` settings set to `true`. For more information, see [Observability workspace apps]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/).
- An OpenTelemetry Collector.
- [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/) for trace processing.
- Applications instrumented using the OpenTelemetry generative AI semantic conventions.

<span class="centering-container">
[Get started with agent monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/){: .btn-dark-blue}
</span>

---

## Query performance

To monitor the performance of the queries running in your cluster, see [Query insights]({{site.url}}{{site.baseurl}}/tuning-your-cluster/monitoring/query-insights/index/).

---

## Organizing visualizations

After creating visualizations, organize them into dashboards and reports for sharing with your team:

- [Notebooks]({{site.url}}{{site.baseurl}}/dashboards/notebooks/) -- Combine visualizations, code blocks, and narrative text to create reports, runbooks, and documentation.
- [Operational panels]({{site.url}}{{site.baseurl}}/observing-your-data/operational-panels/) -- Organize PPL visualizations into dashboards for monitoring and analysis.

---

## Alerting and detection

OpenSearch provides tools for detecting issues and sending notifications:

- [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/) -- Create monitors that query your data on a schedule, define triggers for alert conditions, and execute actions when alerts fire.
- [Anomaly detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/) -- Automatically detect anomalies in your time-series data using machine learning with the Random Cut Forest (RCF) algorithm.
- [Forecasting]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/) -- Predict future values in your time-series data using the RCF model to anticipate threshold breaches before they occur.
- [Service-level objectives]({{site.url}}{{site.baseurl}}/observing-your-data/slo/) (Experimental) -- Define availability and latency targets for your services and track error budgets and consumption rates against a Prometheus-compatible ruler.
- [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/) -- Configure channels for sending alerts through Slack, email, Amazon SNS, webhooks, and other communication services.

---

## OpenSearch Observability Stack

The OpenSearch Observability Stack provides a complete, preconfigured observability platform that you can run locally using Docker Compose. The Observability Stack includes:

- All APM and agent trace capabilities.
- A GenAI SDK for Python or TypeScript instrumentation.
- An Agent Health tool for local debugging and evaluation.
- A Docker Compose setup with example applications.
- A preconfigured OpenTelemetry Collector, [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/), and Prometheus.

<span class="centering-container">
[Learn more about Observability Stack](https://observability.opensearch.org/){: .btn-dark-blue}
</span>
