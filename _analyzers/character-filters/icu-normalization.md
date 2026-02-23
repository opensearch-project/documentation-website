---
layout: default
title: ICU normalization
parent: Character filters
nav_order: 110
---

# ICU normalization character filter

The `icu_normalizer` character filter converts text into a canonical Unicode form by applying one of the normalization modes defined in [Unicode Standard Annex #15](http://unicode.org/reports/tr15/). This process standardizes character representations before tokenization, ensuring that equivalent characters are treated consistently.

## Installation

The `icu_normalizer` character filter requires the `analysis-icu` plugin. For installation instructions, see [ICU analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/icu/).

## Normalization modes

The character filter supports the following Unicode normalization forms:

- `nfc` (Canonical Decomposition, followed by Canonical Composition): Decomposes combined characters, then recomposes them in a standard order. This is the most common normalization form.
- `nfd` (Canonical Decomposition): Decomposes combined characters into their constituent parts. For example, `é` becomes `e` + combining acute accent.
- `nfkc` (Compatibility Decomposition, followed by Canonical Composition): Applies compatibility decompositions (converting visually similar characters to a standard form), then canonical composition.
- `nfkc_cf` (Default): Applies NFKC normalization with case folding. This mode normalizes both character representations and case.

## Parameters

The following table lists the parameters for the `icu_normalizer` character filter.

Parameter | Data type | Description
:--- | :--- | :---
`name` | String | The Unicode normalization form to apply. Valid values are `nfc`, `nfd`, `nfkc`, and `nfkc_cf`. Default is `nfkc_cf`.
`mode` | String | The normalization mode. Valid values are `compose` (default) and `decompose`. When `decompose` is specified, `nfc` becomes `nfd` and `nfkc` becomes `nfkd`.
`unicode_set_filter` | String | A [UnicodeSet](https://unicode-org.github.io/icu/userguide/strings/unicodeset.html) expression that specifies which characters to normalize. Optional. If not specified, all characters are normalized.

## Example: Default normalization

The following example demonstrates using the default `nfkc_cf` normalization:

```json
PUT /icu-norm-default
{
  "settings": {
    "analysis": {
      "analyzer": {
        "default_icu_normalizer": {
          "tokenizer": "keyword",
          "char_filter": ["icu_normalizer"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the normalizer with text containing ligatures and case variations:

```json
POST /icu-norm-default/_analyze
{
  "analyzer": "default_icu_normalizer",
  "text": "ﬁnancial AFFAIRS"
}
```
{% include copy-curl.html %}

The response shows normalization and case folding:

```json
{
  "tokens": [
    {
      "token": "financial affairs",
      "start_offset": 0,
      "end_offset": 16,
      "type": "word",
      "position": 0
    }
  ]
}
```

## Example: NFD (decomposed) normalization

The following example configures NFD normalization by setting `mode` to `decompose`:

```json
PUT /icu-norm-nfd
{
  "settings": {
    "analysis": {
      "char_filter": {
        "nfd_normalizer": {
          "type": "icu_normalizer",
          "name": "nfc",
          "mode": "decompose"
        }
      },
      "analyzer": {
        "nfd_analyzer": {
          "tokenizer": "keyword",
          "char_filter": ["nfd_normalizer"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test with accented characters:

```json
POST /icu-norm-nfd/_analyze
{
  "analyzer": "nfd_analyzer",
  "text": "café"
}
```
{% include copy-curl.html %}

The NFD normalization decomposes the accented character:

```json
{
  "tokens": [
    {
      "token": "café",
      "start_offset": 0,
      "end_offset": 4,
      "type": "word",
      "position": 0
    }
  ]
}
```

Note: While the visual representation appears the same, the underlying character encoding has changed from a single precomposed character to separate base and combining characters.
{: .note}

## Example: Selective normalization with unicode_set_filter

You can limit normalization to specific character ranges using the `unicode_set_filter` parameter:

```json
PUT /icu-norm-selective
{
  "settings": {
    "analysis": {
      "char_filter": {
        "latin_only_normalizer": {
          "type": "icu_normalizer",
          "name": "nfkc_cf",
          "unicode_set_filter": "[\\u0000-\\u024F]"
        }
      },
      "analyzer": {
        "selective_normalizer": {
          "tokenizer": "keyword",
          "char_filter": ["latin_only_normalizer"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

This configuration normalizes only Latin characters (Unicode range U+0000 to U+024F), leaving other scripts unchanged.

## Related documentation

- [ICU analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/icu/)
- [ICU tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/icu-tokenizer/)
- [ICU folding token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/icu-folding/)