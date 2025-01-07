---
layout: default
title: Keyword 
parent: Tokenizers
nav_order: 50
---

# Keyword tokenizer

The `keyword` tokenizer ingests text and outputs it exactly as a single, unaltered token. This makes it particularly useful when you want the input to remain intact, such as when managing structured data like names, product codes, or email addresses. 

The `keyword` tokenizer can be paired with token filters to process the text, for example, to normalize it or to remove extraneous characters.

## Example usage

The following example request creates a new index named `my_index` and configures an analyzer with a `keyword` tokenizer:
 
```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_keyword_analyzer": {
          "type": "custom",
          "tokenizer": "keyword"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "my_keyword_analyzer"
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
  "analyzer": "my_keyword_analyzer",
  "text": "OpenSearch Example"
}
```
{% include copy-curl.html %}

The response contains the single token representing the original text:

```json
{
  "tokens": [
    {
      "token": "OpenSearch Example",
      "start_offset": 0,
      "end_offset": 18,
      "type": "word",
      "position": 0
    }
  ]
}
```

## Parameters

The `keyword` token filter can be configured with the following parameter.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`buffer_size`| Optional | Integer | Determines the character buffer size. Default is `256`. There is usually no need to change this setting.

## Combining the keyword tokenizer with token filters

To enhance the functionality of the `keyword` tokenizer, you can combine it with token filters. Token filters can transform the text, such as converting it to lowercase or removing unwanted characters.

### Example: Using the pattern_replace filter and keyword tokenizer

In this example, the `pattern_replace` filter uses a regular expression to replace all non-alphanumeric characters with an empty string:

```json
POST _analyze
{
  "tokenizer": "keyword",
  "filter": [
    {
      "type": "pattern_replace",
      "pattern": "[^a-zA-Z0-9]",
      "replacement": ""
    }
  ],
  "text": "Product#1234-XYZ"
}
```
{% include copy-curl.html %}

The `pattern_replace` filter removes non-alphanumeric characters and returns the following token:

```json
{
  "tokens": [
    {
      "token": "Product1234XYZ",
      "start_offset": 0,
      "end_offset": 16,
      "type": "word",
      "position": 0
    }
  ]
}
```

