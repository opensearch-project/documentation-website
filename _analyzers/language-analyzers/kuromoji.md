---
layout: default
title: Kuromoji (Japanese)
parent: Language analyzers
grand_parent: Analyzers
nav_order: 225
---

# Kuromoji analyzer

The `kuromoji` analyzer provides morphological analysis for Japanese text using the Kuromoji library backed by the MeCab IPAdic dictionary. It segments Japanese sentences into meaningful tokens, removes common stop words and grammatical particles, and returns tokens in their dictionary base form.

To use the `kuromoji` analyzer or any Kuromoji components, you must first install the `analysis-kuromoji` plugin.

## Installing the plugin

Install the plugin on all nodes and then restart the cluster:

```bash
sudo bin/opensearch-plugin install analysis-kuromoji
```
{% include copy-curl.html %}

For more information about installing plugins, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).

## Kuromoji plugin components

The `analysis-kuromoji` plugin provides the following components that you can use independently or combine in custom analyzers.

### Analyzers

| Analyzer | Description |
|:---------|:------------|
| [`kuromoji`](#how-the-kuromoji-analyzer-works) | Built-in Japanese analyzer. Segments text, removes stop words, and normalizes tokens to their base form. |
| [`kuromoji_completion`](#kuromoji_completion-analyzer) | Analyzer designed for autocomplete of Japanese text. Generates both Katakana and Romaji reading variants. |

### Tokenizer

| Tokenizer | Description |
|:----------|:------------|
| [`kuromoji_tokenizer`]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/kuromoji/) | Dictionary-based Japanese tokenizer with configurable segmentation modes. |

### Character filter

| Character filter | Description |
|:----------------|:------------|
| [`kuromoji_iteration_mark`]({{site.url}}{{site.baseurl}}/analyzers/character-filters/kuromoji-iteration-mark/) | Normalizes Japanese iteration marks (々, ゞ, ヾ) by expanding them to the character they repeat. |

### Token filters

| Token filter | Description |
|:------------|:------------|
| [`kuromoji_baseform`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-baseform/) | Replaces inflected tokens with their dictionary base form. |
| [`kuromoji_part_of_speech`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-part-of-speech/) | Removes tokens whose part-of-speech tag is in a configured stop-tag list. |
| [`kuromoji_readingform`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-readingform/) | Replaces each token with its Katakana or Romaji reading. |
| [`kuromoji_stemmer`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-stemmer/) | Removes trailing long vowel marks (ー) from Katakana words. |
| [`ja_stop`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/ja-stop/) | Removes Japanese stop words from the token stream. |
| [`kuromoji_number`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-number/) | Converts Japanese numeral expressions to standard Arabic numerals. |
| [`kuromoji_completion`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-completion/) | Generates Romaji reading variants for Katakana tokens to support autocomplete. |

## How the kuromoji analyzer works

The `kuromoji` analyzer applies the following pipeline to input text:

1. **CJK width normalization** — `cjk_width` character filter converts full-width ASCII variants to their standard ASCII equivalents and half-width Katakana variants to full-width Katakana before tokenization.
2. **Tokenization** — `kuromoji_tokenizer` in `search` mode segments text using the IPAdic dictionary, splitting long compound words into their sub-tokens.
3. **Base form normalization** — `kuromoji_baseform` replaces inflected verb and adjective forms with their dictionary forms (for example, 食べた → 食べる).
4. **Part-of-speech filtering** — `kuromoji_part_of_speech` removes grammatical particles (助詞), auxiliary verbs (助動詞), punctuation (記号), and other stop tags.
5. **Stop word removal** — `ja_stop` removes common Japanese stop words.
6. **Katakana stemming** — `kuromoji_stemmer` removes trailing long vowel marks (ー) from Katakana words of four or more characters (for example, コンピューター → コンピュータ).
7. **Lowercasing** — `lowercase` converts any Latin characters to lowercase.

## Parameters

The following table lists the parameters for the `kuromoji` analyzer.

Parameter | Data type | Description
:--- | :--- | :---
`mode` | String | Tokenization mode. Valid values are `normal`, `search` (default), and `extended`. See [Tokenization modes](#tokenization-modes) for details.
`user_dictionary` | String | Path to a custom user dictionary file (CSV format) placed in the OpenSearch config directory. Optional.
`user_dictionary_rules` | Array of strings | Inline custom dictionary rules in CSV format. Each entry is `surface,sub-tokens,readings,part-of-speech`. Optional. Cannot be used together with `user_dictionary`.
`stopwords` | String or array of strings | Stop words to use. Accepts `_japanese_` for the built-in Japanese stop set, an array of explicit stop words, or a path to a stop word file. Defaults to the built-in Japanese stop set.

For the full list of stop words in the built-in stop set, see [stopwords.txt](https://github.com/apache/lucene/blob/main/lucene/analysis/kuromoji/src/resources/org/apache/lucene/analysis/ja/stopwords.txt) in the Lucene repository.

## Tokenization modes

The tokenizer mode controls how compound and unknown words are segmented.

| Mode | Behavior |
|:-----|:---------|
| `normal` | Standard dictionary-based segmentation. Compound words are kept as a single token. Unknown words are kept as a single token. |
| `search` (default) | Like `normal`, but compound words (for example, place names) are also split into their sub-components, improving recall for search queries. |
| `extended` | Like `normal`, but unknown words are split into unigrams (individual characters), ensuring that every character is indexed. |

## Example: Basic usage

The following example creates an index that uses the built-in `kuromoji` analyzer:

```json
PUT /japanese-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "kuromoji"
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the analyzer with a Japanese sentence meaning "I studied at the Tokyo library":

```json
POST /_analyze
{
  "analyzer": "kuromoji",
  "text": "東京の図書館で勉強しました"
}
```
{% include copy-curl.html %}

The analyzer returns base-form tokens with particles and auxiliary verbs removed:

```json
{
  "tokens": [
    {
      "token": "東京",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "図書館",
      "start_offset": 3,
      "end_offset": 6,
      "type": "word",
      "position": 2
    },
    {
      "token": "勉強",
      "start_offset": 7,
      "end_offset": 9,
      "type": "word",
      "position": 4
    }
  ]
}
```

## Example: Custom kuromoji analyzer

The following example creates a custom `kuromoji` analyzer that uses `user_dictionary_rules` to register inline custom terms:

```json
PUT /japanese-custom-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_kuromoji": {
          "type": "kuromoji",
          "mode": "search",
          "user_dictionary_rules": [
            "東京スカイツリー,東京 スカイツリー,トウキョウ スカイツリー,カスタム名詞"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "my_kuromoji"
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the custom analyzer with a sentence containing the registered term ("I went to Tokyo Skytree"):

```json
POST /japanese-custom-index/_analyze
{
  "analyzer": "my_kuromoji",
  "text": "東京スカイツリーに行きました"
}
```
{% include copy-curl.html %}

The analyzer uses the custom dictionary rule to segment `東京スカイツリー` into `東京` and `スカイツリー`. The default Katakana stemmer (`kuromoji_stemmer`) then removes the trailing long vowel mark from `スカイツリー` to produce `スカイツリ`, while particles (`に`) and auxiliary verbs (`ました`) are removed, and `行きました` is normalized to its base form `行く`:

```json
{
  "tokens": [
    {
      "token": "東京",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "スカイツリ",
      "start_offset": 2,
      "end_offset": 8,
      "type": "word",
      "position": 1
    },
    {
      "token": "行く",
      "start_offset": 9,
      "end_offset": 11,
      "type": "word",
      "position": 3
    }
  ]
}
```

## kuromoji_completion analyzer

The `kuromoji_completion` analyzer is designed for autocomplete use cases. It generates both the original Japanese tokens and their Romaji (Latin script) reading variants, allowing users to search for Japanese content by typing in either Japanese characters or their romanized equivalents.

The analyzer accepts the following parameters.

Parameter | Data type | Description
:--- | :--- | :---
`mode` | String | Completion mode. Valid values are `index` (default) and `query`. Use `index` in the index analyzer to generate all reading variants; use `query` in the search analyzer to generate the query-side reading.
`user_dictionary` | String | Path to a custom user dictionary file. Optional.
`user_dictionary_rules` | Array of strings | Inline custom dictionary rules. Optional.

### Example: Autocomplete with kuromoji_completion

The following example configures an index with separate index-time and search-time completion analyzers:

```json
PUT /autocomplete-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "kuromoji_index_analyzer": {
          "type": "kuromoji_completion",
          "mode": "index"
        },
        "kuromoji_search_analyzer": {
          "type": "kuromoji_completion",
          "mode": "query"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "suggest": {
        "type": "text",
        "analyzer": "kuromoji_index_analyzer",
        "search_analyzer": "kuromoji_search_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

For more details about the completion token filter, see [Kuromoji completion token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-completion/).

## Using kuromoji with ICU

For the most thorough Japanese text analysis, combine the `analysis-kuromoji` and `analysis-icu` plugins. ICU contributes Unicode normalization of full-width and half-width characters and comprehensive character folding that the Kuromoji components alone do not provide.

Both `analysis-kuromoji` and `analysis-icu` must be installed before creating an index that uses components from both plugins.
{: .note}

The following example creates a custom analyzer combining both plugins. The `icu_normalizer` character filter converts full-width characters to their ASCII equivalents before tokenization (for example, `３００` → `300`), keeping numeric sequences as single tokens. The `kuromoji_iteration_mark` character filter expands Japanese iteration marks (for example, `時々` → `時時`) so the tokenizer can look them up in the dictionary correctly:

```json
PUT /japanese-icu-index
{
  "settings": {
    "index": {
      "analysis": {
        "analyzer": {
          "japanese_icu_analyzer": {
            "char_filter": [
              "icu_normalizer",
              "kuromoji_iteration_mark"
            ],
            "tokenizer": "kuromoji_tokenizer",
            "filter": [
              "kuromoji_baseform",
              "kuromoji_part_of_speech",
              "ja_stop",
              "kuromoji_stemmer",
              "lowercase"
            ]
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the combined analyzer with a sentence containing full-width digits and a long vowel mark ("The computer processes 300 documents"):

```json
POST /japanese-icu-index/_analyze
{
  "analyzer": "japanese_icu_analyzer",
  "text": "コンピューターは３００件の文書を処理します"
}
```
{% include copy-curl.html %}

The analyzer applies the following transformations:
- `icu_normalizer` converts full-width digits before tokenization: `３００` → `300`
- `kuromoji_stemmer` removes the trailing long vowel mark: `コンピューター` → `コンピュータ`
- `kuromoji_part_of_speech` removes the particles `は`, `の`, and `を`, and the auxiliary verb `します`
- `300` is kept as a single token; `文書` and `処理` are returned in base form

The response is:

```json
{
  "tokens": [
    {
      "token": "コンピュータ",
      "start_offset": 0,
      "end_offset": 7,
      "type": "word",
      "position": 0
    },
    {
      "token": "300",
      "start_offset": 8,
      "end_offset": 11,
      "type": "word",
      "position": 2
    },
    {
      "token": "件",
      "start_offset": 11,
      "end_offset": 12,
      "type": "word",
      "position": 3
    },
    {
      "token": "文書",
      "start_offset": 13,
      "end_offset": 15,
      "type": "word",
      "position": 5
    },
    {
      "token": "処理",
      "start_offset": 16,
      "end_offset": 18,
      "type": "word",
      "position": 7
    }
  ]
}
```

## Related documentation

- [Kuromoji tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/kuromoji/)
- [Kuromoji iteration mark character filter]({{site.url}}{{site.baseurl}}/analyzers/character-filters/kuromoji-iteration-mark/)
- [Kuromoji baseform token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-baseform/)
- [Kuromoji part-of-speech token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-part-of-speech/)
- [Kuromoji reading form token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-readingform/)
- [Kuromoji stemmer token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-stemmer/)
- [Japanese stop token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/ja-stop/)
- [Kuromoji number token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-number/)
- [Kuromoji completion token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-completion/)
- [ICU analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/icu/)
- [ICU normalization character filter]({{site.url}}{{site.baseurl}}/analyzers/character-filters/icu-normalization/)
- [CJK width token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/cjk-width/)
- [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/)
