---
layout: default
title: Snowball
parent: Token filters
nav_order: 380
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/snowball/
---

# Snowball token filter

The `snowball` token filter is a stemming filter based on the [Snowball](https://snowballstem.org/) algorithm. It supports many languages and is more efficient and accurate than the Porter stemming algorithm.

## Parameters

The `snowball` token filter can be configured with a `language` parameter that accepts the following values:

- `Arabic`
- `Armenian`
- `Basque`
- `Catalan`
- `Danish`
- `Dutch`
- `English` (default)
- `Estonian`
- `Finnish`
- `French`
- `German`
- `German2` 
- `Hungarian`
- `Italian`
- `Irish`
- `Kp`
- `Lithuanian`
- `Lovins`
- `Norwegian`
- `Porter`
- `Portuguese`
- `Romanian`
- `Russian`
- `Spanish`
- `Swedish`
- `Turkish`

## Example

The following example request creates a new index named `my-snowball-index` and configures an analyzer with a `snowball` filter:

```json
PUT /my-snowball-index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_snowball_filter": {
          "type": "snowball",
          "language": "English"
        }
      },
      "analyzer": {
        "my_snowball_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_snowball_filter"
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
GET /my-snowball-index/_analyze
{
  "analyzer": "my_snowball_analyzer",
  "text": "running runners"
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
    }
  ]
}
```