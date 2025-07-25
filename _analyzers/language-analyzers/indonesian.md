---
layout: default
title: Indonesian
parent: Language analyzers
grand_parent: Analyzers
nav_order: 210
canonical_url: https://docs.opensearch.org/latest/analyzers/language-analyzers/indonesian/
---

# Indonesian analyzer

The built-in `indonesian` analyzer can be applied to a text field using the following command:

```json
PUT /indonesian-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "indonesian"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_indonesian_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_indonesian_analyzer": {
          "type": "indonesian",
          "stem_exclusion": ["otoritas", "persetujuan"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Indonesian analyzer internals

The `indonesian` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - stop (Indonesian)
  - keyword
  - stemmer (Indonesian)

## Custom Indonesian analyzer

You can create a custom Indonesian analyzer using the following command:

```json
PUT /hungarian-index
{
  "settings": {
    "analysis": {
      "filter": {
        "hungarian_stop": {
          "type": "stop",
          "stopwords": "_hungarian_"
        },
        "hungarian_stemmer": {
          "type": "stemmer",
          "language": "hungarian"
        },
        "hungarian_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "analyzer": {
        "hungarian_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "hungarian_stop",
            "hungarian_keywords",
            "hungarian_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "hungarian_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /indonesian-index/_analyze
{
  "field": "content",
  "text": "Mahasiswa belajar di universitas Indonesia. Nomor mereka adalah 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "mahasiswa",
      "start_offset": 0,
      "end_offset": 9,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "ajar",
      "start_offset": 10,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "universitas",
      "start_offset": 21,
      "end_offset": 32,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "indonesia",
      "start_offset": 33,
      "end_offset": 42,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "nomor",
      "start_offset": 44,
      "end_offset": 49,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "123456",
      "start_offset": 64,
      "end_offset": 70,
      "type": "<NUM>",
      "position": 8
    }
  ]
}
```