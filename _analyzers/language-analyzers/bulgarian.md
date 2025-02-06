---
layout: default
title: Bulgarian
parent: Language analyzers
grand_parent: Analyzers
nav_order: 60
---

# Bulgarian analyzer

The built-in `bulgarian` analyzer can be applied to a text field using the following command:

```json
PUT /bulgarian-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "bulgarian"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_bulgarian_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_bulgarian_analyzer": {
          "type": "bulgarian",
          "stem_exclusion": ["авторитет", "одобрение"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Bulgarian analyzer internals

The `bulgarian` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Bulgarian)
  - keyword
  - stemmer (Bulgarian)

## Custom Bulgarian analyzer

You can create a custom Bulgarian analyzer using the following command:

```json
PUT /bulgarian-index
{
  "settings": {
    "analysis": {
      "filter": {
        "bulgarian_stop": {
          "type": "stop",
          "stopwords": "_bulgarian_"
        },
        "bulgarian_stemmer": {
          "type": "stemmer",
          "language": "bulgarian"
        },
        "bulgarian_keywords": {
          "type":       "keyword_marker",
          "keywords":   [] 
        }
      },
      "analyzer": {
        "bulgarian_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "bulgarian_stop",
            "bulgarian_keywords",
            "bulgarian_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "bulgarian_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /bulgarian-index/_analyze
{
  "field": "content",
  "text": "Студентите учат в българските университети. Техните номера са 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "студент","start_offset": 0,"end_offset": 10,"type": "<ALPHANUM>","position": 0},
    {"token": "учат","start_offset": 11,"end_offset": 15,"type": "<ALPHANUM>","position": 1},
    {"token": "българск","start_offset": 18,"end_offset": 29,"type": "<ALPHANUM>","position": 3},
    {"token": "университят","start_offset": 30,"end_offset": 42,"type": "<ALPHANUM>","position": 4},
    {"token": "техн","start_offset": 44,"end_offset": 51,"type": "<ALPHANUM>","position": 5},
    {"token": "номер","start_offset": 52,"end_offset": 58,"type": "<ALPHANUM>","position": 6},
    {"token": "123456","start_offset": 62,"end_offset": 68,"type": "<NUM>","position": 8}
  ]
}
```