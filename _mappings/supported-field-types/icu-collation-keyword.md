---
layout: default
title: ICU collation keyword
nav_order: 35
has_children: false
parent: String field types
grand_parent: Supported field types
---

# ICU collation keyword field type

The `icu_collation_keyword` field type stores terms as binary encoded collation keys, enabling language-specific sorting and range queries. Unlike standard string sorting, which uses byte-order comparison, this field type applies collation rules that respect linguistic conventions for a specific language or locale.

This field type is particularly useful when you need to sort documents according to language-specific alphabetical order, handle accented characters correctly, or implement culturally appropriate string comparisons.

## Installation

The `icu_collation_keyword` field type requires the `analysis-icu` plugin. For installation instructions, see [ICU analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/icu/).

## How it works

The `icu_collation_keyword` field encodes terms directly as binary collation keys in doc values and creates a single indexed token (similar to the standard `keyword` field). This approach provides:

- **Language-aware sorting**: Applies collation rules specific to a language or locale
- **Efficient storage**: Stores binary collation keys rather than full strings
- **Range query support**: Enables range queries that respect linguistic ordering

By default, the field uses DUCET (Default Unicode Collation Element Table) collation, which provides a language-neutral best-effort sort order.

## Parameters

The following table lists the parameters accepted by the `icu_collation_keyword` field type.

Parameter | Data type | Description
:--- | :--- | :---
`language` | String | The language code (for example, `de` for German, `fr` for French). Optional.
`country` | String | The country code (for example, `DE` for Germany, `FR` for France). Optional.
`variant` | String | A variant string for additional collation options (for example, `@collation=phonebook` for German phonebook order). Optional.
`strength` | String | The collation strength level. Valid values are `primary`, `secondary`, `tertiary`, `quaternary`, and `identical`. Default is `tertiary`. Optional.
`decomposition` | String | How to handle character normalization. Valid values are `no` and `canonical`. Default is `no`. Optional.
`alternate` | String | How to handle whitespace and punctuation. Valid values are `shifted` and `non-ignorable`. Optional.
`case_level` | Boolean | Whether to consider case differences when `strength` is `primary`. Default is `false`. Optional.
`case_first` | String | Whether uppercase or lowercase sorts first. Valid values are `lower` and `upper`. Optional.
`numeric` | Boolean | Whether to sort numeric substrings by numeric value. For example, `item-9` sorts before `item-21`. Default is `false`. Optional.
`variable_top` | String | Specifies which characters are considered variable for the `alternate` option. Optional.
`hiragana_quaternary_mode` | Boolean | Whether to distinguish between Katakana and Hiragana at `quaternary` strength. Optional.
`doc_values` | Boolean | Whether the field should be stored on disk for sorting and aggregations. Default is `true`. Optional.
`index` | Boolean | Whether the field should be searchable. Default is `true`. Optional.
`null_value` | String | A string value to substitute for explicit `null` values. Default is `null` (field treated as missing). Optional.
`store` | Boolean | Whether to store the field value separately from `_source`. Default is `false`. Optional.
`fields` | Object | Multi-field mappings for indexing the same value in different ways. Optional.

## Example: German phonebook sorting

The following example creates an index with a field that sorts German names using phonebook ordering:

```json
PUT /german-names
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "fields": {
          "sort": {
            "type": "icu_collation_keyword",
            "language": "de",
            "country": "DE",
            "variant": "@collation=phonebook"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Index some German names:

```json
POST /german-names/_bulk
{"index":{"_id":"1"}}
{"name":"Müller"}
{"index":{"_id":"2"}}
{"name":"Möller"}
{"index":{"_id":"3"}}
{"name":"Meyer"}
{"index":{"_id":"4"}}
{"name":"Schneider"}
```
{% include copy-curl.html %}

Search and sort using the collation field:

```json
GET /german-names/_search
{
  "query": {
    "match_all": {}
  },
  "sort": "name.sort"
}
```
{% include copy-curl.html %}

The results are sorted according to German phonebook conventions, where ö and ü are treated as distinct characters in the German alphabet:

```json
{
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": "german-names",
        "_id": "3",
        "_score": null,
        "_source": {
          "name": "Meyer"
        }
      },
      {
        "_index": "german-names",
        "_id": "2",
        "_score": null,
        "_source": {
          "name": "Möller"
        }
      },
      {
        "_index": "german-names",
        "_id": "1",
        "_score": null,
        "_source": {
          "name": "Müller"
        }
      },
      {
        "_index": "german-names",
        "_id": "4",
        "_score": null,
        "_source": {
          "name": "Schneider"
        }
      }
    ]
  }
}
```

## Example: French accented character sorting

The following example demonstrates French collation, which treats accented characters according to French linguistic rules:

```json
PUT /french-words
{
  "mappings": {
    "properties": {
      "word": {
        "type": "text",
        "fields": {
          "sort": {
            "type": "icu_collation_keyword",
            "language": "fr",
            "country": "FR",
            "strength": "primary"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Index French words with accents:

```json
POST /french-words/_bulk
{"index":{"_id":"1"}}
{"word":"cote"}
{"index":{"_id":"2"}}
{"word":"côte"}
{"index":{"_id":"3"}}
{"word":"coté"}
{"index":{"_id":"4"}}
{"word":"côté"}
```
{% include copy-curl.html %}

Query with sorting:

```json
GET /french-words/_search
{
  "query": {
    "match_all": {}
  },
  "sort": "word.sort"
}
```
{% include copy-curl.html %}

The results follow French alphabetical conventions.

## Collation strength levels

The `strength` parameter determines how strictly the collation compares strings:

- `primary`: Compares base characters only, ignoring accents and case. For example, `a`, `A`, `á`, and `Á` are considered equal.
- `secondary`: Compares base characters and accents, but ignores case. For example, `a` and `á` are different, but `a` and `A` are equal.
- `tertiary` (default): Compares base characters, accents, and case. For example, `a`, `A`, and `á` are all different.
- `quaternary`: Adds punctuation and whitespace comparison when `alternate` is set to `shifted`.
- `identical`: Performs character-by-character binary comparison.

## Performance considerations

The `icu_collation_keyword` field type uses more disk space than standard `keyword` fields because it stores binary collation keys. However, this approach provides faster sorting and range queries compared to applying collation at query time.

For optimal performance:
- Use `icu_collation_keyword` as a multi-field on `text` fields rather than as the primary field type
- Set `index: false` if you only need sorting and don't require range queries on the collation field
- Choose an appropriate `strength` level—lower strengths produce smaller collation keys

## Related documentation

- [ICU analyzer]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/icu/)
- [Keyword field type]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/keyword/)
- [Sorting results]({{site.url}}{{site.baseurl}}/opensearch/search/sort/)
