---
layout: default
title: Keep types
parent: Token filters
nav_order: 180
---

# Keep types token filter

The `keep_types` token filter is a type of token filter used in text analysis to control which token types are kept or discarded. Different tokenizers produce different token types, for example `word`, `<NUM>`, or `<ALPHANUM>`.

The `keyword`, `simple_pattern`, and `simple_pattern_split` tokenizers do not support the `keep_types` token filter because these tokenizers do not support token type attributes.
{: .note}

## Parameters

The `keep_types` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`types` | Required | List of strings | List of token types to be kept or removed (determined by the `mode`).
`mode`| Optional | String | Whether to `include` or `exclude` the token types specified in `types`. Default is `include`.
 

## Example

The following example request creates a new index named `test_index` and configures an analyzer with a `keep_types` filter:

```json
PUT /test_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "keep_types_filter"]
        }
      },
      "filter": {
        "keep_types_filter": {
          "type": "keep_types",
          "types": ["<ALPHANUM>"]
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
GET /test_index/_analyze
{
  "analyzer": "custom_analyzer",
  "text": "Hello, world! This is an example."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "hello",
      "start_offset": 0,
      "end_offset": 5,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "world",
      "start_offset": 7,
      "end_offset": 12,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "this",
      "start_offset": 14,
      "end_offset": 18,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "is",
      "start_offset": 19,
      "end_offset": 21,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "an",
      "start_offset": 22,
      "end_offset": 24,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "example",
      "start_offset": 25,
      "end_offset": 32,
      "type": "<ALPHANUM>",
      "position": 5
    }
  ]
}
```
