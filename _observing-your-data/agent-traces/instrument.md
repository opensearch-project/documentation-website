---
layout: default
title: Instrumenting your application
parent: Agent traces
nav_order: 10
---

# Instrumenting your application
**Introduced 3.6**
{: .label .label-purple }

The `opensearch-genai-observability-sdk-py` package instruments Python AI agents using [OpenTelemetry](https://opentelemetry.io/). The SDK provides two instrumentation approaches:

- **Auto-instrumentation**: Automatically captures LLM calls from supported providers (OpenAI, Anthropic, Amazon Bedrock, LangChain, LlamaIndex) without code changes.
- **Manual instrumentation**: Use the `@observe` decorator to trace custom agent logic, tool calls, and orchestration code.

For most applications, combine both approaches: enable auto-instrumentation for LLM calls and use `@observe` for application-specific operations.

## Prerequisites

Before you start, ensure that you have the following:

- Python 3.10 or later.
- An OpenSearch cluster with [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/index/) configured for trace ingestion.
- An [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) to normalize spans using generative AI semantic conventions.

## Installation

Install the base package:

```bash
pip install opensearch-genai-observability-sdk-py
```
{% include copy.html %}

To enable auto-instrumentation for specific providers, install the corresponding optional dependencies. For example, to instrument OpenAI and LangChain:

```bash
pip install opensearch-genai-observability-sdk-py[openai,langchain]
```
{% include copy.html %}

The following providers support auto-instrumentation:

| Provider | Package name |
| :--- | :--- |
| OpenAI | `openai` |
| Anthropic | `anthropic` |
| Amazon Bedrock | `bedrock` |
| Google | `google` |
| LangChain | `langchain` |
| LlamaIndex | `llamaindex` |

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
| `endpoint` | String | The OpenTelemetry Protocol (OTLP) endpoint URL. Default is `http://localhost:4318` for the OpenTelemetry Collector. |
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

The `Op` class provides standardized operation names that map to [GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/). These operation types determine how spans are categorized and displayed in the **Agent Traces** page.

| Operation | Constant | Description |
| :--- | :--- | :--- |
| Invoke agent | `Op.INVOKE_AGENT` | Root-level agent invocation. |
| Execute tool | `Op.EXECUTE_TOOL` | Tool or function call within an agent. |
| Chat | `Op.CHAT` | LLM chat completion request. |
| Create agent | `Op.CREATE_AGENT` | Agent initialization. |
| Retrieval | `Op.RETRIEVAL` | Document or data retrieval operation. |
| Embeddings | `Op.EMBEDDINGS` | Embedding generation request. |
| Text completion | `Op.TEXT_COMPLETION` | Text completion request. |

## Framework integrations

The SDK integrates with popular agent frameworks. The general pattern is to combine auto-instrumentation (for LLM calls) with manual `@observe` decorators (for agent-specific logic).

### Strands Agents

Strands supports both approaches:
- **Native OpenTelemetry**: Use `StrandsTelemetry` to automatically emit spans for agent invocations, tool executions, and LLM interactions.
- **Manual decoration**: Use `@observe` on custom functions for additional instrumentation.

### LangGraph

Wrap LangGraph nodes and the orchestration layer with `@observe`. Enable auto-instrumentation to capture model calls within nodes automatically.

### CrewAI

Use `@observe` to wrap crew execution functions. Install the appropriate provider package (for example, `[openai]`) to automatically capture LLM calls made by crew members.

### OpenAI Agents SDK

Enable auto-instrumentation for comprehensive LLM coverage. Supplement with `@observe` for top-level coordination logic and custom operations.

### Amazon Bedrock

Install `[bedrock]` to automatically capture `converse` and `invoke_model` calls. Use `@observe` for agent orchestration and custom tool implementations.

## Next steps

After instrumenting your application, configure OpenSearch Dashboards to view your traces. See [Viewing agent traces]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/agent-tracing/) for configuration and visualization options.
