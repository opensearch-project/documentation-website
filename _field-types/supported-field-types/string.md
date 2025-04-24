---
layout: default
title: String field types
nav_order: 45
has_children: true
has_toc: false
parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/string/
  - /field-types/string/
canonical_url: https://docs.opensearch.org/docs/latest/field-types/supported-field-types/string/
---

# String field types

String field types contain text values or values derived from text. The following table lists all string field types that OpenSearch supports.

Field data type | Description
:--- | :---  
[`keyword`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/) | A string that is not analyzed. Useful for exact-value search.
[`text`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text/) | A string that is analyzed. Useful for full-text search.
[`match_only_text`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/match-only-text/) | A space-optimized version of a `text` field.
[`token_count`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/token-count/)  | Counts the number of tokens in a string. 
[`constant_keyword`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/constant-keyword/)  | Similar to `keyword` but uses a single value for all documents.
[`wildcard`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/wildcard/)  | A variation of `keyword` with efficient substring and regular expression matching.
