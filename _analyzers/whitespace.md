---
layout: default
title: Whitespace analyzer
nav_order: 60
---

# Whitespace analyzer

The `whitespace` analyzer breaks text into tokens based solely on whitespace characters (spaces, tabs, etc.). It does not apply any transformations, such as lowercasing or removing stop words, therefore the case of the original text is retained and will include punctuation as part of the tokens.

## Example configuration

You can use the following command to create index `my_whitespace_index` with `whitespace` analyzer:

```json
PUT /my_whitespace_index
{
  "mappings": {
    "properties": {
      "my_field": {
        "type": "text",
        "analyzer": "whitespace"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Configuring custom analyzer

You can use the following command to configure index `my_custom_whitespace_index` with custom analyzer equivalent to `whitespace` analyzer but with added `lowercase` character filter:

```json
PUT /my_custom_whitespace_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_whitespace_analyzer": {
          "type": "custom",
          "tokenizer": "whitespace",
          "filter": ["lowercase"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "my_field": {
        "type": "text",
        "analyzer": "my_custom_whitespace_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the created analyzer:

```json
POST /my_custom_whitespace_index/_analyze
{
  "analyzer": "my_custom_whitespace_analyzer",
  "text": "The SLOW turtle swims away! 123"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "the","start_offset": 0,"end_offset": 3,"type": "word","position": 0},
    {"token": "slow","start_offset": 4,"end_offset": 8,"type": "word","position": 1},
    {"token": "turtle","start_offset": 9,"end_offset": 15,"type": "word","position": 2},
    {"token": "swims","start_offset": 16,"end_offset": 21,"type": "word","position": 3},
    {"token": "away!","start_offset": 22,"end_offset": 27,"type": "word","position": 4},
    {"token": "123","start_offset": 28,"end_offset": 31,"type": "word","position": 5}
  ]
}
```
