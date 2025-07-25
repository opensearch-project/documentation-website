---
layout: default
title: condition
parent: Token filters
nav_order: 70
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/condition/
---

# Condition token filter

The `condition` token filter is a special type of filter that allows you to apply other token filters conditionally based on certain criteria. This provides more control over when certain token filters should be applied during text analysis.
Multiple filters can be configured and only applied when they meet the conditions you define. 
This token filter can be very useful for language-specific processing and handling of special characters.


## Parameters

There are two parameters that must be configured in order to use the `condition` token filter.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`filter` | Required | Array | Specifies which token filters should be applied to the tokens when the specified condition (defined by the `script` parameter) is met.
`script` | Required | Object | Configures an [inline script]({{site.url}}{{site.baseurl}}/api-reference/script-apis/exec-script/) that defines the condition that needs to be met in order for the filters specified in the `filter` parameter to be applied (only inline scripts are accepted).


## Example

The following example request creates a new index named `my_conditional_index` and configures an analyzer with a `condition` filter. This filter applies a `lowercase` filter to any tokens that contain the character sequence "um":

```json
PUT /my_conditional_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_conditional_filter": {
          "type": "condition",
          "filter": ["lowercase"],
          "script": {
            "source": "token.getTerm().toString().contains('um')"
          }
        }
      },
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "my_conditional_filter"
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
GET /my_conditional_index/_analyze
{
  "analyzer": "my_analyzer",
  "text": "THE BLACK CAT JUMPS OVER A LAZY DOG"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "THE",
      "start_offset": 0,
      "end_offset": 3,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "BLACK",
      "start_offset": 4,
      "end_offset": 9,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "CAT",
      "start_offset": 10,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "jumps",
      "start_offset": 14,
      "end_offset": 19,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "OVER",
      "start_offset": 20,
      "end_offset": 24,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "A",
      "start_offset": 25,
      "end_offset": 26,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "LAZY",
      "start_offset": 27,
      "end_offset": 31,
      "type": "<ALPHANUM>",
      "position": 6
    },
    {
      "token": "DOG",
      "start_offset": 32,
      "end_offset": 35,
      "type": "<ALPHANUM>",
      "position": 7
    }
  ]
}
```

