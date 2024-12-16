---
layout: default
title: Uppercase
parent: Token filters
nav_order: 460
---

# Uppercase token filter

The `uppercase` token filter is used to convert all tokens (words) to uppercase during analysis.

## Example

The following example request creates a new index named `uppercase_example` and configures an analyzer with an `uppercase` filter:

```json
PUT /uppercase_example
{
  "settings": {
    "analysis": {
      "filter": {
        "uppercase_filter": {
          "type": "uppercase"
        }
      },
      "analyzer": {
        "uppercase_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "uppercase_filter"
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
GET /uppercase_example/_analyze
{
  "analyzer": "uppercase_analyzer",
  "text": "OpenSearch is powerful"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "OPENSEARCH",
      "start_offset": 0,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "IS",
      "start_offset": 11,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "POWERFUL",
      "start_offset": 14,
      "end_offset": 22,
      "type": "<ALPHANUM>",
      "position": 2
    }
  ]
}
```
