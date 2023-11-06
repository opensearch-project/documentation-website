---
layout: default
title: About OpenSearch
nav_order: 2
parent: OpenSearch documentation
redirect_from:
  - /docs/opensearch/
  - /opensearch/
  - /opensearch/index/
---

{%- comment -%}The `/docs/opensearch/` redirect is specifically to support the UI links in OpenSearch Dashboards 1.0.0.{%- endcomment -%}

# Introduction to OpenSearch

OpenSearch is a distributed search and analytics engine based on [Apache Lucene](https://lucene.apache.org/). After adding your data to OpenSearch, you can perform full-text searches on it with all of the features you might expect: search by field, search multiple indexes, boost fields, rank results by score, sort results by field, and aggregate results.

Unsurprisingly, people often use search engines like OpenSearch as the backend for a search application---think [Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:FAQ/Technical#What_software_is_used_to_run_Wikipedia?) or an online store. It offers excellent performance and can scale up and down as the needs of the application grow or shrink.

An equally popular, but less obvious use case is log analytics, in which you take the logs from an application, feed them into OpenSearch, and use the rich search and visualization functionality to identify issues. For example, a malfunctioning web server might throw a 500 error 0.5% of the time, which can be hard to notice unless you have a real-time graph of all HTTP status codes that the server has thrown in the past four hours. You can use [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/index/) to build these sorts of visualizations from data in OpenSearch.


## Clusters and nodes

Its distributed design means that you interact with OpenSearch *clusters*. Each cluster is a collection of one or more *nodes*, servers that store your data and process search requests.

You can run OpenSearch locally on a laptop---its system requirements are minimal---but you can also scale a single cluster to hundreds of powerful machines in a data center.

In a single node cluster, such as a laptop, one machine has to do everything: manage the state of the cluster, index and search data, and perform any preprocessing of data prior to indexing it. As a cluster grows, however, you can subdivide responsibilities. Nodes with fast disks and plenty of RAM might be great at indexing and searching data, whereas a node with plenty of CPU power and a tiny disk could manage cluster state. For more information on setting node types, see [Cluster formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/).


## indexes and documents

OpenSearch organizes data into *indexes*. Each index is a collection of JSON *documents*. If you have a set of raw encyclopedia articles or log lines that you want to add to OpenSearch, you must first convert them to [JSON](https://www.json.org/). A simple JSON document for a movie might look like this:

```json
{
  "title": "The Wind Rises",
  "release_date": "2013-07-20"
}
```

When you add the document to an index, OpenSearch adds some metadata, such as the unique document *ID*:

```json
{
  "_index": "<index-name>",
  "_type": "_doc",
  "_id": "<document-id>",
  "_version": 1,
  "_source": {
    "title": "The Wind Rises",
    "release_date": "2013-07-20"
  }
}
```

Indexes also contain mappings and settings:

- A *mapping* is the collection of *fields* that documents in the index have. In this case, those fields are `title` and `release_date`.
- Settings include data like the index name, creation date, and number of shards.

## Primary and replica shards

OpenSearch splits indexes into *shards* for even distribution across nodes in a cluster. For example, a 400 GB index might be too large for any single node in your cluster to handle, but split into ten shards, each one 40 GB, OpenSearch can distribute the shards across ten nodes and work with each shard individually.

By default, OpenSearch creates a *replica* shard for each *primary* shard. If you split your index into ten shards, for example, OpenSearch also creates ten replica shards. These replica shards act as backups in the event of a node failure---OpenSearch distributes replica shards to different nodes than their corresponding primary shards---but they also improve the speed and rate at which the cluster can process search requests. You might specify more than one replica per index for a search-heavy workload.

Despite being a piece of an OpenSearch index, each shard is actually a full Lucene index---confusing, we know. This detail is important, though, because each instance of Lucene is a running process that consumes CPU and memory. More shards is not necessarily better. Splitting a 400 GB index into 1,000 shards, for example, would place needless strain on your cluster. A good rule of thumb is to keep shard size between 10--50 GB.


## REST API

You interact with OpenSearch clusters using the REST API, which offers a lot of flexibility. You can use clients like [curl](https://curl.se/) or any programming language that can send HTTP requests. To add a JSON document to an OpenSearch index (i.e. index a document), you send an HTTP request:

```json
PUT https://<host>:<port>/<index-name>/_doc/<document-id>
{
  "title": "The Wind Rises",
  "release_date": "2013-07-20"
}
```

To run a search for the document:

```
GET https://<host>:<port>/<index-name>/_search?q=wind
```

To delete the document:

```
DELETE https://<host>:<port>/<index-name>/_doc/<document-id>
```

You can change most OpenSearch settings using the REST API, modify indexes, check the health of the cluster, get statistics---almost everything.
