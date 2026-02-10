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

Starting with OpenSearch 3.5, agents created using the [Unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method) support a standardized `input` field that accepts plain text, multimodal content, or message-based conversations. This requires the `plugins.ml_commons.unified_agent_api_enabled` cluster setting to be enabled.
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
`parameters`| Object | Optional | The parameters required by the agent. Any agent parameters configured during registration can be overridden using this field. Use with [regular registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/).
`parameters.question`| String | Optional | The question to ask the agent. Use with [regular registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent/).
`parameters.verbose`| Boolean | Optional | Provides verbose output.
`parameters.memory_id` | String | Optional | The memory session ID used to continue an existing conversation. This field is supported for conversational memory backends, including `conversation_index` and `agentic_memory`. To start a new session, omit this parameter.
`parameters.memory_container_id` | String | Optional | Overrides the configured memory container for this execution when the agent uses `agentic_memory`.
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

## Unified agent execution
**Introduced 3.5**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

For agents created using the [unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method), use the `input` field. Unified agent execution introduces a flexible `input` field that supports three input formats:

1. **Plain text**: Simple string input for basic text interactions.
2. **Content blocks**: Text, images, video, and documents with Base64 encoding or URL sources.
3. **Messages format**: Role-based conversation history with multimodal content blocks for complex interactions.

### Plain text input

For simple text prompts, pass a string directly to the `input` field:

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
| `text` | Plain text content | `text`: The text string |
| `image` | Image data | `source.type`: `base64` or `url`<br>`source.format`: Image format (e.g., `png`, `jpeg`)<br>`source.data`: Base64-encoded image data or URL |

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

Each message is stored in the agent's memory. The `content` field within each message supports multimodal content blocks.

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

For more information about the unified registration method and input formats, see [Unified registration method]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/#unified-registration-method).
