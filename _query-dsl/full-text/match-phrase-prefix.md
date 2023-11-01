---
layout: default
title: Match phrase prefix
parent: Full-text queries
grand_parent: Query DSL
nav_order: 40
---

# Match phrase prefix query

Use the `match_phrase_prefix` query to specify a phrase to match in order. The documents that contain the phrase you specify will be returned. The last partial term in the phrase is interpreted as a prefix, so any documents that contain phrases that begin with the phrase and prefix of the last term will be returned.

Similar to [match phrase]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/), but creates a [prefix query](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PrefixQuery.html) out of the last term in the query string.

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

<details closed markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

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
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.92980814,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0.92980814,
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
    "match_phrase": {
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
`analyzer` | String | The [analyzer]({{site.url}}{{site.baseurl}}/analyzers/index/) used to tokenize the query. 
`max_expansions` | Positive integer |  The maximum number of terms to which the query can expand. Fuzzy queries “expand to” a number of matching terms that are within the distance specified in `fuzziness`. Then OpenSearch tries to match those terms. Default is `50`.
`slop` | `0` (default) or a positive integer | Controls the degree to which words in a query can be misordered and still be considered a match. From the [Lucene documentation](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PhraseQuery.html#getSlop--): "The number of other words permitted between words in query phrase. For example, to switch the order of two words requires two moves (the first move places the words atop one another), so to permit reorderings of phrases, the slop must be at least two. A value of zero requires an exact match."