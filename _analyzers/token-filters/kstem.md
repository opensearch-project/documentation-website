---
layout: default
title: Kstem
parent: Token filters
nav_order: 220
---

# Kstem token filter

The `length` token filter is a stemming filter used to reduce words to their root forms. The KStem filter is a lightweight, algorithmic stemmer designed for the English language, performing the following stemming:

- Reduces plurals to singular form.
- Converts different tenses of verbs to their base form.
- Removes common derivational endings such as "-ing", "-ed".

## Example

The following example request creates a new index named `my_kstem_index` and configures an analyzer with `kstem` filter:

```json
PUT /my_kstem_index
{
  "settings": {
    "analysis": {
      "filter": {
        "kstem_filter": {
          "type": "kstem"
        }
      },
      "analyzer": {
        "my_kstem_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "kstem_filter"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "my_kstem_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the created analyzer:

```json
POST /my_kstem_index/_analyze
{
  "analyzer": "my_kstem_analyzer",
  "text": "stops stopped"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "stop",
      "start_offset": 0,
      "end_offset": 5,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "stop",
      "start_offset": 6,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 1
    }
  ]
}
```