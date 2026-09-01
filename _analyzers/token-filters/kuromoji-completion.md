---
layout: default
title: Kuromoji completion
parent: Token filters
nav_order: 231
---

# Kuromoji completion token filter

The `kuromoji_completion` token filter generates romanized reading variants for Japanese tokens. When used in an index analyzer, it emits both the original token and one or more romanized alternatives at the same position. This allows users to search for Japanese content by typing in either Japanese characters or their phonetic equivalents.

The filter is designed for use with the `kuromoji_completion` analyzer or in custom analyzers that power autocomplete or suggest fields. Because the filter needs to behave differently at index time and query time, it exposes a `mode` parameter.

To use this token filter, you must first install the `analysis-kuromoji` plugin on all nodes by running `bin/opensearch-plugin install analysis-kuromoji` and then restart the cluster. For more information about installing additional plugins, see [Additional plugins]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/index/).

## Parameters

The following table lists the parameters for the `kuromoji_completion` token filter.

Parameter | Data type | Description
:--- | :--- | :---
`mode` | String | Controls how tokens are generated. Valid values are `index` (default) and `query`. Both modes expand Katakana tokens into their original form plus all Romaji variants. The `query` mode adds two additional behaviors for handling partial IME input: it concatenates consecutive Kana tokens into a single token before romanizing, and it merges a Kana token with a trailing lowercase alphabet token that represents a partially typed IME keystroke (for example, `サッ` followed by `k` becomes `サッk`).

Use `query` mode in the search analyzer so that partial IME input typed by a user is correctly assembled before romanization.
{: .tip}

## Example

The following example creates an index named `kuromoji_completion_example` with both an index-time analyzer (using `mode: index`) and a search-time analyzer (using `mode: query`), and maps the `suggest` field to use them:

```json
PUT /kuromoji_completion_example
{
  "settings": {
    "analysis": {
      "filter": {
        "completion_index_filter": {
          "type": "kuromoji_completion",
          "mode": "index"
        },
        "completion_query_filter": {
          "type": "kuromoji_completion",
          "mode": "query"
        }
      },
      "analyzer": {
        "completion_index_analyzer": {
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer",
          "filter": ["completion_index_filter"]
        },
        "completion_query_analyzer": {
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer",
          "filter": ["completion_query_filter"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "completion_index_analyzer",
        "search_analyzer": "completion_query_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

With this configuration, a query containing either `konpyu` or `コンピュ` will match documents indexed with `コンピューター`.

### Index-time tokens

Use the following request to examine the tokens generated at index time using text that translates to "use a computer":

```json
POST /kuromoji_completion_example/_analyze
{
  "analyzer": "completion_index_analyzer",
  "text": "コンピューターを使う"
}
```
{% include copy-curl.html %}

The response contains the generated tokens. Each source token produces the original form plus one or more Romaji variants at the same position. For `コンピューター` (computer), the filter emits the original Katakana token and two Romaji variants (`konpyuーtaー` and `konnpyuーtaー`). For the particle `を`, it emits the original and two Romaji forms (`wo` and `o`). For the verb `使う` (use), it emits the original and two Romaji forms (`tukau` and `tsukau`):

```json
{
  "tokens": [
    {
      "token": "コンピューター",
      "start_offset": 0,
      "end_offset": 7,
      "type": "word",
      "position": 0
    },
    {
      "token": "konpyuーtaー",
      "start_offset": 0,
      "end_offset": 7,
      "type": "word",
      "position": 0
    },
    {
      "token": "konnpyuーtaー",
      "start_offset": 0,
      "end_offset": 7,
      "type": "word",
      "position": 0
    },
    {
      "token": "を",
      "start_offset": 7,
      "end_offset": 8,
      "type": "word",
      "position": 1
    },
    {
      "token": "wo",
      "start_offset": 7,
      "end_offset": 8,
      "type": "word",
      "position": 1
    },
    {
      "token": "o",
      "start_offset": 7,
      "end_offset": 8,
      "type": "word",
      "position": 1
    },
    {
      "token": "使う",
      "start_offset": 8,
      "end_offset": 10,
      "type": "word",
      "position": 2
    },
    {
      "token": "tukau",
      "start_offset": 8,
      "end_offset": 10,
      "type": "word",
      "position": 2
    },
    {
      "token": "tsukau",
      "start_offset": 8,
      "end_offset": 10,
      "type": "word",
      "position": 2
    }
  ]
}
```

### Query-time tokens

Both modes expand Katakana tokens into the original form plus all Romaji variants. The key difference of `query` mode is its handling of partial IME input: when a Katakana token is followed by a lowercase alphabet character that represents an in-progress IME keystroke, `query` mode concatenates them into a single token before romanizing. Without this, the partial keystroke would be processed as a separate token and the romanization would not match any indexed variant.

The following example demonstrates this with the input `コンピュt`, which represents a user who has typed the Katakana `コンピュ` and is still composing the next character `t` using an IME:

```json
POST /kuromoji_completion_example/_analyze
{
  "analyzer": "completion_query_analyzer",
  "text": "コンピュt"
}
```
{% include copy-curl.html %}

The `query` mode recognizes `t` as a partial IME keystroke and merges it with the preceding Katakana token before romanizing, producing three tokens for the combined form `コンピュt`: the merged Katakana-plus-keystroke token and its two Romaji variants (`konpyut` and `konnpyut`):

```json
{
  "tokens": [
    {
      "token": "コンピュt",
      "start_offset": 0,
      "end_offset": 5,
      "type": "word",
      "position": 0
    },
    {
      "token": "konpyut",
      "start_offset": 0,
      "end_offset": 5,
      "type": "word",
      "position": 0
    },
    {
      "token": "konnpyut",
      "start_offset": 0,
      "end_offset": 5,
      "type": "word",
      "position": 0
    }
  ]
}
```

With `index` mode, `コンピュ` and `t` would be emitted as two separate tokens at different positions, so the romanized form `konpyut` would never be produced and a search for `konpyut` would not match.

### Searching with prefix queries

Because the index stores the original Katakana token and all its Romaji variants, you can use a `prefix` query directly against the indexed Romaji tokens to implement autocomplete. The `prefix` query bypasses the analyzer and matches any indexed token that starts with the given value.

First, index a sample document:

```json
POST /kuromoji_completion_example/_doc/1
{
  "content": "コンピューターを使う"
}
```
{% include copy-curl.html %}

The following `prefix` query matches the document because `konnp` is a prefix of the indexed Romaji token `konnpyuーtaー`:

```json
GET /kuromoji_completion_example/_search
{
  "query": {
    "prefix": {
      "content": {
        "value": "konnp"
      }
    }
  }
}
```
{% include copy-curl.html %}

The following `prefix` query matches the document using the Katakana prefix `コンピュ`, which is a prefix of the indexed Katakana token `コンピューター`:

```json
GET /kuromoji_completion_example/_search
{
  "query": {
    "prefix": {
      "content": {
        "value": "コンピュ"
      }
    }
  }
}
```
{% include copy-curl.html %}

For a higher-level approach that configures the `mode` at the analyzer level rather than the filter level, use the built-in [`kuromoji_completion` analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/#kuromoji_completion-analyzer).
{: .tip}

## Related documentation

- [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/)
- [Kuromoji tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/kuromoji/)
- [Kuromoji reading form token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-readingform/)
- [Japanese stop token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/ja-stop/)
