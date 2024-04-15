--
layout: default
title: Metadata fields
nav_order: 90
has_children: true
has_toc: false
---

# Metadata fields

OpenSearch has built-in metadata fields that provide information about the documents in an index. These fields can be accessed or used in queries as needed.

Metadata fields | Description
:--- | :---
`field_names` | The fields within the document that hold non-empty or non-null values.   
`_ignored` | The fields in the document that were disregarded during the indexing process due to the presence of malformed data, as specified by the `ignore_malformed` setting.
`_id` |  The unique identifier assigned to each individual document. 
`_index` | The specific index within the OpenSearch database where the document is stored and organized.
`_meta` | Stores custom metadata or additional information specific to the application or use case.
`_routing` | Allows you to specify a custom value that determines the shard assignment for the document within the OpenSearch cluster.
`_source` | Contains the original JSON representation of the document's data.
