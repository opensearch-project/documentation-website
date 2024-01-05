---
layout: default
title: Compound queries
has_children: true
has_toc: false
nav_order: 40
redirect_from: 
  - /query-dsl/compound/index/
  - /query-dsl/query-dsl/compound/
---

# Compound queries

Compound queries serve as wrappers for multiple leaf or compound clauses either to combine their results or to modify their behavior. 

The following table lists all compound query types.

Query type | Description
:--- | :---
[`bool`]({{site.url}}{{site.baseurl}}/query-dsl/compound/bool/) (Boolean)| Combines multiple query clauses with Boolean logic. 
[`boosting`]({{site.url}}{{site.baseurl}}/query-dsl/compound/boosting/) | Changes the relevance score of documents without removing them from the search results. Returns documents that match a `positive` query, but downgrades the relevance of documents in the results that match a `negative` query.
[`constant_score`]({{site.url}}{{site.baseurl}}/query-dsl/compound/constant-score/) | Wraps a query or a filter and assigns a constant score to all matching documents. This score is equal to the `boost` value.
[`dis_max`]({{site.url}}{{site.baseurl}}/query-dsl/compound/disjunction-max/) (disjunction max) | Returns documents that match one or more query clauses. If a document matches multiple query clauses, it is assigned a higher relevance score. The relevance score is calculated using the highest score from any matching clause and, optionally, the scores from the other matching clauses multiplied by the tiebreaker value.
[`function_score`]({{site.url}}{{site.baseurl}}/query-dsl/compound/function-score/) | Recalculates the relevance score of documents that are returned by a query using a function that you define.
[`hybrid`]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/) | Combines relevance scores from multiple queries into one score for a given document.
