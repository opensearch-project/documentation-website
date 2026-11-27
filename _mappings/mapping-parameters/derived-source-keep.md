---
layout: default
title: Derived source keep
parent: Mapping parameters
nav_order: 22
has_children: false
has_toc: false
---

# Derived source keep mapping parameter

When an index uses [derived source]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/source/#derived-source), OpenSearch reconstructs `_source` from [`doc_values`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/doc-values/) by default. Doc values deduplicate values and may reorder the values in an array, so the reconstructed array may differ from the array you ingested.

The `derived_source_keep` mapping parameter controls how OpenSearch reconstructs the source of a field. Set this parameter to `arrays` to preserve the exact structure of array values, including their original order and duplicate values.

## Supported field types

The `derived_source_keep` parameter is supported for the following field types:

- [`keyword`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/keyword/)
- [`boolean`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/boolean/)
- [`ip`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/ip/)
- [Numeric]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/numeric/) (`long`, `integer`, `short`, `byte`, `double`, `float`, and `half_float`)
- [`date`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/)

## Parameters

The following table lists the values accepted by the `derived_source_keep` parameter.

Value | Description
:--- | :---
`none` (Default) | Reconstructs the source from doc values. Doc values deduplicate values and may reorder the values in an array.
`arrays` | Reconstructs the source from stored fields, which preserve the original order and duplicate values of arrays. When you set this value, OpenSearch automatically sets [`store`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/store/) to `true` for the field.

Setting `derived_source_keep` to `arrays` stores each value of the field in addition to its doc values, which increases the index size. Use this setting only for fields for which you need to preserve the exact array order and duplicate values.
{: .note}

## Configuration syntax

Specify the `derived_source_keep` parameter in the field mapping:

```json
"tags": {
  "type": "keyword",
  "derived_source_keep": "arrays"
}
```

## Example: Preserving array order and duplicates

Create an index that enables derived source and sets `derived_source_keep` to `arrays` for the `tags` field:

```json
PUT /test-index
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
      "tags": {
        "type": "keyword",
        "derived_source_keep": "arrays"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document that contains an array with duplicate values:

```json
POST /test-index/_doc/1
{
  "tags": ["opensearch", "search", "opensearch", "analytics", "search"]
}
```
{% include copy-curl.html %}

Retrieve the document:

```json
GET /test-index/_doc/1
```
{% include copy-curl.html %}

The response contains the `tags` array in its original order, with both `opensearch` and `search` appearing twice:

```json
{
  "_index": "test-index",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "tags": [
      "opensearch",
      "search",
      "opensearch",
      "analytics",
      "search"
    ]
  }
}
```

## Example: Default behavior

By default, `derived_source_keep` is set to `none`. Create an index that enables derived source and does not set `derived_source_keep`:

```json
PUT /test-index-default
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
      "tags": {
        "type": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index the same document into the index:

```json
POST /test-index-default/_doc/1
{
  "tags": ["opensearch", "search", "opensearch", "analytics", "search"]
}
```
{% include copy-curl.html %}

Retrieve the document:

```json
GET /test-index-default/_doc/1
```
{% include copy-curl.html %}

The response contains the `tags` array reconstructed from doc values, in which the values are sorted and deduplicated:

```json
{
  "_index": "test-index-default",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "tags": [
      "analytics",
      "opensearch",
      "search"
    ]
  }
}
```
