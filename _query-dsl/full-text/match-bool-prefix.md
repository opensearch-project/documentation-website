---
layout: default
title: Match Boolean prefix
parent: Full-text queries
grand_parent: Query DSL
nav_order: 20
---

# Match Boolean prefix query

The `match_bool_prefix` query analyzes the provided search string and creates a [Boolean query]({{site.url}}{{site.baseurl}}/query-dsl/compound/bool/) from the string's terms. It uses every term except the last term as a whole word for matching. The last term is used as a prefix. The `match_bool_prefix` query returns documents that contain either the whole-word terms or terms that start with the prefix term, in any order.

The following example shows a basic `match_bool_prefix` query:

```json
GET _search
{
  "query": {
    "match_bool_prefix": {
      "title": "the wind"
    }
  }
}
```
{% include copy-curl.html %}

To pass additional parameters, you can use the expanded syntax:

```json
GET _search
{
  "query": {
    "match_bool_prefix": {
      "title": {
        "query": "the wind",
        "analyzer": "stop"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example

For example, consider an index with the following documents:

```json
PUT testindex/_doc/1
{
  "title": "The wind rises"
}
```
{% include copy-curl.html %}

```json
PUT testindex/_doc/2
{
  "title": "Gone with the wind"
  
}
```
{% include copy-curl.html %}

The following `match_bool_prefix` query searches for the whole word `rises` and the words that start with `wi`, in any order:

```json
GET testindex/_search
{
  "query": {
    "match_bool_prefix": {
      "title": "rises wi"
    }
  }
}
```
{% include copy-curl.html %}

The preceding query is equivalent to the following Boolean query:

```json
GET testindex/_search
{
  "query": {
    "bool" : {
      "should": [
        { "term": { "title": "rises" }},
        { "prefix": { "title": "wi"}}
      ]
    }
  }
}
```

The response contains both documents:

<details closed markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 15,
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
    "max_score": 1.73617,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 1.73617,
        "_source": {
          "title": "The wind rises"
        }
      },
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 1,
        "_source": {
          "title": "Gone with the wind"
        }
      }
    ]
  }
}
```

</details>

## The `match_bool_prefix` and `match_phrase_prefix` queries

The `match_bool_prefix` query matches terms in any position, while the `match_phrase_prefix` query matches terms as a whole phrase. To illustrate the difference, once again consider the `match_bool_prefix` query from the preceding section:

```json
GET testindex/_search
{
  "query": {
    "match_bool_prefix": {
      "title": "rises wi"
    }
  }
}
```
{% include copy-curl.html %}

Both `The wind rises` and `Gone with the wind` match the search terms, so the query returns both documents.

Now run a `match_phrase_prefix` query on the same index:

```json
GET testindex/_search
{
  "query": {
    "match_phrase_prefix": {
      "title": "rises wi"
    }
  }
}
```
{% include copy-curl.html %}

The response returns no documents because none of the documents contain a phrase `rises wi` in the specified order.

## Analyzer

By default, when you run a query on a `text` field, the search text is analyzed using the index analyzer associated with the field. You can specify a different search analyzer in the `analyzer` parameter:

```json
GET testindex/_search
{
  "query": {
    "match_bool_prefix": {
      "title": {
        "query": "rise the wi",
        "analyzer": "stop"
      }
    }
  }
}
```
{% include copy-curl.html %}
 
## Parameters

The query accepts the name of the field (`<field>`) as a top-level parameter:

```json
GET _search
{
  "query": {
    "match_bool_prefix": {
      "<field>": {
        "query": "text to search for",
        ... 
      }
    }
  }
}
```
{% include copy-curl.html %}

The `<field>` accepts the following parameters. All parameters except `query` are optional.

Parameter | Data type | Description
:--- | :--- | :---
`query` | String | The text, number, Boolean value, or date to use for search. Required.
`analyzer` | String | The [analyzer]({{site.url}}{{site.baseurl}}/analyzers/index/) used to tokenize the query string text. Default is the index-time analyzer specified for the `default_field`. If no analyzer is specified for the `default_field`, the `analyzer` is the default analyzer for the index.
`fuzziness` | `AUTO`, `0`, or a positive integer | The number of character edits (insert, delete, substitute) that it takes to change one word to another when determining whether a term matched a value. For example, the distance between `wined` and `wind` is 1. The default, `AUTO`, chooses a value based on the length of each term and is a good choice for most use cases.
`fuzzy_rewrite` | String | Determines how OpenSearch rewrites the query. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, and `top_terms_blended_freqs_N`. If the `fuzziness` parameter is not `0`, the query uses a `fuzzy_rewrite` method of `top_terms_blended_freqs_${max_expansions}` by default. Default is `constant_score`. 
`fuzzy_transpositions` | Boolean | Setting `fuzzy_transpositions` to `true` (default) adds swaps of adjacent characters to the insert, delete, and substitute operations of the `fuzziness` option. For example, the distance between `wind` and `wnid` is 1 if `fuzzy_transpositions` is true (swap "n" and "i") and 2 if it is false (delete "n", insert "n"). If `fuzzy_transpositions` is false, `rewind` and `wnid` have the same distance (2) from `wind`, despite the more human-centric opinion that `wnid` is an obvious typo. The default is a good choice for most use cases.
`max_expansions` | Positive integer |  The maximum number of terms to which the query can expand. Fuzzy queries “expand to” a number of matching terms that are within the distance specified in `fuzziness`. Then OpenSearch tries to match those terms. Default is `50`.
`minimum_should_match` | Positive or negative integer, positive or negative percentage, combination | If the query string contains multiple search terms and you use the `or` operator, the number of terms that need to match for the document to be considered a match. For example, if `minimum_should_match` is 2, `wind often rising` does not match `The Wind Rises.` If `minimum_should_match` is `1`, it matches. For details, see [Minimum should match]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/).
`operator` | String | If the query string contains multiple search terms, whether all terms need to match (`and`) or only one term needs to match (`or`) for a document to be considered a match. Valid values are `or` and `and`. Default is `or`.
`prefix_length` | Non-negative integer | The number of leading characters that are not considered in fuzziness. Default is `0`.

The `fuzziness`, `fuzzy_transpositions`, `fuzzy_rewrite`, `max_expansions`, and `prefix_length` parameters can be applied to the term subqueries constructed for all terms except the final term. They do not have any effect on the prefix query constructed for the final term.
{: .note}