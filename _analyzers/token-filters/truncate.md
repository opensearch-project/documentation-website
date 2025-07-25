---
layout: default
title: Truncate
parent: Token filters
nav_order: 440
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/truncate/
---

# Truncate token filter

The `truncate` token filter is used to shorten tokens exceeding a specified length. It trims tokens to a maximum number of characters, ensuring that tokens exceeding this limit are truncated. 

## Parameters

The `truncate` token filter can be configured with the following parameter.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`length` | Optional | Integer | Specifies the maximum length of the generated token. Default is `10`.

## Example

The following example request creates a new index named `truncate_example` and configures an analyzer with a `truncate` filter:

```json
PUT /truncate_example
{
  "settings": {
    "analysis": {
      "filter": {
        "truncate_filter": {
          "type": "truncate",
          "length": 5
        }
      },
      "analyzer": {
        "truncate_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "truncate_filter"
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
GET /truncate_example/_analyze
{
  "analyzer": "truncate_analyzer",
  "text": "OpenSearch is powerful and scalable"
}

```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "opens",
      "start_offset": 0,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "is",
      "start_offset": 11,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "power",
      "start_offset": 14,
      "end_offset": 22,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "and",
      "start_offset": 23,
      "end_offset": 26,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "scala",
      "start_offset": 27,
      "end_offset": 35,
      "type": "<ALPHANUM>",
      "position": 4
    }
  ]
}
```
