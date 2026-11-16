---
layout: default
title: Portuguese
parent: Language analyzers
grand_parent: Analyzers
nav_order: 260
canonical_url: https://docs.opensearch.org/latest/analyzers/language-analyzers/portuguese/
---

# Portuguese analyzer

The built-in `portuguese` analyzer can be applied to a text field using the following command:

```json
PUT /portuguese-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "portuguese"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_portuguese_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_portuguese_analyzer": {
          "type": "portuguese",
          "stem_exclusion": ["autoridade", "aprovação"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Portuguese analyzer internals

The `portuguese` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Portuguese)
  - keyword
  - stemmer (Portuguese)

## Custom Portuguese analyzer

You can create a custom Portuguese analyzer using the following command:

```json
PUT /portuguese-index
{
  "settings": {
    "analysis": {
      "filter": {
        "portuguese_stop": {
          "type": "stop",
          "stopwords": "_portuguese_"
        },
        "portuguese_stemmer": {
          "type": "stemmer",
          "language": "light_portuguese"
        },
        "portuguese_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "analyzer": {
        "portuguese_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "portuguese_stop",
            "portuguese_keywords",
            "portuguese_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "portuguese_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /portuguese-index/_analyze
{
  "field": "content",
  "text": "Os estudantes estudam nas universidades brasileiras. Seus números são 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "estudant",
      "start_offset": 3,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "estudam",
      "start_offset": 14,
      "end_offset": 21,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "universidad",
      "start_offset": 26,
      "end_offset": 39,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "brasileir",
      "start_offset": 40,
      "end_offset": 51,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "numer",
      "start_offset": 58,
      "end_offset": 65,
      "type": "<ALPHANUM>",
      "position": 7
    },
    {
      "token": "123456",
      "start_offset": 70,
      "end_offset": 76,
      "type": "<NUM>",
      "position": 9
    }
  ]
}
```