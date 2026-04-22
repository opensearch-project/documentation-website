---
layout: default
title: Semantic search memory
parent: Agentic memory APIs
grand_parent: ML Commons APIs
nav_order: 60
---

# Semantic Search Memory API
**Introduced 3.6**
{: .label .label-purple }

Use this API to search long-term memories using natural language queries. OpenSearch automatically generates embeddings from your query text and performs vector similarity search against stored memory embeddings. This eliminates the need to manually construct k-NN queries with pregenerated embeddings.

The memory container must have an embedding model and at least one [memory strategy]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/#memory-processing-strategies) configured.
{: .note}

## Endpoints

```json
POST /_plugins/_ml/memory_containers/{memory_container_id}/memories/long-term/_semantic_search
GET /_plugins/_ml/memory_containers/{memory_container_id}/memories/long-term/_semantic_search
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `memory_container_id` | String | Required | The ID of the memory container. |

## Request fields

The following table lists the available request fields.

| Field | Data type | Required/Optional | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `query` | String | Required | N/A | A natural language search query. OpenSearch generates the embedding automatically using the memory container's configured embedding model. |
| `k` | Integer | Optional | 10 | The number of results to return. Valid values are 1–10,000. |
| `namespace` | Object | Optional | N/A | Filters results by namespace fields. For example, `{"user_id": "alice"}`. |
| `tags` | Object | Optional | N/A | Filters results by tag fields. For example, `{"topic": "food"}`. |
| `min_score` | Float | Optional | N/A | The minimum relevance score threshold. Results below this score are excluded. |
| `filter` | Object | Optional | N/A | An additional [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/) filter applied alongside the semantic query. |

## Example request: Basic semantic search

```json
POST /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/_semantic_search
{
  "query": "retirement planning portfolio rebalancing",
  "k": 5,
  "namespace": {
    "user_id": "bob"
  }
}
```
{% include copy-curl.html %}

## Example request: Minimum score and tags filter

```json
POST /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/_semantic_search
{
  "query": "client risk tolerance and investment preferences",
  "k": 5,
  "namespace": {
    "user_id": "bob"
  },
  "tags": {
    "topic": "finance"
  },
  "min_score": 0.6
}
```
{% include copy-curl.html %}

## Example request: Query DSL filter

```json
POST /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/_semantic_search
{
  "query": "programming languages for data science",
  "k": 10,
  "namespace": {
    "user_id": "alice"
  },
  "filter": {
    "range": {
      "created_time": {
        "gte": 1700000000000
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "took": 12,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.87,
    "hits": [
      {
        "_index": "test-memory-long-term",
        "_id": "abc123",
        "_score": 0.87,
        "_source": {
          "memory": "Client plans to retire in five years with a gradual rebalancing strategy",
          "strategy_type": "SEMANTIC",
          "namespace": {
            "user_id": "bob"
          },
          "memory_container_id": "HudqiJkB1SltqOcZusVU",
          "created_time": 1700000000000,
          "last_updated_time": 1700000000000
        }
      },
      {
        "_index": "test-memory-long-term",
        "_id": "def456",
        "_score": 0.82,
        "_source": {
          "memory": "Client prefers conservative investments and wants to shift away from equities",
          "strategy_type": "USER_PREFERENCE",
          "namespace": {
            "user_id": "bob"
          },
          "memory_container_id": "HudqiJkB1SltqOcZusVU",
          "created_time": 1700000000000,
          "last_updated_time": 1700000000000
        }
      }
    ]
  }
}
```

## Response fields

The response uses the standard OpenSearch search response format. Each hit in the `hits.hits` array contains the following fields in `_source`.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory` | String | The extracted memory text. |
| `strategy_type` | String | The strategy that produced this memory (`SEMANTIC`, `USER_PREFERENCE`, or `SUMMARY`). |
| `namespace` | Object | The namespace fields associated with this memory. |
| `memory_container_id` | String | The ID of the memory container. |
| `created_time` | Long | The timestamp when the memory was created. |
| `last_updated_time` | Long | The timestamp when the memory was last updated. |

The `memory_embedding` field is excluded from the response.

## Related documentation

- [Semantic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/semantic-search/)