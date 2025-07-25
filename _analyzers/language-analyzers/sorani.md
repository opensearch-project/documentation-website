---
layout: default
title: Sorani
parent: Language analyzers
grand_parent: Analyzers
nav_order: 290
canonical_url: https://docs.opensearch.org/latest/analyzers/language-analyzers/sorani/
---

# Sorani analyzer

The built-in `sorani` analyzer can be applied to a text field using the following command:

```json
PUT /sorani-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "sorani"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_sorani_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_sorani_analyzer": {
          "type": "sorani",
          "stem_exclusion": ["مؤسسه", "اجازه"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Sorani analyzer internals

The `sorani` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - normalization (Sorani)
  - lowercase
  - decimal_digit
  - stop (Sorani)
  - keyword
  - stemmer (Sorani)

## Custom Sorani analyzer

You can create a custom Sorani analyzer using the following command:

```json
PUT /sorani-index
{
  "settings": {
    "analysis": {
      "filter": {
        "sorani_stop": {
          "type": "stop",
          "stopwords": "_sorani_"
        },
        "sorani_stemmer": {
          "type": "stemmer",
          "language": "sorani"
        },
        "sorani_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "analyzer": {
        "sorani_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "decimal_digit",
            "sorani_stop",
            "sorani_keywords",
            "sorani_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "sorani_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /sorani-index/_analyze
{
  "field": "content",
  "text": "خوێندنی فەرمی لە هەولێرەوە. ژمارەکان ١٢٣٤٥٦."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "خوێندن",
      "start_offset": 0,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "فەرم",
      "start_offset": 8,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "هەولێر",
      "start_offset": 17,
      "end_offset": 26,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "ژمار",
      "start_offset": 28,
      "end_offset": 36,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "123456",
      "start_offset": 37,
      "end_offset": 43,
      "type": "<NUM>",
      "position": 5
    }
  ]
}
```