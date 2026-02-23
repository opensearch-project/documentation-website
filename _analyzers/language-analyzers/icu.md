---
layout: default
title: ICU
parent: Language analyzers
grand_parent: Analyzers
nav_order: 205
---

# ICU analyzer

The `icu_analyzer` uses the International Components for Unicode (ICU) library to provide advanced text analysis for multilingual content. Available through the `analysis-icu` plugin, this analyzer excels at processing languages with complex writing systems, including Chinese, Japanese, Korean, Thai, Arabic, and Hebrew.

Unlike the standard analyzer, the `icu_analyzer` applies Unicode-aware text segmentation that recognizes word boundaries in languages that don't use spaces as delimiters. The analyzer combines ICU tokenization with character normalization and case folding to produce consistent, searchable tokens across diverse language families.

## Installing the ICU plugin

Before using the `icu_analyzer`, you must install the `analysis-icu` plugin:

```bash
sudo bin/opensearch-plugin install analysis-icu
```
{% include copy-curl.html %}

After installation, restart your OpenSearch cluster for the plugin to take effect.

For more information about installing plugins, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).

## ICU plugin components

The `analysis-icu` plugin provides several components that can be used independently or combined in custom analyzers. The built-in `icu_analyzer` uses a combination of these components.

### Tokenizer

- [`icu_tokenizer`]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/icu-tokenizer/): Tokenizes text using ICU Unicode text segmentation rules. More accurate than the standard tokenizer for languages without spaces between words.

### Character filters

- [`icu_normalizer`]({{site.url}}{{site.baseurl}}/analyzers/character-filters/icu-normalization/): Normalizes characters to their canonical Unicode forms. Can be configured with different normalization modes (NFC, NFD, NFKC, NFKD).

### Token filters

- `icu_normalizer`: Normalizes tokens to canonical Unicode forms (same as character filter but operates on tokens).
- [`icu_folding`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/icu-folding/): Performs Unicode normalization and case folding, including removal of diacritics. More comprehensive than the `asciifolding` filter.
- [`icu_transform`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/icu-transform/): Applies ICU transforms for transliteration, such as converting between scripts (for example, Cyrillic to Latin).

### Field types

- [`icu_collation_keyword`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/icu-collation-keyword/): Provides language-specific collation for sorting and range queries.


## How the ICU analyzer works

The `icu_analyzer` applies a sequence of transformations to input text:

- **Tokenization**: Breaks text into tokens using ICU's Unicode text segmentation algorithm. This approach identifies word boundaries accurately in languages like Chinese, Japanese, Korean, and Thai, where spaces don't separate words.
- **Normalization**: Converts characters to canonical Unicode forms, resolving variations in how diacritics, ligatures, and composite characters are represented.
- **Case folding**: Applies comprehensive case transformations that handle language-specific rules, such as the Turkish İ/i distinction, more effectively than basic lowercasing.
- **Character filtering**: Standardizes equivalent Unicode representations and removes non-textual elements from the token stream.

## When to use the ICU analyzer

Consider using the `icu_analyzer` for the following use cases:

- **CJK content**: Chinese, Japanese, and Korean text benefits from ICU's word segmentation capabilities, which identify natural word boundaries more accurately than bigram approaches.
- **Southeast Asian languages**: Thai, Khmer, Lao, and similar languages that require dictionary-based or rule-based word boundary detection.
- **Right-to-left scripts**: Arabic, Hebrew, and other RTL writing systems where proper character normalization is essential.
- **Diacritical marks**: Content with accented characters, umlauts, or other diacritics that need consistent normalization.
- **Multilingual applications**: Search indexes containing multiple languages that require uniform text processing.
- **Unicode-heavy content**: Documents with special Unicode characters, ligatures, or combining marks.

The `icu_analyzer` provides superior word boundary detection for CJK text compared to the `cjk` analyzer's bigram tokenization method.
{: .note}

## Comparison with other analyzers

The following table compares the ICU analyzer with other analyzers.

| Analyzer | Best for | Tokenization method |
|:---------|:---------|:-------------------|
| `standard` | General-purpose, European languages | Unicode text segmentation (space-based) |
| `cjk` | Chinese, Japanese, Korean | Bigram tokenization (overlapping 2-character sequences) |
| `icu_analyzer` | Multilingual, complex scripts, CJK | ICU Unicode text segmentation (language-aware) |

## Performance considerations

The `icu_analyzer` uses more computational resources than basic analyzers because of its sophisticated Unicode processing and language-aware tokenization. The analyzer requires additional memory for ICU data tables and consumes more CPU cycles during text analysis compared to the `standard` or `cjk` analyzers.

For most search applications, the accuracy improvements justify the performance overhead, particularly when handling non-Latin scripts or multilingual content. The impact is most noticeable during indexing; query-time analysis has minimal effect on search latency.

Evaluate the `icu_analyzer` with representative data from your use case to verify that performance meets your requirements.
{: .tip}


## Example: Using the ICU analyzer

You can assign the `icu_analyzer` to a text field when creating an index:

```json
PUT /multilingual-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "icu_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Analyzing text with the ICU analyzer

Use the following request to see how the `icu_analyzer` processes multilingual text:

```json
POST /_analyze
{
  "analyzer": "icu_analyzer",
  "text": "東京は日本の首都です。OpenSearch supports advanced Unicode processing with café and naïve!"
}
```
{% include copy-curl.html %}

The analyzer tokenizes Japanese characters at natural word boundaries and normalizes accented Latin characters. In this example, `café` becomes `cafe` and `naïve` becomes `naive` through Unicode case folding. The response demonstrates proper segmentation of both Japanese and English text:

```json
{
  "tokens": [
    {
      "token": "東京",
      "start_offset": 0,
      "end_offset": 2,
      "type": "<IDEOGRAPHIC>",
      "position": 0
    },
    {
      "token": "は",
      "start_offset": 2,
      "end_offset": 3,
      "type": "<IDEOGRAPHIC>",
      "position": 1
    },
    {
      "token": "日本",
      "start_offset": 3,
      "end_offset": 5,
      "type": "<IDEOGRAPHIC>",
      "position": 2
    },
    {
      "token": "の",
      "start_offset": 5,
      "end_offset": 6,
      "type": "<IDEOGRAPHIC>",
      "position": 3
    },
    {
      "token": "首都",
      "start_offset": 6,
      "end_offset": 8,
      "type": "<IDEOGRAPHIC>",
      "position": 4
    },
    {
      "token": "てす",
      "start_offset": 8,
      "end_offset": 10,
      "type": "<IDEOGRAPHIC>",
      "position": 5
    },
    {
      "token": "opensearch",
      "start_offset": 11,
      "end_offset": 21,
      "type": "<ALPHANUM>",
      "position": 6
    },
    {
      "token": "supports",
      "start_offset": 22,
      "end_offset": 30,
      "type": "<ALPHANUM>",
      "position": 7
    },
    {
      "token": "advanced",
      "start_offset": 31,
      "end_offset": 39,
      "type": "<ALPHANUM>",
      "position": 8
    },
    {
      "token": "unicode",
      "start_offset": 40,
      "end_offset": 47,
      "type": "<ALPHANUM>",
      "position": 9
    },
    {
      "token": "processing",
      "start_offset": 48,
      "end_offset": 58,
      "type": "<ALPHANUM>",
      "position": 10
    },
    {
      "token": "with",
      "start_offset": 59,
      "end_offset": 63,
      "type": "<ALPHANUM>",
      "position": 11
    },
    {
      "token": "cafe",
      "start_offset": 64,
      "end_offset": 68,
      "type": "<ALPHANUM>",
      "position": 12
    },
    {
      "token": "and",
      "start_offset": 69,
      "end_offset": 72,
      "type": "<ALPHANUM>",
      "position": 13
    },
    {
      "token": "naive",
      "start_offset": 73,
      "end_offset": 78,
      "type": "<ALPHANUM>",
      "position": 14
    }
  ]
}
```

## Custom ICU analyzer

You can create a custom analyzer using ICU components with specific configuration:

```json
PUT /custom-icu-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_icu_analyzer": {
          "type": "custom",
          "tokenizer": "icu_tokenizer",
          "filter": [
            "icu_normalizer",
            "icu_folding"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "my_icu_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Related documentation

- [ICU tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/icu-tokenizer/) -- Unicode text segmentation
- [ICU normalization character filter]({{site.url}}{{site.baseurl}}/analyzers/character-filters/icu-normalization/) -- Character-level Unicode normalization
- [ICU folding token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/icu-folding/) -- Case folding and diacritic removal
- [ICU transform token filter]({{site.url}}{{site.baseurl}}/analyzers/token-filters/icu-transform/) -- Transliteration and text transformation
- [ICU collation keyword field]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/icu-collation-keyword/) -- Language-specific sorting
- [CJK analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/cjk/) -- Alternative for CJK text
- [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#install) -- Plugin installation guide
