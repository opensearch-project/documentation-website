---
layout: default
title: k-NN Painless Extensions
nav_order: 3
parent: k-NN
has_children: false
has_math: true
---

# Painless Scripting Functions

With the k-NN plugin's Painless Scripting extensions, you can use k-NN distance functions directly in your Painless scripts to perform operations on `knn_vector` fields. Painless has a strict list of allowed functions and classes per context to ensure its scripts are secure. The k-NN plugin adds Painless Scripting extensions to a few of the distance functions used in [k-NN score script](../knn-score-script), so you can utilize them when you need more customization with respect to your k-NN workload.

## Get started with k-NN's Painless Scripting functions

To use k-NN's Painless Scripting functions, first, you must create an index with `knn_vector` fields like in [k-NN score script](../knn-score-script#Getting-started-with-the-score-script). Once the index is created and you have ingested some data, you can use the painless extensions:

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

`field` needs to map to a `knn_vector` field, and `query_value` needs to be a floating point array with the same dimension as `field`.

## Function types
The following table contains the available painless functions the k-NN plugin provides:

<table>
  <thead style="text-align: left">
  <tr>
    <th>Function Name</th>
    <th>Function Signature</th>
    <th>Description</th>
  </tr>
  </thead>
  <tr>
    <td>l2Squared</td>
    <td><code>float l2Squared (float[] queryVector, doc['vector field'])</code></td>
    <td>This function calculates the square of the L2 distance (Euclidean distance) between a given query vector and document vectors. The shorter the distance, the more relevant the document is, so this example inverts the return value of the l2Squared function. If the document vector matches the query vector, the result is 0, so this example also adds 1 to the distance to avoid divide by zero errors.</td>
  </tr>
  <tr>
    <td>l1Norm</td>
    <td><code>float l1Norm (float[] queryVector, doc['vector field'])</code></td>
    <td>This function calculates the L1 Norm distance (Manhattan distance) between a given query vector and document vectors.</td>
  </tr>
  <tr>
    <td>cosineSimilarity</td>
    <td><code>float cosineSimilarity (float[] queryVector, doc['vector field'])</code></td>
    <td>Cosine similarity is an inner product of the query vector and document vector normalized to both have length 1. If magnitude of the query vector does not change throughout the query, users can pass the magnitude of the query vector to improve the performance, instead of calculating the magnitude every time for every filtered document: <code>float cosineSimilarity (float[] queryVector, doc['vector field'], float normQueryVector)</code>. In general, range of cosine similarity is [-1, 1], but in the case of information retrieval, the cosine similarity of two documents will range from 0 to 1 because tf-idf cannot be negative. Hence, the k-NN plugin adds 1.0 to always yield a positive cosine similarity score. </td>
  </tr>
</table>


## Constraints
1. If a document’s `knn_vector` field has different dimensions than the query, the function throws an `IllegalArgumentException`.
2. If a vector field doesn't have a value, the function throws an IllegalStateException.
   You can avoid this situation by first checking if a document has a value in its field:
```
 "source": "doc[params.field].size() == 0 ? 0 : 1 / (1 + l2Squared(params.query_value, doc[params.field]))",
```
Because scores can only be positive, this script ranks documents with vector fields higher than those without.
