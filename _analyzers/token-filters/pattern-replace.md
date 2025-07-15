---
layout: default
title: Pattern replace
parent: Token filters
nav_order: 320
---

# Pattern replace token filter

The `pattern_replace` token filter allows you to modify tokens using regular expressions. This filter replaces patterns in tokens with the specified values, giving you flexibility in transforming or normalizing tokens before indexing them. It's particularly useful when you need to clean or standardize text during analysis.

## Parameters

The `pattern_replace` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`pattern` | Required | String | A regular expression pattern that matches the text that needs to be replaced.
`all` | Optional | Boolean | Whether to replace all pattern matches. If `false`, only the first match is replaced. Default is `true`.
`replacement` | Optional | String | A string with which to replace the matched pattern. Default is an empty string.


## Example

The following example request creates a new index named `text_index` and configures an analyzer with a `pattern_replace` filter to replace tokens containing digits with the string `[NUM]`:

```json
PUT /text_index
{
  "settings": {
    "analysis": {
      "filter": {
        "number_replace_filter": {
          "type": "pattern_replace",
          "pattern": "\\d+",
          "replacement": "[NUM]"
        }
      },
      "analyzer": {
        "number_analyzer": {
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "number_replace_filter"
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
POST /text_index/_analyze
{
  "text": "Visit us at 98765 Example St.",
  "analyzer": "number_analyzer"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "visit",
      "start_offset": 0,
      "end_offset": 5,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "us",
      "start_offset": 6,
      "end_offset": 8,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "at",
      "start_offset": 9,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "[NUM]",
      "start_offset": 12,
      "end_offset": 17,
      "type": "<NUM>",
      "position": 3
    },
    {
      "token": "example",
      "start_offset": 18,
      "end_offset": 25,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "st",
      "start_offset": 26,
      "end_offset": 28,
      "type": "<ALPHANUM>",
      "position": 5
    }
  ]
}
```
