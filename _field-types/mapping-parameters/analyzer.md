---
layout: default
title: Analyzer
parent: Mapping parameters

nav_order: 5
has_children: false
has_toc: false
canonical_url: https://docs.opensearch.org/latest/field-types/mapping-parameters/analyzer/
---

# Analyzer

The `analyzer` mapping parameter is used to define the text analysis process that applies to a text field during both index and search operations.

The key functions of the `analyzer` mapping parameter are:

1. **Tokenization:** The analyzer determines how the text is broken down into individual tokens (words, numbers) that can be indexed and searched. Each generated token must not exceed 32,766 bytes in order to avoid indexing failures.

2. **Normalization:** The analyzer can apply various normalization techniques, such as converting text to lowercase, removing stop words, and stemming/lemmatizing words.

3. **Consistency:** By defining the same analyzer for both index and search operations, you ensure that the text analysis process is consistent, which helps improve the relevance of search results.

4. **Customization:** OpenSearch allows you to define custom analyzers by specifying the tokenizer, character filters, and token filters to be used. This gives you fine-grained control over the text analysis process.

For information about specific analyzer parameters, such as `analyzer`, `search_analyzer`, or `search_quote_analyzer`, see [Search analyzers]({{site.url}}{{site.baseurl}}/analyzers/search-analyzers/).
{: .note}

------------

## Example

The following example configuration defines a custom analyzer called `my_custom_analyzer`:

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

In this example, the `my_custom_analyzer` uses the standard tokenizer, converts all tokens to lowercase, applies a custom stop word filter, and applies an English stemmer.

You can then map a text field so that it uses this custom analyzer for both index and search operations:

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
