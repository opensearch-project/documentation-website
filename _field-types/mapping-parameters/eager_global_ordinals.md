---
layout: default
title: Eager global ordinals
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 35
has_children: false
has_toc: false
canonical_url: https://docs.opensearch.org/latest/field-types/mapping-parameters/eager_global_ordinals/
---

# Eager global ordinals

The `eager_global_ordinals` mapping parameter controls when global ordinals are built for a field. When enabled, global ordinals are computed during index refresh rather than "lazily" during query execution. This can improve performance for operations that rely on global ordinals, for example, sorting and aggregations on keyword fields. However, it may also increase index refresh times and memory usage.

Global ordinals represent a mapping from term values to integer identifiers and are used internally to quickly execute aggregations and sort operations. By loading them "eagerly," the system reduces query latency at the cost of additional upfront processing during indexing.

By default, `eager_global_ordinals` are disabled, ensuring that the cluster is optimized for indexing speed.

Global ordinals are stored in the field data cache and consume heap memory. Fields with high cardinality can consume a large amount of heap memory. To prevent memory-related issues, it is important to carefully configure the [field data circuit breaker settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/circuit-breaker/#field-data-circuit-breaker-settings).

## When global ordinals are used

Global ordinals are used if a search includes any of the following:

- Bucket aggregations on `keyword`, `ip`, and `flattened` fields. This includes `terms`, `composite`, `diversified_sampler`, and `significant_terms` aggregations.
- Aggregations on `text` fields that require `fielddata` to be enabled.
- Parent/child queries using a [`join`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/join/) field, such as [`has_child`]({{site.url}}{{site.baseurl}}/query-dsl/joining/has-child/) queries or `parent` aggregations.


## Enabling eager global ordinals on a field

The following request creates an index named `products` with `eager_global_ordinals` enabled:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "size": {
        "type": "keyword",
        "eager_global_ordinals": true
      }
    }
  }
}
```
{% include copy-curl.html %}

The following request indexes a document:

```json
PUT /products/_doc/1
{
  "size": "ABC123"
}
```
{% include copy-curl.html %}

The following request runs a `terms` aggregation:

```json
POST /products/_search
{
  "size": 0,
  "aggs": {
    "size_agg": {
      "terms": {
        "field": "size"
      }
    }
  }
}
```
{% include copy-curl.html %}
