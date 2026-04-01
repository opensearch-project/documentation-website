---
layout: default
title: Instrument
parent: Agent traces
nav_order: 10
---

# Instrument your application
Introduced 3.6
{: .label .label-purple }

The `opensearch-genai-observability-sdk-py` package instruments Python AI agents using [OpenTelemetry](https://opentelemetry.io/). The SDK provides decorators, enrichment functions, and auto-instrumentation for popular LLM providers and agent frameworks.

## Prerequisites

Before you begin, ensure you have the following:

- Python 3.10 or later
- An OpenSearch cluster with [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/index/) configured for trace ingestion
- An [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) (optional, for normalizing spans)

TypeScript SDK support is forthcoming.
{: .note}

## Installation

Install the base package:

```bash
pip install opensearch-genai-observability-sdk-py
```
{% include copy.html %}

To enable auto-instrumentation for specific providers, install the corresponding extras:

```bash
pip install opensearch-genai-observability-sdk-py[openai]
pip install opensearch-genai-observability-sdk-py[anthropic]
pip install opensearch-genai-observability-sdk-py[bedrock]
pip install opensearch-genai-observability-sdk-py[langchain]
pip install opensearch-genai-observability-sdk-py[llamaindex]
```
{% include copy.html %}

## Core API

### register()

The `register()` function configures the OpenTelemetry tracer and exporter. Call it once at application startup:

```python
from opentelemetry_genai_sdk import register

register(
    endpoint="http://localhost:4318",
    service_name="my-agent-app",
    protocol="http",
    auto_instrument=True
)
```
{% include copy.html %}

The following table describes the `register()` parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `endpoint` | String | The OTLP endpoint URL. Default is `http://localhost:4318` for Data Prepper. |
| `service_name` | String | An identifier for your application in trace data. |
| `protocol` | String | The transport protocol. Valid values are `http` and `grpc`. |
| `auto_instrument` | Boolean | When `true`, automatically discovers and enables installed provider instrumentors. Default is `false`. |

### @observe decorator

The `@observe` decorator wraps functions to create spans automatically. Use it to trace agent invocations, tool calls, and other operations:

```python
from opentelemetry_genai_sdk import observe, Op

@observe(op=Op.INVOKE_AGENT)
def run_agent(prompt: str):
    # Agent logic here
    return response

@observe(op=Op.EXECUTE_TOOL)
def search_database(query: str):
    # Tool logic here
    return results
```
{% include copy.html %}

The decorator supports synchronous functions, asynchronous functions, generators, and async generators. Span names are generated automatically from function names, or you can provide a custom name using the `name_from` parameter.

### enrich()

The `enrich()` function adds GenAI semantic attributes to the active span:

```python
from opentelemetry_genai_sdk import enrich

enrich(
    model="gpt-4",
    provider="openai",
    input_tokens=150,
    output_tokens=50,
    finish_reason="stop"
)
```
{% include copy.html %}

### score()

The `score()` function attaches evaluation metrics to traces or individual spans:

```python
from opentelemetry_genai_sdk import score

score(
    trace_id="abc123",
    name="relevance",
    value=0.95,
    explanation="Response directly addresses the query"
)
```
{% include copy.html %}

## Operation types

The `Op` class provides standardized operation names that map to [GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/):

| Operation | Constant | Description |
| :--- | :--- | :--- |
| Invoke agent | `Op.INVOKE_AGENT` | Root-level agent invocation. |
| Execute tool | `Op.EXECUTE_TOOL` | Tool or function call within an agent. |
| Chat | `Op.CHAT` | LLM chat completion request. |
| Create agent | `Op.CREATE_AGENT` | Agent initialization. |
| Retrieval | `Op.RETRIEVAL` | Document or data retrieval operation. |
| Embeddings | `Op.EMBEDDINGS` | Embedding generation request. |
| Text completion | `Op.TEXT_COMPLETION` | Text completion request. |

## Auto-instrumentation

When you install provider-specific extras, the SDK can automatically instrument LLM calls without requiring code changes. Enable auto-instrumentation by setting `auto_instrument=True` in the `register()` call.

The following providers support auto-instrumentation:

| Provider | Install command |
| :--- | :--- |
| OpenAI | `pip install opensearch-genai-observability-sdk-py[openai]` |
| Anthropic | `pip install opensearch-genai-observability-sdk-py[anthropic]` |
| Amazon Bedrock | `pip install opensearch-genai-observability-sdk-py[bedrock]` |
| Google | `pip install opensearch-genai-observability-sdk-py[google]` |
| LangChain | `pip install opensearch-genai-observability-sdk-py[langchain]` |
| LlamaIndex | `pip install opensearch-genai-observability-sdk-py[llamaindex]` |

## Framework integrations

The SDK integrates with popular agent frameworks. For each framework, decorate your entry points with `@observe` and use auto-instrumentation to capture internal LLM calls.

### Strands Agents

Strands supports both manual decoration with `@observe` and native OpenTelemetry through `StrandsTelemetry`, which automatically emits spans for agent invocations, tool executions, and LLM interactions.

### LangGraph

Wrap individual nodes (such as model calls and fact-checking steps) and the orchestration layer using the `@observe` decorator.

### CrewAI

Use `@observe` at the crew execution level, with auto-instrumentation available through the extras package for internal LLM call capture.

### OpenAI Agents SDK

Use the auto-instrumentor for comprehensive LLM coverage, supplemented by `@observe` for top-level coordination logic.

### Amazon Bedrock

For `converse` or `invoke_model` calls, the Bedrock auto-instrumentor captures interactions when installed.

## Data pipeline

The following flow describes how trace data moves from your application to OpenSearch:

1. Your instrumented application exports OTLP data over gRPC or HTTP.
2. The OpenTelemetry Collector normalizes spans using GenAI semantic conventions.
3. Data Prepper ingests the spans into OpenSearch using the `otel_trace_raw` processor.
4. OpenSearch stores trace data in `otel-v1-apm-span-*` indexes.
5. OpenSearch Dashboards renders the traces in the [Agent tracing]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/agent-tracing/) interface.
