---
layout: default
title: Dictionary decompounder
parent: Token filters
nav_order: 110
---

# Dictionary decompounder token filter

The `dictionary_decompounder` token filter is used to split compound words into their constituent parts based on a predefined dictionary. This filter is particularly useful in languages like German, Dutch, or Finnish, where compound words are common, and breaking them down can improve search relevance. The `dictionary_decompounder` token filter works by taking each token (word) and checking if it can be split into smaller tokens based on a list of known words. If it finds a way to split the token into known words, it generates the sub-tokens.

## Parameters

The `dictionary_decompounder` token filter has the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`word_list` | Required unless `word_list_path` is configured | Array of strings | The dictionary that the filter uses to split compound words.
`word_list_path` | Required unless `word_list` is configured | String | A file path to a text file containing the dictionary words.
`min_word_size` | Optional | Integer | The minimum length of the entire compound word that will be considered for splitting. Default is `5`.
`min_subword_size` | Optional | Integer | The minimum length for any subword. If a subword is smaller than this size, it will not be split. Default is `2`.
`max_subword_size` | Optional | Integer | The maximum length for any subword. If a subword is longer than this size, it will not be split. Default is `15`.
`only_longest_match` | Optional | Boolean | If set to `true`, only the longest matching subword will be returned. Default is `false`.

## Example

The following example request creates a new index named `decompound_example` and configures an analyzer with `dictionary_decompounder` filter:

```json
PUT /decompound_example
{
  "settings": {
    "analysis": {
      "filter": {
        "my_dictionary_decompounder": {
          "type": "dictionary_decompounder",
          "word_list": ["slow", "green", "turtle"]
        }
      },
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "my_dictionary_decompounder"]
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
POST /decompound_example/_analyze
{
  "analyzer": "my_analyzer",
  "text": "slowgreenturtleswim"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "slowgreenturtleswim",
      "start_offset": 0,
      "end_offset": 19,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "slow",
      "start_offset": 0,
      "end_offset": 19,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "green",
      "start_offset": 0,
      "end_offset": 19,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "turtle",
      "start_offset": 0,
      "end_offset": 19,
      "type": "<ALPHANUM>",
      "position": 0
    }
  ]
}
```
