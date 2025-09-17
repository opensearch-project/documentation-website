---
layout: default
title: Search APIs
nav_order: 75
has_children: true
has_toc: false
---

# Search APIs
**Introduced 1.0**
{: .label .label-purple }

OpenSearch provides a comprehensive suite of search-related APIs that allow you to perform various search operations, test and validate your searches, and work with search templates. OpenSearch supports the following Search APIs.

## Core search APIs

These APIs form the foundation of OpenSearch's search capabilities:

- **[Search]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/)**: Run search queries across one or more indexes.
- **[Multi-search]({{site.url}}{{site.baseurl}}/api-reference/search-apis/multi-search/)**: Run multiple search requests in a single API call.
- **[Point in Time]({{site.url}}{{site.baseurl}}/api-reference/search-apis/point-in-time-api/)**: Create a consistent view of the index for search operations.
- **[Scroll]({{site.url}}{{site.baseurl}}/api-reference/search-apis/scroll/)**: Retrieve large numbers of results from a search query.
- **[Count]({{site.url}}{{site.baseurl}}/api-reference/search-apis/count/)**: Get the number of documents that match a query.

## Search testing APIs

These APIs help you test, debug, and optimize your search operations:

- **[Explain]({{site.url}}{{site.baseurl}}/api-reference/search-apis/explain/)**: Explain how a specific document matches (or doesn't match) a query.
- **[Field capabilities]({{site.url}}{{site.baseurl}}/api-reference/search-apis/field-caps/)**: Get the capabilities of fields across multiple indexes.
- **[Profile]({{site.url}}{{site.baseurl}}/api-reference/search-apis/profile/)**: Profile the execution of search requests.
- **[Ranking evaluation]({{site.url}}{{site.baseurl}}/api-reference/search-apis/rank-eval/)**: Evaluate the quality of search results.
- **[Search shards]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-shards/)**: Get information about the shards on which a search request would be executed.
- **[Validate]({{site.url}}{{site.baseurl}}/api-reference/search-apis/validate/)**: Validate a potentially expensive query before executing it.

## Search template APIs

These APIs allow you to work with search templates:

- **[Search template]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/)**: Use search templates to run parameterized search queries.
- **[Multi-search template]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/msearch-template/)**: Execute multiple search template requests in a single API call.
- **[Render template]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search-template/render-template/)**: Previews the final query generated from a search template by substituting parameters without executing the search.