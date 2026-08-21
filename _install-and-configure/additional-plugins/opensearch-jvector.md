---
layout: default
title: OpenSearch JVector plugin
parent: Installing plugins
nav_order: 30
---

# OpenSearch JVector plugin
**Introduced 3.5**
{: .label .label-purple }

The `opensearch-jvector` plugin provides the `jvector` engine for [vector search]({{site.url}}{{site.baseurl}}/vector-search/). The engine implements DiskANN-style approximate nearest neighbor search in pure Java using the [JVector](https://github.com/datastax/jvector) library, so it needs no native libraries and no Java Native Interface (JNI) layer. It supports vectors of up to 16,000 dimensions and indexes containing billions of documents, and you can refine searches with aggregations and filter clauses in the same way as with the built-in engines.

Because the `jvector` engine builds indexes from quantized vectors that are read from disk, memory use stays bounded as a dataset grows beyond available memory. The engine also accepts concurrent inserts and merges segments incrementally, so it avoids the graph rebuilds that continuous indexing causes with the built-in engines. These properties make it suitable for recommendation systems, image and video similarity search, semantic document search, and fraud detection pipelines that index millions to billions of vectors.

The plugin replaces the k-NN plugin, so it also provides the `lucene` engine, which works the same way as in the k-NN plugin. The `faiss` and `nmslib` engines aren't available.

The `opensearch-jvector` plugin isn't included in any OpenSearch distribution, and it can't run alongside the k-NN plugin. Installing it requires removing `opensearch-knn`.
{: .note}

## Features

The `jvector` engine provides the following capabilities:

- Because the engine is written in pure Java and needs no native libraries or JNI layer, deployment and maintenance are simpler than with the built-in engines.
- Indexes are fully thread-safe and accept concurrent inserts and updates, scaling nearly linearly as the number of CPU cores increases. Ingestion throughput doesn't depend on merge operations for parallelism.
- Vectors can be added to an existing index incrementally, avoiding the full index rebuilds that frequent updates require, especially for large graph-based indexes.
- Quantization codebooks are refined incrementally during merges. This improves search accuracy and recall without recomputing the codebooks and reduces computational overhead.
- DiskANN-style quantization is combined with reranking, which keeps recall high for datasets larger than available memory, for which in-memory indexing isn't feasible.
- Product quantization (PQ) uses single instruction, multiple data (SIMD) optimizations and separate codebooks, providing fast search with low memory use.
- Advanced quantization techniques, such as Non-Uniform Vector Quantization (NVQ) and anisotropic PQ, compute similarity more accurately and with fewer resources than standard quantization.

## Comparison with the k-NN plugin

The following table compares the built-in k-NN plugin with the `opensearch-jvector` plugin. The last three rows describe the `jvector` engine; the `lucene` engine is unchanged from the k-NN plugin.

| Aspect | k-NN plugin | JVector plugin |
| :--- | :--- | :--- |
| Engines | `faiss`, `lucene`, and `nmslib` (deprecated) | `jvector` and `lucene` |
| Methods | `hnsw` and `ivf` | `disk_ann` for `jvector` and `hnsw` for `lucene` |
| Default engine | `faiss` | `jvector` |
| Included in distributions | Yes | No |
| Concurrent ingestion | Varies by engine | The `jvector` engine accepts concurrent inserts |
| Index update cost | Graphs are rebuilt when segments merge | Merges are incremental, with no full graph rebuilds |
| Memory use | Vectors are held in memory unless you configure on-disk mode | Vectors are quantized and read from disk |

For the methods, parameters, and space types that the `jvector` engine supports, see [JVector engine]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/#jvector-engine).

## Installation

Removing the k-NN plugin makes indexes that use the `faiss` or `nmslib` engine unreadable. Before you begin, confirm that no index in the cluster uses either engine, or reindex that data using the `lucene` engine while the k-NN plugin is still installed. Indexes that use the `lucene` engine remain searchable after the `opensearch-jvector` plugin is installed.
{: .warning}

Repeat the following steps on every node in the cluster:

1. Stop OpenSearch on the node.
1. Remove the neural search and k-NN plugins. Remove `opensearch-neural-search` first, because it depends on `opensearch-knn`:

    ```bash
    bin/opensearch-plugin remove opensearch-neural-search
    bin/opensearch-plugin remove opensearch-knn
    ```
    {% include copy.html %}

1. Install the `opensearch-jvector` plugin from Maven Central:

    ```bash
    bin/opensearch-plugin install https://repo1.maven.org/maven2/org/opensearch/plugin/opensearch-jvector-plugin/{{site.opensearch_version}}.0/opensearch-jvector-plugin-{{site.opensearch_version}}.0.zip
    ```
    {% include copy.html %}

1. Start OpenSearch on the node.

For a full list of available plugin versions, see the [`opensearch-jvector-plugin` directory](https://repo1.maven.org/maven2/org/opensearch/plugin/opensearch-jvector-plugin/) in Maven Central. To skip the prompt that requests confirmation of the plugin's additional permissions, add the `--batch` option to the `install` command. For more information, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).

To confirm that the plugin is installed, use the [CAT Plugins API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-plugins/):

```json
GET _cat/plugins?v
```
{% include copy-curl.html %}

The response contains a row for `opensearch-jvector` on each node.

## Supported OpenSearch features

The plugin supports the following OpenSearch vector search features.

| Feature | Available in plugin version |
| :--- | :--- |
| [Product quantization (PQ)]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/knn-vector-quantization/) | 3.5.0 |
| [Maximal marginal relevance (MMR) reranking]({{site.url}}{{site.baseurl}}/vector-search/specialized-operations/vector-search-mmr/) | 3.6.0 |
| [Derived source]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/source/#derived-source) | 3.6.0 |

## Limitations

The plugin has the following limitations:

- The plugin isn't part of any OpenSearch distribution, so you must install it manually on every node.
- The plugin and `opensearch-knn` can't be installed in the same cluster.
- The upstream `opensearch-neural-search` plugin doesn't recognize the `jvector` engine, so neural and hybrid queries aren't available.

## Related documentation

- [JVector engine]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/#jvector-engine)
- [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/)
- [Vector search]({{site.url}}{{site.baseurl}}/vector-search/)
- [Using a JVector efficient filter]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/efficient-knn-filtering/#using-a-jvector-efficient-filter)
