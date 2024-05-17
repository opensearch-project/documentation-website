---
layout: default
title: analyzer
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 5
has_children: false
has_toc: false
---

# `analyzer`

The `analyzer` mapping parameter is used to define the text analysis process that is applied to a text field during both indexing and searching operations.

The key functions of the `analyzer` mapping parameter are:

1. **Tokenization:** The analyzer determines how the text is broken down into individual tokens (words, numbers) that can be indexed and searched.

2. **Normalization:** The analyzer can apply various normalization techniques, such as converting text to lowercase, removing stopwords, and stemming/lemmatizing words.

3. **Consistency:** By defining the same analyzer for both indexing and searching, you ensure that the text analysis process is consistent, which helps improve the relevance of search results.

4. **Customization:** OpenSearch allows you to define custom analyzers by specifying the tokenizer, character filters, and token filters to use. This gives you fine-grained control over the text analysis process.

------------

## Example

For example, here's a sample configuration that defines a custom analyzer called `my_custom_analyzer`:

```json
PUT my_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_stop_filter",
            "my_stemmer"
          ]
        }
      },
      "filter": {
        "my_stop_filter": {
          "type": "stop",
          "stopwords": ["the", "a", "and", "or"]
        },
        "my_stemmer": {
          "type": "stemmer",
          "language": "english"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "my_text_field": {
        "type": "text",
        "analyzer": "my_custom_analyzer",
        "search_analyzer": "standard",
        "search_quote_analyzer": "my_custom_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

In this example, the `my_custom_analyzer` uses the standard tokenizer, converts all tokens to lowercase, applies a custom stopword filter, and then applies an English stemmer.

You can then map a text field to use this custom analyzer for both indexing and searching:

```json
"mappings": {
  "properties": {
    "my_text_field": {
      "type": "text",
      "analyzer": "my_custom_analyzer"
    }
  }
}
```
{% include copy-curl.html %}

By configuring the `analyzer` mapping parameter, you can ensure that your text fields are analyzed consistently and in a way that optimizes the relevance of your search results.
