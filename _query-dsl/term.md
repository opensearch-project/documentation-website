---
layout: default
title: Term-level queries
nav_order: 20
redirect_from: 
  - /opensearch/query-dsl/term/
  - /query-dsl/query-dsl/term/
---

# Term-level queries

Term-level queries search an index for documents that contain an exact search term. Documents returned by a term-level query are not sorted by their relevance scores.

When working with text data, use term-level queries for fields mapped as `keyword` only.

Term-level queries are not suited for searching analyzed text fields. To return analyzed fields, use a [full-text query]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text).

## Term-level query types

The following table lists all term-level query types.

| Query type | Description
:--- | :--- | :---
[`term`](#term) | Searches for documents with an exact term in a specific field.
[`terms`](#terms) | Searches for documents with one or more terms in a specific field.
[`terms_set`](#terms-set) | Searches for documents that match a minimum number of terms in a specific field.
[`ids`](#ids) | Searches for documents by document ID.
[`range`](#range) | Searches for documents with field values in a specific range.
[`prefix`](#prefix) | Searches for documents with terms that begin with a specific prefix.
[`exists`](#exists) | Searches for documents with any indexed value in a specific field.
[`fuzzy`](#fuzzy) | Searches for documents with terms that are similar to the search term within the maximum allowed [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance). The Levenshtein distance measures the number of one-character changes needed to change one term to another term.
[`wildcard`](#wildcard) | Searches for documents with terms that match a wildcard pattern. 
[`regexp`](#regexp) | Searches for documents with terms that match a regular expression.

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
{% include copy-curl.html %}

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
{% include copy-curl.html %}

You get back documents that match any of the terms.

## Terms set

With a terms set query, you can search for documents that match a minimum number of exact terms in a specified field. The `terms_set` query is similar to the `terms` query, but you can specify the minimum number of matching terms that are required to return a document. You can specify this number either in a field in the index or with a script.

As an example, consider an index that contains students with classes they have taken. When setting up the mapping for this index, you need to provide a [numeric]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric) field that specifies the minimum number of matching terms that are required to return a document:

```json
PUT students
{
  "mappings": {
    "properties": {
      "name": {
        "type": "keyword"
      },
      "classes": {
        "type": "keyword"
      },
      "min_required": {
        "type": "integer"
      }
    }
  }
}
```
{% include copy-curl.html %}

Next, index two documents that correspond to students:

```json
PUT students/_doc/1
{
  "name": "Mary Major",
  "classes": [ "CS101", "CS102", "MATH101" ],
  "min_required": 2
}
```
{% include copy-curl.html %}

```json
PUT students/_doc/2
{
  "name": "John Doe",
  "classes": [ "CS101", "MATH101", "ENG101" ],
  "min_required": 2
}
```
{% include copy-curl.html %}

Now search for students who have taken at least two of the following classes: `CS101`, `CS102`, `MATH101`:

```json
GET students/_search
{
  "query": {
    "terms_set": {
      "classes": {
        "terms": [ "CS101", "CS102", "MATH101" ],
        "minimum_should_match_field": "min_required"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains both students:

```json
{
  "took" : 44,
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
    "max_score" : 1.4544616,
    "hits" : [
      {
        "_index" : "students",
        "_id" : "1",
        "_score" : 1.4544616,
        "_source" : {
          "name" : "Mary Major",
          "classes" : [
            "CS101",
            "CS102",
            "MATH101"
          ],
          "min_required" : 2
        }
      },
      {
        "_index" : "students",
        "_id" : "2",
        "_score" : 0.5013843,
        "_source" : {
          "name" : "John Doe",
          "classes" : [
            "CS101",
            "MATH101",
            "ENG101"
          ],
          "min_required" : 2
        }
      }
    ]
  }
}
```

To specify the minimum number of terms a document should match with a script, provide the script in the `minimum_should_match_script` field:

```json
GET students/_search
{
  "query": {
    "terms_set": {
      "classes": {
        "terms": [ "CS101", "CS102", "MATH101" ],
        "minimum_should_match_script": {
          "source": "Math.min(params.num_terms, doc['min_required'].value)"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

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
{% include copy-curl.html %}

## Range

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
{% include copy-curl.html %}

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
{% include copy-curl.html %}

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
{% include copy-curl.html %}

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
{% include copy-curl.html %}

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
{% include copy-curl.html %}

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
{% include copy-curl.html %}

## Fuzzy

A fuzzy query searches for documents with terms that are similar to the search term within the maximum allowed [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance). The Levenshtein distance measures the number of one-character changes needed to change one term to another term. These changes include:

- Replacements: **c**at to **b**at
- Insertions: cat to cat**s**
- Deletions: **c**at to at
- Transpositions: **ca**t to **ac**t

A fuzzy query creates a list of all possible expansions of the search term that fall within the Levenshtein distance. You can specify the maximum number of such expansions in the `max_expansions` field. Then is searches for documents that match any of the expansions.

The following example query searches for the speaker `HALET` (misspelled `HAMLET`). The maximum edit distance is not specified, so the default `AUTO` edit distance is used:

```json
GET shakespeare/_search
{
  "query": {
    "fuzzy": {
      "speaker": {
        "value": "HALET"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains all documents where `HAMLET` is the speaker.

The following example query searches for the word `cat` with advanced parameters:

```json
GET shakespeare/_search
{
  "query": {
    "fuzzy": {
      "speaker": {
        "value": "HALET",
        "fuzziness": "2",
        "max_expansions": 40,
        "prefix_length": 0,
        "transpositions": true,
        "rewrite": "constant_score"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Wildcard

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
{% include copy-curl.html %}

If we change `*` to `?`, we get no matches, because `?` refers to a single character.

Wildcard queries tend to be slow because they need to iterate over a lot of terms. Avoid placing wildcard characters at the beginning of a query because it could be a very expensive operation in terms of both resources and time.

## Regexp

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
{% include copy-curl.html %}

A few important notes:

- Regular expressions are applied to the terms in the field (i.e. tokens), not the entire field.
- Regular expressions use the Lucene syntax, which differs from more standardized implementations. Test thoroughly to ensure that you receive the results you expect. To learn more, see [the Lucene documentation](https://lucene.apache.org/core/8_9_0/core/index.html).
- `regexp` queries can be expensive operations and require the `search.allow_expensive_queries` setting to be set to `true`. Before making frequent `regexp` queries, test their impact on cluster performance and examine alternative queries for achieving similar results.
