---
layout: default
title: Stop analyzer
nav_order: 70
---

# Stop analyzer

The `stop` analyzer is a built in analyzer that is designed to remove words based on a predefined list of stop words. This analyzer is made up of `lowercase` tokenizer and `stop` token filter.

## Example configuration

You can use the following command to create index `my_stop_index` with `stop` analyzer:

```json
PUT /my_stop_index
{
  "mappings": {
    "properties": {
      "my_field": {
        "type": "text",
        "analyzer": "stop"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Configuring custom analyzer

You can use the following command to configure index `my_custom_stop_analyzer_index` with custom analyzer equivalent to `stop` analyzer:

```json
PUT /my_custom_stop_analyzer_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_stop_analyzer": {
          "type": "custom",
          "tokenizer": "lowercase",
          "filter": [
            "stop"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "my_field": {
        "type": "text",
        "analyzer": "my_custom_stop_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the created analyzer:

```json
POST /my_custom_stop_analyzer_index/_analyze
{
  "analyzer": "my_custom_stop_analyzer",
  "text": "The large turtle is green and brown"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "large",
      "start_offset": 4,
      "end_offset": 9,
      "type": "word",
      "position": 1
    },
    {
      "token": "turtle",
      "start_offset": 10,
      "end_offset": 16,
      "type": "word",
      "position": 2
    },
    {
      "token": "green",
      "start_offset": 20,
      "end_offset": 25,
      "type": "word",
      "position": 4
    },
    {
      "token": "brown",
      "start_offset": 30,
      "end_offset": 35,
      "type": "word",
      "position": 6
    }
  ]
}
```
