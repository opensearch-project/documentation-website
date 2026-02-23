---
layout: default
title: ICU folding
parent: Token filters
nav_order: 172
---

# ICU folding token filter

The `icu_folding` token filter applies Unicode normalization and case folding to tokens, converting them to a form suitable for case-insensitive matching. This filter provides more comprehensive character folding than the ASCII folding filter, handling characters from all Unicode scripts.

The filter implements case folding as defined in [Unicode Technical Report #30](https://www.unicode.org/reports/tr30/), which includes:
- Converting uppercase letters to lowercase
- Removing diacritical marks (accents)
- Converting ligatures to their component letters
- Normalizing character width (for example, full-width to half-width)
- Converting certain punctuation and symbols to ASCII equivalents

## Installation

The `icu_folding` token filter requires the `analysis-icu` plugin. For installation instructions, see [ICU analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/icu/).

## Parameters

The following table lists the parameters for the `icu_folding` token filter.

Parameter | Data type | Description
:--- | :--- | :---
`unicode_set_filter` | String | A [UnicodeSet](https://unicode-org.github.io/icu/userguide/strings/unicodeset.html) expression specifying which characters to fold. Characters outside this set are passed through unchanged. Optional. If not specified, all characters are folded.

## Example: Basic ICU folding

The following example demonstrates the default `icu_folding` behavior:

```json
PUT /icu-folding-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "icu_folding_analyzer": {
          "tokenizer": "icu_tokenizer",
          "filter": ["icu_folding"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the analyzer with text containing diacritics, ligatures, and mixed case:

```json
POST /icu-folding-index/_analyze
{
  "analyzer": "icu_folding_analyzer",
  "text": "Café RÉSUMÉ Æsop"
}
```
{% include copy-curl.html %}

The response shows normalization and folding:

```json
{
  "tokens": [
    {
      "token": "cafe",
      "start_offset": 0,
      "end_offset": 4,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "resume",
      "start_offset": 5,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "aesop",
      "start_offset": 12,
      "end_offset": 16,
      "type": "<ALPHANUM>",
      "position": 2
    }
  ]
}
```

## Normalization included

The `icu_folding` filter already performs Unicode normalization, so you don't need to add a separate normalization character filter or token filter when using `icu_folding`.
{: .note}

## Example: Preserving specific characters

You can preserve specific characters from folding using the `unicode_set_filter` parameter. The following example preserves German umlauts and the Eszett character:

```json
PUT /icu-folding-german
{
  "settings": {
    "analysis": {
      "filter": {
        "german_folding": {
          "type": "icu_folding",
          "unicode_set_filter": "[^äöüÄÖÜß]"
        }
      },
      "analyzer": {
        "german_analyzer": {
          "tokenizer": "icu_tokenizer",
          "filter": ["german_folding", "lowercase"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The `unicode_set_filter` value `[^äöüÄÖÜß]` means "fold all characters except these German characters." The `lowercase` filter is added afterward to handle the preserved uppercase characters.

Test the analyzer:

```json
POST /icu-folding-german/_analyze
{
  "analyzer": "german_analyzer",
  "text": "MÜNCHEN Café Größe"
}
```
{% include copy-curl.html %}

The response preserves German characters while folding others:

```json
{
  "tokens": [
    {
      "token": "münchen",
      "start_offset": 0,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "cafe",
      "start_offset": 8,
      "end_offset": 12,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "größe",
      "start_offset": 13,
      "end_offset": 18,
      "type": "<ALPHANUM>",
      "position": 2
    }
  ]
}
```

## Comparison with ASCII folding

While the `asciifolding` token filter converts non-ASCII characters to ASCII equivalents, `icu_folding` provides more sophisticated normalization:

- **Broader character support**: Handles all Unicode scripts, not just Latin-based characters
- **Language-aware**: Applies normalization rules appropriate for different writing systems
- **Width normalization**: Converts full-width characters to half-width (important for CJK text)
- **Ligature handling**: Properly decomposes ligatures across all scripts

## Related documentation

- [ICU analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/icu/)
- [ICU tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/icu-tokenizer/)
- [ICU normalization character filter]({{site.url}}{{site.baseurl}}/analyzers/character-filters/icu-normalization/)
- [ASCII folding token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/asciifolding/)
