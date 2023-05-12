---
layout: default
title: Keyword
nav_order: 46
has_children: false
parent: String field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/keyword/
  - /field-types/keyword/
---

# Keyword field type

A keyword field type contains a string that is not analyzed. It allows only exact, case-sensitive matches.

If you need to use a field for full-text search, map it as [`text`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text/) instead.
{: .note }

## Example

Create a mapping with a keyword field:

```json
PUT movies
{
  "mappings" : {
    "properties" : {
      "genre" : {
        "type" :  "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

The following table lists the parameters accepted by keyword field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
`boost` | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field's relevance. Values between 0.0 and 1.0 decrease the field's relevance. Default is 1.0.
`doc_values` | A Boolean value that specifies whether the field should be stored on disk so that it can be used for aggregations, sorting, or scripting. Default is `false`.
`eager_global_ordinals` | Specifies whether global ordinals should be loaded eagerly on refresh. If the field is often used for aggregations, this parameter should be set to `true`. Default is `false`.
`fields` | To index the same string in several ways (for example, as a keyword and text), provide the fields parameter. You can specify one version of the field to be used for search and another to be used for sorting and aggregations.
`ignore_above` | Any string longer than this integer value should not be indexed. Default is 2147483647. Default dynamic mapping creates a keyword subfield for which `ignore_above` is set to 256.
`index` | A Boolean value that specifies whether the field should be searchable. Default is `true`.
`index_options` | Information to be stored in the index that will be considered when calculating relevance scores. Can be set to `freqs` for term frequency. Default is `docs`.
`meta` | Accepts metadata for this field.
`normalizer` | Specifies how to preprocess this field before indexing (for example, make it lowercase). Default is `null` (no preprocessing).
`norms` | A Boolean value that specifies whether the field length should be used when calculating relevance scores. Default is `false`.
[`null_value`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/index#null-value) | A  value to be used in place of `null`. Must be of the same type as the field. If this parameter is not specified, the field is treated as missing when its value is `null`. Default is `null`.
`similarity` | The ranking algorithm for calculating relevance scores. Default is `BM25`. 
`split_queries_on_whitespace` | A Boolean value that specifies whether full-text queries should be split on whitespace. Default is `false`.
`store` | A Boolean value that specifies whether the field value should be stored and can be retrieved separately from the _source field. Default is `false`. 