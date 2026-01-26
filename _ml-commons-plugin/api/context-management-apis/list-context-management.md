---
layout: default
title: List context management templates
parent: Context management APIs
grand_parent: ML Commons APIs
nav_order: 50
---

# List Context Management Templates API
**Introduced 3.3**
{: .label .label-purple }

Use this API to retrieve a list of all context management templates in the cluster.

## Endpoints

```json
GET /_plugins/_ml/context_management
```

## Query parameters

The following table lists the available query parameters.

Parameter | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`size` | Integer | Optional | The maximum number of templates to return. Default is `10`.
`from` | Integer | Optional | The starting index for pagination. Default is `0`.

## Example request

```json
GET /_plugins/_ml/context_management
```
{% include copy-curl.html %}

## Example request with pagination

```json
GET /_plugins/_ml/context_management?size=20&from=0
```
{% include copy-curl.html %}

## Example response

```json
{
  "total": 1,
  "templates": [
    {
      "name": "sliding_window_max_40000_tokens_managers",
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
      },
      "created_time": 1769457277774,
      "last_modified": 1769457277774
    }
  ]
}
```
