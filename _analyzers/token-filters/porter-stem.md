---
layout: default
title: Porter stem
parent: Token filters
nav_order: 340
---

# Porter stem token filter

The `porter_stem` token filter reduces words to their base or "stem" form and removes common suffixes from words, which helps in matching similar words by their root. It is primarily used for English language and provides stemming based on [Porter stemming algorithm](https://snowballstem.org/algorithms/porter/stemmer.html).


## Example

The following example request creates a new index named `my_stem_index` and configures an analyzer with `porter_stem` filter:

```json
PUT /my_stem_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_porter_stem": {
          "type": "porter_stem"
        }
      },
      "analyzer": {
        "porter_analyzer": {
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_porter_stem"
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
POST /my_stem_index/_analyze
{
  "text": "running runners ran",
  "analyzer": "porter_analyzer"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "run",
      "start_offset": 0,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "runner",
      "start_offset": 8,
      "end_offset": 15,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "ran",
      "start_offset": 16,
      "end_offset": 19,
      "type": "<ALPHANUM>",
      "position": 2
    }
  ]
}
```
