---
layout: default
title: Disk-based vector search
nav_order: 16
parent: k-NN search
has_children: false
canonical_url: https://docs.opensearch.org/latest/search-plugins/knn/disk-based-vector-search/
---

# Disk-based vector search
**Introduced 2.17**
{: .label .label-purple}

For low-memory environments, OpenSearch provides _disk-based vector search_, which significantly reduces the operational costs for vector workloads. Disk-based vector search uses [binary quantization]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-vector-quantization/#binary-quantization), compressing vectors and thereby reducing the memory requirements. This memory optimization provides large memory savings at the cost of slightly increased search latency while still maintaining strong recall.

To use disk-based vector search, set the [`mode`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/#vector-workload-modes) parameter to `on_disk` for your vector field type. This parameter will configure your index to use secondary storage. 

## Creating an index for disk-based vector search

To create an index for disk-based vector search, send the following request:

```json
PUT my-vector-index
{
  "settings" : {
    "index": {
      "knn": true
    }
  },
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
{% include copy-curl.html %}

By default, the `on_disk` mode configures the index to use the `faiss` engine and `hnsw` method. The default [`compression_level`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/#compression-levels) of `32x` reduces the amount of memory the vectors require by a factor of 32. To preserve the search recall, rescoring is enabled by default. A search on a disk-optimized index runs in two phases: The compressed index is searched first, and then the results are rescored using full-precision vectors loaded from disk.

To reduce the compression level, provide the `compression_level` parameter when creating the index mapping: 

```json
PUT my-vector-index
{
  "settings" : {
    "index": {
      "knn": true
    }
  },
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
{% include copy-curl.html %}

For more information about the `compression_level` parameter, see [Compression levels]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/#compression-levels). Note that for `4x` compression, the `lucene` engine will be used.
{: .note}

If you need more granular fine-tuning, you can override additional k-NN parameters in the method definition. For example, to improve recall, increase the `ef_construction` parameter value:

```json
PUT my-vector-index
{
  "settings" : {
    "index": {
      "knn": true
    }
  },
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
{% include copy-curl.html %}

The `on_disk` mode only works with the `float` data type.
{: .note}

## Ingestion

You can perform document ingestion for a disk-optimized vector index in the same way as for a regular vector index. To index several documents in bulk, send the following request:

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
{% include copy-curl.html %}

## Search

Search is also performed in the same way as in other index configurations. The key difference is that, by default, the `oversample_factor` of the rescore parameter is set to `3.0` (unless you override the `compression_level`). For more information, see [Rescoring quantized results using full precision]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/#rescoring-quantized-results-using-full-precision). To perform vector search on a disk-optimized index, provide the search vector:

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
{% include copy-curl.html %}

Similarly to other index configurations, you can override k-NN parameters in the search request:

```json
GET my-vector-index/_search
{
  "query": {
    "knn": {
      "my_vector_field": {
        "vector": [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5],
        "k": 5,
        "method_parameters": {
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
{% include copy-curl.html %}

[Radial search]({{site.url}}{{site.baseurl}}/search-plugins/knn/radial-search-knn/) does not support disk-based vector search.
{: .note}

## Model-based indexes

For [model-based indexes]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/#building-a-k-nn-index-from-a-model), you can specify the `on_disk` parameter in the training request in the same way that you would specify it during index creation. By default, `on_disk` mode will use the [Faiss IVF method]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/#supported-faiss-methods) and a compression level of `32x`. To run the training API, send the following request:

```json
POST /_plugins/_knn/models/test-model/_train
{
    "training_index": "train-index-name",
    "training_field": "train-field-name",
    "dimension": 8,
    "max_training_vector_count": 1200,
    "search_size": 100,
    "description": "My model",
    "space_type": "innerproduct",
    "mode": "on_disk"
}
```
{% include copy-curl.html %}

This command assumes that training data has been ingested into the `train-index-name` index. For more information, see [Building a k-NN index from a model]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/#building-a-k-nn-index-from-a-model).
{: .note}

You can override the `compression_level` for disk-optimized indexes in the same way as for regular k-NN indexes.


## Next steps

- For more information about binary quantization, see [Binary quantization]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-vector-quantization/#binary-quantization).
- For more information about k-NN vector workload modes, see [Vector workload modes]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/#vector-workload-modes).