---
layout: default
title: Simple pattern split
parent: Tokenizers
nav_order: 120
---

# Simple pattern split tokenizer

The `simple_pattern_split` tokenizer uses a regular expression to split text into tokens. The regular expression defines the pattern used to determine where to split the text. Any matching pattern in the text is used as a delimiter, and the text between delimiters becomes a token. Use this tokenizer when you want to define delimiters and tokenize the rest of the text based on a pattern.

The tokenizer uses the matched parts of the input text (based on the regular expression) only as delimiters or boundaries to split the text into terms. The matched portions are not included in the resulting terms. For example, if the tokenizer is configured to split text at dot characters (`.`) and the input text is `one.two.three`, then the generated terms are `one`, `two`, and `three`. The dot characters themselves are not included in the resulting terms.

## Example usage

The following example request creates a new index named `my_index` and configures an analyzer with a `simple_pattern_split` tokenizer. The tokenizer is configured to split text on hyphens:

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

Use the following request to examine the tokens generated using the analyzer:

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

## Parameters

The `simple_pattern_split` tokenizer can be configured with the following parameter.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`pattern` | Optional | String | The pattern used to split text into tokens, specified using a [Lucene regular expression](https://lucene.apache.org/core/9_10_0/core/org/apache/lucene/util/automaton/RegExp.html). Default is an empty string, which returns the input text as one token. 