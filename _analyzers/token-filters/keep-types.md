---
layout: default
title: Keep types
parent: Token filters
nav_order: 180
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/keep-types/
---

# Keep types token filter

The `keep_types` token filter is a type of token filter used in text analysis to control which token types are kept or discarded. Different tokenizers produce different token types, for example, `<HOST>`, `<NUM>`, or `<ALPHANUM>`.

The `keyword`, `simple_pattern`, and `simple_pattern_split` tokenizers do not support the `keep_types` token filter because these tokenizers do not support token type attributes.
{: .note}

## Parameters

The `keep_types` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`types` | Required | List of strings | List of token types to be kept or discarded (determined by the `mode`).
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
  "text": "Hello 2 world! This is an example."
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
      "start_offset": 8,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "this",
      "start_offset": 15,
      "end_offset": 19,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "is",
      "start_offset": 20,
      "end_offset": 22,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "an",
      "start_offset": 23,
      "end_offset": 25,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "example",
      "start_offset": 26,
      "end_offset": 33,
      "type": "<ALPHANUM>",
      "position": 6
    }
  ]
}
```
