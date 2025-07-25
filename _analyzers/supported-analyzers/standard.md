---
layout: default
title: Standard analyzer
parent: Analyzers
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/analyzers/supported-analyzers/standard/
---

# Standard analyzer

The `standard` analyzer is the default analyzer used when no other analyzer is specified. It is designed to provide a basic and efficient approach to generic text processing.

This analyzer consists of the following tokenizers and token filters:

- `standard` tokenizer: Removes most punctuation and splits text on spaces and other common delimiters.
- `lowercase` token filter: Converts all tokens to lowercase, ensuring case-insensitive matching.
- `stop` token filter: Removes common stopwords, such as "the", "is", and "and", from the tokenized output.

## Example 

Use the following command to create an index named `my_standard_index` with a `standard` analyzer:

```json
PUT /my_standard_index
{
  "mappings": {
    "properties": {
      "my_field": {
        "type": "text",
        "analyzer": "standard"  
      }
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

You can configure a `standard` analyzer with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`max_token_length` | Optional | Integer | Sets the maximum length of the produced token. If this length is exceeded, the token is split into multiple tokens at the length configured in `max_token_length`. Default is `255`.
`stopwords` | Optional | String or list of strings | A string specifying a predefined list of stopwords (such as `_english_`) or an array specifying a custom list of stopwords. Default is `_none_`.
`stopwords_path` | Optional | String | The path (absolute or relative to the config directory) to the file containing a list of stop words.


## Configuring a custom analyzer

Use the following command to configure an index with a custom analyzer that is equivalent to the `standard` analyzer:

```json
PUT /my_custom_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase", 
            "stop"
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
POST /my_custom_index/_analyze
{
  "analyzer": "my_custom_analyzer",
  "text": "The slow turtle swims away"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "slow","start_offset": 4,"end_offset": 8,"type": "<ALPHANUM>","position": 1},
    {"token": "turtle","start_offset": 9,"end_offset": 15,"type": "<ALPHANUM>","position": 2},
    {"token": "swims","start_offset": 16,"end_offset": 21,"type": "<ALPHANUM>","position": 3},
    {"token": "away","start_offset": 22,"end_offset": 26,"type": "<ALPHANUM>","position": 4}
  ]
}
```
