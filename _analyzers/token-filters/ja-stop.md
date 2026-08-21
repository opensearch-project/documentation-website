---
layout: default
title: Japanese stop
parent: Token filters
nav_order: 178
---

# Japanese stop token filter

The `ja_stop` token filter removes Japanese stop words from a token stream. It is a word-based stop filter (as opposed to `kuromoji_part_of_speech`, which filters by grammatical category) and can be configured with a custom stop word list or the built-in Japanese stop set.

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

The following example uses `ja_stop` in isolation to show what the filter removes on its own. The sentence `大切なことを学んだ` ("I learned something important") produces the tokens `大切`, `だ`, `こと`, `を`, `学ん`, `だ`. Of these, `だ`, `こと`, and `を` are in the `_japanese_` stop set and are removed. The inflected verb stem `学ん` is not a stop word and is kept as-is, because `ja_stop` does not normalise inflections:

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

```json
POST /ja-stop-minimal-index/_analyze
{
  "analyzer": "ja_stop_minimal_analyzer",
  "text": "大切なことを学んだ"
}
```
{% include copy-curl.html %}

The response retains `大切` and the inflected stem `学ん`:

```json
{
  "tokens": [
    {
      "token": "大切",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "学ん",
      "start_offset": 5,
      "end_offset": 7,
      "type": "word",
      "position": 4
    }
  ]
}
```

Compare this with the following [full pipeline example](#example-usage-with-kuromoji_baseform-and-kuromoji_part_of_speech), which uses the same input. Adding `kuromoji_baseform` normalises `学ん` to `学ぶ`, and `kuromoji_part_of_speech` removes `を` and `だ` as grammatical tokens — leaving `ja_stop` to handle `こと`, a common noun that part-of-speech filtering alone would not remove.

## Example: Usage with kuromoji_baseform and kuromoji_part_of_speech

This example uses the same sentence `大切なことを学んだ` ("I learned something important") to show how all three filters contribute when combined:

- **`kuromoji_baseform`** normalises the inflected verb stem `学ん` to its dictionary form `学ぶ`.
- **`kuromoji_part_of_speech`** removes the grammatical tokens `を` (object particle) and `だ` (auxiliary verb).
- **`ja_stop`** removes `こと`, a common noun that survives part-of-speech filtering but appears in the `_japanese_` stop set.

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

```json
POST /ja-stop-index/_analyze
{
  "analyzer": "ja_stop_analyzer",
  "text": "大切なことを学んだ"
}
```
{% include copy-curl.html %}

The response contains only the two content tokens with the verb in its base form:

```json
{
  "tokens": [
    {
      "token": "大切",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "学ぶ",
      "start_offset": 5,
      "end_offset": 7,
      "type": "word",
      "position": 4
    }
  ]
}
```

## Related documentation

- [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/)
- [Kuromoji tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/kuromoji/)
- [Kuromoji baseform token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-baseform/)
- [Kuromoji part-of-speech token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-part-of-speech/)
