---
layout: default
title: Standard analyzer
nav_order: 40
---

# Standard analyzer

`standard` analyzer is the default analyzer that is used when no other analyzer is specified. It is designed to provide a basic and efficient approach for general-purpose text processing.

This analyzer is made up of the following tokenizers and token filters:

- `standard` tokenizer: removes most punctuation and splits based on spaces and other common delimiters.
- `lowercase` token filter: all tokens are converted to lowercase, ensuring case-insensitive searching.
- `stop` token filter: removes common stop words such as "the" "is" "and" from the tokenized output.

## Example configuration

You can use the following command to create index `my_standard_index` with `standard` analyzer:

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

## Configuring custom analyzer

You can use the following command to configure index `my_custom_index` with custom analyzer equivalent to `standard` analyzer:

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

Use the following request to examine the tokens generated using the created analyzer:

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
