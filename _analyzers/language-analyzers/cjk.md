---
layout: default
title: CJK
parent: Language analyzers
grand_parent: Analyzers
nav_order: 80
canonical_url: https://docs.opensearch.org/latest/analyzers/language-analyzers/cjk/
---

# CJK analyzer

The built-in `cjk` analyzer can be applied to a text field using the following command:

```json
PUT /cjk-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "cjk"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_cjk_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_cjk_analyzer": {
          "type": "cjk",
          "stem_exclusion": ["example", "words"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## CJK analyzer internals

The `cjk` analyzer is built using the following components:

- Tokenizer: `standard`

- Token filters:
  - cjk_width
  - lowercase
  - cjk_bigram
  - stop (similar to English)

## Custom CJK analyzer

You can create a custom CJK analyzer using the following command:

```json
PUT /cjk-index
{
  "settings": {
    "analysis": {
      "filter": {
        "english_stop": {
          "type":       "stop",
          "stopwords":  [ 
            "a", "and", "are", "as", "at", "be", "but", "by", "for",
            "if", "in", "into", "is", "it", "no", "not", "of", "on",
            "or", "s", "such", "t", "that", "the", "their", "then",
            "there", "these", "they", "this", "to", "was", "will",
            "with", "www"
          ]
        }
      },
      "analyzer": {
        "cjk_custom_analyzer": {
          "tokenizer": "standard",
          "filter": [
            "cjk_width",
            "lowercase",
            "cjk_bigram",
            "english_stop"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "cjk_custom_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /cjk-index/_analyze
{
  "field": "content",
  "text": "学生们在中国、日本和韩国的大学学习。123456"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "学生","start_offset": 0,"end_offset": 2,"type": "<DOUBLE>","position": 0},
    {"token": "生们","start_offset": 1,"end_offset": 3,"type": "<DOUBLE>","position": 1},
    {"token": "们在","start_offset": 2,"end_offset": 4,"type": "<DOUBLE>","position": 2},
    {"token": "在中","start_offset": 3,"end_offset": 5,"type": "<DOUBLE>","position": 3},
    {"token": "中国","start_offset": 4,"end_offset": 6,"type": "<DOUBLE>","position": 4},
    {"token": "日本","start_offset": 7,"end_offset": 9,"type": "<DOUBLE>","position": 5},
    {"token": "本和","start_offset": 8,"end_offset": 10,"type": "<DOUBLE>","position": 6},
    {"token": "和韩","start_offset": 9,"end_offset": 11,"type": "<DOUBLE>","position": 7},
    {"token": "韩国","start_offset": 10,"end_offset": 12,"type": "<DOUBLE>","position": 8},
    {"token": "国的","start_offset": 11,"end_offset": 13,"type": "<DOUBLE>","position": 9},
    {"token": "的大","start_offset": 12,"end_offset": 14,"type": "<DOUBLE>","position": 10},
    {"token": "大学","start_offset": 13,"end_offset": 15,"type": "<DOUBLE>","position": 11},
    {"token": "学学","start_offset": 14,"end_offset": 16,"type": "<DOUBLE>","position": 12},
    {"token": "学习","start_offset": 15,"end_offset": 17,"type": "<DOUBLE>","position": 13},
    {"token": "123456","start_offset": 18,"end_offset": 24,"type": "<NUM>","position": 14}
  ]
}
```