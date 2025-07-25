---
layout: default
title: Joining queries
has_children: true
nav_order: 55
canonical_url: https://docs.opensearch.org/latest/query-dsl/joining/index/
---

# Joining queries

OpenSearch is a distributed system in which data is spread across multiple nodes. Thus, running a SQL-like JOIN operation in OpenSearch is resource intensive. As an alternative, OpenSearch provides the following queries that perform join operations and are optimized for scaling across multiple nodes:

- `nested` queries: Act as wrappers for other queries to search [nested]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/nested/) fields. The nested field objects are searched as though they were indexed as separate documents.
- `has_child` queries: Search for parent documents whose child documents match the query.
- `has_parent` queries: Search for child documents whose parent documents match the query.
- `parent_id` queries: A [join]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/nested/) field type establishes a parent/child relationship between documents in the same index. `parent_id` queries search for child documents that are joined to a specific parent document. 

If [`search.allow_expensive_queries`]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries) is set to `false`, then joining queries are not executed.
{: .important}