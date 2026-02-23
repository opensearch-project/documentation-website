---
layout: default
title: ICU
parent: Tokenizers
nav_order: 45
---

# ICU tokenizer

The `icu_tokenizer` splits text into words using Unicode text segmentation rules defined in [Unicode Standard Annex #29](https://www.unicode.org/reports/tr29/). This tokenizer provides more accurate word boundary detection than the standard tokenizer, particularly for Asian languages that don't use spaces to separate words.

The `icu_tokenizer` employs dictionary-based tokenization for Chinese, Japanese, Korean, Thai, and Lao text, and applies specialized rules for segmenting Myanmar and Khmer scripts into syllables.

## Installation

The `icu_tokenizer` requires the `analysis-icu` plugin. For installation instructions, see [ICU analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/icu/).

## Example

The following example demonstrates how to use the `icu_tokenizer`:

```json
PUT /icu-tokenizer-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "icu_analyzer_custom": {
          "tokenizer": "icu_tokenizer"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Testing the tokenizer

Use the following request to test the `icu_tokenizer`:

```json
POST /icu-tokenizer-index/_analyze
{
  "tokenizer": "icu_tokenizer",
  "text": "สวัสดีOpenSearchเป็นเครื่องมือค้นหา"
}
```
{% include copy-curl.html %}

The tokenizer correctly segments Thai text without spaces:

```json
{
  "tokens": [
    {
      "token": "สวัสดี",
      "start_offset": 0,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "OpenSearch",
      "start_offset": 6,
      "end_offset": 16,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "เป็น",
      "start_offset": 16,
      "end_offset": 20,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "เครื่อง",
      "start_offset": 20,
      "end_offset": 27,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "มือ",
      "start_offset": 27,
      "end_offset": 30,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "ค้นหา",
      "start_offset": 30,
      "end_offset": 35,
      "type": "<ALPHANUM>",
      "position": 5
    }
  ]
}
```

## Customizing tokenization rules

Advanced users can customize the `icu_tokenizer` behavior by specifying per-script rule files using the Resource Bundle Break Iterator (RBBI) syntax. This feature is experimental in Lucene.

To apply custom rules, use the `rule_files` parameter with a comma-separated list of `script:filename` pairs. Script codes follow the [ISO 15924](https://unicode.org/iso15924/iso15924-codes.html) four-letter standard.

### Example with custom rules

Save a custom rule file to your OpenSearch config directory (for example, `CustomRules.rbbi`):

```text
.+ {200};
```

Configure an analyzer to use this rule file:

```json
PUT /custom-icu-rules
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "custom_icu_tokenizer": {
          "type": "icu_tokenizer",
          "rule_files": "Latn:CustomRules.rbbi"
        }
      },
      "analyzer": {
        "custom_icu_analyzer": {
          "tokenizer": "custom_icu_tokenizer"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Test the custom tokenizer:

```json
POST /custom-icu-rules/_analyze
{
  "analyzer": "custom_icu_analyzer",
  "text": "Custom tokenization rules"
}
```
{% include copy-curl.html %}

## Parameters

The following table lists the parameters for the `icu_tokenizer`.

Parameter | Data type | Description
:--- | :--- | :---
`rule_files` | String | Comma-separated list of `script:rulefile` pairs that define custom tokenization rules for specific scripts. Rule files must be placed in the OpenSearch config directory. Optional.

## Related documentation

- [ICU analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/icu/)
- [Standard tokenizer]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/standard/)
