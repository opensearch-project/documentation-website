---
layout: default
title: Kuromoji stemmer
parent: Token filters
nav_order: 235
---

# Kuromoji stemmer token filter

The `kuromoji_stemmer` token filter normalizes Katakana words by removing a trailing long vowel mark (ー) from words that meet a minimum length threshold. Many foreign loanwords in Japanese are written in Katakana with a trailing ー that denotes a lengthened final vowel (for example, コンピューター, プリンター). In practice, Japanese speakers often drop the trailing ー in informal or technical writing, resulting in two surface forms for the same word. This filter collapses those variants to a single canonical form.

For example:
- コンピューター (computer) → コンピュータ
- プリンター (printer) → プリンタ

## Installation

The `kuromoji_stemmer` token filter requires the `analysis-kuromoji` plugin. For installation instructions, see [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/).

## Parameters

The following table lists the parameters for the `kuromoji_stemmer` token filter.

Parameter | Data type | Description
:--- | :--- | :---
`minimum_length` | Integer | The minimum number of characters a token must have for the trailing long vowel mark to be removed. Tokens shorter than this threshold are passed through unchanged. Default is `4`.

The default minimum length of `4` prevents short words like カー (car, 3 characters) from being incorrectly stemmed to カ.
{: .note}

## Example

The following example creates an index with a custom analyzer that uses `kuromoji_stemmer`:

```json
PUT /kuromoji-stemmer-index
{
  "settings": {
    "analysis": {
      "filter": {
        "katakana_stemmer": {
          "type": "kuromoji_stemmer",
          "minimum_length": 4
        }
      },
      "analyzer": {
        "stemmer_analyzer": {
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer",
          "filter": ["katakana_stemmer"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the analyzer with Katakana loanwords (meaning "I use a computer and printer"):

```json
POST /kuromoji-stemmer-index/_analyze
{
  "analyzer": "stemmer_analyzer",
  "text": "コンピューターとプリンターを使う"
}
```
{% include copy-curl.html %}

The response shows the trailing long vowel marks removed from both words:

```json
{
  "tokens": [
    {
      "token": "コンピュータ",
      "start_offset": 0,
      "end_offset": 7,
      "type": "word",
      "position": 0
    },
    {
      "token": "と",
      "start_offset": 7,
      "end_offset": 8,
      "type": "word",
      "position": 1
    },
    {
      "token": "プリンタ",
      "start_offset": 8,
      "end_offset": 13,
      "type": "word",
      "position": 2
    },
    {
      "token": "を",
      "start_offset": 13,
      "end_offset": 14,
      "type": "word",
      "position": 3
    },
    {
      "token": "使う",
      "start_offset": 14,
      "end_offset": 16,
      "type": "word",
      "position": 4
    }
  ]
}
```

## Related documentation

- [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/)
- [Kuromoji tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/kuromoji/)
- [Kuromoji baseform token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-baseform/)
