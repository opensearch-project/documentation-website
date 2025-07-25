---
layout: default
title: Search memory
parent: Memory APIs
grand_parent: ML Commons APIs
nav_order: 25
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/memory-apis/search-memory/
---

# Search for a memory
**Introduced 2.12**
{: .label .label-purple }

This API retrieves a conversational memory for [conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/). Use this command to search for memories.

When the Security plugin is enabled, all memories exist in a `private` security mode. Only the user who created a memory can interact with that memory and its messages.
{: .important}

## Path and HTTP methods

```json
GET /_plugins/_ml/memory/_search
POST /_plugins/_ml/memory/_search
```

#### Example request: Searching for all memories

```json
POST /_plugins/_ml/memory/_search
{
  "query": {
    "match_all": {}
  },
  "size": 1000
}
```
{% include copy-curl.html %}

#### Example request: Searching for a memory by name

```json
POST /_plugins/_ml/memory/_search
{
  "query": {
    "term": {
      "name": {
        "value": "conversation"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 1,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 0.2195382,
    "hits": [
      {
        "_index": ".plugins-ml-memory-meta",
        "_id": "znCqcI0BfUsSoeNTntd7",
        "_version": 3,
        "_seq_no": 39,
        "_primary_term": 1,
        "_score": 0.2195382,
        "_source": {
          "updated_time": "2024-02-03T20:36:10.252213029Z",
          "create_time": "2024-02-03T20:30:46.395829411Z",
          "application_type": null,
          "name": "Conversation about NYC population",
          "user": "admin"
        }
      },
      {
        "_index": ".plugins-ml-memory-meta",
        "_id": "iXC4bI0BfUsSoeNTjS30",
        "_version": 4,
        "_seq_no": 11,
        "_primary_term": 1,
        "_score": 0.20763937,
        "_source": {
          "updated_time": "2024-02-03T02:59:39.862347093Z",
          "create_time": "2024-02-03T02:07:30.804554275Z",
          "application_type": null,
          "name": "Test conversation for RAG pipeline",
          "user": "admin"
        }
      },
      {
        "_index": ".plugins-ml-memory-meta",
        "_id": "gW8Aa40BfUsSoeNTvOKI",
        "_version": 4,
        "_seq_no": 6,
        "_primary_term": 1,
        "_score": 0.19754036,
        "_source": {
          "updated_time": "2024-02-02T19:01:32.121444968Z",
          "create_time": "2024-02-02T18:07:06.887061463Z",
          "application_type": null,
          "name": "Conversation for a RAG pipeline",
          "user": "admin"
        }
      }
    ]
  }
}
```

## Response body fields

The following table lists all response fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory_id` | String | The memory ID. |
| `create_time` | String | The time at which the memory was created. |
| `updated_time` | String | The time at which the memory was last updated. |
| `name` | String | The memory name. |
| `user` | String | The username of the user who created the memory. |