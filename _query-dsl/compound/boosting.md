---
layout: default
title: Boosting
parent: Compound queries
grand_parent: Query DSL
nav_order: 30
redirect_from:
  - /query-dsl/query-dsl/compound/boosting/
---

# Boosting query

If you're searching for the word "pitcher", your results may relate to either baseball players or containers for liquids. For a search in the context of baseball, you might want to completely exclude results that contain the words "glass" or "water" by using the `must_not` clause. However, if you want to keep those results but downgrade them in relevance, you can do so with `boosting` queries. 

A `boosting` query returns documents that match a `positive` query. Among those documents, the ones that also match the `negative` query are scored lower in relevance (their relevance score is multiplied by the negative boosting factor).

## Example

Consider an index with two documents that you index as follows:

```json
PUT testindex/_doc/1
{
  "article_name": "The greatest pitcher in baseball history"
}
```

```json
PUT testindex/_doc/2
{
  "article_name": "The making of a glass pitcher"
}
```

Use the following match query to search for documents containing the word "pitcher":

```json
GET testindex/_search
{
  "query": {
    "match": {
      "article_name": "pitcher"
    }
  }
}
```

Both returned documents have the same relevance score:

```json
{
  "took": 5,
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
    "max_score": 0.18232156,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0.18232156,
        "_source": {
          "article_name": "The greatest pitcher in baseball history"
        }
      },
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 0.18232156,
        "_source": {
          "article_name": "The making of a glass pitcher"
        }
      }
    ]
  }
}
```

Now use the following `boosting` query to search for documents containing the word "pitcher" but downgrade the documents that contain the words "glass", "crystal", or "water":

```json
GET testindex/_search
{
  "query": {
    "boosting": {
      "positive": {
        "match": {
          "article_name": "pitcher"
        }
      },
      "negative": {
        "match": {
          "article_name": "glass crystal water"
        }
      },
      "negative_boost": 0.1
    }
  }
}
```
{% include copy-curl.html %}

Both documents are still returned, but the document with the word "glass" has a relevance score that is 10 times lower than in the previous case:

```json
{
  "took": 13,
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
    "max_score": 0.18232156,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0.18232156,
        "_source": {
          "article_name": "The greatest pitcher in baseball history"
        }
      },
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 0.018232157,
        "_source": {
          "article_name": "The making of a glass pitcher"
        }
      }
    ]
  }
}
```

## Parameters

The following table lists all top-level parameters supported by `boosting` queries.

Parameter | Description
:--- | :---
`positive` | The query that a document must match to be returned in the results. Required.
`negative` | If a document in the results matches this query, its relevance score is reduced by multiplying its original relevance score (produced by the `positive` query) by the `negative_boost` parameter. Required.
`negative_boost` | A floating-point factor between 0 and 1.0 that the original relevance score is multiplied by in order to reduce the relevance of documents that match the `negative` query. Required.
