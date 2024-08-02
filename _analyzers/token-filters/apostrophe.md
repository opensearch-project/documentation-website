---
layout: default
title: Apostrophe
parent: Token filters
nav_order: 110
---

# Apostrophe

The `apostrophe` token filter's primary function is to remove possessive apostrophes and anything following them. This can be very useful in analyzing text in languages which rely heavily on apostrophes, such as Turkish, where apostrophes serves to separate the root word from suffixes, including possessive suffixes, case markers, and other grammatical endings.


## Example

Following example can be used to create new index `custom_text_index` with custom analyzer configured in `settings` and used in `mappings`.

```
PUT /custom_text_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_analyzer": {
          "type": "custom",
          "tokenizer": "standard", # splits text into words
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

## Check generated tokens

You can use the following command to examine the tokens being generated using the created analyzer.

```
POST /custom_text_index/_analyze
{
  "analyzer": "custom_analyzer",
  "text": "John's car is faster than Peter's bike"
}
```

Expected result:

```
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

The built in `apostrophe` token filter is not suitable for languages such as French, as the apostrophes are used at the beginning of the words, for example "C'est l'amour de l'école" will result in four tokens: "C", "l", "de", "l".
{: .note}
