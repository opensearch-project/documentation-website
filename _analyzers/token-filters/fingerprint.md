---
layout: default
title: Fingerprint
parent: Token filters
nav_order: 140
---

# Fingerprint token filter

The OpenSearch `fingerprint` token filter is used to standardize and deduplicate text. This is particularly useful for tasks where consistency in text processing is crucial. `fingerprint` token filter achieves this by processing text using the following steps:

1. **Lowercasing**: Converts all text to lowercase.
2. **Splitting**: Breaks the text into words.
3. **Sorting**: Arranges the tokens in alphabetical order.
4. **Removing duplicates**: Eliminates repeated tokens.
5. **Joining tokens**: Combines the tokens into a single string, typically joined by a space or another specified separator.

## Parameters

The `fingerprint` token filter in OpenSearch can be configured with the following two parameters:

- `max_output_size`: Limits the length of the generated fingerprint string. If the concatenated string exceeds the `max_output_size`, the filter will not produce any output, resulting in empty token. Default is `255`. (Integer, _Optional_)
- `separator`: Defines the character(s) used to join the tokens into a single string after they have been sorted and deduplicated. Default is space (`" "`) (String, _Optional_)

## Example

The following example request creates a new index named `my_index` and configures an analyzer with `fingerprint` filter:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_fingerprint": {
          "type": "fingerprint",
          "max_output_size": 200,
          "separator": "-"
        }
      },
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_fingerprint"
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
POST /my_index/_analyze
{
  "analyzer": "my_analyzer",
  "text": "OpenSearch is a powerful search engine that scales easily"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "a-easily-engine-is-opensearch-powerful-scales-search-that",
      "start_offset": 0,
      "end_offset": 57,
      "type": "fingerprint",
      "position": 0
    }
  ]
}
```
