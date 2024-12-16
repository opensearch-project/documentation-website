---
layout: default
title: Danish
parent: Language analyzers
grand_parent: Analyzers
nav_order: 100
---

# Danish analyzer

The built-in `danish` analyzer can be applied to a text field using the following command:

```json
PUT /danish-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "danish"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_danish_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_danish_analyzer": {
          "type": "danish",
          "stem_exclusion": ["autoritet", "godkendelse"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Danish analyzer internals

The `danish` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Danish)
  - keyword
  - stemmer (Danish)

## Custom Danish analyzer

You can create a custom Danish analyzer using the following command:

```json
PUT /danish-index
{
  "settings": {
    "analysis": {
      "filter": {
        "danish_stop": {
          "type": "stop",
          "stopwords": "_danish_"
        },
        "danish_stemmer": {
          "type": "stemmer",
          "language": "danish"
        },
        "danish_keywords": {
          "type":       "keyword_marker",
          "keywords":   [] 
        }
      },
      "analyzer": {
        "danish_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "danish_stop",
            "danish_keywords",
            "danish_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "danish_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /danish-index/_analyze
{
  "field": "content",
  "text": "Studerende studerer på de danske universiteter. Deres numre er 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "stud",
      "start_offset": 0,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "stud",
      "start_offset": 11,
      "end_offset": 19,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "dansk",
      "start_offset": 26,
      "end_offset": 32,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "universitet",
      "start_offset": 33,
      "end_offset": 46,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "numr",
      "start_offset": 54,
      "end_offset": 59,
      "type": "<ALPHANUM>",
      "position": 7
    },
    {
      "token": "123456",
      "start_offset": 63,
      "end_offset": 69,
      "type": "<NUM>",
      "position": 9
    }
  ]
}
```