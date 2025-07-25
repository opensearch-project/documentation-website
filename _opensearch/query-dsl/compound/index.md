---
layout: default
title: Compound queries
parent: Query DSL
has_children: true
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/query-dsl/compound/index/
---

# Compound queries

Compound queries serve as wrappers for multiple leaf or compound clauses either to combine their results or to modify their behavior. 

OpenSearch supports the following compound query types:

- **Boolean**: Combines multiple query clauses with Boolean logic. To learn more, see [Boolean queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/compound/bool/).
- **Constant score**: Wraps a query or a filter and assigns a constant score to all matching documents. This score is equal to the `boost` value.
- **Disjunction max**: Returns documents that match one or more query clauses. If a document matches multiple query clauses, it is assigned a higher relevance score. The relevance score is calculated using the highest score from any matching clause and, optionally, the scores from the other matching clauses multiplied by the tiebreaker value.
- **Function score**: Recalculates the relevance score of documents that are returned by a query using a function that you define.
- **Boosting**: Changes the relevance score of documents without removing them from the search results. Returns documents that match a `positive` query, but downgrades the relevance of documents in the results that match a `negative` query.