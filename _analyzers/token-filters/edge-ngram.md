---
layout: default
title: Edge ngram
parent: Token filters
nav_order: 120
---

# Edge ngram token filter

The `edge_ngram` token filter generates n-grams (substrings) from the beginning (edge) of a token. It's particularly useful in scenarios like autocomplete or prefix matching, where you want to match the start of words or phrases as the user types.

## Parameters

The `edge_ngram` token filter in OpenSearch can be configured with the following parameters:

- `min_gram`: The minimum length of the n-grams that will be generated. Default is `1` (Integer, _Optional_)
- `max_gram`: The maximum length of the n-grams that will be generated. Default is `1`. Beware of setting this value too low, as any searches that exceed this value will not be found, as that token would not exist. For example if `max_gram` is set to `3` and the word "banana" is indexed, longest token that will be created is "ban". If the user searches for "banana", no matches will be found. You can use `truncate` token filter as search analyzer to mitigate this risk. (Integer, _Optional_)
- `preserve_original`: Include the original token in the output. Default is `false` (Boolean, _Optional_)

## Example

The following example request creates a new index named `edge_ngram_example` and configures an analyzer with `edge_ngram` filter:

```json
PUT /edge_ngram_example
{
  "settings": {
    "analysis": {
      "filter": {
        "my_edge_ngram": {
          "type": "edge_ngram",
          "min_gram": 3,
          "max_gram": 4
        }
      },
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "my_edge_ngram"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the created analyzer:

```json
POST /edge_ngram_example/_analyze
{
  "analyzer": "my_analyzer",
  "text": "slow green turtle"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "slo",
      "start_offset": 0,
      "end_offset": 4,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "slow",
      "start_offset": 0,
      "end_offset": 4,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "gre",
      "start_offset": 5,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "gree",
      "start_offset": 5,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "tur",
      "start_offset": 11,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "turt",
      "start_offset": 11,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 2
    }
  ]
}
```
