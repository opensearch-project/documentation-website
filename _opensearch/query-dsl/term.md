---
layout: default
title: Term-level queries
parent: Query DSL
nav_order: 30
---

# Term-level queries

Assume that you have the complete works of Shakespeare indexed in an OpenSearch cluster. We use a term-level query to search for the phrase "To be, or not to be" in the `text_entry` field:

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "text_entry": "To be, or not to be"
    }
  }
}
```

#### Sample response

```json
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 0,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  }
}
```

We don’t get back any matches (`hits`). This is because the term “To be, or not to be” is searched literally in the inverted index, where only the analyzed values of the text fields are stored. Term-level queries aren't suited for searching on analyzed text fields because they often yield unexpected results. When working with text data, use term-level queries only for fields mapped as keyword only.

Using a full-text query:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": "To be, or not to be"
    }
  }
}
```

The search query “To be, or not to be” is analyzed and tokenized into an array of tokens just like the `text_entry` field of the documents. The full-text query performs an intersection of tokens between our search query and the `text_entry` fields for all the documents, and then sorts the results by relevance scores:

#### Sample response

```json
{
  "took" : 19,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 10000,
      "relation" : "gte"
    },
    "max_score" : 17.419369,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "34229",
        "_score" : 17.419369,
        "_source" : {
          "type" : "line",
          "line_id" : 34230,
          "play_name" : "Hamlet",
          "speech_number" : 19,
          "line_number" : "3.1.64",
          "speaker" : "HAMLET",
          "text_entry" : "To be, or not to be: that is the question:"
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "109930",
        "_score" : 14.883024,
        "_source" : {
          "type" : "line",
          "line_id" : 109931,
          "play_name" : "A Winters Tale",
          "speech_number" : 23,
          "line_number" : "4.4.153",
          "speaker" : "PERDITA",
          "text_entry" : "Not like a corse; or if, not to be buried,"
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "103117",
        "_score" : 14.782743,
        "_source" : {
          "type" : "line",
          "line_id" : 103118,
          "play_name" : "Twelfth Night",
          "speech_number" : 53,
          "line_number" : "1.3.95",
          "speaker" : "SIR ANDREW",
          "text_entry" : "will not be seen; or if she be, its four to one"
        }
      }
    ]
  }
}
...
```

For a list of all full-text queries, see [Full-text queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/).

If you want to query for an exact term like “HAMLET” in the speaker field and don't need the results to be sorted by relevance scores, a term-level query is more efficient:

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "speaker": "HAMLET"
    }
  }
}
```

#### Sample response

```json
{
  "took" : 5,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1582,
      "relation" : "eq"
    },
    "max_score" : 4.2540946,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "32700",
        "_score" : 4.2540946,
        "_source" : {
          "type" : "line",
          "line_id" : 32701,
          "play_name" : "Hamlet",
          "speech_number" : 9,
          "line_number" : "1.2.66",
          "speaker" : "HAMLET",
          "text_entry" : "[Aside]  A little more than kin, and less than kind."
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "32702",
        "_score" : 4.2540946,
        "_source" : {
          "type" : "line",
          "line_id" : 32703,
          "play_name" : "Hamlet",
          "speech_number" : 11,
          "line_number" : "1.2.68",
          "speaker" : "HAMLET",
          "text_entry" : "Not so, my lord; I am too much i' the sun."
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "32709",
        "_score" : 4.2540946,
        "_source" : {
          "type" : "line",
          "line_id" : 32710,
          "play_name" : "Hamlet",
          "speech_number" : 13,
          "line_number" : "1.2.75",
          "speaker" : "HAMLET",
          "text_entry" : "Ay, madam, it is common."
        }
      }
    ]
  }
}
...
```

The term-level queries are exact matches. So, if you search for “Hamlet”, you don’t get back any matches, because “HAMLET” is a keyword field and is stored in OpenSearch literally and not in an analyzed form.
The search query “HAMLET” is also searched literally. So, to get a match on this field, we need to enter the exact same characters.

---

# Term-level query operations

This section provides examples of term-level query operations that you can use for specific search use cases.


## Single term

Use the `term` query to search for an exact term in a field.

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "line_id": {
        "value": "61809"
      }
    }
  }
}
```

## Multiple terms

Use the `terms` operation to search for multiple value matches for the same query field.

```json
GET shakespeare/_search
{
  "query": {
    "terms": {
      "line_id": [
        "61809",
        "61810"
      ]
    }
  }
}
```

You get back documents that match any of the terms.
#### Sample response

```json
{
  "took" : 11,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "61808",
        "_score" : 1.0,
        "_source" : {
          "type" : "line",
          "line_id" : 61809,
          "play_name" : "Merchant of Venice",
          "speech_number" : 33,
          "line_number" : "1.3.115",
          "speaker" : "SHYLOCK",
          "text_entry" : "Go to, then; you come to me, and you say"
        }
      },
      {
        "_index" : "shakespeare",
        "_id" : "61809",
        "_score" : 1.0,
        "_source" : {
          "type" : "line",
          "line_id" : 61810,
          "play_name" : "Merchant of Venice",
          "speech_number" : 33,
          "line_number" : "1.3.116",
          "speaker" : "SHYLOCK",
          "text_entry" : "Shylock, we would have moneys: you say so;"
        }
      }
    ]
  }
}
```

## Terms lookup query (TLQ)

Use a terms lookup query (TLQ) to retrieve multiple field values in a specific document within a specific index. Use the `terms` operation and specify the index name, document ID and field you want to look up with the `path` parameter.

Parameter | Behavior
:--- | :---
`index` | The index name that contains the document you want search.
`id` | The exact document to query for terms.
`path` | The field name for the query.

To get all the lines from a Shakespeare play for a role (or roles) specified in the index `play-assignments` for the document `42`:

```json
GET shakespeare/_search
{
  "query": {
    "terms": {
      "speaker": {
        "index": "play-assignments",
        "id": "42",
        "path": "role"
      }
    }
  }
}
```

## Document IDs

Use the `ids` query to search for one or more document ID values.

```json
GET shakespeare/_search
{
  "query": {
    "ids": {
      "values": [
        34229,
        91296
      ]
    }
  }
}
```

## Range of values

Use the `range` query to search for a range of values in a field.

To search for documents where the `line_id` value is >= 10 and <= 20:

```json
GET shakespeare/_search
{
  "query": {
    "range": {
      "line_id": {
        "gte": 10,
        "lte": 20
      }
    }
  }
}
```

Parameter | Behavior
:--- | :---
`gte` | Greater than or equal to.
`gt` | Greater than.
`lte` | Less than or equal to.
`lt` | Less than.

Assume that you have a `products` index and you want to find all the products that were added in the year 2019:

```json
GET products/_search
{
  "query": {
    "range": {
      "created": {
        "gte": "2019/01/01",
        "lte": "2019/12/31"
      }
    }
  }
}
```

Specify relative dates by using basic math expressions.

To subtract 1 year and 1 day from the specified date:

```json
GET products/_search
{
  "query": {
    "range": {
      "created": {
        "gte": "2019/01/01||-1y-1d"
      }
    }
  }
}
```

The first date that we specify is the anchor date or the starting point for the date math. Add two trailing pipe symbols. You could then add one day (`+1d`) or subtract two weeks (`-2w`). This math expression is relative to the anchor date that you specify.

You could also round off dates by adding a forward slash to the date or time unit.

To find products added in the last year and rounded off by month:

```json
GET products/_search
{
  "query": {
    "range": {
      "created": {
        "gte": "now-1y/M"
      }
    }
  }
}
```

The keyword `now` refers to the current date and time.

## Multiple terms by prefix

Use the `prefix` query to search for terms that begin with a specific prefix.

```json
GET shakespeare/_search
{
  "query": {
    "prefix": {
      "speaker": "KING"
    }
  }
}
```

## All instances of a specific field in a document

Use the `exists` query to search for documents that contain a specific field.

```json
GET shakespeare/_search
{
  "query": {
    "exists": {
      "field": "speaker"
    }
  }
}
```

## Wildcard patterns

Use wildcard queries to search for terms that match a wildcard pattern.

Feature | Behavior
:--- | :---
`*` | Specifies all valid values.
`?` | Specifies a single valid value.

To search for terms that start with `H` and end with `Y`:

```json
GET shakespeare/_search
{
  "query": {
    "wildcard": {
      "speaker": {
        "value": "H*Y"
      }
    }
  }
}
```

If we change `*` to `?`, we get no matches, because `?` refers to a single character.

Wildcard queries tend to be slow because they need to iterate over a lot of terms. Avoid placing wildcard characters at the beginning of a query because it could be a very expensive operation in terms of both resources and time.

## Regular expressions (Regex)

Use the `regexp` query to search for terms that match a regular expression.

This regular expression matches any single uppercase or lowercase letter:

```json
GET shakespeare/_search
{
  "query": {
    "regexp": {
      "play_name": "[a-zA-Z]amlet"
    }
  }
}
```

A few important notes:

- Regular expressions are applied to the terms in the field (i.e. tokens), not the entire field.
- Regular expressions use the Lucene syntax, which differs from more standardized implementations. Test thoroughly to ensure that you receive the results you expect. To learn more, see [the Lucene documentation](https://lucene.apache.org/core/8_9_0/core/index.html).
- `regexp` queries can be expensive operations and require the `search.allow_expensive_queries` setting to be set to `true`. Before making frequent `regexp` queries, test their impact on cluster performance and examine alternative queries for achieving similar results.
