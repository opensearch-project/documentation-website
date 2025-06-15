---
layout: default
title: Search Configurations
nav_order: 30
parent: Using Search Relevance Workbench
grand_parent: Search relevance
has_children: false
has_toc: false
---

# Search Configurations

A search configuration describes the pattern to use to run queries for experiments.

## Creating search configurations

Users define a search configuration to describe how every user query of a query set is run. Every search configuration has a name and consists of a query body (a query in OpenSearch Query DSL) and the target index. Users can optionally define a search pipeline.

### Endpoint

```json
PUT _plugins/_search_relevance/search_configurations
```

### Request body fields

The following lists the input parameters.

Field | Data type |  Description
:---  | :--- | :---
`name` | String |	The name of the search configuration.
`query` | Object | Define the query in OpenSearch Query DSL. Use `%SearchText%` as placeholder for the user query. Needs to be escaped.
`index` | String | The target index this search configuration queries.
`searchPipeline` | String | Optional definition of a search pipeline. Any configured search pipeline has to exist before creating the pipeline.

### Example request: creating a search configuration

```json
PUT _plugins/_search_relevance/search_configurations
{
  "name": "baseline",
  "query": "{\"query\":{\"multi_match\":{\"query\":\"%SearchText%\",\"fields\":[\"id\",\"title\",\"category\",\"bullets\",\"description\",\"attrs.Brand\",\"attrs.Color\"]}}}",
  "index": "ecommerce"
}
```

## Managing search configurations

In addition to creating query sets, there are API calls to retrieve available query sets, view individual query sets and delete query sets.

### Retrieve search configurations

#### Endpoint

```json
GET _plugins/_search_relevance/search_configurations
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 3,
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
        "_index": "search-relevance-search-config",
        "_id": "92810080-9c5a-470f-a0ff-0eb85e7b818c",
        "_score": null,
        "_source": {
          "id": "92810080-9c5a-470f-a0ff-0eb85e7b818c",
          "name": "baseline",
          "timestamp": "2025-06-12T08:23:03.305Z",
          "index": "ecommerce",
          "query": """{"query":{"multi_match":{"query":"%SearchText%","fields":["id","title","category","bullets","description","attrs.Brand","attrs.Color"]}}}""",
          "searchPipeline": ""
        },
        "sort": [
          1749716583305
        ]
      }
    ]
  }
}
```

### View a query set

You can retrieve a query set using the search configuration ID.

#### Endpoint

```json
GET _plugins/_search_relevance/search_configurations/<search_configuration_id>
```

### Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `search_configuration_id` | String | The ID of the search configuration to retrieve. |

#### Example request:

```json
GET _plugins/_search_relevance/search_configurations/92810080-9c5a-470f-a0ff-0eb85e7b818c
```

#### Example response:

```json
{
  "took": 4,
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
        "_index": "search-relevance-search-config",
        "_id": "92810080-9c5a-470f-a0ff-0eb85e7b818c",
        "_score": 1,
        "_source": {
          "id": "92810080-9c5a-470f-a0ff-0eb85e7b818c",
          "name": "baseline",
          "timestamp": "2025-06-12T08:23:03.305Z",
          "index": "ecommerce",
          "query": """{"query":{"multi_match":{"query":"%SearchText%","fields":["id","title","category","bullets","description","attrs.Brand","attrs.Color"]}}}""",
          "searchPipeline": ""
        }
      }
    ]
  }
}
```

### Delete a search configuration

You can delete a search configuration using the search configuration ID.

#### Endpoint

```json
DELETE _plugins/_search_relevance/search_configurations/92810080-9c5a-470f-a0ff-0eb85e7b818c
```

#### Example request:

```json
DELETE _plugins/_search_relevance/search_configurations/bb45c4c4-48ce-461b-acbc-f154c0a17ec9
```

#### Example response

```json
{
  "_index": "search-relevance-search-config",
  "_id": "92810080-9c5a-470f-a0ff-0eb85e7b818c",
  "_version": 2,
  "result": "deleted",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 9,
  "_primary_term": 1
}
```
