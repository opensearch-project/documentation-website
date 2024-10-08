---
layout: default
title: Predicate token filter
parent: Token filters
nav_order: 340
---

# Predicate token filter

The `predicate_token_filter` evaluates whether tokens should be kept or discarded, depending on the conditions defined in a custom script.

## Parameters

The `predicate_token_filter` has one required pamameter: `script`. This parameter should outline the condition which is used to evaluate if the token should be kept. 

## Example

The following example request creates a new index named `predicate_index` and configures an analyzer with `predicate_token_filter`:

```json
PUT /predicate_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_predicate_filter": {
          "type": "predicate_token_filter",
          "script": {
            "source": "token.term.length() > 7"
          }
        }
      },
      "analyzer": {
        "predicate_analyzer": {
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_predicate_filter"
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
POST /predicate_index/_analyze
{
  "text": "The OpenSearch community is growing rapidly",
  "analyzer": "predicate_analyzer"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "opensearch",
      "start_offset": 4,
      "end_offset": 14,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "community",
      "start_offset": 15,
      "end_offset": 24,
      "type": "<ALPHANUM>",
      "position": 2
    }
  ]
}
```
