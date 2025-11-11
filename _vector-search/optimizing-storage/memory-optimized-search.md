---
layout: default
title: Memory-optimized search
parent: Optimizing vector storage
nav_order: 30
---

# Memory-optimized search
Introduced 3.1
{: .label .label-purple }

Memory-optimized search allows the Faiss engine to run efficiently without loading the entire vector index into off-heap memory. Without this optimization, Faiss typically loads the full index into memory, which can become unsustainable if the index size exceeds available physical memory. With memory-optimized search, the engine memory-maps the index file and relies on the operating system's file cache to serve search requests. This approach avoids unnecessary I/O and allows repeated reads to be served directly from the system cache.

Memory-optimized search affects only search operations. Indexing behavior remains unchanged.
{: .note }

## Limitations

The following limitations apply to memory-optimized search in OpenSearch:

- **For indexes created before OpenSearch 2.19, the engine loads data into memory regardless of whether memory-optimized mode is enabled**.
- Memory-optimized search is supported only for the [Faiss engine]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/#faiss-engine) with the [HNSW method]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/#hnsw-parameters-1). 
- Memory-optimized search does not support [IVF]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/#ivf-parameters) or [product quantization (PQ)]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/faiss-product-quantization).
- An index restart is required to enable or disable memory-optimized search.

If you use IVF or PQ, the engine loads data into memory regardless of whether memory-optimized mode is enabled.
{: .important }

## Configuration

To enable memory-optimized search, set `index.knn.memory_optimized_search` to `true` when creating an index:

```json
PUT /test_index
{
  "settings": {
    "index.knn": true,
    "index.knn.memory_optimized_search": true
  },
  "mappings": {
    "properties": {
      "vector_field": {
        "type": "knn_vector",
        "dimension": 128,
        "method": {
          "name": "hnsw",
          "engine": "faiss"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

To enable memory-optimized search on an existing index, you must close the index, update the setting, and then reopen the index:

```json
POST /test_index/_close
```
{% include copy-curl.html %}

```json
PUT /test_index/_settings
{
  "index.knn.memory_optimized_search": true
}
```
{% include copy-curl.html %}

```json
POST /test_index/_open
```
{% include copy-curl.html %}

## Integration with disk-based search

When you configure a field with `on_disk` mode and `1x` compression, memory-optimized search is automatically enabled for that field, even if memory optimization isn't enabled at the index level. For more information, see [Memory-optimized vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/).


Memory-optimized search differs from [disk-based search]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/disk-based-vector-search/) because it doesn't use compression or quantization. It only changes how vector data is loaded and accessed during search.
{: .note }

## Performance optimization

When memory-optimized search is enabled, the [warm-up API]({{site.url}}{{site.baseurl}}/vector-search/performance-tuning-search/#warm-up-the-index) loads only the essential information needed for search operations, such as opening streams to the underlying Faiss index file. This minimal warm-up results in:
- Faster initial searches.
- Reduced memory overhead.
- More efficient resource utilization.

For fields where memory-optimized search is disabled, the warm-up process loads vectors into off-heap memory.

## Next steps

- [Disk-based vector search]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/disk-based-vector-search/)
- [Vector quantization]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/knn-vector-quantization/)
- [Performance tuning]({{site.url}}{{site.baseurl}}/vector-search/performance-tuning/)
