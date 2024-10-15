---
layout: default
title: Keyword analyzer
nav_order: 80
---

# Keyword analyzer

The `keyword` analyzer doesn’t tokenize the text at all, but instead, it treats the entire input as a single token. This is useful when you want the entire content of a field to be indexed as-is, without breaking it into smaller pieces (tokens). The `keyword` analyzer is often used for fields like email addresses, URLs, product IDs, and other cases where tokenization is not desirable. 

## Example configuration

You can use the following command to create index `my_keyword_index` with `keyword` analyzer:

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

## Configuring custom analyzer

You can use the following command to configure index `my_custom_keyword_index` with custom analyzer equivalent to `keyword` analyzer:

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

Use the following request to examine the tokens generated using the created analyzer:

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
