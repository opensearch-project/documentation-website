---
layout: default
title: Pattern analyzer
nav_order: 90
---

# Pattern analyzer

The `pattern` analyzer allows you to define a custom analyzer that uses a regular expression (regex) to split the input text into tokens. It also provides options for applying regex flags, converting tokens to lowercase, and filtering out `stopwords`.

## Configuration

The `pattern` analyzer can be configured using the following parameters:

- `pattern`: A [Java regular expression](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html) used to tokenize the input. Default is `\W+`. (String, _Optional_)
- `flags`: [Java regex flags](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html#field.summary) that modify the behavior of the regular expression. (String, _Optional_)
- `lowercase`: Convert tokens to lower case. Default is `true`. (Boolean, _Optional_)
- `stopwords`: a custom list or predefined list of stop words. Default is `_none_`. (String or list of strings, _Optional_)
- `stopwords_path`: Path (absolute or relative to config directory) to the list of stop words. (String, _Optional_)


## Example configuration

You can use the following command to create index `my_pattern_index` with `pattern` analyzer:

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

Use the following request to examine the tokens generated using the created analyzer:

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
