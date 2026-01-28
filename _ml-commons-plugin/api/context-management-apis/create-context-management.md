---
layout: default
title: Create context management
parent: Context management APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Create Context Management API
**Introduced 3.3**
{: .label .label-purple }

Use this API to create a [context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/context-management/#context-management) that defines teams of context managers to optimize agent context at specific execution points.

For detailed information about context management concepts, manager types, and use cases, see [Context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/context-management/).

## Endpoints

```json
POST /_plugins/_ml/context_management/<context_management_name>
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`context_management_name` | String | Required | The unique name for the context management.

## Request body fields

The following table lists the available request body fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`description` | String | Optional | A human-readable description of what this context management does.
`hooks` | Object | Required | A map of hook names to lists of context manager configurations. See [The `hooks` object](#the-hooks-object).

### The hooks object

The `hooks` object maps hook names to arrays of context manager configurations. Supported hooks:

- `pre_llm` -- Executes before sending requests to the LLM
- `post_tool` -- Executes after tool execution completes

Each hook contains an array of context manager configurations with the following fields:

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`type` | String | Required | The context manager type: `SlidingWindowManager`, `SummarizationManager`, or `ToolsOutputTruncateManager`.
`config` | Object | Required | Configuration specific to the context manager type. See [Context manager configurations](#context-manager-configurations).

### Context manager configurations

For detailed descriptions of each context manager type and their use cases, see [Context manager types]({{site.url}}{{site.baseurl}}/ml-commons-plugin/context-management/#context-manager-types).

#### SlidingWindowManager

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`max_messages` | Integer | Optional | Maximum number of messages to retain. Default is `20`.
`activation` | Object | Optional | Activation rules. See [Activation rules](#activation-rules).

#### SummarizationManager

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`summary_ratio` | Double | Optional | Ratio of messages to summarize (0.1-0.8). Default is `0.3`.
`preserve_recent_messages` | Integer | Optional | Number of recent messages to preserve. Default is `10`.
`summarization_model_id` | String | Optional | Model ID for summarization. Uses agent's model if not specified.
`summarization_system_prompt` | String | Optional | System prompt for summarization. Uses default if not specified.
`activation` | Object | Optional | Activation rules. See [Activation rules](#activation-rules).

#### ToolsOutputTruncateManager

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`max_output_length` | Integer | Optional | Maximum length of tool output to retain. Default is `40000`.
`activation` | Object | Optional | Activation rules. Default to always activate. See [Activation rules](#activation-rules).

### Activation rules

Activation rules determine when a context manager should execute. If omitted, the manager executes always. For detailed information, see [Activation rules]({{site.url}}{{site.baseurl}}/ml-commons-plugin/context-management/#activation-rules).

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`rule_type` | String | Optional | Set to `"always"` to always activate the manager.
`message_count_exceed` | Integer | Optional | Activates when message count exceeds this threshold.
`tokens_exceed` | Integer | Optional | Activates when token count exceeds this threshold.

Multiple rules use AND logic - all must be satisfied for activation.

## Example request: Basic sliding window template

```json
POST /_plugins/_ml/context_management/basic-sliding-window
{
  "description": "Basic sliding window context management",
  "hooks": {
    "pre_llm": [
      {
        "type": "SlidingWindowManager",
        "config": {
          "max_messages": 6,
          "activation": {
            "message_count_exceed": 12
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "context_management_name": "basic-sliding-window",
  "status": "created"
}
```


For more use cases and examples, see [Context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/context-management/).

