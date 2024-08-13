---
layout: default
title: Delimited payload
parent: Token filters
nav_order: 90
---

# Decimal digit token filter

The `delimited_payload` token filter in OpenSearch is used to parse and attach payloads (extra metadata) to tokens during the analysis process. This is particularly useful when you want to associate additional data (like weights, scores, or other numeric values) with tokens for use in scoring or custom query logic. The filter can handle different types of payloads, including integer, float, and strings. 

When analyzing text, `delimited_payload` token filter parses each token, extracts the payload, and attaches it to the token. This payload can later be used in queries to influence scoring, boosting, or other custom behaviors.

## Parameters

The `delimited_payload` token filter in OpenSearch has two _optional_ parameters:

1. `encoding`: specifies the data type of the payload attached to the tokens. This determines how the payload data is stored and interpreted during analysis and querying. There are three valid values:

    - `identity`: The payload is treated as a sequence of characters. For example: "user|admin" where "admin" is stored as a string.
    - `float`: The payload is interpreted as a 32-bit floating-point number using IEEE 754 format. For example: "car|2.5" would store 2.5 as a floating-point number.
    - `int`: The payload is interpreted as a 32-bit integer. For example: "priority|1" would store 1 as an integer.

2. `delimiter`: specifies character used to separate the token from its payload in the input text. By default, this is set to the pipe character (|).


## Example

The following example request creates a new index named `my_index` and configures an analyzer with `decimal_digit` filter:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_decimal_digit_filter": {
          "type": "decimal_digit"
        }
      },
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["my_decimal_digit_filter"]
        }
      }
    }
  }
}

```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the created analyzer:

```json
POST /my_index/_analyze
{
  "analyzer": "my_analyzer",
  "text": "123 ١٢٣ १२३"
}
```
{% include copy-curl.html %}

`text` breakdown:

 - "123" (ASCII digits)
 - "١٢٣" (Arabic-Indic digits)
 - "१२३" (Devanagari digits)

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "123",
      "start_offset": 0,
      "end_offset": 3,
      "type": "<NUM>",
      "position": 0
    },
    {
      "token": "123",
      "start_offset": 4,
      "end_offset": 7,
      "type": "<NUM>",
      "position": 1
    },
    {
      "token": "123",
      "start_offset": 8,
      "end_offset": 11,
      "type": "<NUM>",
      "position": 2
    }
  ]
}
```