---
layout: default
title: Keyword search
has_children: false
nav_order: 10
redirect_from:
  - /search-plugins/search-methods/keyword-search/
---

# Keyword search

By default, OpenSearch calculates document scores using the [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25) algorithm. BM25 is a keyword-based algorithm that performs lexical search for words that appear in the query. 

When determining a document's relevance, BM25 considers [term frequency/inverse document frequency (TF/IDF)](https://en.wikipedia.org/wiki/Tf%E2%80%93idf):

- _Term frequency_ stipulates that documents in which the search term appears more frequently are more relevant. 

- _Inverse document frequency_ gives less weight to the words that commonly appear in all documents in the corpus (for example, articles like "the"). 

## Example

The following example query searches for the words `long live king` in the `shakespeare` index:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": "long live king"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching documents, each with a relevance score in the `_score` field:

```json
{
  "took": 113,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2352,
      "relation": "eq"
    },
    "max_score": 18.781435,
    "hits": [
      {
        "_index": "shakespeare",
        "_id": "32437",
        "_score": 18.781435,
        "_source": {
          "type": "line",
          "line_id": 32438,
          "play_name": "Hamlet",
          "speech_number": 3,
          "line_number": "1.1.3",
          "speaker": "BERNARDO",
          "text_entry": "Long live the king!"
        }
      },
      {
        "_index": "shakespeare",
        "_id": "83798",
        "_score": 16.523308,
        "_source": {
          "type": "line",
          "line_id": 83799,
          "play_name": "Richard III",
          "speech_number": 42,
          "line_number": "3.7.242",
          "speaker": "BUCKINGHAM",
          "text_entry": "Long live Richard, Englands royal king!"
        }
      },
      {
        "_index": "shakespeare",
        "_id": "82994",
        "_score": 15.588365,
        "_source": {
          "type": "line",
          "line_id": 82995,
          "play_name": "Richard III",
          "speech_number": 24,
          "line_number": "3.1.80",
          "speaker": "GLOUCESTER",
          "text_entry": "live long."
        }
      },
      {
        "_index": "shakespeare",
        "_id": "7199",
        "_score": 15.586321,
        "_source": {
          "type": "line",
          "line_id": 7200,
          "play_name": "Henry VI Part 2",
          "speech_number": 12,
          "line_number": "2.2.64",
          "speaker": "BOTH",
          "text_entry": "Long live our sovereign Richard, Englands king!"
        }
      }
      ...
    ]
  }
}
```

## Similarity algorithms

The following table lists the supported similarity algorithms.

Algorithm | Description
`BM25` | The default OpenSearch [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25) similarity algorithm. 
`boolean` | Assigns terms a score equal to their boost value. Use `boolean` similarity when you want the document scores to be based on the binary value of whether the terms match.

## Specifying similarity

You can specify the similarity algorithm in the `similarity` parameter when configuring mappings on a field level.

For example, the following query specifies the `boolean` similarity for the `boolean_field`. The `bm25_field` is assigned the default `BM25` similarity:

```json
PUT /testindex
{
  "mappings": {
    "properties": {
      "bm25_field": { 
        "type": "text"
      },
      "boolean_field": {
        "type": "text",
        "similarity": "boolean" 
      }
    }
  }
}
```
{% include copy-curl.html %}

## Configuring BM25 similarity 

You can configure BM25 similarity parameters on the index level as follows:

```json
PUT /testindex
{
  "settings": {
    "index": {
      "similarity": {
        "custom_similarity": {
          "type": "BM25",
          "k1": 1.2,
          "b": 0.75,
          "discount_overlaps": "true"
        }
      }
    }
  }
}
```

`BM25` similarity supports the following parameters.

Parameter | Data type | Description
`k1` | Float | Determines non-linear term frequency normalization (saturation) properties. The default value is `1.2`.
`b` | Float | Determines the degree to which document length normalizes TF values. The default value is `0.75`.
`discount_overlaps` | Boolean | Determines whether overlap tokens (tokens with zero position increment) are ignored when computing the norm. Default is `true` (overlap tokens do not count when computing the norm). 

---

## Next steps

- Learn about [query and filter context]({{site.url}}{{site.baseurl}}/query-dsl/query-filter-context/).
- Learn about the [query types]({{site.url}}{{site.baseurl}}/query-dsl/index/) OpenSearch supports.