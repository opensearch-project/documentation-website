---
layout: default
title: Armenian
parent: Language analyzers
grand_parent: Analyzers
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/analyzers/language-analyzers/armenian/
---

# Armenian analyzer

The built-in `armenian` analyzer can be applied to a text field using the following command:

```json
PUT /arabic-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "armenian"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_armenian_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_armenian_analyzer": {
          "type": "armenian",
          "stem_exclusion": ["բարև", "խաղաղություն"] 
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Armenian analyzer internals

The `armenian` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Armenian)
  - keyword
  - stemmer (Armenian)

## Custom Armenian analyzer

You can create a custom Armenian analyzer using the following command:

```json
PUT /armenian-index
{
  "settings": {
    "analysis": {
      "filter": {
        "armenian_stop": {
          "type": "stop",
          "stopwords": "_armenian_"
        },
        "armenian_stemmer": {
          "type": "stemmer",
          "language": "armenian"
        },
        "armenian_keywords": {
          "type":       "keyword_marker",
          "keywords":   [] 
        }
      },
      "analyzer": {
        "armenian_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "armenian_stop",
            "armenian_keywords",
            "armenian_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "armenian_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
GET armenian-index/_analyze
{
  "analyzer": "stem_exclusion_armenian_analyzer",
  "text": "բարև բոլորին, մենք խաղաղություն ենք ուզում և նոր օր ենք սկսել"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "բարև","start_offset": 0,"end_offset": 4,"type": "<ALPHANUM>","position": 0},
    {"token": "բոլոր","start_offset": 5,"end_offset": 12,"type": "<ALPHANUM>","position": 1},
    {"token": "խաղաղություն","start_offset": 19,"end_offset": 31,"type": "<ALPHANUM>","position": 3},
    {"token": "ուզ","start_offset": 36,"end_offset": 42,"type": "<ALPHANUM>","position": 5},
    {"token": "նոր","start_offset": 45,"end_offset": 48,"type": "<ALPHANUM>","position": 7},
    {"token": "օր","start_offset": 49,"end_offset": 51,"type": "<ALPHANUM>","position": 8},
    {"token": "սկսել","start_offset": 56,"end_offset": 61,"type": "<ALPHANUM>","position": 10}
  ]
}
```