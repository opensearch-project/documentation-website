---
layout: default
title: Keyword analyzer
parent: Analyzers
nav_order: 80
---

# Keyword analyzer

The `keyword` analyzer doesn't tokenize text at all. Instead, it treats the entire input as a single token and does not break it into individual tokens. The `keyword` analyzer is often used for fields containing email addresses, URLs, or product IDs and in other cases where tokenization is not desirable. 

## Example

Use the following command to create an index named `my_keyword_index` with a `keyword` analyzer:

```json
PUT /my_keyword_index
{
  "mappings": {
    "properties": {
      "my_field": {
        "type": "text",
        "analyzer": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Configuring a custom analyzer

Use the following command to configure an index with a custom analyzer that is equivalent to the `keyword` analyzer:

```json
PUT /my_custom_keyword_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_keyword_analyzer": {
          "tokenizer": "keyword"
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
POST /my_custom_keyword_index/_analyze
{
  "analyzer": "my_keyword_analyzer",
  "text": "Just one token"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "Just one token",
      "start_offset": 0,
      "end_offset": 14,
      "type": "word",
      "position": 0
    }
  ]
}
```
