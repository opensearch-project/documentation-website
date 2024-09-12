---
layout: default
title: common_grams
parent: Token filters
nav_order: 60
---
<!-- vale off -->
# Common_grams token filter
<!-- vale on -->
The `common_grams` token filter in OpenSearch improves search relevance by keeping commonly occurring phrases (common grams) in the text. This is useful when dealing with languages or datasets where certain word combinations frequently occur and can impact the search relevance if treated as separate tokens.

Using this token filter improves search relevance by keeping common phrases intact, it can help in matching queries more accurately, particularly for frequent word combinations. It also improves search precision by reducing the number of irrelevant matches.

Using this filter requires careful selection and maintenance of the list of common words
{: .warning}

## Parameters

`common_grams` token filter can be configured with several parameters to control its behavior.

Parameter | Description | Example
`common_words` | A list of words that should be considered as common words. These words will be used to form common grams. (Required) | ["the", "and", "of"]
`ignore_case` | Indicates whether the filter should ignore case differences when matching common words. | `true` or `false` (Default: `false`)
`query_mode` | When set to true, the filter only emits common grams during the analysis phase (useful during query time to ensure the query matches documents analyzed with the same filter). | `true` or `false` (Default: `false`)


## Example

The following example request creates a new index named `my_common_grams_index` and configures an analyzer with the `common_grams` filter:

```json
PUT /my_common_grams_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_common_grams_filter": {
          "type": "common_grams",
          "common_words": ["a", "in", "for"],
          "ignore_case": true,
          "query_mode": true
        }
      },
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_common_grams_filter"
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
GET /my_common_grams_index/_analyze
{
  "analyzer": "my_analyzer",
  "text": "A quick black cat jumps over the lazy dog in the park"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "a_quick",
      "start_offset": 0,
      "end_offset": 7,
      "type": "gram",
      "position": 0
    },
    {
      "token": "quick",
      "start_offset": 2,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "black",
      "start_offset": 8,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "cat",
      "start_offset": 14,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "jumps",
      "start_offset": 18,
      "end_offset": 23,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "over",
      "start_offset": 24,
      "end_offset": 28,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "the",
      "start_offset": 29,
      "end_offset": 32,
      "type": "<ALPHANUM>",
      "position": 6
    },
    {
      "token": "lazy",
      "start_offset": 33,
      "end_offset": 37,
      "type": "<ALPHANUM>",
      "position": 7
    },
    {
      "token": "dog_in",
      "start_offset": 38,
      "end_offset": 44,
      "type": "gram",
      "position": 8
    },
    {
      "token": "in_the",
      "start_offset": 42,
      "end_offset": 48,
      "type": "gram",
      "position": 9
    },
    {
      "token": "the",
      "start_offset": 45,
      "end_offset": 48,
      "type": "<ALPHANUM>",
      "position": 10
    },
    {
      "token": "park",
      "start_offset": 49,
      "end_offset": 53,
      "type": "<ALPHANUM>",
      "position": 11
    }
  ]
}
```

