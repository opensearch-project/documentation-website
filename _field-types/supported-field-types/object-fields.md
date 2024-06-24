---
layout: default
title: Object field types
nav_order: 40
has_children: true
has_toc: false
parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/object-fields/
  - /field-types/object-fields/
canonical_url: https://opensearch.org/docs/latest/field-types/supported-field-types/object-fields/
---

# Object field types

Object field types contain values that are objects or relations. The following table lists all object field types that OpenSearch supports.

Field data type | Description
:--- | :---  
[`object`]({{site.url}}{{site.baseurl}}/field-types/object/) | A JSON object. 
[`nested`]({{site.url}}{{site.baseurl}}/field-types/nested/) | Used when objects in an array need to be indexed independently as separate documents. 
[`join`]({{site.url}}{{site.baseurl}}/field-types/join/) | Establishes a parent-child relationship between documents in the same index. 

