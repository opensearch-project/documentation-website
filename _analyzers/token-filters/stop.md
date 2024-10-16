---
layout: default
title: Stop
parent: Token filters
nav_order: 410
---

# Stop token filter

The `stop` token filter is used to remove common words (also known as stop words) from a stream of tokens during analysis. Stop words are typically short, for example words in predefined `_english_` list include "the", "is", "in" and many more. These words do not carry much meaning in search queries and are often excluded to improve search efficiency and relevance. 

## Parameters

The `stop` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`stopwords` | Optional | String | Specifies either array of stop words or predefined language specific list from the following options:<br><br>- [`_arabic_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/ar/stopwords.txt)<br>- [`_armenian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/hy/stopwords.txt)<br>- [`_basque_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/eu/stopwords.txt)<br>- [`_bengali_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/bn/stopwords.txt)<br>- [`_brazilian_` (Brazilian Portuguese)](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/br/stopwords.txt) <br>- [`_bulgarian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/bg/stopwords.txt)<br>- [`_catalan_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/ca/stopwords.txt)<br>- [`_cjk_` (Chinese, Japanese, and Korean)](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/cjk/stopwords.txt)<br>- [`_czech_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/cz/stopwords.txt)<br>- [`_danish_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/danish_stop.txt)<br>- [`_dutch_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/dutch_stop.txt)<br>- [`_english_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/java/org/apache/lucene/analysis/en/EnglishAnalyzer.java#L48) (Default)<br>- [`_estonian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/et/stopwords.txt)<br>- [`_finnish_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/finnish_stop.txt)<br>- [`_french_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/french_stop.txt)<br>- [`_galician_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/gl/stopwords.txt)<br>- [`_german_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/german_stop.txt)<br>- [`_greek_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/el/stopwords.txt)<br>- [`_hindi_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/hi/stopwords.txt)<br>- [`_hungarian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/hungarian_stop.txt)<br>- [`_indonesian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/id/stopwords.txt)<br>- [`_irish_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/ga/stopwords.txt)<br>- [`_italian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/italian_stop.txt)<br>- [`_latvian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/lv/stopwords.txt)<br>- [`_lithuanian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/lt/stopwords.txt)<br>- [`_norwegian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/norwegian_stop.txt)<br>- [`_persian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/fa/stopwords.txt)<br>- [`_portuguese_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/portuguese_stop.txt)<br>- [`_romanian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/ro/stopwords.txt)<br>- [`_russian_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/russian_stop.txt)<br>- [`_sorani_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/sr/stopwords.txt)<br>- [`_spanish_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/ckb/stopwords.txt)<br>- [`_swedish_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/snowball/swedish_stop.txt)<br>- [`_thai_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/th/stopwords.txt)<br>- [`_turkish_`](https://github.com/apache/lucene/blob/main/lucene/analysis/common/src/resources/org/apache/lucene/analysis/tr/stopwords.txt)
`stopwords_path` | Optional | String | Specifies the file path (absolute or relative to config directory) containing custom stop words.
`ignore_case` | Optional | Boolean | If set to `true`, stop words will be matched regardless of their case, Default is `false`
`remove_trailing` | Optional | Boolean | If `true`, trailing stop words will be removed during analysis. Default is `true` (Boolean, _Optional_)

## Example

The following example request creates a new index named `my-stopword-index` and configures an analyzer with `stop` filter:

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