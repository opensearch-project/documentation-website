---
layout: default
title: Hunspell
parent: Token filters
nav_order: 160
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/hunspell/
---

# Hunspell token filter

The `hunspell` token filter is used for stemming and morphological analysis of words in a specific language. This filter applies Hunspell dictionaries, which are widely used in spell checkers. It works by breaking down words into their root forms (stemming).

The Hunspell dictionary files are automatically loaded at startup from the `<OS_PATH_CONF>/hunspell/<locale>` directory. For example, the `en_GB` locale must have at least one `.aff` file and one or more `.dic` files in the `<OS_PATH_CONF>/hunspell/en_GB/` directory.

You can download these files from [LibreOffice dictionaries](https://github.com/LibreOffice/dictionaries).

## Parameters

The `hunspell` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`language/lang/locale` | At least one of the three is required | String | Specifies the language for the Hunspell dictionary.
`dedup` | Optional | Boolean | Determines whether to remove multiple duplicate stemming terms for the same token. Default is `true`.
`dictionary` | Optional | Array of strings | Configures the dictionary files to be used for the Hunspell dictionary. Default is all files in the `<OS_PATH_CONF>/hunspell/<locale>` directory.
`longest_only` | Optional | Boolean | Specifies whether only the longest stemmed version of the token should be returned. Default is `false`.

## Example

The following example request creates a new index named `my_index` and configures an analyzer with a `hunspell` filter:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_hunspell_filter": {
          "type": "hunspell",
          "lang": "en_GB",
          "dedup": true,
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

Use the following request to examine the tokens generated using the analyzer:

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
