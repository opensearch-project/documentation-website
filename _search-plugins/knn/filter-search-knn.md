---
layout: default
title: Search with k-nn filters
nav_order: 10
parent: k-NN
has_children: false
has_math: true
---

# Search with k-NN filters

OpenSearch supports the filter function for the k-NN query type provided by the Lucene engine version 9.1.

Lucene provides a search processing on filtered documents to determine whether or not to use the HNSW algorithm to find the results, or to run an exact search on the filtered doc set. 



Decide one of the following options: 
1. Decide whether or not to use the algorithm to find search results. This would leave out the results that were filtered out from the search.
1. Run an exact search on the filtered doc set.

## About Lucene HNSW algorithm

Lucene uses an HSNW algorithm to filter searches. 

After a filter is applied to a set of documents to be searched, the algorithm decides 