---
layout: default
title: Stop analyzer
parent: Analyzers
nav_order: 110
canonical_url: https://docs.opensearch.org/latest/analyzers/supported-analyzers/stop/
---

# Stop analyzer

The `stop` analyzer removes a predefined list of stopwords. This analyzer consists of a `lowercase` tokenizer and a `stop` token filter.

## Parameters

You can configure a `stop` analyzer with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`stopwords` | Optional | String or list of strings | A string specifying a predefined list of stopwords (such as `_english_`) or an array specifying a custom list of stopwords. Default is `_english_`.
`stopwords_path` | Optional | String | The path (absolute or relative to the config directory) to the file containing a list of stopwords.

## Example

Use the following command to create an index named `my_stop_index` with a `stop` analyzer:

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

## Configuring a custom analyzer

Use the following command to configure an index with a custom analyzer that is equivalent to a `stop` analyzer:

```json
PUT /my_custom_stop_analyzer_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_stop_analyzer": {
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

Use the following request to examine the tokens generated using the analyzer:

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

# Specifying stopwords

The following example request specifies a custom list of stopwords:

```json
PUT /my_new_custom_stop_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_stop_analyzer": {
          "type": "stop",                     
          "stopwords": ["is", "and", "was"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "description": {
        "type": "text",
        "analyzer": "my_custom_stop_analyzer" 
      }
    }
  }
}
```
{% include copy-curl.html %}

The following example request specifies a path to the file containing stopwords:

```json
PUT /my_new_custom_stop_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_stop_analyzer": {
          "type": "stop",                     
          "stopwords_path": "stopwords.txt"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "description": {
        "type": "text",
        "analyzer": "my_custom_stop_analyzer" 
      }
    }
  }
}
```
{% include copy-curl.html %}

In this example, the file is located in the config directory. You can also specify a full path to the file.