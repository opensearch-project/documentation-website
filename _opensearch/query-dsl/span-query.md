---
layout: default
title: Span queries
parent: Query DSL
nav_order: 60
---

# Span queries

You can use span queries to perform searches that provide control over the order and proximity of query terms that you specify. The primary use case is for legal documents. Span queries include the following query types:

- **Span containing** `span_containing` – Takes a list of span queries and only returns spans that match a second span query. 
- **Span field masking** `span_field_masking` – Combines `span_near` or `span_or` across different fields.
- **Span first** `span_first` – Combines another span query that returned matches within the first *N* positions of the field.
- **Span multi-term** `span_multi-term` – Provides a wrapper around the following query types: `term`, `range`, `prefix`, `wildcard` `regexp` or `fuzzy`.
- **Span near** `span_near` – Combines multiple span queries that much match documents in the same order and within the specified distance of each other.
- **Span not** `span_not` – Provides a wrapper for another span query and functions to exclude any documents that match the internal query.
- **Span or** `span_or` – Provides a wrapper for multiple span queries and includes any documents that match any of the specified queries.
- **Span term** `span_term` – Functions the same as a `term` query, but is designed to be used with other span queries.
- **Span within** `span_within` – Used with other span queries to returns a single span query result if its span is also within the spans that get returned by the list of other span queries.