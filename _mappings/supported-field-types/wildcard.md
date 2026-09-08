---
layout: default
title: Wildcard
nav_order: 45
has_children: false
parent: String field types
grand_parent: Supported field types
redirect_from:
  - /field-types/supported-field-types/wildcard/
---

# Wildcard field type
**Introduced 2.15**
{: .label .label-purple }

A `wildcard` field is a variant of a `keyword` field designed for arbitrary substring and regular expression matching.

Use a `wildcard` field for values that you need to search by leading wildcard or arbitrary substring, such as unstructured log lines and computer code. On a `keyword` field, these searches must scan every term in the field, which becomes slow as the number of distinct values grows. On a `text` field, tokenization breaks each value into words, so a substring that spans a word boundary can no longer be matched. A `wildcard` field indexes the substrings themselves, so it supports these searches directly.

The `wildcard` field type is indexed differently from the `keyword` field type. Whereas `keyword` fields write the original field value to the index, the `wildcard` field type splits the field value into substrings with a length that is less than or equal to 3 and writes the substrings to the index. For example, the string `test` is split into strings `t`, `te`, `tes`, `e`, `es`, and `est`. 

At search time, required substrings from the query pattern are matched against the index to produce candidate documents, which are then filtered according to the pattern in the query. For example, for the search term `test`, OpenSearch performs an indexed search for `tes AND est`. If the search term contains less than three characters, OpenSearch uses character substrings that are one or two characters long. For each matching document, if the source value is `test`, then the document is returned in the results. This excludes false positive values like `nikola tesla felt alternating current was best`.

In general, exact match queries (like [`term`]({{site.url}}{{site.baseurl}}/query-dsl/term/term/) or [`terms`]({{site.url}}{{site.baseurl}}/query-dsl/term/term/) queries) perform less effectively on `wildcard` fields than on `keyword` fields, while [`wildcard`]({{site.url}}{{site.baseurl}}/query-dsl/term/wildcard/), [`prefix`]({{site.url}}{{site.baseurl}}/query-dsl/term/prefix/), and [`regexp`]({{site.url}}{{site.baseurl}}/query-dsl/term/regexp/) queries perform better on `wildcard` fields.
{: .tip}

Wildcard fields do not support highlighting.
{: .note}

## Example

Create a mapping with a `wildcard` field:

```json
PUT logs
{
  "mappings" : {
    "properties" : {
      "log_line" : {
        "type" :  "wildcard"
      }
    }
  }
}
```
{% include copy-curl.html %}

All queries on wildcard fields have a constant score---usually `1`. To change the score, set the `boost` parameter in the query. A `boost` in the field mapping has no effect.
{: .note}

## Parameters

The following table lists all parameters available for `wildcard` fields.

| Parameter | Description | Default value | Dynamically updatable |
| :--- | :--- | :--- | :--- |
| `copy_to` | The name of one or more other fields into which to copy this field's value at index time. | None | Yes |
| `doc_values` | A Boolean value that specifies whether the field should be stored on disk so that it can be used for aggregations, sorting, or scripting. | `true` | No |
| `fields` | One or more subfields that index the same value using a different field type. Use a subfield to support operations that the `wildcard` type does not, such as range queries on a `keyword` subfield. | None | Yes |
| `ignore_above` | An integer value that specifies a maximum string length. Longer strings are neither indexed nor written to doc values, so they do not match any query and do not appear in aggregations. The value remains in `_source`. | `2147483647` | Yes |
| `meta` | Metadata about the field. OpenSearch stores this metadata and returns it in the mapping but does not use it. | None | Yes |
| [`normalizer`]({{site.url}}{{site.baseurl}}/analyzers/normalizers/) | The normalizer used to preprocess values for indexing and search. OpenSearch applies it to both the indexed value and the query, and doc values store the normalized form, while `_source` keeps the original. Use the `lowercase` normalizer to perform case-insensitive matching on the field. | `default` (no normalization) | No |
| `null_value` | A value to index in place of `null`. Specify it as a string; other JSON types are converted to their string form. If this parameter is not specified, a `null` value is treated as missing and an `exists` query does not match the document. | `null` | No |

## Storage requirements

A `wildcard` field uses more disk space than a `keyword` field containing the same values. Both field types write the same doc values, so the additional space comes entirely from the index: a `keyword` field indexes one term per value, whereas a `wildcard` field indexes one substring for each character position in the value. The number of indexed substrings therefore grows with the length of each value rather than with the number of distinct values.

The number of indexed substrings is a poor predictor of the size difference because the two field types spend their space in different places. A `keyword` field indexes few long terms: one per distinct value, each stored in full in the term dictionary. A `wildcard` field indexes many occurrences of a small set of short terms because only a limited number of distinct three-character combinations appears in any dataset. In a sample of 20,000 distinct log lines of about 116 characters each, the `keyword` field indexed 20,000 terms holding 2.3 MB of term text, whereas the `wildcard` field indexed 5,431 distinct terms holding 16 KB. Indexing 116 times as many substrings therefore produced an index only 13% larger.

The size increase depends on your data, so there is no fixed multiplier. Longer values produce more substrings per document. The width of the character set matters even more: values drawn from a narrow set, such as hexadecimal identifiers, produce far fewer distinct substrings than values drawn from a wide one, such as Base64 payloads. In two samples of 20,000 distinct 64-character values that differed only in character set, the `wildcard` index was 6% larger than the equivalent `keyword` index for hexadecimal values but 55% larger for Base64 values.

To estimate the impact for your own data, index a representative sample twice---once as a `keyword` field and once as a `wildcard` field---and compare the resulting index sizes.

Create one index for each field type, using the same number of shards and replicas in both so that the comparison is not skewed:

```json
PUT wildcard-sample
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "log_line": {
        "type": "wildcard"
      }
    }
  }
}
```
{% include copy-curl.html %}

```json
PUT keyword-sample
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "log_line": {
        "type": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index the same sample documents into both indexes using the [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/). Use enough documents to fill at least one segment; a few tens of thousands of representative values are usually sufficient.

Merge each index into a single segment so that deleted documents and partially filled segments do not distort the measurement:

```json
POST wildcard-sample,keyword-sample/_forcemerge?max_num_segments=1
```
{% include copy-curl.html %}

Force merge is a resource-intensive operation. Run it on a test index rather than a production index.
{: .warning}

Flush both indexes so that the merged segment is written to disk. Reported store sizes count only flushed segments, so measuring before the flush completes returns sizes that do not reflect the merged index:

```json
POST wildcard-sample,keyword-sample/_flush
```
{% include copy-curl.html %}

Confirm that each index reports one segment with no deleted documents before you measure:

```json
GET _cat/segments/wildcard-sample,keyword-sample?v&h=index,segment,docs.count,docs.deleted,size
```
{% include copy-curl.html %}

Compare the sizes using the [Index Stats API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/stats/):

```json
GET wildcard-sample,keyword-sample/_stats/store
```
{% include copy-curl.html %}

The `size_in_bytes` value under `primaries` reports the on-disk size of each index. The following abridged response shows the relevant fields:

```json
{
  "indices": {
    "wildcard-sample": {
      "primaries": {
        "store": {
          "size_in_bytes": 4600819
        }
      }
    },
    "keyword-sample": {
      "primaries": {
        "store": {
          "size_in_bytes": 4052054
        }
      }
    }
  }
}
```

The ratio between the two values is how much larger a whole index becomes when the field is mapped as `wildcard` instead of `keyword`. It is not the ratio of the field's own storage, which is higher: `_source` and the other per-document structures are identical in both indexes, so they dilute the difference. In the preceding response, the whole-index ratio is 1.14, but the field alone accounts for 1.22. Use the whole-index ratio for capacity planning and multiply the result by 1 plus the number of replicas.

Two properties of this measurement are worth noting. Because the indexes are merged into a single segment, the sizes are a floor: a production index holds multiple segments and deleted documents, both of which add overhead to either field type. And the ratio decreases slightly as the document count grows, so a small sample yields a marginally conservative estimate.

To reduce the cost, use `ignore_above` to skip indexing values longer than a chosen length, or set `doc_values` to `false` if you do not need aggregations, sorting, or scripting on the field. When `doc_values` is disabled, OpenSearch reads each candidate document's value from `_source` rather than from doc values when it filters the substring matches, so the field must remain in `_source`. If the field is excluded from `_source` and `doc_values` is disabled, these queries return no matches instead of an error. Either setting makes the field ineligible for [derived source](#derived-source).

## Limitations

The following queries are not supported on `wildcard` fields:

- [`fuzzy`]({{site.url}}{{site.baseurl}}/query-dsl/term/fuzzy/) queries: Run them on a `keyword` or `text` field instead.
- [`range`]({{site.url}}{{site.baseurl}}/query-dsl/term/range/) queries: Range matching does not apply to this field type.

## Derived source

When an index uses [derived source]({{site.url}}{{site.baseurl}}/field-types/metadata-fields/source/#derived-source), OpenSearch may sort wildcard values and remove duplicates in multi-value wildcard fields during source reconstruction. 

`doc_values` must be enabled for `wildcard` fields to be supported when using wildcard values with derived source. A `wildcard` field that sets `ignore_above` or `normalizer` does not support derived source because OpenSearch cannot reconstruct the original value from the indexed one.
{: .note}

Create an index that enables derived source and configures a `name` field with `doc_values` enabled:

```json
PUT sample-index1
{
  "settings": {
    "index": {
      "derived_source": {
        "enabled": true
      }
    }
  },
  "mappings": {
    "properties": {
      "name": {
        "type": "wildcard",
        "doc_values": true
      }
    }
  }
}
```

Index a document with multiple wildcard values, including duplicates, into the index:

```json
PUT sample-index1/_doc/1
{
  "name": ["ba", "ab", "ac", "ba"]
}
```

After OpenSearch reconstructs `_source`, the derived `_source` removes duplicates and sorts the values alphabetically:

```json
{
  "name": ["ab", "ac", "ba"]
}
```
