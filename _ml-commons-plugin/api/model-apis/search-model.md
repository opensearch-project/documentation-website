---
layout: default
title: Search model
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 35
canonical_url: https://docs.opensearch.org/docs/latest/ml-commons-plugin/api/model-apis/search-model/
---

# Search for a model

You can use this command to search for models you've already created.

The response will contain only those model versions to which you have access. For example, if you send a `match_all` query, model versions for the following model group types will be returned:

- All public model groups in the index
- Private model groups for which you are the model owner
- Model groups that share at least one backend role with your backend roles

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

## Endpoints

```json
GET /_plugins/_ml/models/_search
POST /_plugins/_ml/models/_search
```

#### Example request: Searching for all models

```json
POST /_plugins/_ml/models/_search
{
  "query": {
    "match_all": {}
  },
  "size": 1000
}
```
{% include copy-curl.html %}

#### Example request: Searching for models with the algorithm "FIT_RCF"

```json
POST /_plugins/_ml/models/_search
{
  "query": {
    "term": {
      "algorithm": {
        "value": "FIT_RCF"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example: Excluding model chunks

```json
GET /_plugins/_ml/models/_search
{
  "query": {
    "bool": {
      "must_not": {
        "exists": {
          "field": "chunk_number"
        }
      }
    }
  },
  "sort": [
    {
      "created_time": {
        "order": "desc"
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Example: Searching for all model chunks

The following query searches for all chunks of the model with the ID `979y9YwBjWKCe6KgNGTm` and sorts the chunks in ascending order:

```json
GET /_plugins/_ml/models/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "model_id": "9r9w9YwBjWKCe6KgyGST"
          }
        }
      ]
    }
  },
  "sort": [
    {
      "chunk_number": {
        "order": "asc"
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Example: Searching for a model by description

```json
GET _plugins/_ml/models/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "description": "sentence transformer"
          }
        }
      ],
      "must_not": {
        "exists": {
          "field": "chunk_number"
        }
      }
    }
  },
  "size": 1000
}
```
{% include copy-curl.html %}

#### Example response

```json
{
    "took" : 8,
    "timed_out" : false,
    "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
    },
    "hits" : {
      "total" : {
        "value" : 2,
        "relation" : "eq"
      },
      "max_score" : 2.4159138,
      "hits" : [
        {
          "_index" : ".plugins-ml-model",
          "_id" : "-QkKJX8BvytMh9aUeuLD",
          "_version" : 1,
          "_seq_no" : 12,
          "_primary_term" : 15,
          "_score" : 2.4159138,
          "_source" : {
            "name" : "FIT_RCF",
            "version" : 1,
            "content" : "xxx",
            "algorithm" : "FIT_RCF"
          }
        },
        {
          "_index" : ".plugins-ml-model",
          "_id" : "OxkvHn8BNJ65KnIpck8x",
          "_version" : 1,
          "_seq_no" : 2,
          "_primary_term" : 8,
          "_score" : 2.4159138,
          "_source" : {
            "name" : "FIT_RCF",
            "version" : 1,
            "content" : "xxx",
            "algorithm" : "FIT_RCF"
          }
        }
      ]
    }
  }
```