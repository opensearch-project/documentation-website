---
layout: default
title: Multiplexer
parent: Token filters
nav_order: 280
---

# Multiplexer token filter

The `multiplexer` token filter allows you to create multiple versions of the same token by applying different filters. This is useful when you want to analyze the same token in multiple ways. For example, you may want to analyze a token using different stemming, synonyms, or n-gram filters and use all of the generated tokens together. This token filter works by duplicating the token stream and applying different filters to each copy.

The `multiplexer` token filter removes duplicate tokens from the token stream.
{: .important}

The `multiplexer` token filter does not support multiword `synonym` or `synonym_graph` token filters or `shingle` token filters because they need to analyze not only the current token but also upcoming tokens in order to determine how to transform the input correctly.
{: .important}

## Parameters

The `multiplexer` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`filters` | Optional | List of strings | A comma-separated list of token filters to apply to each copy of the token stream. Default is an empty list.
`preserve_original` | Optional | Boolean | Whether to keep the original token as one of the outputs. Default is `true`.

## Example

The following example request creates a new index named `multiplexer_index` and configures an analyzer with a `multiplexer` filter:

```json
PUT /multiplexer_index
{
  "settings": {
    "analysis": {
      "filter": {
        "english_stemmer": {
          "type": "stemmer",
          "name": "english"
        },
        "synonym_filter": {
          "type": "synonym",
          "synonyms": [
            "quick,fast"
          ]
        },
        "multiplexer_filter": {
          "type": "multiplexer",
          "filters": ["english_stemmer", "synonym_filter"],
          "preserve_original": true
        }
      },
      "analyzer": {
        "multiplexer_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "multiplexer_filter"
          ]
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
POST /multiplexer_index/_analyze
{
  "analyzer": "multiplexer_analyzer",
  "text": "The slow turtle hides from the quick dog"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "The",
      "start_offset": 0,
      "end_offset": 3,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "slow",
      "start_offset": 4,
      "end_offset": 8,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "turtle",
      "start_offset": 9,
      "end_offset": 15,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "turtl",
      "start_offset": 9,
      "end_offset": 15,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "hides",
      "start_offset": 16,
      "end_offset": 21,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "hide",
      "start_offset": 16,
      "end_offset": 21,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "from",
      "start_offset": 22,
      "end_offset": 26,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "the",
      "start_offset": 27,
      "end_offset": 30,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "quick",
      "start_offset": 31,
      "end_offset": 36,
      "type": "<ALPHANUM>",
      "position": 6
    },
    {
      "token": "fast",
      "start_offset": 31,
      "end_offset": 36,
      "type": "SYNONYM",
      "position": 6
    },
    {
      "token": "dog",
      "start_offset": 37,
      "end_offset": 40,
      "type": "<ALPHANUM>",
      "position": 7
    }
  ]
}
```
