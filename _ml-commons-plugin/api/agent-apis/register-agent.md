---
layout: default
title: Register agent
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/agent-apis/register-agent/
---

# Register an agent
**Introduced 2.13**
{: .label .label-purple }

Use this API to register an agent. 

Agents may be of the following types:

- Flow agent
- Conversational flow agent
- Conversational agent

For more information about agents, see [Agents and tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/index/).

## Path and HTTP methods

```json
POST /_plugins/_ml/agents/_register
```
{% include copy-curl.html %}

## Request fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Agent type | Description
:---  | :--- | :--- | :--- | :---
`name`| String | Required | All | The agent name. |
`type` | String | Required | All | The agent type. Valid values are `flow`, `conversational_flow`, and `conversational`. For more information, see [Agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/index/). |
`description` | String | Optional| All | A description of the agent. |
`tools` | Array | Optional | All | A list of tools for the agent to execute. 
`app_type` | String | Optional | All | Specifies an optional agent category. You can then perform operations on all agents in the category. For example, you can delete all messages for RAG agents.
`memory.type` | String | Optional | `conversational_flow`, `conversational` | Specifies where to store the conversational memory. Currently, the only supported type is `conversation_index` (store the memory in a conversational system index).
`llm.model_id` | String | Required | `conversational` | The model ID of the LLM to which to send questions.
`llm.parameters.response_filter` | String | Required | `conversational` | The pattern for parsing the LLM response. For each LLM, you need to provide the field where the response is located. For example, for the Anthropic Claude model, the response is located in the `completion` field, so the pattern is `$.completion`. For OpenAI models, the pattern is `$.choices[0].message.content`.
`llm.parameters.max_iteration` | Integer | Optional | `conversational` | The maximum number of messages to send to the LLM. Default is `3`.

The `tools` array contains a list of tools for the agent. Each tool contains the following fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :---
`name`| String | Optional | The tool name. The tool name defaults to the `type` parameter value. If you need to include multiple tools of the same type in an agent, specify different names for the tools. |
`type` | String | Required | The tool type. For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/). 
`parameters` | Object | Optional | The parameters for this tool. The parameters are highly dependent on the tool type. You can find information about specific tool types in [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).

#### Example request: Flow agent

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_RAG",
  "type": "flow",
  "description": "this is a test agent",
  "tools": [
    {
      "name": "vector_tool",
      "type": "VectorDBTool",
      "parameters": {
        "model_id": "zBRyYIsBls05QaITo5ex",
        "index": "my_test_data",
        "embedding_field": "embedding",
        "source_field": [
          "text"
        ],
        "input": "${parameters.question}"
      }
    },
    {
      "type": "MLModelTool",
      "description": "A general tool to answer any question",
      "parameters": {
        "model_id": "NWR9YIsBUysqmzBdifVJ",
        "prompt": "\n\nHuman:You are a professional data analyst. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. \n\n Context:\n${parameters.vector_tool.output}\n\nHuman:${parameters.question}\n\nAssistant:"
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Example request: Conversational flow agent

```json
POST /_plugins/_ml/agents/_register
{
  "name": "population data analysis agent",
  "type": "conversational_flow",
  "description": "This is a demo agent for population data analysis",
  "app_type": "rag",
  "memory": {
    "type": "conversation_index"
  },
  "tools": [
    {
      "type": "VectorDBTool",
      "name": "population_knowledge_base",
      "parameters": {
        "model_id": "your_text_embedding_model_id",
        "index": "test_population_data",
        "embedding_field": "population_description_embedding",
        "source_field": [
          "population_description"
        ],
        "input": "${parameters.question}"
      }
    },
    {
      "type": "MLModelTool",
      "name": "bedrock_claude_model",
      "description": "A general tool to answer any question",
      "parameters": {
        "model_id": "your_LLM_model_id",
        "prompt": """

Human:You are a professional data analysist. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. 

Context:
${parameters.population_knowledge_base.output:-}

${parameters.chat_history:-}

Human:${parameters.question}

Assistant:"""
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Example request: Conversational agent

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_ReAct_ClaudeV2",
  "type": "conversational",
  "description": "this is a test agent",
  "app_type": "my chatbot",
  "llm": {
    "model_id": "<llm_model_id>",
    "parameters": {
      "max_iteration": 5,
      "stop_when_no_tool_found": true,
      "response_filter": "$.completion"
    }
  },
  "memory": {
    "type": "conversation_index"
  },
  "tools": [
    {
      "type": "VectorDBTool",
      "name": "VectorDBTool",
      "description": "A tool to search opensearch index with natural language question. If you don't know answer for some question, you should always try to search data with this tool. Action Input: <natural language question>",
      "parameters": {
        "model_id": "<embedding_model_id>",
        "index": "<your_knn_index>",
        "embedding_field": "<embedding_filed_name>",
        "source_field": [
          "<source_filed>"
        ],
        "input": "${parameters.question}"
      }
    },
    {
      "type": "CatIndexTool",
      "name": "RetrieveIndexMetaTool",
      "description": "Use this tool to get OpenSearch index information: (health, status, index, uuid, primary count, replica count, docs.count, docs.deleted, store.size, primary.store.size)."
    }
  ]
}
```
{% include copy-curl.html %}

#### Example response

OpenSearch responds with an agent ID that you can use to refer to the agent:

```json
{
  "agent_id": "bpV_Zo0BRhAwb9PZqGja"
}
```
