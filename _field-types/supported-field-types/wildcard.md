---
layout: default
title: Wildcard
nav_order: 62
has_children: false
parent: String field types
grand_parent: Supported field types
---

# Wildcard field type

A `wildcard` field is a variant of a `keyword` field designed for arbitrary substring and regular expression matching.

Use a `wildcard` field when your content consists of "strings of characters" and not "text". Examples include unstructured log lines and computer code.

The `wildcard` field type is indexed differently from the `keyword` field type. Whereas `keyword` fields write the original field value to the index, the `wildcard` field type splits the field value into substrings with length less than or equal to 3 and writes the substrings to the index. For example, the string `test` is split into strings `t`, `te`, `tes`, `e`, `es`, and `est`. At search time, required substrings from the query pattern are matched against the index to produce candidate documents, which are then filtered according to the pattern in the query.

In general, exact match queries (like [`term`]({{site.url}}{{site.baseurl}}/query-dsl/term/term/) or [`terms`]({{site.url}}{{site.baseurl}}/query-dsl/term/term/) queries) perform worse on `wildcard` fields than on `keyword` fields, while [`wildcard`]({{site.url}}{{site.baseurl}}/query-dsl/term/wildcard/), [`prefix`]({{site.url}}{{site.baseurl}}/query-dsl/term/prefix/), and [`regexp`]({{site.url}}{{site.baseurl}}/query-dsl/term/regexp/) queries perform better on `wildcard` fields.
{: .tip}

## Example

Create a mapping with a `wildcard` field:

```json
PUT movies
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

## Parameters

The following table lists all parameters available for `wildcard` fields.

Parameter | Description
:--- | :---
`doc_values` | A Boolean value that specifies whether the field should be stored on disk so that it can be used for aggregations, sorting, or scripting. Default is `false`.
`ignore_above` | Any string longer than this integer value should not be indexed. Default is `2147483647`.
`normalizer` | The normalizer used to preprocess values for indexing and search. By default, no normalization occurs and the original value is used. You may use the `lowercase` normalizer to perform case-insentive matching on the field.
`null_value` | A value to be used in place of `null`. Must be of the same type as the field. If this parameter is not specified, the field is treated as missing when its value is `null`. Default is `null`.
