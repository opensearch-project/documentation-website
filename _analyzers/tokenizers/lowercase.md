---
layout: default
title: Lowercase
parent: Tokenizers
nav_order: 70
---

# Lowercase tokenizer

The `lowercase` tokenizer breaks text into terms at white space and then lowercases all the terms. Functionally, this is identical to configuring a `letter` tokenizer with a `lowercase` token filter. However, using a `lowercase` tokenizer is more efficient because the tokenizer actions are performed in a single step.

## Example usage

The following example request creates a new index named `my-lowercase-index` and configures an analyzer with a `lowercase` tokenizer:

```json
PUT /my-lowercase-index
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "my_lowercase_tokenizer": {
          "type": "lowercase"
        }
      },
      "analyzer": {
        "my_lowercase_analyzer": {
          "type": "custom",
          "tokenizer": "my_lowercase_tokenizer"
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
POST /my-lowercase-index/_analyze
{
  "analyzer": "my_lowercase_analyzer",
  "text": "This is a Test. OpenSearch 123!"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "this",
      "start_offset": 0,
      "end_offset": 4,
      "type": "word",
      "position": 0
    },
    {
      "token": "is",
      "start_offset": 5,
      "end_offset": 7,
      "type": "word",
      "position": 1
    },
    {
      "token": "a",
      "start_offset": 8,
      "end_offset": 9,
      "type": "word",
      "position": 2
    },
    {
      "token": "test",
      "start_offset": 10,
      "end_offset": 14,
      "type": "word",
      "position": 3
    },
    {
      "token": "opensearch",
      "start_offset": 16,
      "end_offset": 26,
      "type": "word",
      "position": 4
    }
  ]
}
```
