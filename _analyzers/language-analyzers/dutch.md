---
layout: default
title: Dutch
parent: Language analyzers
grand_parent: Analyzers
nav_order: 110
---

# Dutch analyzer

The built-in `dutch` analyzer can be applied to a text field using the following command:

```json
PUT /dutch-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "dutch"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_dutch_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_dutch_analyzer": {
          "type": "dutch",
          "stem_exclusion": ["autoriteit", "goedkeuring"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Dutch analyzer internals

The `dutch` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Dutch)
  - keyword
  - stemmer_override
  - stemmer (Dutch)

## Custom Dutch analyzer

You can create a custom Dutch analyzer using the following command:

```json
PUT /dutch-index
{
  "settings": {
    "analysis": {
      "filter": {
        "dutch_stop": {
          "type": "stop",
          "stopwords": "_dutch_"
        },
        "dutch_stemmer": {
          "type": "stemmer",
          "language": "dutch"
        },
        "dutch_keywords": {
          "type": "keyword_marker",
          "keywords": []
        },
        "dutch_override": {
          "type": "stemmer_override",
          "rules": [
            "fiets=>fiets",
            "bromfiets=>bromfiets",
            "ei=>eier",
            "kind=>kinder"
          ]
        }
      },
      "analyzer": {
        "dutch_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "dutch_stop",
            "dutch_keywords",
            "dutch_override",
            "dutch_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "dutch_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /dutch-index/_analyze
{
  "field": "content",
  "text": "De studenten studeren in Nederland en bezoeken Amsterdam. Hun nummers zijn 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "student","start_offset": 3,"end_offset": 12,"type": "<ALPHANUM>","position": 1},
    {"token": "studer","start_offset": 13,"end_offset": 21,"type": "<ALPHANUM>","position": 2},
    {"token": "nederland","start_offset": 25,"end_offset": 34,"type": "<ALPHANUM>","position": 4},
    {"token": "bezoek","start_offset": 38,"end_offset": 46,"type": "<ALPHANUM>","position": 6},
    {"token": "amsterdam","start_offset": 47,"end_offset": 56,"type": "<ALPHANUM>","position": 7},
    {"token": "nummer","start_offset": 62,"end_offset": 69,"type": "<ALPHANUM>","position": 9},
    {"token": "123456","start_offset": 75,"end_offset": 81,"type": "<NUM>","position": 11}
  ]
}
```