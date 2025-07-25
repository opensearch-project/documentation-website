---
layout: default
title: Standard
parent: Tokenizers
nav_order: 130
canonical_url: https://docs.opensearch.org/latest/analyzers/tokenizers/standard/
---

# Standard tokenizer

The `standard` tokenizer is the default tokenizer in OpenSearch. It tokenizes text based on word boundaries using a grammar-based approach that recognizes letters, digits, and other characters like punctuation. It is highly versatile and suitable for many languages because it uses Unicode text segmentation rules ([UAX#29](https://unicode.org/reports/tr29/)) to break text into tokens.

## Example usage

The following example request creates a new index named `my_index` and configures an analyzer with a `standard` tokenizer:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_standard_analyzer": {
          "type": "standard"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "my_standard_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /my_index/_analyze
{
  "analyzer": "my_standard_analyzer",
  "text": "OpenSearch is powerful, fast, and scalable."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "opensearch",
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
      "token": "powerful",
      "start_offset": 14,
      "end_offset": 22,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "fast",
      "start_offset": 24,
      "end_offset": 28,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "and",
      "start_offset": 30,
      "end_offset": 33,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "scalable",
      "start_offset": 34,
      "end_offset": 42,
      "type": "<ALPHANUM>",
      "position": 5
    }
  ]
}
```

## Parameters

The `standard` tokenizer can be configured with the following parameter.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`max_token_length` | Optional | Integer | Sets the maximum length of the produced token. If this length is exceeded, the token is split into multiple tokens at the length configured in `max_token_length`. Default is `255`.

