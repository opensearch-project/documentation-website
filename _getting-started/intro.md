---
layout: default
title: Intro to OpenSearch
nav_order: 2
has_math: true
redirect_from: 
 - /intro/
---

# Introduction to OpenSearch

OpenSearch is a distributed search and analytics engine that supports various use cases, from implementing a search box on a website to analyzing security data for threat detection. The term _distributed_ means that you can run OpenSearch on multiple computers. _Search and analytics_ means that you can search and analyze your data once you ingest it into OpenSearch. No matter your type of data, you can store and analyze it using OpenSearch.

## Overview

Watch this video to learn key OpenSearch concepts and understand how OpenSearch organizes data and ranks search results.

{% include youtube-player.html id='GbkRaxj-bJw' %}

## Document

A _document_ is a unit that stores information (text or structured data). In OpenSearch, documents are stored in [JSON](https://www.json.org/) format. 

You can think of a document in several ways:

- In a database of students, a document might represent one student.
- When you search for information, OpenSearch returns documents related to your search.
- A document represents a row in a traditional database.

For example, in a school database, a document might represent one student and contain the following data.

ID | Name | GPA | Graduation year | 
:--- | :--- | :--- | :--- | 
1 | John Doe | 3.89 | 2022 | 

Here is what this document looks like in JSON format:

```json
{
  "name": "John Doe",
  "gpa": 3.89,
  "grad_year": 2022
}
```

You'll learn about how document IDs are assigned in [Indexing documents]({{site.url}}{{site.baseurl}}/getting-started/communicate/#indexing-documents).

## Index

An _index_ is a collection of documents. 

You can think of an index in several ways:

- In a database of students, an index represents all students in the database.
- When you search for information, you query data contained in an index.
- An index represents a database table in a traditional database.

For example, in a school database, an index might contain all students in the school.

ID | Name | GPA | Graduation year 
:--- | :--- | :--- | :--- 
1 | John Doe | 3.89 | 2022
2 | Jonathan Powers | 3.85 | 2025
3 | Jane Doe | 3.52 | 2024
... | | |

## Clusters and nodes

OpenSearch is designed to be a distributed search engine, meaning that it can run on one or more _nodes_---servers that store your data and process search requests. An OpenSearch *cluster* is a collection of nodes. 

You can run OpenSearch locally on a laptop---its system requirements are minimal---but you can also scale a single cluster to hundreds of powerful machines in a data center.

In a single-node cluster, such as one deployed on a laptop, one machine has to perform every task: manage the state of the cluster, index and search data, and perform any preprocessing of data prior to indexing it. As a cluster grows, however, you can subdivide responsibilities. Nodes with fast disks and plenty of RAM might perform well when indexing and searching data, whereas a node with plenty of CPU power and a tiny disk could manage cluster state. 

In each cluster, there is an elected _cluster manager_ node, which orchestrates cluster-level operations, such as creating an index. Nodes communicate with each other, so if your request is routed to a node, that node sends requests to other nodes, gathers the nodes' responses, and returns the final response.

For more information about other node types, see [Cluster formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/).

## Shards

OpenSearch splits indexes into _shards_. Each shard stores a subset of all documents in an index, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/intro/index-shard.png" alt="An index is split into shards" width="450">

Shards are used for even distribution across nodes in a cluster. For example, a 400 GB index might be too large for any single node in your cluster to handle, but split into 10 shards of 40 GB each, OpenSearch can distribute the shards across 10 nodes and manage each shard individually. Consider a cluster with 2 indexes: index 1 and index 2. Index 1 is split into 2 shards, and index 2 is split into 4 shards. The shards are distributed across nodes 1 and 2, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/intro/cluster.png" alt="A cluster containing two indexes and two nodes" width="650">

Despite being one piece of an OpenSearch index, each shard is actually a full Lucene index. This detail is important because each instance of Lucene is a running process that consumes CPU and memory. More shards is not necessarily better. Splitting a 400 GB index into 1,000 shards, for example, would unnecessarily strain your cluster. A good rule of thumb is to limit shard size to 10--50 GB.

## Primary and replica shards

In OpenSearch, a shard may be either a _primary_ (original) shard or a _replica_ (copy) shard. By default, OpenSearch creates a replica shard for each primary shard. Thus, if you split your index into 10 shards, OpenSearch creates 10 replica shards. For example, consider the cluster described in the previous section. If you add 1 replica for each shard of each index in the cluster, your cluster will contain a total of 2 shards and 2 replicas for index 1 and 4 shards and 4 replicas for index 2, as shown in the following image. 

<img src="{{site.url}}{{site.baseurl}}/images/intro/cluster-replicas.png" alt="A cluster containing two indexes with one replica shard for each shard in the index" width="700">

These replica shards act as backups in the event of a node failure---OpenSearch distributes replica shards to different nodes than their corresponding primary shards---but they also improve the speed at which the cluster processes search requests. You might specify more than one replica per index for a search-heavy workload.

## Inverted index

An OpenSearch index uses a data structure called an _inverted index_. An inverted index maps words to the documents in which they occur. For example, consider an index containing the following two documents:

- Document 1: "Beauty is in the eye of the beholder"
- Document 2: "Beauty and the beast"

An inverted index for such an index maps the words to the documents in which they occur:

Word | Document
:--- | :---
beauty | 1, 2
is | 1
in | 1
the | 1, 2
eye | 1
of | 1
beholder | 1
and | 2
beast | 2 

In addition to the document ID, OpenSearch stores the position of the word within the document for running phrase queries, where words must appear next to each other.

## Relevance

When you search for a document, OpenSearch matches the words in the query to the words in the documents. For example, if you search the index described in the previous section for the word `beauty`, OpenSearch will return documents 1 and 2. Each document is assigned a _relevance score_ that tells you how well the document matched the query.

Individual words in a search query are called search _terms_. Each search term is scored according to the following rules:

1. A search term that occurs more frequently in a document will tend to be scored higher. A document about dogs that uses the word `dog` many times is likely more relevant than a document that contains the word `dog` fewer times. This is the _term frequency_ component of the score.

1. A search term that occurs in more documents will tend to be scored lower. A query for the terms `blue` and `axolotl` should prefer documents that contain `axolotl` over the likely more common word `blue`. This is the _inverse document frequency_ component of the score.

1. A match on a longer document should tend to be scored lower than a match on a shorter document. A document that contains a full dictionary would match on any word but is not very relevant to any particular word. This corresponds to the _length normalization_ component of the score.

OpenSearch uses the BM25 ranking algorithm to calculate document relevance scores and then returns the results sorted by relevance. To learn more, see [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25).

## Next steps

- Learn how to install OpenSearch within minutes in [Installation quickstart]({{site.url}}{{site.baseurl}}/getting-started/quickstart/).
