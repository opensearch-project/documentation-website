---
layout: default
title: Stemmer override
parent: Token filters
nav_order: 400
---

# Stemmer override token filter

The `stemmer_override` token filter allows you to define custom stemming rules that override the behavior of default stemmers like Porter or Snowball. This can be useful when you want to apply specific stemming behavior to certain words that might not be modified correctly by the standard stemming algorithms.

## Parameters

The `stemmer_override` token filter must be configured with exactly one of the following parameters.

Parameter | Data type | Description
:--- | :--- | :--- 
`rules` | String | Defines the override rules directly in the settings.
`rules_path` | String | Specifies the path to the file containing custom rules (mappings). The path can be either an absolute path or a path relative to the config directory.

## Example

The following example request creates a new index named `my-index` and configures an analyzer with a `stemmer_override` filter:

```json
PUT /my-index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_stemmer_override_filter": {
          "type": "stemmer_override",
          "rules": [
            "running, runner => run",
            "bought => buy",
            "best => good"
          ]
        }
      },
      "analyzer": {
        "my_custom_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_stemmer_override_filter"
          ]
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
GET /my-index/_analyze
{
  "analyzer": "my_custom_analyzer",
  "text": "I am a runner and bought the best shoes"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "i",
      "start_offset": 0,
      "end_offset": 1,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "am",
      "start_offset": 2,
      "end_offset": 4,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "a",
      "start_offset": 5,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "run",
      "start_offset": 7,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "and",
      "start_offset": 14,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "buy",
      "start_offset": 18,
      "end_offset": 24,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "the",
      "start_offset": 25,
      "end_offset": 28,
      "type": "<ALPHANUM>",
      "position": 6
    },
    {
      "token": "good",
      "start_offset": 29,
      "end_offset": 33,
      "type": "<ALPHANUM>",
      "position": 7
    },
    {
      "token": "shoes",
      "start_offset": 34,
      "end_offset": 39,
      "type": "<ALPHANUM>",
      "position": 8
    }
  ]
}
```