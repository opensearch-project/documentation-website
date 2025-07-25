---
layout: default
title: Get message
parent: Memory APIs
grand_parent: ML Commons APIs
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/memory-apis/get-message/
---

# Get message
**Introduced 2.12**
{: .label .label-purple }

Use this API to retrieve message information for [conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/). 

To retrieve message information, you can:

- [Get a message by ID](#get-a-message-by-id).
- [Get all messages within a memory](#get-all-messages-within-a-memory).

When the Security plugin is enabled, all memories exist in a `private` security mode. Only the user who created a memory can interact with that memory and its messages.
{: .important}

## Get a message by ID

You can retrieve message information by using the `message_id`.

### Path and HTTP methods

```json
GET /_plugins/_ml/memory/message/<message_id>
```

### Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`message_id` | String | The ID of the message to retrieve.

#### Example request

```json
GET /_plugins/_ml/memory/message/0m8ya40BfUsSoeNTj-pU
```
{% include copy-curl.html %}

#### Example response

```json
{
  "memory_id": "gW8Aa40BfUsSoeNTvOKI",
  "message_id": "0m8ya40BfUsSoeNTj-pU",
  "create_time": "2024-02-02T19:01:32.113621539Z",
  "input": null,
  "prompt_template": null,
  "response": "Hello, this is OpenAI. Here is the answer to your question.",
  "origin": null,
  "additional_info": {
    "suggestion": "api.openai.com"
  }
}
```

For information about response fields, see [Create Message request fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/create-message#request-fields).

## Get all messages within a memory

Use this command to get a list of messages for a certain memory.

### Path and HTTP methods

```json
GET /_plugins/_ml/memory/<memory_id>/messages
```

### Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`memory_id` | String | The ID of the memory for which to retrieve messages.

#### Example request

```json
GET /_plugins/_ml/memory/gW8Aa40BfUsSoeNTvOKI/messages
```
{% include copy-curl.html %}

```json
POST /_plugins/_ml/message/_search
{
  "query": {
    "match_all": {}
  },
  "size": 1000
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "messages": [
    {
      "memory_id": "gW8Aa40BfUsSoeNTvOKI",
      "message_id": "BW8ha40BfUsSoeNT8-i3",
      "create_time": "2024-02-02T18:43:23.566994302Z",
      "input": "How do I make an interaction?",
      "prompt_template": "Hello OpenAI, can you answer this question?",
      "response": "Hello, this is OpenAI. Here is the answer to your question.",
      "origin": "MyFirstOpenAIWrapper",
      "additional_info": {
        "suggestion": "api.openai.com"
      }
    },
    {
      "memory_id": "gW8Aa40BfUsSoeNTvOKI",
      "message_id": "0m8ya40BfUsSoeNTj-pU",
      "create_time": "2024-02-02T19:01:32.113621539Z",
      "input": null,
      "prompt_template": null,
      "response": "Hello, this is OpenAI. Here is the answer to your question.",
      "origin": null,
      "additional_info": {
        "suggestion": "api.openai.com"
      }
    }
  ]
}
```

## Response fields

For information about response fields, see [Create Message request fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/create-message#request-fields).

