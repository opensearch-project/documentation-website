---
layout: default
title: Brazilian
parent: Language analyzers
grand_parent: Analyzers
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/analyzers/language-analyzers/brazilian/
---

# Brazilian analyzer

The built-in `brazilian` analyzer can be applied to a text field using the following command:

```json
PUT /brazilian-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "brazilian"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_brazilian_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_brazilian_analyzer": {
          "type": "brazilian",
          "stem_exclusion": ["autoridade", "aprovação"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Brazilian analyzer internals

The `brazilian` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Brazilian)
  - keyword
  - stemmer (Brazilian)

## Custom Brazilian analyzer

You can create a custom Brazilian analyzer using the following command:

```json
PUT /brazilian-index
{
  "settings": {
    "analysis": {
      "filter": {
        "brazilian_stop": {
          "type": "stop",
          "stopwords": "_brazilian_"
        },
        "brazilian_stemmer": {
          "type": "stemmer",
          "language": "brazilian"
        },
        "brazilian_keywords": {
          "type":       "keyword_marker",
          "keywords":   [] 
        }
      },
      "analyzer": {
        "brazilian_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "brazilian_stop",
            "brazilian_keywords",
            "brazilian_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "brazilian_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /brazilian-index/_analyze
{
  "field": "content",
  "text": "Estudantes estudam em universidades brasileiras. Seus números são 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "estudant","start_offset": 0,"end_offset": 10,"type": "<ALPHANUM>","position": 0},
    {"token": "estud","start_offset": 11,"end_offset": 18,"type": "<ALPHANUM>","position": 1},
    {"token": "univers","start_offset": 22,"end_offset": 35,"type": "<ALPHANUM>","position": 3},
    {"token": "brasileir","start_offset": 36,"end_offset": 47,"type": "<ALPHANUM>","position": 4},
    {"token": "numer","start_offset": 54,"end_offset": 61,"type": "<ALPHANUM>","position": 6},
    {"token": "sao","start_offset": 62,"end_offset": 65,"type": "<ALPHANUM>","position": 7},
    {"token": "123456","start_offset": 66,"end_offset": 72,"type": "<NUM>","position": 8}
  ]
}
```