---
layout: default
title: Term-level queries
has_children: true
has_toc: false
nav_order: 20
---

# Term-level queries

Term-level queries search an index for documents that contain an exact search term. Documents returned by a term-level query are not sorted by their relevance scores.

When working with text data, use term-level queries for fields mapped as `keyword` only.

Term-level queries are not suited for searching analyzed text fields. To return analyzed fields, use a [full-text query]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/).

## Term-level query types

The following table lists all term-level query types.

Query type | Description
:--- | :--- 
[`term`]({{site.url}}{{site.baseurl}}/query-dsl/term/term/) | Searches for documents containing an exact term in a specific field.
[`terms`]({{site.url}}{{site.baseurl}}/query-dsl/term/terms/) | Searches for documents containing one or more terms in a specific field.
[`terms_set`]({{site.url}}{{site.baseurl}}/query-dsl/term/terms-set/) | Searches for documents that match a minimum number of terms in a specific field.
[`ids`]({{site.url}}{{site.baseurl}}/query-dsl/term/ids/) | Searches for documents by document ID.
[`range`]({{site.url}}{{site.baseurl}}/query-dsl/term/range/) | Searches for documents with field values in a specific range.
[`prefix`]({{site.url}}{{site.baseurl}}/query-dsl/term/prefix/) | Searches for documents containing terms that begin with a specific prefix.
[`exists`]({{site.url}}{{site.baseurl}}/query-dsl/term/exists/) | Searches for documents with any indexed value in a specific field.
[`fuzzy`]({{site.url}}{{site.baseurl}}/query-dsl/term/fuzzy/) | Searches for documents containing terms that are similar to the search term within the maximum allowed [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance). The Levenshtein distance measures the number of one-character changes needed to change one term to another term.
[`wildcard`]({{site.url}}{{site.baseurl}}/query-dsl/term/wildcard/) | Searches for documents containing terms that match a wildcard pattern. 
[`regexp`]({{site.url}}{{site.baseurl}}/query-dsl/term/regexp/) | Searches for documents containing terms that match a regular expression.