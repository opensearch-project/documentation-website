---
layout: default
title: Simple pattern split
parent: Tokenizers
nav_order: 120
---

# Simple pattern split tokenizer

The `simple_pattern_split` tokenizer uses a regular expression to split text into tokens. The regular expression defines the pattern used to determine where to split the text. Any matching pattern in the text will be used as a delimiter, and the text between delimiters becomes the token.

## Example usage

The following example request creates a new index named `my_index` and configures an analyzer with `simple_pattern_split` tokenizer:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "my_pattern_split_tokenizer": {
          "type": "simple_pattern_split",
          "pattern": "-"
        }
      },
      "analyzer": {
        "my_pattern_split_analyzer": {
          "type": "custom",
          "tokenizer": "my_pattern_split_tokenizer"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "my_pattern_split_analyzer"
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
  "analyzer": "my_pattern_split_analyzer",
  "text": "OpenSearch-2024-10-09"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "OpenSearch",
      "start_offset": 0,
      "end_offset": 10,
      "type": "word",
      "position": 0
    },
    {
      "token": "2024",
      "start_offset": 11,
      "end_offset": 15,
      "type": "word",
      "position": 1
    },
    {
      "token": "10",
      "start_offset": 16,
      "end_offset": 18,
      "type": "word",
      "position": 2
    },
    {
      "token": "09",
      "start_offset": 19,
      "end_offset": 21,
      "type": "word",
      "position": 3
    }
  ]
}
```

## Configuration

The `simple_pattern_split` tokenizer can be configured with the following parameter.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`pattern` | Optional | String | Pattern that will be used to split text into tokens. Default is empty string (` `). 