---
layout: default
title: Catalan
parent: Language analyzers
grand_parent: Analyzers
nav_order: 70
canonical_url: https://docs.opensearch.org/latest/analyzers/language-analyzers/catalan/
---

# Catalan analyzer

The built-in `catalan` analyzer can be applied to a text field using the following command:

```json
PUT /catalan-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "catalan"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_catalan_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_catalan_analyzer": {
          "type": "catalan",
          "stem_exclusion": ["autoritat", "aprovació"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Catalan analyzer internals

The `catalan` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - elision (Catalan)
  - lowercase
  - stop (Catalan)
  - keyword
  - stemmer (Catalan)

## Custom Catalan analyzer

You can create a custom Catalan analyzer using the following command:

```json
PUT /catalan-index
{
  "settings": {
    "analysis": {
      "filter": {
        "catalan_stop": {
          "type": "stop",
          "stopwords": "_catalan_"
        },
        "catalan_elision": {
          "type":       "elision",
          "articles":   [ "d", "l", "m", "n", "s", "t"],
          "articles_case": true
        },
        "catalan_stemmer": {
          "type": "stemmer",
          "language": "catalan"
        },
        "catalan_keywords": {
          "type":       "keyword_marker",
          "keywords":   [] 
        }
      },
      "analyzer": {
        "catalan_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "catalan_elision",
            "lowercase",
            "catalan_stop",
            "catalan_keywords",
            "catalan_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "catalan_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /catalan-index/_analyze
{
  "field": "content",
  "text": "Els estudiants estudien a les universitats catalanes. Els seus números són 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "estud","start_offset": 4,"end_offset": 14,"type": "<ALPHANUM>","position": 1},
    {"token": "estud","start_offset": 15,"end_offset": 23,"type": "<ALPHANUM>","position": 2},
    {"token": "univer","start_offset": 30,"end_offset": 42,"type": "<ALPHANUM>","position": 5},
    {"token": "catalan","start_offset": 43,"end_offset": 52,"type": "<ALPHANUM>","position": 6},
    {"token": "numer","start_offset": 63,"end_offset": 70,"type": "<ALPHANUM>","position": 9},
    {"token": "123456","start_offset": 75,"end_offset": 81,"type": "<NUM>","position": 11}
  ]
}
```