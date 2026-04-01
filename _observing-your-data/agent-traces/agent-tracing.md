---
layout: default
title: Agent tracing
parent: Agent traces
nav_order: 20
---

# Agent tracing
Introduced 3.6
{: .label .label-purple }

The Agent Traces plugin for OpenSearch Dashboards lets you explore, debug, and monitor LLM agent execution traces. The plugin provides hierarchical views, detail flyouts, flow visualizations, and metrics for your agentic AI applications.

## Enabling agent traces

To enable agent traces, add the following feature flags to your `opensearch_dashboards.yml` configuration file:

```yaml
workspace.enabled: true
data_source.enabled: true
explore.enabled: true
explore.agentTraces.enabled: true
```
{% include copy.html %}

After updating the configuration, restart OpenSearch Dashboards for the changes to take effect.

## Data pipeline

Agent traces follow this data pipeline:

1. Instrumented LLM applications send OTLP data over gRPC or HTTP.
2. The OpenTelemetry Collector processes and routes the data.
3. [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/index/) ingests the data into OpenSearch using the `otel_trace_raw` processor.
4. OpenSearch stores trace data in `otel-v1-apm-span-*` indexes.
5. The Agent Traces plugin in OpenSearch Dashboards displays the traces.

Ensure that [PPL]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) query support is enabled in your OpenSearch cluster. Agent traces uses PPL to query span data.
{: .important}

## Required span attributes

Spans must contain certain attributes for the Agent Traces plugin to display them correctly. The following table lists the required and recommended attributes.

### Core attributes

| Attribute | Required | Description |
| :--- | :--- | :--- |
| `traceId` | Yes | Unique identifier for the trace. |
| `spanId` | Yes | Unique identifier for the span. |
| `parentSpanId` | No | Identifier of the parent span. Empty for root spans. |
| `startTime` | Yes | Span start timestamp. |
| `endTime` | Yes | Span end timestamp. |
| `durationInNanos` | Yes | Span duration in nanoseconds. |
| `status.code` | Yes | Span status (`OK`, `ERROR`, or `UNSET`). |

### GenAI attributes

| Attribute | Required | Description |
| :--- | :--- | :--- |
| `gen_ai.operation.name` | Yes | The operation type (for example, `chat`, `invoke_agent`, or `execute_tool`). |
| `gen_ai.request.model` | No | The model name used for the request. |
| `gen_ai.system` | No | The AI provider name (for example, `openai` or `anthropic`). |
| `gen_ai.usage.input_tokens` | No | Number of input tokens consumed. |
| `gen_ai.usage.output_tokens` | No | Number of output tokens generated. |
| `gen_ai.prompt` | No | The user input or prompt text. |
| `gen_ai.completion` | No | The model response text. |
| `gen_ai.agent.name` | No | The name of the agent. |
| `gen_ai.tool.name` | No | The tool or function name. |

## Span categories

The plugin classifies spans into categories based on the `gen_ai.operation.name` attribute. Each category has a distinct color and icon.

| Category | Color | Operation names | Description |
| :--- | :--- | :--- | :--- |
| Agent | Blue | `invoke_agent`, `create_agent` | Agent invocations and initialization. |
| LLM | Orange | `chat` | LLM chat completion requests. |
| Content | Teal | `text_completion`, `generate_content` | Text and content generation. |
| Tool | Purple | `execute_tool` | Tool and function calls. |
| Embeddings | Green | `embeddings` | Embedding generation requests. |
| Retrieval | Red | `retrieval` | Document or data retrieval operations. |
| Other | Gray | Unmapped operations | Operations not matching a known category. |

## Navigating to Agent Traces

To access Agent Traces in OpenSearch Dashboards:

1. From the main menu, choose **Observability**.
2. Choose **Agent Traces**.

## UI components

### Metrics bar

The metrics bar at the top of the page displays summary statistics for the current time range:

- **Total traces** --- The number of root-level traces.
- **Total spans** --- The total number of spans across all traces.
- **Total tokens** --- The combined input and output token count.
- **P50 latency** --- The median trace duration.
- **P99 latency** --- The 99th percentile trace duration.

### Traces tab

The Traces tab displays root-level traces in a paginated table. Each row includes the following columns:

- **Time** --- The trace start timestamp.
- **Kind** --- The span category badge.
- **Name** --- The operation name.
- **Status** --- The span status (`OK` or `ERROR`).
- **Latency** --- The total trace duration.
- **Tokens** --- The combined token count.
- **Input** --- A truncated preview of the user prompt.
- **Output** --- A truncated preview of the model response.

You can expand a row to view child spans inline.

The following image shows the Traces tab.

![Traces tab showing root-level agent traces]({{site.url}}{{site.baseurl}}/images/agent-traces/traces-table.png)

### Spans tab

The Spans tab shows all GenAI spans, not just root traces. Use this tab to examine individual operations across multiple traces.

The following image shows the Spans tab.

![Spans tab showing all GenAI spans]({{site.url}}{{site.baseurl}}/images/agent-traces/spans-table.png)

## Trace details flyout

Select a row in the Traces or Spans tab to open the trace details flyout. The flyout provides the following views:

- **Trace tree** --- A hierarchical view of all spans in the trace. See [Agent Graph and Path]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/agent-graph/) for more information.
- **Flow (DAG)** --- A directed acyclic graph visualization of the agent execution path.
- **Timeline** --- A Gantt-style chart showing span durations and concurrency.

The right panel displays span details, including all JSON attributes and a timeline visualization.
