---
layout: default
title: Simplified agent interface (Experimental)
parent: Agents and tools
nav_order: 15
---

# Simplified agent interface (Experimental)
**Introduced 3.5**
{: .label .label-purple }
**Experimental release**
{: .label .label-red }

The simplified agent interface streamlines agent creation and execution by automating connector and model setup. This experimental feature significantly reduces the complexity of working with agents in OpenSearch.

This is an experimental release. Only Amazon Bedrock Converse Claude models are supported. The APIs and functionality may change in future releases.
{: .important}

## Enabling the simplified interface

The simplified agent interface is disabled by default. To use it, you must enable the following cluster setting:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.simplified_agent_registration_enabled": true
  }
}
```
{% include copy-curl.html %}

This setting must be enabled to:
- Register agents with automatic model creation (using the `model` field)
- Execute agents using the standardized `input` field

Without this setting enabled, you can only use the traditional agent workflow.
{: .note}

## Key improvements

The simplified interface provides the following improvements over the traditional agent workflow:

- **Automated setup**: Connectors and models are created automatically during agent registration
- **Simplified configuration**: No need to manually configure request bodies, URLs, or parameter mappings
- **Standardized input**: A single `input` field supports text, multimodal content, and message-based interactions
- **Reduced errors**: Built-in validation and defaults minimize configuration mistakes

## Supported models

Currently, only the following models are supported:

- Amazon Bedrock Converse API with Anthropic Claude models

Support for additional model providers and models will be added in future releases.

## Simplified agent registration

### Traditional workflow (before 3.5)

Previously, creating an agent required multiple manual steps:

1. Register a connector with detailed configuration
2. Register a model using the connector ID
3. Register an agent using the model ID

### Simplified workflow (3.5+)

With the simplified interface, you can register an agent in a single API call:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "My Claude Agent",
  "type": "conversational",
  "description": "A simplified agent using Claude",
  "model": {
    "model_id": "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    "model_provider": "bedrock/converse",
    "credential": {
      "access_key": "YOUR_ACCESS_KEY",
      "secret_key": "YOUR_SECRET_KEY",
      "session_token": "YOUR_SESSION_TOKEN"
    }
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

The connector and model are created automatically behind the scenes. The agent is immediately ready to use.

### Request fields

The following table lists the available request fields for simplified agent registration.

Field | Data type | Required/Optional | Description
:---  | :--- | :--- | :---
`name` | String | Required | The agent name.
`type` | String | Required | The agent type. Supported values: `conversational`, `plan_execute_and_reflect`.
`description` | String | Optional | A description of the agent.
`model` | Object | Required | Model configuration object.
`model.model_id` | String | Required | The model identifier. For Bedrock, use the full model ID (for example, `us.anthropic.claude-3-7-sonnet-20250219-v1:0`).
`model.model_provider` | String | Required | The model provider. Currently only `bedrock/converse` is supported.
`model.credential` | Object | Required | Credentials for accessing the model. Accepts any credential format supported by connectors. For details, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints#configuration-parameters).
`tools` | Array | Optional | A list of tools for the agent to use. See [Tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/).
`memory` | Object | Optional | Memory configuration for conversational context.
`memory.type` | String | Optional | Memory type. Supported values: `conversation_index`, `agentic_memory`.
`parameters` | Object | Optional | Additional agent parameters.

## Simplified agent execution

The simplified interface introduces a flexible `input` field that supports three input formats:

1. Plain text
2. Multimodal content blocks
3. Message-based conversations

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
          "result": "I have access to the following tools:\n\n1. ListIndexTool - Lists all indices in the cluster\n2. SearchIndexTool - Searches within OpenSearch indices"
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

Content type | Description | Fields
:--- | :--- | :---
`text` | Plain text content | `text`: The text string
`image` | Image data | `source.type`: `base64` or `url`<br>`source.format`: Image format (for example, `png`, `jpeg`)<br>`source.data`: Base64-encoded image data or URL

Support for additional content types (video, documents) will be added in future releases.

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

Field | Data type | Required/Optional | Description
:---  | :--- | :--- | :---
`role` | String | Required | The message role. Valid values: `user`, `assistant`.
`content` | Array | Required | An array of content blocks (text, image, and so on).

## Backward compatibility

The simplified interface is fully backward compatible with existing agents. Agents created using the traditional workflow continue to function normally. You can use both workflows in the same cluster.

However, agents created with the simplified interface cannot be updated to use the traditional workflow parameters.
{: .note}

## Limitations

The following limitations apply to the experimental release:

- **Model support**: Only Amazon Bedrock Converse Claude models are supported
- **Agent types**: Only `conversational` and `plan_execute_and_reflect` agents are supported
- **Message format**: The `plan_execute_and_reflect` agent does not support message-based input due to its internal prompt structure

## Next steps

- Learn about [agent types]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/)
- Explore available [tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/index/)
- Review the [Agent APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/)
