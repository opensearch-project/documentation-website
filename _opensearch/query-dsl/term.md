---
layout: default
title: Term-level queries
parent: Query DSL
nav_order: 70
---

# Term-level queries

Term-level queries search an index for all documents that contain a search term. Documents returned by a term-level query are not sorted by their relevance scores.

When working with text data, use term-level queries for fields mapped as keyword only.

Term-level queries are not suited for searching analyzed text fields. To return analyzed fields, use a full-text query.

## Term-level query types

You can use any of the term-level query types shown in the following table:

| Query type | Description
:--- | :--- | :---
`term` | Specifies a search for an exact term in the field provided.
`terms` | Specifies a search for multiple terms in the same provided field.
`ids` | Specifies a search for one or more documents by the ID value.
`range` | Specifies a search within an upper and lower bound of values in a provided field.
`prefix` | Specifies a search for terms that begin with a prefix.
`exists` | Specifies a search for documents that contain a specific field.
`wildcard` | Specifies a search for terms that match a wildcard pattern. Indicate matching zero or more characters with an asterisk (*) or a single character by a question mark (?).
`regexp` | Specifies a search for terms that match a regular expression.
`terms_set` | Similar to a `terms` query, but you specify the number of matching terms that are required to return a document.

## Should I use a full-text or a term-level query?

To see the difference between full-text and term-level queries in action, consider the following two example requests that search for a specific text phrase. The complete works of Shakespeare are indexed in an OpenSearch cluster.

#### Sample request

The following term-level query searches the documents for the phrase "To be, or not to be" in the `text_entry` field:

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

The response contains no matches, indicated by zero `hits`. This is because the term “To be, or not to be” is searched literally in the inverted index, where only the analyzed values of the text fields are stored.

#### Sample request

The following full-text query searches the analyzed text field values:

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

## Term

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

## Terms

Use the `terms` query to search for multiple terms in the same field.

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

## IDs

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

## Range query

You can search for a range of values in a field with the `range` query.

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

In addition to the range query parameters, you can provide date formats or relation operators such as "contains" or "within." To see the supported field types for range queries, see [Range query optional parameters]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/range/#range-query). To see all date formats, see [Formats]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/#formats).
{: .tip }

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

Specify relative dates by using [date math]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/#date-math).

To subtract 1 year and 1 day from the specified date, use the following query:

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

## Prefix

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

## Exists

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

## Wildcards

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

## Regex

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
