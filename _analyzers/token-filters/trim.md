---
layout: default
title: Trim
parent: Token filters
nav_order: 430
---

# Trim token filter

The `trim` token filter is a simple yet useful token filter that removes leading and trailing whitespace from tokens. Many popular tokenizers, for example standard, keyword, or whitespace tokenizers, automatically strip away any leading or trailing spaces during the tokenization process. In such case there is no need to use `trim` token filter. 


## Example

The following example request creates a new index named `my_pattern_trim_index` and configures an analyzer with `trim` filter and tokenizer which does not remove leading and trailing whitespace:

```json
PUT /my_pattern_trim_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_trim_filter": {
          "type": "trim"
        }
      },
      "tokenizer": {
        "my_pattern_tokenizer": {
          "type": "pattern",
          "pattern": ","
        }
      },
      "analyzer": {
        "my_pattern_trim_analyzer": {
          "type": "custom",
          "tokenizer": "my_pattern_tokenizer",
          "filter": [
            "lowercase",
            "my_trim_filter"
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
GET /my_pattern_trim_index/_analyze
{
  "analyzer": "my_pattern_trim_analyzer",
  "text": " OpenSearch ,  is ,   powerful  "
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
      "end_offset": 12,
      "type": "word",
      "position": 0
    },
    {
      "token": "is",
      "start_offset": 13,
      "end_offset": 18,
      "type": "word",
      "position": 1
    },
    {
      "token": "powerful",
      "start_offset": 19,
      "end_offset": 32,
      "type": "word",
      "position": 2
    }
  ]
}
```
