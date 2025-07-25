---
layout: default
title: Agents and tools
has_children: true
has_toc: false
nav_order: 27
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/index/
---

# Agents and tools
**Introduced 2.13**
{: .label .label-purple }

You can automate machine learning (ML) tasks using agents and tools. An _agent_ orchestrates and runs ML models and tools. A _tool_ performs a set of specific tasks. Some examples of tools are the `VectorDBTool`, which supports vector search, and the `CATIndexTool`, which executes the `cat indices` operation. For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).

## Agents

An _agent_ is a coordinator that uses a large language model (LLM) to solve a problem. After the LLM reasons and decides what action to take, the agent coordinates the action execution. OpenSearch supports the following agent types:

- [_Flow agent_](#flow-agents): Runs tools sequentially, in the order specified in its configuration. The workflow of a flow agent is fixed. Useful for retrieval-augmented generation (RAG).
- [_Conversational flow agent_](#conversational-flow-agents): Runs tools sequentially, in the order specified in its configuration. The workflow of a conversational flow agent is fixed. Stores conversation history so that users can ask follow-up questions. Useful for creating a chatbot.
- [_Conversational agent_](#conversational-agents): Reasons in order to provide a response based on the available knowledge, including the LLM knowledge base and a set of tools provided to the LLM. The LLM reasons iteratively to decide what action to take until it obtains the final answer or reaches the iteration limit. Stores conversation history so that users can ask follow-up questions. The workflow of a conversational agent is variable, based on follow-up questions. For specific questions, uses the Chain-of-Thought (CoT) process to select the best tool from the configured tools for providing a response to the question. Useful for creating a chatbot that employs RAG.

### Flow agents

A flow agent is configured with a set of tools that it runs in order. For example, the following agent runs the `VectorDBTool` and then the `MLModelTool`. The agent coordinates the tools so that one tool's output can become another tool's input. In this example, the `VectorDBTool` queries the k-NN index and the agent passes its output `${parameters.VectorDBTool.output}` to the `MLModelTool` as context, along with the `${parameters.question}` (see the `prompt` parameter):

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
        "model_id": "YOUR_TEXT_EMBEDDING_MODEL_ID",
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
        "model_id": "YOUR_LLM_MODEL_ID",
        "prompt": "\n\nHuman:You are a professional data analyst. You will always answer a question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say you don't know. \n\n Context:\n${parameters.VectorDBTool.output}\n\nHuman:${parameters.question}\n\nAssistant:"
      }
    }
  ]
}
```

### Conversational flow agents

Similarly to a flow agent, a conversational flow agent is configured with a set of tools that it runs in order. The difference between them is that a conversational flow agent stores the conversation in an index, in the following example, the `conversation_index`. The following agent runs the `VectorDBTool` and then the `MLModelTool`:

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
        "model_id": "YOUR_TEXT_EMBEDDING_MODEL_ID",
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
        "model_id": "YOUR_LLM_MODEL_ID",
        "prompt": """

Human:You are a professional data analyst. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. 

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

### Conversational agents

Similarly to a conversational flow agent, a conversational agent stores the conversation in an index, in the following example, the `conversation_index`. A conversational agent can be configured with an LLM and a set of supplementary tools that perform specific jobs. For example, you can set up an LLM and a `CATIndexTool` when configuring an agent. When you send a question to the model, the agent also includes the `CATIndexTool` as context. The LLM then decides whether it needs to use the `CATIndexTool` to answer questions like "How many indexes are in my cluster?" The context allows an LLM to answer specific questions that are outside of its knowledge base. For example, the following agent is configured with an LLM and a `CATIndexTool` that retrieves information about your OpenSearch indexes:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_ReAct_ClaudeV2",
  "type": "conversational",
  "description": "this is a test agent",
  "llm": {
    "model_id": "YOUR_LLM_MODEL_ID",
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
        "model_id": "YOUR_TEXT_EMBEDDING_MODEL_ID",
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

It is important to provide thorough descriptions of the tools so that the LLM can decide in which situations to use those tools.
{: .tip}

## Next steps

- For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
- For a step-by-step tutorial, see [Agents and tools tutorial]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents-tools-tutorial/).
- For supported APIs, see [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/).
- To use agents and tools in configuration automation, see [Automating configurations]({{site.url}}{{site.baseurl}}/automating-configurations/index/).
