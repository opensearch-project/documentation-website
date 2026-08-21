---
layout: default
title: Opensearch-jvector plugin
parent: Installing plugins
nav_order: 30

---

# Opensearch-jvector plugin

The `opensearch-jvector` plugin enables running the nearest neighbor search on billions of documents with upto 16,000 dimensions with the same ease as running any regular OpenSearch query. Aggregations and filter clauses can be applied to further refine similarity search operations.

## Differences between opensearch-jvector and k-NN

The following table highlights the differences that matter most when choosing between the built-in `k-NN` plugin and `opensearch-jvector`:

| Aspect                   | `k-NN`                                   | `opensearch-jvector`                                                      |
| :----------------------- | :--------------------------------------- | :------------------------------------------------------------------------ |
| **Vector engines**       | `Nmslib`, `Faiss`, `lucene`              | `jvector` (primary), `lucene`                                             |
| **Concurrent ingestion** | Supported by some vector engines         | `jvector` supports concurrent inserts, enabling high-throughput ingestion |
| **Index update cost**    | Usually a full rebuild required on merge | Incremental merges — no full rebuilds for updates                         |
| **Memory efficiency**    | In-memory indexing                       | DiskANN-style quantization                                                |

## Use cases of plugin

`opensearch-jvector` is a strong choice when any of the following apply to your workload:

- **Your data grows continuously.** Incremental index updates and concurrent ingestion avoid the costly full rebuilds that occur with k-NN on high-update workloads.
- **Your dataset is larger than available memory.** DiskANN-style indexing with quantization-based reranking keeps recall high while memory usage stays bounded.

Typical use cases include recommendation systems, image and video similarity search, semantic document search, and fraud detection pipelines that index millions to billions of vectors.

## Unique features

- **DiskANN Implementation (Pure Java)** - Based on `jvector` library, a pure Java implementation of DiskANN-style approximate nearest neighbour (ANN) search optimized for memory-constrained environments. It eliminates the need for native libraries such as `Faiss` and avoids the complexity and overhead associated with JNI, simplifying deployment and maintenance.
- **Scalable Thread-Safe Design** - The index is fully thread-safe and supports concurrent updates and insertions with near-linear scalability as CPU cores increase. The underlying `jvector` library enables high-throughput ingestion without relying on costly merge operations to achieve parallelism.
- **Quantization Refinement During Merges** - The system refines quantization codebooks incrementally during merge operations. This approach improves search accuracy and recall without requiring a complete recomputation of codebooks, reducing computational overhead.
- **Incremental Index Updates** - `jvector` allows incremental insertion of vectors into existing indexes. This providing efficiency gains over full index rebuilds for workloads involving frequent updates, particularly for large graph-based indexes.
- **Quantized DiskANN with Reranking** - `jvector` supports DiskANN-style quantization combined with reranking, delivering significant performance improvements for datasets larger than available memory. This approach is particularly effective for large-scale deployments where traditional in-memory indexing is not feasible.
- **Product Quantization (PQ)** - PQ is implemented with high-performance SIMD optimizations and separate codebooks to enable fast vector searches with low memory usage.
- **Advanced Quantization Techniques** - `jvector` includes advanced capabilities such as Non-Uniform Vector Quantization (NVQ), and Anisotropic PQ, enabling more efficient and accurate similarity computations beyond standard quantization approaches.

## Installation

**1. Remove Existing k-NN and neural-search Plugins** (make sure no `knn` enabled indexes are created)

```bash
bin/opensearch-plugin remove opensearch-neural-search
bin/opensearch-plugin remove opensearch-knn
```

**2. Install `opensearch-jvector` Plugin**

```bash
bin/opensearch-plugin install opensearch-jvector
```

## OpenSearch compatible features

- Product Quantization (since: 3.5.0)
- MMR Search (since: 3.6.0)
- Derived Sources (since: 3.6.0)

## Limitations

- `opensearch-jvector` plugin is not part of the default OpenSearch distribution
- `opensearch-knn` and `opensearch-jvector` cannot be installed simultaneously
- `opensearch-jvector` is not recognized by the upstream version of `opensearch-neural-search` plugin.
