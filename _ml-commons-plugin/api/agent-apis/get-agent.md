---
layout: default
title: Get agent
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/agent-apis/get-agent/
---

# Get an agent
**Introduced 2.13**
{: .label .label-purple }

You can retrieve agent information using the `agent_id`.

## Path and HTTP methods

```json
GET /_plugins/_ml/agents/<agent_id>
```

## Path parameters

The following table lists the available path parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `agent_id` | String | The agent ID of the agent to retrieve. |


#### Example request

```json
GET /_plugins/_ml/agents/N8AE1osB0jLkkocYjz7D
```
{% include copy-curl.html %}

#### Example response

```json
{
  "name": "Test_Agent_For_RAG",
  "type": "flow",
  "description": "this is a test agent",
  "tools": [
    {
      "type": "VectorDBTool",
      "parameters": {
        "input": "${parameters.question}",
        "source_field": """["text"]""",
        "embedding_field": "embedding",
        "index": "my_test_data",
        "model_id": "zBRyYIsBls05QaITo5ex"
      },
      "include_output_in_agent_response": false
    },
    {
      "type": "MLModelTool",
      "description": "A general tool to answer any question",
      "parameters": {
        "model_id": "ygAzT40Bdo8gePIqxk0H",
        "prompt": """

Human:You are a professional data analyst. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. 

 Context:
${parameters.VectorDBTool.output}

Human:${parameters.question}

Assistant:"""
      },
      "include_output_in_agent_response": false
    }
  ],
  "created_time": 1706821658743,
  "last_updated_time": 1706821658743
}
```

## Response fields

For response field descriptions, see [Register Agent API request fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent#request-fields).