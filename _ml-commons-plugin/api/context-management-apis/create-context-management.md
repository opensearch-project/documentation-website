---
layout: default
title: Create context management
parent: Context management APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Create Context Management API
**Introduced 3.5**
{: .label .label-purple }

Use this API to configure [context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/context-management/) that defines teams of context managers to optimize agent context at specific execution points.

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

The `hooks` object maps hook names to arrays of context manager configurations. The following hooks are supported.

Hook | Description
:--- | :---
`pre_llm` | Executes before sending requests to the LLM.
`post_tool` | Executes after tool execution completes.

Each hook contains an array of context manager configurations with the following fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`type` | String | Required | The context manager type. Valid values are `SlidingWindowManager`, `SummarizationManager`, and `ToolsOutputTruncateManager`.
`config` | Object | Required | Configuration specific to the context manager type. See [Context manager configurations](#context-manager-configurations).

### Context manager configurations

The following context manager configurations are supported based on the context manager type.

#### SlidingWindowManager

The `SlidingWindowManager` supports the following parameters in the `config` object.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`max_messages` | Integer | Optional | The maximum number of messages to retain. Default is `20`.
`activation` | Object | Optional | The activation rules. Defaults to always activate. See [Activation rules](#activation-rules).

#### SummarizationManager

The `SummarizationManager` supports the following parameters in the `config` object.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`summary_ratio` | Double | Optional | The ratio of messages to summarize (0.1-0.8). Default is `0.3`.
`preserve_recent_messages` | Integer | Optional | The number of recent messages to preserve. Default is `10`.
`summarization_model_id` | String | Optional | A model ID for summarization. Uses the agent's model if not specified.
`summarization_system_prompt` | String | Optional | A system prompt for summarization. If not specified, the default system prompt is used.
`activation` | Object | Optional | The activation rules. Defaults to always activate. See [Activation rules](#activation-rules).

#### ToolsOutputTruncateManager

The `ToolsOutputTruncateManager` supports the following parameters in the `config` object.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`max_output_length` | Integer | Optional | The maximum length of tool output to retain. Default is `40000`.
`activation` | Object | Optional | The activation rules. Defaults to always activate. See [Activation rules](#activation-rules).

### Activation rules

Activation rules determine when a context manager should execute. If omitted, the manager always executes. Multiple rules use `AND` logic---all rules must be satisfied for activation. For more information and examples, see [Activation rules]({{site.url}}{{site.baseurl}}/ml-commons-plugin/context-management/#activation-rules).

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`rule_type` | String | Optional | Set to `always` to always activate the manager.
`message_count_exceed` | Integer | Optional | Activates when the message count exceeds this threshold.
`tokens_exceed` | Integer | Optional | Activates when the token count exceeds this threshold.

## Example request: Basic sliding window context management

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

## Related documentation

For more information, see [Context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/context-management/).

