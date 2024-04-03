---
layout: default
title: Intro to OpenSearch
nav_order: 2
has_math: true
redirect_from: 
 - /intro/
---

# Introduction to OpenSearch

OpenSearch is a distributed search and analytics engine, which supports various use cases, from implementing a search box on a website to analyzing security data for threat detection. The term _distributed_ means you can run OpenSearch on multiple computers. _Search and analytics_ means you can search and analyze your data once you ingest it into OpenSearch. Whether your data is geographic or genetic, you can store and analyze it using OpenSearch.

## Document

A _document_ is a unit that stores information (text or structured data). In OpenSearch, documents are stored in [JSON](https://www.json.org/) format. 

You can think of a document in several ways:

- In a database of students, a document might represent one student.
- When you search for information, OpenSearch returns documents related to your search.
- If you're familiar with traditional databases, a document represents a row.

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

- If you have a collection of encyclopedia articles, an index represents the whole collection.
- When you search for information, you query data contained in an index.
- If you're familiar with traditional databases, a document represents a database table.

For example, in a school database, an index might contain all students in the school.

ID | Name | GPA | Graduation year 
:--- | :--- | :--- | :--- 
1 | John Doe | 3.89 | 2022
2 | Jonathan Powers | 3.85 | 2025
3 | Jane Doe | 3.52 | 2024

## Inverted index

An OpenSearch index uses a data structure called an _inverted index_. An inverted index maps words to the documents that they occur in. For example, consider an index containing the following two documents:

- Document 1 : "Beauty is in the eye of the beholder"
- Document 2: "Beauty and the beast"

An inverted index for such an index maps the words to the documents where they occur:

Word | Document
:--- | :---
beauty | 1, 2
is | 1
in | 1
the | 1, 2
eye | 1
of | 1
the | 1
beholder | 1
and | 2
beast | 2 

In addition to the document ID, OpenSearch stores the position of the word within that document for phrase queries, where words must appear next to each other.

## Relevance

When searching for documents using a phrase, you need to make sure that the words you are searching for are _relevant_. For example, the word `the` appears in most English phrases but searching for this word is meaningless. OpenSearch determines the relevance of a term by calculating two values:

- _Term frequency_: how often a word appears in the document
- _Document frequency_:  how often a word appears in all documents 

The relevance of a word is calculated as $$ relevance = { \text {term frequency} \over \text {document frequency} }. $$ This score is called term frequency/inverse document frequency (TF/IDF). For more information, see [TF/IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf).

OpenSearch uses the BM25 ranking algorithm to calculate document relevance scores and returns the results sorted by relevance. To learn more, see [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25).

## Clusters and nodes

OpenSearch is designed to be a distributed search engine. OpenSearch can run on one or more _nodes_---servers that store your data and process search requests. An OpenSearch *cluster* is a collection of nodes. 

You can run OpenSearch locally on a laptop---its system requirements are minimal---but you can also scale a single cluster to hundreds of powerful machines in a data center.

In a single-node cluster, such as a laptop, one machine has to do everything: manage the state of the cluster, index and search data, and perform any preprocessing of data prior to indexing it. As a cluster grows, however, you can subdivide responsibilities. Nodes with fast disks and plenty of RAM might be great at indexing and searching data, whereas a node with plenty of CPU power and a tiny disk could manage cluster state. 

In each cluster, there is an elected _cluster manager_ node, which orchestrates cluster-level operations, such as creating an index. Nodes communicate with each other, so if your request is routed to a node, that node sends requests to appropriate nodes, gathers the nodes' responses, and returns the final response.

For more information about setting node types, see [Cluster formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/).

## Shards

OpenSearch splits indexes into *shards*. Each shard stores a subset of all documents in an index, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/intro/index-shard.png" alt="An index is split into shards" width="450">

Shards are used for even distribution across nodes in a cluster. For example, a 400-GB index might be too large for any single node in your cluster to handle, but split into ten shards, each one 40 GB, OpenSearch can distribute the shards across ten nodes and work with each shard individually. For example, consider a cluster with two indexes: index 1 and index 2. Index 1 is split into 2 shards, and index 2 is split into 4 shards. The shards are distributed across nodes 1 and 2, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/intro/cluster.png" alt="A cluster containing two indexes and two nodes" width="650">

Despite being a piece of an OpenSearch index, each shard is actually a full Lucene index---confusing, we know. This detail is important, though, because each instance of Lucene is a running process that consumes CPU and memory. More shards is not necessarily better. Splitting a 400 GB index into 1,000 shards, for example, would place needless strain on your cluster. A good rule of thumb is to keep shard size as 10--50 GB.

## Primary and replica shards

In OpenSearch, shards may be _primary_ (the original) or _replica_ (a copy). By default, OpenSearch creates a replica shard for each primary shard. Thus, if you split your index into ten shards, OpenSearch creates ten replica shards. For example, consider a cluster described in the previous section. If you add one replica for each shard of each index in the cluster, your cluster will contain a total of 2 shards and 2 replicas for index 1 and 4 shards and 4 replicas for index 2, as shown in the following image. 

<img src="{{site.url}}{{site.baseurl}}/images/intro/cluster-replicas.png" alt="A cluster containing two indexes with one replica shard for each shard in the index" width="700">

These replica shards act as backups in the event of a node failure---OpenSearch distributes replica shards to different nodes than their corresponding primary shards---but they also improve the speed at which the cluster processes search requests. You might specify more than one replica per index for a search-heavy workload.

## Advanced concepts

The following section describes more advanced OpenSearch concepts.

### Translog

Any index changes, such as document indexing or deletion, are written to disk during a Lucene commit. However, Lucene commits are expensive operations, so they cannot be performed after every change to the index. Instead, each shard records every indexing operation in a transaction log called _translog_. When a document is indexed, it is added to the memory buffer and recorded in the translog. After a process or host restart, any data in the in-memory buffer is lost. Recording the document in the translog ensures durability because the translog is written to disk.

Frequent refresh operations write the documents in the memory buffer to a segment and then clear the memory buffer. Periodically, a [flush](#flush) performs a Lucene commit, which includes writing the segments to disk using `fsync`, purging the old translog, and starting a new translog. Thus, a translog contains all operations that have not yet been flushed.

### Refresh

Periodically, OpenSearch performs a _refresh_ operation, which writes the documents from the in-memory Lucene index to files. These files are not guaranteed to be durable because an `fsync` is not performed. A refresh makes documents available for search.

### Flush

A _flush_ operation persists the files to disk using `fsync`, ensuring durability. Flushing ensures that the data stored only in the translog is recorded in the Lucene index. OpenSearch performs a flush as needed to ensure that the translog does not grow too large.

### Merge

In OpenSearch, a shard is a Lucene index, which consists of _segments_ (or segment files). Segments store the indexed data and are immutable. Periodically, smaller segments are merged into larger ones. Merging reduces the overall number of segments on each shard, frees up disk space, and improves search performance. Eventually, segments reach a maximum size specified in the merge policy and are no longer merged into larger segments. The merge policy also specifies how often merges are performed. 

## Next steps

- Learn how to quickly install OpenSearch in [Installation quickstart]({{site.url}}{{site.baseurl}}/getting-started/quickstart/)