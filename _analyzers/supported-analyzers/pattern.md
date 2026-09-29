---
layout: default
title: Pattern analyzer
parent: Analyzers
nav_order: 90
canonical_url: https://docs.opensearch.org/latest/analyzers/supported-analyzers/pattern/
---

# Pattern analyzer

The `pattern` analyzer allows you to define a custom analyzer that uses a regular expression (regex) to split input text into tokens. It also provides options for applying regex flags, converting tokens to lowercase, and filtering out stopwords.

## Parameters

The `pattern` analyzer can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`pattern` | Optional | String | A [Java regular expression](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html) used to tokenize the input. Default is `\W+`.
`flags` | Optional | String | A string containing pipe-separated [Java regex flags](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html#field.summary) that modify the behavior of the regular expression.
`lowercase` | Optional | Boolean | Whether to convert tokens to lowercase. Default is `true`.
`stopwords` | Optional | String or list of strings | A string specifying a predefined list of stopwords (such as `_english_`) or an array specifying a custom list of stopwords. Default is `_none_`.
`stopwords_path` | Optional | String | The path (absolute or relative to the config directory) to the file containing a list of stopwords.


## Example

Use the following command to create an index named `my_pattern_index` with a `pattern` analyzer:

```json
PUT /my_pattern_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_pattern_analyzer": {
          "type": "pattern",
          "pattern": "\\W+",  
          "lowercase": true,                
          "stopwords": ["and", "is"]       
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "my_field": {
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
POST /my_pattern_index/_analyze
{
  "analyzer": "my_pattern_analyzer",
  "text": "OpenSearch is fast and scalable"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "opensearch",
      "start_offset": 0,
      "end_offset": 10,
      "type": "word",
      "position": 0
    },
    {
      "token": "fast",
      "start_offset": 14,
      "end_offset": 18,
      "type": "word",
      "position": 2
    },
    {
      "token": "scalable",
      "start_offset": 23,
      "end_offset": 31,
      "type": "word",
      "position": 4
    }
  ]
}
```
