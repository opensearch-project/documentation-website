---
layout: default
title: Boolean queries
parent: Compound queries
grand_parent: Query DSL
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/query-dsl/compound/bool/
---

# Boolean queries

The `bool` query lets you combine multiple search queries with boolean logic. You can use boolean logic between queries to either narrow or broaden your search results.

The `bool` query is a go-to query because it allows you to construct an advanced query by chaining together several simple ones.

Use the following clauses (subqueries) within the `bool` query:

Clause | Behavior
:--- | :---
`must` | The results must match the queries in this clause. If you have multiple queries, every single one must match. Acts as an `and` operator.
`must_not` | This is the anti-must clause. All matches are excluded from the results. Acts as a `not` operator.
`should` | The results should, but don't have to, match the queries. Each matching `should` clause increases the relevancy score. As an option, you can require one or more queries to match the value of the `minimum_number_should_match` parameter (default is 1).
`filter` | Filters reduce your dataset before applying the queries. A query within a filter clause is a yes-no option, where if a document matches the query it's included in the results. Otherwise, it's not. Filter queries do not affect the relevancy score that the results are sorted by. The results of a filter query are generally cached so they tend to run faster. Use the filter query to filter the results based on exact matches, ranges, dates, numbers, and so on.

The structure of a `bool` query is as follows:

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

You can also construct complex boolean expressions by nesting `bool` queries.
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
