---
layout: default
title: Japanese stop
parent: Token filters
nav_order: 178
---

# Japanese stop token filter

The `ja_stop` token filter removes Japanese stop words from a token stream. It matches tokens against a word list, either the built-in Japanese stop set or a custom list that you provide. To remove tokens by grammatical category instead, use [`kuromoji_part_of_speech`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-part-of-speech/).

The filter also supports a suggest-friendly mode (`remove_trailing: false`) in which trailing stop words are preserved. This is important for autocomplete use cases where a user may be in the middle of typing a phrase that ends with a stop word or particle.

## Installation

The `ja_stop` token filter requires the `analysis-kuromoji` plugin. For installation instructions, see [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/).

## Parameters

The following table lists the parameters for the `ja_stop` token filter.

Parameter | Data type | Description
:--- | :--- | :---
`stopwords` | String or array of strings | The stop words to use. Accepts `_japanese_` for the built-in Japanese stop set, an array of explicit stop words, or a path to a file containing one stop word per line. Default is `_japanese_` (the same stop set used by the built-in `kuromoji` analyzer).
`ignore_case` | Boolean | When `true`, stop word matching is case insensitive. Default is `false`.
`remove_trailing` | Boolean | When `true` (default), a stop word at the end of the token stream is removed. When `false`, a trailing stop word is preserved, enabling prefix-match completion queries to work correctly on partially typed input.

For the full list of stop words in the built-in stop set, see [stopwords.txt](https://github.com/apache/lucene/blob/main/lucene/analysis/kuromoji/src/resources/org/apache/lucene/analysis/ja/stopwords.txt) in the Lucene repository.

## Example: Minimal usage

The following example uses `ja_stop` in isolation to show what the filter removes on its own:

```json
PUT /ja-stop-minimal-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "ja_stop_minimal_analyzer": {
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer",
          "filter": ["ja_stop"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the analyzer with the sentence `新聞を読んでいるばかりだ` ("I do nothing but read the newspaper"), which the tokenizer segments into `新聞`, `を`, `読ん`, `で`, `いる`, `ばかり`, and `だ`:

```json
POST /ja-stop-minimal-index/_analyze
{
  "analyzer": "ja_stop_minimal_analyzer",
  "text": "新聞を読んでいるばかりだ"
}
```
{% include copy-curl.html %}

The filter removes `を`, `で`, `いる`, and `だ` because they are in the `_japanese_` stop set. The inflected stem `読ん` and the adverbial particle `ばかり` are not in the stop set, so they remain unchanged alongside the content token `新聞`, because `ja_stop` does not normalize inflections or filter by grammatical category:

```json
{
  "tokens": [
    {
      "token": "新聞",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "読ん",
      "start_offset": 3,
      "end_offset": 5,
      "type": "word",
      "position": 2
    },
    {
      "token": "ばかり",
      "start_offset": 8,
      "end_offset": 11,
      "type": "word",
      "position": 5
    }
  ]
}
```

Compare this with the following [full pipeline example](#example-full-analysis-pipeline). Adding `kuromoji_baseform` normalizes `読ん` to its dictionary form `読む`. Adding `kuromoji_part_of_speech` removes the adverbial particle `ばかり`, which is not in the `_japanese_` stop word list and therefore cannot be removed by `ja_stop` alone.

## Example: Full analysis pipeline

This example uses the same sentence `新聞を読んでいるばかりだ` ("I do nothing but read the newspaper") to show how all three filters contribute distinct work when combined:

- `kuromoji_baseform` normalizes the inflected verb stem `読ん` to its dictionary form `読む`.
- `kuromoji_part_of_speech` removes the adverbial particle `ばかり`, which `ja_stop` does not handle, and the particles `を`, `で`, and `だ`, which `ja_stop` also removes.
- `ja_stop` removes the remaining `いる`, which is listed in the built-in Japanese stop set.

Create an index with an analyzer that chains all three filters:

```json
PUT /ja-stop-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "ja_stop_analyzer": {
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer",
          "filter": ["kuromoji_baseform", "kuromoji_part_of_speech", "ja_stop"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the analyzer with the same sentence:

```json
POST /ja-stop-index/_analyze
{
  "analyzer": "ja_stop_analyzer",
  "text": "新聞を読んでいるばかりだ"
}
```
{% include copy-curl.html %}

The response contains only the two content tokens with the verb in its base form:

```json
{
  "tokens": [
    {
      "token": "新聞",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "読む",
      "start_offset": 3,
      "end_offset": 5,
      "type": "word",
      "position": 2
    }
  ]
}
```

## Related documentation

- [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/)
- [Kuromoji tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/kuromoji/)
- [Kuromoji base form token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-baseform/)
- [Kuromoji part-of-speech token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-part-of-speech/)
