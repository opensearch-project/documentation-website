---
layout: default
title: Update agent
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 15
---

# Update an agent
**Introduced 3.1**
{: .label .label-purple }

Use this API to update an existing agent's configuration.

## Endpoints

```json
PUT /_plugins/_ml/agents/<agent_id>
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `agent_id` | String | The agent ID of the agent to update. |

## Request body fields

The following table lists the available request fields. All request body fields are optional.

Field | Data type | Agent type | Description
:---  | :--- | :--- | :--- 
`name`| String | All | The agent name. 
`description` | String | All | A description of the agent. 
`tools` | Array | All | A list of tools for the agent to execute. 
`app_type` | String | All | Specifies an optional agent category.
`memory.type` | String | `conversational_flow`, `conversational` | Specifies where to store the conversational memory. Currently, the only supported type is `conversation_index` (store the memory in a conversational system index).
`llm.model_id` | String | `conversational` | The model ID of the LLM to send questions to.
`llm.parameters.response_filter` | String | `conversational` | The pattern for parsing the LLM response.
`llm.parameters.max_iteration` | Integer | `conversational` | The maximum number of messages to send to the LLM.

#### Example request: Update tool prompt

```json
PUT /_plugins/_ml/agents/N8AE1osB0jLkkocYjz7D
{
  "name": "Updated_Test_Agent_For_RAG",
  "description": "Updated description for test agent",
  "tools": [
    {
      "type": "MLModelTool",
      "description": "Updated general tool to answer any question",
      "parameters": {
        "model_id": "NWR9YIsBUysqmzBdifVJ",
        "prompt": "This is an updated prompt"
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Example response

```json
{
    "_index": ".plugins-ml-agent",
    "_id": "ryN5jpcBfY4uTYhorKvh",
    "_version": 2,
    "result": "updated",
    "_shards": {
        "total": 1,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 1,
    "_primary_term": 1
}
```