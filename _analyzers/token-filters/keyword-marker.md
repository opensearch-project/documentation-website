---
layout: default
title: Keyword marker
parent: Token filters
nav_order: 200
---

# Keyword marker token filter

The `keyword_marker` token filter is used to prevent certain tokens from being altered by stemmers or other filters. The `keyword_marker` token filter does this by marking the specified tokens as `keywords`, which prevents any stemming or other processing. This ensures that specific words remain in their original form. 

## Parameters

The `keyword_marker` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`ignore_case` | Optional | Boolean | Whether to ignore the letter case when matching keywords. Default is `false`.
`keywords` | Required if `keywords_path` or `keywords_pattern` is not set | List of strings | List of tokens to mark as keywords. 
`keywords_path` | Required if `keywords` or `keywords_pattern` is not set | String | Path (relative to the `config` directory or absolute) to the list of keywords.
`keywords_pattern` | Required if `keywords` or `keywords_path` is not set | String | [Regular expression](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html) used for matching tokens to be marked as keywords.
 

## Example

The following example request creates a new index named `my_index` and configures an analyzer with `keyword_marker` filter:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "keyword_marker_filter", "stemmer"]
        }
      },
      "filter": {
        "keyword_marker_filter": {
          "type": "keyword_marker",
          "keywords": ["OpenSearch", "example"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
GET /my_index/_analyze
{
  "analyzer": "custom_analyzer",
  "text": "This is an OpenSearch example demonstrating keyword marker."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "thi",
      "start_offset": 0,
      "end_offset": 4,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "is",
      "start_offset": 5,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "an",
      "start_offset": 8,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "opensearch",
      "start_offset": 11,
      "end_offset": 21,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "example",
      "start_offset": 22,
      "end_offset": 29,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "demonstr",
      "start_offset": 30,
      "end_offset": 43,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "keyword",
      "start_offset": 44,
      "end_offset": 51,
      "type": "<ALPHANUM>",
      "position": 6
    },
    {
      "token": "marker",
      "start_offset": 52,
      "end_offset": 58,
      "type": "<ALPHANUM>",
      "position": 7
    }
  ]
}
```

You can further examine the impact of the `keyword_marker` token filter by adding the following parameters to the `_analyze` query:

```json
GET /my_index/_analyze
{
  "analyzer": "custom_analyzer",
  "text": "This is an OpenSearch example demonstrating keyword marker.",
  "explain": true,
  "attributes": "keyword"
}
```
{% include copy-curl.html %}

This will produce additional details in the response similar to the following:

```json
{
    "name": "porter_stem",
    "tokens": [
      ...
      {
        "token": "example",
        "start_offset": 22,
        "end_offset": 29,
        "type": "<ALPHANUM>",
        "position": 4,
        "keyword": true
      },
      {
        "token": "demonstr",
        "start_offset": 30,
        "end_offset": 43,
        "type": "<ALPHANUM>",
        "position": 5,
        "keyword": false
      },
      ...
    ]
}
```
