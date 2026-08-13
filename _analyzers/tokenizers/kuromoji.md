---
layout: default
title: Kuromoji
parent: Tokenizers
nav_order: 55
---

# Kuromoji tokenizer

The `kuromoji_tokenizer` performs dictionary-based morphological analysis for Japanese text using the Kuromoji library and the MeCab IPAdic dictionary. Unlike tokenizers that split on whitespace or punctuation, it identifies natural word boundaries in Japanese sentences, which do not use spaces to separate words.

## Installation

The `kuromoji_tokenizer` requires the `analysis-kuromoji` plugin. For installation instructions, see [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/).

## Parameters

The following table lists the parameters for the `kuromoji_tokenizer`.

Parameter | Data type | Description
:--- | :--- | :---
`mode` | String | Tokenization mode. Valid values are `normal`, `search` (default), and `extended`. See [Tokenization modes](#tokenization-modes) for details.
`discard_punctuation` | Boolean | When `true`, punctuation tokens are discarded from the output. Default is `true`.
`discard_compound_token` | Boolean | When `true`, the compound token produced in `search` mode is discarded and only the sub-tokens are kept. Default is `false`.
`user_dictionary` | String | Path to a custom user dictionary CSV file placed in the OpenSearch config directory. Each line must follow the format `surface,sub-tokens,readings,part-of-speech`. Optional.
`user_dictionary_rules` | Array of strings | Inline custom dictionary rules in the same CSV format as `user_dictionary`. Optional. Cannot be used together with `user_dictionary`.
`nbest_cost` | Integer | When set to a value greater than `-1`, enables n-best segmentation and returns alternative tokenizations whose cost (log probability penalty) is within this value of the best segmentation. Default is `-1` (disabled).
`nbest_examples` | String | A comma-separated list of example words used to automatically calculate `nbest_cost`. When provided, the tokenizer finds the minimum additional cost needed to also produce the given examples as tokens. Optional.

## Tokenization modes

The tokenization mode controls how the tokenizer handles compound and unknown words.

| Mode | Compound words | Unknown words |
|:-----|:---------------|:--------------|
| `normal` | Kept as a single token (for example, 関西国際空港 is one token). | Kept as a single token. |
| `search` (default) | Split into sub-tokens in addition to the compound form (for example, 関西国際空港 produces 関西, 国際, 空港, and 関西国際空港). Improves recall for search queries. | Kept as a single token. |
| `extended` | Kept as a single token (same as `normal`). | Split into unigrams (individual characters), ensuring every character is indexed. |

## Example: Basic tokenization

The following example creates an index with a custom analyzer using `kuromoji_tokenizer` in its default `search` mode:

```json
PUT /kuromoji-tokenizer-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "kuromoji_analyzer": {
          "tokenizer": "kuromoji_tokenizer"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the tokenizer with a sentence meaning "Kansai International Airport is a large airport":

```json
POST /kuromoji-tokenizer-index/_analyze
{
  "analyzer": "kuromoji_analyzer",
  "text": "関西国際空港は大きな空港です"
}
```
{% include copy-curl.html %}

In `search` mode, the compound place name 関西国際空港 (Kansai International Airport) is split into its components as well as kept as a compound token.

```json
{
  "tokens": [
    {
      "token": "関西",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "関西国際空港",
      "start_offset": 0,
      "end_offset": 6,
      "type": "word",
      "position": 0,
      "positionLength": 3
    },
    {
      "token": "国際",
      "start_offset": 2,
      "end_offset": 4,
      "type": "word",
      "position": 1
    },
    {
      "token": "空港",
      "start_offset": 4,
      "end_offset": 6,
      "type": "word",
      "position": 2
    },
    {
      "token": "は",
      "start_offset": 6,
      "end_offset": 7,
      "type": "word",
      "position": 3
    },
    {
      "token": "大きな",
      "start_offset": 7,
      "end_offset": 10,
      "type": "word",
      "position": 4
    },
    {
      "token": "空港",
      "start_offset": 10,
      "end_offset": 12,
      "type": "word",
      "position": 5
    },
    {
      "token": "です",
      "start_offset": 12,
      "end_offset": 14,
      "type": "word",
      "position": 6
    }
  ]
}
```

## Example: Comparing tokenization modes

The following example shows how the same text is tokenized differently depending on the mode. Create a custom tokenizer for each mode and compare the output:

```json
PUT /kuromoji-mode-comparison
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "kuromoji_normal": {
          "type": "kuromoji_tokenizer",
          "mode": "normal"
        },
        "kuromoji_search": {
          "type": "kuromoji_tokenizer",
          "mode": "search"
        },
        "kuromoji_extended": {
          "type": "kuromoji_tokenizer",
          "mode": "extended"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test with text that contains a known compound word (関西国際空港 — Kansai International Airport) and an unknown loanword (アバクロンビー — Abercrombie):

**`normal` mode**

```json
POST /kuromoji-mode-comparison/_analyze
{
  "tokenizer": "kuromoji_normal",
  "text": "関西国際空港とアバクロンビー"
}
```
{% include copy-curl.html %}

In `normal` mode, the compound 関西国際空港 is kept as a single token and the unknown loanword アバクロンビー is also kept as a single token:

```json
{
  "tokens": [
    {
      "token": "関西国際空港",
      "start_offset": 0,
      "end_offset": 6,
      "type": "word",
      "position": 0
    },
    {
      "token": "と",
      "start_offset": 6,
      "end_offset": 7,
      "type": "word",
      "position": 1
    },
    {
      "token": "アバクロンビー",
      "start_offset": 7,
      "end_offset": 14,
      "type": "word",
      "position": 2
    }
  ]
}
```

**`search` mode**

```json
POST /kuromoji-mode-comparison/_analyze
{
  "tokenizer": "kuromoji_search",
  "text": "関西国際空港とアバクロンビー"
}
```
{% include copy-curl.html %}

In `search` mode, the compound 関西国際空港 is split into sub-tokens (関西, 国際, 空港) while also being retained as a compound token with `positionLength: 3`. The unknown loanword アバクロンビー is kept as a single token, the same as in `normal` mode:

```json
{
  "tokens": [
    {
      "token": "関西",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "関西国際空港",
      "start_offset": 0,
      "end_offset": 6,
      "type": "word",
      "position": 0,
      "positionLength": 3
    },
    {
      "token": "国際",
      "start_offset": 2,
      "end_offset": 4,
      "type": "word",
      "position": 1
    },
    {
      "token": "空港",
      "start_offset": 4,
      "end_offset": 6,
      "type": "word",
      "position": 2
    },
    {
      "token": "と",
      "start_offset": 6,
      "end_offset": 7,
      "type": "word",
      "position": 3
    },
    {
      "token": "アバクロンビー",
      "start_offset": 7,
      "end_offset": 14,
      "type": "word",
      "position": 4
    }
  ]
}
```

**`extended` mode**

```json
POST /kuromoji-mode-comparison/_analyze
{
  "tokenizer": "kuromoji_extended",
  "text": "関西国際空港とアバクロンビー"
}
```
{% include copy-curl.html %}

In `extended` mode, the known compound 関西国際空港 is handled the same as in `search` mode. The unknown loanword アバクロンビー is split into individual characters (unigrams), ensuring every character is indexed:

```json
{
  "tokens": [
    {
      "token": "関西",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "関西国際空港",
      "start_offset": 0,
      "end_offset": 6,
      "type": "word",
      "position": 0,
      "positionLength": 3
    },
    {
      "token": "国際",
      "start_offset": 2,
      "end_offset": 4,
      "type": "word",
      "position": 1
    },
    {
      "token": "空港",
      "start_offset": 4,
      "end_offset": 6,
      "type": "word",
      "position": 2
    },
    {
      "token": "と",
      "start_offset": 6,
      "end_offset": 7,
      "type": "word",
      "position": 3
    },
    {
      "token": "ア",
      "start_offset": 7,
      "end_offset": 8,
      "type": "word",
      "position": 4
    },
    {
      "token": "バ",
      "start_offset": 8,
      "end_offset": 9,
      "type": "word",
      "position": 5
    },
    {
      "token": "ク",
      "start_offset": 9,
      "end_offset": 10,
      "type": "word",
      "position": 6
    },
    {
      "token": "ロ",
      "start_offset": 10,
      "end_offset": 11,
      "type": "word",
      "position": 7
    },
    {
      "token": "ン",
      "start_offset": 11,
      "end_offset": 12,
      "type": "word",
      "position": 8
    },
    {
      "token": "ビ",
      "start_offset": 12,
      "end_offset": 13,
      "type": "word",
      "position": 9
    },
    {
      "token": "ー",
      "start_offset": 13,
      "end_offset": 14,
      "type": "word",
      "position": 10
    }
  ]
}
```

## Example: User dictionary

You can add custom compound terms to the tokenizer's dictionary to control how they are split into sub-tokens. Use `user_dictionary_rules` for inline rules or `user_dictionary` for a file.

The following example registers 東京スカイツリー (Tokyo Skytree) as a single noun:

```json
PUT /kuromoji-user-dict-index
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "kuromoji_with_user_dict": {
          "type": "kuromoji_tokenizer",
          "mode": "search",
          "user_dictionary_rules": [
            "東京スカイツリー,東京 スカイツリー,トウキョウ スカイツリー,カスタム名詞"
          ]
        }
      },
      "analyzer": {
        "user_dict_analyzer": {
          "tokenizer": "kuromoji_with_user_dict"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Each `user_dictionary_rules` entry is a CSV string with the following four comma-separated fields (`surface,sub-tokens,readings,part-of-speech`):

- **surface** — The text as it appears in the document (for example, `東京スカイツリー`).
- **sub-tokens** — Space-separated sub-tokens for segmentation (for example, `東京 スカイツリー`).
- **readings** — Space-separated Katakana readings for each sub-token (for example, `トウキョウ スカイツリー`).
- **part-of-speech** — IPAdic part-of-speech tag assigned to the term (for example, `カスタム名詞`).

Use the analyzer to test the user dictionary entry:

```json
POST /kuromoji-user-dict-index/_analyze
{
  "analyzer": "user_dict_analyzer",
  "text": "東京スカイツリーに登る"
}
```
{% include copy-curl.html %}

The user dictionary controls how the surface form is segmented. Because the rule defines `東京 スカイツリー` as two sub-tokens, the tokenizer emits 東京 and スカイツリー as separate tokens rather than keeping 東京スカイツリー as a single token:

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
      "token": "スカイツリー",
      "start_offset": 2,
      "end_offset": 8,
      "type": "word",
      "position": 1
    },
    {
      "token": "に",
      "start_offset": 8,
      "end_offset": 9,
      "type": "word",
      "position": 2
    },
    {
      "token": "登る",
      "start_offset": 9,
      "end_offset": 11,
      "type": "word",
      "position": 3
    }
  ]
}
```

To keep 東京スカイツリー as a single unsplit token, define it as a single sub-token in the rule:

```json
"東京スカイツリー,東京スカイツリー,トウキョウスカイツリー,カスタム名詞"
```

## Related documentation

- [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/)
- [Kuromoji part-of-speech token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-part-of-speech/)
