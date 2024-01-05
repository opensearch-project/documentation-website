---
layout: default
title: Full-text queries
has_children: true
has_toc: false
nav_order: 30
redirect_from:
  - /opensearch/query-dsl/full-text/
  - /opensearch/query-dsl/full-text/index/
  - /query-dsl/query-dsl/full-text/
  - /query-dsl/full-text/
---

# Full-text queries

This page lists all full-text query types and common options. There are many optional fields that you can use to create subtle search behaviors, so we recommend that you test out some basic query types against representative indexes and verify the output before you perform more advanced or complex searches with multiple options.

OpenSearch uses the Apache Lucene search library, which provides highly efficient data structures and algorithms for ingesting, indexing, searching, and aggregating data.

To learn more about search query classes, see [Lucene query JavaDocs](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/Query.html).

The full-text query types shown in this section use the standard analyzer, which analyzes text automatically when the query is submitted.

The following table lists all full-text query types.

Query type | Description
:--- | :--- 
[`intervals`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/intervals/) | Allows fine-grained control of the matching terms' proximity and order. 
[`match`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match/) | The default full-text query, which can be used for fuzzy matching and phrase or proximity searches.
[`match_bool_prefix`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-bool-prefix/) | Creates a [Boolean query]({{site.url}}{{site.baseurl}}/query-dsl/compound/bool/) that matches all terms in any position, treating the last term as a prefix.
[`match_phrase`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/) | Similar to the `match` query but matches a whole phrase up to a configurable slop.
[`match_phrase_prefix`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase-prefix/) | Similar to the `match_phrase` query but matches terms as a whole phrase, treating the last term as a prefix.
[`multi_match`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/multi-match/) | Similar to the `match` query but is used on multiple fields.
[`query_string`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) | Uses a strict syntax to specify Boolean conditions and multi-field search within a single query string. 
[`simple_query_string`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/simple-query-string/) | A simpler, less strict version of `query_string` query. 
