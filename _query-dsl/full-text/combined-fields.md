---
layout: default
title: Combined fields
parent: Full-text queries
nav_order: 60
---

# Combined fields query
**Introduced 3.2**
{: .label .label-purple }

The `combined_fields` query treats multiple text fields as a unified field, using the BM25F algorithm for consistent relevance scoring. Unlike the [`cross_fields`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/multi-match/#cross-fields) type of `multi_match`, which executes separate queries per field, `combined_fields` processes all fields together, resulting in better performance and more accurate scoring. You can apply different field weights while maintaining unified scoring across all fields.

All fields in a `combined_fields` query must be `text` fields and must use the same text analyzer.
{: .note }

## Setup

To follow along with the examples, index some sample documents:

```json
POST /books/_bulk
{"index":{"_id":"1"}}
{"title":"Database Systems","description":"A comprehensive guide to database design and implementation"}
{"index":{"_id":"2"}}
{"title":"Introduction to Systems","description":"This book covers database architectures and distributed systems"}
```
{% include copy-curl.html %}

## Example

The following example demonstrates field weights in a `combined_fields` query. The query searches for "database systems" across the `title` and `description` fields, with the `title` field weighted four times as heavily as the `description` field:

```json
GET /books/_search
{
  "query": {
    "combined_fields": {
      "query": "database systems",
      "fields": ["title^4", "description"]
    }
  }
}
```
{% include copy-curl.html %}

The response shows that "Database Systems" scores significantly higher than "Introduction to Systems" because both query terms appear in the heavily weighted `title` field:

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
    "max_score": 0.2924412,
    "hits": [
      {
        "_index": "books",
        "_id": "1",
        "_score": 0.2924412,
        "_source": {
          "title": "Database Systems",
          "description": "A comprehensive guide to database design and implementation"
        }
      },
      {
        "_index": "books",
        "_id": "2",
        "_score": 0.2239699,
        "_source": {
          "title": "Introduction to Systems",
          "description": "This book covers database architectures and distributed systems"
        }
      }
    ]
  }
}
```

## Parameters

The following table lists the parameters for the `combined_fields` query.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `query` | String | The query string to search for. Required. |
| `fields` | Array of strings | The fields to search. Supports field name patterns and field weights using the `^` syntax (for example, `title^2`). Required. |
| `operator` | String | The Boolean logic used to interpret the query string. Valid values are `OR` (default) and `AND`. Optional. |
| `minimum_should_match` | String | The minimum number of terms that must match for a document to be returned. Can be an absolute number, a percentage, or a combination. For more information, see [Minimum should match]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/). Optional. |
| `boost` | Floating-point | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field's relevance. Values between 0.0 and 1.0 decrease the field's relevance. Default is 1.0. Optional. |
| `_name` | String | A name for the query that can be used to identify it in the response. Optional. |

## Using the AND operator

By default, the query uses the `OR` operator, meaning that documents matching any term in the query will be returned. You can change this to `AND` to require all terms to match:

```json
GET /books/_search
{
  "query": {
    "combined_fields": {
      "query": "introduction systems",
      "fields": ["title", "description"],
      "operator": "AND"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the only document in which both terms ("introduction" and "systems") appear in the combined fields:

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
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.4214915,
    "hits": [
      {
        "_index": "books",
        "_id": "2",
        "_score": 0.4214915,
        "_source": {
          "title": "Introduction to Systems",
          "description": "This book covers database architectures and distributed systems"
        }
      }
    ]
  }
}
```

## Using minimum_should_match

The `minimum_should_match` parameter lets you specify the minimum number of terms that must match for a document to be returned. For example, the following query requires at least 75% of the terms to match:

```json
GET /books/_search
{
  "query": {
    "combined_fields": {
      "query": "comprehensive database architectures book",
      "fields": ["title", "description"],
      "minimum_should_match": "75%"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the only document matching at least 3 of the 4 query terms (75%):

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
    "max_score": 0.6993829,
    "hits": [
      {
        "_index": "books",
        "_id": "2",
        "_score": 0.6993829,
        "_source": {
          "title": "Introduction to Systems",
          "description": "This book covers database architectures and distributed systems"
        }
      }
    ]
  }
}
```

## Comparison with multi_match cross_fields

The `combined_fields` query differs from `multi_match` with `type: cross_fields` in how it calculates relevance scores. While both query types search across multiple fields, `combined_fields` uses the BM25F algorithm to treat all fields as a single unified field for scoring purposes. This means that inverse document frequency (IDF) is calculated globally across all fields rather than per field, and term frequency normalization accounts for the combined length of all fields. This approach is particularly beneficial when you have fields of very different lengths, such as a short title field and a long body field, because it prevents shorter fields from being overweighted in the relevance calculation. Additionally, `combined_fields` uses term-centric matching, where query terms can be satisfied across any combination of fields, rather than requiring all terms to match within individual fields.

The following example compares the two approaches using the same query.

**Combined fields query**:

```json
GET /books/_search
{
  "query": {
    "combined_fields": {
      "query": "database systems",
      "fields": ["title", "description"]
    }
  }
}
```
{% include copy-curl.html %}

The `combined_fields` query calculates term frequency across all fields together, providing more accurate BM25F scoring:

```json
{
  "took": 6,
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
    "max_score": 0.20001775,
    "hits": [
      {
        "_index": "books",
        "_id": "1",
        "_score": 0.20001775,
        "_source": {
          "title": "Database Systems",
          "description": "A comprehensive guide to database design and implementation"
        }
      },
      {
        "_index": "books",
        "_id": "2",
        "_score": 0.19373488,
        "_source": {
          "title": "Introduction to Systems",
          "description": "This book covers database architectures and distributed systems"
        }
      }
    ]
  }
}
```

**Multi_match cross_fields query**:

```json
GET /books/_search
{
  "query": {
    "multi_match": {
      "query": "database systems",
      "fields": ["title", "description"],
      "type": "cross_fields"
    }
  }
}
```
{% include copy-curl.html %}

The `cross_fields` approach executes separate queries per field and then combines the results, which can lead to less precise scoring:

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
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.18051638,
    "hits": [
      {
        "_index": "books",
        "_id": "1",
        "_score": 0.18051638,
        "_source": {
          "title": "Database Systems",
          "description": "A comprehensive guide to database design and implementation"
        }
      },
      {
        "_index": "books",
        "_id": "2",
        "_score": 0.16574687,
        "_source": {
          "title": "Introduction to Systems",
          "description": "This book covers database architectures and distributed systems"
        }
      }
    ]
  }
}
```

Notice that the `combined_fields` query produces higher relevance scores (0.20001775 compared to 0.18051638 for the top result).

## Limitations

Note the following limitations for combined fields:

- All fields must have the same text analyzer.
- Only works with text fields.
- Does not support per-field boosts in the same way as `multi_match`; instead, use field weights.
