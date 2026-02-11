---
layout: default
title: Normalization
parent: Token filters
nav_order: 300
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/normalization/
---

# Normalization token filter

The `normalization` token filter is designed to adjust and simplify text in a way that reduces variations, particularly variations in special characters. It is primarily used to handle variations in writing by standardizing characters in specific languages.

The following `normalization` token filters are available:

- [arabic_normalization](https://lucene.apache.org/core/8_7_0/analyzers-common/org/apache/lucene/analysis/ar/ArabicNormalizer.html)
- [german_normalization](https://lucene.apache.org/core/8_7_0/analyzers-common/org/apache/lucene/analysis/de/GermanNormalizationFilter.html)
- [hindi_normalization](https://lucene.apache.org/core/8_7_0/analyzers-common/org/apache/lucene/analysis/hi/HindiNormalizer.html)
- [indic_normalization](https://lucene.apache.org/core/8_7_0/analyzers-common/org/apache/lucene/analysis/in/IndicNormalizer.html)
- [sorani_normalization](https://lucene.apache.org/core/8_7_0/analyzers-common/org/apache/lucene/analysis/ckb/SoraniNormalizer.html)
- [persian_normalization](https://lucene.apache.org/core/8_7_0/analyzers-common/org/apache/lucene/analysis/fa/PersianNormalizer.html)
- [scandinavian_normalization](https://lucene.apache.org/core/8_7_0/analyzers-common/org/apache/lucene/analysis/miscellaneous/ScandinavianNormalizationFilter.html)
- [scandinavian_folding](https://lucene.apache.org/core/8_7_0/analyzers-common/org/apache/lucene/analysis/miscellaneous/ScandinavianFoldingFilter.html)
- [serbian_normalization](https://lucene.apache.org/core/8_7_0/analyzers-common/org/apache/lucene/analysis/sr/SerbianNormalizationFilter.html)


## Example

The following example request creates a new index named `german_normalizer_example` and configures an analyzer with a `german_normalization` filter:

```json
PUT /german_normalizer_example
{
  "settings": {
    "analysis": {
      "filter": {
        "german_normalizer": {
          "type": "german_normalization"
        }
      },
      "analyzer": {
        "german_normalizer_analyzer": {
          "tokenizer": "standard",
          "filter": [
            "lowercase", 
            "german_normalizer"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /german_normalizer_example/_analyze
{
  "text": "Straße München",
  "analyzer": "german_normalizer_analyzer"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "strasse",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "munchen",
      "start_offset": 7,
      "end_offset": 14,
      "type": "<ALPHANUM>",
      "position": 1
    }
  ]
}
```
