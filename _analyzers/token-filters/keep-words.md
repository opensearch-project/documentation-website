---
layout: default
title: Keep words
parent: Token filters
nav_order: 190
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/keep-words/
---

# Keep words token filter

The `keep_words` token filter is designed to keep only certain words during the analysis process. This filter is useful if you have a large body of text but are only interested in certain keywords or terms.

## Parameters

The `keep_words` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`keep_words` |  Required if `keep_words_path` is not configured | List of strings | The list of words to keep.
`keep_words_path` | Required if `keep_words` is not configured | String | The path to the file containing the list of words to keep.
`keep_words_case` | Optional | Boolean | Whether to lowercase all words during comparison. Default is `false`.
 

## Example

The following example request creates a new index named `my_index` and configures an analyzer with a `keep_words` filter:

```json
PUT my_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_keep_word": {
          "tokenizer": "standard",
          "filter": [ "keep_words_filter" ]
        }
      },
      "filter": {
        "keep_words_filter": {
          "type": "keep",
          "keep_words": ["example", "world", "opensearch"],
          "keep_words_case": true
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
GET /my_index/_analyze
{
  "analyzer": "custom_keep_word",
  "text": "Hello, world! This is an OpenSearch example."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "world",
      "start_offset": 7,
      "end_offset": 12,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "OpenSearch",
      "start_offset": 25,
      "end_offset": 35,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "example",
      "start_offset": 36,
      "end_offset": 43,
      "type": "<ALPHANUM>",
      "position": 6
    }
  ]
}
```
