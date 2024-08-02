---
layout: default
title: CJK width
parent: Token filters
nav_order: 140
---

# CJK width token filter

The CJK Width token filter in OpenSearch normalizes Chinese, Japanese, and Korean (CJK) tokens by converting full-width ASCII Character to their standard (half-width) ASCII equivalents and half-width Katakana characters to their full-width.

 - __Converting full-width ASCII Character__: In CJK texts, ASCII characters (such as letters and numbers) can appear in full-width form, which occupies the space of two half-width characters. Full-width ASCII characters are typically used in East Asian typography to align with the width of CJK characters. However, for the purpose of indexing and searching, these full-width characters need to be normalized to their standard (half-width) ASCII equivalents.

    See following example:

        Full-Width: ＡＢＣＤＥ １２３４５
        Normalized: (Half-Width): ABCDE 12345

 - __Converting half-width Katakana characters__: The CJK Width token filter converts half-width Katakana characters to their full-width counterparts, which are the standard form used in Japanese text. This normalization is important for consistency in text processing and searching.

    See following example:

        Half-Width "Katakana": ｶﾀｶﾅ
        Normalized (Full-Width "Katakana"): カタカナ



## Example

Following is an example of how you can define an analyzer with the `cjk_bigram_filter` filter with `ignore_scripts` set to `deva`:

```json
PUT /cjk_width_example_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "cjk_width_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["cjk_width"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

You can use the following command to examine the tokens being generated using the created analyzer:

```json
POST /cjk_width_example_index/_analyze
{
  "analyzer": "cjk_width_analyzer",
  "text": "Ｔｏｋｙｏ 2024 ｶﾀｶﾅ"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "Tokyo",
      "start_offset": 0,
      "end_offset": 5,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "2024",
      "start_offset": 6,
      "end_offset": 10,
      "type": "<NUM>",
      "position": 1
    },
    {
      "token": "カタカナ",
      "start_offset": 11,
      "end_offset": 15,
      "type": "<KATAKANA>",
      "position": 2
    }
  ]
}
```

