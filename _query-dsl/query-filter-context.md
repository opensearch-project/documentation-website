---
layout: default
title: Query and filter context
nav_order: 5
redirect_from:
  - /opensearch/query-dsl/query-filter-context/
  - /query-dsl/query-dsl/query-filter-context/
---

# Query and filter context

Queries consist of query clauses, which can be run in a [_filter context_](#filter-context) or [_query context_](#query-context). A query clause in a filter context asks the question "_Does_ the document match the query clause?" and returns matching documents. A query clause in a query context asks the question "_How well_ does the document match the query clause?", returns matching documents, and provides the relevance of each document in the form of a [_relevance score_](#relevance-score).

## Relevance score

A _relevance score_ measures how well a document matches a query. It is a positive floating-point number that OpenSearch records in the `_score` metadata field for each document:

```json
"hits": [
  {
    "_index": "blog-posts",
    "_id": "1",
    "_score": 0.16890505,
    "_source": {
      "title": "Getting started with vector search",
      "content": "Vector search finds documents with similar meaning by comparing embeddings.",
      "status": "published",
      "publish_date": "2025-03-10"
    }
  },
  ...
]
```

A higher score indicates a more relevant document. While different query types calculate relevance scores differently, all query types take into account whether a query clause is run in a filter or query context.

Use query clauses that you want to affect the relevance score in a query context, and use all other query clauses in a filter context.
{: .tip}

## Sample data

The examples on this page use an index of blog posts. To try the examples, create the index:

```json
PUT blog-posts
{
  "mappings": {
    "properties": {
      "title":        { "type": "text" },
      "content":      { "type": "text" },
      "status":       { "type": "keyword" },
      "publish_date": { "type": "date" }
    }
  }
}
```
{% include copy-curl.html %}

Add sample documents to the index:

```json
POST blog-posts/_bulk?refresh=true
{ "index": { "_id": "1" } }
{ "title": "Getting started with vector search", "content": "Vector search finds documents with similar meaning by comparing embeddings.", "status": "published", "publish_date": "2025-03-10" }
{ "index": { "_id": "2" } }
{ "title": "Tuning vector search performance", "content": "Learn how to tune vector search using quantization and caching.", "status": "published", "publish_date": "2025-06-02" }
{ "index": { "_id": "3" } }
{ "title": "Keyword search basics", "content": "Keyword search matches the exact terms in your query.", "status": "published", "publish_date": "2025-01-20" }
{ "index": { "_id": "4" } }
{ "title": "Hybrid search explained", "content": "Hybrid search combines keyword search and vector search results.", "status": "draft", "publish_date": "2025-08-15" }
{ "index": { "_id": "5" } }
{ "title": "A year of vector search", "content": "A look back at the vector search features released in 2024.", "status": "published", "publish_date": "2024-11-05" }
```
{% include copy-curl.html %}

## Filter context

A query clause in a filter context asks the question "_Does_ the document match the query clause?", which has a binary answer. For example, you might use a filter context to answer the following questions about a blog post:

- Is the post's `status` set to `published`?
- Is the post's `publish_date` in 2025?

With a filter context, OpenSearch returns matching documents without calculating a relevance score. Thus, you should use a filter context for fields with exact values.

To run a query clause in a filter context, pass it to a `filter` parameter. For example, the following Boolean query searches for posts published in 2025:

```json
GET blog-posts/_search
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "status": "published" }},
        { "range": { "publish_date": { "gte": "2025-01-01", "lte": "2025-12-31" }}}
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response contains the three published posts from 2025. Every document has a `_score` of `0.0` because filter clauses do not calculate relevance:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

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
      "value": 3,
      "relation": "eq"
    },
    "max_score": 0.0,
    "hits": [
      {
        "_index": "blog-posts",
        "_id": "1",
        "_score": 0.0,
        "_source": {
          "title": "Getting started with vector search",
          "content": "Vector search finds documents with similar meaning by comparing embeddings.",
          "status": "published",
          "publish_date": "2025-03-10"
        }
      },
      {
        "_index": "blog-posts",
        "_id": "2",
        "_score": 0.0,
        "_source": {
          "title": "Tuning vector search performance",
          "content": "Learn how to tune vector search using quantization and caching.",
          "status": "published",
          "publish_date": "2025-06-02"
        }
      },
      {
        "_index": "blog-posts",
        "_id": "3",
        "_score": 0.0,
        "_source": {
          "title": "Keyword search basics",
          "content": "Keyword search matches the exact terms in your query.",
          "status": "published",
          "publish_date": "2025-01-20"
        }
      }
    ]
  }
}
```
</details>

To improve performance, OpenSearch caches frequently used filters.

## Query context

A query clause in a query context asks the question "_How well_ does the document match the query clause?", which does not have a binary answer. A query context is suitable for a full-text search, where you not only want to receive matching documents but also to determine the relevance of each document. For example, you might use a query context to find blog posts about vector search.

With a query context, every matching document contains a relevance score in the `_score` field, which you can use to [sort]({{site.url}}{{site.baseurl}}/opensearch/search/sort/) documents by relevance.

To run a query clause in a query context, pass it to a `query` parameter. For example, the following query searches for posts whose content matches the words `vector search`:

```json
GET blog-posts/_search
{
  "query": {
    "match": {
      "content": "vector search"
    }
  }
}
```
{% include copy-curl.html %}

The response contains all five posts because each one contains at least one of the words. The posts are sorted by relevance score. Document 4 has the highest score because it contains `search` three times, and document 3 has the lowest score because it contains only `search`:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

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
      "value": 5,
      "relation": "eq"
    },
    "max_score": 0.1985399,
    "hits": [
      {
        "_index": "blog-posts",
        "_id": "4",
        "_score": 0.1985399,
        "_source": {
          "title": "Hybrid search explained",
          "content": "Hybrid search combines keyword search and vector search results.",
          "status": "draft",
          "publish_date": "2025-08-15"
        }
      },
      {
        "_index": "blog-posts",
        "_id": "1",
        "_score": 0.16890505,
        "_source": {
          "title": "Getting started with vector search",
          "content": "Vector search finds documents with similar meaning by comparing embeddings.",
          "status": "published",
          "publish_date": "2025-03-10"
        }
      },
      {
        "_index": "blog-posts",
        "_id": "2",
        "_score": 0.16890505,
        "_source": {
          "title": "Tuning vector search performance",
          "content": "Learn how to tune vector search using quantization and caching.",
          "status": "published",
          "publish_date": "2025-06-02"
        }
      },
      {
        "_index": "blog-posts",
        "_id": "5",
        "_score": 0.16219063,
        "_source": {
          "title": "A year of vector search",
          "content": "A look back at the vector search features released in 2024.",
          "status": "published",
          "publish_date": "2024-11-05"
        }
      },
      {
        "_index": "blog-posts",
        "_id": "3",
        "_score": 0.040917058,
        "_source": {
          "title": "Keyword search basics",
          "content": "Keyword search matches the exact terms in your query.",
          "status": "published",
          "publish_date": "2025-01-20"
        }
      }
    ]
  }
}
```
</details>

Relevance scores are single-precision floating-point numbers with 24-bit significand precision. A loss of precision may occur if a score calculation exceeds the significand precision.
{: .note}

## Combining query and filter contexts

A single Boolean query can contain clauses in both contexts. Clauses in the `must` and `should` parameters run in a query context and contribute to the `_score`. Clauses in the `filter` and `must_not` parameters run in a filter context and only include or exclude documents. For more information, see [Boolean query]({{site.url}}{{site.baseurl}}/query-dsl/compound/bool/).

The following query combines the two preceding examples. The `match` clause in the `must` parameter calculates the relevance score, and the `term` and `range` clauses in the `filter` parameter limit the results to posts published in 2025:

```json
GET blog-posts/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "content": "vector search" }}
      ],
      "filter": [
        { "term": { "status": "published" }},
        { "range": { "publish_date": { "gte": "2025-01-01", "lte": "2025-12-31" }}}
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response contains the same three documents as the filter context example, sorted by relevance. Document 4 is excluded because it is a draft, and document 5 is excluded because it was published in 2024. Each document has the same `_score` as in the query context example because the filter clauses do not affect the score:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

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
      "value": 3,
      "relation": "eq"
    },
    "max_score": 0.16890505,
    "hits": [
      {
        "_index": "blog-posts",
        "_id": "1",
        "_score": 0.16890505,
        "_source": {
          "title": "Getting started with vector search",
          "content": "Vector search finds documents with similar meaning by comparing embeddings.",
          "status": "published",
          "publish_date": "2025-03-10"
        }
      },
      {
        "_index": "blog-posts",
        "_id": "2",
        "_score": 0.16890505,
        "_source": {
          "title": "Tuning vector search performance",
          "content": "Learn how to tune vector search using quantization and caching.",
          "status": "published",
          "publish_date": "2025-06-02"
        }
      },
      {
        "_index": "blog-posts",
        "_id": "3",
        "_score": 0.040917058,
        "_source": {
          "title": "Keyword search basics",
          "content": "Keyword search matches the exact terms in your query.",
          "status": "published",
          "publish_date": "2025-01-20"
        }
      }
    ]
  }
}
```
</details>
