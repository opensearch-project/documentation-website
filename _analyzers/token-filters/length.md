---
layout: default
title: Length
parent: Token filters
nav_order: 240
---

# Length token filter

The `length` token filter in OpenSearch is used to remove tokens from the token stream that don't meet specified length criteria, such as min and max values.

## Parameters

The `length` token filter in OpenSearch can be configured with the following parameters:

- `min`: Minimum length of tokens that should be created. Default is `0` (Integer, _Optional_)
- `max`: Maximum length of tokens that should be created. Default is `2147483647` (Integer, _Optional_)
 

## Example

The following example request creates a new index named `my_index` and configures an analyzer with `length` filter:

```json
PUT my_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "only_keep_4_to_10_characters": {
          "tokenizer": "whitespace",
          "filter": [ "length_4_to_10" ]
        }
      },
      "filter": {
        "length_4_to_10": {
          "type": "length",
          "min": 4,
          "max": 10
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
  "analyzer": "only_keep_4_to_10_characters",
  "text": "OpenSearch is a great tool!"
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
      "type": "word",
      "position": 0
    },
    {
      "token": "great",
      "start_offset": 16,
      "end_offset": 21,
      "type": "word",
      "position": 3
    },
    {
      "token": "tool!",
      "start_offset": 22,
      "end_offset": 27,
      "type": "word",
      "position": 4
    }
  ]
}
```
