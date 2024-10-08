---
layout: default
title: Remove duplicate
parent: Token filters
nav_order: 350
---

# Remove duplicate token filter

The `remove_duplicates` token filter is used to remove duplicate tokens in the same position that may arise during the analysis phase.

## Example

The following example creates index with `keyword_repeat` token filter, which adds a keyword version of each token in the same position and using `kstem` to create a stemmed version of the token.

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

Use the following request to analyze string `Quick fox`:

```json
GET /example-index/_analyze
{
  "analyzer": "custom_analyzer",
  "text": "Quick fox"
}
```
{% include copy-curl.html %}

The response contains token `fox` twice in the same position, see the following:

```json
{
  "tokens": [
    {
      "token": "quicker",
      "start_offset": 0,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "quick",
      "start_offset": 0,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "fox",
      "start_offset": 8,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "fox",
      "start_offset": 8,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 1
    }
  ]
}
```

The duplicate token can be removed by adding `remove_duplicates` token filter to the index settings:

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
  "text": "Quicker fox"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "quicker",
      "start_offset": 0,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "quick",
      "start_offset": 0,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "fox",
      "start_offset": 8,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 1
    }
  ]
}
```