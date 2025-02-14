---
layout: default
title: Pre-generated embeddings quickstart
parent: Getting started
nav_order: 10
---

# Getting started with pre-generated embeddings

With this approach, you generate embeddings externally and then index them into OpenSearch. This method offers greater flexibility in how embeddings are created. 

In this example, you'll create a vector index, ingest vector embedding data into the index, and search the data.

## Prerequisite

Before you start, you must generate embeddings using a library of your choice.

## Step 1: Create a vector index

First, create an index that will store sample hotel data. To use vector search, set `index.knn` to `true` and specify the `location` field as a `knn_vector`:

```json
PUT /hotels-index
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "location": {
        "type": "knn_vector",
        "dimension": 2,
        "space_type": "l2"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Step 2: Add data to your index

Next, add data to your index. Each document represents a hotel. The `location` field in each document contains a vector specifying the hotel's location:

```json
POST /_bulk
{ "index": { "_index": "hotels-index", "_id": "1" } }
{ "location": [5.2, 4.4] }
{ "index": { "_index": "hotels-index", "_id": "2" } }
{ "location": [5.2, 3.9] }
{ "index": { "_index": "hotels-index", "_id": "3" } }
{ "location": [4.9, 3.4] }
{ "index": { "_index": "hotels-index", "_id": "4" } }
{ "location": [4.2, 4.6] }
{ "index": { "_index": "hotels-index", "_id": "5" } }
{ "location": [3.3, 4.5] }
```
{% include copy-curl.html %}

## Step 3: Search your data

Now search for hotels closest to the pin location `[5, 4]`. This location is labeled `Pin` in the following image. Each hotel is labeled with its document number.

![Hotels on a coordinate plane]({{site.url}}{{site.baseurl}}/images/k-nn-search-hotels.png/)

To search for the top three closest hotels, set `k` to `3`:

```json
POST /hotels-index/_search
{
  "size": 3,
  "query": {
    "knn": {
      "location": {
        "vector": [
          5,
          4
        ],
        "k": 3
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the hotels closest to the specified pin location:

```json
{
  "took": 1093,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 0.952381,
    "hits": [
      {
        "_index": "hotels-index",
        "_id": "2",
        "_score": 0.952381,
        "_source": {
          "location": [
            5.2,
            3.9
          ]
        }
      },
      {
        "_index": "hotels-index",
        "_id": "1",
        "_score": 0.8333333,
        "_source": {
          "location": [
            5.2,
            4.4
          ]
        }
      },
      {
        "_index": "hotels-index",
        "_id": "3",
        "_score": 0.72992706,
        "_source": {
          "location": [
            4.9,
            3.4
          ]
        }
      }
    ]
  }
}
```

## Next steps

- [Vector search techniques]({{site.url}}{{site.baseurl}}/vector-search/vector-search-techniques/)