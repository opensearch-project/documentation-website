---
layout: default
title: Edge-N-Gram Tokenizer
parent: Tokenizers
nav_order: 40
---

# Edge n-gram tokenizer

The `edge n-gram` tokenizer generates partial word tokens, or `n-grams`, starting from the beginning of each word. It splits the text based on specified characters and produces tokens with lengths defined by a minimum and maximum range. This tokenizer is particularly useful for implementing search-as-you-type functionality.

Edge n-grams are ideal for autocomplete searches where the order of the words may vary, such as with product names or addresses. However, for text with a fixed order, like movie or song titles, the completion suggester may be more efficient.

## How the edge n-gram tokenizer works

By default, the `edge n-gram` tokenizer produces tokens with a minimum length of `1` and a maximum length of `2`. 

For example, analyzing the text `OpenSearch` with the default configuration will produce:

```
O, Op
```

These short n-grams are often not sufficient for meaningful searches, so configuring the tokenizer is necessary to adjust the gram lengths.

## Edge-n-gram tokenizer configuration

Configuration options include:
- `min_gram`: The minimum token length. Default is 1.
- `max_gram`: The maximum token length. Default is 2.
- `custom_token_chars:` Defines custom characters to be treated as part of a token (e.g., `+-_`).
- `token_chars`: Defines which character classes should be included in tokens. The tokenizer will split tokens on characters that aren’t part of the specified classes. Default is to include all characters. Available character classes include:
  - `letter`: Alphabetic characters (e.g., `a`, `b`, `ç`, `京`)
  - `digit`: Numeric characters (e.g., `3`, `7`)
  - `punctuation`: Punctuation symbols (e.g., `!`, `?`)
  - `symbol`: Other symbols (e.g., `$`, `√`)
  - `whitespace`: Space or newline characters
  - `custom`: Allows you to specify custom characters through the custom_token_chars setting.

### `max_gram` parameter limitations

The `max_gram` value defines the upper limit for token length. If a search query is longer than the maximum token length, the query may fail to match any indexed terms. For example, if `max_gram` is set to `4`, a search for `"`searching` will not match `sear`

A possible solution is to use a `truncate` token filter to limit search terms to the `max_gram` length, though this could yield imprecise results. For instance, truncating `"`searching`"` to `sear` might match terms like `search` or `seared`, which may not be relevant.

### Example configuration

We can configure the `edge n-gram` tokenizer to produce tokens between `3` and `6` characters in length, considering both letters and symbols as valid token characters:

```json
PUT edge_n_gram_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_analyzer": {
          "tokenizer": "my_custom_tokenizer"
        }
      },
      "tokenizer": {
        "my_custom_tokenizer": {
          "type": "edge_ngram",
          "min_gram": 3,
          "max_gram": 6,
          "token_chars": [
            "letter"          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Analysing the sample text "Code 42 rocks!" with our `edge_n_gram_index` index

```json
POST edge_n_gram_index/_analyze
{
  "analyzer": "my_custom_analyzer",
  "text": "Code 42 rocks!"
}
```
{% include copy-curl.html %}

We see the tokens or `n-grams` returned by the `edge n-gram` tokenizer when given the text "Code 42 rocks!" to analyze:

```
[Cod, Code, roc, rock, rocks]
```

## Best practices

It is recommended to use the `edge n-gram` tokenizer only at indexing time to ensure partial word tokens are stored. At search time, a simpler analyzer should be used to match full user queries.

## Search-as-you-type configuration

To implement search-as-you-type functionality, it's typical to use the `edge n-gram` tokenizer only during indexing and a simpler analyzer at search time. The following configuration demonstrates this:

```json
PUT my_autocomplete_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "autocomplete_index": {
          "tokenizer": "autocomplete_edge_ngram",
          "filter": [
            "lowercase"
          ]
        },
        "autocomplete_search": {
          "tokenizer": "standard",
          "filter": [
            "lowercase"
          ]
        }
      },
      "tokenizer": {
        "autocomplete_edge_ngram": {
          "type": "edge_ngram",
          "min_gram": 2,
          "max_gram": 8,
          "token_chars": [
            "letter",
            "digit"
          ]
        }
      }
    }
  }
}

```
{% include copy-curl.html %}

Index a document with the field `product` and refresh the index:

```json
PUT my_custom_index/_doc/1
{
  "product": "Laptop Pro"
}

POST my_custom_index/_refresh
```
{% include copy-curl.html %}

Then, perform a search with the query `Laptop`":`

```json
GET my_custom_index/_search
{
  "query": {
    "match": {
      "product": {
        "query": "Laptop",
        "operator": "and"
      }
    }
  }
}
```
{% include copy-curl.html %}

Like this, partial matches can be found with an edge n-gram tokenizer, ensuring terms like "Laptop" and "Pro" are indexed correctly for search queries.

