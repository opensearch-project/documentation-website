---
layout: default
title: Ngram
parent: Token filters
nav_order: 290
---

# Ngram token filter

The `ngram` token filter is a powerful tool for breaking down text into smaller components, known as n-grams, which can improve partial matching and fuzzy search capabilities. It works by splitting a token into smaller substrings of defined lengths. These filters are commonly used in search applications to support autocomplete, partial matches, and typo-tolerant search.

## Parameters

The `ngram` token filter can be configured with the following parameters:

- `min_gram`: The minimum length of the n-grams. Default is `1`. (Integer, _Optional_)
- `max_gram`: The maximum length of the n-grams. Default is `2`. (Integer, _Optional_)
- `preserve_original`: Keep the original token as one of the outputs. Default is `false`. (Boolean, _Optional_)

## Example

The following example request creates a new index named `ngram_example_index` and configures an analyzer with `ngram` filter:

```json
PUT /ngram_example_index
{
  "settings": {
    "analysis": {
      "filter": {
        "ngram_filter": {
          "type": "ngram",
          "min_gram": 2,
          "max_gram": 3
        }
      },
      "analyzer": {
        "ngram_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "ngram_filter"
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
POST /ngram_example_index/_analyze
{
  "analyzer": "ngram_analyzer",
  "text": "Search"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "se",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "sea",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "ea",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "ear",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "ar",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "arc",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "rc",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "rch",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "ch",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    }
  ]
}
```
