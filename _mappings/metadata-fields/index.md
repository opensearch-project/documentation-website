---
layout: default
title: Metadata fields
nav_order: 90
has_children: true
has_toc: false
redirect_from:
  - /field-types/metadata-fields/
  - /field-types/metadata-fields/index/
  - /mappings/metadata-fields/
canonical_url: https://docs.opensearch.org/latest/mappings/metadata-fields/index/
---

# Metadata fields

OpenSearch provides built-in metadata fields that allow you to access information about the documents in an index. These fields can be used in your queries as needed.

Metadata field | Description
:--- | :---
`_field_names` | The document fields with non-empty or non-null values.   
`_id` |  The unique identifier assigned to each document. 
`_ignored` | The document fields that were ignored during the indexing process due to the presence of malformed data, as specified by the `ignore_malformed` setting.
`_index` | The index in which the document is stored.
`_meta` | Stores custom metadata or additional information specific to the application or use case.
`_routing` | Allows you to specify a custom value that determines the shard assignment for a document in an OpenSearch cluster.
`_source` | Contains the original JSON representation of the document data.
