---
layout: default
title: Search with k-NN filters
nav_order: 10
parent: k-NN
has_children: false
has_math: true
---

# Search with k-NN filters
Introduced 2.4
{: .label .label-purple }

OpenSearch supports filtering k-NN searches provided by the Lucene engine version 9.1. Lucene provides a search process for filtered documents that uses a Hierarchical Navigable Small World (HSNW) algorithm to represent a multi-layered graph to filter searches.
After a filter is applied to a set of documents to be searched, the algorithm decides whether to perform pre-filtering for an exact kNN search or modified post-filtering for approximate search. The approximate search with filtering guarantees the top number of closest vectors in result.

Lucene also provides the capability to operate its `KnnVectorQuery` over a subset of documents. To learn more about Lucene’s new capability, see the [Apache Lucene Documentation](https://issues.apache.org/jira/browse/LUCENE-10382).

### Requirement: Lucene engine with HNSW method

To run k-NN queries with a filter, the Lucene search engine and HSNW method are required. When you create the mapping, you specify these items in the `knn_vector` field description as follows:

```json
"type": "knn_vector",
                "dimension": 2,
                "method": {
                    "name": "hnsw",
                    "space_type": "l2",
                    "engine": "lucene"
```


### Filtered search performance

The Lucene engine and other mechanisms allows you to to apply k-NN searches more efficiently both in terms of relevancy of search results and performance. Consider that if you do an exact search on a large data set, the results are slow, and post-filtering does not guarantee the required number of results you specify for the `k` value.
With this new capability, you can create an approximate k-NN search and apply filters, with the amount of results you need.

## Create filters with Query DSL  

OpenSearch k-NN filters are defined using Query DSL. Define the `filter` field with specific Boolean clauses.

You specify a query point with the `knn_vector` type and search for nearest neighbors that match your filter criteria specified using Query DSL.

To learn more about how to use Boolean query clauses with Query DSL, see [Boolean queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/bool).
{: .note }

## How to search nearest neighbors with filters

The workflow to search with a filter includes three steps:
1. Create an index.
1. Ingest data into the index.
1. Search the index and specify these three items in your query:
* One or more filters defined by Query DSL
* A vector reference point defined by the `vector` field.
* The number of matches you want returned with the `k` field.

We use a range query to specify hotel feedback ratings, and a term query to require that parking is available. The criteria is processed with Boolean clauses to indicate whether or not the document contains the criteria.

Consider a data set that contains 12 documents, a search reference point, and documents that meet two filter criteria.

![Graph of documents with filter criteria]({{site.url}}{{site.baseurl}}/images/knn-two-filters.png)

***Figure 1: Graph of documents that meet filter criteria***

## Step 1: Create a new index

Before you can do a k-NN search with a filter, you need to create an index and add data to it.

You need to add a `location` field to represent the location, and specify it as the `knn_vector` type. The most basic vector can be two dimensions. For example:

```
  "type": "knn_vector",
  "dimension": 2,
```

Make sure to specify the `method` field to indicate the "hsnw" method and "lucene" engine, otherwise the search will not work.

#### Sample request

The following request creates a new index called "hotels-index."

```json
PUT /hotels-index
{
    "settings": {
        "index": {
            "knn": true,
            "knn.algo_param.ef_search": 100,
            "number_of_shards": 1,
            "number_of_replicas": 0
        }
    },
    "mappings": {
        "properties": {
            "location": {
                "type": "knn_vector",
                "dimension": 2,
                "method": {
                    "name": "hnsw",
                    "space_type": "l2",
                    "engine": "lucene",
                    "parameters": {
                        "ef_construction": 100,
                        "m": 16
                    }
                }
            }
        }
    }
}
```
#### Sample response

Upon success, you should receive "200-OK" status with the following response:

```json
{
  "acknowledged" : true,
  "shards_acknowledged" : true,
  "index" : "hotels-index"
}
```

## Step 2: Add data to your index

Next, add data to your index with a PUT HTTP request. Make sure that the search criteria is defined in the body of the request.

#### Sample request

The following request adds twelve hotel documents that contain criteria such as feedback ratings and whether or not parking is available.  

```json
POST /_bulk
{ "index": { "_index": "hotels-index", "_id": "1" } }
{ "location": [5.2, 4.4], "parking" : "true", "rating" : 5 }
{ "index": { "_index": "hotels-index", "_id": "2" } }
{ "location": [5.2, 3.9], "parking" : "false", "rating" : 4 }
{ "index": { "_index": "hotels-index", "_id": "3" } }
{ "location": [4.9, 3.4], "parking" : "true", "rating" : 9 }
{ "index": { "_index": "hotels-index", "_id": "4" } }
{ "location": [4.2, 4.6], "parking" : "false", "rating" : 6}
{ "index": { "_index": "hotels-index", "_id": "5" } }
{ "location": [3.3, 4.5], "parking" : "true", "rating" : 8 }
{ "index": { "_index": "hotels-index", "_id": "6" } }
{ "location": [6.4, 3.4], "parking" : "true", "rating" : 9 }
{ "index": { "_index": "hotels-index", "_id": "7" } }
{ "location": [4.2, 6.2], "parking" : "true", "rating" : 5 }
{ "index": { "_index": "hotels-index", "_id": "8" } }
{ "location": [2.4, 4.0], "parking" : "true", "rating" : 8 }
{ "index": { "_index": "hotels-index", "_id": "9" } }
{ "location": [1.4, 3.2], "parking" : "false", "rating" : 5 }
{ "index": { "_index": "hotels-index", "_id": "10" } }
{ "location": [7.0, 9.9], "parking" : "true", "rating" : 9 }
{ "index": { "_index": "hotels-index", "_id": "11" } }
{ "location": [3.0, 2.3], "parking" : "false", "rating" : 6 }
{ "index": { "_index": "hotels-index", "_id": "12" } }
{ "location": [5.0, 1.0], "parking" : "true", "rating" : 3 }
```

#### Sample response

Upon success, you should receive "200-OK" status with entries for each of the document IDs that you added to the index. The following response is truncated to only show one document:

```json
{
  "took" : 140,
  "errors" : false,
  "items" : [
    {
      "index" : {
        "_index" : "hotels-index",
        "_id" : "1",
        "_version" : 2,
        "result" : "updated",
        "_shards" : {
          "total" : 1,
          "successful" : 1,
          "failed" : 0
        },
        "_seq_no" : 12,
        "_primary_term" : 3,
        "status" : 200
      }
    }
  ]
}

```

## Step 3: Search your data with a filter

Now you can create a k-NN search that specifies filters using Query DSL Boolean clauses. You need to include your reference point to search for nearest neighbors. Provide an x-y coordinate for the point with the `vector` field, such as `"vector": [ 5.0, 4.0]`

 To learn more about how to specify ranges with Query DSL, see [Range query]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/term/#range-query).
{: .note }

#### Sample request

The following request creates a k-NN query that only returns the top hotels rated between 8 and 10, and that provide parking. The filter criteria is indicated with the Query DSL `range` query clause to indicate the range for the feedback ratings, and a `term` query clause to indicate "parking."

```json
POST /hotels-index/_search
{
    "size": 3,
    "query": {
        "knn": {
            "location": {
                "vector": [
                    5.0,
                    4.0
                ],
                "k": 3,
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "rating": {
                                        "gte": 8,
                                        "lte": 10
                                    }
                                }
                            },
                            {
                                "term": {
                                    "parking": "true"
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
}
```


#### Sample Response

The following response indicates that only three hotels met the filter criteria:


```json
{
  "took" : 47,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : 0.72992706,
    "hits" : [
      {
        "_index" : "hotels-index",
        "_id" : "3",
        "_score" : 0.72992706,
        "_source" : {
          "location" : [
            4.9,
            3.4
          ],
          "parking" : "true",
          "rating" : 9
        }
      },
      {
        "_index" : "hotels-index",
        "_id" : "6",
        "_score" : 0.3012048,
        "_source" : {
          "location" : [
            6.4,
            3.4
          ],
          "parking" : "true",
          "rating" : 9
        }
      },
      {
        "_index" : "hotels-index",
        "_id" : "5",
        "_score" : 0.24154587,
        "_source" : {
          "location" : [
            3.3,
            4.5
          ],
          "parking" : "true",
          "rating" : 8
        }
      }
    ]
  }
}

```