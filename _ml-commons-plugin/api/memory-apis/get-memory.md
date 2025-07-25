---
layout: default
title: Get memory
parent: Memory APIs
grand_parent: ML Commons APIs
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/memory-apis/get-memory/
---

# Get a memory
**Introduced 2.12**
{: .label .label-purple }

Use this API to retrieve a conversational memory for [conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/). 

To retrieve memory information, you can:

- [Get a memory by ID](#get-a-memory-by-id).
- [Get all memories](#get-all-memories).

To retrieve message information for a memory, you can:

- [Get all messages within a memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/get-message#get-all-messages-within-a-memory). 
- [Search for messages within a memory]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/memory-apis/search-message/).

When the Security plugin is enabled, all memories exist in a `private` security mode. Only the user who created a memory can interact with that memory and its messages.
{: .important}

## Get a memory by ID

You can retrieve memory information by using the `memory_id`. The response includes all messages within the memory.

### Path and HTTP methods

```json
GET /_plugins/_ml/memory/<memory_id>
```
### Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`memory_id` | String | The ID of the memory to retrieve.

#### Example request

```json
GET /_plugins/_ml/memory/N8AE1osB0jLkkocYjz7D
```
{% include copy-curl.html %}

#### Example response

```json
{
  "memory_id": "gW8Aa40BfUsSoeNTvOKI",
  "create_time": "2024-02-02T18:07:06.887061463Z",
  "updated_time": "2024-02-02T19:01:32.121444968Z",
  "name": "Conversation for a RAG pipeline",
  "user": "admin"
}
```

## Get all memories

Use this command to get all memories.

### Path and HTTP methods

```json
GET /_plugins/_ml/memory
```

### Query parameters

Use the following query parameters to customize your results. All query parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`max_results` | Integer | The maximum number of results to return. If there are fewer memories than the number set in `max_results`, the response returns only the number of memories that exist. Default is `10`.
`next_token` | Integer | The index of the first memory in the sorted list of memories to return. Memories are ordered by `create_time`. For example, if memories A, B, and C exist, `next_token=1` returns memories B and C. Default is `0` (return all memories).

### Paginating results

The `next_token` parameter provides the ordered position of the first memory within the sorted list of memories to return in the results. When a memory is added between subsequent GET Memory calls, one of the listed memories will be duplicated in the results. For example, suppose the current ordered list of memories is `BCDEF`, where `B` is the memory created most recently. When you call the Get Memory API with `next_token=0` and `max_results=3`, the API returns `BCD`. Suppose you then create another memory A. The memory list now appears as `ABCDEF`. The next time you call the Get Memory API with `next_token=3` and `max_results=3`, you'll receive `DEF` in the results. Notice that `D` will be returned in the first and second batches of results. The following diagram illustrates the duplication.

Request | List of memories (returned memories are enclosed in brackets) | Results returned in the response
:--- | :--- | :---
Get Memory (next_token = 0, max_results = 3) | [BCD]EF | BCD
Create Memory            | ABCDEF | -
Get Memory (next_token = 3, max_results = 3) -> ABC[DEF] | DEF


#### Example request: Get all memories

```json
GET /_plugins/_ml/memory/
```
{% include copy-curl.html %}

#### Example request: Paginating results

```json
GET /_plugins/_ml/memory?max_results=2&next_token=1
```

#### Example response

```json
{
  "memories": [
    {
      "memory_id": "gW8Aa40BfUsSoeNTvOKI",
      "create_time": "2024-02-02T18:07:06.887061463Z",
      "updated_time": "2024-02-02T19:01:32.121444968Z",
      "name": "Conversation for a RAG pipeline",
      "user": "admin"
    }
  ]
}
```

## Response body fields

The following table lists the available response fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory_id` | String | The memory ID. |
| `create_time` | String | The time at which the memory was created. |
| `updated_time` | String | The time at which the memory was last updated. |
| `name` | String | The memory name. |
| `user` | String | The username of the user who created the memory. |