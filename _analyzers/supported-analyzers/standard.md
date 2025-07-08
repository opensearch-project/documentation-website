---
layout: default
title: Standard analyzer
parent: Analyzers
nav_order: 50
---

# Standard analyzer

The `standard` analyzer is the built-in default analyzer used for general-purpose full-text search in OpenSearch. It is designed to provide consistent, language-agnostic text processing by efficiently breaking down text into searchable terms.

The `standard` analyzer performs the following operations:

- **Tokenization**: Uses the [`standard`]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/standard/) tokenizer, which splits text into words based on Unicode text segmentation rules, handling spaces, punctuation, and common delimiters.
- **Lowercasing**: Applies the [`lowercase`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/lowercase/) token filter to convert all tokens to lowercase, ensuring consistent matching regardless of input case.

This combination makes the `standard` analyzer ideal for indexing a wide range of natural language content without needing language-specific customizations.


## Example: Creating an index with the standard analyzer

You can assign the `standard` analyzer to a text field when creating an index:

```json
PUT /my_standard_index
{
  "mappings": {
    "properties": {
      "my_field": {
        "type": "text",
        "analyzer": "standard"
      }
    }
  }
}
```
{% include copy-curl.html %}


## Parameters

The `standard` analyzer supports the following optional parameters.

| Parameter | Data type | Default | Description |
|:----------|:-----|:--------|:------------|
| `max_token_length` | Integer | `255` | The maximum length that a token can be before it is split. |
| `stopwords` | String or list of strings | None | A list of stopwords or a [predefined stopword set for a language]({{site.url}}{{site.baseurl}}/analyzers/token-filters/stop/#predefined-stopword-sets-by-language) to remove during analysis. For example, `_english_`. |
| `stopwords_path` | String | None | The path to a file containing stopwords to be used during analysis. |

Only use one of the parameters `stopwords` or `stopwords_path`. If both are used, no error is returned but only the `stopwords` parameter is applied.
{: .note}

## Example: Analyzer with parameters

The following example creates a `products` index and configures the `max_token_length` and `stopwords` parameters:

```json
PUT /animals
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_manual_stopwords_analyzer": {
          "type": "standard",
          "max_token_length": 10,
          "stopwords": [
            "the", "is", "and", "but", "an", "a", "it"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Use the following `_analyze` API request to see how the `my_manual_stopwords_analyzer` processes text:

```json
POST /animals/_analyze
{
  "analyzer": "my_manual_stopwords_analyzer",
  "text": "The Turtle is Large but it is Slow"
}
```
{% include copy-curl.html %}

The returned tokens:

- Have been split on spaces.
- Have been lowercased.
- Have had stopwords removed.

```json
{
  "tokens": [
    {
      "token": "turtle",
      "start_offset": 4,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "large",
      "start_offset": 14,
      "end_offset": 19,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "slow",
      "start_offset": 30,
      "end_offset": 34,
      "type": "<ALPHANUM>",
      "position": 7
    }
  ]
}
```
