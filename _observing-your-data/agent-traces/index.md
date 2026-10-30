---
layout: default
title: Agent monitoring
parent: Observability workspace apps
nav_order: 60
has_children: true
has_toc: false
redirect_from:
  - /observing-your-data/agent-traces/
---

# Agent monitoring
**Introduced 3.6**
{: .label .label-purple }

Agent monitoring provides observability for generative AI applications and large language model (LLM) agents. It uses agent traces, which record LLM calls, token usage, tool invocations, and agent reasoning flows following the OpenTelemetry [generative AI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/).

## Prerequisites

Agent monitoring requires the following components:

- An OpenSearch cluster, which stores trace data in `otel-v1-apm-span-*` indexes.
- OpenSearch Dashboards with an Observability workspace and the `explore.enabled` and `explore.agentTraces.enabled` settings set to `true`. For more information, see [Observability workspace apps]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/).
- An [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/).
- [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/), which processes trace data and writes it to OpenSearch.
- Applications instrumented using the OpenTelemetry [generative AI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/). For more information, see [Instrumenting your application]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/instrument/).

## The agent traces workflow

The agent traces workflow consists of the following stages:

1. **Instrument**: Add observability to your AI applications:
   - Use the [GenAI SDK](https://observability.opensearch.org/docs/send-data/ai-agents/) containing decorators, enrichment functions, and automatic LLM instrumentation for libraries such as OpenAI, Anthropic, Amazon Bedrock, and LangChain.

2. **Normalize**: The OpenTelemetry Collector standardizes spans using [generative AI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/), ensuring consistent attribute names across providers.

3. **Use local tooling** (Optional): Use [Agent Health](https://observability.opensearch.org/docs/agent-health/) for local debugging, scoring, and evaluation during development.

4. **Process**: [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/) routes OpenTelemetry Protocol (OTLP) data into OpenSearch, creating service maps, correlating traces, and aggregating metrics.

5. **View**: [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/agent-tracing/) displays agent traces as hierarchical trees, directed acyclic graphs (DAGs), and timelines, along with metrics for production monitoring.

Agent traces support the following frameworks and providers:

- **Frameworks**: Strands Agents, LangGraph, CrewAI, and the OpenAI Agents SDK.
- **Providers**: OpenAI, Anthropic, Amazon Bedrock, LangChain, LlamaIndex, and other LLM providers.

## Getting started

To start using agent traces, explore the following topics:

- [Instrument your application]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/instrument/) -- Install the SDK and add tracing to your AI agents.
- [Viewing agent traces]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/agent-tracing/) -- Configure and explore agent traces in OpenSearch Dashboards.
