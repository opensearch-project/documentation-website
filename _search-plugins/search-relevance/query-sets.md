---
layout: default
title: Query sets
nav_order: 3
parent: Using Search Relevance Workbench
grand_parent: Search relevance
has_children: false
has_toc: false
---

# Query sets

A query set is a collection of queries. These queries are used in experiments for search relevance evaluation. The Search Relevance Workbench offers different sampling techniques to create query sets from real user data that adheres to the User Behavior Insights (UBI) standard.
Additionally, the Search Relevance Workbench allows importing a query set.

## Creating query sets

If you're tracking user behavior with the User Behavior Insights (UBI) standard, you can choose from different sampling methods that can create query sets based on real user queries stored in the `ubi_queries` index.

The Search Relevance Workbench supports three sampling methods:
* Random: Takes a random sample of all queries.
* [Probability-Proportional-to-Size Sampling](https://opensourceconnections.com/blog/2022/10/13/how-to-succeed-with-explicit-relevance-evaluation-using-probability-proportional-to-size-sampling/): Takes a frequency-weighted sample of all queries to obtain a representative sample.
* Top N: Takes the most frequent N queries.

### Endpoint

```json
POST _plugins/_search_relevance/query_sets
```

### Request body fields

The following lists the input parameters.

Field | Data type |  Description
:---  | :--- | :---
`name` | String |	The name of the query set.
`description` | String | A short description of the query set.
`sampling` | String | Defines which sampler to use. Valid values are `pptss` (Probability-Proportional-to-Size-Sampling), `random`, `topn` (most frequent queries), and `manual`.
`querySetSize` | Integer | The target number of queries in the query set. Depending on the number of unique queries in `ubi_queries`, the resulting query set can have fewer queries.

### Example request: Sampling 20 queries with the Top N sampler

```json
POST _plugins/_search_relevance/query_sets
{
  "name": "Top 20",
  "description": "Top 20 most frequent queries sourced from user searches.",
  "sampling": "topn",
  "querySetSize": 20
}
```

### Example request: Uploading a query set manually

```json
PUT _plugins/_search_relevance/query_sets
{
   	"name": "TVs",
   	"description": "TV queries",
   	"sampling": "manual",
   	"querySetQueries": [
      {
        "queryText": "tv"
      },
      {
        "queryText": "led tv"
      }
    ]
}
```

## Managing query sets

You can retrieve or delete query sets using the following APIs.

### Retrieve query sets

This API retrieves available query sets.

#### Endpoint

```json
GET _plugins/_search_relevance/query_sets
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 2,
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
    "max_score": null,
    "hits": [
      {
        "_index": "search-relevance-queryset",
        "_id": "bb45c4c4-48ce-461b-acbc-f154c0a17ec9",
        "_score": null,
        "_source": {
          "id": "bb45c4c4-48ce-461b-acbc-f154c0a17ec9",
          "name": "TVs",
          "description": "Some TVs that people might want",
          "sampling": "manual",
          "timestamp": "2025-06-11T13:43:26.676Z",
          "querySetQueries": [
            {
              "queryText": "tv"
            },
            {
              "queryText": "led tv"
            }
          ]
        },
        "sort": [
          1749649406676
        ]
      }
    ]
  }
}
```

### View a query set

You can retrieve a query set using the query set ID.

#### Endpoint

```json
GET _plugins/_search_relevance/query_sets/<query_set_id>
```

### Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `query_set_id` | String | The ID of the query set to retrieve. |

#### Example request:

```json
GET _plugins/_search_relevance/query_sets/bb45c4c4-48ce-461b-acbc-f154c0a17ec9
```

#### Example response:

```json
{
  "took": 29,
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
    "max_score": 1,
    "hits": [
      {
        "_index": "search-relevance-queryset",
        "_id": "bb45c4c4-48ce-461b-acbc-f154c0a17ec9",
        "_score": 1,
        "_source": {
          "id": "bb45c4c4-48ce-461b-acbc-f154c0a17ec9",
          "name": "TVs",
          "description": "Some TVs that people might want",
          "sampling": "manual",
          "timestamp": "2025-06-11T13:43:26.676Z",
          "querySetQueries": [
            {
              "queryText": "tv"
            },
            {
              "queryText": "led tv"
            }
          ]
        }
      }
    ]
  }
}
```

### Delete a query set

You can delete a query set using the query set ID.

#### Endpoint

```json
DELETE _plugins/_search_relevance/query_sets/<query_set_id>
```

#### Example request

```json
DELETE _plugins/_search_relevance/query_sets/bb45c4c4-48ce-461b-acbc-f154c0a17ec9
```

#### Example response

```json
{
  "_index": "search-relevance-queryset",
  "_id": "bb45c4c4-48ce-461b-acbc-f154c0a17ec9",
  "_version": 2,
  "result": "deleted",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 17,
  "_primary_term": 1
}
```
