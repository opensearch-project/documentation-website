---
layout: default
title: Agents and tools
has_children: true
has_toc: false
nav_order: 27
---

# Agents and tools
**Introduced 2.12**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/ml-commons/issues/1161).    
{: .warning}

You can automate machine learning (ML) tasks using agents and tools. An _agent_ orchestrates and runs ML models and tools. A _tool_ performs a set of specific tasks. Example tools include a `VectorDBTool`, which supports vector search, or a `CATIndexTool`, which executes the `cat indices` operation.

## Agents

An _agent_ is a coordinator that uses a large language model (LLM) to solve a problem. After the LLM reasons and decides what action to take, the agent coordinates the action execution. OpenSearch supports the following agent types:

- [_Flow agent_](#flow-agents): Runs tools sequentially, in the order specified in its configuration. The workflow of a flow agent is fixed. Useful for retrieval-augmented generation (RAG).
- [_Conversational agent_](#conversational-agents): Reasons to provide a response based on the available knowledge. The workflow of a conversational agent is variable, based on follow-up questions. For specific questions, uses the Chain-of-Thought (CoT) process to select the best tool for providing a response to the question out of the configured tools. Useful for chatbot creation.

### Flow agents

A flow agent is configured with a set of tools that it runs in order. For example, the following agent runs the `VectorDBTool` and then the `MLModelTool`. The agent coordinates the tools so one tool's output can become another tool's input. In this example, the `VectorDBTool` queries the k-NN index and the agent passes its output `${parameters.VectorDBTool.output}` to the `MLModelTool` as a context, along with the `${parameters.question}` (see the `prompt` parameter):

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_RAG",
  "type": "flow",
  "description": "this is a test agent",
  "tools": [
    {
      "type": "VectorDBTool",
      "parameters": {
        "model_id": "aVeif4oB5Vm0Tdw8zYO2",
        "index": "my_test_data",
        "embedding_field": "embedding",
        "source_field": ["text"],
        "input": "${parameters.question}"
      }
    },
    {
      "type": "MLModelTool",
      "description": "A general tool to answer any question",
      "parameters": {
        "model_id": "NWR9YIsBUysqmzBdifVJ",
        "prompt": "\n\nHuman:You are a professional data analyst. You will always answer a question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say you don't know. \n\n Context:\n${parameters.VectorDBTool.output}\n\nHuman:${parameters.question}\n\nAssistant:"
      }
    }
  ]
}
```

### Conversational agents

A conversational agent can be configured with an LLM and a set of supplementary tools that perform specific jobs. For example, you can set up an LLM and a `CATIndexTool` when configuring an agent. When you send a question to the model, the agent also includes the `CATIndexTool` as context. The LLM then decides whether it needs to use a the `CATIndexTool` to answer questions related to the number of indexes in your cluster (for example, "How many indexes are in my cluster?"). The context allows an LLM to answer specific questions that are outside of its knowledge base. For example, the following agent is configured with an LLM and a `CATIndexTool` that calls the `_cat/indices` API:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_ReAct_ClaudeV2",
  "type": "conversational",
  "description": "this is a test agent",
  "llm": {
    "model_id": "NWR9YIsBUysqmzBdifVJ",
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
      "description": "A tool to search opensearch index with natural language quesiotn. If you don't know answer for some question, you should always try to search data with this tool. Action Input: <natrual language question>",
      "parameters": {
        "model_id": "zBRyYIsBls05QaITo5ex",
        "index": "my_test_data",
        "embedding_field": "embedding",
        "source_field": [ "text" ],
        "input": "${parameters.question}"
      }
    },
    {
      "type": "CatIndexTool",
      "name": "RetrieveIndexMetaTool",
      "description": "Use this tool to get OpenSearch index information: (health, status, index, uuid, primary count, replica count, docs.count, docs.deleted, store.size, primary.store.size)."
    }
  ],
  "app_type": "my app"
}
```

It is important to provide a thorough description for the tools so that the LLM can decide in which situations to use those tools.
{: .tip}

## Enabling the feature

To enable agents and tools, configure the following setting:

```yaml
plugins.ml_commons.agent_framework_enabled: true
```
{% include copy.html %}

For conversational agents, you also need to RAG for use in conversational search. To enable RAG, configure the following setting:

```yaml
plugins.ml_commons.rag_pipeline_feature_enabled: true
```
{% include copy.html %}

For more information about ways to enable experimental features, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

## Developer information

The agents and tools framework is flexible and extensible. You can find the list of tools provided by OpenSearch in the [Tools library](https://github.com/opensearch-project/skills/tree/main/src/main/java/org/opensearch/agent/tools). For a different use case, you can build your own tool by implementing the [_Tool_ interface](https://github.com/opensearch-project/ml-commons/blob/2.x/spi/src/main/java/org/opensearch/ml/common/spi/tools/Tool.java).

## Next steps

- For a step-by-step tutorial, see [Agents and tools tutorial]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents-tools-tutorial/).
- For supported APIs, see [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/).
- To use agents and tools in workflow automation, see [Automating workflows]({{site.url}}{{site.baseurl}}/automating-workflows/index/).