---
layout: default
title: Vector data types
parent: Creating a vector index
nav_order: 10
---

# Vector data types

The `knn_vector` data type allows you to ingest vectors into an OpenSearch index and perform different kinds of vector search. The `knn_vector` field is highly configurable and can serve many different k-NN workloads. For more information, see [k-NN vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/).

When defining a `knn_vector` field in OpenSearch, you can select from different data types to balance storage requirements and performance. By default, k-NN vectors are float vectors, but you can also opt for byte or binary vectors for more efficient storage.

## Float vectors

Float is the default type for `knn_vector` fields. Each dimension is stored as a 4-byte floating-point number.

## Byte vectors

Starting with OpenSearch version 2.17, you can use `byte` vectors with the `faiss` and `lucene` engines to reduce the amount of required memory and storage space. Each dimension is stored as a signed 8-bit integer, significantly reducing storage space. For more information, see [Byte vectors]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#byte-vectors).

## Binary vectors

Starting with OpenSearch version 2.16, you can use `binary` vectors with the `faiss` engine to reduce the amount of required storage space. For more information, see [Binary vectors]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#binary-vectors).

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