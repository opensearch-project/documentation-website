---
layout: default
title: Search with k-NN filters
nav_order: 10
parent: k-NN
has_children: false
has_math: true
---

# Search with k-NN filters

OpenSearch supports the filter function for the k-NN query type provided by the Lucene engine version 9.1.

Lucene provides a search processing on filtered documents to determine whether or not to use the HNSW algorithm to find the results, or to run an exact search on the filtered doc set. 

Requirement: Your query must 
Lucene HNSW search engine must be used for the query. 

Decide one of the following options: 
1. Decide whether or not to use the algorithm to find search results. This would leave out the results that were filtered out from the search.
1. Run an exact search on the filtered doc set.

## About Lucene HNSW algorithm

Lucene uses an HSNW algorithm to filter searches. 

After a filter is applied to a set of documents to be searched, the algorithm decides ....


## How to search with a filter

This example provides a basic approximate k-NN search with a filter for documents that contain terms marked in the color red.

The workflow to search with a filter includes three steps: 
1. Create an index. (link to anchor section)
1. Ingest data into the index.
1. Search the index with a filter.





### Step 1: Create a new index

Before you can do a k-NN search with a filter, you need to create an index and add data to it.
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




### Step 2: Add data to your index

Next, add data to your index with a PUT HTTP request.

#### Sample request

The following request adds data to the index.

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

### Step 3: Search your data with a filter

Now you can create a k-NN search that specifies filters using Query DSL Boolean clauses.
#### Sample request

The following request creates a k-NN query with a filter that specifies a Boolean "should" clause to indicate optionally that it should return hotels that provide parking, and must have feedback ratings between zero and seven:

```json
POST /hotels-index/_search
{
    "size": 12,
    "query": {
        "knn": {
            "location": {
                "vector": [
                    5.0,
                    4.0
                ],
                "k": 12,
                "filter": {
                    "bool": {
                        "should": [
                            {
                                "range": {
                                    "rating": {
                                        "gte": 0,
                                        "lte": 7
                                    }
                                }
                            },
                            {
                                "term": {
                                    "parking": "false"
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

The search for hotels with ratings between zero and seven that optionally provide parking returns the following results:

Seven hotels match this search:
1. Three hotels provide parking.
1. Four hotels do not provide parking.


```json
{
  "took" : 54,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 7,
      "relation" : "eq"
    },
    "max_score" : 0.952381,
    "hits" : [
      {
        "_index" : "hotels-index",
        "_id" : "2",
        "_score" : 0.952381,
        "_source" : {
          "location" : [
            5.2,
            3.9
          ],
          "parking" : "false",
          "rating" : 4
        }
      },
      {
        "_index" : "hotels-index",
        "_id" : "1",
        "_score" : 0.8333333,
        "_source" : {
          "location" : [
            5.2,
            4.4
          ],
          "parking" : "true",
          "rating" : 5
        }
      },
      {
        "_index" : "hotels-index",
        "_id" : "4",
        "_score" : 0.49999994,
        "_source" : {
          "location" : [
            4.2,
            4.6
          ],
          "parking" : "false",
          "rating" : 6
        }
      },
      {
        "_index" : "hotels-index",
        "_id" : "7",
        "_score" : 0.154321,
        "_source" : {
          "location" : [
            4.2,
            6.2
          ],
          "parking" : "true",
          "rating" : 5
        }
      },
      {
        "_index" : "hotels-index",
        "_id" : "11",
        "_score" : 0.1267427,
        "_source" : {
          "location" : [
            3.0,
            2.3
          ],
          "parking" : "false",
          "rating" : 6
        }
      },
      {
        "_index" : "hotels-index",
        "_id" : "12",
        "_score" : 0.1,
        "_source" : {
          "location" : [
            5.0,
            1.0
          ],
          "parking" : "true",
          "rating" : 3
        }
      },
      {
        "_index" : "hotels-index",
        "_id" : "9",
        "_score" : 0.06849315,
        "_source" : {
          "location" : [
            1.4,
            3.2
          ],
          "parking" : "false",
          "rating" : 5
        }
      }
    ]
  }
}

```