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
**Introduced 1.0**
{: .label .label-purple }

A keyword field type contains a string that is not analyzed. It allows only exact, case-sensitive matches.

By default, keyword fields are both indexed (because `index` is enabled) and stored on disk (because `doc_values` is enabled). To reduce disk space, you can specify not to index keyword fields by setting `index` to `false`.

If you need to use a field for full-text search, map it as [`text`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text/) instead.
{: .note }

## Example

The following query creates a mapping with a keyword field. Setting `index` to `false` specifies to store the `genre` field on disk and to retrieve it using `doc_values`:

```json
PUT movies
{
  "mappings" : {
    "properties" : {
      "genre" : {
        "type" :  "keyword",
        "index" : false
      }
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

The following table lists the parameters accepted by keyword field types. All parameters are optional.

| Parameter | Description | Default value | Dynamically updatable |
| :--- | :--- | :--- | :--- |
| `boost` | A floating-point value that specifies the weight of this field toward the relevance score. Values above `1.0` increase the field's relevance. Values between `0.0` and `1.0` decrease the field's relevance. | `1.0` | Yes |
| `doc_values` | A Boolean value that specifies whether the field should be stored on disk so that it can be used for aggregations, sorting, or scripting. | `true` | No | 
| `eager_global_ordinals` | Specifies whether global ordinals should be loaded eagerly on refresh. If the field is often used for aggregations, this parameter should be set to `true`. | `false` | Yes |
| `fields` | To index the same string in several ways (for example, as a keyword and text), provide the fields parameter. You can specify one version of the field to be used for search and another to be used for sorting and aggregations. | None | No |
| `ignore_above` | Any string longer than this integer value should not be indexed. Default dynamic mapping creates a keyword subfield for which `ignore_above` is set to `256`. | `2147483647` | Yes |
| `index` | A Boolean value that specifies whether the field should be searchable. To reduce disk space, set `index` to `false`. | `true` | No |
| `index_options` | Information to be stored in the index that will be considered when calculating relevance scores. Can be set to `freqs` for term frequency. | `docs` | No |
| `meta` | Accepts metadata for this field. | None | Yes |
| [`normalizer`]({{site.url}}{{site.baseurl}}/analyzers/normalizers/) | Specifies how to preprocess this field before indexing (for example, make it lowercase). | `null` (no preprocessing) | No |
| `norms` | A Boolean value that specifies whether the field length should be used when calculating relevance scores. | `false` | Yes |
| [`null_value`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/index#null-value) | A value to be used in place of `null`. Must be of the same type as the field. If this parameter is not specified, the field is treated as missing when its value is `null`. | `null` | No |
| `similarity` | The ranking algorithm for calculating relevance scores. | The index's `similarity` setting (by default, `BM25`) | No |
| `use_similarity` | Determines whether to calculate relevance scores. Default is `false`, which uses `constant_score` for faster queries. Setting this parameter to `true` enables scoring but may increase search latency. See [The use_similarity parameter ](#the-use_similarity-parameter). | `false` | Yes |
| `split_queries_on_whitespace` | A Boolean value that specifies whether full-text queries should be split on white space. | `false` | Yes |
| `store` | A Boolean value that specifies whether the field value should be stored and can be retrieved separately from the `_source` field. | `false` | No |

## The use_similarity parameter 

The `use_similarity` parameter controls whether OpenSearch calculates relevance scores when querying a `keyword` field. By default, it is set to `false`, which improves performance by using `constant_score`. Setting it to `true` enables scoring based on the configured similarity algorithm (typically, BM25) but may increase query latency.

Run a term query on the index for which `use_similarity` is disabled (default):

```json
GET /big5/_search
{
  "size": 3,
  "explain": false,
  "query": {
    "term": {
      "process.name": "kernel"
    }
  },
  "_source": false
}
```
{% include copy-curl.html %}

The query returns results quickly (10 ms), and all documents receive a constant relevance score of 1.0:

```json
{
  "took": 10,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "big5",
        "_id": "xDoCtJQBE3c7bAfikzbk",
        "_score": 1
      },
      {
        "_index": "big5",
        "_id": "xzoCtJQBE3c7bAfikzbk",
        "_score": 1
      },
      {
        "_index": "big5",
        "_id": "yDoCtJQBE3c7bAfikzbk",
        "_score": 1
      }
    ]
  }
}
```

To enable scoring using the default BM25 algorithm for the `process.name` field, provide the `use_similarity` parameter in the index mappings:

```json
PUT /big5/_mapping
{
  "properties": {
    "process.name": {
      "type": "keyword",
      "use_similarity": true
    }
  }
}
```

When you run the same term query on the configured index, the query takes longer to run (200 ms), and the returned documents have varying relevance scores based on term frequency and other BM25 factors:

```json
{
  "took" : 200,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 10000,
      "relation" : "gte"
    },
    "max_score" : 0.8844931,
    "hits" : [
      {
        "_index" : "big5",
        "_id" : "xDoCtJQBE3c7bAfikzbk",
        "_score" : 0.8844931
      },
      {
        "_index" : "big5",
        "_id" : "xzoCtJQBE3c7bAfikzbk",
        "_score" : 0.8844931
      },
      {
        "_index" : "big5",
        "_id" : "yDoCtJQBE3c7bAfikzbk",
        "_score" : 0.8844931
      }
    ]
  }
}
```

## Derived source

When an index uses [derived source]({{site.url}}{{site.baseurl}}/field-types/metadata-fields/source/#derived-source), OpenSearch may sort keyword values and remove duplicates in multi-value keyword fields during source reconstruction.

Create an index that enables derived source and configures a `name` field:

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
        "type": "keyword"
      }
    }
  }
}
```

Index a document with multiple keyword values, including duplicates, into the index:

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

If the field mapping defines a [`null_value`]({{site.url}}{{site.baseurl}}/_field-types/mapping-parameters/null-value/), any ingested null values are replaced with that value during reconstruction. The following example demonstrates how `null_value` affects derived source output.

Create an index that enables derived source and configures a `null_value` for the `name` field:

```json
PUT sample-index2
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
        "type": "keyword",
        "null_value": "foo"
      }
    }
  }
}
```

Index a document with null values into the index:

```json
PUT sample-index2/_doc/1
{
  "name": [null, "ba", "ab"]
}
```

After OpenSearch reconstructs `_source`, the derived `_source` replaces null values and sorts alphabetically:

```json
{
  "name": ["ab", "ba", "foo"]
}
```
