---
layout: default
title: Get agent
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 20
---

# Get an agent
**Introduced 2.12**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/ml-commons/issues/1161).    
{: .warning}

To retrieve information about an agent, you can:

- [Get an agent by ID](#get-an-agent-by-id)
- [Search for an agent](#search-for-an-agent)

## Get an agent by ID

You can retrieve agent information using the `agent_id`.

### Path and HTTP methods

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

## Search for an agent

Use this command to search for agents you've already created.

### Path and HTTP methods

```json
GET /_plugins/_ml/agents/_search
POST /_plugins/_ml/agents/_search
```

#### Example request: Searching for all agents

```json
POST /_plugins/_ml/agents/_search
{
  "query": {
    "match_all": {}
  },
  "size": 1000
}
```
{% include copy-curl.html %}

#### Example request: Searching for agents of a certain type

```json
POST /_plugins/_ml/agents/_search
{
  "query": {
    "term": {
      "type": {
        "value": "flow"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example: Searching for an agent by description

```json
GET _plugins/_ml/agents/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "description": "test agent"
          }
        }
      ]
    }
  },
  "size": 1000
}
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

For response fields descriptions, see [Register Agent API request fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent#request-fields).