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

## Generated tokens

Use the following request to examine the tokens generated using the created analyzer:

```json
POST /my_custom_simple_index/_analyze
{
  "analyzer": "my_custom_simple_analyzer",
  "text": "<p>The slow turtle swims over to dogs &copy; 2024!</p>"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "the","start_offset": 3,"end_offset": 6,"type": "word","position": 0},
    {"token": "slow","start_offset": 7,"end_offset": 11,"type": "word","position": 1},
    {"token": "turtle","start_offset": 12,"end_offset": 18,"type": "word","position": 2},
    {"token": "swims","start_offset": 19,"end_offset": 24,"type": "word","position": 3},
    {"token": "over","start_offset": 25,"end_offset": 29,"type": "word","position": 4},
    {"token": "to","start_offset": 30,"end_offset": 32,"type": "word","position": 5},
    {"token": "dogs","start_offset": 33,"end_offset": 37,"type": "word","position": 6}
  ]
}
```
