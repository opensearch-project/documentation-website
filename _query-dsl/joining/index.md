---
layout: default
title: Joining queries
has_children: true
nav_order: 55
has_toc: false
redirect_from:
  - /query-dsl/joining/
canonical_url: https://docs.opensearch.org/latest/query-dsl/joining/index/
---

# Joining queries

OpenSearch is a distributed system in which data is spread across multiple nodes. Thus, running a SQL-like JOIN operation in OpenSearch is resource intensive. As an alternative, OpenSearch provides the following queries that perform join operations and are optimized for scaling across multiple nodes:


- Queries for searching [nested]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/nested/) fields:
    - `nested` queries: Act as wrappers for other queries to search [nested]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/nested/) fields. The nested field objects are searched as though they were indexed as separate documents.
- Queries for searching documents connected by a [join]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/join/) field type, which establishes a parent/child relationship between documents in the same index:
    - [`has_child`]({{site.url}}{{site.baseurl}}/query-dsl/joining/has-child/) queries: Search for parent documents whose child documents match the query.
    - [`has_parent`]({{site.url}}{{site.baseurl}}/query-dsl/joining/has-parent/) queries: Search for child documents whose parent documents match the query.
    - [`parent_id`]({{site.url}}{{site.baseurl}}/query-dsl/joining/parent-id/) queries: Search for child documents that are joined to a specific parent document. 

If [`search.allow_expensive_queries`]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries) is set to `false`, then joining queries are not executed.
{: .important}