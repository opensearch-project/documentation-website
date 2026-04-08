---
layout: default
title: Basque
parent: Language analyzers
grand_parent: Analyzers
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/analyzers/language-analyzers/basque/
---

# Basque analyzer

The built-in `basque` analyzer can be applied to a text field using the following command:

```json
PUT /basque-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "basque"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_basque_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_basque_analyzer": {
          "type": "basque",
          "stem_exclusion": ["autoritate", "baldintza"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Basque analyzer internals

The `basque` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Basque)
  - keyword
  - stemmer (Basque)

## Custom Basque analyzer

You can create a custom Basque analyzer using the following command:

```json
PUT /basque-index
{
  "settings": {
    "analysis": {
      "filter": {
        "basque_stop": {
          "type": "stop",
          "stopwords": "_basque_"
        },
        "basque_stemmer": {
          "type": "stemmer",
          "language": "basque"
        },
        "basque_keywords": {
          "type":       "keyword_marker",
          "keywords":   [] 
        }
      },
      "analyzer": {
        "basque_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "basque_stop",
            "basque_keywords",
            "basque_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "basque_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /basque-index/_analyze
{
  "field": "content",
  "text": "Ikasleek euskal unibertsitateetan ikasten dute. Haien zenbakiak 123456 dira."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "ikasle","start_offset": 0,"end_offset": 8,"type": "<ALPHANUM>","position": 0},
    {"token": "euskal","start_offset": 9,"end_offset": 15,"type": "<ALPHANUM>","position": 1},
    {"token": "unibertsi","start_offset": 16,"end_offset": 33,"type": "<ALPHANUM>","position": 2},
    {"token": "ikas","start_offset": 34,"end_offset": 41,"type": "<ALPHANUM>","position": 3},
    {"token": "haien","start_offset": 48,"end_offset": 53,"type": "<ALPHANUM>","position": 5},
    {"token": "zenba","start_offset": 54,"end_offset": 63,"type": "<ALPHANUM>","position": 6},
    {"token": "123456","start_offset": 64,"end_offset": 70,"type": "<NUM>","position": 7}
  ]
}
```