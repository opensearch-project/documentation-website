---
layout: default
title: Kuromoji base form
parent: Token filters
nav_order: 230
---

# Kuromoji base form token filter

The `kuromoji_baseform` token filter replaces inflected Japanese tokens with their dictionary base form, acting as a lemmatizer.

The filter applies to tokens that carry dictionary form information from the Kuromoji tokenizer. Tokens without dictionary information (such as unknown words) are passed through unchanged.

Note that the Kuromoji tokenizer splits some conjugated forms into multiple tokens before this filter runs. For example, the past-tense *i*-adjective 美しかった (was beautiful) is split into 美しかっ and た. The filter normalizes 美しかっ to 美しい, but た remains as a separate token. To remove auxiliary verb tokens such as た, add [`kuromoji_part_of_speech`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-part-of-speech/) and [`ja_stop`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/ja-stop/) to the filter chain.

## Installation

The `kuromoji_baseform` token filter requires the `analysis-kuromoji` plugin. For installation instructions, see [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/).

## Parameters

The `kuromoji_baseform` token filter has no configurable parameters.

## Example

The following example creates an index with a custom analyzer that uses `kuromoji_baseform`:

```json
PUT /kuromoji-baseform-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "baseform_analyzer": {
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer",
          "filter": ["kuromoji_baseform"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the analyzer with a sentence that includes conjugated verbs (meaning "I ate sushi and drank tea"):

```json
POST /kuromoji-baseform-index/_analyze
{
  "analyzer": "baseform_analyzer",
  "text": "寿司を食べてお茶を飲んだ"
}
```
{% include copy-curl.html %}

The response shows the conjugated verbs normalized to their base forms. The particles を and auxiliary verbs て and だ are retained because this analyzer uses only `kuromoji_baseform`:

```json
{
  "tokens": [
    {
      "token": "寿司",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "を",
      "start_offset": 2,
      "end_offset": 3,
      "type": "word",
      "position": 1
    },
    {
      "token": "食べる",
      "start_offset": 3,
      "end_offset": 5,
      "type": "word",
      "position": 2
    },
    {
      "token": "て",
      "start_offset": 5,
      "end_offset": 6,
      "type": "word",
      "position": 3
    },
    {
      "token": "お茶",
      "start_offset": 6,
      "end_offset": 8,
      "type": "word",
      "position": 4
    },
    {
      "token": "を",
      "start_offset": 8,
      "end_offset": 9,
      "type": "word",
      "position": 5
    },
    {
      "token": "飲む",
      "start_offset": 9,
      "end_offset": 11,
      "type": "word",
      "position": 6
    },
    {
      "token": "だ",
      "start_offset": 11,
      "end_offset": 12,
      "type": "word",
      "position": 7
    }
  ]
}
```

The te-form 食べて and past-tense form 飲んだ are replaced with their base forms 食べる and 飲む. The particles を, て, and auxiliary verb だ remain in the token stream because `kuromoji_baseform` only normalizes inflection; it does not remove grammatical tokens.

## Example: Combining with part-of-speech and stop filters

To also remove particles and auxiliary verbs, add `kuromoji_part_of_speech` and `ja_stop` to the filter chain. The following example creates an index with a combined analyzer:

```json
PUT /kuromoji-baseform-full-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "baseform_full_analyzer": {
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

Run the same sentence through the combined analyzer:

```json
POST /kuromoji-baseform-full-index/_analyze
{
  "analyzer": "baseform_full_analyzer",
  "text": "寿司を食べてお茶を飲んだ"
}
```
{% include copy-curl.html %}

The response shows only the content words. The particles を, て, and the auxiliary verb だ are removed, and position gaps mark where they were:

```json
{
  "tokens": [
    {
      "token": "寿司",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": "食べる",
      "start_offset": 3,
      "end_offset": 5,
      "type": "word",
      "position": 2
    },
    {
      "token": "お茶",
      "start_offset": 6,
      "end_offset": 8,
      "type": "word",
      "position": 4
    },
    {
      "token": "飲む",
      "start_offset": 9,
      "end_offset": 11,
      "type": "word",
      "position": 6
    }
  ]
}
```

## Related documentation

- [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/)
- [Kuromoji tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/kuromoji/)
- [Kuromoji part-of-speech token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-part-of-speech/)
- [Japanese stop token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/ja-stop/)
