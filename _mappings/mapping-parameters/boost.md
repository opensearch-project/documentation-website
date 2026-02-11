---
layout: default
title: Boost
parent: Mapping parameters
redirect_from:
  - /field-types/mapping-parameters/boost/
nav_order: 10
has_children: false
has_toc: false
canonical_url: https://docs.opensearch.org/latest/mappings/mapping-parameters/boost/
---

# Boost

The `boost` mapping parameter is used to increase or decrease the relevance score of a field during search queries. It allows you to apply more or less weight to specific fields when calculating the overall relevance score of a document.

The `boost` parameter is applied as a multiplier to the score of a field. For example, if a field has a `boost` value of `2`, then the score contribution of that field is doubled. Conversely, a `boost` value of `0.5` would halve the score contribution of that field.

When using the `boost` parameter, it is recommended that you start with small values (1.5 or 2) and test the effect on your search results. Overly high boost values can skew the relevance scores and lead to unexpected or undesirable search results.

The boost parameter only applies to [term-level queries]({{site.url}}{{site.baseurl}}/query-dsl/term/). It does not apply to `prefix`, `range`, or `fuzzy` term-level queries.
{: .note}

## Index-time and query-time boosting

While you can set boost values in field mappings (index-time boosting), this is not recommended. Instead, use query-time boosting, which offers several advantages:

- **Flexibility**: Query-time boosting allows you to adjust boost values without reindexing documents.

- **Precision**: Index-time boosts are stored as part of the [`norms`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/norms/), which uses only 1 byte. This can reduce the resolution of field length normalization.

- **Dynamic control**: Query-time boosting gives you the ability to experiment with different boost values for different use cases.

## Example

Use the `boost` parameter to give more weight to certain fields. For instance, boosting the `title` field more than the `description` field can improve results if the title is a stronger indicator of relevance.

In this example, the `title` field has a boost of `2`, so it contributes twice as much to the relevance score than the `description` field (which has a default boost of `1`). 

### Index-time boosting (not recommended)

Create an index with boosted fields (for demonstration purposes only):

```json
PUT /article_index
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "boost": 2
      },
      "description": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

Add some sample documents to the index:

```json
PUT /article_index/_doc/1
{
  "title": "Introduction to Machine Learning",
  "description": "This article covers basic algorithms and their applications in data science."
}
```
{% include copy-curl.html %}

```json
PUT /article_index/_doc/2
{
  "title": "Data Science Fundamentals",
  "description": "Learn about machine learning algorithms and statistical methods for analyzing data."
}
```
{% include copy-curl.html %}

Search across both fields using index-time boosting:

```json
POST /article_index/_search
{
  "query": {
    "multi_match": {
      "query": "machine learning algorithms",
      "fields": ["title", "description"]
    }
  }
}
```
{% include copy-curl.html %}

Document 1 is scored higher because "machine learning" appears in the boosted `title` field. Document 2 is scored lower because "machine learning" appears in the unboosted `description` field. Both documents contain "algorithms", which contributes to their scores:

<p id="index-time-response"></p>

```json
{
  "took": 415,
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
    "max_score": 1.1906823,
    "hits": [
      {
        "_index": "article_index",
        "_id": "1",
        "_score": 1.1906823,
        "_source": {
          "title": "Introduction to Machine Learning",
          "description": "This article covers basic algorithms and their applications in data science."
        }
      },
      {
        "_index": "article_index",
        "_id": "2",
        "_score": 0.7130072,
        "_source": {
          "title": "Data Science Fundamentals",
          "description": "Learn about machine learning algorithms and statistical methods for analyzing data."
        }
      }
    ]
  }
}
```

### Query-time boosting (recommended)

Instead of index-time boosting, use query-time boosting for better control and flexibility. Query-time boosting doesn't require any special field mappings to be configured.

Add some sample documents to the index:

```json
PUT /article_index_2/_doc/1
{
  "title": "Introduction to Machine Learning",
  "description": "This article covers basic algorithms and their applications in data science."
}
```
{% include copy-curl.html %}

```json
PUT /article_index_2/_doc/2
{
  "title": "Data Science Fundamentals",
  "description": "Learn about machine learning algorithms and statistical methods for analyzing data."
}
```
{% include copy-curl.html %}

First, search the `title` field without boosting:

```json
POST /article_index_2/_search
{
  "query": {
    "match": {
      "title": {
        "query": "machine learning algorithms"
      }
    }
  }
}
```
{% include copy-curl.html %}

The matching document has a score of 0.59:

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
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.59534115,
    "hits": [
      {
        "_index": "article_index_2",
        "_id": "1",
        "_score": 0.59534115,
        "_source": {
          "title": "Introduction to Machine Learning",
          "description": "This article covers basic algorithms and their applications in data science."
        }
      }
    ]
  }
}
```

Next, search the same field with boosting:

```json
POST /article_index_2/_search
{
  "query": {
    "match": {
      "title": {
        "query": "machine learning algorithms",
        "boost": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

The document score is doubled:

```json
{
  "took": 16,
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
    "max_score": 1.1906823,
    "hits": [
      {
        "_index": "article_index_2",
        "_id": "1",
        "_score": 1.1906823,
        "_source": {
          "title": "Introduction to Machine Learning",
          "description": "This article covers basic algorithms and their applications in data science."
        }
      }
    ]
  }
}
```

To get a baseline for searching both the `title` and `description` fields, first search without boosting:

```json
POST /article_index_2/_search
{
  "query": {
    "multi_match": {
      "query": "machine learning algorithms",
      "fields": ["title", "description"]
    }
  }
}
```
{% include copy-curl.html %}

Document 2 is scored higher than Document 1:

```json
{
  "took": 10,
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
    "max_score": 0.7130072,
    "hits": [
      {
        "_index": "article_index_2",
        "_id": "2",
        "_score": 0.7130072,
        "_source": {
          "title": "Data Science Fundamentals",
          "description": "Learn about machine learning algorithms and statistical methods for analyzing data."
        }
      },
      {
        "_index": "article_index_2",
        "_id": "1",
        "_score": 0.59534115,
        "_source": {
          "title": "Introduction to Machine Learning",
          "description": "This article covers basic algorithms and their applications in data science."
        }
      }
    ]
  }
}
```

To compare index-time boosting with query-time boosting, search multiple fields with query-time boosting:

```json
POST /article_index_2/_search
{
  "query": {
    "multi_match": {
      "query": "machine learning algorithms",
      "fields": ["title^2", "description"]
    }
  }
}
```
{% include copy-curl.html %}

This query produces the same response as the [index-time boosting query](#index-time-response), with Document 1 now scoring higher than Document 2:

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
    "max_score": 1.1906823,
    "hits": [
      {
        "_index": "article_index_2",
        "_id": "1",
        "_score": 1.1906823,
        "_source": {
          "title": "Introduction to Machine Learning",
          "description": "This article covers basic algorithms and their applications in data science."
        }
      },
      {
        "_index": "article_index_2",
        "_id": "2",
        "_score": 0.7130072,
        "_source": {
          "title": "Data Science Fundamentals",
          "description": "Learn about machine learning algorithms and statistical methods for analyzing data."
        }
      }
    ]
  }
}
```
