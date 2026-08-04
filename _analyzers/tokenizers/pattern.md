---
layout: default
title: Pattern
parent: Tokenizers
nav_order: 100
canonical_url: https://docs.opensearch.org/latest/analyzers/tokenizers/pattern/
---

# Pattern tokenizer

The `pattern` tokenizer is a highly flexible tokenizer that allows you to split text into tokens based on a custom Java regular expression. Unlike the `simple_pattern` and `simple_pattern_split` tokenizers, which use Lucene regular expressions, the `pattern` tokenizer can handle more complex and detailed regex patterns, offering greater control over how the text is tokenized.

## Example usage

The following example request creates a new index named `my_index` and configures an analyzer with a `pattern` tokenizer. The tokenizer splits text on `-`, `_`, or `.` characters:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "my_pattern_tokenizer": {
          "type": "pattern",
          "pattern": "[-_.]"
        }
      },
      "analyzer": {
        "my_pattern_analyzer": {
          "type": "custom",
          "tokenizer": "my_pattern_tokenizer"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "my_pattern_analyzer"
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
  "analyzer": "my_pattern_analyzer",
  "text": "OpenSearch-2024_v1.2"
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
      "token": "v1",
      "start_offset": 16,
      "end_offset": 18,
      "type": "word",
      "position": 2
    },
    {
      "token": "2",
      "start_offset": 19,
      "end_offset": 20,
      "type": "word",
      "position": 3
    }
  ]
}
```

## Parameters

The `pattern` tokenizer can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`pattern` | Optional | String | The pattern used to split text into tokens, specified using a [Java regular expression](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html). Default is `\W+`.
`flags` | Optional | String | Configures pipe-separated [flags](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html#field.summary) to apply to the regular expression, for example, `"CASE_INSENSITIVE|MULTILINE|DOTALL"`. 
`group` | Optional | Integer | Specifies the capture group to be used as a token. Default is `-1` (split on a match).

## Example using a group parameter

The following example request configures a `group` parameter that captures only the second group:

```json
PUT /my_index_group2
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "my_pattern_tokenizer": {
          "type": "pattern",
          "pattern": "([a-zA-Z]+)(\\d+)",
          "group": 2
        }
      },
      "analyzer": {
        "my_pattern_analyzer": {
          "type": "custom",
          "tokenizer": "my_pattern_tokenizer"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Use the following request to examine the tokens generated using the analyzer:

```json
POST /my_index_group2/_analyze
{
  "analyzer": "my_pattern_analyzer",
  "text": "abc123def456ghi"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "123",
      "start_offset": 3,
      "end_offset": 6,
      "type": "word",
      "position": 0
    },
    {
      "token": "456",
      "start_offset": 9,
      "end_offset": 12,
      "type": "word",
      "position": 1
    }
  ]
}
```