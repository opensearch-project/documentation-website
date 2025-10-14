---
layout: default
title: Pattern capture
parent: Token filters
nav_order: 310
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/pattern-capture/
---

# Pattern capture token filter

The `pattern_capture` token filter is a powerful filter that uses regular expressions to capture and extract parts of text according to specific patterns. This filter can be useful when you want to extract particular parts of tokens, such as email domains, hashtags, or numbers, and reuse them for further analysis or indexing.

## Parameters

The `pattern_capture` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`patterns` | Required | Array of strings | An array of regular expressions used to capture parts of text.
`preserve_original` | Required | Boolean| Whether to keep the original token in the output. Default is `true`.


## Example

The following example request creates a new index named `email_index` and configures an analyzer with a `pattern_capture` filter to extract the local part and domain name from an email address:

```json
PUT /email_index
{
  "settings": {
    "analysis": {
      "filter": {
        "email_pattern_capture": {
          "type": "pattern_capture",
          "preserve_original": true,
          "patterns": [
            "^([^@]+)",
            "@(.+)$"
          ]
        }
      },
      "analyzer": {
        "email_analyzer": {
          "tokenizer": "uax_url_email",
          "filter": [
            "email_pattern_capture",
            "lowercase"
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
POST /email_index/_analyze
{
  "text": "john.doe@example.com",
  "analyzer": "email_analyzer"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "john.doe@example.com",
      "start_offset": 0,
      "end_offset": 20,
      "type": "<EMAIL>",
      "position": 0
    },
    {
      "token": "john.doe",
      "start_offset": 0,
      "end_offset": 20,
      "type": "<EMAIL>",
      "position": 0
    },
    {
      "token": "example.com",
      "start_offset": 0,
      "end_offset": 20,
      "type": "<EMAIL>",
      "position": 0
    }
  ]
}
```
