---
layout: default
title: Irish
parent: Language analyzers
grand_parent: Analyzers
nav_order: 210
canonical_url: https://docs.opensearch.org/latest/analyzers/language-analyzers/irish/
---

# Irish analyzer

The built-in `irish` analyzer can be applied to a text field using the following command:

```json
PUT /irish-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "irish"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_irish_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_irish_analyzer": {
          "type": "irish",
          "stem_exclusion": ["údarás", "faomhadh"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Irish analyzer internals

The `irish` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - hyphenation (Irish)
  - elision (Irish)
  - lowercase (Irish)
  - stop (Irish)
  - keyword
  - stemmer (Irish)

## Custom Irish analyzer

You can create a custom Irish analyzer using the following command:

```json
PUT /irish-index
{
  "settings": {
    "analysis": {
      "filter": {
        "irish_stop": {
          "type": "stop",
          "stopwords": "_irish_"
        },
        "irish_elision": {
          "type":       "elision",
          "articles":   [ "d", "m", "b" ],
          "articles_case": true
        },
        "irish_hyphenation": {
          "type":       "stop",
          "stopwords":  [ "h", "n", "t" ],
          "ignore_case": true
        },
        "irish_lowercase": {
          "type":       "lowercase",
          "language":   "irish"
        },
        "irish_stemmer": {
          "type": "stemmer",
          "language": "irish"
        },
        "irish_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "analyzer": {
        "irish_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "irish_hyphenation",
            "irish_elision",
            "irish_lowercase",
            "irish_stop",
            "irish_keywords",
            "irish_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "irish_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /irish-index/_analyze
{
  "field": "content",
  "text": "Tá mic léinn ag staidéar in ollscoileanna na hÉireann. Is iad a gcuid uimhreacha ná 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "tá","start_offset": 0,"end_offset": 2,"type": "<ALPHANUM>","position": 0},
    {"token": "mic","start_offset": 3,"end_offset": 6,"type": "<ALPHANUM>","position": 1},
    {"token": "léinn","start_offset": 7,"end_offset": 12,"type": "<ALPHANUM>","position": 2},
    {"token": "staidéar","start_offset": 16,"end_offset": 24,"type": "<ALPHANUM>","position": 4},
    {"token": "ollscoileanna","start_offset": 28,"end_offset": 41,"type": "<ALPHANUM>","position": 6},
    {"token": "héireann","start_offset": 45,"end_offset": 53,"type": "<ALPHANUM>","position": 8},
    {"token": "cuid","start_offset": 64,"end_offset": 69,"type": "<ALPHANUM>","position": 12},
    {"token": "uimhreacha","start_offset": 70,"end_offset": 80,"type": "<ALPHANUM>","position": 13},
    {"token": "123456","start_offset": 84,"end_offset": 90,"type": "<NUM>","position": 15}
  ]
}
```