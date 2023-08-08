---
layout: default
title: Minimum should match
nav_order: 70
redirect_from:
- /query-dsl/query-dsl/minimum-should-match/
---

# Minimum should match 

The `minimum_should_match` parameter can be used for full-text search and specifies the minimum number of terms a document must match to be returned in search results. 

The following example requires a document to match at least two out of three search terms in order to be returned as a search result:

```json
GET /shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": {
        "query": "prince king star",
        "minimum_should_match": "2"
      }
    }
  }
}
```

In this example, the query has three optional clauses that are combined with an `OR`, so the document must match either `prince`, `king`, or `star`.

## Valid values

You can specify the `minimum_should_match` parameter as one of the following values.

Value type | Example | Description
:--- | :--- | :---
Non-negative integer | `2` | A document must match this number of optional clauses.
Negative integer | `-1` | A document must match the total number of optional clauses minus this number.
Non-negative percentage | `70%` | A document must match this percentage of the total number of optional clauses. The number of clauses to match is rounded down to the nearest integer.
Negative percentage | `-30%` | A document can have this percentage of the total number of optional clauses that do not match. The number of clauses a document is allowed to not match is rounded down to the nearest integer.
Combination | `2<75%` | Expression in the `n<p%` format. If the number of optional clauses is less than or equal to `n`, the document must match all optional clauses. If the number of optional clauses is greater than `n`, then the document must match the `p` percentage of optional clauses.
Multiple combinations | `3<-1 5<50%` | More than one combination separated by a space. Each condition applies to the number of optional clauses that is greater than the number on the left of the `<` sign. In this example, if there are three or fewer optional clauses, the document must match all of them. If there are four or five optional clauses, the document must match all but one of them. If there are 6 or more optional clauses, the document must match 50% of them.

Let `n` be the number of optional clauses a document must match. When `n` is calculated as a percentage, if `n` is less than 1, then 1 is used. If `n` is greater than the number of optional clauses, the number of optional clauses is used.
{: .note}


## Using the parameter in Boolean queries

A [Boolean query]({{site.url}}{{site.baseurl}}/) lists optional clauses in the `should` clause and required clauses in the `must` clause. Optionally, it can contain a `filter` clause to filter results.

Consider an example index containing the following five documents:

```json
PUT testindex/_doc/1
{
  "text": "one OpenSearch"
}
```
{% include copy-curl.html %}

```json
PUT testindex/_doc/2
{
  "text": "one two OpenSearch"
}
```
{% include copy-curl.html %}

```json
PUT testindex/_doc/3
{
  "text": "one two three OpenSearch"
}
```
{% include copy-curl.html %}

```json
PUT testindex/_doc/4
{
  "text": "one two three four OpenSearch"
}
```
{% include copy-curl.html %}

```json
PUT testindex/_doc/5
{
  "text": "OpenSearch"
}
```
{% include copy-curl.html %}

The following query contains four optional clauses:

```json
GET testindex/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "text": "OpenSearch"
          }
        }
      ], 
      "should": [
        {
          "match": {
            "text": "one"
          }
        },
        {
          "match": {
            "text": "two"
          }
        },
        {
          "match": {
            "text": "three"
          }
        },
        {
          "match": {
            "text": "four"
          }
        }
      ],
      "minimum_should_match": "80%"
    }
  }
}
```
{% include copy-curl.html %}

Because `minimum_should_match` is specified as `80%`, the number of optional clauses to match is calculated as 4 &middot; 0.8 = 3.2 and then rounded down to 3. Therefore, the results contain documents that match at least three clauses:

```json
{
  "took": 40,
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
    "max_score": 2.494999,
    "hits": [
      {
        "_index": "testindex",
        "_id": "4",
        "_score": 2.494999,
        "_source": {
          "text": "one two three four OpenSearch"
        }
      },
      {
        "_index": "testindex",
        "_id": "3",
        "_score": 1.5744598,
        "_source": {
          "text": "one two three OpenSearch"
        }
      }
    ]
  }
}
```

Now specify `minimum_should_match` as `-20%`:

```json
GET testindex/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "text": "OpenSearch"
          }
        }
      ], 
      "should": [
        {
          "match": {
            "text": "one"
          }
        },
        {
          "match": {
            "text": "two"
          }
        },
        {
          "match": {
            "text": "three"
          }
        },
        {
          "match": {
            "text": "four"
          }
        }
      ],
      "minimum_should_match": "-20%"
    }
  }
}
```
{% include copy-curl.html %}

The number of non-matching optional clauses that a document can have is calculated as 4 &middot; 0.2 = 0.8 and rounded down to 0. Thus, the results contain only one document that matches all optional clauses:

```json
{
  "took": 41,
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
    "max_score": 2.494999,
    "hits": [
      {
        "_index": "testindex",
        "_id": "4",
        "_score": 2.494999,
        "_source": {
          "text": "one two three four OpenSearch"
        }
      }
    ]
  }
}
```

Note that specifying a positive percentage (`80%`) and negative percentage (`-20%`) did not result in the same number of optional clauses a document must match because, in both cases, the result was rounded down. If the number of optional clauses were, for example, 5, then both `80%` and `-20%` would have produced the same number of optional clauses a document must match (4).

### Default `minimum_should_match` value 

If a query contains a `must` or `filter` clause, the default `minimum_should_match` value is 0. For example, the following query searches for documents that match `OpenSearch` and 0 optional `should` clauses:

```json
GET testindex/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "text": "OpenSearch"
          }
        }
      ], 
      "should": [
        {
          "match": {
            "text": "one"
          }
        },
        {
          "match": {
            "text": "two"
          }
        },
        {
          "match": {
            "text": "three"
          }
        },
        {
          "match": {
            "text": "four"
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

This query returns all five documents in the index:

```json
{
  "took": 34,
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
    "max_score": 2.494999,
    "hits": [
      {
        "_index": "testindex",
        "_id": "4",
        "_score": 2.494999,
        "_source": {
          "text": "one two three four OpenSearch"
        }
      },
      {
        "_index": "testindex",
        "_id": "3",
        "_score": 1.5744598,
        "_source": {
          "text": "one two three OpenSearch"
        }
      },
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 0.91368985,
        "_source": {
          "text": "one two OpenSearch"
        }
      },
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0.4338556,
        "_source": {
          "text": "one OpenSearch"
        }
      },
      {
        "_index": "testindex",
        "_id": "5",
        "_score": 0.11964063,
        "_source": {
          "text": "OpenSearch"
        }
      }
    ]
  }
}
```

However, if you omit the `must` clause, then the query searches for documents that match one optional `should` clause:

```json
GET testindex/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "text": "one"
          }
        },
        {
          "match": {
            "text": "two"
          }
        },
        {
          "match": {
            "text": "three"
          }
        },
        {
          "match": {
            "text": "four"
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The results contain only four documents that match at least one of the optional clauses:

```json
{
  "took": 19,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 2.426633,
    "hits": [
      {
        "_index": "testindex",
        "_id": "4",
        "_score": 2.426633,
        "_source": {
          "text": "one two three four OpenSearch"
        }
      },
      {
        "_index": "testindex",
        "_id": "3",
        "_score": 1.4978898,
        "_source": {
          "text": "one two three OpenSearch"
        }
      },
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 0.8266785,
        "_source": {
          "text": "one two OpenSearch"
        }
      },
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0.3331056,
        "_source": {
          "text": "one OpenSearch"
        }
      }
    ]
  }
}
```