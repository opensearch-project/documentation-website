---
layout: default
title: Execute tool 
parent: ML Commons APIs
nav_order: 100
---

# Execute Tool API
**Introduced 3.3**
{: .label .label-purple }

The Execute Tool API allows you to run individual tools directly without creating an agent first. This API is particularly beneficial for applications requiring quick, single-tool operations where the overhead of agent creation and management is unnecessary.

## Use cases

The Execute Tool API is ideal for:

- **Direct tool execution**: Run specific tools like search, data analysis, or retrieval operations without agent setup.
- **Testing and debugging**: Quickly test tool functionality during development.
- **Lightweight integrations**: Integrate specific OpenSearch capabilities into applications without full agent workflows.
- **Standalone operations**: Perform single tasks that don't require conversation memory or complex orchestration.

## Supported tools

This API supports all available OpenSearch tools. Each tool can be executed independently with its specific parameters.

For more information regarding the list of available tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).

## Endpoint

```json
POST /_plugins/_ml/tools/_execute/<tool_name>
```

The `<tool_name>` parameter refers to the predefined tool type name, such as `PPLTool`, `SearchIndexTool`, or `VectorDBTool`,---not a custom tool name that you define.
{: .note}

## Request body fields

The following table lists all request body fields.

| Field | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `parameters` | Object | Yes | Contains tool-specific parameters that vary depending on the tool being executed. Each tool requires different parameters based on its functionality. |

### Parameter structure

The `parameters` object combines the parameters used during tool registration and tool execution. The specific fields depend on the tool being executed.

To determine the required parameters for a specific tool, refer to the individual tool documentation in the [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/) section.

| Component                | Description                                    |
|:-------------------------|:-----------------------------------------------|
| Tool registration parameters | Parameters specified during tool registration. |
| Tool execution parameters  | Parameters specified during tool execution.    |

## Example requests

The following are examples of both simple and complex tool execution.

### Example 1: Simple tool execution

```json
POST /_plugins/_ml/tools/_execute/ListIndexTool
{
  "parameters": {
    "question": "How many indices do I have?"
  }
}
```
{% include copy-curl.html %}

### Example response

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": """row,health,status,index,uuid,pri(number of primary shards),rep(number of replica shards),docs.count(number of available documents),docs.deleted(number of deleted documents),store.size(store size of primary and replica shards),pri.store.size(store size of primary shards)
1,yellow,open,movies,kKcJKu2aT0C9uwJIPP4hxw,2,1,2,0,7.8kb,7.8kb
2,green,open,.plugins-ml-config,h8ovp_KFTq6_zvcBEn2kvg,1,0,1,0,4kb,4kb
3,green,open,.plugins-ml-agent,1oGlUBCIRAGXLbLv27Qg8w,1,0,1,0,8kb,8kb
"""
        }
      ]
    }
  ]
}
```

### Example 2: Complex tool execution

```json
POST /_plugins/_ml/tools/_execute/PPLTool
{
  "parameters": {
    "question": "what's the population of Seattle in 2021?",
    "index": "test-population",
    "model_id": "1TuQQ5gBMJhRgCqgSV79" // Remote model
  }
}

```
{% include copy-curl.html %}

### Example response

```json
{
    "inference_results": [
        {
            "output": [
                {
                    "name": "response",
                    "dataAsMap": {
                        "result":"{\"ppl\":\"source\=test-population | where QUERY_STRING([\'population_description\'], \'Seattle\') AND QUERY_STRING([\'population_description\'], \'2021\')\",\"executionResult\":\"{\\n  \\\"schema\\\": [\\n    {\\n      \\\"name\\\": \\\"population_description\\\",\\n      \\\"type\\\": \\\"string\\\"\\n    }\\n  ],\\n  \\\"datarows\\\": [],\\n  \\\"total\\\": 0,\\n  \\\"size\\\": 0\\n}\"}"
                    }
                }
            ]
        }
    ]
}
```