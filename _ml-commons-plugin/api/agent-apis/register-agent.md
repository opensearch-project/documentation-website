---
layout: default
title: Register agent
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Register Agent API
**Introduced 2.13**
{: .label .label-purple }

Use this API to register an agent. 

Agents may be of the following types:

- _Flow_ agent
- _Conversational flow_ agent
- _Conversational agent_
- _Plan-execute-reflect_ agent
- _AG-UI_ agent

For more information about agents, see [Agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/).

Starting with OpenSearch 3.5, you can use the [unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method) to register agents with automated connector and model creation. This experimental feature supports Amazon Bedrock Converse, Google Gemini, and OpenAI models and requires the `plugins.ml_commons.unified_agent_api_enabled` cluster setting to be enabled.
{: .note}

## Endpoints

```json
POST /_plugins/_ml/agents/_register
```

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Agent type | Description
:---  | :--- | :--- | :--- | :---
`name`| String | Required | All | The agent name. |
`type` | String | Required | All | The agent type. Valid values are [`flow`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/flow/), [`conversational_flow`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/conversational-flow/), [`conversational`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/conversational/), [`plan_execute_and_reflect`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/plan-execute-reflect/), and [`ag_ui`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/ag-ui/). For more information, see [Agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/). |
`description` | String | Optional| All | A description of the agent. |
`tools` | Array | Optional | All | A list of tools for the agent to execute. 
`app_type` | String | Optional | All | Specifies an optional agent category. You can then perform operations on all agents in the category. For example, you can delete all messages for RAG agents.
`memory.type` | String | Optional | `conversational_flow`, `conversational`, `plan_execute_and_reflect` | Specifies where to store the conversational memory. Supported values are `conversation_index` (store memory in conversation indexes) and `agentic_memory` (store memory in a memory container).
`memory.memory_container_id` | String | Optional | `conversational_flow`, `conversational`, `plan_execute_and_reflect` | The default memory container ID for `agentic_memory`. If omitted, you must provide a `parameters.memory_container_id` when executing the agent. If neither is provided, the request fails.
`llm.model_id` | String | Required | `conversational` | The model ID of the LLM to which to send questions.
`llm.parameters.response_filter` | String | Required | `conversational` | The pattern for parsing the LLM response. For each LLM, you need to provide the field where the response is located. For example, for the Anthropic Claude model, the response is located in the `completion` field, so the pattern is `$.completion`. For OpenAI models, the pattern is `$.choices[0].message.content`.
`llm.parameters.max_iteration` | Integer | Optional | `conversational` | The maximum number of messages to send to the LLM. Default is `10`.
`parameters` | Object | Optional | All | Agent parameters, which may be used to control the `max_steps` executed by the agent, modify default prompts, and so on.
`parameters.executor_agent_id`| Integer | Optional | `plan_execute_and_reflect` | The `plan_execute_and_reflect` agent internally uses a `conversational` agent to execute each step. By default, this executor agent uses the same model as the planning model specified in the `llm` configuration. To use a different model for executing steps, create a `conversational` agent using another model and pass the agent ID in this field. This can be useful if you want to use different models for planning and execution.
`parameters.max_steps` | Integer | Optional | `plan_execute_and_reflect` | The maximum number of steps executed by the LLM. Default is `20`.
`parameters.executor_max_iterations` | Integer | Optional | `plan_execute_and_reflect` | The maximum number of messages sent to the LLM by the executor agent. Default is `20`.
`parameters.message_history_limit` | Integer | Optional | `plan_execute_and_reflect` | The number of recent messages from conversation memory to include as context for the planner. Default is `10`. 
`parameters.executor_message_history_limit` | Integer | Optional | `plan_execute_and_reflect` | The number of recent messages from conversation memory to include as context for the executor. Default is `10`.
`parameters._llm_interface` | String | Required | `plan_execute_and_reflect`, `conversational` | Specifies how to parse the LLM output when using function calling. Valid values are: <br> - `bedrock/converse/claude`: Anthropic Claude conversational models hosted on Amazon Bedrock  <br> - `bedrock/converse/deepseek_r1`: DeepSeek-R1 models hosted on Amazon Bedrock <br> - `openai/v1/chat/completions`: OpenAI chat completion models hosted on OpenAI. Each interface defines a default response schema and function call parser.
`inject_datetime` | Boolean | Optional | `conversational`, `plan_execute_and_reflect` | Whether to automatically inject the current date into the system prompt. Default is `false`.
`datetime_format` | String | Optional | `conversational`, `plan_execute_and_reflect` | A format string for dates used when `inject_datetime` is enabled. Default is `"yyyy-MM-dd'T'HH:mm:ss'Z'"` (ISO format).
`model` | Object | Optional | `conversational`, `plan_execute_and_reflect` | **Unified registration method only (3.5+)**: Model configuration that automatically creates a connector and model. See [Unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method).
`model.model_id` | String | Required (if using `model`) | `conversational`, `plan_execute_and_reflect` | The model identifier (for example, `us.anthropic.claude-3-7-sonnet-20250219-v1:0` for Amazon Bedrock or `gemini-2.5-pro` for Google Gemini).
`model.model_provider` | String | Required (if using `model`) | `conversational`, `plan_execute_and_reflect` | The model provider. Supported values: `bedrock/converse`, `gemini/v1beta/generatecontent`, `openai/v1/chat/completions`.
`model.credential` | Object | Required (if using `model`) | `conversational`, `plan_execute_and_reflect` | Credentials for accessing the model. Accepts any credential format supported by connectors. For details, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints#configuration-parameters).
`model.model_parameters` | Object | Optional (if using `model`) | `conversational`, `plan_execute_and_reflect` | Model-specific parameters such as system prompts and other configuration options.

### Using agentic memory

To use agentic memory, create a memory container using the [Create Memory Container API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/) and set the memory configuration as follows:

```json
"memory": {
  "type": "agentic_memory",
  "memory_container_id": "<memory_container_id>"
}
```
{% include copy.html %}

For agents configured with `agentic_memory`, see [Inspecting memory data]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/#inspecting-memory-data-opensearch-agents) for information about inspecting session and trace data after agent execution.

### Tool configuration

The `tools` array contains a list of tools for the agent. Each tool contains the following fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :---
`type` | String | Required | The tool type. For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
`name`| String | Optional | The tool name. The tool name defaults to the `type` parameter value. If you need to include multiple tools of the same type in an agent, specify different names for the tools. |
`description`| String | Optional | The tool description. Defaults to a built-in description for the specified type. | 
`parameters` | Object | Optional | The parameters for this tool. The parameters are highly dependent on the tool type. You can find information about specific tool types in [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
`parameters.output_processors` | Array | Optional | A list of processors used to transform the tool's output. For more information, see [Processor chain]({{site.url}}{{site.baseurl}}/ml-commons-plugin/processor-chain/).
`attributes.input_schema` | Object | Optional | The expected input format for this tool defined as a [JSON schema](https://json-schema.org/). Used to define the structure the LLM should follow when calling the tool.
`attributes.strict` | Boolean | Optional | Whether function calling reliably adheres to the input schema or not.

## Example request: Flow agent

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

## Example request: Conversational flow agent

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

## Example request: Conversational agent

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
      "type": "ListIndexTool",
      "name": "RetrieveIndexMetaTool",
      "description": "Use this tool to get OpenSearch index information: (health, status, index, uuid, primary count, replica count, docs.count, docs.deleted, store.size, primary.store.size)."
    }
  ]
}
```
{% include copy-curl.html %}

## Example request: Plan-execute-reflect agent
**Introduced 3.0**
{: .label .label-purple }

```json
POST /_plugins/_ml/agents/_register
{
  "name": "My plan execute and reflect agent",
  "type": "plan_execute_and_reflect",
  "description": "this is a test agent",
  "llm": {
    "model_id": "<llm_model_id>",
    "parameters": {
      "prompt": "${parameters.question}"
    }
  },
  "memory": {
    "type": "conversation_index"
  },
  "parameters": {
    "_llm_interface": "<llm_interface>"
  },
  "tools": [
    {
      "type": "ListIndexTool"
    },
    {
      "type": "SearchIndexTool"
    },
    {
      "type": "IndexMappingTool"
    }
  ],
  "app_type": "os_chat"
}
```
{% include copy-curl.html %}

## Example request: AG-UI agent
**Introduced 3.5**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

AG-UI agents use the unified registration method for integrating AI agents with frontend applications. The following example shows the basic structure:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "AG-UI Agent",
  "type": "AG_UI",
  "description": "An AI agent designed for UI interactions with streaming support",
  "model": {
    "model_id": "<MODEL ID>",
    "model_provider": "bedrock/converse",
    "credential": {
      "access_key": "<AWS ACCESS KEY>",
      "secret_key": "<AWS SECRET KEY>",
      "session_token": "<AWS SESSION TOKEN>"
    },
    "model_parameters": {
      "system_prompt": "You are a helpful assistant and an expert in OpenSearch."
    }
  },
  "parameters": {
    "max_iteration": 5
  },
  "tools": [{
    "type": "ListIndexTool"
  }],
  "memory": {
    "type": "conversation_index"
  }
}
```
{% include copy-curl.html %}

For complete AG-UI agent documentation, including field definitions, prerequisites, execution examples, and the AG-UI protocol format, see [AG-UI agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/ag-ui/).

## Example response

OpenSearch responds with an agent ID that you can use to refer to the agent:

```json
{
  "agent_id": "bpV_Zo0BRhAwb9PZqGja"
}
```

## Unified agent registration
**Introduced 3.5**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

The unified registration method streamlines agent creation by automatically handling connector and model setup in a single API call. This method supports the Amazon Bedrock Converse API with Anthropic Claude models, Google Gemini models, and OpenAI models.

Before using unified agents, see [Prerequisites]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#prerequisites) for required cluster settings. For more information and supported agent types, see [Unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method).

### Unified registration request fields

The following table lists the available request fields for unified agent registration.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Required | The agent name. |
| `type` | String | Required | The agent type. Supported values: `conversational`, `plan_execute_and_reflect`, `AG_UI`. |
| `description` | String | Optional | A description of the agent. |
| `model` | Object | Required | Configuration for the LLM model using the unified registration method. Replaces the regular `llm` object and automatically creates model resources. |
| `model.model_id` | String | Required | The provider's model identifier. For Amazon Bedrock, use the full model ID (for example, `us.anthropic.claude-3-7-sonnet-20250219-v1:0`). For Google Gemini, use the model name (for example, `gemini-2.5-pro`). For OpenAI, use model names like `gpt-4`. |
| `model.model_provider` | String | Required | The model provider type. Valid values: `bedrock/converse`, `gemini/v1beta/generatecontent`, `openai/v1/chat/completions`. |
| `model.credential` | Object | Required | Credentials for the model provider. Structure depends on the provider. |
| `model.credential.access_key` | String | Required (Amazon Bedrock) | AWS access key for Amazon Bedrock models. |
| `model.credential.secret_key` | String | Required (Amazon Bedrock) | AWS secret key for Amazon Bedrock models. |
| `model.credential.session_token` | String | Optional (Amazon Bedrock) | AWS session token for Amazon Bedrock models when using temporary credentials. |
| `model.credential.openai_api_key` | String | Required (OpenAI) | API key for OpenAI models. |
| `model.credential.api_key` | String | Required (Google Gemini) | API key for Google Gemini models. |
| `model.model_parameters` | Object | Optional | Model-specific parameters and configuration. |
| `model.model_parameters.system_prompt` | String | Optional | The system prompt that defines the agent's role and behavior. |
| `model.model_parameters.temperature` | Float | Optional | Controls randomness in model responses (0.0 to 1.0). Default varies by model. |
| `model.model_parameters.max_tokens` | Integer | Optional | The maximum number of tokens in the model response. Default varies by model. |
| `parameters` | Object | Optional | Additional agent parameters for controlling behavior. |
| `parameters.max_iteration` | Integer | Optional | The maximum number of reasoning iterations the agent can perform. Default is 10. |
| `parameters.mcp_connectors` | Array | Optional | Array of Model Context Protocol (MCP) connector configurations that extend agent capabilities. |
| `parameters.mcp_connectors[].mcp_connector_id` | String | Required | The ID of a registered MCP connector. |
| `tools` | Array | Optional | Array of tools available to the agent. For supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/). |
| `memory` | Object | Optional | Configuration for conversation memory storage. |
| `memory.type` | String | Optional | The memory storage type. Supported values: `conversation_index`, `agentic_memory`. |

Each tool in the `tools` array contains the following fields.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `type` | String | Required | The tool type (for example, `ListIndexTool`, `SearchIndexTool`). |
| `name` | String | Optional | A custom name for the tool. Defaults to the `type` value. Required when using multiple tools of the same type. |
| `description` | String | Optional | Tool description that helps the LLM understand when and how to use the tool. |
| `parameters` | Object | Optional | Tool-specific parameters. Structure varies by tool type. |

### Example request: Amazon Bedrock Claude

This example creates an agent using an Anthropic Claude model hosted on Amazon Bedrock:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Claude Research Agent",
  "type": "conversational",
  "description": "An agent using Claude for research tasks",
  "model": {
    "model_id": "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    "model_provider": "bedrock/converse",
    "credential": {
      "access_key": "YOUR_AWS_ACCESS_KEY",
      "secret_key": "YOUR_AWS_SECRET_KEY",
      "session_token": "YOUR_AWS_SESSION_TOKEN"
    },
    "model_parameters": {
      "system_prompt": "You are a helpful research assistant with access to OpenSearch data.",
      "temperature": 0.7,
      "max_tokens": 1000
    }
  },
  "parameters": {
    "max_iteration": 5
  },
  "tools": [
    {
      "type": "ListIndexTool"
    },
    {
      "type": "SearchIndexTool"
    },
    {
      "type": "IndexMappingTool"
    }
  ],
  "memory": {
    "type": "conversation_index"
  }
}
```
{% include copy-curl.html %}

### Example request: Google Gemini

This example creates an agent using Google Gemini models:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Gemini Analysis Agent",
  "type": "conversational",
  "description": "An agent using Gemini for data analysis",
  "model": {
    "model_id": "gemini-2.5-pro",
    "model_provider": "gemini/v1beta/generatecontent",
    "credential": {
      "api_key": "YOUR_GEMINI_API_KEY"
    },
    "model_parameters": {
      "system_prompt": "You are an expert data analyst with access to OpenSearch indices."
    }
  },
  "tools": [
    {
      "type": "SearchIndexTool"
    }
  ],
  "memory": {
    "type": "conversation_index"
  }
}
```
{% include copy-curl.html %}

### Example request: OpenAI Chat Completion

This example creates an agent using OpenAI's GPT models:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "GPT Customer Service Agent",
  "type": "conversational",
  "description": "An agent using GPT for customer service tasks",
  "model": {
    "model_id": "gpt-4",
    "model_provider": "openai/v1/chat/completions",
    "credential": {
      "openai_api_key": "YOUR_OPENAI_API_KEY"
    },
    "model_parameters": {
      "system_prompt": "You are a helpful customer service agent with access to customer data.",
      "temperature": 0.3,
      "max_tokens": 800
    }
  },
  "parameters": {
    "max_iteration": 10
  },
  "tools": [
    {
      "type": "ListIndexTool"
    },
    {
      "type": "SearchIndexTool"
    }
  ],
  "memory": {
    "type": "conversation_index"
  }
}
```
{% include copy-curl.html %}

### Example request: Plan-execute-reflect agent

This example creates a plan-execute-reflect agent for complex multi-step tasks:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Research Planning Agent",
  "type": "plan_execute_and_reflect",
  "description": "An agent that can plan and execute complex research tasks",
  "model": {
    "model_id": "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    "model_provider": "bedrock/converse",
    "credential": {
      "access_key": "YOUR_AWS_ACCESS_KEY",
      "secret_key": "YOUR_AWS_SECRET_KEY",
      "session_token": "YOUR_AWS_SESSION_TOKEN"
    },
    "model_parameters": {
      "system_prompt": "You are an expert researcher who can plan and execute multi-step research tasks."
    }
  },
  "parameters": {
    "max_steps": 15,
    "max_iteration": 20
  },
  "tools": [
    {
      "type": "ListIndexTool"
    },
    {
      "type": "SearchIndexTool"
    },
    {
      "type": "IndexMappingTool"
    }
  ],
  "memory": {
    "type": "conversation_index"
  }
}
```
{% include copy-curl.html %}

## Related documentation

- For agents configured with `agentic_memory`, see [Inspecting memory data]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/).
