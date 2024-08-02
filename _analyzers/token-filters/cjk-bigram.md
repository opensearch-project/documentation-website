---
layout: default
title: CJK bigram
parent: Token filters
nav_order: 130
---

# CJK bigram

The `cjk_bigram` token filter in OpenSearch is designed specifically for processing East Asian languages, such as Chinese, Japanese, and Korean (CJK), which typically don't use spaces to separate words. A bigram is a sequence of two adjacent elements from a string of tokens, which can be characters or words. For CJK languages, bigrams help in approximating word boundaries and capturing significant character pairs that can convey meaning


## Parameters

The `cjk_bigram` token filter can be additionally configured with two parameters `ignore_scripts` and `output_unigrams`.

### `ignore_scripts`

This option allows you to specify whether the filter should ignore certain scripts (like Latin, Cyrillic) and only tokenize CJK text into bigrams. The default is to ignore non-CJK scripts. See following list of possible options:

 - `"arab"`: Arabic script
 - `"armn"`: Armenian script
 - `"beng"`: Bengali script
 - `"cyrl"`: Cyrillic script
 - `"deva"`: Devanagari script
 - `"grek"`: Greek script
 - `"gujr"`: Gujarati script
 - `"guru"`: Gurmukhi script
 - `"hani"`: Han script (used for Chinese characters)
 - `"hans"`: Simplified Han script
 - `"hant"`: Traditional Han script
 - `"hebr"`: Hebrew script
 - `"hrkt"`: Hiragana and Katakana scripts
 - `"kana"`: Katakana script
 - `"hang"`: Hangul script (Korean)
 - `"jpan"`: Japanese script (combination of Kanji, Hiragana, Katakana)
 - `"knda"`: Kannada script
 - `"latn"`: Latin script
 - `"mlym"`: Malayalam script
 - `"orya"`: Oriya script
 - `"taml"`: Tamil script
 - `"telg"`: Telugu script
 - `"thai"`: Thai script

### `output_unigrams`

This option, when set to `true`, outputs both unigrams (single characters) and bigrams. Default is `false`.

## Example

Following is an example of how you can define an analyzer with the `cjk_bigram_filter` filter with `ignore_scripts` set to `deva`.

```
PUT /devanagari_example_index
{
  "settings": {
    "analysis": {
      "filter": {
        "cjk_bigram_filter": {
          "type": "cjk_bigram",
          "ignore_scripts": ["deva"],  // Ignore Devanagari script
          "output_unigrams": false     // Do not output unigrams
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

## Generated tokens

You can use the following command to examine the tokens being generated using the created analyzer.

```
POST /devanagari_example_index/_analyze
{
  "analyzer": "cjk_deva_analyzer",
  "text": "यह एक उदाहरण है 中文文本" // Devanagari text followed by Chinese
}
```

Expected result:

```
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


