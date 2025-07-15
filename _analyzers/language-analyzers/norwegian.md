---
layout: default
title: Norwegian
parent: Language analyzers
grand_parent: Analyzers
nav_order: 240
---

# Norwegian analyzer

The built-in `norwegian` analyzer can be applied to a text field using the following command:

```json
PUT /norwegian-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "norwegian"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_norwegian_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_norwegian_analyzer": {
          "type": "norwegian",
          "stem_exclusion": ["autoritet", "godkjenning"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Norwegian analyzer internals

The `norwegian` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Norwegian)
  - keyword
  - stemmer (Norwegian)

## Custom Norwegian analyzer

You can create a custom Norwegian analyzer using the following command:

```json
PUT /norwegian-index
{
  "settings": {
    "analysis": {
      "filter": {
        "norwegian_stop": {
          "type": "stop",
          "stopwords": "_norwegian_"
        },
        "norwegian_stemmer": {
          "type": "stemmer",
          "language": "norwegian"
        },
        "norwegian_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "analyzer": {
        "norwegian_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "norwegian_stop",
            "norwegian_keywords",
            "norwegian_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "norwegian_analyzer"
      }
    }
  }
}

```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /norwegian-index/_analyze
{
  "field": "content",
  "text": "Studentene studerer ved norske universiteter. Deres nummer er 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "student","start_offset": 0,"end_offset": 10,"type": "<ALPHANUM>","position": 0},
    {"token": "studer","start_offset": 11,"end_offset": 19,"type": "<ALPHANUM>","position": 1},
    {"token": "norsk","start_offset": 24,"end_offset": 30,"type": "<ALPHANUM>","position": 3},
    {"token": "universitet","start_offset": 31,"end_offset": 44,"type": "<ALPHANUM>","position": 4},
    {"token": "numm","start_offset": 52,"end_offset": 58,"type": "<ALPHANUM>","position": 6},
    {"token": "123456","start_offset": 62,"end_offset": 68,"type": "<NUM>","position": 8}
  ]
}
```