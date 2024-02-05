---
layout: default
title: Register agent
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Register an agent
**Introduced 2.12**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/ml-commons/issues/1161).    
{: .warning}

Registers an agent. For more information about agents, see [Agents and tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/index/).

## Path and HTTP methods

```json
POST /_plugins/_ml/agents/_register
```
{% include copy-curl.html %}

## Request fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- 
`name`| String | Required | The agent name. |
`type` | String | Required | The agent type. Valid values are `flow` and `conversational`. For more information, see [Agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/index/). |
`description` | String | Optional| The agent description. |
`tools` | Array | Optional | A list of tools for the agent to execute. 

The `tools` array contains a list of tools for the agent. Each tool contains the following fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :---
`name`| String | Optional | The tool name. The tool name defaults to the `type` parameter value. If you need to include multiple tools of the same type in an agent, specify different names for the tools. |
`type` | String | Required | The tool type. For a list of supported tools, see the [Tools library](https://github.com/opensearch-project/skills/tree/main/src/main/java/org/opensearch/agent/tools). 
`parameters` | Object | Optional | The parameters for this tool. The parameters are highly dependent on the tool type. For more information, see the [Tools library](https://github.com/opensearch-project/skills/tree/main/src/main/java/org/opensearch/agent/tools).

#### Example request

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

#### Example response

OpenSearch responds with an agent ID that you can use to refer to the agent:

```json
{
  "agent_id": "bpV_Zo0BRhAwb9PZqGja"
}
```