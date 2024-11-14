---
layout: default
title: Estonian
parent: Language analyzers
grand_parent: Analyzers
nav_order: 130
---

# Estonian analyzer

The built-in `estonian` analyzer can be applied to a text field using the following command:

```json
PUT /estonian-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "estonian"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_estonian_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_estonian_analyzer": {
          "type": "estonian",
          "stem_exclusion": ["autoriteet", "kinnitus"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Estonian analyzer internals

The `estonian` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Estonian)
  - keyword
  - stemmer (Estonian)

## Custom Estonian analyzer

You can create a custom Estonian analyzer using the following command:

```json
PUT /estonian-index
{
  "settings": {
    "analysis": {
      "filter": {
        "estonian_stop": {
          "type": "stop",
          "stopwords": "_estonian_"
        },
        "estonian_stemmer": {
          "type": "stemmer",
          "language": "estonian"
        },
        "estonian_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "analyzer": {
        "estonian_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "estonian_stop",
            "estonian_keywords",
            "estonian_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "estonian_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /estonian-index/_analyze
{
  "field": "content",
  "text": "Õpilased õpivad Tallinnas ja Eesti ülikoolides. Nende numbrid on 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "õpilase","start_offset": 0,"end_offset": 8,"type": "<ALPHANUM>","position": 0},
    {"token": "õpi","start_offset": 9,"end_offset": 15,"type": "<ALPHANUM>","position": 1},
    {"token": "tallinna","start_offset": 16,"end_offset": 25,"type": "<ALPHANUM>","position": 2},
    {"token": "eesti","start_offset": 29,"end_offset": 34,"type": "<ALPHANUM>","position": 4},
    {"token": "ülikooli","start_offset": 35,"end_offset": 46,"type": "<ALPHANUM>","position": 5},
    {"token": "nende","start_offset": 48,"end_offset": 53,"type": "<ALPHANUM>","position": 6},
    {"token": "numbri","start_offset": 54,"end_offset": 61,"type": "<ALPHANUM>","position": 7},
    {"token": "on","start_offset": 62,"end_offset": 64,"type": "<ALPHANUM>","position": 8},
    {"token": "123456","start_offset": 65,"end_offset": 71,"type": "<NUM>","position": 9}
  ]
}
```