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
- **Span first** `span_first` – Takes another span query that returned matches within the first *N* positions of the field.
- **Span multi-term** `span_multi-term` – Provides a wrapper around the following query types: `term`, `range`, `prefix`, `wildcard` `regexp` or `fuzzy`.
- **Span near** `span_near` – Takes multiple span queries that must match documents within the specified `slop` distance of each other, and optionally in the same order. Slop represents the maximum number of unmatched positions, and also indicates whether or not matches are required to be returned in order.
- **Span not** `span_not` – Provides a wrapper for another span query and functions to exclude any documents that match the internal query.
- **Span or** `span_or` – Provides a wrapper for multiple span queries and includes any documents that match any of the specified queries.
- **Span term** `span_term` – Functions the same as a `term` query, but is designed to be used with other span queries.
- **Span within** `span_within` – Used with other span queries to return a single span query result if its span is within the spans that are returned by the list of other span queries.