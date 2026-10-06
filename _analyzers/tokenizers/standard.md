---
layout: default
title: Standard
parent: Tokenizers
nav_order: 130
---

# Standard tokenizer

The `standard` tokenizer is the default tokenizer in OpenSearch. It tokenizes text based on word boundaries using a grammar-based approach that recognizes letters, digits, and other characters like punctuation. It is highly versatile and suitable for many languages because it uses Unicode text segmentation rules ([UAX#29](https://unicode.org/reports/tr29/)) to break text into tokens.

## Tokenization rules

The `standard` tokenizer follows the word boundary rules defined in [Unicode Standard Annex #29: Unicode Text Segmentation](https://unicode.org/reports/tr29/). The following table summarizes how these rules apply to common input.

Input | Rule | Tokens
:--- | :--- | :---
`fast, and scalable.` | Whitespace and most punctuation, such as commas, hyphens, slashes, `+`, `#`, `%`, and `@`, split text and are removed. | `fast`, `and`, `scalable`
`can't`, `O'Neil` | An apostrophe between two letters does not split the word. | `can't`, `O'Neil`
`end. Next` | A period followed by a space splits the text. | `end`, `Next`
`hello.world`, `U.S.A.` | A period between two letters does not split the word. A trailing period is removed. | `hello.world`, `U.S.A`
`3.5`, `1,000`, `v1.2.3` | A period or comma between two digits does not split the number. | `3.5`, `1,000`, `v1.2.3`
`snake_case` | Underscores do not split words. | `snake_case`
`state-of-the-art` | Hyphens split words. | `state`, `of`, `the`, `art`
`admin@example.com` | Email addresses are split at the `@` sign. | `admin`, `example.com`
`https://opensearch.org/docs` | URLs are split at the colon and slashes. | `https`, `opensearch.org`, `docs`
`東京`, `こんにちは` | Each ideographic and hiragana character becomes a separate token. | `東`, `京`, `こ`, `ん`, `に`, `ち`, `は`

To keep email addresses and URLs as single tokens, use the [`uax_url_email` tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/uax-url-email/). Tokens longer than `max_token_length` are split at that length. For more information, see [Parameters](#parameters).

## Example usage

The following example request creates a new index named `my_index` and configures an analyzer with a `standard` tokenizer:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_standard_analyzer": {
          "type": "standard"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "my_standard_analyzer"
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
  "analyzer": "my_standard_analyzer",
  "text": "OpenSearch is powerful, fast, and scalable."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "opensearch",
      "start_offset": 0,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "is",
      "start_offset": 11,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "powerful",
      "start_offset": 14,
      "end_offset": 22,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "fast",
      "start_offset": 24,
      "end_offset": 28,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "and",
      "start_offset": 30,
      "end_offset": 33,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "scalable",
      "start_offset": 34,
      "end_offset": 42,
      "type": "<ALPHANUM>",
      "position": 5
    }
  ]
}
```

## Parameters

The `standard` tokenizer can be configured with the following parameter.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`max_token_length` | Optional | Integer | Sets the maximum length of the produced token. If this length is exceeded, the token is split into multiple tokens at the length configured in `max_token_length`. Default is `255`.

