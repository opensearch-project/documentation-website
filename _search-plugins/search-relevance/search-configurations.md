---
layout: default
title: Search configurations
nav_order: 5
parent: Using Search Relevance Workbench
grand_parent: Search relevance
has_children: false
has_toc: false
---

# Search configurations

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/17735).    
{: .warning}

A search configuration defines the query pattern used to run experiments, specifying how queries should be constructed and executed.

## Creating search configurations

You can define a search configuration to describe how every query of a query set is run. Every search configuration has a name and consists of a query body (a query in OpenSearch query domain-specific language [DSL]) and the target index. You can optionally define a search pipeline for the search configuration.

### Endpoint

```json
PUT _plugins/_search_relevance/search_configurations
```

### Request body fields

The following table lists the available input parameters.

Field | Data type |  Description
:---  | :--- | :---
`name` | String |	The name of the search configuration.
`query` | Object | Defines the query in OpenSearch query DSL. Use `%SearchText%` as a placeholder for the user query. Needs to be escaped.
`index` | String | The target index queried by this search configuration.
`searchPipeline` | String | Specifies an existing search pipeline. Optional.

### Example request: Creating a search configuration

```json
PUT _plugins/_search_relevance/search_configurations
{
  "name": "baseline",
  "query": "{\"query\":{\"multi_match\":{\"query\":\"%SearchText%\",\"fields\":[\"id\",\"title\",\"category\",\"bullets\",\"description\",\"attrs.Brand\",\"attrs.Color\"]}}}",
  "index": "ecommerce"
}
```

## Managing search configurations

You can retrieve or delete configurations using the following APIs.

### Retrieve search configurations

 This API retrieves search configurations.

#### Endpoint

```json
GET _plugins/_search_relevance/search_configurations
GET _plugins/_search_relevance/search_configurations/<search_configuration_id>
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

### Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `search_configuration_id` | String | The ID of the search configuration to retrieve. Retrieves all search configurations when empty. |

### Delete a search configuration

You can delete a search configuration using the search configuration ID.

#### Endpoint

```json
DELETE _plugins/_search_relevance/search_configurations/<search_configuration_id>
```

#### Example request

```json
DELETE _plugins/_search_relevance/search_configurations/bb45c4c4-48ce-461b-acbc-f154c0a17ec9
```
{% include copy-curl.html %}

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

### Search for a search configuration

You can search for available search configurations using the query DSL.

#### Endpoint

```json
GET _plugins/_search_relevance/search_configurations
POST _plugins/_search_relevance/search_configurations
```

#### Example request: Searching for all search configurations

```json
GET _plugins/_search_relevance/search_configurations
{
  "query":
  {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

#### Example request: Searching for a search configuration by name

```json
GET _plugins/_search_relevance/search_configurations/_search
{
  "query": {
    "match": {
      "name": "baseline"
    }
  }
}
```

Note that the index storing the search configurations contains several fields of the type `keyword` that require exact matching.
{: .note}

#### Example request: Searching for a search configuration by a specific target index including a specific query pattern

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "index": "ecommerce"
          }
        },
        {
          "match": {
            "query": "multi_match"
          }
        }
      ]
    }
  },
  "size": 10
}
```

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
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1.2086178,
    "hits": [
      {
        "_index": "search-relevance-search-config",
        "_id": "c86af6ed-a91e-450d-a630-aa2a3c525618",
        "_score": 1.2086178,
        "_source": {
          "id": "c86af6ed-a91e-450d-a630-aa2a3c525618",
          "name": "baseline",
          "timestamp": "2026-01-26T12:11:47.657Z",
          "index": "ecommerce",
          "query": """{"query":{"multi_match":{"query":"%SearchText%","fields":["asin","title","category","bullet_points","description","brand","color"]}}}""",
          "searchPipeline": ""
        }
      },
      {
        "_index": "search-relevance-search-config",
        "_id": "a4697191-744e-404a-b869-bbefb7e753ed",
        "_score": 1.2015147,
        "_source": {
          "id": "a4697191-744e-404a-b869-bbefb7e753ed",
          "name": "baseline with title weight",
          "timestamp": "2026-01-26T12:11:48.199Z",
          "index": "ecommerce",
          "query": """{"query":{"multi_match":{"query":"%SearchText%","fields":["asin","title^25","category","bullet_points","description","brand","color"]}}}""",
          "searchPipeline": ""
        }
      }
    ]
  }
}
```
