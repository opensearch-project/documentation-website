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
PUT /_plugins/_ml/memory/<memory_id>
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