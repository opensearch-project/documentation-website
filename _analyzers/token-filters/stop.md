---
layout: default
title: Stop
parent: Token filters
nav_order: 410
---

# Stop token filter

The `stop` token filter is used to remove common words (also known as _stopwords_) from a token stream during analysis. Stopwords are typically articles and prepositions, such as `a` or `for`. These words are not significantly meaningful in search queries and are often excluded to improve search efficiency and relevance. 

The default list of English stopwords includes the following words: `a`, `an`, `and`, `are`, `as`, `at`, `be`, `but`, `by`, `for`, `if`, `in`, `into`, `is`, `it`, `no`, `not`, `of`, `on`, `or`, `such`, `that`, `the`, `their`, `then`, `there`, `these`, `they`, `this`, `to`, `was`, `will`, and `with`. 

## Parameters

The `stop` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`stopwords` | Optional | String | Specifies either a custom array of stopwords or a [predefined stopword set for a language](#predefined-stopword-sets-by-language). Default is `_english_`.
`stopwords_path` | Optional | String | Specifies the file path (absolute or relative to the config directory) of the file containing custom stopwords.
`ignore_case` | Optional | Boolean | If `true`, stopwords will be matched regardless of their case. Default is `false`.
`remove_trailing` | Optional | Boolean | If `true`, trailing stopwords will be removed during analysis. Default is `true`.

## Example

The following example request creates a new index named `my-stopword-index` and configures an analyzer with a `stop` filter that uses the predefined stopword list for the English language:

```json
PUT /my-stopword-index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_stop_filter": {
          "type": "stop",
          "stopwords": "_english_"
        }
      },
      "analyzer": {
        "my_stop_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_stop_filter"
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
GET /my-stopword-index/_analyze
{
  "analyzer": "my_stop_analyzer",
  "text": "A quick dog jumps over the turtle"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "quick",
      "start_offset": 2,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "dog",
      "start_offset": 8,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "jumps",
      "start_offset": 12,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "over",
      "start_offset": 18,
      "end_offset": 22,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "turtle",
      "start_offset": 27,
      "end_offset": 33,
      "type": "<ALPHANUM>",
      "position": 6
    }
  ]
}
```

## Predefined stopword sets by language

The following is a list of all available predefined stopword sets by language:

- [`_arabic_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/ar/stopwords.txt)
- [`_armenian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/hy/stopwords.txt)
- [`_basque_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/eu/stopwords.txt)
- [`_bengali_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/bn/stopwords.txt)
- [`_brazilian_` (Brazilian Portuguese)](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/br/stopwords.txt) 
- [`_bulgarian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/bg/stopwords.txt)
- [`_catalan_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/ca/stopwords.txt)
- [`_cjk_` (Chinese, Japanese, and Korean)](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/cjk/stopwords.txt)
- [`_czech_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/cz/stopwords.txt)
- [`_danish_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/danish_stop.txt)
- [`_dutch_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/dutch_stop.txt)
- [`_english_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/java/org/apache/lucene/analysis/en/EnglishAnalyzer.java#L48)
- [`_estonian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/et/stopwords.txt)
- [`_finnish_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/finnish_stop.txt)
- [`_french_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/french_stop.txt)
- [`_galician_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/gl/stopwords.txt)
- [`_german_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/german_stop.txt)
- [`_greek_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/el/stopwords.txt)
- [`_hindi_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/hi/stopwords.txt)
- [`_hungarian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/hungarian_stop.txt)
- [`_indonesian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/id/stopwords.txt)
- [`_irish_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/ga/stopwords.txt)
- [`_italian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/italian_stop.txt)
- [`_latvian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/lv/stopwords.txt)
- [`_lithuanian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/lt/stopwords.txt)
- [`_norwegian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/norwegian_stop.txt)
- [`_persian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/fa/stopwords.txt)
- [`_portuguese_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/portuguese_stop.txt)
- [`_romanian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/ro/stopwords.txt)
- [`_russian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/russian_stop.txt)
- [`_sorani_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/sr/stopwords.txt)
- [`_spanish_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/ckb/stopwords.txt)
- [`_swedish_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/swedish_stop.txt)
- [`_thai_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/th/stopwords.txt)
- [`_turkish_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/tr/stopwords.txt)