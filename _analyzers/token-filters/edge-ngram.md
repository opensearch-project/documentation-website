---
layout: default
title: Edge n-gram
parent: Token filters
nav_order: 120
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/edge-ngram/
---
# Edge n-gram token filter
The `edge_ngram` token filter is very similar to the `ngram` token filter, where a particular string is split into substrings of different lengths. The `edge_ngram` token filter, however, generates n-grams (substrings) only from the beginning (edge) of a token. It's particularly useful in scenarios like autocomplete or prefix matching, where you want to match the beginning of words or phrases as the user types them.

## Parameters

The `edge_ngram` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`min_gram` | Optional | Integer | The minimum length of the n-grams that will be generated. Default is `1`.
`max_gram` | Optional | Integer | The maximum length of the n-grams that will be generated. Default is `1` for the `edge_ngram` filter and `2` for custom token filters. Avoid setting this parameter to a low value. If the value is set too low, only very short n-grams will be generated and the search term will not be found. For example, if `max_gram` is set to `3` and you index the word "banana", the longest generated token will be "ban". If the user searches for "banana", no matches will be returned. You can use the `truncate` token filter as a search analyzer to mitigate this risk.
`preserve_original` | Optional | Boolean | Includes the original token in the output. Default is `false` .

## Example

The following example request creates a new index named `edge_ngram_example` and configures an analyzer with the `edge_ngram` filter:

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

Use the following request to examine the tokens generated using the analyzer:

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
