---
layout: default
title: Conversational agents
has_children: false
has_toc: false
nav_order: 30
parent: Agents
grand_parent: Agents and tools
---

# Conversational agents
**Introduced 2.13**
{: .label .label-purple }

A conversational agent uses a large language model (LLM) and a set of supplementary tools to reason iteratively and provide a response. The agent selects the best tool for each question using the Chain-of-Thought (CoT) process and stores conversation history so that users can ask follow-up questions. Starting with OpenSearch 3.0, conversational agents use [function calling]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/#request-body-fields) to invoke tools, replacing the earlier ReAct prompt-based approach. 

OpenSearch provides two types of conversational agents:

- **[The `conversational_v2` agent](#the-conversational_v2-agent-with-full-multimodal-support)** (OpenSearch 3.6 and later, experimental): An enhanced agent with built-in multimodal support through a standardized interface. Requires the [unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method) and [agentic memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/).

- **[The `conversational` agent (v1)](#the-conversational-agent-v1)** (OpenSearch 2.13 and later): Supports both the [unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method) (plain text input only) and the [regular registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#regular-registration-method) (connector-dependent capabilities). Supports both `conversation_index` and `agentic_memory` memory types.

## The `conversational_v2` agent with full multimodal support
**Introduced 3.6**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/ml-commons/issues/4552).
{: .warning}

A `conversational_v2` agent extends the `conversational` agent by providing built-in multimodal support through the [unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method), without requiring custom connector configuration. Unlike `conversational` agents, which accept only plain text input when using the unified registration method, the `conversational_v2` agents support the following input formats:

- **Plain text**: A simple string input.
- **Content blocks**: Multimodal arrays containing text, images, and documents.
- **Messages**: Full conversation history with roles and multimodal content blocks for multi-turn interactions.

The agent returns a response that includes the stop reason, the assistant's message, the memory session ID, and token usage metrics. The `conversational_v2` agents require the `agentic_memory` memory type.

### Prerequisites

The `conversational_v2` agent uses the [unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method) and requires the unified agent API to be enabled. For setup instructions, see [Prerequisites]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#prerequisites).

### Registering a `conversational_v2` agent

To register a `conversational_v2` agent, follow these steps.

**Step 1: Create a memory container**

Before registering a `conversational_v2` agent, create a memory container using the [Create Memory Container API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/):

```json
POST /_plugins/_ml/memory_containers/_create
{
  "name": "my-agent-memory"
}
```
{% include copy-curl.html %}

This creates a memory container with default settings. Depending on your use case, you may want to configure additional options such as `disable_session`, `embedding_model_id`, or memory strategies. For all available options, see [Create Memory Container API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container/).

The response returns a `memory_container_id` that you use when registering the agent:

```json
{
  "memory_container_id": "SdjmmpgBOh0h20Y9kWuN",
  "status": "created"
}
```

**Step 2: Register the agent**

To register the agent, send the following request:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "My Conversational Agent V2",
  "type": "conversational_v2",
  "description": "A multimodal conversational agent",
  "model": {
    "model_id": "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    "model_provider": "bedrock/converse",
    "credential": {
      "access_key": "<YOUR_AWS_ACCESS_KEY>",
      "secret_key": "<YOUR_AWS_SECRET_KEY>",
      "session_token": "<YOUR_SESSION_TOKEN>"
    }
  },
  "memory": {
    "type": "agentic_memory",
    "memory_container_id": "<YOUR_MEMORY_CONTAINER_ID>"
  },
  "tools": [
    {
      "type": "ListIndexTool"
    }
  ]
}
```
{% include copy-curl.html %}

### Executing a `conversational_v2` agent

The `conversational_v2` agents use the `input` field and support the following input formats:

- **Plain text input**:

    ```json
    POST /_plugins/_ml/agents/<agent_id>/_execute
    {
      "input": "What indexes are in my cluster?"
    }
    ```
    {% include copy-curl.html %}

- **Multimodal content block input**:

    ```json
    POST /_plugins/_ml/agents/<agent_id>/_execute
    {
      "input": [
        {
          "type": "text",
          "text": "What can you see in this image?"
        },
        {
          "type": "image",
          "source": {
            "type": "base64",
            "format": "png",
            "data": "iVBORw0KGgoAAAANSUhEUgAA..."
          }
        }
      ]
    }
    ```
    {% include copy-curl.html %}

- **Message input** (multi-turn conversation history):

    ```json
    POST /_plugins/_ml/agents/<agent_id>/_execute
    {
      "input": [
        {
          "role": "user",
          "content": [{"type": "text", "text": "I like the color red"}]
        },
        {
          "role": "assistant",
          "content": [{"type": "text", "text": "Thanks for sharing that!"}]
        },
        {
          "role": "user",
          "content": [{"type": "text", "text": "What color do I like?"}]
        }
      ]
    }
    ```
    {% include copy-curl.html %}

### The `conversational_v2` agent response format

The `conversational_v2` agent returns a standardized response format:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "stop_reason": "end_turn",
            "message": {
              "role": "assistant",
              "content": [
                {
                  "text": "Based on your cluster, I found the following indexes..."
                }
              ]
            },
            "memory_id": "test_memory_id",
            "metrics": {
              "total_usage": {
                "inputTokens": 1234,
                "outputTokens": 567,
                "totalTokens": 1801
              }
            }
          }
        }
      ]
    }
  ]
}
```

For the `conversational_v2` agent response fields, see [The `conversational_v2` agent response format]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/execute-agent/#the-conversational_v2-agent-response-format).

### Limitations

The following limitations apply to the `conversational_v2` agent:

- **Memory type**: Only `agentic_memory` is supported. The `conversation_index` memory type is not compatible with `conversational_v2` agents.
- **Streaming**: Streaming responses are not supported.
- **Hooks and context management**: Agent execution hooks and context management are not supported.

## The `conversational` agent (v1)

The `conversational` agent supports two registration methods, each with different capabilities:

- **[Unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method)**: Accepts only plain text input. Uses the `model` field for LLM configuration.
- **[Regular registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#regular-registration-method)**: Input capabilities depend on connector configuration. Uses the `llm` field for LLM configuration. Multimodal input is supported if you configure the connector to pass multimodal content to the LLM.

For full multimodal support through a standardized interface, use the [`conversational_v2` agent](#the-conversational_v2-agent-with-full-multimodal-support).
{: .note}

A `conversational` agent can be configured with a large language model (LLM) and a set of supplementary tools that perform specific jobs. For example, you can set up an LLM and a `ListIndexTool`. When you send a question to the model, the agent includes the `ListIndexTool` as context. The LLM then decides whether it needs to use the tool to answer questions like "How many indexes are in my cluster?" This allows the LLM to answer questions outside of its knowledge base.

### Using the unified registration method

The following example registers a `conversational` agent using the unified registration method:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "My Conversational Agent",
  "type": "conversational",
  "description": "A conversational agent using unified registration",
  "model": {
    "model_id": "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    "model_provider": "bedrock/converse",
    "credential": {
      "access_key": "<YOUR_AWS_ACCESS_KEY>",
      "secret_key": "<YOUR_AWS_SECRET_KEY>",
      "session_token": "<YOUR_SESSION_TOKEN>"
    }
  },
  "memory": {
    "type": "conversation_index"
  },
  "tools": [
    {
      "type": "ListIndexTool"
    }
  ]
}
```
{% include copy-curl.html %}

### Using the regular registration method

The following example registers a `conversational` agent using the regular registration method:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_ReAct_ClaudeV2",
  "type": "conversational",
  "description": "This is a test agent",
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
      "description": "A tool to search OpenSearch index with natural language question. If you don't know answer for some question, you should always try to search data with this tool. Action Input: <natural language question>",
      "parameters": {
        "model_id": "YOUR_TEXT_EMBEDDING_MODEL_ID",
        "index": "my_test_data",
        "embedding_field": "embedding",
        "source_field": [ "text" ],
        "input": "${parameters.question}"
      }
    },
    {
      "type": "ListIndexTool",
      "name": "ListIndexTool",
      "description": "Use this tool to get OpenSearch index information: (health, status, index, uuid, primary count, replica count, docs.count, docs.deleted, store.size, primary.store.size)."
    }
  ],
  "app_type": "my app"
}
```
{% include copy-curl.html %}

## Next steps

- To learn more about registering agents, see [Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/).
- For a list of supported tools, see [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
- For a step-by-step tutorial, see [Agents and tools tutorial]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents-tools-tutorial/).
- For supported APIs, see [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/).
- To use agents and tools in configuration automation, see [Automating configurations]({{site.url}}{{site.baseurl}}/automating-configurations/index/).
