---
layout: default
title: Query and filter context
nav_order: 5
redirect_from:
- /query-dsl/query-dsl/query-filter-context/
---

# Query and filter context

Queries consist of query clauses, which can be run in a [_filter context_](#filter-context) or [_query context_](#query-context). A query clause in a filter context asks the question "_Does_ the document match the query clause?" and returns matching documents. A query clause in a query context asks the question "_How well_ does the document match the query clause?", returns matching documents, and provides the relevance of each document in the form of a [_relevance score_](#relevance-score).

## Relevance score

A _relevance score_ measures how well a document matches a query. It is a positive floating-point number that OpenSearch records in the `_score` metadata field for each document:

```json
"hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "32437",
        "_score" : 18.781435,
        "_source" : {
          "type" : "line",
          "line_id" : 32438,
          "play_name" : "Hamlet",
          "speech_number" : 3,
          "line_number" : "1.1.3",
          "speaker" : "BERNARDO",
          "text_entry" : "Long live the king!"
        }
      },
...
```

A higher score indicates a more relevant document. While different query types calculate relevance scores differently, all query types take into account whether a query clause is run in a filter or query context. 

Use query clauses that you want to affect the relevance score in a query context, and use all other query clauses in a filter context.
{: .tip}

## Filter context

A query clause in a filter context asks the question "_Does_ the document match the query clause?", which has a binary answer. For example, if you have an index with student data, you might use a filter context to answer the following questions about a student:

- Is the student's `honors` status set to `true`?
- Is the student's `graduation_year` in the 2020--2022 range?

With a filter context, OpenSearch returns matching documents without calculating a relevance score. Thus, you should use a filter context for fields with exact values. 

To run a query clause in a filter context, pass it to a `filter` parameter. For example, the following Boolean query searches for students who graduated with honors in 2020--2022:

```json
GET students/_search
{
  "query": { 
    "bool": { 
      "filter": [ 
        { "term":  { "honors": true }},
        { "range": { "graduation_year": { "gte": 2020, "lte": 2022 }}}
      ]
    }
  }
}
```

To improve performance, OpenSearch caches frequently used filters.

## Query context

A query clause in a query context asks the question "_How well_ does the document match the query clause?", which does not have a binary answer. A query context is suitable for a full-text search, where you not only want to receive matching documents but also to determine the relevance of each document. For example, if you have an index with the complete works of Shakespeare, you might use a query context for the following searches:

- Find documents that contain the word `dream`, including its various forms (`dreaming` or `dreams`) and synonyms (`contemplate`).
- Find documents that match the words `long live king`.

With a query context, every matching document contains a relevance score in the `_score` field, which you can use to [sort]({{site.url}}{{site.baseurl}}/opensearch/search/sort) documents by relevance. 

To run a query clause in a query context, pass it to a `query` parameter. For example, the following query searches for documents that match the words `long live king` in the `shakespeare` index:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": "long live king"
    }
  }
}
```

Relevance scores are single-precision floating-point numbers with 24-bit significand precision. A loss of precision may occur if a score calculation exceeds the significand precision.
{: .note}