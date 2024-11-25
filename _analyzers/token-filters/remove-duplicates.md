---
layout: default
title: Remove duplicates
parent: Token filters
nav_order: 350
---

# Remove duplicates token filter

The `remove_duplicates` token filter is used to remove duplicate tokens that are generated in the same position during analysis.

## Example

The following example request creates an index with a `keyword_repeat` token filter. The filter adds a `keyword` version of each token in the same position as the token itself and then uses a `kstem` to create a stemmed version of the token:

```json
PUT /example-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "keyword_repeat",
            "kstem"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Use the following request to analyze the string `Slower turtle`:

```json
GET /example-index/_analyze
{
  "analyzer": "custom_analyzer",
  "text": "Slower turtle"
}
```
{% include copy-curl.html %}

The response contains the token `turtle` twice in the same position:

```json
{
  "tokens": [
    {
      "token": "slower",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "slow",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "turtle",
      "start_offset": 7,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "turtle",
      "start_offset": 7,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 1
    }
  ]
}
```

The duplicate token can be removed by adding a `remove_duplicates` token filter to the index settings:

```json
PUT /index-remove-duplicate
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "keyword_repeat",
            "kstem",
            "remove_duplicates"
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
GET /index-remove-duplicate/_analyze
{
  "analyzer": "custom_analyzer",
  "text": "Slower turtle"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "slower",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "slow",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "turtle",
      "start_offset": 7,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 1
    }
  ]
}
```