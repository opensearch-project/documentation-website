---
layout: default
title: Disjunction max
parent: Compound queries
grand_parent: Query DSL
nav_order: 50
redirect_from:
  - /query-dsl/query-dsl/compound/disjunction-max/
---

# Disjunction max query

A disjunction max (`dis_max`) query returns any document that matches one or more query clauses. For documents that match multiple query clauses, the relevance score is set to the highest relevance score from all matching query clauses.

When the relevance scores of the returned documents are identical, you can use the `tie_breaker` parameter to give more weight to documents that match multiple query clauses.

## Example

Consider an index with two documents that you index as follows:

```json
PUT testindex1/_doc/1
{
  "title": " The Top 10 Shakespeare Poems",
  "description": "Top 10 sonnets of England's national poet and the Bard of Avon"
}
```
{% include copy-curl.html %}

```json
PUT testindex1/_doc/2
{
  "title": "Sonnets of the 16th Century",
  "body": "The poems written by various 16-th century poets"
}
```
{% include copy-curl.html %}

Use a `dis_max` query to search for documents that contain the words "Shakespeare poems":

```json
GET testindex1/_search
{
  "query": {
    "dis_max": {
      "queries": [
        { "match": { "title": "Shakespeare poems" }},
        { "match": { "body":  "Shakespeare poems" }}
      ]
    }
  }            
}
```
{% include copy-curl.html %}

The response contains both documents:

```json
{
  "took": 8,
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
    "max_score": 1.3862942,
    "hits": [
      {
        "_index": "testindex1",
        "_id": "1",
        "_score": 1.3862942,
        "_source": {
          "title": " The Top 10 Shakespeare Poems",
          "description": "Top 10 sonnets of England's national poet and the Bard of Avon"
        }
      },
      {
        "_index": "testindex1",
        "_id": "2",
        "_score": 0.2876821,
        "_source": {
          "title": "Sonnets of the 16th Century",
          "body": "The poems written by various 16-th century poets"
        }
      }
    ]
  }
}
```

## Parameters

The following table lists all top-level parameters supported by `dis_max` queries.

Parameter | Description
:--- | :---
`queries` | An array of one or more query clauses that are used to match documents. A document must match at least one query clause to be returned in the results. If a document matches multiple query clauses, the relevance score is set to the highest relevance score from all matching query clauses. Required.
`tie_breaker` | A floating-point factor between 0 and 1.0 that is used to give more weight to documents that match multiple query clauses. In this case, the relevance score of a document is calculated using the following algorithm: Take the highest relevance score from all matching query clauses, multiply the scores from all other matching clauses by the `tie_breaker` value, and add the relevance scores together, normalizing them. Optional. Default is 0 (which means only the highest score counts).
