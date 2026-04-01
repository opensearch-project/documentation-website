---
layout: default
title: Agent traces
nav_order: 47
has_children: true
has_toc: false
---

# Agent traces
**Introduced 3.6**
{: .label .label-purple }

Agent traces provides end-to-end observability for generative AI applications. You can trace agent invocations, LLM calls, tool executions, and retrieval operations across your AI stack using OpenTelemetry-based instrumentation.

## How it works

The agent traces workflow consists of five stages:

1. **Instrument** --- Add observability to your AI applications using the GenAI SDK with decorators, enrichment functions, and automatic LLM instrumentation for 20+ libraries including OpenAI, Anthropic, Amazon Bedrock, and LangChain.

2. **Normalize** --- The OpenTelemetry Collector standardizes spans using [GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/), ensuring consistent attribute names across providers.

3. **Local tooling** --- Use Agent Health for local debugging, scoring, and evaluation during development.

4. **Process** --- [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/index/) routes OTLP data into OpenSearch, creating service maps, correlating traces, and aggregating metrics.

5. **Analyze** --- [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/agent-tracing/) displays agent traces, graphs, and APM metrics for production monitoring.

## Key capabilities

- **Agent trace visualization** --- View traces as hierarchical trees, directed acyclic graphs (DAGs), and timelines.
- **GenAI semantic conventions** --- Standardized attributes for model, token, tool, and session metadata.
- **Auto-instrumentation** --- Automatic span generation for OpenAI, Anthropic, Amazon Bedrock, LangChain, LlamaIndex, and other providers.
- **Framework support** --- Integrations for Strands Agents, LangGraph, CrewAI, and the OpenAI Agents SDK.

## Getting started

To begin using agent traces, see the following topics:

- [Instrument your application]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/instrument/) --- Install the SDK and add tracing to your AI agents.
- [Agent tracing]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/agent-tracing/) --- Explore traces in OpenSearch Dashboards.
- [Agent graph and path]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/agent-graph/) --- Visualize agent execution as graphs and timelines.
