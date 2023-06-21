---
layout: default
title: Exact k-NN with scoring script
nav_order: 10
parent: k-NN
has_children: false
has_math: true
---

# Exact k-NN with scoring script

The k-NN plugin implements the OpenSearch score script plugin that you can use to find the exact k-nearest neighbors to a given query point. Using the k-NN score script, you can apply a filter on an index before executing the nearest neighbor search. This is useful for dynamic search cases where the index body may vary based on other conditions.

Because the score script approach executes a brute force search, it doesn't scale as well as the [approximate approach]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn). In some cases, it might be better to think about refactoring your workflow or index structure to use the approximate approach instead of the score script approach.

## Getting started with the score script for vectors

Similar to approximate nearest neighbor search, in order to use the score script on a body of vectors, you must first create an index with one or more `knn_vector` fields.

If you intend to just use the score script approach (and not the approximate approach) you can set `index.knn` to `false` and not set `index.knn.space_type`. You can choose the space type during search. See [spaces](#spaces) for the spaces the k-NN score script suppports.

This example creates an index with two `knn_vector` fields:

```json
PUT my-knn-index-1
{
  "mappings": {
    "properties": {
      "my_vector1": {
        "type": "knn_vector",
        "dimension": 2
      },
      "my_vector2": {
        "type": "knn_vector",
        "dimension": 4
      }
    }
  }
}
```

If you *only* want to use the score script, you can omit `"index.knn": true`. The benefit of this approach is faster indexing speed and lower memory usage, but you lose the ability to perform standard k-NN queries on the index.
{: .tip}

After you create the index, you can add some data to it:

```json
POST _bulk
{ "index": { "_index": "my-knn-index-1", "_id": "1" } }
{ "my_vector1": [1.5, 2.5], "price": 12.2 }
{ "index": { "_index": "my-knn-index-1", "_id": "2" } }
{ "my_vector1": [2.5, 3.5], "price": 7.1 }
{ "index": { "_index": "my-knn-index-1", "_id": "3" } }
{ "my_vector1": [3.5, 4.5], "price": 12.9 }
{ "index": { "_index": "my-knn-index-1", "_id": "4" } }
{ "my_vector1": [5.5, 6.5], "price": 1.2 }
{ "index": { "_index": "my-knn-index-1", "_id": "5" } }
{ "my_vector1": [4.5, 5.5], "price": 3.7 }
{ "index": { "_index": "my-knn-index-1", "_id": "6" } }
{ "my_vector2": [1.5, 5.5, 4.5, 6.4], "price": 10.3 }
{ "index": { "_index": "my-knn-index-1", "_id": "7" } }
{ "my_vector2": [2.5, 3.5, 5.6, 6.7], "price": 5.5 }
{ "index": { "_index": "my-knn-index-1", "_id": "8" } }
{ "my_vector2": [4.5, 5.5, 6.7, 3.7], "price": 4.4 }
{ "index": { "_index": "my-knn-index-1", "_id": "9" } }
{ "my_vector2": [1.5, 5.5, 4.5, 6.4], "price": 8.9 }

```

Finally, you can execute an exact nearest neighbor search on the data using the `knn` script:
```json
GET my-knn-index-1/_search
{
 "size": 4,
 "query": {
   "script_score": {
     "query": {
       "match_all": {}
     },
     "script": {
       "source": "knn_score",
       "lang": "knn",
       "params": {
         "field": "my_vector2",
         "query_value": [2.0, 3.0, 5.0, 6.0],
         "space_type": "cosinesimil"
       }
     }
   }
 }
}
```

All parameters are required.

- `lang` is the script type. This value is usually `painless`, but here you must specify `knn`.
- `source` is the name of the script, `knn_score`.

  This script is part of the k-NN plugin and isn't available at the standard `_scripts` path. A GET request to  `_cluster/state/metadata` doesn't return it, either.

- `field` is the field that contains your vector data.
- `query_value` is the point you want to find the nearest neighbors for. For the Euclidean and cosine similarity spaces, the value must be an array of floats that matches the dimension set in the field's mapping. For Hamming bit distance, this value can be either of type signed long or a base64-encoded string (for the long and binary field types, respectively).
- `space_type` corresponds to the distance function. See the [spaces section](#spaces).

The [post filter example in the approximate approach]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn#using-approximate-k-nn-with-filters) shows a search that returns fewer than `k` results. If you want to avoid this situation, the score script method lets you essentially invert the order of events. In other words, you can filter down the set of documents over which to execute the k-nearest neighbor search.

This example shows a pre-filter approach to k-NN search with the score script approach. First, create the index:

```json
PUT my-knn-index-2
{
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "knn_vector",
        "dimension": 2
      },
      "color": {
        "type": "keyword"
      }
    }
  }
}
```

Then add some documents:

```json
POST _bulk
{ "index": { "_index": "my-knn-index-2", "_id": "1" } }
{ "my_vector": [1, 1], "color" : "RED" }
{ "index": { "_index": "my-knn-index-2", "_id": "2" } }
{ "my_vector": [2, 2], "color" : "RED" }
{ "index": { "_index": "my-knn-index-2", "_id": "3" } }
{ "my_vector": [3, 3], "color" : "RED" }
{ "index": { "_index": "my-knn-index-2", "_id": "4" } }
{ "my_vector": [10, 10], "color" : "BLUE" }
{ "index": { "_index": "my-knn-index-2", "_id": "5" } }
{ "my_vector": [20, 20], "color" : "BLUE" }
{ "index": { "_index": "my-knn-index-2", "_id": "6" } }
{ "my_vector": [30, 30], "color" : "BLUE" }

```

Finally, use the `script_score` query to pre-filter your documents before identifying nearest neighbors:

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
        "lang": "knn",
        "source": "knn_score",
        "params": {
          "field": "my_vector",
          "query_value": [9.9, 9.9],
          "space_type": "l2"
        }
      }
    }
  }
}
```

## Getting started with the score script for binary data
The k-NN score script also allows you to run k-NN search on your binary data with the Hamming distance space.
In order to use Hamming distance, the field of interest must have either a `binary` or `long` field type. If you're using `binary` type, the data must be a base64-encoded string.

This example shows how to use the Hamming distance space with a `binary` field type:

```json
PUT my-index
{
  "mappings": {
    "properties": {
      "my_binary": {
        "type": "binary",
        "doc_values": true
      },
      "color": {
        "type": "keyword"
      }
    }
  }
}
```

Then add some documents:

```json
POST _bulk
{ "index": { "_index": "my-index", "_id": "1" } }
{ "my_binary": "SGVsbG8gV29ybGQh", "color" : "RED" }
{ "index": { "_index": "my-index", "_id": "2" } }
{ "my_binary": "ay1OTiBjdXN0b20gc2NvcmluZyE=", "color" : "RED" }
{ "index": { "_index": "my-index", "_id": "3" } }
{ "my_binary": "V2VsY29tZSB0byBrLU5O", "color" : "RED" }
{ "index": { "_index": "my-index", "_id": "4" } }
{ "my_binary": "SSBob3BlIHRoaXMgaXMgaGVscGZ1bA==", "color" : "BLUE" }
{ "index": { "_index": "my-index", "_id": "5" } }
{ "my_binary": "QSBjb3VwbGUgbW9yZSBkb2NzLi4u", "color" : "BLUE" }
{ "index": { "_index": "my-index", "_id": "6" } }
{ "my_binary":  "TGFzdCBvbmUh", "color" : "BLUE" }

```

Finally, use the `script_score` query to pre-filter your documents before identifying nearest neighbors:

```json
GET my-index/_search
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
        "lang": "knn",
        "source": "knn_score",
        "params": {
          "field": "my_binary",
          "query_value": "U29tZXRoaW5nIEltIGxvb2tpbmcgZm9y",
          "space_type": "hammingbit"
        }
      }
    }
  }
}
```

Similarly, you can encode your data with the `long` field and run a search:

```json
GET my-long-index/_search
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
        "lang": "knn",
        "source": "knn_score",
        "params": {
          "field": "my_long",
          "query_value": 23,
          "space_type": "hammingbit"
        }
      }
    }
  }
}
```

## Spaces

A space corresponds to the function used to measure the distance between two points in order to determine the k-nearest neighbors. From the k-NN perspective, a lower score equates to a closer and better result. This is the opposite of how OpenSearch scores results, where a greater score equates to a better result. The following table illustrates how OpenSearch converts spaces to scores:

<table>
  <thead style="text-align: center">
  <tr>
    <th>spaceType</th>
    <th>Distance Function (d)</th>
    <th>OpenSearch Score</th>
  </tr>
  </thead>
  <tr>
    <td>l1</td>
    <td>\[ d(\mathbf{x}, \mathbf{y}) = \sum_{i=1}^n |x_i - y_i| \]</td>
    <td>\[ score = {1 \over 1 + d } \]</td>
  </tr>
  <tr>
    <td>l2</td>
    <td>\[ d(\mathbf{x}, \mathbf{y}) = \sum_{i=1}^n (x_i - y_i)^2 \]</td>
    <td>\[ score = {1 \over 1 + d } \]</td>
  </tr>
  <tr>
    <td>linf</td>
    <td>\[ d(\mathbf{x}, \mathbf{y}) = max(|x_i - y_i|) \]</td>
    <td>\[ score = {1 \over 1 + d } \]</td>
  </tr>
  <tr>
    <td>cosinesimil</td>
    <td>\[ d(\mathbf{x}, \mathbf{y}) = 1 - cos { \theta } = 1 - {\mathbf{x} &middot; \mathbf{y} \over \|\mathbf{x}\| &middot; \|\mathbf{y}\|}\]\[ = 1 - 
    {\sum_{i=1}^n x_i y_i \over \sqrt{\sum_{i=1}^n x_i^2} &middot; \sqrt{\sum_{i=1}^n y_i^2}}\]
    where \(\|\mathbf{x}\|\) and \(\|\mathbf{y}\|\) represent the norms of vectors x and y respectively.</td>
    <td>\[ score = 2 - d \]</td>
  </tr>
  <tr>
    <td>innerproduct (not supported for Lucene)</td>
    <td>\[ d(\mathbf{x}, \mathbf{y}) = - {\mathbf{x} &middot; \mathbf{y}} = - \sum_{i=1}^n x_i y_i \]</td>
    <td>\[ \text{If} d \ge 0, \] \[score = {1 \over 1 + d }\] \[\text{If} d < 0, score = &minus;d + 1\]</td>
  </tr>
  <tr>
    <td>hammingbit</td>
    <td>\[ d(\mathbf{x}, \mathbf{y}) = \text{countSetBits}(\mathbf{x} \oplus \mathbf{y})\]</td>
    <td>\[ score = {1 \over 1 + d } \]</td>
  </tr>
</table>


Cosine similarity returns a number between -1 and 1, and because OpenSearch relevance scores can't be below 0, the k-NN plugin adds 1 to get the final score.
