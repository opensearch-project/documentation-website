---
layout: default
title: Dictionary decompounder
parent: Token filters
nav_order: 110
---

# Dictionary decompounder token filter

The `dictionary_decompounder` token filter in OpenSearch is used to split compound words into their constituent parts based on a predefined dictionary. This filter is particularly useful in languages like German, Dutch, or Finnish, where compound words are common, and breaking them down can improve search relevance. The `dictionary_decompounder` token filter works by taking each token (word) and checking if it can be split into smaller tokens based on a list of known words. If it finds a way to split the token into known words, it generates the sub-tokens.

## Parameters

The `dictionary_decompounder` token filter in OpenSearch has the following parameters:

- `word_list`: The dictionary that the filter uses to split compound words. (_Required_ unless `word_list_path` is configured)
- `word_list_path`: A file path to a text file containing the dictionary words. (_Required_ unless `word_list` is configured)
- `min_word_size`: The minimum length of the entire compound word that will be considered for splitting. (_Optional_)
- `min_subword_size`: The minimum length for any subword. If a subword is smaller than this size, it will not be  split. (_Optional_)
- `max_subword_size`: The maximum length for any subword. If a subword is longer than this size, it will not be split. (_Optional_)
- `only_longest_match`: If set to `true`, only the longest matching subword will be returned. Default is `false` (_Optional_)

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

Use the following request to examine the tokens generated using the created analyzer:

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
