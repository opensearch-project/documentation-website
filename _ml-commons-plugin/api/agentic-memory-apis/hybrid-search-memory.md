---
layout: default
title: Hybrid search memory
parent: Agentic memory APIs
grand_parent: ML Commons APIs
nav_order: 56
---

# Hybrid search memory API
**Introduced 3.6**
{: .label .label-purple }

Use this API to search long-term memories using a combination of BM25 keyword matching and neural vector search. This is useful when your query benefits from both exact keyword precision and semantic understanding.

The memory container must have an embedding model and at least one [memory strategy]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/#memory-processing-strategies) configured. This API requires the [neural-search plugin]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/) to be installed.

## Endpoints

```json
POST /_plugins/_ml/memory_containers/{memory_container_id}/memories/long-term/_hybrid_search
GET /_plugins/_ml/memory_containers/{memory_container_id}/memories/long-term/_hybrid_search
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
| `query` | String | Required | N/A | Plain text search query used for both BM25 keyword matching and neural vector search. |
| `k` | Integer | Optional | 10 | The number of results to return. Valid values are 1–10,000. |
| `namespace` | Object | Optional | N/A | Filters results by namespace fields. For example, `{"user_id": "alice"}`. |
| `tags` | Object | Optional | N/A | Filters results by tag fields. For example, `{"topic": "food"}`. |
| `min_score` | Float | Optional | N/A | The minimum relevance score threshold. Results below this score are excluded. |
| `filter` | Object | Optional | N/A | An additional [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/) filter applied alongside the hybrid query. |
| `bm25_weight` | Float | Optional | 0.5 | The weight for the BM25 keyword search component. Valid values are 0.0–1.0. Must sum to 1.0 with `neural_weight`. |
| `neural_weight` | Float | Optional | 0.5 | The weight for the neural vector search component. Valid values are 0.0–1.0. Must sum to 1.0 with `bm25_weight`. |

## Example request: Basic hybrid search

```json
POST /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/_hybrid_search
{
  "query": "retirement timeline five years portfolio rebalancing",
  "k": 10,
  "namespace": {
    "user_id": "bob"
  }
}
```
{% include copy-curl.html %}

## Example request: With custom weights

You can tune the balance between keyword and semantic search per request. Setting `neural_weight` higher prioritizes semantic similarity, while setting `bm25_weight` higher prioritizes exact keyword matches.

```json
POST /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/_hybrid_search
{
  "query": "machine learning outdoor activities",
  "k": 5,
  "namespace": {
    "user_id": "alice"
  },
  "bm25_weight": 0.3,
  "neural_weight": 0.7
}
```
{% include copy-curl.html %}

## Example request: With minimum score and tags filter

```json
POST /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/_hybrid_search
{
  "query": "LGBTQ workshop therapeutic methods",
  "k": 10,
  "namespace": {
    "user_id": "caroline"
  },
  "tags": {
    "topic": "wellness"
  },
  "min_score": 0.3
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "took": 15,
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
    "max_score": 1.0,
    "hits": [
      {
        "_index": "test-memory-long-term",
        "_id": "abc123",
        "_score": 1.0,
        "_source": {
          "memory": "Caroline attended an LGBTQ+ counseling workshop focused on therapeutic methods",
          "strategy_type": "SEMANTIC",
          "namespace": {
            "user_id": "caroline"
          },
          "memory_container_id": "HudqiJkB1SltqOcZusVU",
          "created_time": 1700000000000,
          "last_updated_time": 1700000000000
        }
      },
      {
        "_index": "test-memory-long-term",
        "_id": "def456",
        "_score": 0.52,
        "_source": {
          "memory": "Caroline attended an LGBTQ conference on community building",
          "strategy_type": "SEMANTIC",
          "namespace": {
            "user_id": "caroline"
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

The response uses the standard OpenSearch search response format. For field descriptions, see [Semantic search memory response fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/semantic-search-memory/#response-fields).

The `memory_embedding` field is excluded from the response.

## How hybrid search works

Hybrid search combines two search methods in a single query:

1. **BM25 keyword search**: A `match` query on the `memory` field for exact keyword matching.
2. **Neural vector search**: A `neural` query (or `neural_sparse` for `SPARSE_ENCODING` models) on the `memory_embedding` field for semantic similarity.

Results are combined using an inline normalization processor pipeline with `min_max` normalization and `arithmetic_mean` combination. The `bm25_weight` and `neural_weight` parameters control the relative importance of each search method. No pre-created search pipeline is required.
