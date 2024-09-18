---
layout: default
title: Disk based vector search
nav_order: 16
parent: k-NN search
has_children: false
has_math: true
---

# Disk Base Vector Search

For low-memory environments, the [mode]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/#vector-workload-modes) parameter should be set to `on_disk` for your vector field type. This parameter will setup your index to use secondary storage to extend memory. This allows users to trade some search latency for large memory savings while providing a strong recall value.

## Index Creation

To create an index, run the following:

```json
PUT my-vector-index
{
  "mappings": {
    "properties": {
      "my_vector_field": {
        "type": "knn_vector",
        "dimension": 8,
        "space_type": "innerproduct",
        "data_type": "float",
        "mode": "on_disk"
      }
    }
  }
}
```

Internally, `on_disk` mode will by default configure the index to use the `faiss`'s `hnsw` algorithm with a [`compression_level`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/#compression-levels) of `32x`. This will reduce the amount of memory the vectors occupy by a factor of 32! Then, in order to preserve the search recall, re-scoring will be enabled by default. This will setup the index to run a two-phased search, where the compressed in memory index is searched, and then the results are re-scored with the full-precision vectors loaded from disk.

For some use cases, `32x` be too aggressive of a compression rate. If this is the case, it can be easily overriden by also setting the `compression_level` parameter:

```json
PUT my-vector-index
{
  "mappings": {
    "properties": {
      "my_vector_field": {
        "type": "knn_vector",
        "dimension": 8,
        "space_type": "innerproduct",
        "data_type": "float",
        "mode": "on_disk",
        "compression_level": "16x"
      }
    }
  }
}
```

Valid values are `2x`, `4x`, `8x` and `16x`. Note for `4x` compression, the `lucene` engine will be used.

Additionally, if more fine-tuning is required, users can override parameters in the method definition. For instance, if a user wants to increase the `ef_construction` parameter to improve recall, they can specify the following:

```json
PUT my-vector-index
{
  "mappings": {
    "properties": {
      "my_vector_field": {
        "type": "knn_vector",
        "dimension": 8,
        "space_type": "innerproduct",
        "data_type": "float",
        "mode": "on_disk",
        "method": {
          "params": {
            "ef_construction": 512
          }
        }
      }
    }
  }
}
```

Note that `on_disk` mode will only work with the `float` data_type.

## Ingestion

Ingestion works the same way as other Vector indices. To index a few documents via bulk ingestion, run the following:
```json
POST _bulk
{ "index": { "_index": "my-vector-index", "_id": "1" } }
{ "my_vector_field": [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5], "price": 12.2 }
{ "index": { "_index": "my-vector-index", "_id": "2" } }
{ "my_vector_field": [2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5], "price": 7.1 }
{ "index": { "_index": "my-vector-index", "_id": "3" } }
{ "my_vector_field": [3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5], "price": 12.9 }
{ "index": { "_index": "my-vector-index", "_id": "4" } }
{ "my_vector_field": [4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5], "price": 1.2 }
{ "index": { "_index": "my-vector-index", "_id": "5" } }
{ "my_vector_field": [5.5, 5.5, 5.5, 5.5, 5.5, 5.5, 5.5, 5.5], "price": 3.7 }
{ "index": { "_index": "my-vector-index", "_id": "6" } }
{ "my_vector_field": [6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5], "price": 10.3 }
{ "index": { "_index": "my-vector-index", "_id": "7" } }
{ "my_vector_field": [7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5], "price": 5.5 }
{ "index": { "_index": "my-vector-index", "_id": "8" } }
{ "my_vector_field": [8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5, 8.5], "price": 4.4 }
{ "index": { "_index": "my-vector-index", "_id": "9" } }
{ "my_vector_field": [9.5, 9.5, 9.5, 9.5, 9.5, 9.5, 9.5, 9.5], "price": 8.9 }
```

## Search

Search also works the same as other index configurations. The key difference is that by default, the `oversample_factor` of the rescore parameter will be set to X (unless compression_level is overridden - see this [table]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/#rescoring-quantized-results-using-full-precision)). To run a query, run:
```json
GET my-vector-index/_search
{
  "query": {
    "knn": {
      "my_vector_field": {
        "vector": [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5],
        "k": 5
      }
    }
  }
}
```

Similar to other index configurations, parameters can be overridden. To run a query while overriding parameters, run:
```json
GET my-vector-index/_search
{
  "query": {
    "knn": {
      "my_vector_field": {
        "vector": [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5],
        "k": 5,
        "method_params": {
            "ef_search": 512
        },
        "rescore": {
            "oversample_factor": 10.0
        }
      }
    }
  }
}
```

[Radial search]({{site.url}}{{site.baseurl}}/search-plugins/knn/radial-search-knn/) is not available with disk-based vector search.
{: .note}


