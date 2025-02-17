---
layout: default
title: Getting started
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /vector-search/getting-started/
---

# Getting started with vector search

This guide shows you how to bring your own vectors to OpenSearch. In this example, you'll create a vector index, ingest vector data into the index, and search the data. 

## Prerequisite: Install OpenSearch

If you don't have OpenSearch installed, use the following steps to create a cluster.

Before you start, ensure that [Docker](https://docs.docker.com/get-docker/) is installed and running in your environment.
{: .note} 

Download and run OpenSearch: 

```bash
docker pull opensearchproject/opensearch:latest && docker run -it -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" -e "DISABLE_SECURITY_PLUGIN=true" opensearchproject/opensearch:latest
```
{% include copy.html %}

OpenSearch is now running on port 9200. Note that this demo configuration is insecure and should not be run in production environments.

<details markdown="block">
  <summary>
    Test it
  </summary>
  {: .text-delta}

To verify that OpenSearch is running, send the following request: 

```bash
curl https://localhost:9200
```
{% include copy.html %}

You should get a response that looks like this:

```json
{
  "name" : "a937e018cee5",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "GLAjAG6bTeWErFUy_d-CLw",
  "version" : {
    "distribution" : "opensearch",
    "number" : <version>,
    "build_type" : <build-type>,
    "build_hash" : <build-hash>,
    "build_date" : <build-date>,
    "build_snapshot" : false,
    "lucene_version" : <lucene-version>,
    "minimum_wire_compatibility_version" : "7.10.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "The OpenSearch Project: https://opensearch.org/"
}
```

</details>

For more information about installing OpenSearch, see [Installation quickstart]({{site.url}}{{site.baseurl}}/getting-started/quickstart/) and [Install and upgrade OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/).

## Step 1: Create a vector index

First, create an index that will store sample hotel data. To signal to OpenSearch that this is a vector index, set `index.knn` to `true`. You'll store the vectors in a vector field called `location`. The vectors you'll ingest will be two-dimensional and the distance between vectors will be calculated using [Euclidean `l2` similarity metric]({{site.url}}{{site.baseurl}}/vector-search/getting-started/vector-search-basics/#calculating-similarity):

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

Next, add data to your index. Each document represents a hotel. The `location` field in each document contains a two-dimensional vector specifying the hotel's location:

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

Now search for hotels closest to the pin location `[5, 4]`. To search for the top three closest hotels, set `k` to `3`:

```json
POST /hotels-index/_search
{
  "size": 3,
  "query": {
    "knn": {
      "location": {
        "vector": [5, 4],
        "k": 3
      }
    }
  }
}
```
{% include copy-curl.html %}

The following image shows the hotels on the coordinate plane. The query point is labeled `Pin`, and each hotel is labeled with its document number.

![Hotels on a coordinate plane]({{site.url}}{{site.baseurl}}/images/k-nn-search-hotels.png/)

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

## Generating vector embeddings in OpenSearch

If your data isn't already in vector format, you can generate vector embeddings directly within OpenSearch. This allows you to transform text, images, and other data types into numerical representations for similarity search. For more information, see [Generating vector embeddings within OpenSearch]({{site.url}}{{site.baseurl}}/vector-search/getting-started/auto-generated-embeddings/).

## Next steps

- [Vector search basics]({{site.url}}{{site.baseurl}}/vector-search/getting-started/vector-search-basics/)
- [Bringing your own or generating embeddings ]({{site.url}}{{site.baseurl}}/vector-search/getting-started/vector-search-options/)
- [Vector search with filters]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/)
- [Generating vector embeddings within OpenSearch]({{site.url}}{{site.baseurl}}/vector-search/getting-started/auto-generated-embeddings/)