---
layout: default
title: CJK bigram
parent: Token filters
nav_order: 30
---

# CJK bigram token filter

The `cjk_bigram` token filter is designed specifically for processing East Asian languages, such as Chinese, Japanese, and Korean (CJK), which typically don't use spaces to separate words. A bigram is a sequence of two adjacent elements in a string of tokens, which can be characters or words. For CJK languages, bigrams help approximate word boundaries and capture significant character pairs that can convey meaning.


## Parameters

The `cjk_bigram` token filter can be configured with two parameters: `ignored_scripts` and `output_unigrams`.

### ignored_scripts

The `cjk-bigram` token filter ignores all non-CJK scripts (writing systems like Latin or Cyrillic) and tokenizes only CJK text into bigrams. Use this option to specify CJK scripts to be ignored. This option takes the following valid values:

- `han`: The `han` script processes Han characters. [Han characters](https://simple.wikipedia.org/wiki/Chinese_characters) are logograms used in the written languages of China, Japan, and Korea. The filter can help with text processing tasks like tokenizing, normalizing, or stemming text written in Chinese, Japanese kanji, or Korean Hanja.

- `hangul`: The `hangul` script processes Hangul characters, which are unique to the Korean language and do not exist in other East Asian scripts.

- `hiragana`: The `hiragana` script processes hiragana, one of the two syllabaries used in the Japanese writing system.
    Hiragana is typically used for native Japanese words, grammatical elements, and certain forms of punctuation.

- `katakana`: The `katakana` script processes katakana, the other Japanese syllabary.
    Katakana is mainly used for foreign loanwords, onomatopoeia, scientific names, and certain Japanese words.


### output_unigrams

This option, when set to `true`, outputs both unigrams (single characters) and bigrams. Default is `false`.

## Example

The following example request creates a new index named `devanagari_example_index` and defines an analyzer with the `cjk_bigram_filter` filter and `ignored_scripts` parameter set to `katakana`:

```json
PUT /cjk_bigram_example
{
  "settings": {
    "analysis": {
      "analyzer": {
        "cjk_bigrams_no_katakana": {
          "tokenizer": "standard",
          "filter": [ "cjk_bigrams_no_katakana_filter" ]
        }
      },
      "filter": {
        "cjk_bigrams_no_katakana_filter": {
          "type": "cjk_bigram",
          "ignored_scripts": [
            "katakana"
          ],
          "output_unigrams": true
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
POST /cjk_bigram_example/_analyze
{
  "analyzer": "cjk_bigrams_no_katakana",
  "text": "東京タワーに行く"
}
```
{% include copy-curl.html %}

Sample text: "東京タワーに行く"

    東京 (Kanji for "Tokyo")
    タワー (Katakana for "Tower")
    に行く (Hiragana and Kanji for "go to")

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "東",
      "start_offset": 0,
      "end_offset": 1,
      "type": "<SINGLE>",
      "position": 0
    },
    {
      "token": "東京",
      "start_offset": 0,
      "end_offset": 2,
      "type": "<DOUBLE>",
      "position": 0,
      "positionLength": 2
    },
    {
      "token": "京",
      "start_offset": 1,
      "end_offset": 2,
      "type": "<SINGLE>",
      "position": 1
    },
    {
      "token": "タワー",
      "start_offset": 2,
      "end_offset": 5,
      "type": "<KATAKANA>",
      "position": 2
    },
    {
      "token": "に",
      "start_offset": 5,
      "end_offset": 6,
      "type": "<SINGLE>",
      "position": 3
    },
    {
      "token": "に行",
      "start_offset": 5,
      "end_offset": 7,
      "type": "<DOUBLE>",
      "position": 3,
      "positionLength": 2
    },
    {
      "token": "行",
      "start_offset": 6,
      "end_offset": 7,
      "type": "<SINGLE>",
      "position": 4
    },
    {
      "token": "行く",
      "start_offset": 6,
      "end_offset": 8,
      "type": "<DOUBLE>",
      "position": 4,
      "positionLength": 2
    },
    {
      "token": "く",
      "start_offset": 7,
      "end_offset": 8,
      "type": "<SINGLE>",
      "position": 5
    }
  ]
}
```


