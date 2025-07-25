---
layout: default
title: Latvian
parent: Language analyzers
grand_parent: Analyzers
nav_order: 230
canonical_url: https://docs.opensearch.org/latest/analyzers/language-analyzers/latvian/
---

# Latvian analyzer

The built-in `latvian` analyzer can be applied to a text field using the following command:

```json
PUT /latvian-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "latvian"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_latvian_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_latvian_analyzer": {
          "type": "latvian",
          "stem_exclusion": ["autoritāte", "apstiprinājums"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Latvian analyzer internals

The `latvian` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Latvian)
  - keyword
  - stemmer (Latvian)

## Custom Latvian analyzer

You can create a custom Latvian analyzer using the following command:

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
POST /latvian-index/_analyze
{
  "field": "content",
  "text": "Studenti mācās Latvijas universitātēs. Viņu numuri ir 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "student","start_offset": 0,"end_offset": 8,"type": "<ALPHANUM>","position": 0},
    {"token": "māc","start_offset": 9,"end_offset": 14,"type": "<ALPHANUM>","position": 1},
    {"token": "latvij","start_offset": 15,"end_offset": 23,"type": "<ALPHANUM>","position": 2},
    {"token": "universitāt","start_offset": 24,"end_offset": 37,"type": "<ALPHANUM>","position": 3},
    {"token": "vin","start_offset": 39,"end_offset": 43,"type": "<ALPHANUM>","position": 4},
    {"token": "numur","start_offset": 44,"end_offset": 50,"type": "<ALPHANUM>","position": 5},
    {"token": "123456","start_offset": 54,"end_offset": 60,"type": "<NUM>","position": 7}
  ]
}
```