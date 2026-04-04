---
layout: default
title: Execute agent
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 20
---

# Execute Agent API
**Introduced 2.13**
{: .label .label-purple }

When an agent is executed, it runs the tools with which it is configured. Starting with OpenSearch version 3.0, you can execute an agent asynchronously by setting the `async` query parameter to `true`.

Starting with OpenSearch 3.5, agents created using the [unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method) support a standardized `input` field that accepts plain text, multimodal content, or message-based conversations. This requires the `plugins.ml_commons.unified_agent_api_enabled` cluster setting to be enabled.
{: .note}

### Endpoints

```json
POST /_plugins/_ml/agents/<agent_id>/_execute
```

## Query parameters

The following table lists the available query parameters.

Parameter | Data type | Required/Optional | Description
:---  | :--- | :--- 
`async` | Boolean | Optional | If `true`, executes the agent asynchronously and returns a `task_id` to track execution. To check the status of the task, use the [Get ML Task API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/). Default is `false`.

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- | :---
`parameters`| Object | Optional | The parameters required by the agent. Any agent parameters configured during registration can be overridden using this field. Use with the [regular registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/).
`parameters.question`| String | Optional | The question to ask the agent. Use with the [regular registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/).
`parameters.verbose`| Boolean | Optional | Provides verbose output.
`parameters.memory_id` | String | Optional | The memory session ID used to continue an existing conversation. This field is supported for conversational memory backends, including `conversation_index` and `agentic_memory`. To start a new session, omit this parameter.
`parameters.memory_container_id` | String | Optional | Overrides the configured memory container for this execution when the agent uses `agentic_memory`.
`parameters.include_token_usage` | Boolean | Optional | When set to `true`, includes a `token_usage` tensor in the response containing detailed token consumption metrics for each LLM call. Supported for conversational, Plan-Execute-Reflect, and AG-UI agents. Default is `false`. **Introduced 3.6**
`input` | String or Array | Optional | A standardized input field supporting plain text, multimodal content blocks, or message-based conversations. Use with the [unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method).

> When `conversation_index` or `agentic_memory` is configured, the response includes a `memory_id`. To continue the same session, include the `memory_id` in subsequent requests. Omit the `memory_id` to start a new session.
>
> When using `agentic_memory`, you must also provide a memory container ID. Specify it either during agent registration (`memory.memory_container_id`) or in each request (`parameters.memory_container_id`). If a memory container ID is not provided, the request fails.
{: .note}

## Regular agent execution

For agents created using the regular registration method (the [Register Agent API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/) multi-step process), use the `parameters` field:

```json
POST /_plugins/_ml/agents/879v9YwBjWKCe6Kg12Tx/_execute
{
  "parameters": {
    "question": "what's the population increase of Seattle from 2021 to 2023"
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "inference_results": [
    {
      "output": [
        {
          "result": """ Based on the given context, the key information is:

The metro area population of Seattle in 2021 was 3,461,000.
The metro area population of Seattle in 2023 is 3,519,000.

To calculate the population increase from 2021 to 2023:

Population in 2023 (3,519,000) - Population in 2021 (3,461,000) = 58,000

Therefore, the population increase of Seattle from 2021 to 2023 is 58,000."""
        }
      ]
    }
  ]
}
```

## Token usage tracking
**Introduced 3.6**
{: .label .label-purple }

When `include_token_usage` is set to `true`, the response includes detailed token consumption metrics that help you monitor costs, debug performance, and compare model efficiency. The response includes a `token_usage` output containing:

- **`per_turn_usage`**: An array of token usage records for each LLM call during agent execution. Each record includes `turn` (the sequence number), `model_id`, `model_name`, `model_url`, `input_tokens`, `output_tokens`, `total_tokens`, and provider-specific fields such as cache tokens (Bedrock, OpenAI, Gemini) and reasoning tokens (OpenAI, Gemini).
- **`per_model_usage`**: Aggregated token usage grouped by model. Each record includes `model_id`, `model_name`, `model_url`, `call_count` (number of LLM calls), `input_tokens`, `output_tokens`, `total_tokens`, and the same provider-specific fields as per-turn usage.

### Token usage fields

The following table lists the token usage fields.

Field | Data type | Description
:---  | :--- | :---
`input_tokens` | Integer | The number of tokens in the input/prompt sent to the model.
`output_tokens` | Integer | The number of tokens in the model's output/completion.
`total_tokens` | Integer | The total number of tokens (input + output).
`cache_read_input_tokens` | Integer | The number of input tokens served from the prompt cache. Supported by Anthropic (via Bedrock), OpenAI, and Gemini. Cached tokens are typically cheaper than regular input tokens.
`cache_creation_input_tokens` | Integer | The number of tokens used to create new cache entries. Supported by Anthropic (via Bedrock).
`reasoning_tokens` | Integer | The number of tokens used for reasoning/thinking. Only extracted for OpenAI models (from `completion_tokens_details.reasoning_tokens`) and Gemini models (from `thoughtsTokenCount`). Not extracted for Bedrock models.
`turn` | Integer | The sequence number of this LLM call within the agent execution (present in `per_turn_usage`).
`call_count` | Integer | The total number of LLM calls made using this model (present in `per_model_usage`).
`model_id` | String | The internal OpenSearch model ID.
`model_name` | String | The human-readable model name (for example, `Sonnet 4`, `GPT-4`).
`model_url` | String | The endpoint URL for the model service.

### Example request with token usage
**Introduced 3.6**
{: .label .label-purple }

To receive detailed token usage metrics in the response, set `include_token_usage` to `true`:

```json
POST /_plugins/_ml/agents/879v9YwBjWKCe6Kg12Tx/_execute
{
  "parameters": {
    "question": "what's the population increase of Seattle from 2021 to 2023",
    "include_token_usage": true
  }
}
```
{% include copy-curl.html %}

### Example response with token usage

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": """ Based on the given context, the key information is:

The metro area population of Seattle in 2021 was 3,461,000.
The metro area population of Seattle in 2023 is 3,519,000.

To calculate the population increase from 2021 to 2023:

Population in 2023 (3,519,000) - Population in 2021 (3,461,000) = 58,000

Therefore, the population increase of Seattle from 2021 to 2023 is 58,000."""
        },
        {
          "name": "token_usage",
          "dataAsMap": {
            "per_turn_usage": [
              {
                "turn": 1,
                "model_id": "rk6okJwB_kOxOUbO6853",
                "model_name": "Sonnet 4",
                "model_url": "https://bedrock-runtime.us-east-1.amazonaws.com/model/us.anthropic.claude-sonnet-4-20250514-v1:0/converse",
                "input_tokens": 1042,
                "output_tokens": 69,
                "total_tokens": 1111,
                "cache_read_input_tokens": 0,
                "cache_creation_input_tokens": 0
              },
              {
                "turn": 2,
                "model_id": "rk6okJwB_kOxOUbO6853",
                "model_name": "Sonnet 4",
                "model_url": "https://bedrock-runtime.us-east-1.amazonaws.com/model/us.anthropic.claude-sonnet-4-20250514-v1:0/converse",
                "input_tokens": 1541,
                "output_tokens": 269,
                "total_tokens": 1810,
                "cache_read_input_tokens": 0,
                "cache_creation_input_tokens": 0
              }
            ],
            "per_model_usage": [
              {
                "model_id": "rk6okJwB_kOxOUbO6853",
                "model_name": "Sonnet 4",
                "model_url": "https://bedrock-runtime.us-east-1.amazonaws.com/model/us.anthropic.claude-sonnet-4-20250514-v1:0/converse",
                "call_count": 2,
                "input_tokens": 2583,
                "output_tokens": 338,
                "total_tokens": 2921,
                "cache_read_input_tokens": 0,
                "cache_creation_input_tokens": 0
              }
            ]
          }
        }
      ]
    }
  ]
}
```

## Unified agent execution
**Introduced 3.5**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

For agents created using the [unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method), use the `input` field. The supported input formats depend on the agent type:

- **`conversational` and other V1 agent types**: Support plain text input only.
- **`conversational_v2`** (Introduced 3.6): Supports all three input formats — plain text, multimodal content blocks, and message-based conversations.

### Plain text input

All unified agents support plain text input. For simple text prompts, pass a string directly to the `input` field:

```json
POST /_plugins/_ml/agents/<agent_id>/_execute
{
  "input": "What tools do you have access to?"
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "inference_results": [
    {
      "output": [
        {
          "result": "I have access to the following tools:\n\n1. ListIndexTool - Lists all indices in the cluster\n2. SearchIndexTool - Searches within OpenSearch indices\n3. IndexMappingTool - Retrieves index mapping information"
        }
      ]
    }
  ]
}
```

### Multimodal content blocks

When using the [unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method), multimodal content block and message-based inputs require a `conversational_v2` agent. All other unified agent types accept only plain text input. When using the [regular registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#regular-registration-method), multimodal support is possible if the connector is configured to pass multimodal content to the LLM, with the input format determined by the connector configuration.
{: .note}

For multimodal inputs (text, images, documents), use an array of content blocks:

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

#### Supported content types

The following table lists the supported content types.

| Content type | Description | Fields |
| :--- | :--- | :--- |
| `text` | Plain text content | `text`: The text string.|
| `image` | Image data | `image.type`: The source type. Valid value is `base64`. <br>`image.format`: The image format (for example, `jpeg`, `png`, `gif`, or `webp`).<br>`image.data`: Base64-encoded image data. |
| `video` | Video data | `video.type`: The source type. Valid value is `base64`. <br>`video.format`: The video format (for example, `mp4`, `mov`, or `avi`).<br>`video.data`: Base64-encoded video data. |
| `document` | Document data | `document.type`: The source type. Valid value is `base64`. <br>`document.format`: The document format (for example, `pdf`, `docx`, or `txt`).<br>`document.data`: Base64-encoded document data. |

### Message-based conversations

For multi-turn conversations, provide an array of messages with roles:

```json
POST /_plugins/_ml/agents/<agent_id>/_execute
{
  "input": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "I like the color red"
        }
      ]
    },
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "Thanks for telling me that! I'll remember it."
        }
      ]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What color do I like?"
        }
      ]
    }
  ]
}
```
{% include copy-curl.html %}

These messages are stored in the agent's memory. 

#### Message fields

The following table lists the supported message fields.

| Field | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `role` | String | Required | The message role. Valid values: `user`, `assistant`. |
| `content` | Array | Required | An array of content blocks (text, image, and so on). |

#### Conversation example response

The agent remembers context from previous messages:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "memory_id",
          "result": "iEgpJZwBZx9B0F4spD5v"
        },
        {
          "name": "parent_interaction_id",
          "result": "ikgpJZwBZx9B0F4spT61"
        },
        {
          "name": "response",
          "result": "You like the color red, which you mentioned earlier in our conversation."
        }
      ]
    }
  ]
}
```

### The `conversational_v2` agent response format

The `conversational_v2` agents return the following standardized response format:

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
                  "text": "Here is what I found..."
                }
              ]
            },
            "memory_id": "abc123xyz",
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

The following table lists the `conversational_v2` agent response fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `stop_reason` | String | The reason the agent stopped generating a response. Valid values are `end_turn` (normal completion), `max_iterations` (iteration limit reached), and `tool_use` (stopped while invoking a tool). |
| `message` | Object | The assistant's final response message. |
| `message.role` | String | Always `assistant`. |
| `message.content` | Array | An array of content blocks containing the response text or other content. |
| `memory_id` | String | The memory session ID. Include this ID in subsequent requests in the `parameters.memory_id` field to continue the conversation. |
| `metrics.total_usage.inputTokens` | Integer | The number of input tokens consumed. |
| `metrics.total_usage.outputTokens` | Integer | The number of output tokens generated. |
| `metrics.total_usage.totalTokens` | Integer | The total number of tokens used. |

For more information about the unified registration method and input formats, see [Unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method).
