---
layout: default
title: Hungarian
parent: Language analyzers
grand_parent: Analyzers
nav_order: 200
---

# Hungarian analyzer

The built-in `hungarian` analyzer can be applied to a text field using the following command:

```json
PUT /hungarian-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "hungarian"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_hungarian_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_hungarian_analyzer": {
          "type": "hungarian",
          "stem_exclusion": ["hatalom", "jóváhagyás"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Hungarian analyzer internals

The `hungarian` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Hungarian)
  - keyword
  - stemmer (Hungarian)

## Custom Hungarian analyzer

You can create a custom Hungarian analyzer using the following command:

```json
PUT /hungarian-index
{
  "settings": {
    "analysis": {
      "filter": {
        "hungarian_stop": {
          "type": "stop",
          "stopwords": "_hungarian_"
        },
        "hungarian_stemmer": {
          "type": "stemmer",
          "language": "hungarian"
        },
        "hungarian_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "analyzer": {
        "hungarian_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "hungarian_stop",
            "hungarian_keywords",
            "hungarian_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "hungarian_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /hungarian-index/_analyze
{
  "field": "content",
  "text": "A diákok a magyar egyetemeken tanulnak. A számaik 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "diák",
      "start_offset": 2,
      "end_offset": 8,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "magyar",
      "start_offset": 11,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "egyetem",
      "start_offset": 18,
      "end_offset": 29,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "tanul",
      "start_offset": 30,
      "end_offset": 38,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "szám",
      "start_offset": 42,
      "end_offset": 49,
      "type": "<ALPHANUM>",
      "position": 7
    },
    {
      "token": "123456",
      "start_offset": 50,
      "end_offset": 56,
      "type": "<NUM>",
      "position": 8
    }
  ]
}
```