---
layout: default
title: CJK bigram
parent: Token filters
nav_order: 30
---

# CJK bigram token filter

The `cjk_bigram` token filter in OpenSearch is designed specifically for processing East Asian languages, such as Chinese, Japanese, and Korean (CJK), which typically don't use spaces to separate words. A bigram is a sequence of two adjacent elements from a string of tokens, which can be characters or words. For CJK languages, bigrams help in approximating word boundaries and capturing significant character pairs that can convey meaning.


## Parameters

The `cjk_bigram` token filter can be additionally configured with two parameters `ignore_scripts` and `output_unigrams`.

### `ignore_scripts`

This option allows you to specify whether the filter should ignore certain scripts (like Latin, Cyrillic) and only tokenize CJK text into bigrams. The default is to ignore non-CJK scripts. See following list of possible options:

1. `han` Token Filter

    The `han` token filter is used to handle Han characters, which are the logograms used in the written languages of China, Japan, and Korea.
    The filter can help in text processing tasks like tokenizing, normalizing, or stemming text written in Chinese, Japanese Kanji, or Korean Hanja.

2. `hangul` Token Filter

    The `hangul` token filter is specific to the Hangul script, which is the alphabet used to write the Korean language.
    This filter is useful for processing Korean text by handling Hangul syllables, which are unique to Korean and do not exist in other East Asian scripts.

3. `hiragana` Token Filter

    The `hiragana` token filter is used for processing Hiragana, one of the two syllabaries used in the Japanese writing system.
    Hiragana is typically used for native Japanese words, grammatical elements, and certain forms of punctuation.

4. `katakana` Token Filter

    The `katakana` token filter is for Katakana, the other syllabary used in Japanese.
    Katakana is mainly used for foreign loanwords, onomatopoeia, scientific names, and certain Japanese words.


### `output_unigrams`

This option, when set to `true`, outputs both unigrams (single characters) and bigrams. Default is `false`.

## Example

The following example request creates a new index named `devanagari_example_index` and defines an analyzer with the `cjk_bigram_filter` filter and `ignore_scripts` parameter set to `deva`:

```json
PUT /devanagari_example_index
{
  "settings": {
    "analysis": {
      "filter": {
        "cjk_bigram_filter": {
          "type": "cjk_bigram",
          "ignore_scripts": ["deva"],
          "output_unigrams": false
        }
      },
      "analyzer": {
        "cjk_deva_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "cjk_bigram_filter"
          ]
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
POST /devanagari_example_index/_analyze
{
  "analyzer": "cjk_deva_analyzer",
  "text": "यह एक उदाहरण है 中文文本" // Devanagari text followed by Chinese
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "यह",
      "start_offset": 0,
      "end_offset": 3,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "एक",
      "start_offset": 4,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "उदाहरण",
      "start_offset": 8,
      "end_offset": 16,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "है",
      "start_offset": 17,
      "end_offset": 19,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "中文",
      "start_offset": 20,
      "end_offset": 22,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "文本",
      "start_offset": 22,
      "end_offset": 24,
      "type": "<ALPHANUM>",
      "position": 5
    }
  ]
}
```


