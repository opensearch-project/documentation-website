---
layout: default
title: classic
parent: Token filters
nav_order: 50
---

# Classic token filter

The primary function of the classic token filter is to work alongside the classic tokenizer. It processes tokens by applying several common transformations. These transformations aid in text analysis and search. These include:
 - Removal of possessive endings such as *'s*, for example: *John's* becomes *John*.
 - Separating words on internal hyphens, making terms like *co-operate* become tokens *co* and *operate*.
 - Removal of *.* from acronyms, for example: *D.A.R.P.A.* becomes *DARPA*.


## Example

The following example request creates a new index named `custom_classic_filter` and configures an analyzer with the `classic` filter:

```json
PUT /custom_classic_filter
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_classic": {
          "type": "custom",
          "tokenizer": "classic",
          "filter": ["classic"]
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
POST /custom_classic_filter/_analyze
{
  "analyzer": "custom_classic",
  "text": "John's co-operate was excellent."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "John",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<APOSTROPHE>",
      "position": 0
    },
    {
      "token": "co",
      "start_offset": 7,
      "end_offset": 9,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "operate",
      "start_offset": 10,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "was",
      "start_offset": 18,
      "end_offset": 21,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "excellent",
      "start_offset": 22,
      "end_offset": 31,
      "type": "<ALPHANUM>",
      "position": 4
    }
  ]
}
```

