---
layout: default
title: Lithuanian
parent: Language analyzers
grand_parent: Analyzers
nav_order: 230
---

# Lithuanian analyzer

The built-in `lithuanian` analyzer can be applied to a text field using the following command:

```json
PUT /lithuanian-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "lithuanian"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_lithuanian_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_lithuanian_analyzer": {
          "type": "lithuanian",
          "stem_exclusion": ["autoritetas", "patvirtinimas"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Lithuanian analyzer internals

The `lithuanian` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Lithuanian)
  - keyword
  - stemmer (Lithuanian)

## Custom Lithuanian analyzer

You can create a custom Lithuanian analyzer using the following command:

```json
PUT /lithuanian-index
{
  "settings": {
    "analysis": {
      "filter": {
        "lithuanian_stop": {
          "type": "stop",
          "stopwords": "_lithuanian_"
        },
        "lithuanian_stemmer": {
          "type": "stemmer",
          "language": "lithuanian"
        },
        "lithuanian_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "analyzer": {
        "lithuanian_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "lithuanian_stop",
            "lithuanian_keywords",
            "lithuanian_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "lithuanian_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /lithuanian-index/_analyze
{
  "field": "content",
  "text": "Studentai mokosi Lietuvos universitetuose. Jų numeriai yra 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "student","start_offset": 0,"end_offset": 9,"type": "<ALPHANUM>","position": 0},
    {"token": "mok","start_offset": 10,"end_offset": 16,"type": "<ALPHANUM>","position": 1},
    {"token": "lietuv","start_offset": 17,"end_offset": 25,"type": "<ALPHANUM>","position": 2},
    {"token": "universitet","start_offset": 26,"end_offset": 41,"type": "<ALPHANUM>","position": 3},
    {"token": "num","start_offset": 46,"end_offset": 54,"type": "<ALPHANUM>","position": 5},
    {"token": "123456","start_offset": 59,"end_offset": 65,"type": "<NUM>","position": 7}
  ]
}
```