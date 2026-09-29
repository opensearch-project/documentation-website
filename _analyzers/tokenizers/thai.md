---
layout: default
title: Thai
parent: Tokenizers
nav_order: 140
canonical_url: https://docs.opensearch.org/latest/analyzers/tokenizers/thai/
---

# Thai tokenizer

The `thai` tokenizer tokenizes Thai language text. Because words in Thai language are not separated by spaces, the tokenizer must identify word boundaries based on language-specific rules.

## Example usage

The following example request creates a new index named `thai_index` and configures an analyzer with a `thai` tokenizer:

```json
PUT /thai_index
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "thai_tokenizer": {
          "type": "thai"
        }
      },
      "analyzer": {
        "thai_analyzer": {
          "type": "custom",
          "tokenizer": "thai_tokenizer"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "thai_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /thai_index/_analyze
{
  "analyzer": "thai_analyzer",
  "text": "ฉันชอบไปเที่ยวที่เชียงใหม่"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "ฉัน",
      "start_offset": 0,
      "end_offset": 3,
      "type": "word",
      "position": 0
    },
    {
      "token": "ชอบ",
      "start_offset": 3,
      "end_offset": 6,
      "type": "word",
      "position": 1
    },
    {
      "token": "ไป",
      "start_offset": 6,
      "end_offset": 8,
      "type": "word",
      "position": 2
    },
    {
      "token": "เที่ยว",
      "start_offset": 8,
      "end_offset": 14,
      "type": "word",
      "position": 3
    },
    {
      "token": "ที่",
      "start_offset": 14,
      "end_offset": 17,
      "type": "word",
      "position": 4
    },
    {
      "token": "เชียงใหม่",
      "start_offset": 17,
      "end_offset": 26,
      "type": "word",
      "position": 5
    }
  ]
}
```
