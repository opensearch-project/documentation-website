---
layout: default
title: English
parent: Language analyzers
grand_parent: Analyzers
nav_order: 120
canonical_url: https://docs.opensearch.org/latest/analyzers/language-analyzers/english/
---

# English analyzer

The built-in `english` analyzer can be applied to a text field using the following command:

```json
PUT /english-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "english"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_english_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_english_analyzer": {
          "type": "english",
          "stem_exclusion": ["authority", "authorization"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## English analyzer internals

The `english` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - stemmer (possessive_english)
  - lowercase
  - stop (English)
  - keyword
  - stemmer (English)

## Custom English analyzer

You can create a custom English analyzer using the following command:

```json
PUT /english-index
{
  "settings": {
    "analysis": {
      "filter": {
        "english_stop": {
          "type": "stop",
          "stopwords": "_english_"
        },
        "english_stemmer": {
          "type": "stemmer",
          "language": "english"
        },
        "english_keywords": {
          "type": "keyword_marker",
          "keywords": []
        },
        "english_possessive_stemmer": {
          "type":       "stemmer",
          "language":   "possessive_english"
        }
      },
      "analyzer": {
        "english_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "english_possessive_stemmer",
            "lowercase",
            "english_stop",
            "english_keywords",
            "english_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "english_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /english-index/_analyze
{
  "field": "content",
  "text": "The students study in the USA and work at NASA. Their numbers are 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "student","start_offset": 4,"end_offset": 12,"type": "<ALPHANUM>","position": 1},
    {"token": "studi","start_offset": 13,"end_offset": 18,"type": "<ALPHANUM>","position": 2},
    {"token": "usa","start_offset": 26,"end_offset": 29,"type": "<ALPHANUM>","position": 5},
    {"token": "work","start_offset": 34,"end_offset": 38,"type": "<ALPHANUM>","position": 7},
    {"token": "nasa","start_offset": 42,"end_offset": 46,"type": "<ALPHANUM>","position": 9},
    {"token": "number","start_offset": 54,"end_offset": 61,"type": "<ALPHANUM>","position": 11},
    {"token": "123456","start_offset": 66,"end_offset": 72,"type": "<NUM>","position": 13}
  ]
}
```