---
layout: default
title: Italian
parent: Language analyzers
grand_parent: Analyzers
nav_order: 220
---

# Italian analyzer

The built-in `italian` analyzer can be applied to a text field using the following command:

```json
PUT /italian-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "italian"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_italian_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_italian_analyzer": {
          "type": "italian",
          "stem_exclusion": ["autorità", "approvazione"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Italian analyzer internals

The `italian` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - elision (Italian)
  - lowercase
  - stop (Italian)
  - keyword
  - stemmer (Italian)

## Custom Italian analyzer

You can create a custom Italian analyzer using the following command:

```json
PUT /italian-index
{
  "settings": {
    "analysis": {
      "filter": {
        "italian_stop": {
          "type": "stop",
          "stopwords": "_italian_"
        },
        "italian_elision": {
          "type": "elision",
          "articles": [
                "c", "l", "all", "dall", "dell",
                "nell", "sull", "coll", "pell",
                "gl", "agl", "dagl", "degl", "negl",
                "sugl", "un", "m", "t", "s", "v", "d"
          ],
          "articles_case": true
        },
        "italian_stemmer": {
          "type": "stemmer",
          "language": "light_italian"
        },
        "italian_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "analyzer": {
        "italian_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "italian_elision",
            "lowercase",
            "italian_stop",
            "italian_keywords",
            "italian_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "italian_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /italian-index/_analyze
{
  "field": "content",
  "text": "Gli studenti studiano nelle università italiane. I loro numeri sono 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "student","start_offset": 4,"end_offset": 12,"type": "<ALPHANUM>","position": 1},
    {"token": "studian","start_offset": 13,"end_offset": 21,"type": "<ALPHANUM>","position": 2},
    {"token": "universit","start_offset": 28,"end_offset": 38,"type": "<ALPHANUM>","position": 4},
    {"token": "italian","start_offset": 39,"end_offset": 47,"type": "<ALPHANUM>","position": 5},
    {"token": "numer","start_offset": 56,"end_offset": 62,"type": "<ALPHANUM>","position": 8},
    {"token": "123456","start_offset": 68,"end_offset": 74,"type": "<NUM>","position": 10}
  ]
}
```