---
layout: default
title: Match phrase prefix
parent: Full-text queries
nav_order: 30
---

# Match phrase prefix query

Use the `match_phrase_prefix` query to search for documents that contain the terms of a phrase in the order you specify. The last term in the phrase is interpreted as a prefix, so the query matches any phrase that begins with the preceding terms and continues with a word that starts with the last term. For example, `chocolate chip c` matches `chocolate chip cookies` and `mint chocolate chip cake` but not `cookies with chocolate chip`.

The `match_phrase_prefix` query works similarly to the [match phrase]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/) query but creates a [prefix query](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/PrefixQuery.html) out of the last term in the query string. If the query string contains only one term, the query is a prefix query on that term.

Use the `match_phrase_prefix` query in the following scenarios:

- Finding documents that contain a known phrase when only the beginning of its last word is available.
- Adding basic search-as-you-type functionality to a text field without changing the mapping.

For differences between the `match_phrase_prefix` and the `match_bool_prefix` queries, see [The `match_bool_prefix` and `match_phrase_prefix` queries]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-bool-prefix/#the-match_bool_prefix-and-match_phrase_prefix-queries).

The following example shows a basic `match_phrase_prefix` query:

```json
GET _search
{
  "query": {
    "match_phrase_prefix": {
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
    "match_phrase_prefix": {
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

The following `match_phrase_prefix` query searches for the whole word `wind`, followed by a word that starts with `ri`:

```json
GET testindex/_search
{
  "query": {
    "match_phrase_prefix": {
      "title": "wind ri"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching document:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 4,
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
    "max_score": 0.42264006,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0.42264006,
        "_source": {
          "title": "The wind rises"
        }
      }
    ]
  }
}
```
</details>

## Parameters

The query accepts the name of the field (`<field>`) as a top-level parameter:

```json
GET _search
{
  "query": {
    "match_phrase_prefix": {
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
`query` | String | The query string to use for search. OpenSearch analyzes the query string into terms and treats the last term as a prefix. Required.
`analyzer` | String | The [analyzer]({{site.url}}{{site.baseurl}}/analyzers/index/) used to tokenize the query string. Default is the search analyzer mapped for the `<field>`. If no analyzer is mapped, the index's default analyzer is used.
`max_expansions` | Positive integer | The maximum number of terms to which the last term in the query string can expand. For more information, see [Using the match phrase prefix query for autocomplete](#using-the-match-phrase-prefix-query-for-autocomplete). Default is `50`.
`slop` | `0` (default) or a positive integer | Controls the degree to which words in a query can be misordered and still be considered a match. From the [Lucene documentation](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/PhraseQuery.html#getSlop--): "The number of other words permitted between words in query phrase. For example, to switch the order of two words requires two moves (the first move places the words atop one another), so to permit reorderings of phrases, the slop must be at least two. A value of zero requires an exact match." For example, the query `wind the` matches the title `Gone with the wind` only if `slop` is at least `2`.
`zero_terms_query` | String | In some cases, the analyzer removes all terms from a query string. For example, the `stop` analyzer removes all terms from the string `the`. In those cases, `zero_terms_query` specifies whether to match no documents (`none`) or all documents (`all`). Valid values are `none` and `all`. Default is `none`.

The `match_phrase_prefix` query does not support the `fuzziness` parameter. 
{: .note}

## Using the match phrase prefix query for autocomplete

The `match_phrase_prefix` query requires no special mapping, which makes it a quick way to add autocomplete to a search box. However, it can return incomplete results because of the way it expands the last term.

For the query `chocolate chip c`, OpenSearch builds a phrase query that requires `chocolate` to be followed by `chip` and then expands the prefix `c` to the first `max_expansions` terms that start with `c` in the field's term dictionary. These terms are selected in alphabetical order, not by relevance, so if many terms that start with `c` sort before `cookies`, documents containing `chocolate chip cookies` are not returned.

In a search-as-you-type experience, this is usually acceptable because each additional letter narrows the prefix until the missing term appears. Increasing `max_expansions` returns more matches but makes the query more expensive to run.

For autocomplete that is both complete and efficient, use one of the following approaches, which prepare prefixes at index time:

- The [completion suggester]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/autocomplete/#completion-suggester), which uses the [`completion`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/completion/) field type to return suggestions quickly from an in-memory data structure.
- The [`search_as_you_type`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/search-as-you-type/) field type, which indexes shingles and edge n-grams of a text field so that prefix matches do not need to be expanded at query time.

For a comparison of autocomplete approaches, see [Autocomplete]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/autocomplete/).
