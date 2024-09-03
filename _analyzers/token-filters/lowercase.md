---
layout: default
title: Lowercase
parent: Token filters
nav_order: 260
---

# Lowercase token filter

The `lowercase` token filter in OpenSearch is used to limit the number of tokens that are passed through the analysis chain.

## Parameters

The `lowercase` token filter in OpenSearch can be configured with the following parameters:

- `max_token_count`: Maximum number of tokens that will be generated. Default is `1` (Integer, _Optional_)
- `consume_all_tokens`: Use all token, even if result exceeds `max_token_count`. Default is `false` (Boolean, _Optional_)
 

## Example

The following example request creates a new index named `my_index` and configures an analyzer with `lowercase` filter:

```json
PUT my_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "three_token_limit": {
          "tokenizer": "standard",
          "filter": [ "custom_token_limit" ]
        }
      },
      "filter": {
        "custom_token_limit": {
          "type": "limit",
          "max_token_count": 3
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
GET /my_index/_analyze
{
  "analyzer": "three_token_limit",
  "text": "OpenSearch is a powerful and flexible search engine."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "OpenSearch",
      "start_offset": 0,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "is",
      "start_offset": 11,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "a",
      "start_offset": 14,
      "end_offset": 15,
      "type": "<ALPHANUM>",
      "position": 2
    }
  ]
}
```
