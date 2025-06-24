---
layout: default
title: Concepts
nav_order: 70
---

# Concepts  

This page defines key terms and related to OpenSearch.

## Basic concepts

- [***Document***]({{site.url}}{{site.baseurl}}/getting-started/intro/#document): The basic unit of information in OpenSearch, stored in JSON format.
- [***Index***]({{site.url}}{{site.baseurl}}/getting-started/intro/#index): A collection of related documents.
- [***JSON (JavaScript object notation)***](https://www.json.org/): A text format used to store data in OpenSearch, representing information as key-value pairs.
- [***Mapping***]({{site.url}}{{site.baseurl}}/field-types/): The schema definition for an index that specifies how documents and their fields should be stored and indexed.

## Cluster architecture

- [***Node***]({{site.url}}{{site.baseurl}}/getting-started/intro/#clusters-and-nodes): A single server that is part of an OpenSearch cluster.
- [***Cluster***]({{site.url}}{{site.baseurl}}/getting-started/intro/#clusters-and-nodes): A collection of OpenSearch nodes working together.
- [***Cluster manager***]({{site.url}}{{site.baseurl}}/getting-started/intro/#clusters-and-nodes): The node responsible for managing cluster-wide operations.
- [***Shard***]({{site.url}}{{site.baseurl}}/getting-started/intro/#shards): A subset of an index's data; indexes are split into shards for distribution across nodes.
- [***Primary shard***]({{site.url}}{{site.baseurl}}/getting-started/intro/#primary-and-replica-shards): The original shard containing index data.
- [***Replica shard***]({{site.url}}{{site.baseurl}}/getting-started/intro/#primary-and-replica-shards): A copy of a primary shard for redundancy and search performance.


## Data structures and storage

- [***Doc values***]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/doc-values/): An on-disk data structure for efficient sorting and aggregating of field values.
- [***Inverted index***]({{site.url}}{{site.baseurl}}/getting-started/intro/#inverted-index): A data structure that maps words to the documents containing them.
- ***Lucene***: The underlying search library that OpenSearch uses to index and search data.
- ***Segment***: An immutable unit of data storage within a shard.

## Data operations

- ***Ingestion***: The process of adding data to OpenSearch.
- [***Indexing***]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index-document/): The process of storing and organizing data in OpenSearch to make it searchable.
- [***Bulk indexing***]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/): The process of indexing multiple documents in a single request.

## Text analysis

- [***Text analysis***]({{site.url}}{{site.baseurl}}/analyzers/): A process of splitting the unstructured free text content of a document into a sequence of terms, which are then stored in an inverted index. 
- [***Analyzer***]({{site.url}}{{site.baseurl}}/analyzers/#analyzers): A component that processes text to prepare it for search. Analyzers convert text into terms that are stored in the inverted index.
- [***Tokenizer***]({{site.url}}{{site.baseurl}}/analyzers/tokenizers/index/): The component of an analyzer that splits text into individual tokens (usually words) and records metadata about their positions.
- [***Token filter***]({{site.url}}{{site.baseurl}}/analyzers/token-filters/index/): The final component of an analyzer that modifies, adds, or removes tokens after tokenization. Examples include lowercase conversion, stopword removal, and synonym addition.
- [***Token***]({{site.url}}{{site.baseurl}}/analyzers/): A unit of text created by a tokenizer during text analysis. Tokens can be modified by token filters and contain metadata used in the text analysis process.
- [***Term***]({{site.url}}{{site.baseurl}}/analyzers/): A data value that is directly stored in the inverted index and used for matching during search operations. Terms have minimal associated metadata.
- [***Character filter***]({{site.url}}{{site.baseurl}}/analyzers/character-filters/index/): The first component of an analyzer that processes raw text by adding, removing, or modifying characters before tokenization.
- [***Normalizer***]({{site.url}}{{site.baseurl}}/analyzers/normalizers/): A special type of analyzer that processes text without tokenization. It can only perform character-level operations and cannot modify whole tokens.
- [***Stemming***]({{site.url}}{{site.baseurl}}/analyzers/stemming/): The process of reducing words to their root or base form, known as the _stem_. 

## Search and query concepts

- ***Query***: A request to OpenSearch that describes what you're looking for in your data.
- ***Query clause***: A single condition within a query that specifies criteria for matching documents.
- [***Filter***]({{site.url}}{{site.baseurl}}/query-dsl/query-filter-context/#filter-context): A query component that finds exact matches without scoring.
- [***Filter context***]({{site.url}}{{site.baseurl}}/query-dsl/query-filter-context/): A query clause in a filter context asks the question _“Does the document match the query clause?”_
- [***Query context***]({{site.url}}{{site.baseurl}}/query-dsl/query-filter-context/): A query clause in a query context asks the question _“How well does the document match the query clause?”_
- [***Full-text search***]({{site.url}}{{site.baseurl}}/query-dsl/term-vs-full-text/): Search that analyzes and matches text fields, considering variations in word forms.
- [***Keyword search***]({{site.url}}{{site.baseurl}}/query-dsl/term-vs-full-text/): Search that requires exact matches of text.
- [***Query DSL***]({{site.url}}{{site.baseurl}}/query-dsl/): OpenSearch's primary query language for creating complex, customizable searches.
- [***Query string query language***]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/): A simplified query syntax that can be used in URL parameters.
- [***Dashboards Query Language (DQL)***]({{site.url}}{{site.baseurl}}/dashboards/dql/): A simple text-based query language used specifically for filtering data in OpenSearch Dashboards.
- [***Piped Processing Language (PPL)***]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/): A query language that uses pipe syntax (`|`) to chain commands for data processing and analysis, primarily used for observability use cases in OpenSearch.
- [***Relevance score***]({{site.url}}{{site.baseurl}}/getting-started/intro/#relevance): A number indicating how well a document matches a query.
- [***Aggregation***]({{site.url}}{{site.baseurl}}/aggregations/): A way to analyze and summarize data based on a search query.

## Vector search concepts

See [Vector search concepts]({{site.url}}{{site.baseurl}}/vector-search/getting-started/concepts/).

## Advanced concepts

The following section describes more advanced OpenSearch concepts.

### Update lifecycle

The lifecycle of an update operation consists of the following steps:

1. An update is received by a primary shard and is written to the shard's transaction log ([translog](#translog)). The translog is flushed to disk (followed by an fsync) before the update is acknowledged. This guarantees durability.
1. The update is also passed to the Lucene index writer, which adds it to an in-memory buffer.
1. On a [refresh operation](#refresh), the Lucene index writer flushes the in-memory buffers to disk (with each buffer becoming a new Lucene segment), and a new index reader is opened over the resulting segment files. The updates are now visible for search.
1. On a [flush operation](#flush), the shard fsyncs the Lucene segments. Because the segment files are a durable representation of the updates, the translog is no longer needed to provide durability, so the updates can be purged from the translog.

### Translog

An indexing or bulk call responds when the documents have been written to the translog and the translog is flushed to disk, so the updates are durable. The updates will not be visible to search requests until after a [refresh operation](#refresh).

### Refresh

Periodically, OpenSearch performs a _refresh_ operation, which writes the documents from the in-memory Lucene index to files. These files are not guaranteed to be durable because an `fsync` is not performed. A refresh makes documents available for search.

### Flush

A _flush_ operation persists the files to disk using `fsync`, ensuring durability. Flushing ensures that the data stored only in the translog is recorded in the Lucene index. OpenSearch performs a flush as needed to ensure that the translog does not grow too large.

### Merge

In OpenSearch, a shard is a Lucene index, which consists of _segments_ (or segment files). Segments store the indexed data and are immutable. Periodically, smaller segments are merged into larger ones. Merging reduces the overall number of segments on each shard, frees up disk space, and improves search performance. Eventually, segments reach a maximum size specified in the merge policy and are no longer merged into larger segments. The merge policy also specifies how often merges are performed. 