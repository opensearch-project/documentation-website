---
layout: default
title: Boolean queries
parent: Query DSL
nav_order: 35
---

# Compound queries

You can create combined queries with any of the following compound query types:

 - **Boolean** `bool` – Combines multiple query clauses with Boolean logic. To learn more, see [Boolean queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/bool/).
 - **Constant score** `constant_score` – Uses a `filter` query to return all matching documents and gives each document the same relevance score that is equal to the `boost` value.
- **Disjunction max** `dis_max` – Returns documents that match one or more query clauses. If a document matches multiple query clauses, its relevance score is calculated using the highest score from any matching clause and, optionally, the scores from the other matching clauses multiplied by the tie breaker value.
- **Function score** `function_score` – Modifies the score of documents that are returned by a query. You define a query and one or more functions to compute a score for each document that matches the query.
- **Boosting** `boosting` – Changes the relevancy score for documents without removing them from the search results. Returns documents that match a `positive` query, as well as changing the relevance score for documents that match a `negative` query.