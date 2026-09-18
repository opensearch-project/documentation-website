---
layout: default
title: Kuromoji number
parent: Token filters
nav_order: 232
---

# Kuromoji number token filter

The `kuromoji_number` token filter normalizes Japanese numeral expressions to standard Arabic numerals. Japanese text can represent numbers using kanji numerals (一, 二, 三…), full-width digits (１, ２, ３…), or a mix of both. This filter converts all such expressions to their standard integer or decimal equivalents.

The filter makes conversions such as the following:

- 一万二千三百四十五 becomes 12345.
- ３，〇００ becomes 3000.
- 千円 becomes 1000, with the unit 円 remaining as a separate token.

This filter is useful for faceted search, range queries, and sorting on fields that contain prices, counts, or other quantities written in Japanese notation.

## Installation

The `kuromoji_number` token filter requires the `analysis-kuromoji` plugin. For installation instructions, see [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/).

## Parameters

The `kuromoji_number` token filter has no configurable parameters.

## Example

The following example creates an index with a custom analyzer that uses `kuromoji_number`:

```json
PUT /kuromoji-number-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "number_analyzer": {
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer",
          "filter": ["kuromoji_number"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the analyzer with text containing kanji numeral expressions (meaning "the price is 12,345 yen"):

```json
POST /kuromoji-number-index/_analyze
{
  "analyzer": "number_analyzer",
  "text": "価格は一万二千三百四十五円です"
}
```
{% include copy-curl.html %}

The response shows the kanji numeral converted to an Arabic integer. Note that the `12345` token spans over offsets 3–12 because the source kanji numeral `一万二千三百四十五` is 9 characters long:

```json
{
  "tokens": [
    {
      "token": "価格",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "は",
      "start_offset": 2,
      "end_offset": 3,
      "type": "word",
      "position": 1
    },
    {
      "token": "12345",
      "start_offset": 3,
      "end_offset": 12,
      "type": "word",
      "position": 2
    },
    {
      "token": "円",
      "start_offset": 12,
      "end_offset": 13,
      "type": "word",
      "position": 3
    },
    {
      "token": "です",
      "start_offset": 13,
      "end_offset": 15,
      "type": "word",
      "position": 4
    }
  ]
}
```

## Related documentation

- [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/)
- [Kuromoji tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/kuromoji/)
