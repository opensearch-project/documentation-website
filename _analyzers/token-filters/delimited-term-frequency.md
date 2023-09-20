---
layout: default
title: Delimited term frequency
parent: Token filters
nav_order: 100
---

# Delimited term frequency token filter

The `delimited_term_freq` token filter separates a token stream into tokens with corresponding term frequencies, based on a provided delimiter. A token consists of all characters before the delimiter, and a term frequency is the integer after the delimiter. For example, if the delimiter is `|`, then for the string `foo|5`, `foo` is the token and `5` is its term frequency. If there is no delimiter, the token filter does not modify the term frequency. 

You can either use a preconfigured `delimited_term_freq` token filter or create a custom one.

## Preconfigured `delimited_term_freq` token filter

The preconfigured `delimited_term_freq` token filter uses the `|` default delimiter. To analyze text with the preconfigured token filter, send the following request to the `_analyze` endpoint:

```json
POST /_analyze
{
  "text": "foo|100",
  "tokenizer": "keyword",
  "filter": ["delimited_term_freq"],
  "attributes": ["termFrequency"],
  "explain": true
}
```
{% include copy-curl.html %}

The `attributes` array specifies that you want to filter the output of the `explain` parameter to return only `termFrequency`. The response contains both the original token and the parsed output of the token filter that includes the term frequency:

```json
{
  "detail": {
    "custom_analyzer": true,
    "charfilters": [],
    "tokenizer": {
      "name": "keyword",
      "tokens": [
        {
          "token": "foo|100",
          "start_offset": 0,
          "end_offset": 7,
          "type": "word",
          "position": 0,
          "termFrequency": 1
        }
      ]
    },
    "tokenfilters": [
      {
        "name": "delimited_term_freq",
        "tokens": [
          {
            "token": "foo",
            "start_offset": 0,
            "end_offset": 7,
            "type": "word",
            "position": 0,
            "termFrequency": 100
          }
        ]
      }
    ]
  }
}
```

## Custom `delimited_term_freq` token filter

To configure a custom `delimited_term_freq` token filter, first specify the delimiter in the mapping request, in this example, `^`:

```json
PUT /testindex
{
  "settings": {
    "analysis": {
      "filter": {
        "my_delimited_term_freq": {
          "type": "delimited_term_freq",
          "delimiter": "^"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Then analyze text with the custom token filter you created:

```json
POST /testindex/_analyze
{
  "text": "foo^3",
  "tokenizer": "keyword",
  "filter": ["my_delimited_term_freq"],
  "attributes": ["termFrequency"],
  "explain": true
}
```
{% include copy-curl.html %}

The response contains both the original token and the parsed version with the term frequency:

```json
{
  "detail": {
    "custom_analyzer": true,
    "charfilters": [],
    "tokenizer": {
      "name": "keyword",
      "tokens": [
        {
          "token": "foo|100",
          "start_offset": 0,
          "end_offset": 7,
          "type": "word",
          "position": 0,
          "termFrequency": 1
        }
      ]
    },
    "tokenfilters": [
      {
        "name": "delimited_term_freq",
        "tokens": [
          {
            "token": "foo",
            "start_offset": 0,
            "end_offset": 7,
            "type": "word",
            "position": 0,
            "termFrequency": 100
          }
        ]
      }
    ]
  }
}
```

## Combining `delimited_token_filter` with scripts

You can write Painless scripts to calculate custom scores for the documents in the results.

First, create an index and provide the following mappings and settings:

```json
PUT /test
{
  "settings": {
    "number_of_shards": 1,
    "analysis": {
      "tokenizer": {
        "keyword_tokenizer": {
          "type": "keyword"
        }
      },
      "filter": {
        "my_delimited_term_freq": {
          "type": "delimited_term_freq",
          "delimiter": "^"
        }
      },
      "analyzer": {
        "custom_delimited_analyzer": {
          "tokenizer": "keyword_tokenizer",
          "filter": ["my_delimited_term_freq"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "f1": {
        "type": "keyword"
      },
      "f2": {
        "type": "text",
        "analyzer": "custom_delimited_analyzer",
        "index_options": "freqs"
      }
    }
  }
}
```
{% include copy-curl.html %}

The `test` index uses a keyword tokenizer, a delimited term frequency token filter (where the delimiter is `^`), and a custom analyzer that includes a keyword tokenizer and a delimited term frequency token filter. The mappings specify that the field `f1` is a keyword field and the field `f2` is a text field. The field `f2` uses the custom analyzer defined in the settings for text analysis. Additionally, specifying `index_options` signals to OpenSearch to add the term frequencies to the inverted index. You'll use the term frequencies to give documents with repeated terms a higher score.

Next, index two documents using bulk upload:

```json
POST /_bulk?refresh=true
{"index": {"_index": "test", "_id": "doc1"}}
{"f1": "v0|100", "f2": "v1^30"}
{"index": {"_index": "test", "_id": "doc2"}}
{"f2": "v2|100"}
```
{% include copy-curl.html %}

The following query searches for all documents in the index and calculates document scores as the term frequency of the term `v1` in the field `f2`:

```json
GET /test/_search
{
  "query": {
    "function_score": {
      "query": {
        "match_all": {}
      },
      "script_score": {
        "script": {
          "source": "termFreq(params.field, params.term)",
          "params": {
            "field": "f2",
            "term": "v1"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

In the response, document 1 has a score of 30 because the term frequency of the term `v1` in the field `f2` is 30. Document 2 has a score of 0 because the term `v1` does not appear in `f2`:

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
      "value": 2,
      "relation": "eq"
    },
    "max_score": 30,
    "hits": [
      {
        "_index": "test",
        "_id": "doc1",
        "_score": 30,
        "_source": {
          "f1": "v0|100",
          "f2": "v1^30"
        }
      },
      {
        "_index": "test",
        "_id": "doc2",
        "_score": 0,
        "_source": {
          "f2": "v2|100"
        }
      }
    ]
  }
}
```

## Parameters

The following table lists all parameters that the `delimited_term_freq` supports.

Parameter | Required/Optional | Description
:--- | :--- | :---
`delimiter` | Optional | The delimiter used to separate tokens from term frequencies. Must be a single non-null character. Default is `|`.