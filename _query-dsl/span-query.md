---
layout: default
title: Span queries
nav_order: 60
redirect_from: 
  - /opensearch/query-dsl/span-query/
  - /query-dsl/query-dsl/span-query/
---

# Span queries

You can use span queries to perform precise positional searches. Span queries are low-level, specific queries that provide control over the order and proximity of specified query terms. They are primarily used to search legal documents and patents. 

Span queries include the following query types:

- **Span containing**: Wraps a list of span queries and only returns spans that match a second span query. 
- **Span field masking**: Combines `span_near` or `span_or` across different fields.
- **Span first**: Matches spans close to the beginning of the field.
- **Span multi-term**: Provides a wrapper around the following query types: `term`, `range`, `prefix`, `wildcard`, `regexp` or `fuzzy`.
- **Span near**: Matches spans that are near each other. Wraps multiple span queries that must match within the specified `slop` distance of each other, and optionally in the same order. Slop represents the maximum number of intervening unmatched positions and indicates whether matches are required to be returned in order.
- **Span not**: Provides a wrapper for another span query and excludes any documents that match the internal query.
- **Span or**: Provides a wrapper for multiple span queries and includes any documents that match any of the specified queries.
- **Span term**: Functions in the same way as a `term` query, but is designed to be used with other span queries.
- **Span within**: Used with other span queries to return a single span query if its span is within the spans that are returned by a list of other span queries.