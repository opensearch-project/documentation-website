---
layout: default
title: Normalizers
nav_order: 110
canonical_url: https://docs.opensearch.org/docs/latest/analyzers/normalizers/
---

# Normalizers

A _normalizer_ functions similarly to an analyzer but outputs only a single token. It does not contain a tokenizer and can only include specific types of character and token filters. These filters can perform only character-level operations, such as character or pattern replacement, and cannot operate on the token as a whole. This means that replacing a token with a synonym or stemming is not supported.

A normalizer is useful in keyword search (that is, in term-based queries) because it allows you to run token and character filters on any given input. For instance, it makes it possible to match an incoming query `Naïve` with the index term `naive`.

Consider the following example.

Create a new index with a custom normalizer:
```json
PUT /sample-index
{
  "settings": {
    "analysis": {
      "normalizer": {
        "normalized_keyword": {
          "type": "custom",
          "char_filter": [],
          "filter": [ "asciifolding", "lowercase" ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "approach": {
        "type": "keyword",
        "normalizer": "normalized_keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document:
```json
POST /sample-index/_doc/
{
  "approach": "naive"
}
```
{% include copy-curl.html %}

The following query matches the document. This is expected:
```json
GET /sample-index/_search
{
  "query": {
    "term": {
      "approach": "naive"
    }
  }
}
```
{% include copy-curl.html %}

But this query matches the document as well:
```json
GET /sample-index/_search
{
  "query": {
    "term": {
      "approach": "Naïve"
    }
  }
}
```
{% include copy-curl.html %}

To understand why, consider the effect of the normalizer:
```json
GET /sample-index/_analyze
{
  "normalizer" : "normalized_keyword",
  "text" : "Naïve"
}
```

Internally, a normalizer accepts only filters that are instances of either `NormalizingTokenFilterFactory` or `NormalizingCharFilterFactory`. The following is a list of compatible filters found in modules and plugins that are part of the core OpenSearch repository.

### The `common-analysis` module

This module does not require installation; it is available by default.

Character filters: `pattern_replace`, `mapping`

Token filters: `arabic_normalization`, `asciifolding`, `bengali_normalization`, `cjk_width`, `decimal_digit`, `elision`, `german_normalization`, `hindi_normalization`, `indic_normalization`, `lowercase`, `persian_normalization`, `scandinavian_folding`, `scandinavian_normalization`, `serbian_normalization`, `sorani_normalization`, `trim`, `uppercase`

### The `analysis-icu` plugin

Character filters: `icu_normalizer`

Token filters: `icu_normalizer`, `icu_folding`, `icu_transform`

### The `analysis-kuromoji` plugin

Character filters: `normalize_kanji`, `normalize_kana`

### The `analysis-nori` plugin

Character filters: `normalize_kanji`, `normalize_kana`

These lists of filters include only analysis components found in the [additional plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#additional-plugins) that are part of the core OpenSearch repository.
{: .note}