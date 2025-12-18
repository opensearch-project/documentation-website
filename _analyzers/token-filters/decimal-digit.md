---
layout: default
title: Decimal digit
parent: Token filters
nav_order: 80
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/decimal-digit/
---

# Decimal digit token filter

The `decimal_digit` token filter is used to normalize decimal digit characters (0--9) into their ASCII equivalents in various scripts. This is useful when you want to ensure that all digits are treated uniformly in text analysis, regardless of the script in which they are written.


## Example

The following example request creates a new index named `my_index` and configures an analyzer with a `decimal_digit` filter:

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

Use the following request to examine the tokens generated using the analyzer:

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
