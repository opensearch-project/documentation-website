---
layout: default
title: Turkish
parent: Language analyzers
grand_parent: Analyzers
nav_order: 330
---

# Turkish analyzer

The built-in `turkish` analyzer can be applied to a text field using the following command:

```json
PUT /turkish-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "turkish"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_turkish_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_turkish_analyzer": {
          "type": "turkish",
          "stem_exclusion": ["otorite", "onay"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Turkish analyzer internals

The `turkish` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - apostrophe
  - lowercase (Turkish)
  - stop (Turkish)
  - keyword
  - stemmer (Turkish)

## Custom Turkish analyzer

You can create a custom Turkish analyzer using the following command:

```json
PUT /turkish-index
{
  "settings": {
    "analysis": {
      "filter": {
        "turkish_stop": {
          "type": "stop",
          "stopwords": "_turkish_"
        },
        "turkish_stemmer": {
          "type": "stemmer",
          "language": "turkish"
        },
        "turkish_lowercase": {
          "type":       "lowercase",
          "language":   "turkish"
        },
        "turkish_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "analyzer": {
        "turkish_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "apostrophe",
            "turkish_lowercase",
            "turkish_stop",
            "turkish_keywords",
            "turkish_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "turkish_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /turkish-index/_analyze
{
  "field": "content",
  "text": "Öğrenciler Türk üniversitelerinde öğrenim görüyor. Numara 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "öğrenci","start_offset": 0,"end_offset": 10,"type": "<ALPHANUM>","position": 0},
    {"token": "türk","start_offset": 11,"end_offset": 15,"type": "<ALPHANUM>","position": 1},
    {"token": "üniversite","start_offset": 16,"end_offset": 33,"type": "<ALPHANUM>","position": 2},
    {"token": "öğre","start_offset": 34,"end_offset": 41,"type": "<ALPHANUM>","position": 3},
    {"token": "görüyor","start_offset": 42,"end_offset": 49,"type": "<ALPHANUM>","position": 4},
    {"token": "numar","start_offset": 51,"end_offset": 57,"type": "<ALPHANUM>","position": 5},
    {"token": "123456","start_offset": 58,"end_offset": 64,"type": "<NUM>","position": 6}
  ]
}
```