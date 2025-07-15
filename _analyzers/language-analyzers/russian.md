---
layout: default
title: Russian
parent: Language analyzers
grand_parent: Analyzers
nav_order: 280
---

# Russian analyzer

The built-in `russian` analyzer can be applied to a text field using the following command:

```json
PUT /russian-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "russian"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_russian_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_russian_analyzer": {
          "type": "russian",
          "stem_exclusion": ["авторитет", "одобрение"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Russian analyzer internals

The `russian` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Russian)
  - keyword
  - stemmer (Russian)

## Custom Russian analyzer

You can create a custom Russian analyzer using the following command:

```json
PUT /russian-index
{
  "settings": {
    "analysis": {
      "filter": {
        "russian_stop": {
          "type": "stop",
          "stopwords": "_russian_"
        },
        "russian_stemmer": {
          "type": "stemmer",
          "language": "russian"
        },
        "russian_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "analyzer": {
        "russian_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "russian_stop",
            "russian_keywords",
            "russian_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "russian_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /russian-index/_analyze
{
  "field": "content",
  "text": "Студенты учатся в университетах России. Их номера 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "студент",
      "start_offset": 0,
      "end_offset": 8,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "учат",
      "start_offset": 9,
      "end_offset": 15,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "университет",
      "start_offset": 18,
      "end_offset": 31,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "росс",
      "start_offset": 32,
      "end_offset": 38,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "номер",
      "start_offset": 43,
      "end_offset": 49,
      "type": "<ALPHANUM>",
      "position": 6
    },
    {
      "token": "123456",
      "start_offset": 50,
      "end_offset": 56,
      "type": "<NUM>",
      "position": 7
    }
  ]
}
```