---
layout: default
title: Finnish
parent: Language analyzers
grand_parent: Analyzers
nav_order: 140
---

# Finnish analyzer

The built-in `finnish` analyzer can be applied to a text field using the following command:

```json
PUT /finnish-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "finnish"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_finnish_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_finnish_analyzer": {
          "type": "finnish",
          "stem_exclusion": ["valta", "hyväksyntä"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Finnish analyzer internals

The `finnish` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Finnish)
  - keyword
  - stemmer (Finnish)

## Custom Finnish analyzer

You can create a custom Finnish analyzer using the following command:

```json
PUT /finnish-index
{
  "settings": {
    "analysis": {
      "filter": {
        "finnish_stop": {
          "type": "stop",
          "stopwords": "_finnish_"
        },
        "finnish_stemmer": {
          "type": "stemmer",
          "language": "finnish"
        },
        "finnish_keywords": {
          "type": "keyword_marker",
          "keywords": ["Helsinki", "Suomi"]
        }
      },
      "analyzer": {
        "finnish_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "finnish_stop",
            "finnish_keywords",
            "finnish_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "finnish_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /finnish-index/_analyze
{
  "field": "content",
  "text": "Opiskelijat opiskelevat Helsingissä ja Suomen yliopistoissa. Heidän numeronsa ovat 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "opiskelij","start_offset": 0,"end_offset": 11,"type": "<ALPHANUM>","position": 0},
    {"token": "opiskelev","start_offset": 12,"end_offset": 23,"type": "<ALPHANUM>","position": 1},
    {"token": "helsing","start_offset": 24,"end_offset": 35,"type": "<ALPHANUM>","position": 2},
    {"token": "suome","start_offset": 39,"end_offset": 45,"type": "<ALPHANUM>","position": 4},
    {"token": "yliopisto","start_offset": 46,"end_offset": 59,"type": "<ALPHANUM>","position": 5},
    {"token": "numero","start_offset": 68,"end_offset": 77,"type": "<ALPHANUM>","position": 7},
    {"token": "123456","start_offset": 83,"end_offset": 89,"type": "<NUM>","position": 9}
  ]
}
```