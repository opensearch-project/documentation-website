---
layout: default
title: Keep words
parent: Token filters
nav_order: 190
---

# Keep words token filter

The `keep_words` token filter is designed to include only certain words in the analysis process. This filter is useful if you have a large body of text but are only interested in certain keywords or terms.

## Parameters

The `keep_words` token filter in OpenSearch can be configured with the following parameters:

- `keep_words`: List of words to be kept. (list of strings, _Required_ if `keep_words_path` is not configured)
- `keep_words_path`: Path to a file containing list of words to be kept. (String, _Required_ if `keep_words` is not configured)
- `keep_words_case`: Lowercase all words during comparison. Default is `false` (Boolean, _Optional_)
 

## Example

The following example request creates a new index named `my_index` and configures an analyzer with `keep_words` filter:

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

Use the following request to examine the tokens generated using the created analyzer:

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