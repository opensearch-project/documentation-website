---
layout: default
title: Neural sparse ANN search
parent: Neural sparse search
grand_parent: AI search
nav_order: 60
has_children: false
---

# Neural sparse ANN search
**Introduced 3.3**
{: .label .label-purple }

Neural sparse approximate nearest neighbor (ANN) search improves query efficiency by balancing accuracy and latency. Unlike traditional neural sparse search, which performs exact search on `rank_features` fields, neural sparse ANN search uses the Spilled Clustering of Inverted Lists with Summaries for Maximum Inner Product Search (SEISMIC) algorithm on `sparse_vector` fields to provide optimized query performance using approximate search techniques.

Neural sparse ANN search provides the following advantages over traditional neural sparse search:

- **Query performance improvement**: Achieves significant query speed improvements compared to two-phase queries under ≥90% recall conditions with better than linear performance scaling as dataset size increases.
- **Scalability**: Maintains consistent query performance as datasets scale to 50 million vectors on a single node.
- **Memory efficiency**: Uses byte quantization to reduce the size of the index, and, depending on the engine, either JVM heap caches with a circuit breaker or off-heap memory-mapped files to manage memory usage and prevent resource exhaustion.
- **Hybrid approach**: Automatically selects the optimal indexing strategy based on segment size, with minimal impact on indexing performance.
- **Search flexibility**: Provides tunable trade-offs between high recall and low latency using query parameters.
- **Engine choice**: Runs on either the Lucene engine or, starting with OpenSearch 3.9, the native engine, which builds and searches the index in off-heap memory. For more information, see [Engines](#engines).

Consider neural sparse ANN search when you need the efficiency of sparse retrieval but require better performance than traditional neural sparse search methods can provide at scale:

- **Large-scale applications**: Datasets with millions to billions of documents in which query performance is critical.
- **High-throughput scenarios**: Applications requiring fast response times under heavy query loads.

## How neural sparse ANN search works

Neural sparse ANN search implements several techniques to optimize both indexing and querying of neural sparse vectors.

### Indexing

During the indexing phase, neural sparse ANN search implements several key optimizations:

1. **Posting list clustering**: For each term in the inverted index, the algorithm performs the following actions:
   - Sorts documents by their token weights in descending order.
   - Retains only the top `n_postings` documents with the highest weights.
   - Applies a clustering algorithm to group similar documents into one cluster. On the native engine, `clustering_batch_size` splits each posting list into that many batches and clusters each batch separately, which reduces the memory needed to build the index at the cost of a longer build time.
   - Generates summary sparse vectors for each cluster, keeping only the highest-weighted tokens.

2. **Forward index maintenance**: Neural sparse ANN search maintains both the clustered inverted index and a forward index that stores complete sparse vectors organized by document ID for efficient access during query processing. 

### Query processing

During query execution, neural sparse ANN search employs an efficient retrieval process:

1. **Token-level pruning**: For a given query, all tokens are sorted based on their weights. Only the `top_n` tokens with the highest weights are kept so that fewer posting lists are visited.

2. **Cluster-level pruning**: The algorithm first computes dot product scores between the query vector and cluster summary vectors. Only clusters with scores above a dynamic threshold are selected for detailed examination.

3. **Document-level scoring**: For selected clusters, neural sparse ANN search examines individual documents within those clusters, computing exact dot product scores between the query and document vectors retrieved from the forward index.

This approach dramatically reduces the number of documents that need to be scored, resulting in significant performance improvements while maintaining high accuracy.

### Hybrid indexing behavior

Neural sparse ANN search is a hybrid indexing approach that depends on the document count in each segment to balance indexing and query performance:

- Segments with fewer documents than `approximate_threshold`: Not clustered, so queries against them score every matching document instead of using the SEISMIC algorithm. On the Lucene engine, these segments are indexed as plain neural sparse (`rank_features`) segments and queried using the standard neural sparse query. On the native engine, they are indexed as an equivalent inverted index built in the engine's native format.

- Segments with more documents than `approximate_threshold`: Indexed as neural sparse ANN segments and queried using the sparse ANN query.

This hybrid approach balances indexing performance with query speed. Small segments avoid the overhead of clustering, while large segments benefit from approximate search optimizations. The system maintains backward compatibility by supporting both traditional neural sparse queries and neural sparse ANN queries within the same index.

For more information about the SEISMIC algorithm, see [Efficient Inverted Indexes for Approximate Retrieval over Learned Sparse Representations](https://arxiv.org/abs/2404.18812).

## Engines
**Introduced 3.9**
{: .label .label-purple }

An _engine_ is the implementation that builds the neural sparse ANN index and runs queries against it. Both engines implement the SEISMIC algorithm and accept the same algorithm and query parameters; they differ in where the index lives and how its memory is managed.

OpenSearch supports the following engines:

- [**Lucene**](#lucene-engine): Builds the clustered posting lists and forward index in JVM heap and serves queries from a plugin-managed cache. Available in OpenSearch 3.3 and later. This is the default.
- [**Native**](#native-engine): Builds the index into a memory-mapped file on disk and serves queries from off-heap memory. Available in OpenSearch 3.9 and later.

Select an engine using the `engine` parameter in the field's `method` object:

```json
PUT /my-sparse-ann-index
{
  "settings": {
    "index": {
      "sparse": true
    }
  },
  "mappings": {
    "properties": {
      "sparse_embedding": {
        "type": "sparse_vector",
        "method": {
          "name": "seismic",
          "engine": "native",
          "parameters": {
            "n_postings": 4000,
            "cluster_ratio": 0.1,
            "forward_index": "per_block",
            "clustering_batch_size": 1
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The `method` object cannot be updated after the field is created. To change the engine, create a new index with the intended mapping and reindex your data.
{: .important}

### Comparing the engines

The following table compares the two engines.

| Characteristic | Lucene engine | Native engine |
|:--- |:--- |:--- |
| `engine` value | `lucene` | `native` |
| Available in | OpenSearch 3.3 and later | OpenSearch 3.9 and later |
| Enabled by default | Yes | No. See [Enabling the native engine](#enabling-the-native-engine). |
| Query performance | Baseline | Higher search throughput and lower query latency |
| Index build performance | Baseline | Faster segment and force merge builds |
| Where the index is held | JVM heap, in a plugin-managed cache | A memory-mapped file on disk, read from off-heap memory |
| Memory bounded by | The `plugins.neural_search.circuit_breaker.limit` setting, with least recently used cache eviction | Operating system page cache. No configurable limit, and no eviction by OpenSearch. |
| JVM heap required | Proportional to the working set of sparse segments served by the node | Minimal. The index is not held in heap. |
| Disk layout | Managed by Lucene | A dedicated engine file, memory mapped at query time. Size depends on the [forward index layout](#choosing-a-forward-index-layout). |
| Filtering | Post-filtering | Pre-filtering. See [Filtering support](#filtering-support). |
| Format of segments below `approximate_threshold` | `rank_features`, queried using the standard neural sparse query | An inverted index equivalent to `rank_features`, built in the engine's native format |
| Warm up and clear cache APIs | Supported | Not applicable |
| Sparse memory statistics | Reported | Not reported |

For benchmark results and guidance on choosing between the engines, see [Neural sparse ANN search performance tuning]({{site.url}}{{site.baseurl}}/vector-search/performance-tuning-sparse/).

### Lucene engine

The Lucene engine is the default and requires no additional configuration. It stores clustered posting lists and forward index data in JVM heap. Memory usage is bounded by a circuit breaker, and data is evicted from the cache when the limit is reached. For more information, see [Memory and caching settings](#memory-and-caching-settings).

Because the index is held in heap, a node running the Lucene engine at scale needs a JVM heap large enough to hold the working set of every sparse segment it serves.

### Native engine

The native engine writes the SEISMIC index to a file that OpenSearch memory maps at query time and reads in place. The on-disk layout is the runtime layout, so nothing is reconstructed when the index is loaded. This has the following consequences:

- The index does not consume JVM heap and adds no garbage collection pressure, so a node can serve large sparse indexes with a comparatively small heap.
- Index memory is reclaimable operating system page cache rather than anonymous memory, so the operating system reclaims it under memory pressure. No circuit breaker or eviction policy is involved.
- The first query against a segment pays a one-time cost to establish the memory mapping. Later queries reuse it. This cost grows with segment size.

Because the native engine relies on page cache rather than a configurable limit, sizing a node means leaving enough RAM for page cache, the same as for any other memory-mapped Lucene data.

#### Enabling the native engine

The native engine is disabled by default. Both of the following cluster settings must be `true` before a field can use the native engine:

| Setting | Static/Dynamic | Default | Description |
|:--- |:--- |:--- |:--- |
| `plugins.neural_search.sparse.native_engine_feature_enabled` | Static | `true` | Whether the native engine is available. Because this setting is static, configure it in `opensearch.yml` on each node; changing it requires a node restart. |
| `plugins.neural_search.sparse.native_engine_enabled` | Dynamic | `false` | Whether the native engine is enabled at runtime. |

To enable the native engine, send the following request:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.neural_search.sparse.native_engine_enabled": true
  }
}
```
{% include copy-curl.html %}

If either setting is `false`, OpenSearch rejects attempts to create a field with `engine` set to `native`, to index documents into an existing native engine field, and to query one. OpenSearch does not silently fall back to the Lucene engine, because the field's mapping still specifies the native engine.

While the native engine is disabled, OpenSearch skips building the native index during segment flush and merge. Raw vectors are still written to disk, so re-enabling the engine and then force merging the affected indexes rebuilds the native index.
{: .note}

#### Choosing a forward index layout

The `forward_index` algorithm parameter controls how the native engine stores the forward index. Specify it in the field's `method.parameters` object. Like `clustering_batch_size`, it is supported only for the native engine.

| Value | Description | Trade-off |
|:--- |:--- |:--- |
| `shared` (default) | One contiguous forward index for the field. | Lower disk usage. |
| `per_block` | Each block's vectors are stored inline with the block, so a query reads only the blocks it selects. | Lower query latency, higher disk usage. |

Both layouts are memory mapped and apply the same quantization. The `forward_index` parameter selects where forward index data is placed, not the precision at which it is stored.

If you set `engine` to `lucene` and specify a `forward_index` value other than `shared`, the request is rejected.
{: .warning}

#### Considerations for the native engine

Before choosing the native engine, note the following:

- The [warm up]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#warm-up) and [clear cache]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#clear-cache) APIs operate on the Lucene engine's cache and do not apply to the native engine.
- The sparse memory statistics returned by the [Neural Search Stats API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#stats) report Lucene engine cache usage only. They do not account for native engine index memory.
- The `plugins.neural_search.circuit_breaker.limit` setting has no effect on the native engine.
- The native engine requires an index whose data is stored on the local filesystem.

## Step 1: Create an index

To use neural sparse ANN search, you must enable the `sparse` setting at the index level and use `sparse_vector` as the field type.

### Index settings

Set `index.sparse: true` to enable neural sparse ANN search functionality:

```json
PUT /my-sparse-ann-index
{
  "settings": {
    "index": {
      "sparse": true,
      "number_of_shards": 2,
      "number_of_replicas": 1
    }
  },
  "mappings": {
    "properties": {
      "sparse_embedding": {
        "type": "sparse_vector",
        "method": {
          "name": "seismic",
          "parameters": {
            "n_postings": 4000,
            "cluster_ratio": 0.1,
            "summary_prune_ratio": 0.4,
            "approximate_threshold": 1000000
          }
        }
      },
      "text": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

This example omits the `engine` parameter, so the field uses the default Lucene engine. To use the native engine instead, see [Engines](#engines).

For parameter information, see [Sparse vector]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/sparse-vector/).

## Step 2: Ingest data

Ingest documents with sparse embeddings where tokens are represented as integers with corresponding weights:

```json
POST _bulk
{ "create": { "_index": "my-sparse-ann-index", "_id": "1" } }
{ "sparse_embedding": {"10": 0.85, "23": 1.92, "24": 0.67, "78": 2.54, "156": 0.73}, "text": "OpenSearch neural sparse search" }
{ "create": { "_index": "my-sparse-ann-index", "_id": "2" } }
{ "sparse_embedding": {"3": 1.22, "19": 0.11, "21": 0.35, "300": 1.74, "985": 0.96}, "text": "Machine learning algorithms" }
```
{% include copy-curl.html %}

You can also use [ingest pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/) to automatically format tokens as integers.

## Step 3: Query the index

Query neural sparse ANN search using the `neural_sparse` query with `method_parameters` for performance tuning.

Do not combine neural sparse ANN search with [two-phase]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-sparse-query-two-phase-processor/) pipelines.
{: .important}

### Query using natural language

Query using natural language text, which requires a deployed sparse encoding model to convert the text into sparse vectors:

```json
GET /my-sparse-ann-index/_search
{
  "query": {
    "neural_sparse": {
      "sparse_embedding": {
        "query_text": "machine learning algorithms",
        "model_id": "your_sparse_model_id",
        "method_parameters": {
          "k": 10,
          "top_n": 10,
          "heap_factor": 1.0
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Query using raw vectors

Query using precomputed sparse vectors, where tokens are specified as integers with their corresponding weights:

```json
GET /my-sparse-ann-index/_search
{
  "query": {
    "neural_sparse": {
      "sparse_embedding": {
        "query_tokens": {
          "1055": 1.7,
          "2931": 2.3
        },
        "method_parameters": {
          "k": 10,
          "top_n": 6,
          "heap_factor": 1.2
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Query parameters

| Parameter | Description |
|:--- |:--- |
| `k` | The number of top nearest results to return |
| `top_n` | The number of query tokens with the highest weights to retain |
| `heap_factor` | Controls recall compared to performance trade-off |
| `filter` | Optional Boolean filter for pre-filtering or post-filtering |

The query syntax and these parameters are the same for both engines. The engine is selected in the field mapping, not in the query. For more information, see [Engines](#engines).
{: .note}

## Filtering support

Neural sparse ANN search supports filtering. On both engines, if the filter matches fewer documents than `k`, the query runs an exact search over the filtered documents instead of the approximate algorithm. Otherwise, the two engines apply the filter at different points:

- On the **Lucene engine**, the filter is applied after approximate retrieval (post-filtering). The results are the intersection of the top matches and the filter, so a selective filter can return fewer than `k` results.
- On the **native engine**, the filter is pushed into the engine as a candidate set before retrieval (pre-filtering). Retrieval runs within the filtered set, so the query can return a full `k` results.

For more information, see [Filtering in neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/filtering-in-sparse-search/).

## Cluster settings

Neural sparse ANN search supports the following cluster settings.

### Thread pool configuration

Building a clustered inverted index structure requires intensive computation. By default, the algorithm uses a single-threaded thread pool to build clusters. You can increase the thread pool size to build clusters in parallel, using more CPU cores and reducing index build time. This setting applies to both engines.

To configure the thread pool size, update the `plugins.neural_search.sparse.algo_param.index_thread_qty` setting:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.neural_search.sparse.algo_param.index_thread_qty": 4
  }
}
```
{% include copy-curl.html %}

### Memory and caching settings

The Lucene engine provides a circuit breaker that prevents the algorithm from using excessive memory and ensures that other OpenSearch operations remain unaffected. The default value of `circuit_breaker.limit` is `10%`. You can adjust this setting to control the total memory allocated to the algorithm. When memory usage reaches the defined limit, a cache eviction occurs, removing the least recently used data. 

A higher circuit breaker limit allows more memory usage and reduces the frequency of cache evictions but may impact other OpenSearch operations. A lower limit provides greater safety but can result in more frequent cache evictions.

To configure the circuit breaker limit, send the following request:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.neural_search.circuit_breaker.limit": "30%"
  }
}
```
{% include copy-curl.html %}

The circuit breaker bounds the Lucene engine's JVM heap cache. It has no effect on the native engine, which holds its index in a memory-mapped file managed by the operating system. For more information, see [Native engine](#native-engine).
{: .note}

For more information, see [Neural Search plugin settings]({{site.url}}{{site.baseurl}}/vector-search/settings/#neural-search-plugin-settings).

### Monitoring

Monitor memory usage and query statistics using the [Neural Search Stats API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#stats).

The sparse memory statistics report Lucene engine cache usage only. Native engine index memory is held in operating system page cache and is not reflected in these statistics.
{: .note}

## Performance tuning

Neural sparse ANN search provides multiple parameters for balancing search accuracy and query speed. For comprehensive tuning guidance, see [Neural sparse ANN search performance tuning]({{site.url}}{{site.baseurl}}/vector-search/performance-tuning-sparse/).

## Next steps

- For query syntax, see [Neural sparse query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural-sparse/).
- For field type information, see [Sparse vector]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/sparse-vector/).
- For performance optimization, see [Neural sparse ANN search performance tuning]({{site.url}}{{site.baseurl}}/vector-search/performance-tuning-sparse/).
- For filtering options, see [Filtering in neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/filtering-in-sparse-search/).