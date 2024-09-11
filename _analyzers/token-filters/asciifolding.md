---
layout: default
title: ASCII folding
parent: Token filters
nav_order: 20
---

# ASCII folding token filter

The `asciifolding` token filter converts non-ASCII characters to their closest ASCII equivalents. For example, *é* becomes *e*, *ü* becomes *u*, and *ñ* becomes *n*. This process is known as *transliteration*.


The `asciifolding` token filter offers a number of benefits:

  - **Enhanced search flexibility**: Users often omit accents or special characters when entering queries. The `asciifolding` token filter ensures that such queries still return relevant results.
  - **Normalization**: Standardizes the indexing process by ensuring that accented characters are consistently converted to their ASCII equivalents.
  - **Internationalization**: Particularly useful for applications including multiple languages and character sets.

While the `asciifolding` token filter can simplify searches, it may also lead to the loss of specific information, particularly if the distinction between accented and non-accented characters in the dataset is significant.
{: .warning}

## Parameters

You can configure the `asciifolding` token filter using the `preserve_original` parameter. Setting this parameter to `true` keeps both the original token and its ASCII-folded version in the token stream. This can be particularly useful when you want to match both the original (with accents) and the normalized (without accents) versions of a term in a search query. Default is `false`.

## Example

The following example request creates a new index named `example_index` and defines an analyzer with the `asciifolding` filter and `preserve_original` parameter set to `true`:

```json
PUT /example_index
{
  "settings": {
    "analysis": {
      "filter": {
        "custom_ascii_folding": {
          "type": "asciifolding",
          "preserve_original": true
        }
      },
      "analyzer": {
        "custom_ascii_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "custom_ascii_folding"
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
POST /example_index/_analyze
{
  "analyzer": "custom_ascii_analyzer",
  "text": "Résumé café naïve coördinate"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "resume",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "résumé",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "cafe",
      "start_offset": 7,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "café",
      "start_offset": 7,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "naive",
      "start_offset": 12,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "naïve",
      "start_offset": 12,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "coordinate",
      "start_offset": 18,
      "end_offset": 28,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "coördinate",
      "start_offset": 18,
      "end_offset": 28,
      "type": "<ALPHANUM>",
      "position": 3
    }
  ]
}
```


