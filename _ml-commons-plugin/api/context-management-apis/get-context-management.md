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
GET /_plugins/_ml/context_management/{context_management_name}
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
  "name": "token-aware-truncation",
  "description": "Context management that truncates tool outputs longer than 100,000 characters and applies sliding window to keep last 6 messages when tokens exceed 200,000",
  "hooks": {
    "PRE_LLM": [
      {
        "type": "SlidingWindowManager",
        "config": {
          "max_messages": 6,
          "activation": {
            "tokens_exceed": 200000
          }
        }
      }
    ],
    "POST_TOOL": [
      {
        "type": "ToolsOutputTruncateManager",
        "config": {
          "max_output_length": 100000
        }
      }
    ]
  },
  "created_time": 1754943902286,
  "last_modified": 1754943902286,
  "created_by": "admin"
}
```

## Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`name` | String | The name of the context management.
`description` | String | The description of the context management.
`hooks` | Object | A map of hook names to lists of context manager configurations. For more information, see [The `hooks` object]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/create-context-management/#the-hooks-object).
`created_time` | Long | The time when the context management was created, in epoch milliseconds.
`last_modified` | Long | The time when the context management was last updated, in epoch milliseconds.
`created_by` | String | The user who created the context management. Present only when the Security plugin is enabled.

## Related documentation

For more information, see [Context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/context-management/).