---
layout: default
title: Flatten graph
parent: Token filters
nav_order: 150
---

# Flatten graph token filter

The `flatten_graph` token filter is used to handle complex token relationships that occur when multiple tokens are generated at the same position in a graph structure. Some token filters, like `synonym_graph` and `word_delimiter_graph`, generate multi-position tokens---tokens that overlap or span multiple positions. These token graphs are useful for search queries but are not directly supported during indexing. The `flatten_graph` token filter resolves multi-position tokens into a linear sequence of tokens. Flattening the graph ensures compatibility with the indexing process. 

Token graph flattening is a lossy process. Whenever possible, avoid using the `flatten_graph` filter. Instead, apply graph token filters exclusively in search analyzers, removing the need for the `flatten_graph` filter.
{: .important}

## Example

The following example request creates a new index named `test_index` and configures an analyzer with a `flatten_graph` filter:

```json
PUT /test_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_index_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "my_custom_filter",
            "flatten_graph"
          ]
        }
      },
      "filter": {
        "my_custom_filter": {
          "type": "word_delimiter_graph",
          "catenate_all": true
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
POST /test_index/_analyze
{
  "analyzer": "my_index_analyzer",
  "text": "OpenSearch helped many employers"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "OpenSearch",
      "start_offset": 0,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 0,
      "positionLength": 2
    },
    {
      "token": "Open",
      "start_offset": 0,
      "end_offset": 4,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "Search",
      "start_offset": 4,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "helped",
      "start_offset": 11,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "many",
      "start_offset": 18,
      "end_offset": 22,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "employers",
      "start_offset": 23,
      "end_offset": 32,
      "type": "<ALPHANUM>",
      "position": 4
    }
  ]
}
```
