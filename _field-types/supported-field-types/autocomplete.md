---
layout: default
title: Autocomplete field types
nav_order: 50
has_children: true
has_toc: false
parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/autocomplete/
  - /field-types/autocomplete/
---

# Autocomplete field types

The following table lists all autocomplete field types that OpenSearch supports.

Field data type | Description
:--- | :---  
[`completion`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/completion/) | A completion suggester that provides autocomplete functionality using prefix completion. You need to upload a list of all possible completions into the index before using this feature.
[`search_as_you_type`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/search-as-you-type/) | Provides search-as-you-type functionality using both prefix and infix completion. 
