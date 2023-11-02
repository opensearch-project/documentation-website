---
layout: default
title: Match phrase
parent: Full-text queries
grand_parent: Query DSL
nav_order: 30
---

# Match phrase query

Use the `match_phrase` query to match documents that contain an exact phrase in a specified order. You can add flexibility to phrase matching by providing the `slop` parameter.

The `match_phrase` query creates a [phrase query](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PhraseQuery.html) that matches a sequence of terms.

The following example shows a basic `match_phrase` query:

```json
GET _search
{
  "query": {
    "match_phrase": {
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
    "match_phrase": {
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

The following `match_phrase` query searches for the phrase `wind rises`, where the word `wind` is followed by the word `rises`:

```json
GET testindex/_search
{
  "query": {
    "match_phrase": {
      "title": "wind rises"
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
  "took": 30,
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

## Analyzer

By default, when you run a query on a `text` field, the search text is analyzed using the index analyzer associated with the field. You can specify a different search analyzer in the `analyzer` parameter. For example, the following query uses the `english` analyzer:

```json
GET testindex/_search
{
  "query": {
    "match_phrase": {
      "title": {
        "query": "the winds",
        "analyzer": "english"
      }
    }
  }
}
```
{% include copy-curl.html %}

The `english` analyzer removes the stopword `the` and performs stemming, producing the token `wind`. Both documents match this token and are returned in the results:

<details closed markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 2,
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
    "max_score": 0.19363807,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0.19363807,
        "_source": {
          "title": "The wind rises"
        }
      },
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 0.17225474,
        "_source": {
          "title": "Gone with the wind"
        }
      }
    ]
  }
}
```
</details>

## Slop

If you provide a `slop` parameter, the query tolerates reorderings of the search terms. Slop specifies the number of other words permitted between words in a query phrase. For example, in the following query, the search text is reordered compared to the document text:

```json
GET _search
{
  "query": {
    "match_phrase": {
      "title": {
        "query": "wind rises the",
        "slop": 3
      }
    }
  }
}
```

The query still returns the matching document:

<details closed markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 2,
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
    "max_score": 0.44026947,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0.44026947,
        "_source": {
          "title": "The wind rises"
        }
      }
    ]
  }
}
```
</details>

## Empty query

For information about a possible empty query, see the corresponding [match query section]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match/#empty-query).

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
`analyzer` | String | The [analyzer]({{site.url}}{{site.baseurl}}/analyzers/index/) used to tokenize the query string text. Default is the index-time analyzer specified for the `default_field`. If no analyzer is specified for the `default_field`, the `analyzer` is the default analyzer for the index.
`slop` | `0` (default) or a positive integer | Controls the degree to which words in a query can be misordered and still be considered a match. From the [Lucene documentation](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PhraseQuery.html#getSlop--): "The number of other words permitted between words in query phrase. For example, to switch the order of two words requires two moves (the first move places the words atop one another), so to permit reorderings of phrases, the slop must be at least two. A value of zero requires an exact match."
`zero_terms_query` | String | In some cases, the analyzer removes all terms from a query string. For example, the `stop` analyzer removes all terms from the string `an but this`. In those cases, `zero_terms_query` specifies whether to match no documents (`none`) or all documents (`all`). Valid values are `none` and `all`. Default is `none`.