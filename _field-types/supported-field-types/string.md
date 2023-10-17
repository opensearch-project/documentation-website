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
---

# String field types

String field types contain text values or values derived from text. The following table lists all string field types that OpenSearch supports.

Field data type | Description
:--- | :---  
[`keyword`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/) | A string that is not analyzed. Useful for exact-value search.
[`text`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text/) | A string that is analyzed. Useful for full-text search.
[`token_count`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/token-count/)  | Counts the number of tokens in a string. 
