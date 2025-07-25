---
layout: default
title: Galician
parent: Language analyzers
grand_parent: Analyzers
nav_order: 160
canonical_url: https://docs.opensearch.org/latest/analyzers/language-analyzers/galician/
---

# Galician analyzer

The built-in `galician` analyzer can be applied to a text field using the following command:

```json
PUT /galician-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "galician"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_galician_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_galician_analyzer": {
          "type": "galician",
          "stem_exclusion": ["autoridade", "aceptación"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Galician analyzer internals

The `galician` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (French)
  - keyword
  - stemmer (French)

## Custom Galician analyzer

You can create a custom Galician analyzer using the following command:

```json
PUT /galician-index
{
  "settings": {
    "analysis": {
      "filter": {
        "galician_stop": {
          "type": "stop",
          "stopwords": "_galician_"
        },
        "galician_stemmer": {
          "type": "stemmer",
          "language": "galician"
        },
        "galician_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "analyzer": {
        "galician_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "galician_stop",
            "galician_keywords",
            "galician_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "galician_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /galician-index/_analyze
{
  "field": "content",
  "text": "Os estudantes estudan en Santiago e nas universidades galegas. Os seus números son 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "estud","start_offset": 3,"end_offset": 13,"type": "<ALPHANUM>","position": 1},
    {"token": "estud","start_offset": 14,"end_offset": 21,"type": "<ALPHANUM>","position": 2},
    {"token": "santiag","start_offset": 25,"end_offset": 33,"type": "<ALPHANUM>","position": 4},
    {"token": "univers","start_offset": 40,"end_offset": 53,"type": "<ALPHANUM>","position": 7},
    {"token": "galeg","start_offset": 54,"end_offset": 61,"type": "<ALPHANUM>","position": 8},
    {"token": "numer","start_offset": 71,"end_offset": 78,"type": "<ALPHANUM>","position": 11},
    {"token": "son","start_offset": 79,"end_offset": 82,"type": "<ALPHANUM>","position": 12},
    {"token": "123456","start_offset": 83,"end_offset": 89,"type": "<NUM>","position": 13}
  ]
}
```