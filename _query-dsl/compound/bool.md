---
layout: default
title: Boolean
parent: Compound queries
nav_order: 10
redirect_from:
  - /opensearch/query-dsl/compound/bool/
  - /opensearch/query-dsl/bool/
  - /query-dsl/query-dsl/compound/bool/
---

# Boolean query

A Boolean (`bool`) query can combine several query clauses into one advanced query. The clauses are combined with Boolean logic to find matching documents returned in the results.

Use the following query clauses within a `bool` query:

Clause | Behavior
:--- | :---
`must` | Logical `and` operator. The results must match all queries in this clause. 
`must_not` | Logical `not` operator. All matches are excluded from the results. If `must_not` has multiple clauses, only documents that do not match any of those clauses are returned. For example, `"must_not":[{clause_A}, {clause_B}]` is equivalent to `NOT(A OR B)`. 
`should` | Logical `or` operator. Matching more `should` clauses increases the document's relevance score. You can set the minimum number of queries that must match using the [`minimum_should_match`]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/) parameter. If a query contains a `must` or `filter` clause, the default `minimum_should_match` value is 0, so documents are not required to match any `should` clause. Otherwise, the default `minimum_should_match` value is 1, so the results must match at least one of the queries.
`filter` | Logical `and` operator that does not affect the relevance score. A query within a filter clause is a yes or no option. If a document matches the query, it is returned in the results; otherwise, it is not. The results of a filter query are generally cached to allow for a faster return. Use the filter query to filter the results based on exact matches, ranges, dates, or numbers.

The `must` and `should` clauses run in [query context]({{site.url}}{{site.baseurl}}/query-dsl/query-filter-context/), so the scores of all matching `must` and `should` clauses are added together to produce the document's relevance score. A document that matches more clauses therefore ranks higher. The `filter` and `must_not` clauses run in filter context: they determine whether a document matches but do not contribute to its score, and OpenSearch can cache their results.

A Boolean query has the following structure:

```json
GET _search
{
  "query": {
    "bool": {
      "must": [
        {}
      ],
      "must_not": [
        {}
      ],
      "should": [
        {}
      ],
      "filter": {}
    }
  }
}
```

## Parameters

The `bool` query accepts the following parameters. All parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`must` | Object or array of objects | Queries that documents must match. Matching queries contribute to the relevance score.
`should` | Object or array of objects | Queries that documents should match. Each matching query adds to the relevance score. Whether a document must match any of these queries depends on `minimum_should_match`.
`filter` | Object or array of objects | Queries that documents must match. These queries run in filter context and do not contribute to the relevance score.
`must_not` | Object or array of objects | Queries that documents must not match. These queries run in filter context and do not contribute to the relevance score.
`minimum_should_match` | Integer or string | The number or percentage of `should` clauses that a document must match. Default is `0` if the query contains a `must` or `filter` clause and `1` otherwise. For valid values, see [Minimum should match]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/).
`boost` | Floating-point | A multiplier applied to the relevance score of the whole `bool` query. Values between 0 and 1 decrease relevance, and values greater than 1 increase relevance. Because `filter` and `must_not` clauses do not contribute to the score, `boost` has no effect on a query that contains only these clauses. Default is `1.0`.

## Example

For example, assume you have the complete works of Shakespeare indexed in an OpenSearch cluster. You want to construct a single query that meets the following requirements:

1. The `text_entry` field must contain the word `love` and should contain either `life` or `grace`.
2. The `speaker` field must not contain `ROMEO`.
3. Filter these results to the play `Romeo and Juliet` without affecting the relevance score.

These requirements can be combined in the following query:

```json
GET shakespeare/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "text_entry": "love"
          }
        }
      ],
      "should": [
        {
          "match": {
            "text_entry": "life"
          }
        },
        {
          "match": {
            "text_entry": "grace"
          }
        }
      ],
      "minimum_should_match": 1,
      "must_not": [
        {
          "match": {
            "speaker": "ROMEO"
          }
        }
      ],
      "filter": {
        "term": {
          "play_name": "Romeo and Juliet"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains matching documents:

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
      "value": 1,
      "relation": "eq"
    },
    "max_score": 5.1232996,
    "hits": [
      {
        "_index": "shakespeare",
        "_id": "88020",
        "_score": 5.1232996,
        "_source": {
          "type": "line",
          "line_id": 88021,
          "play_name": "Romeo and Juliet",
          "speech_number": 19,
          "line_number": "4.5.61",
          "speaker": "PARIS",
          "text_entry": "O love! O life! not life, but love in death!"
        }
      }
    ]
  }
}
```

If you want to identify which of these clauses actually caused the matching results, name each query with the `_name` parameter. For more information, see [Named queries]({{site.url}}{{site.baseurl}}/query-dsl/named-queries/).
To add the `_name` parameter, change the field name in the `match` query to an object:

```json
GET shakespeare/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "text_entry": {
              "query": "love",
              "_name": "love-must"
            }
          }
        }
      ],
      "should": [
        {
          "match": {
            "text_entry": {
              "query": "life",
              "_name": "life-should"
            }
          }
        },
        {
          "match": {
            "text_entry": {
              "query": "grace",
              "_name": "grace-should"
            }
          }
        }
      ],
      "minimum_should_match": 1,
      "must_not": [
        {
          "match": {
            "speaker": {
              "query": "ROMEO",
              "_name": "ROMEO-must-not"
            }
          }
        }
      ],
      "filter": {
        "term": {
          "play_name": "Romeo and Juliet"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

OpenSearch returns a `matched_queries` array that lists the queries that matched these results:

```json
"matched_queries": [
  "love-must",
  "life-should"
]
```

If you remove the queries not in this list, you will still see the exact same result.
By examining which `should` clause matched, you can better understand the relevance score of the results.

You can also construct complex Boolean expressions by nesting `bool` queries.
For example, use the following query to find a `text_entry` field that matches (`love` OR `hate`) AND (`life` OR `grace`) in the play `Romeo and Juliet`:

```json
GET shakespeare/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "bool": {
            "should": [
              {
                "match": {
                  "text_entry": "love"
                }
              },
              {
                "match": {
                  "text_entry": "hate"
                }
              }
            ]
          }
        },
        {
          "bool": {
            "should": [
              {
                "match": {
                  "text_entry": "life"
                }
              },
              {
                "match": {
                  "text_entry": "grace"
                }
              }
            ]
          }
        }
      ],
      "filter": {
        "term": {
          "play_name": "Romeo and Juliet"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains three matching lines:

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
      "value": 3,
      "relation": "eq"
    },
    "max_score": 5.557603,
    "hits": [
      {
        "_index": "shakespeare",
        "_id": "86436",
        "_score": 5.557603,
        "_source": {
          "type": "line",
          "line_id": 86437,
          "play_name": "Romeo and Juliet",
          "speech_number": 16,
          "line_number": "2.3.88",
          "speaker": "ROMEO",
          "text_entry": "Doth grace for grace and love for love allow;"
        }
      },
      {
        "_index": "shakespeare",
        "_id": "88020",
        "_score": 5.1232996,
        "_source": {
          "type": "line",
          "line_id": 88021,
          "play_name": "Romeo and Juliet",
          "speech_number": 19,
          "line_number": "4.5.61",
          "speaker": "PARIS",
          "text_entry": "O love! O life! not life, but love in death!"
        }
      },
      {
        "_index": "shakespeare",
        "_id": "86214",
        "_score": 5.0415897,
        "_source": {
          "type": "line",
          "line_id": 86215,
          "play_name": "Romeo and Juliet",
          "speech_number": 17,
          "line_number": "2.2.81",
          "speaker": "ROMEO",
          "text_entry": "My life were better ended by their hate,"
        }
      }
    ]
  }
}
```

## Scoring with filter clauses

Queries in a `filter` clause decide which documents match but do not add to the relevance score. The score depends only on the scoring clauses (`must` and `should`) in the query. The following examples use a `support_tickets` index. Create the index and map the `status` field as a `keyword` field so that the `term` query matches it exactly:

```json
PUT support_tickets
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "status": { "type": "keyword" }
    }
  }
}
```
{% include copy-curl.html %}

Index the following documents:

```json
POST support_tickets/_bulk?refresh
{ "index": { "_id": "1" } }
{ "title": "Login page times out", "status": "open" }
{ "index": { "_id": "2" } }
{ "title": "Password reset email not received", "status": "open" }
{ "index": { "_id": "3" } }
{ "title": "Dashboard loads slowly", "status": "closed" }
```
{% include copy-curl.html %}

Each of the following three queries returns the two open tickets. They differ only in the scores they assign.

The following query contains only a `filter` clause. Because there is no scoring clause, every matching document receives a score of `0`:

```json
GET support_tickets/_search
{
  "query": {
    "bool": {
      "filter": {
        "term": {
          "status": "open"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The following query adds a `match_all` query in a `must` clause. The `match_all` query assigns a score of `1` to every document, so both open tickets receive a score of `1`:

```json
GET support_tickets/_search
{
  "query": {
    "bool": {
      "must": {
        "match_all": {}
      },
      "filter": {
        "term": {
          "status": "open"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The following [`constant_score`]({{site.url}}{{site.baseurl}}/query-dsl/compound/constant-score/) query returns the same results as the preceding query. It assigns a score of `1` to every document that matches its filter:

```json
GET support_tickets/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "term": {
          "status": "open"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

When the `must` clause contains a full-text query, the filter still does not change the score. For example, a `match` query for `login` in the `title` field assigns ticket 1 a score of `0.44583148`, whether or not the query also contains the `status` filter.
