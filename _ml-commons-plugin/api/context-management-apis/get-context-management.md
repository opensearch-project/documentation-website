---
layout: default
title: Get context management
parent: Context management APIs
grand_parent: ML Commons APIs
nav_order: 20
---

# Get Context Management API
**Introduced 3.5**
{: .label .label-purple }

Use this API to retrieve a context management configuration by its name.

## Endpoints

```json
GET /_plugins/_ml/context_management/<context_management_name>
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`context_management_name` | String | Required | The name of the context management to retrieve.

## Example request

```json
GET /_plugins/_ml/context_management/token-aware-truncation
```
{% include copy-curl.html %}

## Example response

```json
{
  "description": "Context management that truncates tool outputs longer than 100,000 characters and applies sliding window to keep last 6 messages when tokens exceed 200,000",
  "hooks": {
    "post_tool": [
      {
        "type": "ToolsOutputTruncateManager",
        "config": {
          "max_output_length": 100000
        }
      }
    ],
    "pre_llm": [
      {
        "type": "SlidingWindowManager",
        "config": {
          "max_messages": 6,
          "activation": {
            "tokens_exceed": 200000
          }
        }
      }
    ]
  },
  "created_time": 1754943902286,
  "last_modified": 1754943902286,
  "created_by": "admin"
}
```

## Related documentation

For more information, see [Context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/context-management/).