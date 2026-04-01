---
layout: default
title: Agent graph and path
parent: Agent traces
nav_order: 30
---

# Agent graph and path
**Introduced 3.6**
{: .label .label-purple }

The Agent Traces plugin provides three synchronized visualization views for understanding agent execution paths: the Agent Graph, the Trace tree, and the Timeline. Selecting a span in any view highlights it across all three views.

## Agent graph (DAG view)

The Agent Graph renders traces as a directed acyclic graph (DAG) using a `Dagre` layout algorithm. Parent spans flow downward to child spans, and sibling spans are arranged horizontally.

The following image shows the Agent Graph view.

![Agent Graph showing DAG visualization]({{site.url}}{{site.baseurl}}/images/agent-traces/agent-graph.png)

### Node display

Each node in the graph includes the following elements:

- **Category badge** --- A color-coded badge indicating the span category (for example, Agent, LLM, or Tool).
- **Operation name** --- The span name, truncated to 37 characters.
- **Duration bar** --- A bar showing the span duration as a percentage of total trace time.
- **Error indicator** --- A red badge displayed for spans with an `ERROR` status.

### Graph controls

The Agent Graph provides the following controls:

- **Zoom** --- Adjust zoom from 0.1x to 2x.
- **Fit view** --- Reset the `viewport` to display all nodes.

Click a node to select it and view its details in the right panel. Click the background to deselect.

## Trace tree view

The trace tree view displays all spans in an expandable hierarchical structure. Each row shows the following information:

- **Category badge** --- The color-coded span category.
- **Name** --- The operation name.
- **Token count** --- The number of tokens consumed by the operation.
- **Latency** --- The span duration.

Expand or collapse nodes to navigate the parent-child relationships.

The following image shows the trace tree view.

![Trace tree view showing hierarchical span structure]({{site.url}}{{site.baseurl}}/images/agent-traces/trace-tree.png)

## Timeline view

The timeline view presents a Gantt-style chart showing span durations chronologically. Each span appears as a horizontal bar with the following characteristics:

- **Bar width** --- Corresponds to the span duration.
- **Bar color** --- Matches the span category color.
- **Indentation** --- Reflects the span hierarchy depth.

Overlapping bars indicate concurrent operations. Use this view to identify bottlenecks and understand the sequential and parallel execution patterns of your agent.

The following image shows the timeline view.

![Timeline view showing Gantt-style span chart]({{site.url}}{{site.baseurl}}/images/agent-traces/timeline.png)

## Span categories and colors

All three views use the same color coding for span categories:

| Category | Color | Operation names |
| :--- | :--- | :--- |
| Agent | Blue | `invoke_agent`, `create_agent` |
| LLM | Orange | `chat` |
| Content | Teal | `text_completion`, `generate_content` |
| Tool | Purple | `execute_tool` |
| Embeddings | Green | `embeddings` |
| Retrieval | Red | `retrieval` |
| Other | Gray | Unmapped operations |

## Synchronized views

The three views share selection state. When you select a span in one view, the corresponding span is highlighted in the other two views. This synchronization helps you correlate a span's position in the execution graph with its place in the hierarchy and its timing relative to other spans.
