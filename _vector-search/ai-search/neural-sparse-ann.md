---
layout: default
title: Sparse ANN
parent: Neural sparse search
grand_parent: AI search
nav_order: 60
has_children: true
---

# Sparse Approximate Search
Introduced 3.3.0
{: .label .label-purple }

**A**pproximate **N**earest **N**eighbor (ANN) algorithm gets more and more popular in recent days with its query efficiency and flexibility of tuning the trade-off between accuracy and latency. Among so many kinds of ANN algorithms, SEISMIC (**S**pilled Clust**e**ring of **I**nverted Lists with **S**ummaries for **M**aximum **I**nner Produ**c**t Search from "[Efficient Inverted Indexes for Approximate Retrieval over Learned Sparse Representations](https://arxiv.org/abs/2404.18812)" paper) is specifically designed to accelerate neural sparse search. Unlike sparse encoding methods, SEISMIC is not an encoding algorithm itself, but rather an indexing and retrieval optimization technique that significantly improves query performance for existing neural sparse vectors.

SEISMIC brings better scalability for neural sparse search especially for those large-scale datasets with billions of vectors. This innovative approach leverages clustered posting lists and approximate retrieval techniques to maintain consistently fast query speeds, even as data scales exponentially. SEISMIC's architecture ensures that query performance remains robust and efficient regardless of dataset size, providing the scalability needed for enterprise-level neural sparse search applications.

Now, sparse ANN is available with SEISMIC algorithm in the Neural-Search plugin to provide outstanding sparse vector query performance.

## How sparse ANN works

Sparse ANN operates through a series of sophisticated techniques that optimizes both indexing and querying of neural sparse vectors:

### Indexing

During the indexing phase, sparse ANN implements several key optimizations:

1. **Posting list clustering**: For each term in the inverted index, sparse ANN:
   - Sorts documents by their token weights in descending order
   - Retains only the top `n_postings` documents with highest weights
   - Applies a clustering algorithm to group similar documents into one cluster
   - Generates summary sparse vectors for each cluster, keeping only the top large-weighted tokens

2. **Forward index maintenance**: Sparse ANN maintains both the clustered inverted index and a forward index that stores all sparse vectors for efficient access during query processing.

### Query processing

During query execution, sparse ANN employs an efficient retrieval process:

1. **Token-level pruning**: Once a query is given to sparse ANN, all its tokens will be sorted based on their weights. Only the `top_n` tokens with the highest weights will be kept, so that fewer posting lists will be visited.

2. **Cluster-level pruning**: The algorithm first computes dot product scores between the query vector and cluster summary vectors. Only clusters with scores above a dynamic threshold are selected for detailed examination.

3. **Document-level scoring**: For selected clusters, sparse ANN examines individual documents within those clusters, computing exact dot product scores between the query and document vectors retrieved from the forward index.

This approach dramatically reduces the number of documents that need to be scored, resulting in significant performance improvements while maintaining high accuracy.

### Hybrid indexing behavior

Sparse ANN uses a hybrid indexing approach based on doc size on segments to achieve a balance between indexing performance and query performance:

- **Segments with doc count below `approximate_threshold`**: Still build plain neural sparse (rank features) segments and search with existing neural sparse query
- **Segments with doc count above `approximate_threshold`**: Build sparse ANN segments and search with sparse ANN query

This ensures optimal performance across different data scales while maintaining indexing efficiency for smaller datasets. It also provides good backward compatibility that users can still make plain neural sparse query

# Key benefits

Sparse ANN offers several advantages over traditional neural sparse search approaches:

- **Significant query performance improvement**: Achieves astonishing query speed improvement compared to two-phase queries under ≥90% recall conditions
- **Scalability**: Maintains consistent query performance even as datasets scale to 50 Million vectors in a single node
- **Memory efficiency**: Uses optimized caching strategies and quantization to manage memory usage
- **Hybrid approach**: Automatically selects the optimal indexing strategy based on segment size
- **High search flexibility**: Users can smoothly tune the trade-off between high recall and low latency with the help of `top_n` & `heap_factor` these two parameters

## Configuration parameters

Sparse ANN provides several parameters to optimize performance for different use cases:

### Index-level settings

- **index.sparse**: Boolean flag to enable sparse ANN fields in the index

### Field mapping parameters

- **n_postings**: Number of top documents to retain for each posting list (default: 0.0005 * document number in a segment)
- **cluster_ratio**: Ratio used to determine cluster count in posting lists (default: 0.1)
- **summary_prune_ratio**: Ratio of token weights to keep in cluster summary vectors (default: 0.4)
- **approximate_threshold**: Document count threshold that triggers sparse ANN algorithm on a segment (default: 1,000,000)

More details can be seen in [sparse ANN index setting]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/index/)

### Query parameters

- **top_n**: Number of most important query tokens to retain (default: 10)
- **k**: Number of nearest neighbors to return (default: 10)
- **heap_factor**: Tuning parameter for recall vs. QPS trade-off (default: 1.0)
- **filter**: Optional boolean filter for pre-filtering or post-filtering

More details can be seen in [sparse ANN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural-sparse/)

## Performance characteristics

Sparse ANN is designed to excel in large-scale scenarios:

- **Query performance**: Significant improvement over two-phase queries with ≥90% recall
- **Memory usage**: Configurable caching strategies with circuit breakers to prevent resource exhaustion
- **Indexing overhead**: Minimal impact on indexing performance through hybrid approach
- **Scalability**: Better than linear performance scaling with dataset size

## Filtering support

Sparse ANN supports both pre-filtering and post-filtering approaches. See [Filtering in Sparse Search]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/sparse-filter/).

## Memory management

Sparse ANN implements sophisticated memory management strategies:

- **Flexible caching**: Configurable strategies allowing users to balance query performance against memory usage
- **Circuit breakers**: Prevent memory exhaustion and service degradation
- **Quantization support**: Multiple quantization levels to reduce memory footprint

## When to use sparse ANN

Sparse ANN is particularly beneficial for:

- **Large-scale applications**: Datasets with millions to billions of documents where query performance is critical
- **High-throughput scenarios**: Applications requiring fast response times under heavy query loads

Consider sparse ANN when you need the efficiency of sparse retrieval but require better performance than traditional neural sparse search methods can provide at scale.

## Getting started

To implement sparse ANN in your OpenSearch cluster:

1. **Enable sparse indexing**: Set `index.sparse: true` in your index settings
2. **Configure field mappings**: Define sparse ANN field mappings with appropriate parameters
3. **Tune parameters**: Adjust clustering and query parameters based on your dataset characteristics
4. **Monitor performance**: Use OpenSearch monitoring tools to track query performance and memory usage

For detailed setup instructions, see [sparse ANN configuration]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann-configuration/).

## Next steps

- [Configure sparse ANN]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-ann-configuration/) for detailed setup instructions
- [Explore sparse ANN performance tuning]({{site.url}}{{site.baseurl}}/vector-search/performance-tuning-sparse/) for practical implementation guidance
- Learn about [neural sparse search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-search/) fundamentals

## Further reading

- [Original SEISMIC paper](https://arxiv.org/abs/2404.18812): "Efficient Inverted Indexes for Approximate Retrieval over Learned Sparse Representations"
- [OpenSearch neural sparse search blog](https://opensearch.org/blog/improving-document-retrieval-with-sparse-semantic-encoders/): Learn about sparse encoding fundamentals
- [Neural sparse search documentation]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-search/): Core concepts and implementation