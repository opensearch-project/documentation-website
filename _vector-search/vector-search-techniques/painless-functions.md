---
layout: default
title: Painless extensions
nav_order: 25
parent: Exact k-NN search with a scoring script
grand_parent: Vector search techniques
has_children: false
has_math: true
redirect_from:
  - /search-plugins/knn/painless-functions/ 
---

# Painless scripting extensions

With Painless scripting extensions, you can use k-nearest neighbors (k-NN) distance functions directly in your Painless scripts to perform operations on `knn_vector` fields. Painless has a strict list of allowed functions and classes per context to ensure that its scripts are secure. For more information, see [Painless scripting language]({{site.url}}{{site.baseurl}}/scripting/painless/). OpenSearch adds Painless scripting extensions to a few of the distance functions used in [k-NN scoring script]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-score-script/), so you can use them to customize your k-NN workload.

## Using k-NN distance functions in a script

To use k-NN Painless scripting functions, first create an index with `knn_vector` fields, as described in [Getting started with the scoring script for vectors]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-score-script#getting-started-with-the-scoring-script-for-vectors). Once you have created the index and ingested some data, you can use Painless extensions:

```json
GET my-knn-index-2/_search
{
  "size": 2,
  "query": {
    "script_score": {
      "query": {
        "bool": {
          "filter": {
            "term": {
              "color": "BLUE"
            }
          }
        }
      },
      "script": {
        "source": "1.0 + cosineSimilarity(params.query_value, doc[params.field])",
        "params": {
          "field": "my_vector",
          "query_value": [9.9, 9.9]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Note the following requirements:

- `field` must map to a `knn_vector` field.
- `query_value` must be a floating-point array with the same dimension as `field`.
- Each document must contain a value in the vector field. If some documents might not contain a value, check whether a document contains a value in the field before calling the function:

  ```
  "source": "doc[params.field].size() == 0 ? 0 : 1 / (1 + l2Squared(params.query_value, doc[params.field]))",
  ```

  Because scores can only be positive, this script ranks documents that contain a vector field higher than documents that don't.
- For cosine similarity, the query vector can't be a zero vector (`[0, 0, ...]`), because the magnitude of a zero vector is `0` and the cosine similarity formula would divide by zero.

## Function types

The following table describes the Painless functions OpenSearch provides.

Function name | Function signature | Description
:--- | :--- | :---
`l2Squared` | `float l2Squared (float[] queryVector, doc['vector field'])` | This function calculates the square of the L2 distance (Euclidean distance) between a given query vector and document vectors. A shorter distance indicates a more relevant document, so this example inverts the return value of the `l2Squared` function. If the document vector matches the query vector, the result is `0`, so this example also adds `1` to the distance to avoid divide-by-zero errors.
`l1Norm` | `float l1Norm (float[] queryVector, doc['vector field'])` | This function calculates the L1 norm distance (Manhattan distance) between a given query vector and document vectors.
`cosineSimilarity` | `float cosineSimilarity (float[] queryVector, doc['vector field'])` | Cosine similarity is an inner product of the query vector and document vector normalized to both have a length of `1`. If the magnitude of the query vector doesn't change throughout the query, you can pass the squared magnitude of the query vector (the sum of the squares of its values) to improve performance instead of repeatedly calculating the magnitude for every filtered document:<br /> `float cosineSimilarity (float[] queryVector, doc['vector field'], float normQueryVector)` <br />In general, the range of cosine similarity is [-1, 1]. However, in the case of information retrieval, the cosine similarity of two documents ranges from `0` to `1` because the `tf-idf` statistic can't be negative. Therefore, OpenSearch adds `1.0` in order to always yield a positive cosine similarity score.
`hamming` | `float hamming (float[] queryVector, doc['vector field'])` | This function calculates the Hamming distance between a given query vector and document vectors. The Hamming distance is the number of positions at which the corresponding elements are different. A shorter distance indicates a more relevant document, so this example inverts the return value of the Hamming distance. The `hamming` space type is supported for binary vectors. For more information, see [Binary k-NN vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized#binary-vectors).

## Related documentation

- [Scripting]({{site.url}}{{site.baseurl}}/scripting/)
- [Script score query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/script-score/)
- [How to use scripts]({{site.url}}{{site.baseurl}}/scripting/using-scripts/)
