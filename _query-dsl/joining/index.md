---
layout: default
title: Joining queries
has_children: true
nav_order: 70
has_toc: false
redirect_from:
  - /query-dsl/joining/
---

# Joining queries

OpenSearch is a distributed system in which data is spread across multiple nodes. Thus, running a SQL-like JOIN operation in OpenSearch is resource intensive. As an alternative, OpenSearch provides the following queries that perform join operations and are optimized for scaling across multiple nodes:

| Query type | Description |
| :--- | :--- |
| [`nested`]({{site.url}}{{site.baseurl}}/query-dsl/joining/nested/) | Acts as a wrapper for other queries to search [nested]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/nested/) fields. The nested field objects are searched as though they were indexed as separate documents. |
| [`has_child`]({{site.url}}{{site.baseurl}}/query-dsl/joining/has-child/) | Searches for parent documents whose child documents match the query. Requires a [join]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/join/) field type. |
| [`has_parent`]({{site.url}}{{site.baseurl}}/query-dsl/joining/has-parent/) | Searches for child documents whose parent documents match the query. Requires a [join]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/join/) field type. |
| [`parent_id`]({{site.url}}{{site.baseurl}}/query-dsl/joining/parent-id/) | Searches for child documents that are joined to a specific parent document. Requires a [join]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/join/) field type. |

If [`search.allow_expensive_queries`]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries) is set to `false`, then joining queries are not executed.
{: .important}