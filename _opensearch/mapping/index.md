---
layout: default
title: Mapping
nav_order: 26
has_children: true
---

# Mapping
Mapping is the process of defining how a document, and the fields it contains, are stored and indexed.

Each document is a collection of fields, which each have their own data type. When mapping your data, you create a mapping definition, which contains a list of fields that are pertinent to the document. A mapping definition also includes metadata fields, like the `_source` field, which customize how a document’s associated metadata is handled.

Use _dynamic mapping_ and _explicit mapping_ to define your data. Each method provides different benefits based on where you are in your data journey. For example, explicitly map fields where you don’t want to use the defaults, or to gain greater control over which fields are created. You can then allow OpenSearch to add other fields dynamically.

## Dynamic mapping
Dynamic mapping allows you to experiment with and explore data when you’re just getting started. OpenSearch adds new fields automatically, just by indexing a document. You can add fields to the top-level mapping, and to inner object and nested fields.

Use dynamic templates to define custom mappings that are applied to dynamically added fields based on the matching condition.

## Explicit mapping
Explicit mapping allows you to precisely choose how to define the mapping definition, such as:
* Which string fields should be treated as full text fields
* Which fields contain numbers, dates, or geolocations
* The format of date values
* Custom rules to control the mapping for dynamically added fields

Use runtime fields to make schema changes without reindexing. You can use runtime fields in conjunction with indexed fields to balance resource usage and performance. Your index will be smaller, but with slower search performance.

## Settings to prevent mapping explosion
Defining too many fields in an index can lead to a mapping explosion, which can cause out of memory errors and difficult situations to recover from.

Consider a situation where every new document inserted introduces new fields, such as with dynamic mapping. Each new field is added to the index mapping, which can become a problem as the mapping grows.

Use the mapping limit settings to limit the number of field mappings (created manually or dynamically) and prevent documents from causing a mapping explosion.
