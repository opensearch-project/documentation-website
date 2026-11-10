---
layout: default
title: Pattern analyzer
parent: Analyzers
nav_order: 90
---

# Pattern analyzer

The `pattern` analyzer allows you to define a custom analyzer that uses a regular expression (regex) to split input text into tokens. The regex matches the separators between tokens, not the tokens themselves. It also provides options for applying regex flags, converting tokens to lowercase, and filtering out stopwords.

The `pattern` analyzer consists of a [`pattern`]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/pattern/) tokenizer followed by the [`lowercase`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/lowercase/) and [`stop`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/stop/) token filters. The `stop` filter removes no tokens unless you specify `stopwords` or `stopwords_path`.

## Parameters

The `pattern` analyzer can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`pattern` | Optional | String | A [Java regular expression](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html) used to tokenize the input. Default is `\W+`.
`flags` | Optional | String | A string containing pipe-separated [Java regex flags](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html#field.summary) that modify the behavior of the regular expression.
`lowercase` | Optional | Boolean | Whether to convert tokens to lowercase. Default is `true`.
`stopwords` | Optional | String or list of strings | A string specifying a predefined list of stopwords (such as `_english_`) or an array specifying a custom list of stopwords. Default is `_none_`.
`stopwords_path` | Optional | String | The path (absolute or relative to the config directory) to the file containing a list of stopwords.

A poorly written regular expression can make analysis very slow and, in extreme cases, cause a `StackOverflowError` that stops the node. Avoid patterns that can match the same text in many ways, such as nested quantifiers like `(a+)+`, and test new patterns on representative text using the [Analyze API]({{site.url}}{{site.baseurl}}/api-reference/analyze-apis/).
{: .warning}

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

## Example: Splitting camel case identifiers

Because the regex matches separators, it can also match the zero-width position between two characters. This lets you split identifiers in source code, such as class and method names, into separate words. The following pattern contains five alternatives that split text at runs of characters that are neither letters nor digits, between a lowercase and an uppercase letter, before the last letter of an uppercase acronym that is followed by a lowercase letter, and between letters and digits:

```json
PUT /source-code
{
  "settings": {
    "analysis": {
      "analyzer": {
        "camel_case_analyzer": {
          "type": "pattern",
          "pattern": "[^\\p{L}\\p{N}]+|(?<=\\p{Ll})(?=\\p{Lu})|(?<=\\p{Lu})(?=\\p{Lu}\\p{Ll})|(?<=\\p{L})(?=\\p{N})|(?<=\\p{N})(?=\\p{L})"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

In JSON, each backslash in the pattern must be escaped as `\\`.

Use the following request to analyze a class and method name:

```json
POST /source-code/_analyze
{
  "analyzer": "camel_case_analyzer",
  "text": "XMLHttpRequest2Handler.sendJSONPayload"
}
```
{% include copy-curl.html %}

The response contains the individual words, converted to lowercase:

```json
{
  "tokens": [
    {
      "token": "xml",
      "start_offset": 0,
      "end_offset": 3,
      "type": "word",
      "position": 0
    },
    {
      "token": "http",
      "start_offset": 3,
      "end_offset": 7,
      "type": "word",
      "position": 1
    },
    {
      "token": "request",
      "start_offset": 7,
      "end_offset": 14,
      "type": "word",
      "position": 2
    },
    {
      "token": "2",
      "start_offset": 14,
      "end_offset": 15,
      "type": "word",
      "position": 3
    },
    {
      "token": "handler",
      "start_offset": 15,
      "end_offset": 22,
      "type": "word",
      "position": 4
    },
    {
      "token": "send",
      "start_offset": 23,
      "end_offset": 27,
      "type": "word",
      "position": 5
    },
    {
      "token": "json",
      "start_offset": 27,
      "end_offset": 31,
      "type": "word",
      "position": 6
    },
    {
      "token": "payload",
      "start_offset": 31,
      "end_offset": 38,
      "type": "word",
      "position": 7
    }
  ]
}
```

## Adding token filters to a pattern analyzer

To apply token filters that the `pattern` analyzer does not provide, re-create it as a custom analyzer and add the filters to its `filter` array. The following request creates a custom analyzer that produces the same tokens as the default `pattern` analyzer:

```json
PUT /custom-pattern-index
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "my_pattern_tokenizer": {
          "type": "pattern",
          "pattern": "\\W+"
        }
      },
      "analyzer": {
        "rebuilt_pattern": {
          "type": "custom",
          "tokenizer": "my_pattern_tokenizer",
          "filter": [
            "lowercase"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Add more token filters after `lowercase` in the `filter` array. To remove stopwords, add a [`stop`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/stop/) filter.
