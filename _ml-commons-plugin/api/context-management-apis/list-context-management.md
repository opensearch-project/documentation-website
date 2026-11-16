---
layout: default
title: List context management
parent: Context management APIs
grand_parent: ML APIs
nav_order: 50
---

# List Context Management API
**Introduced 3.5**
{: .label .label-purple }

Use this API to retrieve a list of all context management configurations in the cluster.

## Endpoints

```json
GET /_plugins/_ml/context_management
```

## Query parameters

The following table lists the available query parameters.

Parameter | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`size` | Integer | Optional | The maximum number of results to return. Valid values are 1--1000. Default is `10`.
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
      "description": "Context management for truncating tool outputs to prevent input length issues",
      "hooks": {
        "PRE_LLM": [
          {
            "type": "SlidingWindowManager",
            "config": {
              "max_messages": 8
            }
          }
        ],
        "POST_TOOL": [
          {
            "type": "ToolsOutputTruncateManager",
            "config": {
              "max_output_length": 40000
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

## Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`total` | Integer | The number of context management configurations returned in this response.
`templates` | Array | A list of context management configurations. For field descriptions, see [Get Context Management API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/context-management-apis/get-context-management/#response-body-fields).

## Related documentation

For more information, see [Context management]({{site.url}}{{site.baseurl}}/ml-commons-plugin/context-management/).