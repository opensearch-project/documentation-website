---
layout: default
title: Faiss product quantization 
parent: Vector quantization
grand_parent: Optimizing vector storage
nav_order: 30
has_children: false
has_math: true
---

# Faiss product quantization

Product quantization (PQ) is a technique used to represent a vector using a configurable number of bits. In general, it can be used to achieve a higher level of compression as compared to byte or scalar quantization. PQ works by separating vectors into _m_ subvectors and encoding each subvector with _code_size_ bits. Thus, the total amount of memory for the vector is `m*code_size` bits, plus overhead. For details about the parameters, see [PQ parameters]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/#pq-parameters). PQ is only supported for the _Faiss_ engine and can be used with either the _HNSW_ or _IVF_ approximate nearest neighbor (ANN) algorithms.

## Using Faiss product quantization

To minimize loss in accuracy, PQ requires a _training_ step that builds a model based on the distribution of the data that will be searched.

The product quantizer is trained by running k-means clustering on a set of training vectors for each subvector space and extracts the centroids to be used for encoding. The training vectors can be either a subset of the vectors to be ingested or vectors that have the same distribution and dimension as the vectors to be ingested.

In OpenSearch, the training vectors need to be present in an index. In general, the amount of training data will depend on which ANN algorithm is used and how much data will be stored in the index. For IVF-based indexes, a recommended number of training vectors is `max(1000*nlist, 2^code_size * 1000)`. For HNSW-based indexes, a recommended number is `2^code_size*1000`. See the [Faiss documentation](https://github.com/facebookresearch/faiss/wiki/FAQ#how-many-training-points-do-i-need-for-k-means) for more information about the methodology used to calculate these figures.

For PQ, both _m_ and _code_size_ need to be selected. _m_ determines the number of subvectors into which vectors should be split for separate encoding. Consequently, the _dimension_ needs to be divisible by _m_. _code_size_ determines the number of bits used to encode each subvector. In general, we recommend a setting of `code_size = 8` and then tuning _m_ to get the desired trade-off between memory footprint and recall.

For an example of setting up an index with PQ, see the [Building a vector index from a model]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/#building-a-vector-index-from-a-model) tutorial.

## Memory estimation

While PQ is meant to represent individual vectors with `m*code_size` bits, in reality, the indexes consume more space. This is mainly because of the overhead of storing certain code tables and auxiliary data structures.

Some of the memory formulas depend on the number of segments present. This is not typically known beforehand, but a recommended default value is 300.
{: .note}

### HNSW memory estimation

The memory required for HNSW with PQ is estimated to be `1.1*(((pq_code_size / 8) * pq_m + 24 + 8 * hnsw_m) * num_vectors + num_segments * (2^pq_code_size * 4 * d))` bytes.

As an example, assume that you have 1 million vectors with a dimension of 256, `hnsw_m` of 16, `pq_m` of 32, `pq_code_size` of 8, and 100 segments. The memory requirement can be estimated as follows:

```r
1.1 * ((8 / 8 * 32 + 24 + 8 * 16) * 1000000 + 100 * (2^8 * 4 * 256)) ~= 0.215 GB
```

### IVF memory estimation

The memory required for IVF with PQ is estimated to be `1.1*(((pq_code_size / 8) * pq_m + 24) * num_vectors  + num_segments * (2^code_size * 4 * d + 4 * ivf_nlist * d))` bytes.

For example, assume that you have 1 million vectors with a dimension of 256, `ivf_nlist` of 512, `pq_m` of 32, `pq_code_size` of 8, and 100 segments. The memory requirement can be estimated as follows:

```r
1.1 * ((8 / 8 * 64 + 24) * 1000000  + 100 * (2^8 * 4 * 256 + 4 * 512 * 256))  ~= 0.171 GB
```

## Next steps

- [Memory-optimized vectors]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-memory-optimized/)
- [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/)