---
layout: default
title: Agents
parent: Agents and tools
has_children: true
has_toc: false
nav_order: 10
redirect_from: 
  - /ml-commons-plugin/agents-tools/agents/
---

# Agents
**Introduced 2.13**
{: .label .label-purple }

An _agent_ is a coordinator that uses a large language model (LLM) to solve a problem. After the LLM reasons and decides what action to take, the agent coordinates the action execution. OpenSearch supports the following agent types:

- [_Flow agent_]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/flow/): Runs tools sequentially, in the order specified in its configuration. The workflow of a flow agent is fixed. Useful for retrieval-augmented generation (RAG).
- [_Conversational flow agent_]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/conversational-flow/): Runs tools sequentially, in the order specified in its configuration. The workflow of a conversational flow agent is fixed. Stores conversation history so that users can ask follow-up questions. Useful for creating a chatbot.
- [_Conversational agent_]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/conversational/): Reasons in order to provide a response based on the available knowledge, including the LLM knowledge base and a set of tools provided to the LLM. The LLM reasons iteratively to decide what action to take until it obtains the final answer or reaches the iteration limit. Stores conversation history so that users can ask follow-up questions. The workflow of a conversational agent is variable, based on follow-up questions. For specific questions, uses the Chain-of-Thought (CoT) process to select the best tool from the configured tools for providing a response to the question. Useful for creating a chatbot that employs RAG.
- [_Plan-execute-reflect agent_]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/plan-execute-reflect/): Dynamically plans, executes, and refines multi-step workflows to solve complex tasks. Internally, a plan-execute-reflect agent uses a conversational agent to execute each individual step in the plan. The agent automatically selects the most appropriate tool for each step based on tool descriptions and context. Ideal for long-running, exploratory processes that benefit from iterative reasoning and adaptive execution. Useful for conducting research or performing root cause analysis (RCA).
- [_AG-UI agent_]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/ag-ui/): Follows the AG-UI protocol for integrating AI agents with frontend applications. Enables seamless communication between OpenSearch and UIs by accepting frontend context and tools, allowing the agent to interact directly with UI components and application state. Useful for interactive dashboards.

## Creating agents

You can create agents using two registration methods: the regular registration method or the unified registration method.

### Regular registration method

The regular registration method uses the [Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/) and requires multiple steps to create an agent:

1. **Register a connector**: Create a connector with complex JSON configuration including a `request_body` and `url` parameters.
2. **Register a model**: Create a model that manually references the `connector_id` from Step 1.
3. **Register an agent**: Create the agent by providing the `model_id`, configuring the `_llm_interface` parameter, and mapping `question` to `prompt`.
4. **Execute the agent**: Execute the agent with limited text-based `question` parameter only.

### Unified registration method
**Introduced 3.5**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

The Unified Agent API streamlines agent creation and execution by automating connector and model setup, significantly reducing the complexity of working with agents in OpenSearch. The Unified Agent API registers an agent in a single API call by automatically handling model group creation, connector configuration, and model registration based on the `model` block configuration:

1. **Register an agent** (connector and model are created automatically).
2. **Execute the agent** using the `input` field.

The unified registration method differs from the regular registration method in the following ways.

| Aspect | Regular registration method | Unified registration method |
| :--- | :--- | :--- |
| **Workflow steps** | 1. Register connector<br>2. Register model<br>3. Register agent<br>4. Execute with `question` parameter | 1. Register agent (automatic connector/model creation)<br>2. Execute with flexible `input` field |
| **Configuration complexity** | Manual connector configuration with request bodies, URLs, and parameter mappings | Automatic configuration with built-in validation and defaults |
| **Model setup** | Requires separate model registration before agent creation | Creates model resources automatically during agent registration |
| **Model reference** | Uses `llm.model_id` to reference pre-registered models | Uses `model` block with provider credentials and configuration |
| **LLM interface** | Manual `_llm_interface` parameter configuration | Automatic `_llm_interface` detection from `model_provider` |
| **Input capabilities** | Limited to text-based `question` parameter | Supports multimodal inputs (text, images, messages) through enhanced execution API |

#### Supported models

The following models are supported:

- **Amazon Bedrock Converse API** with Anthropic Claude models
- **Google Gemini** models
- **OpenAI** models

#### Prerequisites

The Unified Agent API is disabled by default. To enable it, update the following cluster setting:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.unified_agent_api_enabled": true
  }
}
```
{% include copy-curl.html %}

If you plan to use Model Context Protocol (MCP) connectors with your unified agents, also enable MCP connector support:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.mcp_connector_enabled": true
  }
}
```
{% include copy-curl.html %}

#### Example

The following example demonstrates the unified registration method.

**Step 1: Register an agent**

```json
POST /_plugins/_ml/agents/_register
{
  "name": "My Conversational Agent",
  "type": "conversational",
  "description": "A conversational agent using OpenAI GPT-4",
  "model": {
    "model_id": "gpt-4",
    "model_provider": "openai/v1/chat/completions",
    "credentials": {
      "openai_key": "sk-your-api-key"
    },
    "parameters": {
      "max_tokens": 1000,
      "temperature": 0.7
    }
  }
}
```
{% include copy-curl.html %}

For complete registration details, field definitions, and examples for all model providers, see [Unified agent registration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/#unified-agent-registration). 

**Step 2: Execute the agent**

```json
POST /_plugins/_ml/agents/{agent_id}/_execute
{
  "input": "What tools do you have access to?"
}
```
{% include copy-curl.html %}

For execution details and input format specifications, see [Unified agent execution]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-agent/#unified-agent-execution).

#### Limitations

The following limitations apply to the experimental release:

- **Agent types**: Only `conversational`, `plan_execute_and_reflect`, and `AG_UI` agents are supported.
- **Message format**: The `plan_execute_and_reflect` agent does not support message-based input because of its internal prompt structure.

The Unified Agent API is fully backward compatible with existing agents. Agents created using the regular registration method continue to function normally. You can use both registration methods in the same cluster.

Agents created using the Unified Agent API cannot be updated to use the regular registration method parameters.
{: .note}

## Hidden agents
**Introduced 2.13**
{: .label .label-purple }

To hide agent details from end users, including the cluster admin, you can register a _hidden_ agent. If an agent is hidden, non-superadmin users don't have permission to call any [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/index/), except for the [Execute API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-agent/), on the agent.

Only superadmin users can register a hidden agent. To register a hidden agent, you first need to authenticate with an [admin certificate]({{site.url}}{{site.baseurl}}/security/configuration/tls/#configuring-admin-certificates):

```bash
curl -k --cert ./kirk.pem --key ./kirk-key.pem -XGET 'https://localhost:9200/.opendistro_security/_search'
```
{% include copy.html %}

All agents created by a superadmin user are automatically registered as hidden. Only the superadmin user can view hidden agent details and delete hidden agents.
To register a hidden agent, send a request to the `_register` endpoint:

```bash
curl -k --cert ./kirk.pem --key ./kirk-key.pem -X POST 'https://localhost:9200/_plugins/_ml/agents/_register' -H 'Content-Type: application/json' -d '
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
}'
```
{% include copy.html %}

## Next steps

- To learn more about registering agents, see [Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/).
- For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
- For a step-by-step tutorial, see [Agents and tools tutorial]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents-tools-tutorial/).
- For a step-by-step tutorial on using a plan-execute-reflect agent, see [Building a plan-execute-reflect agent]({{site.url}}{{site.baseurl}}/tutorials/gen-ai/agents/build-plan-execute-reflect-agent/).
- For supported APIs, see [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/).
- To use agents and tools in configuration automation, see [Automating configurations]({{site.url}}{{site.baseurl}}/automating-configurations/index/).
