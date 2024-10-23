---
layout: default
title: Keyword marker
parent: Token filters
nav_order: 220
---

# Keyword marker token filter

The `keyword_marker` token filter is used to protect specific words from being stemmed by other stemming filters in an analyzer pipeline (such as KStem, PorterStem and others). This is achieved by labeling selected words as `keyword`.


## Example

The following example request creates a new index named `my_keyword_marker_index` and configures an analyzer with `keyword_marker` filter:

```json
PUT /my_keyword_marker_index
{
  "settings": {
    "analysis": {
      "filter": {
        "keyword_marker_filter": {
          "type": "keyword_marker",
          "keywords": ["opensearch"]
        },
        "kstem_filter": {
          "type": "kstem"
        }
      },
      "analyzer": {
        "my_custom_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "keyword_marker_filter",
            "kstem_filter"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "my_custom_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the created analyzer:

```json
POST /my_keyword_marker_index1/_analyze
{
  "analyzer": "my_custom_analyzer",
  "text": "OpenSearch helped many employers",
  "explain": true,
  "attributes": ["keyword"]
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "detail": {
    "custom_analyzer": true,
    "charfilters": [],
    "tokenizer": {
      "name": "standard",
      "tokens": [
        {"token": "OpenSearch","start_offset": 0,"end_offset": 10,"type": "<ALPHANUM>","position": 0},
        {"token": "helped","start_offset": 11,"end_offset": 17,"type": "<ALPHANUM>","position": 1},
        {"token": "many","start_offset": 18,"end_offset": 22,"type": "<ALPHANUM>","position": 2},
        {"token": "employers","start_offset": 23,"end_offset": 32,"type": "<ALPHANUM>","position": 3}
      ]
    },
    "tokenfilters": [
      {
        "name": "lowercase",
        "tokens": [
          {"token": "opensearch","start_offset": 0,"end_offset": 10,"type": "<ALPHANUM>","position": 0},
          {"token": "helped","start_offset": 11,"end_offset": 17,"type": "<ALPHANUM>","position": 1},
          {"token": "many","start_offset": 18,"end_offset": 22,"type": "<ALPHANUM>","position": 2},
          {"token": "employers","start_offset": 23,"end_offset": 32,"type": "<ALPHANUM>","position": 3}
        ]
      },
      {
        "name": "keyword_marker_filter",
        "tokens": [
          {"token": "opensearch","start_offset": 0,"end_offset": 10,"type": "<ALPHANUM>","position": 0,"keyword": true},
          {"token": "helped","start_offset": 11,"end_offset": 17,"type": "<ALPHANUM>","position": 1,"keyword": false},
          {"token": "many","start_offset": 18,"end_offset": 22,"type": "<ALPHANUM>","position": 2,"keyword": false},
          {"token": "employers","start_offset": 23,"end_offset": 32,"type": "<ALPHANUM>","position": 3,"keyword": false}
        ]
      },
      {
        "name": "kstem_filter",
        "tokens": [
          {"token": "opensearch","start_offset": 0,"end_offset": 10,"type": "<ALPHANUM>","position": 0,"keyword": true},
          {"token": "help","start_offset": 11,"end_offset": 17,"type": "<ALPHANUM>","position": 1,"keyword": false},
          {"token": "many","start_offset": 18,"end_offset": 22,"type": "<ALPHANUM>","position": 2,"keyword": false},
          {"token": "employer","start_offset": 23,"end_offset": 32,"type": "<ALPHANUM>","position": 3,"keyword": false}
        ]
      }
    ]
  }
}
```