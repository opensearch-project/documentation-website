---
layout: default
title: ASCIIFolding
parent: Token filters
nav_order: 120
---

# ASCIIFolding token filter

`asciifolding` is a token filter that converts non-ASCII characters into their closest ASCII equivalents, for example é becomes e, ü becomes u and ñ becomes n. This process is also known as "transliteration."


`asciifolding` token filter offers a number of benefits.

  - __Enhanced Search Flexibility__: Users often omit accents or special characters when typing queries. ASCIIFolding ensures that such queries still return relevant results.
  - __Normalization__: Standardizes the indexing process by ensuring that accented characters are consistently converted to their ASCII equivalents.
  - __Internationalization__: Particularly useful for applications dealing with multiple languages and character sets.

*Loss of Information*: While ASCIIFolding can simplify searches, it might also lead to loss of specific information, particularly if the distinction between accented and non-accented characters is significant in the dataset.
{: .warning}

## Parameters

You can configure `asciifolding` token filter using parameter `preserve_original`. Setting this option to `true` keeps both the original token and the ASCII-folded version in the token stream. This can be particularly useful in scenarios where you want to match both the original (with accents) and the normalized (without accents) versions of a term in search queries. Default is `false`.

## Example

Following is an example of how you can define an analyzer with the `asciifolding` filter with `preserve_original` set to `true`:

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

You can use the following command to examine the tokens being generated using the created analyzer:

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


