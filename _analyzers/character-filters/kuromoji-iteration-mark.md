---
layout: default
title: Kuromoji iteration mark
parent: Character filters
nav_order: 115
---

# Kuromoji iteration mark character filter

The `kuromoji_iteration_mark` character filter normalizes Japanese horizontal iteration marks (odoriji) by replacing each mark with the character it repeats. Japanese writing uses iteration marks as shorthand for a repeated character:

- 々 (kanji iteration mark) -- Repeats the preceding kanji character without change, so 佐々木 becomes 佐佐木.
- ゝ (hiragana iteration mark) -- Repeats the preceding hiragana character without change, so かゝ becomes かか.
- ゞ (hiragana voiced iteration mark) -- Repeats the preceding hiragana character and applies voicing (dakuten). The preceding character must be unvoiced, so みすゞ becomes みすず, in which す is voiced to ず.
- ヽ (katakana iteration mark) -- Repeats the preceding katakana character without change, so コヽア becomes ココア.
- ヾ (katakana voiced iteration mark) -- Repeats the preceding katakana character and applies voicing (dakuten). The preceding character must be unvoiced, so カヾ becomes カガ.

Expanding these marks before tokenization ensures that the resulting tokens are consistent regardless of whether the original text used iteration marks or spelled out the repeated characters.

## Installation

The `kuromoji_iteration_mark` character filter requires the `analysis-kuromoji` plugin. For installation instructions, see [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/).

## Parameters

The following table lists the parameters for the `kuromoji_iteration_mark` character filter.

Parameter | Data type | Description
:--- | :--- | :---
`normalize_kanji` | Boolean | When `true`, kanji iteration marks (々) are normalized. Default is `true`.
`normalize_kana` | Boolean | When `true`, kana iteration marks (ゞ, ヾ, ゝ, and ヽ) are normalized. Default is `true`.

## Example

The following example creates an index with a custom analyzer that uses the `kuromoji_iteration_mark` character filter:

```json
PUT /iteration-mark-index
{
  "settings": {
    "analysis": {
      "char_filter": {
        "iteration_mark_filter": {
          "type": "kuromoji_iteration_mark",
          "normalize_kanji": true,
          "normalize_kana": true
        }
      },
      "analyzer": {
        "iteration_mark_analyzer": {
          "type": "custom",
          "char_filter": ["iteration_mark_filter"],
          "tokenizer": "kuromoji_tokenizer"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the analyzer with text containing the kanji iteration mark. The name 佐々木 (Sasaki) uses 々 to repeat the preceding kanji 佐:

```json
POST /iteration-mark-index/_analyze
{
  "analyzer": "iteration_mark_analyzer",
  "text": "佐々木さんは元気です"
}
```
{% include copy-curl.html %}

The character filter expands 佐々木 to 佐佐木 before tokenization:

```json
{
  "tokens": [
    {
      "token": "佐佐木",
      "start_offset": 0,
      "end_offset": 3,
      "type": "word",
      "position": 0
    },
    {
      "token": "さん",
      "start_offset": 3,
      "end_offset": 5,
      "type": "word",
      "position": 1
    },
    {
      "token": "は",
      "start_offset": 5,
      "end_offset": 6,
      "type": "word",
      "position": 2
    },
    {
      "token": "元気",
      "start_offset": 6,
      "end_offset": 8,
      "type": "word",
      "position": 3
    },
    {
      "token": "です",
      "start_offset": 8,
      "end_offset": 10,
      "type": "word",
      "position": 4
    }
  ]
}
```

## Related documentation

- [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/)
- [Kuromoji tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/kuromoji/)
