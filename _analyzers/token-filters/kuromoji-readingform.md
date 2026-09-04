---
layout: default
title: Kuromoji reading form
parent: Token filters
nav_order: 234
---

# Kuromoji reading form token filter

The `kuromoji_readingform` token filter replaces each token with its reading form. Japanese characters (kanji) have multiple possible readings; this filter uses the reading information provided by the Kuromoji tokenizer to emit the phonetic form of each token. The filter can output readings in katakana (Japanese phonetic script) or in romaji (Latin script transliteration).

## Installation

The `kuromoji_readingform` token filter requires the `analysis-kuromoji` plugin. For installation instructions, see [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/).

## Parameters

The following table lists the parameters for the `kuromoji_readingform` token filter.

Parameter | Data type | Description
:--- | :--- | :---
`use_romaji` | Boolean | When `false` (default), tokens are replaced with their katakana reading. When `true`, tokens are replaced with their romaji (Latin script) transliteration.

## Example: Katakana reading (default)

The following example creates an index with an analyzer that outputs katakana readings:

```json
PUT /kuromoji-reading-katakana-index
{
  "settings": {
    "analysis": {
      "filter": {
        "katakana_reading": {
          "type": "kuromoji_readingform",
          "use_romaji": false
        }
      },
      "analyzer": {
        "katakana_analyzer": {
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer",
          "filter": ["katakana_reading"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the analyzer with a sentence meaning "Tokyo is the capital of Japan":

```json
POST /kuromoji-reading-katakana-index/_analyze
{
  "analyzer": "katakana_analyzer",
  "text": "東京は日本の首都です"
}
```
{% include copy-curl.html %}

The response shows kanji tokens replaced with their katakana readings:

```json
{
  "tokens": [
    {
      "token": "トウキョウ",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "ハ",
      "start_offset": 2,
      "end_offset": 3,
      "type": "word",
      "position": 1
    },
    {
      "token": "ニッポン",
      "start_offset": 3,
      "end_offset": 5,
      "type": "word",
      "position": 2
    },
    {
      "token": "ノ",
      "start_offset": 5,
      "end_offset": 6,
      "type": "word",
      "position": 3
    },
    {
      "token": "シュト",
      "start_offset": 6,
      "end_offset": 8,
      "type": "word",
      "position": 4
    },
    {
      "token": "デス",
      "start_offset": 8,
      "end_offset": 10,
      "type": "word",
      "position": 5
    }
  ]
}
```

## Example: Romaji reading

The following example creates an analyzer that outputs romaji transliterations:

```json
PUT /kuromoji-reading-romaji-index
{
  "settings": {
    "analysis": {
      "filter": {
        "romaji_reading": {
          "type": "kuromoji_readingform",
          "use_romaji": true
        }
      },
      "analyzer": {
        "romaji_analyzer": {
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer",
          "filter": ["romaji_reading"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test with the same sentence:

```json
POST /kuromoji-reading-romaji-index/_analyze
{
  "analyzer": "romaji_analyzer",
  "text": "東京は日本の首都です"
}
```
{% include copy-curl.html %}

The response shows Latin-script transliterations:

```json
{
  "tokens": [
    {
      "token": "tōkyō",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "ha",
      "start_offset": 2,
      "end_offset": 3,
      "type": "word",
      "position": 1
    },
    {
      "token": "nippon",
      "start_offset": 3,
      "end_offset": 5,
      "type": "word",
      "position": 2
    },
    {
      "token": "no",
      "start_offset": 5,
      "end_offset": 6,
      "type": "word",
      "position": 3
    },
    {
      "token": "shuto",
      "start_offset": 6,
      "end_offset": 8,
      "type": "word",
      "position": 4
    },
    {
      "token": "desu",
      "start_offset": 8,
      "end_offset": 10,
      "type": "word",
      "position": 5
    }
  ]
}
```

The reading form filter replaces the entire token content. If you need both the original form and the reading, use the `kuromoji_completion` token filter instead, which adds reading variants as additional tokens at the same position.
{: .tip}

## Related documentation

- [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/)
- [Kuromoji tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/kuromoji/)
- [Kuromoji completion token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-completion/)
