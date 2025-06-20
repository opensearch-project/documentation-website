---
layout: default
title: Lucene On Faiss
nav_order: 72
has_children: false
---


# Memory Optimized Search with Faiss
Introduced 3.1
{: .label .label-purple }
OpenSearch supports the Faiss engine, which typically loads the entire index into off-heap memory. If the index size exceeds available physical memory, vector search becomes unsustainable. However, memory optimized search mode allows operation without loading the entire index into memory.
Once the mode is enabled, instead of eagerly loading all bytes into off-heap memory, the engine memory-maps the underlying index file and relies on the operating system's cache to serve search requests. As a result, repeated reads can be served from the system cache without incurring additional I/O.

Note that this is a search-time mode, and the indexing logic remains unchanged.

# Scope
The memory-optimized search mode in OpenSearch is exclusively for the Faiss engine and has no impact on other engine types. Within the Faiss engine, this optimization only supports the HNSW method. Faiss methods like [IVF]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/#ivf-parameters) and (PQ)({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/faiss-product-quantization) are not supported. If used, they will load data into memory regardless of whether the memory-optimized mode is enabled.
Since this is an index-level setting, user must close the index, update the value, and then reopen it to apply the change.

# Setting
| Setting                                | Static/Dynamic | Default | Description                                           |
|:---------------------------------------|:---------------|:--------|:------------------------------------------------------|
| `index.knn.memory_optimized_search`    | Static | `false` | Enable memory optimized search on an index. |

```json
PUT /test_index
{
  "settings" : {
    "index.knn": true,
    "index.knn.memory_optimized_search" : true # Defaults to false
  },
  "mappings": {
    <Index fields>
  }
}```
{% include copy-curl.html %}


# Integartion in Disk Mode
If a user configures 'on_disk' mode with '1x' compression for a field, memory-optimized search will be enabled for that field, regardless of whether memory optimization is explicitly disabled at index level. For more details on memory-optimized vectos, refer to (here)[{{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-memory-optimized].


# Warm UP
When memory-optimized search is enabled, (Warm-up API call)[{{site.url}}{{site.baseurl}}/vector-search/performance-tuning-search/#warm-up-the-index] loads only the essential information needed for search operations. This step includes opening streams to the underlying Faiss index file. Consequently, searches performed after this warm-up process are expected to be faster because the system no longer needs to establish these initial streams or perform other preparatory tasks during the actual query.
For fields where memory optimized search is disabled, bytes will be loaded into off-heap memory as before.

