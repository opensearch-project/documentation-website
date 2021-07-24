---
layout: default
title: Field data types
parent: Mapping
has_children: true
---
# Field data types
Each field has a _field type_. This types indicates:
* What kind of data the field contains
* How it can be used
* Space usage or performance characteristics

## Arrays
There no dedicated field data type for arrays. Any field can have zero or more values by default. All values in the array must have same field type.

## Multi-fields
Multi-fields used to index the same field in different ways for different purposes. For example, a string field could be mapped as a text field for full-text search and as a keyword field for sorting or aggregations. You can also use different analyzers for each field.

Most field types support multi-fields via the `fields` parameter.
