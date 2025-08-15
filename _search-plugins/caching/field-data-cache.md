---
layout: default
title: Field data cache
parent: Caching
grand_parent: Improving search performance
nav_order: 20
---

# Field data cache

The field data cache is a node-level in-memory cache that stores field data and global ordinals. These are data structures that enable aggregations and sorting on analyzed text fields. Since they can be expensive to compute, they are cached after creation in case they need to be reused.

## What is field data?

Field data is a data structure that enables quick sorting and aggregation on text fields. Text fields are stored in an inverted index, which is optimized for quick searching for specific terms, not iterating through individual documents. As this is necessary for aggregations or sorting, OpenSearch must process the inverted index into another data structure that is optimized for individual document access.

## What are global ordinals? 

When computing aggregations on a given field, each Lucene segment assigns a unique ordinal to each unique term, enabling things like bucket aggregations. When computing an aggregation across the whole cluster, it's necessary to create a global ordinal for each globally unique term and to store a mapping between these global ordinals and the segment ordinals. This enables combining the aggregation results from each segment. This mapping is then stored in the field data cache for reuse in future aggregations. 

If the field has the mapping parameter `"eager_global_ordinals": true`, which defaults to `false`, global ordinals are computed and stored at index refresh rather than lazily at query time.

For more information about global ordinals, see [Eager global ordinals]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/eager-global-ordinals/).

## Best practices

By default, field data is disabled on text fields because it can consume large amounts of heap memory. If you want to sort or aggregate on text fields, we recommend instead creating a keyword subfield. Keyword fields are not analyzed and therefore do not get stored in an inverted index or require building a separate data structure for aggregations.

If you want to enable sorting or aggregation directly on the text field, set `"fielddata": true` in the field's mapping.

## Configuring the field data cache 

Setting | Data type  | Default | Level | Static/Dynamic | Description
:--- |:-----------|:--------| :--- | :--- | :---
`indices.breaker.fielddata.limit` | Percentage  | `40%`  | Cluster | Dynamic | Sets the field data cache size limit, beyond which incoming requests that would require more entries in the cache will be stopped by the circuit breaker. 
`indices.fielddata.cache.size` | Byte size or percentage of total heap size | -1 | Cluster | Static | Sets the maximum field data cache size, beyond which evictions will occur. Must be smaller than the circuit breaker limit. With the default value of -1, this limit does not apply and only the circuit breaker limit will be relevant.

## Monitoring the field data cache 

The [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/) returns cache statistics for all nodes in a cluster:

```json
GET /_nodes/stats/indices/fielddata
```
{% include copy-curl.html %}

The response contains the cache statistics:

```json
{
  "nodes" : {
    "oeR83dkUSPmnQqzBEGc4fQ" : {
      "indices" : {
        "fielddata" : {
          "memory_size_in_bytes" : 0,
          "evictions" : 0
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

You can break down the values by index by providing the parameter `level=indices`. 

You can also use the [Cat Fielddata API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-field-data/) to get a list of field data sizes for each field on each node. 