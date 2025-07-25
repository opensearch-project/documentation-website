---
layout: default
title: Boolean queries
parent: Compound queries
grand_parent: Query DSL
nav_order: 10
permalink: /query-dsl/compound/bool/
redirect_from:
  - /opensearch/query-dsl/compound/bool/
canonical_url: https://docs.opensearch.org/latest/query-dsl/compound/bool/
---

# Boolean queries

You can perform a Boolean query with the `bool` query type. A Boolean query compounds query clauses so you can combine multiple search queries with Boolean logic. To narrow or broaden your search results, use the `bool` query clause rules.

As a compound query type, `bool` allows you to construct an advanced query by combining several simple queries.

Use the following rules to define how to combine multiple sub-query clauses within a `bool` query:

Clause rule | Behavior
:--- | :---
`must` | Logical `and` operator. The results must match the queries in this clause. If you have multiple queries, all of them must match.
`must_not` | Logical `not` operator. All matches are excluded from the results.
`should` | Logical `or` operator. The results must match at least one of the queries, but, optionally, they can match more than one query. Each matching `should` clause increases the relevancy score.  You can set the minimum number of queries that must match using the `minimum_number_should_match` parameter.
`minimum_number_should_match` | Optional parameter for use with a `should` query clause. Specifies the minimum number of queries that the document must match for it to be returned in the results. The default value is 1.
`filter` | Logical `and` operator that is applied first to reduce your dataset before applying the queries. A query within a filter clause is a yes or no option. If a document matches the query, it is returned in the results; otherwise, it is not. The results of a filter query are generally cached to allow for a faster return. Use the filter query to filter the results based on exact matches, ranges, dates, numbers, and so on.

### Boolean query structure

The structure of a Boolean query contains the `bool` query type followed by clause rules, as follows:

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

For example, assume you have the complete works of Shakespeare indexed in an OpenSearch cluster. You want to construct a single query that meets the following requirements:

1. The `text_entry` field must contain the word `love` and should contain either `life` or `grace`.
2. The `speaker` field must not contain `ROMEO`.
3. Filter these results to the play `Romeo and Juliet` without affecting the relevancy score.

Use the following query:

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

#### Sample output

```json
{
  "took": 12,
  "timed_out": false,
  "_shards": {
    "total": 4,
    "successful": 4,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 11.356054,
    "hits": [
      {
        "_index": "shakespeare",
        "_id": "88020",
        "_score": 11.356054,
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

If you want to identify which of these clauses actually caused the matching results, name each query with the `_name` parameter.
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

OpenSearch returns a `matched_queries` array that lists the queries that matched these results:

```json
"matched_queries": [
  "love-must",
  "life-should"
]
```

If you remove the queries not in this list, you will still see the exact same result.
By examining which `should` clause matched, you can better understand the relevancy score of the results.

You can also construct complex Boolean expressions by nesting `bool` queries.
For example, to find a `text_entry` field that matches (`love` OR `hate`) AND (`life` OR `grace`) in the play `Romeo and Juliet`:

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
                  "text": "hate"
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
                  "text": "grace"
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

#### Sample output

```json
{
  "took": 10,
  "timed_out": false,
  "_shards": {
    "total": 2,
    "successful": 2,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 1,
    "max_score": 11.37006,
    "hits": [
      {
        "_index": "shakespeare",
        "_type": "doc",
        "_id": "88020",
        "_score": 11.37006,
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
