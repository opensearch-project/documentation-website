---
layout: default
title: Hunspell
parent: Token filters
nav_order: 160
---

# Hunspell token filter

The `hunspell` token filter in OpenSearch is used for stemming and morphological analysis of words in a specific language. This filter leverages Hunspell dictionaries, which are widely used in spell checkers. It works by breaking down words into their root forms (stemming).

The Hunspell dictionary files are automatically loaded at startup from `<OS_PATH_CONF>/hunspell/<locale>` directory. For example `en_GB` locale should have at least one `.aff` file and one or more `.dic` files in directory `<OS_PATH_CONF>/hunspell/en_GB/`.

## Parameters

The `hunspell` token filter in OpenSearch can be configured with the following parameters:

- `language/lang/locale`: Specifies the language for the Hunspell dictionary. (String, _Required_ at least one of the three)
- `dictionary`: Configures the dictionary files to be used for Hunspell dictionary. Default is all files in `<OS_PATH_CONF>/hunspell/<locale>` directory. (Array of strings, _Optional_)
- `longest_only`: Specifies if only the longest stemmed version of the token should be returned. Default is `false` (Boolean, _Optional_) 

## Example

The following example request creates a new index named `my_index` and configures an analyzer with `hunspell` filter:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_hunspell_filter": {
          "type": "hunspell",
          "lang": "en_GB",
          "longest_only": true
        }
      },
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_hunspell_filter"
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
POST /my_index/_analyze
{
  "analyzer": "my_analyzer",
  "text": "the turtle moves slowly"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "the",
      "start_offset": 0,
      "end_offset": 3,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "turtle",
      "start_offset": 4,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "move",
      "start_offset": 11,
      "end_offset": 16,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "slow",
      "start_offset": 17,
      "end_offset": 23,
      "type": "<ALPHANUM>",
      "position": 3
    }
  ]
}
```