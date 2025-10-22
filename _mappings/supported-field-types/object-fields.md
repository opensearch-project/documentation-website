---
layout: default
title: Object field types
nav_order: 75
has_children: true
has_toc: false
parent: Supported field types
redirect_from:
  - /field-types/supported-field-types/object-fields/
  - /opensearch/supported-field-types/object-fields/
  - /field-types/object-fields/
---

# Object field types

Object field types contain values that are objects or relations. The following table lists all object field types that OpenSearch supports.

Field data type | Description
:--- | :---  
[`object`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/object/) | A JSON object. 
[`nested`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/nested/) | Used when objects in an array need to be indexed independently as separate documents. 
[`flat_object`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/flat-object/) | A JSON object treated as a string.
[`join`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/join/) | Establishes a parent/child relationship between documents in the same index. 

