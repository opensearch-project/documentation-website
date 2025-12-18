---
layout: default
title: Getting started
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /vector-search/getting-started/
canonical_url: https://docs.opensearch.org/latest/vector-search/getting-started/index/
---

# Getting started with vector search

This guide shows you how to use your own vectors in OpenSearch. You'll learn to create a vector index, add location data, and run a vector search to find the nearest hotels on a coordinate plane. While this example uses two-dimensional vectors for simplicity, the same approach applies to higher-dimensional vectors used in semantic search and recommendation systems.


## Prerequisite: Install OpenSearch
  

<details markdown="block">
  <summary>
  If you don't have OpenSearch installed, follow these steps to create a cluster.
  </summary>

Before you start, ensure that [Docker](https://docs.docker.com/get-docker/) is installed and running in your environment. <br>
This demo configuration is insecure and should not be used in production environments.
{: .note} 

Download and run OpenSearch: 

```bash
docker pull opensearchproject/opensearch:latest && docker run -it -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" -e "DISABLE_SECURITY_PLUGIN=true" opensearchproject/opensearch:latest
```
{% include copy.html %}

OpenSearch is now running on port 9200. To verify that OpenSearch is running, send the following request: 

```bash
curl http://localhost:9200
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

For more information, see [Installation quickstart]({{site.url}}{{site.baseurl}}/getting-started/quickstart/) and [Install and upgrade OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/).

</details>

## Step 1: Create a vector index

First, create an index that will store sample hotel data. To signal to OpenSearch that this is a vector index, set `index.knn` to `true`. You'll store the vectors in a vector field named `location`. The vectors you'll ingest will be two-dimensional, and the distance between vectors will be calculated using the [Euclidean `l2` similarity metric]({{site.url}}{{site.baseurl}}/vector-search/getting-started/vector-search-basics/#calculating-similarity):

```json
PUT /hotels-index
{
  "settings": {
    "index.knn": true
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

Vector queries usually have a `size` > 0, so by default they don't enter the request cache. In OpenSearch 2.19 or later, if your workload mostly consists of vector queries, consider increasing the dynamic `indices.requests.cache.maximum_cacheable_size` cluster setting to a larger value, such as `256`. This allows queries with a `size` of up to 256 to enter the request cache, improving performance. For more information, see [Request cache]({{site.url}}{{site.baseurl}}/search-plugins/caching/request-cache).

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

![Hotels on a coordinate plane]({{site.url}}{{site.baseurl}}/images/k-nn-search-hotels.png){:style="width: 400px;" class="img-centered"}

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

## Generating vector embeddings automatically

If your data isn't already in vector format, you can generate vector embeddings directly within OpenSearch. This allows you to transform text or images into their numerical representations for similarity search. For more information, see [Generating vector embeddings automatically]({{site.url}}{{site.baseurl}}/vector-search/getting-started/auto-generated-embeddings/).

## Next steps

- [Vector search basics]({{site.url}}{{site.baseurl}}/vector-search/getting-started/vector-search-basics/)
- [Preparing vectors]({{site.url}}{{site.baseurl}}/vector-search/getting-started/vector-search-options/)
- [Vector search with filters]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/)
- [Generating vector embeddings automatically]({{site.url}}{{site.baseurl}}/vector-search/getting-started/auto-generated-embeddings/)