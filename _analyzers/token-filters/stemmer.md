---
layout: default
title: Stemmer
parent: Token filters
nav_order: 390
---

# Stemmer token filter

The `stemmer` token filter reduces words to their root or base form (also known as their _stem_).

## Parameters

The `stemmer` token filter can be configured with a `language` parameter that accepts the following values:

- Arabic: `arabic`
- Armenian: `armenian`
- Basque: `basque`
- Bengali: `bengali`
- Brazilian Portuguese: `brazilian`
- Bulgarian: `bulgarian`
- Catalan: `catalan`
- Czech: `czech`
- Danish: `danish`
- Dutch: `dutch, dutch_kp`
- English: `english` (default), `light_english`, `lovins`, `minimal_english`, `porter2`, `possessive_english`
- Estonian: `estonian`
- Finnish: `finnish`, `light_finnish`
- French: `light_french`, `french`, `minimal_french`
- Galician: `galician`, `minimal_galician` (plural step only)
- German: `light_german`, `german`, `german2`, `minimal_german`
- Greek: `greek`
- Hindi: `hindi`
- Hungarian: `hungarian, light_hungarian`
- Indonesian: `indonesian`
- Irish: `irish`
- Italian: `light_italian, italian`
- Kurdish (Sorani): `sorani`
- Latvian: `latvian`
- Lithuanian: `lithuanian`
- Norwegian (Bokmål): `norwegian`, `light_norwegian`, `minimal_norwegian`
- Norwegian (Nynorsk): `light_nynorsk`, `minimal_nynorsk`
- Portuguese: `light_portuguese`, `minimal_portuguese`, `portuguese`, `portuguese_rslp`
- Romanian: `romanian`
- Russian: `russian`, `light_russian`
- Spanish: `light_spanish`, `spanish`
- Swedish: `swedish`, `light_swedish`
- Turkish: `turkish`

You can also use the `name` parameter as an alias for the `language` parameter. If both are set, the `name` parameter is ignored.
{: .note}

## Example

The following example request creates a new index named `my-stemmer-index` and configures an analyzer with a `stemmer` filter:

```json
PUT /my-stemmer-index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_english_stemmer": {
          "type": "stemmer",
          "language": "english"
        }
      },
      "analyzer": {
        "my_stemmer_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_english_stemmer"
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
GET /my-stemmer-index/_analyze
{
  "analyzer": "my_stemmer_analyzer",
  "text": "running runs"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "run",
      "start_offset": 0,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "run",
      "start_offset": 8,
      "end_offset": 12,
      "type": "<ALPHANUM>",
      "position": 1
    }
  ]
}
```