---
layout: default
title: ICU transform
parent: Token filters
nav_order: 175
---

# ICU transform token filter

The `icu_transform` token filter applies ICU text transformations to tokens, enabling operations such as transliteration, case mapping, normalization, and bidirectional text handling. This filter uses transformation rules defined by the [ICU Transform](https://unicode-org.github.io/icu/userguide/transforms/general/) framework.

Common use cases include:
- **Transliteration**: Converting text from one script to another (for example, Cyrillic to Latin)
- **Script conversion**: Transforming between different writing systems
- **Accent removal**: Separating base characters from diacritics
- **Custom transformations**: Applying user-defined transformation rules

## Installation

The `icu_transform` token filter requires the `analysis-icu` plugin. For installation instructions, see [ICU analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/icu/).

## Parameters

The following table lists the parameters for the `icu_transform` token filter.

Parameter | Data type | Description
:--- | :--- | :---
`id` | String | The ICU transform ID specifying which transformation to apply. Can be a single transform ID or a compound ID with multiple transforms separated by semicolons. Default is `Null` (no transformation).
`dir` | String | The text direction for the transformation. Valid values are `forward` (default, left-to-right) and `reverse` (right-to-left). Default is `forward`.

## Transform IDs

You can specify transformations using standard ICU transform IDs. Common transforms include:

- `Any-Latin`: Transliterates text from any script to Latin characters
- `Latin-Cyrillic`: Converts Latin text to Cyrillic
- `NFD; [:Nonspacing Mark:] Remove; NFC`: Decomposes characters, removes diacritics, then recomposes
- `Lower`: Converts text to lowercase
- `Upper`: Converts text to uppercase
- `Hiragana-Katakana`: Converts Hiragana to Katakana

You can chain multiple transforms by separating them with semicolons.

## Example: Transliterating to Latin

The following example demonstrates transliteration of multiple scripts to Latin characters:

```json
PUT /icu-transform-latin
{
  "settings": {
    "analysis": {
      "filter": {
        "latin_transform": {
          "type": "icu_transform",
          "id": "Any-Latin"
        }
      },
      "analyzer": {
        "latin_analyzer": {
          "tokenizer": "keyword",
          "filter": ["latin_transform"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the analyzer with text in different scripts:

```json
POST /icu-transform-latin/_analyze
{
  "analyzer": "latin_analyzer",
  "text": "Москва"
}
```
{% include copy-curl.html %}

The Cyrillic text is transliterated to Latin:

```json
{
  "tokens": [
    {
      "token": "Moskva",
      "start_offset": 0,
      "end_offset": 6,
      "type": "word",
      "position": 0
    }
  ]
}
```

Test with Japanese text:

```json
POST /icu-transform-latin/_analyze
{
  "analyzer": "latin_analyzer",
  "text": "東京"
}
```
{% include copy-curl.html %}

The Japanese characters are transliterated:

```json
{
  "tokens": [
    {
      "token": "dōng jīng",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    }
  ]
}
```

## Example: Removing accents

The following example removes diacritical marks from text:

```json
PUT /icu-transform-no-accents
{
  "settings": {
    "analysis": {
      "filter": {
        "remove_accents": {
          "type": "icu_transform",
          "id": "NFD; [:Nonspacing Mark:] Remove; NFC"
        }
      },
      "analyzer": {
        "accent_removal_analyzer": {
          "tokenizer": "keyword",
          "filter": ["remove_accents"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the analyzer:

```json
POST /icu-transform-no-accents/_analyze
{
  "analyzer": "accent_removal_analyzer",
  "text": "Ênrique Iglesias"
}
```
{% include copy-curl.html %}

The accents are removed:

```json
{
  "tokens": [
    {
      "token": "Enrique Iglesias",
      "start_offset": 0,
      "end_offset": 16,
      "type": "word",
      "position": 0
    }
  ]
}
```

## Example: Script-to-script conversion

The following example converts Latin text to Cyrillic:

```json
PUT /icu-transform-cyrillic
{
  "settings": {
    "analysis": {
      "filter": {
        "to_cyrillic": {
          "type": "icu_transform",
          "id": "Latin-Cyrillic"
        }
      },
      "analyzer": {
        "cyrillic_analyzer": {
          "tokenizer": "keyword",
          "filter": ["to_cyrillic"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test with Latin text:

```json
POST /icu-transform-cyrillic/_analyze
{
  "analyzer": "cyrillic_analyzer",
  "text": "Sankt Peterburg"
}
```
{% include copy-curl.html %}

The text is converted to Cyrillic script:

```json
{
  "tokens": [
    {
      "token": "Санкт Петербург",
      "start_offset": 0,
      "end_offset": 15,
      "type": "word",
      "position": 0
    }
  ]
}
```

## Compound transformations

You can chain multiple transformations by separating transform IDs with semicolons. The transformations are applied in order from left to right.

For example, the compound ID `"Any-Latin; NFD; [:Nonspacing Mark:] Remove; NFC"` performs the following steps:
1. Transliterates to Latin
2. Applies canonical decomposition (NFD)
3. Removes non-spacing marks (accents)
4. Applies canonical composition (NFC)

## Related documentation

- [ICU analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/icu/)
- [ICU tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/icu-tokenizer/)
- [ICU folding token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/icu-folding/)
