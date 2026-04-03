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

OpenSearch provides observability capabilities for monitoring applications, infrastructure, and AI agents. Choose the path that matches your use case.

---

## Ingesting observability data

Before exploring your data, you need to ingest it into OpenSearch. Use [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/) to transform unstructured log data into structured data for improved querying and filtering.

<span class="centering-container">
[Get started with log ingestion]({{site.url}}{{site.baseurl}}/observing-your-data/log-ingestion/){: .btn-dark-blue}
</span>

---

## Exploring and analyzing observability data

OpenSearch provides the following tools for exploring and analyzing observability data:

- [Event analytics]({{site.url}}{{site.baseurl}}/observing-your-data/event-analytics/) -- Turn data-driven events into visualizations using [Piped Processing Language (PPL)]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/).
- [Application analytics]({{site.url}}{{site.baseurl}}/observing-your-data/app-analytics/) -- Create custom observability applications to view system availability status.
- [Trace analytics]({{site.url}}{{site.baseurl}}/observing-your-data/trace/index/) -- Visualize and analyze distributed traces from your applications.
- [Metric analytics]({{site.url}}{{site.baseurl}}/observing-your-data/prometheusmetrics/) -- Query and visualize Prometheus metrics data.
- [Using Discover for observability]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/) -- Analyze logs, metrics, and traces using specialized interfaces within observability workspaces.

---

## Monitoring applications

For specialized application monitoring, OpenSearch provides two focused solutions: Application Performance Monitoring (APM) for traditional microservices and agent traces for AI/LLM applications.

|  | APM | Agent traces |
|---------|-----|--------------|
| **Purpose** | Monitor microservices and web applications | Monitor AI agents and large language models (LLMs) |
| **Metrics** | RED metrics (Rate, Errors, Duration) | Token usage, model calls, agent steps |
| **Visualization** | Service maps, latency charts, error tracking | Execution graphs (DAGs), trace trees, timelines |
| **Conventions** | OpenTelemetry standard conventions | OpenTelemetry generative AI semantic conventions |
| **Best for** | APIs, microservices, web services | Chatbots, AI agents, LLM applications |

### APM

APM monitors distributed applications using service topology, RED metrics, and performance tracking. APM requires the following components:

- An OpenSearch cluster and [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/) with [workspaces]({{site.url}}{{site.baseurl}}/dashboards/workspace/) enabled.
- An OpenTelemetry Collector.
- [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/).
- Prometheus for metrics storage.
- Applications instrumented using OpenTelemetry.

### Agent traces

[Agent traces]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/) observe generative AI applications and LLM agents using specialized tracing for AI workloads. Agent traces require the following components:

- An OpenSearch cluster with [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/).
- [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/) for trace processing.
- Applications instrumented with OpenTelemetry generative AI semantic conventions.

<span class="centering-container">
[Get started with agent traces]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/){: .btn-dark-blue}
</span>

---

## Query performance

Use [Query Insights]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/) to monitor and optimize the performance of queries running in your cluster. Identify slow queries, analyze query patterns, and improve cluster efficiency.

<span class="centering-container">
[Get started with Query Insights]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/){: .btn-dark-blue}
</span>

---

## Organizing visualizations

After creating visualizations, organize them into dashboards and reports for sharing with your team:

- [Notebooks]({{site.url}}{{site.baseurl}}/observing-your-data/notebooks/) -- Combine visualizations, code blocks, and narrative text to create reports, runbooks, and documentation.
- [Operational panels]({{site.url}}{{site.baseurl}}/observing-your-data/operational-panels/) -- Organize PPL visualizations into dashboards for monitoring and analysis.

---

## Alerting and detection

OpenSearch provides tools for detecting issues and sending notifications:

- [Alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/) -- Create monitors that query your data on a schedule, define triggers for alert conditions, and execute actions when alerts fire.
- [Anomaly detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/) -- Automatically detect anomalies in your time-series data using machine learning with the Random Cut Forest (RCF) algorithm.
- [Forecasting]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/) -- Predict future values in your time-series data using the RCF model to anticipate threshold breaches before they occur.
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
