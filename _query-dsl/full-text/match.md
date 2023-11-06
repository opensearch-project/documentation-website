---
layout: default
title: Match
parent: Full-text queries
grand_parent: Query DSL
nav_order: 10
---

# Match query

Use the `match` query for full-text search on a specific document field. If you run a `match` query on a [`text`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/) field, the `match` query [analyzes]({{site.url}}{{site.baseurl}}/analyzers/index/) the provided search string and returns documents that match any of the string's terms. If you run a `match` query on an exact-value field, it returns documents that match the exact value. The preferred way to search exact-value fields is to use a filter because, unlike a query, a filter is cached.

The following example shows a basic `match` query for the word `wind` in the `title`:

```json
GET _search
{
  "query": {
    "match": {
      "title": "wind"
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
    "match": {
      "title": {
        "query": "wind",
        "analyzer": "stop"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Examples

In the following examples, you'll use the index that contains the following documents:

```json
PUT testindex/_doc/1
{
  "title": "Let the wind rise"
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

```json
PUT testindex/_doc/3
{
  "title": "Rise is gone"
}
```
{% include copy-curl.html %}

## Operator

If a `match` query is run on a `text` field, the text is analyzed with the analyzer specified in the `analyzer` parameter. Then the resulting tokens are combined into a Boolean query using the operator specified in the `operator` parameter. The default operator is `OR`, so the query `wind rise` is changed into `wind OR rise`. In this example, this query returns documents 1--3 because each document has a term that matches the query. To specify the `and` operator, use the following query:

```json
GET testindex/_search
{
  "query": {
    "match": {
      "title": {
        "query": "wind rise",
        "operator": "and"
      }
    }
  }
}
```
{% include copy-curl.html %}

The query is constructed as `wind AND rise` and returns document 1 as the matching document:

<details closed markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 17,
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
    "max_score": 1.2667098,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 1.2667098,
        "_source": {
          "title": "Let the wind rise"
        }
      }
    ]
  }
}
```

</details>

### Minimum should match

You can control the minimum number of terms that a document must match to be returned in the results by specifying the [`minimum_should_match`]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/) parameter:

```json
GET testindex/_search
{
  "query": {
    "match": {
      "title": {
        "query": "wind rise",
        "operator": "or",
        "minimum_should_match": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

Now documents are required to match both terms, so only document 1 is returned (this is equivalent to the `and` operator):

<details closed markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 23,
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
    "max_score": 1.2667098,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 1.2667098,
        "_source": {
          "title": "Let the wind rise"
        }
      }
    ]
  }
}
```
</details>

## Analyzer

Because in this example you didn't explicitly specify the analyzer, the default `standard` analyzer is used. The default analyzer does not perform stemming, so if you run a query `the wind rises`, you receive no results because the token `rises` does not match the token `rise`. To change the search analyzer, specify it in the `analyzer` field. For example, the following query uses the `english` analyzer:

```json
GET testindex/_search
{
  "query": {
    "match": {
      "title": {
        "query": "the wind rises",
        "operator": "and",
        "analyzer": "english"
      }
    }
  }
}
```
{% include copy-curl.html %}

The `english` analyzer removes the stopword `the` and performs stemming, producing the tokens `wind` and `rise`. The latter token matches document 1, which is returned in the results:

<details closed markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

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
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.2667098,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 1.2667098,
        "_source": {
          "title": "Let the wind rise"
        }
      }
    ]
  }
}
```
</details>

## Empty query

In some cases, an analyzer might remove all tokens from a query. For example, the `english` analyzer removes stop words, so in a query `and OR or`, all tokens are removed. To check the analyzer behavior, you can use the [Analyze API]({{site.url}}{{site.baseurl}}/api-reference/analyze-apis/#apply-a-built-in-analyzer):

```json
GET testindex/_analyze
{
  "analyzer" : "english",
  "text" : "and OR or"
}
```
{% include copy-curl.html %}

As expected, the query produces no tokens:

```json
{
  "tokens": []
}
```

You can specify the behavior for an empty query in the `zero_terms_query` parameter. Setting `zero_terms_query` to `all` returns all documents in the index and setting it to `none` returns no documents:

```json
GET testindex/_search
{
  "query": {
    "match": {
      "title": {
        "query": "and OR or",
        "analyzer" : "english",
        "zero_terms_query": "all"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Fuzziness

To account for typos, you can specify `fuzziness` for your query as either of the following:

- An integer that specifies the maximum allowed [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) for this edit. 
- `AUTO`: 
  - Strings of 0–2 characters must match exactly.
  - Strings of 3–5 characters allow 1 edit.
  - Strings longer than 5 characters allow 2 edits.

Setting `fuzziness` to the default `AUTO` value works best in most cases:

```json
GET testindex/_search
{
  "query": {
    "match": {
      "title": {
        "query": "wnid",
        "fuzziness": "AUTO"
      }
    }
  }
}
```
{% include copy-curl.html %}

The token `wnid` matches `wind` and the query returns documents 1 and 2:

<details closed markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 31,
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
    "max_score": 0.47501624,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0.47501624,
        "_source": {
          "title": "Let the wind rise"
        }
      },
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 0.47501624,
        "_source": {
          "title": "Gone with the wind"
        }
      }
    ]
  }
}
```
</details>

### Prefix length

Misspellings rarely occur in the beginning of words. Thus, you can specify the minimum length the matched prefix must be to return a document in the results. For example, you can change the preceding query to include a `prefix_length`:

```json
GET testindex/_search
{
  "query": {
    "match": {
      "title": {
        "query": "wnid",
        "fuzziness": "AUTO",
        "prefix_length": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

The preceding query returns no results. If you change the `prefix_length` to 1, documents 1 and 2 are returned because the first letter of the token `wnid` is not misspelled.

### Transpositions

In the preceding example, the word `wnid` contained a transposition (`in` was changed to `ni`). By default, transpositions are allowed in fuzzy matching, but you can disallow them by setting `fuzzy_transpositions` to `false`:

```json
GET testindex/_search
{
  "query": {
    "match": {
      "title": {
        "query": "wnid",
        "fuzziness": "AUTO",
        "fuzzy_transpositions": false
      }
    }
  }
}
```
{% include copy-curl.html %}

Now the query returns no results.

## Synonyms

If you use a `synonym_graph` filter and `auto_generate_synonyms_phrase_query` is set to `true` (default), OpenSearch parses the query into terms and then combines the terms to generate a [phrase query](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PhraseQuery.html) for multi-term synonyms. For example, if you specify `ba,batting average` as synonyms and search for `ba`, OpenSearch searches for `ba OR "batting average"`.

To match multi-term synonyms with conjunctions, set `auto_generate_synonyms_phrase_query` to `false`:

```json
GET /testindex/_search
{
  "query": {
    "match": {
      "text": {
        "query": "good ba",
        "auto_generate_synonyms_phrase_query": false
      }
    }
  }
}
```
{% include copy-curl.html %}

The query produced is `ba OR (batting AND average)`.

## Parameters

The query accepts the name of the field (`<field>`) as a top-level parameter:

```json
GET _search
{
  "query": {
    "match": {
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
`query` | String | The query string to use for search. Required.
`auto_generate_synonyms_phrase_query` | Boolean | Specifies whether to create a [match phrase query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/) automatically for multi-term synonyms. For example, if you specify `ba,batting average` as synonyms and search for `ba`, OpenSearch searches for `ba OR "batting average"` (if this option is `true`) or `ba OR (batting AND average)` (if this option is `false`). Default is `true`.
`analyzer` | String | The [analyzer]({{site.url}}{{site.baseurl}}/analyzers/index/) used to tokenize the query string text. Default is the index-time analyzer specified for the `default_field`. If no analyzer is specified for the `default_field`, the `analyzer` is the default analyzer for the index.
`boost` | Floating-point | Boosts the clause by the given multiplier. Useful for weighing clauses in compound queries. Values in the [0, 1) range decrease relevance, and values greater than 1 increase relevance. Default is `1`.
`enable_position_increments` | Boolean | When `true`, resulting queries are aware of position increments. This setting is useful when the removal of stop words leaves an unwanted "gap" between terms. Default is `true`.
`fuzziness` | String | The number of character edits (insert, delete, substitute) that it takes to change one word to another when determining whether a term matched a value. For example, the distance between `wined` and `wind` is 1. Valid values are non-negative integers or `AUTO`. The default, `AUTO`, chooses a value based on the length of each term and is a good choice for most use cases.
`fuzzy_rewrite` | String | Determines how OpenSearch rewrites the query. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, and `top_terms_blended_freqs_N`. If the `fuzziness` parameter is not `0`, the query uses a `fuzzy_rewrite` method of `top_terms_blended_freqs_${max_expansions}` by default. Default is `constant_score`. 
`fuzzy_transpositions` | Boolean | Setting `fuzzy_transpositions` to `true` (default) adds swaps of adjacent characters to the insert, delete, and substitute operations of the `fuzziness` option. For example, the distance between `wind` and `wnid` is 1 if `fuzzy_transpositions` is true (swap "n" and "i") and 2 if it is false (delete "n", insert "n"). If `fuzzy_transpositions` is false, `rewind` and `wnid` have the same distance (2) from `wind`, despite the more human-centric opinion that `wnid` is an obvious typo. The default is a good choice for most use cases.
`lenient` | Boolean | Setting `lenient` to `true` ignores data type mismatches between the query and the document field. For example, a query string of `"8.2"` could match a field of type `float`. Default is `false`.
`max_expansions` | Positive integer |  The maximum number of terms to which the query can expand. Fuzzy queries “expand to” a number of matching terms that are within the distance specified in `fuzziness`. Then OpenSearch tries to match those terms. Default is `50`.
`minimum_should_match` | Positive or negative integer, positive or negative percentage, combination | If the query string contains multiple search terms and you use the `or` operator, the number of terms that need to match for the document to be considered a match. For example, if `minimum_should_match` is 2, `wind often rising` does not match `The Wind Rises.` If `minimum_should_match` is `1`, it matches. For details, see [Minimum should match]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/).
`operator` | String | If the query string contains multiple search terms, whether all terms need to match (`AND`) or only one term needs to match (`OR`) for a document to be considered a match. Valid values are:<br>- `OR`: The string `to be` is interpreted as `to OR be`<br>- `AND`: The string `to be` is interpreted as `to AND be`<br> Default is `OR`.
`prefix_length` | Non-negative integer | The number of leading characters that are not considered in fuzziness. Default is `0`.
`zero_terms_query` | String | In some cases, the analyzer removes all terms from a query string. For example, the `stop` analyzer removes all terms from the string `an but this`. In those cases, `zero_terms_query` specifies whether to match no documents (`none`) or all documents (`all`). Valid values are `none` and `all`. Default is `none`.