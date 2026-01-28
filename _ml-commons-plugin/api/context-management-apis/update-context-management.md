---
layout: default
title: Update context management template
parent: Context management APIs
grand_parent: ML Commons APIs
nav_order: 30
---

# Update Context Management API
**Introduced 3.3**
{: .label .label-purple }

Use this API to update an existing context management. You can modify the description, hooks configuration, and context manager settings.

## Endpoints

```json
PUT /_plugins/_ml/context_management/<context_management_name>
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`context_management_name` | String | Required | The name of the context management template to update.

## Request body fields

The following table lists the available request body fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`description` | String | Optional | A human-readable description of what this template does.
`hooks` | Object | Optional | A map of hook names to lists of context manager configurations. See [The `hooks` object]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/create-template/#the-hooks-object).

The request body follows the same structure as the [Create Context Management Template API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/create-context-management/).

## Example request: Update description

```json
PUT /_plugins/_ml/context_management/advanced-context-management
{
  "description": "Updated description for advanced context management with multiple strategies"
}
```
{% include copy-curl.html %}

## Example request: Update hooks configuration

```json
PUT /_plugins/_ml/context_management/sliding_window_max_40000_tokens_managers
{
  "description": "Template for truncating tool outputs to prevent input length issues",
  "hooks": {
    "PRE_LLM": [
      {
        "type": "SlidingWindowManager",
        "activation": {
          "rule_type": "always"
        },
        "config": {
          "max_messages": 8
        }
      }
    ],
    "POST_TOOL": [
      {
        "type": "ToolsOutputTruncateManager",
        "activation": {
          "rule_type": "always"
        },
        "config": {
          "max_output_length": 40000,
          "truncation_strategy": "preserve_beginning"
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
  "_index": ".plugins-ml-context-management-templates",
  "_id": "sliding_window_max_40000_tokens_managers",
  "_version": 2,
  "result": "updated",
  "forced_refresh": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 4,
  "_primary_term": 1
}
```
