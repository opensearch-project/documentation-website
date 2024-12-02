---
layout: default
title: Reverse
parent: Token filters
nav_order: 360
---

# Reverse token filter

The `reverse` token filter reverses the order of the characters in each token, making suffix information accessible at the beginning of the reversed tokens during analysis. 

This is useful for suffix-based searches:

The `reverse` token filter is useful when you need to perform suffix-based searches, such as in the following scenarios:  

- **Suffix matching**: Searching for words based on their suffixes, such as identifying words with a specific ending (for example, `-tion` or `-ing`).
- **File extension searches**: Searching for files by their extensions, such as `.txt` or `.jpg`.
- **Custom sorting or ranking**: By reversing tokens, you can implement unique sorting or ranking logic based on suffixes.  
- **Autocomplete for suffixes**: Implementing autocomplete suggestions that use suffixes rather than prefixes.  


## Example

The following example request creates a new index named `my-reverse-index` and configures an analyzer with a `reverse` filter:

```json
PUT /my-reverse-index
{
  "settings": {
    "analysis": {
      "filter": {
        "reverse_filter": {
          "type": "reverse"
        }
      },
      "analyzer": {
        "my_reverse_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "reverse_filter"
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
GET /my-reverse-index/_analyze
{
  "analyzer": "my_reverse_analyzer",
  "text": "hello world"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "olleh",
      "start_offset": 0,
      "end_offset": 5,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "dlrow",
      "start_offset": 6,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 1
    }
  ]
}
```