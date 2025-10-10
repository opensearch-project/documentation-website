---
layout: default
title: Execute tool 
parent: ML Commons APIs
nav_order: 100
---

# Execute Tool API
**Introduced 3.2**
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

## Request body field

The following table lists all request body field.

| Field | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `parameters` | Object | Yes | Contains tool-specific parameters that vary depending on the tool being executed. Each tool requires different parameters based on its functionality. |

### Parameter structure

The `parameters` object combines the parameters used during tool registration and tool execution. The specific fields depend on the tool being executed.

To determine the required parameters for a specific tool, refer to the individual tool documentation in the [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/) section.

| Component                | Description                                    |
|:-------------------------|:-----------------------------------------------|
| Tool register parameters | Parameters specified during tool registration. |
| Tool execute parameters  | Parameters specified during tool execution.    |

## Example request

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

## Example response

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