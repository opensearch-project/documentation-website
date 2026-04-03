---
layout: default
title: Viewing agent traces
parent: Agent traces
nav_order: 20
---

# Viewing agent traces
**Introduced 3.6**
{: .label .label-purple }

The **Agent Traces** page in OpenSearch Dashboards lets you explore, debug, and monitor large language model (LLM) agent execution traces. You can view traces in multiple synchronized visualizations, examine span details, and analyze metrics for your agentic AI applications.

## Enabling agent traces

Agent traces functionality is included in default OpenSearch distributions. To enable agent traces, add the following feature flags to your `opensearch_dashboards.yml` configuration file:

```yaml
workspace.enabled: true
data_source.enabled: true
explore.enabled: true
explore.agentTraces.enabled: true
```
{% include copy.html %}

After updating the configuration, restart OpenSearch Dashboards for the changes to take effect.

[PPL]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) query support is enabled by default in default OpenSearch distributions. If you're running a minimal distribution of OpenSearch, [install the SQL plugin]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/) before using agent traces.
{: .note}

## Understanding traces and spans

In agent tracing, a **trace** represents a complete execution flow (such as a single agent invocation), while **spans** represent individual operations within that trace (such as LLM calls, tool executions, or retrieval operations). Each trace consists of one or more spans organized in a parent-child hierarchy.

### Span categories

Agent traces classifies spans into categories based on the `gen_ai.operation.name` attribute. Each category has a distinct color and icon in the **Agent Traces** page.

| Category | Color | Operation names | Description |
| :--- | :--- | :--- | :--- |
| Agent | Blue | `invoke_agent`, `create_agent` | Agent invocations and initialization. |
| LLM | Orange | `chat` | LLM chat completion requests. |
| Content | Teal | `text_completion`, `generate_content` | Text and content generation. |
| Tool | Purple | `execute_tool` | Tool and function calls. |
| Embeddings | Green | `embeddings` | Embedding generation requests. |
| Retrieval | Red | `retrieval` | Document or data retrieval operations. |
| Other | Gray | Unmapped operations | Operations not matching a known category. |

### Span attributes

When you instrument your application using the [`opensearch-genai-observability-sdk-py` SDK]({{site.url}}{{site.baseurl}}/observing-your-data/agent-traces/instrument/), spans are automatically created with the required attributes. The following tables list the core OpenTelemetry attributes and the generative AI semantic convention attributes.

#### Core attributes

The following table lists the core OpenTelemetry attributes.

| Attribute | Required | Description |
| :--- | :--- | :--- |
| `traceId` | Yes | Unique identifier for the trace. |
| `spanId` | Yes | Unique identifier for the span. |
| `parentSpanId` | No | Identifier of the parent span. Empty for root spans. |
| `startTime` | Yes | Span start timestamp. |
| `endTime` | Yes | Span end timestamp. |
| `durationInNanos` | Yes | Span duration in nanoseconds. |
| `status.code` | Yes | Span status (`OK`, `ERROR`, or `UNSET`). |

#### Generative AI attributes

The following table lists the generative AI semantic convention attributes.

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

## Data pipeline

Agent traces follow this data pipeline:

1. Instrumented LLM applications send OpenTelemetry Protocol (OTLP) data over gRPC or HTTP.
2. The OpenTelemetry Collector processes and routes the data.
3. [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/index/) ingests the data into OpenSearch using the `otel_trace_raw` processor.
4. OpenSearch stores trace data in `otel-v1-apm-span-*` indexes.
5. OpenSearch Dashboards displays the traces in the **Agent Traces** page.

## Using the interface

To access agent traces in OpenSearch Dashboards, choose **Observability** from the main menu, then choose **Agent Traces**.

The **Agent Traces** page includes the following components.

### Metrics bar

The metrics bar at the top of the page displays summary statistics for the current time range:

- **Total Traces** -- The number of root-level traces.
- **Total Spans** -- The total number of spans across all traces.
- **Total Tokens** -- The combined input and output token count.
- **Latency P50** -- The median trace duration.
- **Latency P99** -- The 99th percentile trace duration.

### Traces tab

The Traces tab displays root-level traces in a paginated table. The table includes the following columns:

- **Time** -- The trace start timestamp.
- **Kind** -- The span category badge.
- **Name** -- The operation name.
- **Status** -- The span status (`OK` or `ERROR`).
- **Latency** -- The total trace duration.
- **Tokens** -- The combined token count.
- **Input** -- A truncated preview of the user prompt.
- **Output** -- A truncated preview of the model response.

You can expand a row to view child spans inline.

The following image shows the Traces tab.

![Traces tab showing root-level agent traces]({{site.url}}{{site.baseurl}}/images/agent-traces/traces-table.png)

### Spans tab

The Spans tab shows all generative AI spans, not only root traces. Use this tab to examine individual operations across multiple traces. The table includes the same columns as the [Traces tab](#traces-tab).

The following image shows the Spans tab.

![Spans tab showing all generative AI spans]({{site.url}}{{site.baseurl}}/images/agent-traces/spans-table.png)

## Trace details

Select a row in the Traces or Spans tab to open the trace details. Trace details provide three synchronized visualization views and a span details panel. Selecting a span in any view highlights it across all three views.

### Agent graph

The agent graph renders traces as a directed acyclic graph (DAG) using the Dagre layout algorithm. Parent spans flow downward to child spans, and sibling spans are arranged horizontally.

The following image shows the agent graph view.

![Agent Graph showing DAG visualization]({{site.url}}{{site.baseurl}}/images/agent-traces/agent-graph.png)

Each node in the graph includes the following elements:

- A color-coded badge indicating the span category (for example, Agent, LLM, or Tool).
- The span name, truncated to 37 characters.
- A bar showing the span duration as a percentage of total trace time.
- A red badge displayed for spans with an `ERROR` status.

The Agent Graph provides the following controls:

- Adjust zoom from 0.1x to 2x.
- Reset the viewport to display all nodes.

Select a node to view its details in the span details panel. Select the background to deselect the node.

### Trace tree view

The trace tree view displays all spans in an expandable hierarchical structure. Each row shows the following information:

- The color-coded span category.
- The operation name.
- The number of tokens consumed by the operation.
- The span duration.

Expand or collapse nodes to navigate the parent-child relationships.

The following image shows the trace tree view.

![Trace tree view showing hierarchical span structure]({{site.url}}{{site.baseurl}}/images/agent-traces/trace-tree.png)

### Timeline view

The timeline view presents a Gantt-style chart showing span durations chronologically. Each span appears as a horizontal bar with the following characteristics:

- The bar width corresponds to the span duration.
- The bar color matches the span category color.
- The indentation reflects the span hierarchy depth.

Overlapping bars indicate concurrent operations. Use this view to identify bottlenecks and understand the sequential and parallel execution patterns of your agent.

The following image shows the timeline view.

![Timeline view showing Gantt-style span chart]({{site.url}}{{site.baseurl}}/images/agent-traces/timeline.png)

### Span details panel

The right panel displays detailed information about the selected span, including all JSON attributes and execution timing.
