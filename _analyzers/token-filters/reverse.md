---
layout: default
title: Reverse
parent: Token filters
nav_order: 360
---

# Reverse token filter

The `reverse` token filter reverses the order of the characters in each token.

## Example

The following example request creates a new index named `my-reverse-index` and configures an analyzer with `reverse`:

```json
PUT /my-reverse-index
{
  "settings": {
    "analysis": {
      "filter": {
        "reverse_filter": {
          "type": "reverse"
        }
      },
      "analyzer": {
        "my_reverse_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "reverse_filter"
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
GET /my-reverse-index/_analyze
{
  "analyzer": "my_reverse_analyzer",
  "text": "hello world"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "olleh",
      "start_offset": 0,
      "end_offset": 5,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "dlrow",
      "start_offset": 6,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 1
    }
  ]
}
```