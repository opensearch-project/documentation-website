---
layout: default
title: Create or update memory
parent: Memory APIs
grand_parent: ML Commons APIs
nav_order: 10
---

# Create Or Update Memory API
**Introduced 2.12**
{: .label .label-purple }

Use this API to create or update a conversational memory for [conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/). A memory stores conversation history for the current conversation.

Once a memory is created, you'll provide its `memory_id` to other APIs.

The POST method creates a new memory. The PUT method updates an existing memory.

When the Security plugin is enabled, all memories exist in a `private` security mode. Only the user who created a memory can interact with that memory and its messages.
{: .important}

## Endpoints

```json
POST /_plugins/_ml/memory/
PUT /_plugins/_ml/memory/{memory_id}
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`memory_id` | String | The ID of the memory to be updated. Required for the PUT method.

## Request body fields

The following table lists the available request fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- | :---
`name` | String | Optional | The name of the memory.
`additional_info` | Object | Optional | Additional information about the memory, provided as string key-value pairs. When creating a memory, this field is ignored unless `name` is also specified.
`application_type` | String | Optional | The type of application that uses the memory. Applies only to the POST method and is ignored unless `name` is also specified.

The PUT method updates only the `name` and `additional_info` fields. Other fields in a PUT request are ignored.

## Example request

```json
POST /_plugins/_ml/memory/
{
  "name": "Conversation for a RAG pipeline"
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "memory_id": "gW8Aa40BfUsSoeNTvOKI"
}
```

## Example request: Update a memory

```json
PUT /_plugins/_ml/memory/gW8Aa40BfUsSoeNTvOKI
{
  "name": "Renamed conversation",
  "additional_info": {
    "topic": "population growth"
  }
}
```
{% include copy-curl.html %}

## Example response: Update a memory

```json
{
  "_index": ".plugins-ml-memory-meta",
  "_id": "gW8Aa40BfUsSoeNTvOKI",
  "_version": 2,
  "result": "updated",
  "forced_refresh": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 3,
  "_primary_term": 1
}
```