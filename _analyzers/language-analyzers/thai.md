---
layout: default
title: Thai
parent: Language analyzers
grand_parent: Analyzers
nav_order: 320
---

# Thai analyzer

The built-in `thai` analyzer can be applied to a text field using the following command:

```json
PUT /thai-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "thai"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_thai_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_thai_analyzer": {
          "type": "thai",
          "stem_exclusion": ["อำนาจ", "การอนุมัติ"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Thai analyzer internals

The `thai` analyzer is built using the following components:

- Tokenizer: `thai`

- Token filters:
  - lowercase
  - decimal_digit
  - stop (Thai)
  - keyword

## Custom Thai analyzer

You can create a custom Thai analyzer using the following command:

```json
PUT /thai-index
{
  "settings": {
    "analysis": {
      "filter": {
        "thai_stop": {
          "type": "stop",
          "stopwords": "_thai_"
        },
        "thai_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "analyzer": {
        "thai_analyzer": {
          "tokenizer": "thai",
          "filter": [
            "lowercase",
            "decimal_digit",
            "thai_stop",
            "thai_keywords"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "thai_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /thai-index/_analyze
{
  "field": "content",
  "text": "นักเรียนกำลังศึกษาอยู่ที่มหาวิทยาลัยไทย หมายเลข 123456."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "นักเรียน","start_offset": 0,"end_offset": 8,"type": "word","position": 0},
    {"token": "กำลัง","start_offset": 8,"end_offset": 13,"type": "word","position": 1},
    {"token": "ศึกษา","start_offset": 13,"end_offset": 18,"type": "word","position": 2},
    {"token": "มหาวิทยาลัย","start_offset": 25,"end_offset": 36,"type": "word","position": 5},
    {"token": "ไทย","start_offset": 36,"end_offset": 39,"type": "word","position": 6},
    {"token": "หมายเลข","start_offset": 40,"end_offset": 47,"type": "word","position": 7},
    {"token": "123456","start_offset": 48,"end_offset": 54,"type": "word","position": 8}
  ]
}
```