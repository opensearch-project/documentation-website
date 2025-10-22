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
- **Memory efficiency**: Uses optimized caching strategies, byte quantization, and circuit breakers to manage memory usage and prevent resource exhaustion.
- **Hybrid approach**: Automatically selects the optimal indexing strategy based on segment size, with minimal impact on indexing performance.
- **Search flexibility**: Provides tunable trade-offs between high recall and low latency using query parameters.

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
   - Applies a clustering algorithm to group similar documents into one cluster.
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

- Segments with fewer documents than `approximate_threshold`: Indexed as plain neural sparse (`rank_features`) segments and queried using the standard neural sparse query.

- Segments with more documents than `approximate_threshold`: Indexed as neural sparse ANN segments and queried using the sparse ANN query.

This hybrid approach balances indexing performance with query speed. Small segments avoid the overhead of clustering, while large segments benefit from approximate search optimizations. The system maintains backward compatibility by supporting both traditional neural sparse queries and neural sparse ANN queries within the same index.

For more information about the SEISMIC algorithm, see [Efficient Inverted Indexes for Approximate Retrieval over Learned Sparse Representations](https://arxiv.org/abs/2404.18812).

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
| `heap_factor` | Controls recall vs. performance trade-off |
| `filter` | Optional Boolean filter for pre-filtering or post-filtering |

## Filtering support

Neural sparse ANN search supports both pre-filtering and post-filtering approaches. For more information, see [Filtering in neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/filtering-in-sparse-search/).

## Cluster settings

Neural sparse ANN search supports the following cluster settings.

### Thread pool configuration

Building a clustered inverted index structure requires intensive computation. By default, the algorithm uses a single-threaded thread pool to build clusters. You can increase the thread pool size to build clusters in parallel, using more CPU cores and reducing index build time. 

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

Neural sparse ANN search provides a circuit breaker that prevents the algorithm from using excessive memory and ensures that other OpenSearch operations remain unaffected. The default value of `circuit_breaker.limit` is `10%`. you can adjust this setting to control the total memory allocated to the algorithm. When memory usage reaches the defined limit, a cache eviction occurs, removing the least recently used data. 

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

For more information, see [Neural Search plugin settings]({{site.url}}{{site.baseurl}}/vector-search/settings/#neural-search-plugin-settings).

### Monitoring

Monitor memory usage and query statistics using the [Neural Search Stats API]({{site.url}}{{site.baseurl}}/vector-search/api/neural/#stats).

## Performance tuning

Neural sparse ANN search provides multiple parameters for balancing search accuracy and query speed. For comprehensive tuning guidance, see [Neural sparse ANN search performance tuning]({{site.url}}{{site.baseurl}}/vector-search/performance-tuning-sparse/).

## Next steps

- For query syntax, see [Neural sparse query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural-sparse/).
- For field type information, see [Sparse vector]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/sparse-vector/).
- For performance optimization, see [Neural sparse ANN search performance tuning]({{site.url}}{{site.baseurl}}/vector-search/performance-tuning-sparse/).
- For filtering options, see [Filtering in neural sparse ANN search]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/filtering-in-sparse-search/).