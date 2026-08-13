---
layout: default
title: Kuromoji part of speech
parent: Token filters
nav_order: 233
---

# Kuromoji part-of-speech token filter

The `kuromoji_part_of_speech` token filter removes tokens whose part-of-speech (POS) tag matches an entry in a configured list of stop tags. The Kuromoji tokenizer assigns each token an IPAdic POS tag. This filter reads that tag and discards tokens that serve a grammatical function (such as particles, auxiliary verbs, and punctuation) rather than a content function.

## Installation

The `kuromoji_part_of_speech` token filter requires the `analysis-kuromoji` plugin. For installation instructions, see [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/).

## Parameters

The following table lists the parameters for the `kuromoji_part_of_speech` token filter.

Parameter | Data type | Description
:--- | :--- | :---
`stoptags` | Array of strings | A list of IPAdic part-of-speech tags to remove. Tokens whose POS tag starts with any entry in this list are discarded. Defaults to the built-in Japanese stoptag set.

For the full list of available stoptags, see [stoptags.txt](https://github.com/apache/lucene/blob/main/lucene/analysis/kuromoji/src/resources/org/apache/lucene/analysis/ja/stoptags.txt) in the Lucene source.

IPAdic tags use a hierarchical structure separated by hyphens. An entry of `助詞` matches all particles, while `助詞-格助詞` matches only case particles. Entries in `stoptags` are treated as prefix matches against the full POS tag.
{: .note}

## Example: Default filter

The following example creates an index with an analyzer that uses the default stoptag list:

```json
PUT /kuromoji-pos-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "pos_filter_analyzer": {
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer",
          "filter": ["kuromoji_part_of_speech"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the analyzer with a sentence meaning "I eat sushi at the Tokyo restaurant":

```json
POST /kuromoji-pos-index/_analyze
{
  "analyzer": "pos_filter_analyzer",
  "text": "東京のレストランで寿司を食べる"
}
```
{% include copy-curl.html %}

The response shows the particles の (の, genitive), で (location marker), and を (object marker) removed:

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
      "token": "レストラン",
      "start_offset": 3,
      "end_offset": 8,
      "type": "word",
      "position": 2
    },
    {
      "token": "寿司",
      "start_offset": 9,
      "end_offset": 11,
      "type": "word",
      "position": 4
    },
    {
      "token": "食べる",
      "start_offset": 12,
      "end_offset": 15,
      "type": "word",
      "position": 6
    }
  ]
}
```

## Example: Custom stop tags

The following example creates a filter that removes only auxiliary verbs (助動詞) while keeping all other grammatical tokens:

```json
PUT /kuromoji-custom-pos-index
{
  "settings": {
    "analysis": {
      "filter": {
        "auxiliary_verb_filter": {
          "type": "kuromoji_part_of_speech",
          "stoptags": ["助動詞"]
        }
      },
      "analyzer": {
        "auxiliary_filter_analyzer": {
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer",
          "filter": ["auxiliary_verb_filter"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Related documentation

- [Kuromoji analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/kuromoji/)
- [Kuromoji tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/kuromoji/)
- [Kuromoji baseform token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/kuromoji-baseform/)
- [Japanese stop token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/ja-stop/)
