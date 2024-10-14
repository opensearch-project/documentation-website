---
layout: default
title: Simple analyzer
nav_order: 50
---

# Simple analyzer

The `simple` analyzer is a very basic analyzer that breaks text into terms at non-letter characters and lowercases the terms. Unlike the `standard` analyzer, the `simple` analyzer treats everything except alphabetic characters as delimiters, meaning it does not recognize numbers, punctuation, or special characters as part of the tokens.

## Example configuration

You can use the following command to create index `my_simple_index` with `simple` analyzer:

```json
PUT /my_simple_index
{
  "mappings": {
    "properties": {
      "my_field": {
        "type": "text",
        "analyzer": "simple"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Configuring custom analyzer

You can use the following command to configure index `my_custom_simple_index` with custom analyzer equivalent to `simple` analyzer but with added `html_strip` character filter:

```json
PUT /my_custom_simple_index
{
  "settings": {
    "analysis": {
      "char_filter": {
        "html_strip": {
          "type": "html_strip"
        }
      },
      "tokenizer": {
        "my_lowercase_tokenizer": {
          "type": "lowercase"
        }
      },
      "analyzer": {
        "my_custom_simple_analyzer": {
          "type": "custom",
          "char_filter": ["html_strip"],
          "tokenizer": "my_lowercase_tokenizer",
          "filter": ["lowercase"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "my_field": {
        "type": "text",
        "analyzer": "my_custom_simple_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

