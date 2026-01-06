---
layout: default
title: Spaces
parent: k-NN vector
grand_parent: Supported field types
redirect_from:
  - /field-types/supported-field-types/knn-spaces/
nav_order: 10
has_math: true
---

# Spaces

In vector search, a _space_ defines how the distance (or similarity) between two vectors is calculated. The choice of space affects how nearest neighbors are determined during search operations. 

## Distance calculation

A space defines the function used to measure the distance between two points in order to determine the k-nearest neighbors. In k-NN search, a lower score equates to a closer and better result. This is the opposite of how OpenSearch scores results, where a higher score equates to a better result. OpenSearch supports the following spaces. 

Not every method/engine combination supports each of the spaces. For a list of supported spaces, see the section for a specific engine in the [method documentation]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-methods-engines/).
{: .note}

| Space type | Search type | Distance function ($$d$$ ) | OpenSearch score |
| :--- | :--- | :--- |
| `l1`  | Approximate, exact | $$ d(\mathbf{x}, \mathbf{y}) = \sum_{i=1}^n \lvert x_i - y_i \rvert $$ | $$ score = {1 \over {1 + d} } $$ |
| `l2`  | Approximate, exact | $$ d(\mathbf{x}, \mathbf{y}) = \sum_{i=1}^n (x_i - y_i)^2 $$ | $$ score = {1 \over 1 + d } $$ |
| `linf` | Approximate, exact | $$ d(\mathbf{x}, \mathbf{y}) = max(\lvert x_i - y_i \rvert) $$ | $$ score = {1 \over 1 + d } $$ |
| `cosinesimil` | Approximate, exact | $$ d(\mathbf{x}, \mathbf{y}) = 1 - cos { \theta } = 1 - {\mathbf{x} \cdot \mathbf{y} \over \lVert \mathbf{x}\rVert \cdot \lVert \mathbf{y}\rVert}$$$$ = 1 - {\sum_{i=1}^n x_i y_i \over \sqrt{\sum_{i=1}^n x_i^2} \cdot \sqrt{\sum_{i=1}^n y_i^2}}$$, <br> where $$\lVert \mathbf{x}\rVert$$ and $$\lVert \mathbf{y}\rVert$$ represent the norms of vectors $$\mathbf{x}$$ and $$\mathbf{y}$$, respectively. | $$ score = {2 - d \over 2} $$ |
| `innerproduct` (supported for Lucene in OpenSearch version 2.13 and later) | Approximate | **NMSLIB** and **Faiss**:<br> $$ d(\mathbf{x}, \mathbf{y}) = - {\mathbf{x} \cdot \mathbf{y}} = - \sum_{i=1}^n x_i y_i $$  <br><br>**Lucene**:<br> $$ d(\mathbf{x}, \mathbf{y}) = {\mathbf{x} \cdot \mathbf{y}} = \sum_{i=1}^n x_i y_i $$ | **NMSLIB** and **Faiss**:<br> $$ \text{If} d \ge 0,  score = {1 \over 1 + d }$$ <br> $$\text{If} d < 0, score = −d + 1$$  <br><br>**Lucene:**<br> $$ \text{If} d > 0, score = d + 1 $$ <br> $$\text{If} d \le 0, score = {1 \over 1 + (-1 \cdot d) }$$ |
| `innerproduct` (supported for Lucene in OpenSearch version 2.13 and later) | Exact | $$ d(\mathbf{x}, \mathbf{y}) = - {\mathbf{x} \cdot \mathbf{y}} = - \sum_{i=1}^n x_i y_i $$ | $$ \text{If} d \ge 0,  score = {1 \over 1 + d }$$ <br> $$\text{If} d < 0, score = −d + 1$$ |
| `hamming` (supported for binary vectors in OpenSearch version 2.16 and later) | Approximate, exact | $$ d(\mathbf{x}, \mathbf{y}) = \text{countSetBits}(\mathbf{x} \oplus \mathbf{y})$$ | $$ score = {1 \over 1 + d } $$ |
| `hammingbit` (supported for binary and long vectors) | Exact | $$ d(\mathbf{x}, \mathbf{y}) = \text{countSetBits}(\mathbf{x} \oplus \mathbf{y})$$ | $$ score = {1 \over 1 + d } $$ |

The cosine similarity formula does not include the `1 -` prefix. However, because similarity search libraries equate lower scores with closer results, they return `1 - cosineSimilarity` for the cosine similarity space---this is why `1 -` is included in the distance function.
{: .note }

With cosine similarity, it is not valid to pass a zero vector (`[0, 0, ...]`) as input. This is because the magnitude of such a vector is 0, which raises a `divide by 0` exception in the corresponding formula. Requests containing the zero vector will be rejected, and a corresponding exception will be thrown.
{: .note }

The `hamming` space type is supported for binary vectors in OpenSearch version 2.16 and later. For more information, see [Binary k-NN vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized#binary-vectors).
{: .note}

When using `cosinesimil` with the Faiss engine, vectors are automatically normalized to unit length during indexing because Faiss uses inner product on normalized vectors internally. If your vectors are already normalized, consider using `innerproduct` instead of `cosinesimil` to obtain equivalent results with explicit control over normalization.
{: .important}

## Specifying the space type

The space type is specified when creating an index.

You can specify the space type at the top level of the field mapping:

```json
PUT /test-index
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "my_vector1": {
        "type": "knn_vector",
        "dimension": 3,
        "space_type": "l2"
      }
    }
  }
}
```
{% include copy-curl.html %}

Alternatively, you can specify the space type within the `method` object if defining a method:

```json
PUT test-index
{
  "settings": {
    "index": {
      "knn": true,
      "knn.algo_param.ef_search": 100
    }
  },
  "mappings": {
    "properties": {
      "my_vector1": {
        "type": "knn_vector",
        "dimension": 1024,
        "method": {
          "name": "hnsw",
          "space_type": "l2",
          "engine": "nmslib",
          "parameters": {
            "ef_construction": 128,
            "m": 24
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}
