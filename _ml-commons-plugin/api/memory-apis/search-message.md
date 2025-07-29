---
layout: default
title: Search message
parent: Memory APIs
grand_parent: ML Commons APIs
nav_order: 60
---

# Search Message API
**Introduced 2.12**
{: .label .label-purple }

Retrieves message information for [conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/). You can send queries to the `_search` endpoint to search for matching messages within a memory.

When the Security plugin is enabled, all memories exist in a `private` security mode. Only the user who created a memory can interact with that memory and its messages.
{: .important}

## Endpoints

```json
POST /_plugins/_ml/memory/<memory_id>/_search
GET /_plugins/_ml/memory/<memory_id>/_search
```

### Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`memory_id` | String | The ID of the memory used to search for messages matching the query.

## Example request

```json
GET /_plugins/_ml/memory/gW8Aa40BfUsSoeNTvOKI/_search
{
  "query": {
    "match": {
      "input": "interaction"
    }
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.47000366,
    "hits": [
      {
        "_index": ".plugins-ml-memory-message",
        "_id": "BW8ha40BfUsSoeNT8-i3",
        "_version": 1,
        "_seq_no": 0,
        "_primary_term": 1,
        "_score": 0.47000366,
        "_source": {
          "input": "How do I make an interaction?",
          "memory_id": "gW8Aa40BfUsSoeNTvOKI",
          "trace_number": null,
          "create_time": "2024-02-02T18:43:23.566994302Z",
          "additional_info": {
            "suggestion": "api.openai.com"
          },
          "response": "Hello, this is OpenAI. Here is the answer to your question.",
          "origin": "MyFirstOpenAIWrapper",
          "parent_message_id": null,
          "prompt_template": "Hello OpenAI, can you answer this question?"
        }
      }
    ]
  }
}
```

## Response body fields

For information about response fields, see [Create Message request fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/create-message#request-body-fields).