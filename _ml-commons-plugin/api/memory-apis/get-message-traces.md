---
layout: default
title: Get message traces
parent: Memory APIs
grand_parent: ML APIs
nav_order: 70
---

# Get Message Traces API
**Introduced 2.12**
{: .label .label-purple }

Use this API to retrieve message trace information for [conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/). This can be useful for debugging.

For each message, an agent may need to run different tools. You can use the Get Traces API to get all trace data for a message. The trace data includes detailed steps of a message execution.

Agents registered using the [unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/index/#unified-registration-method) don't record trace data, so this API returns an empty `traces` array for their messages.

When the Security plugin is enabled, all memories exist in a `private` security mode. Only the user who created a memory can interact with that memory and its messages.
{: .important}


## Endpoints

```json
GET /_plugins/_ml/memory/message/{message_id}/traces
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`message_id` | String | The ID of the message to trace.

## Query parameters

Use the following query parameters to customize your results. All query parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`max_results` | Integer | The maximum number of traces to return. Default is `10`.
`next_token` | Integer | The index of the first trace in the list of traces, ordered by `trace_number`, to return. Default is `0`.

## Response body fields

The following table lists the available response fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory_id` | String | The memory ID. |
| `message_id` | String | The message ID. |
| `create_time` | String | The time at which the message was created. |
| `updated_time` | String | The time at which the message was last updated. |
| `input` | String | The question in the message (human input). In a tool trace, the input sent to the tool. |
| `prompt_template` | String | The prompt template that was used for the message. |
| `response` | String | The answer to the question (generative AI output). In a trace, the LLM response or the tool output. |
| `origin` | String | The name of the AI or other system that generated the response. |
| `additional_info` | Object | Any other information that was sent to the `origin`. |
| `parent_message_id` | String | The ID of the parent message (for trace messages). |
| `trace_number` | Integer | The trace number (for trace messages). |
| `next_token` | Integer | The index of the first trace to return in the next page of results. Present only if more results may exist. |

Fields that have no value are omitted from the response.

## Example request

```json
GET /_plugins/_ml/memory/message/TAuCZY0BT2tRrkdmCPqZ/traces
```
{% include copy-curl.html %}

## Example response

```json
{
  "traces": [
    {
      "memory_id": "7Qt4ZY0BT2tRrkdmSPlo",
      "message_id": "TQuCZY0BT2tRrkdmEvpp",
      "create_time": "2026-10-15T18:56:22.771010828Z",
      "updated_time": "2026-10-15T18:56:22.771010828Z",
      "input": "Which index has most documents",
      "response": "{\"metrics\":{\"latencyMs\":816},\"output\":{\"message\":{\"content\":[{\"text\":\"I'll check all the indices in the OpenSearch cluster to find which one has the most documents.\"},{\"toolUse\":{\"input\":{\"indices\":[]},\"name\":\"ListIndexTool\",\"toolUseId\":\"tooluse_0f8V4bl1yDthOP38a0b1Oo\",\"type\":\"tool_use\"}}],\"role\":\"assistant\"}},\"stopReason\":\"tool_use\",\"usage\":{\"cacheReadInputTokenCount\":0,\"cacheReadInputTokens\":0,\"cacheWriteInputTokenCount\":0,\"cacheWriteInputTokens\":0,\"inputTokens\":748,\"outputTokens\":75,\"serverToolUsage\":{},\"totalTokens\":823}}",
      "origin": "LLM",
      "parent_message_id": "TAuCZY0BT2tRrkdmCPqZ",
      "trace_number": 1
    },
    {
      "memory_id": "7Qt4ZY0BT2tRrkdmSPlo",
      "message_id": "TguCZY0BT2tRrkdmEvp7",
      "create_time": "2026-10-15T18:56:22.775631733Z",
      "updated_time": "2026-10-15T18:56:22.775631733Z",
      "input": "{\"indices\":[]}",
      "response": """row,health,status,index,uuid,pri(number of primary shards),rep(number of replica shards),docs.count(number of available documents),docs.deleted(number of deleted documents),store.size(store size of primary and replica shards),pri.store.size(store size of primary shards)
1,green,open,.plugins-ml-model-group,lHgGEgJhT_mpADyOZoXl2g,1,0,7,3,61.1kb,61.1kb
2,green,open,.plugins-ml-memory-message,wTNBU4BBQVSFcFhNlUdfBQ,1,0,21,2,55.9kb,55.9kb
...
10,green,open,opensearch_dashboards_sample_data_ecommerce,wnE6r7OvSPqc5YHj8wHSLA,1,0,4675,0,4.9mb,4.9mb
""",
      "origin": "ListIndexTool",
      "parent_message_id": "TAuCZY0BT2tRrkdmCPqZ",
      "trace_number": 2
    },
    {
      "memory_id": "7Qt4ZY0BT2tRrkdmSPlo",
      "message_id": "UwuCZY0BT2tRrkdmHPos",
      "create_time": "2026-10-15T18:56:24.876003692Z",
      "updated_time": "2026-10-15T18:56:24.876003692Z",
      "input": "Which index has most documents",
      "response": "Based on the results, **`opensearch_dashboards_sample_data_ecommerce`** index has the most documents with **4,675 documents**.\n\nHere's a summary of the top indices by document count:\n1. **opensearch_dashboards_sample_data_ecommerce** - 4,675 documents\n2. **top_queries-2026.10.15-59495** - 231 documents\n...",
      "origin": "LLM",
      "parent_message_id": "TAuCZY0BT2tRrkdmCPqZ",
      "trace_number": 3
    }
  ]
}
```