---
layout: default
title: UAX URL email
parent: Tokenizers
nav_order: 150
---

# UAX URL email tokenizer

In addition to regular text, the `uax_url_email` tokenizer is designed to handle URLs, email addresses, and domain names. It is based on the Unicode Text Segmentation algorithm ([UAX #29](https://www.unicode.org/reports/tr29/)), which allows it to correctly tokenize complex text, including URLs and email addresses.

## Example usage

The following example request creates a new index named `my_index` and configures an analyzer with a `uax_url_email` tokenizer:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "uax_url_email_tokenizer": {
          "type": "uax_url_email"
        }
      },
      "analyzer": {
        "my_uax_analyzer": {
          "type": "custom",
          "tokenizer": "uax_url_email_tokenizer"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "my_uax_analyzer"
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
  "analyzer": "my_uax_analyzer",
  "text": "Contact us at support@example.com or visit https://example.com for details."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "Contact","start_offset": 0,"end_offset": 7,"type": "<ALPHANUM>","position": 0},
    {"token": "us","start_offset": 8,"end_offset": 10,"type": "<ALPHANUM>","position": 1},
    {"token": "at","start_offset": 11,"end_offset": 13,"type": "<ALPHANUM>","position": 2},
    {"token": "support@example.com","start_offset": 14,"end_offset": 33,"type": "<EMAIL>","position": 3},
    {"token": "or","start_offset": 34,"end_offset": 36,"type": "<ALPHANUM>","position": 4},
    {"token": "visit","start_offset": 37,"end_offset": 42,"type": "<ALPHANUM>","position": 5},
    {"token": "https://example.com","start_offset": 43,"end_offset": 62,"type": "<URL>","position": 6},
    {"token": "for","start_offset": 63,"end_offset": 66,"type": "<ALPHANUM>","position": 7},
    {"token": "details","start_offset": 67,"end_offset": 74,"type": "<ALPHANUM>","position": 8}
  ]
}
```

## Parameters

The `uax_url_email` tokenizer can be configured with the following parameter.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`max_token_length` | Optional | Integer | Sets the maximum length of the produced token. If this length is exceeded, the token is split into multiple tokens at the length configured in `max_token_length`. Default is `255`.

