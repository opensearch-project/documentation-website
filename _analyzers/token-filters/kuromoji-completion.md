---
layout: default
title: Kuromoji completion
parent: Token filters
nav_order: 230
---

# Kuromoji completion token filter

The `kuromoji_completion` token filter is used to stem Katakana words in Japanese, which are often used to represent foreign words or loanwords. This filter is especially useful for autocompletion or suggest queries, in which partial matches on Katakana words can be expanded to include their full forms.

To use this token filter, you must first install the `analysis-kuromoji` plugin on all nodes by running `bin/opensearch-plugin install analysis-kuromoji` and then restart the cluster. For more information about installing additional plugins, see [Additional plugins]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/index/).

## Example

The following example request creates a new index named `kuromoji_sample` and configures an analyzer with a `kuromoji_completion` filter:

```json
PUT kuromoji_sample
{
  "settings": {
    "index": {
      "analysis": {
        "analyzer": {
          "my_analyzer": {
            "tokenizer": "kuromoji_tokenizer",
            "filter": [
              "my_katakana_stemmer"
            ]
          }
        },
        "filter": {
          "my_katakana_stemmer": {
            "type": "kuromoji_completion"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer with text that translates to "use a computer":

```json
POST /kuromoji_sample/_analyze
{
  "analyzer": "my_analyzer",
  "text": "コンピューターを使う"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "コンピューター", // The original Katakana word "computer".
      "start_offset": 0,
      "end_offset": 7,
      "type": "word",
      "position": 0
    },
    {
      "token": "konpyuーtaー", // Romanized version (Romaji) of "コンピューター".
      "start_offset": 0,
      "end_offset": 7,
      "type": "word",
      "position": 0
    },
    {
      "token": "konnpyuーtaー", // Another possible romanized version of "コンピューター" (with a slight variation in the spelling).
      "start_offset": 0,
      "end_offset": 7,
      "type": "word",
      "position": 0
    },
    {
      "token": "を", // A Japanese particle, "wo" or "o"
      "start_offset": 7,
      "end_offset": 8,
      "type": "word",
      "position": 1
    },
    {
      "token": "wo", // Romanized form of the particle "を" (often pronounced as "o").
      "start_offset": 7,
      "end_offset": 8,
      "type": "word",
      "position": 1
    },
    {
      "token": "o", // Another version of the romanization.
      "start_offset": 7,
      "end_offset": 8,
      "type": "word",
      "position": 1
    },
    {
      "token": "使う", // The verb "use" in Kanji.
      "start_offset": 8,
      "end_offset": 10,
      "type": "word",
      "position": 2
    },
    {
      "token": "tukau", // Romanized version of "使う"
      "start_offset": 8,
      "end_offset": 10,
      "type": "word",
      "position": 2
    },
    {
      "token": "tsukau", // Another romanized version of "使う", where "tsu" is more phonetically correct
      "start_offset": 8,
      "end_offset": 10,
      "type": "word",
      "position": 2
    }
  ]
}
```