---
layout: default
title: Persian
parent: Language analyzers
grand_parent: Analyzers
nav_order: 250
---

# Persian analyzer

The built-in `persian` analyzer can be applied to a text field using the following command:

```json
PUT /persian-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "persian"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can use `stem_exclusion` with this language analyzer using the following command:

```json
PUT index_with_stem_exclusion_persian_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_persian_analyzer": {
          "type": "persian",
          "stem_exclusion": ["حکومت", "تأیید"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Persian analyzer internals

The `persian` analyzer is built using the following components:

- Tokenizer: `standard`

- Char filter: `mapping`

- Token filters:
  - lowercase
  - decimal_digit
  - normalization (Arabic)
  - normalization (Persian)
  - keyword

## Custom Persian analyzer

You can create a custom Persian analyzer using the following command:

```json
PUT /persian-index
{
  "settings": {
    "analysis": {
      "filter": {
        "persian_stop": {
          "type": "stop",
          "stopwords": "_persian_"
        },
        "persian_keywords": {
          "type": "keyword_marker",
          "keywords": []
        }
      },
      "char_filter": {
        "null_width_replace_with_space": {
            "type":       "mapping",
            "mappings": [ "\\u200C=>\\u0020"] 
        }
      },
      "analyzer": {
        "persian_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "char_filter": [ "null_width_replace_with_space" ],
          "filter": [
            "lowercase",
            "decimal_digit",
            "arabic_normalization",
            "persian_normalization",
            "persian_stop",
            "persian_keywords"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "persian_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /persian-index/_analyze
{
  "field": "content",
  "text": "دانشجویان در دانشگاه‌های ایرانی تحصیل می‌کنند. شماره‌های آن‌ها ۱۲۳۴۵۶ است."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "دانشجويان","start_offset": 0,"end_offset": 9,"type": "<ALPHANUM>","position": 0},
    {"token": "دانشگاه","start_offset": 13,"end_offset": 20,"type": "<ALPHANUM>","position": 2},
    {"token": "ايراني","start_offset": 25,"end_offset": 31,"type": "<ALPHANUM>","position": 4},
    {"token": "تحصيل","start_offset": 32,"end_offset": 37,"type": "<ALPHANUM>","position": 5},
    {"token": "شماره","start_offset": 47,"end_offset": 52,"type": "<ALPHANUM>","position": 8},
    {"token": "123456","start_offset": 63,"end_offset": 69,"type": "<NUM>","position": 12}
  ]
}
```
