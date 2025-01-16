---
layout: default
title: Vector data types
parent: Creating a vector index
nav_order: 10
---

# Vector data types

The k-NN plugin introduces a custom data type, the `knn_vector`, that allows users to ingest their k-NN vectors into an OpenSearch index and perform different kinds of k-NN search. The `knn_vector` field is highly configurable and can serve many different k-NN workloads. For more information, see [k-NN vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/).


When defining a `knn_vector` field in OpenSearch, you can select from different data types to balance storage requirements and performance. By default, k-NN vectors are float vectors, but you can also opt for byte or binary vectors for more efficient storage.

## Float vectors

Float is the default type for `knn_vector` fields.

- **Default type**: Each dimension is stored as a 4-byte floating-point number.
- **Precision**: High, suitable for applications requiring maximum accuracy.
- **Use case**: Best for scenarios where storage cost is not a primary concern and precision is critical.

## Byte vectors

Starting with k-NN plugin version 2.17, you can use `byte` vectors with the `faiss` and `lucene` engines to reduce the amount of required memory and storage space. For more information, see [Byte vectors]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#byte-vectors).

- **Storage efficiency**: Each dimension is stored as a signed 8-bit integer, reducing storage space significantly.
  - Value range: [-128, 127].
- **Engines supported**: Available when using the `faiss` or `lucene` engine.
- **Use case**: Ideal for applications that prioritize storage efficiency and can tolerate reduced precision.

## Binary vectors

Starting with k-NN plugin version 2.16, you can use `binary` vectors with the `faiss` engine to reduce the amount of required storage space. For more information, see [Binary vectors]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#binary-vectors).

- **Storage efficiency**: Memory costs are reduced by a factor of 32 compared to float vectors.
- **Performance**: Provides high recall performance while significantly lowering operational costs.
- **Use case**: Suitable for large-scale deployments where cost-efficiency is crucial without sacrificing search performance.

### Choosing the right data type

The choice of data type for your `knn_vector` field depends on your specific use case:

- **Float vectors**: Use when high precision is essential, and storage space is not a limiting factor.
- **Byte vectors**: Use to save storage space while maintaining acceptable precision levels, especially for large datasets.
- **Binary vectors**: Use to achieve cost efficiency and scalability with acceptable trade-offs in precision.

By selecting the appropriate data type, you can optimize storage, performance, and cost-effectiveness for your OpenSearch deployment.


## SIMD optimization for the Faiss engine

Starting with version 2.13, the k-NN plugin supports [Single Instruction Multiple Data (SIMD)](https://en.wikipedia.org/wiki/Single_instruction,_multiple_data) processing if the underlying hardware supports SIMD instructions (AVX2 on x64 architecture and Neon on ARM64 architecture). SIMD is supported by default on Linux machines only for the Faiss engine. SIMD architecture helps boost overall performance by improving indexing throughput and reducing search latency. Starting with version 2.18, the k-NN plugin supports AVX512 SIMD instructions on x64 architecture. 

SIMD optimization is applicable only if the vector dimension is a multiple of 8.
{: .note}

<!-- vale off -->
### x64 architecture
<!-- vale on -->

For x64 architecture, the following versions of the Faiss library are built and shipped with the artifact:

- `libopensearchknn_faiss.so`: The non-optimized Faiss library without SIMD instructions. 
- `libopensearchknn_faiss_avx512.so`: The Faiss library containing AVX512 SIMD instructions. 
- `libopensearchknn_faiss_avx2.so`: The Faiss library containing AVX2 SIMD instructions.

When using the Faiss library, the performance ranking is as follows: AVX512 > AVX2 > no optimization.
{: .note }

If your hardware supports AVX512, the k-NN plugin loads the `libopensearchknn_faiss_avx512.so` library at runtime.

If your hardware supports AVX2 but doesn't support AVX512, the k-NN plugin loads the `libopensearchknn_faiss_avx2.so` library at runtime.

To disable the AVX512 and AVX2 SIMD instructions and load the non-optimized Faiss library (`libopensearchknn_faiss.so`), specify the `knn.faiss.avx512.disabled` and `knn.faiss.avx2.disabled` static settings as `true` in `opensearch.yml` (by default, both of these are `false`).

Note that to update a static setting, you must stop the cluster, change the setting, and restart the cluster. For more information, see [Static settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#static-settings).

### ARM64 architecture

For the ARM64 architecture, only one performance-boosting Faiss library (`libopensearchknn_faiss.so`) is built and shipped. The library contains Neon SIMD instructions and cannot be disabled. 