---
layout: default
title: Hindi
parent: Language analyzers
grand_parent: Analyzers
nav_order: 190
canonical_url: https://docs.opensearch.org/latest/analyzers/language-analyzers/hindi/
---

# Hindi analyzer

The built-in `hindi` analyzer can be applied to a text field using the following command:

```json
PUT /hindi-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "hindi"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_hindi_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_hindi_analyzer": {
          "type": "hindi",
          "stem_exclusion": ["अधिकार", "अनुमोदन"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Hindi analyzer internals

The `hindi` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - lowercase
  - decimal_digit
  - keyword
  - normalization (indic)
  - normalization (Hindi)
  - stop (Hindi)
  - stemmer (Hindi)

## Custom Hindi analyzer

You can create a custom Hindi analyzer using the following command:

```json
PUT /hindi-index
{
  "settings": {
    "analysis": {
      "filter": {
        "hindi_stop": {
          "type": "stop",
          "stopwords": "_hindi_"
        },
        "hindi_stemmer": {
          "type": "stemmer",
          "language": "hindi"
        },
        "hindi_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "analyzer": {
        "hindi_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "decimal_digit",
            "hindi_keywords",
            "indic_normalization",
            "hindi_normalization",
            "hindi_stop",
            "hindi_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "hindi_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /hindi-index/_analyze
{
  "field": "content",
  "text": "छात्र भारतीय विश्वविद्यालयों में पढ़ते हैं। उनके नंबर १२३४५६ हैं।"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "छातर",
      "start_offset": 0,
      "end_offset": 5,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "भारतिय",
      "start_offset": 6,
      "end_offset": 12,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "विशवविदयालय",
      "start_offset": 13,
      "end_offset": 28,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "पढ",
      "start_offset": 33,
      "end_offset": 38,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "नंबर",
      "start_offset": 49,
      "end_offset": 53,
      "type": "<ALPHANUM>",
      "position": 7
    },
    {
      "token": "123456",
      "start_offset": 54,
      "end_offset": 60,
      "type": "<NUM>",
      "position": 8
    }
  ]
}
```