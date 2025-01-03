---
layout: default
title: Letter
parent: Tokenizers
nav_order: 60
---

# Letter tokenizer

The `letter` tokenizer splits text into words on any non-letter characters. It works well with many European languages but is ineffective with some Asian languages in which words aren't separated by spaces.

## Example usage

The following example request creates a new index named `my_index` and configures an analyzer with a `letter` tokenizer:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_letter_analyzer": {
          "type": "custom",
          "tokenizer": "letter"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "my_letter_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST _analyze
{
  "tokenizer": "letter",
  "text": "Cats 4EVER love chasing butterflies!"
}

```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "Cats",
      "start_offset": 0,
      "end_offset": 4,
      "type": "word",
      "position": 0
    },
    {
      "token": "EVER",
      "start_offset": 6,
      "end_offset": 10,
      "type": "word",
      "position": 1
    },
    {
      "token": "love",
      "start_offset": 11,
      "end_offset": 15,
      "type": "word",
      "position": 2
    },
    {
      "token": "chasing",
      "start_offset": 16,
      "end_offset": 23,
      "type": "word",
      "position": 3
    },
    {
      "token": "butterflies",
      "start_offset": 24,
      "end_offset": 35,
      "type": "word",
      "position": 4
    }
  ]
}
```
