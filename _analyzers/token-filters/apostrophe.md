---
layout: default
title: Apostrophe
parent: Token filters
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/apostrophe/
---

# Apostrophe token filter

The `apostrophe` token filter's primary function is to remove possessive apostrophes and anything following them. This can be very useful in analyzing text in languages that rely heavily on apostrophes, such as Turkish, in which apostrophes separate the root word from suffixes, including possessive suffixes, case markers, and other grammatical endings.


## Example

The following example request creates a new index named `custom_text_index` with a custom analyzer configured in `settings` and used in `mappings`:

```json
PUT /custom_text_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "apostrophe"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "custom_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the created analyzer:

```json
POST /custom_text_index/_analyze
{
  "analyzer": "custom_analyzer",
  "text": "John's car is faster than Peter's bike"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "john",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "car",
      "start_offset": 7,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "is",
      "start_offset": 11,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "faster",
      "start_offset": 14,
      "end_offset": 20,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "than",
      "start_offset": 21,
      "end_offset": 25,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "peter",
      "start_offset": 26,
      "end_offset": 33,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "bike",
      "start_offset": 34,
      "end_offset": 38,
      "type": "<ALPHANUM>",
      "position": 6
    }
  ]
}
```

The built-in `apostrophe` token filter is not suitable for languages such as French, in which apostrophes are used at the beginning of words. For example, `"C'est l'amour de l'école"` will result in four tokens: "C", "l", "de", and "l".
{: .note}
