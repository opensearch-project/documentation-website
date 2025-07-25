---
layout: default
title: Mapping parameters
nav_order: 75
has_children: true
has_toc: false
canonical_url: https://docs.opensearch.org/latest/field-types/mapping-parameters/index/
---

# Mapping parameters

Mapping parameters are used to configure the behavior of index fields. For parameter use cases, see a mapping parameter's respective page.

The following table lists OpenSearch mapping parameters.

Parameter | Description
:--- | :---
`analyzer` | Specifies the analyzer used to analyze string fields. Default is the `standard` analyzer, which is a general-purpose analyzer that splits text on white space and punctuation, converts to lowercase, and removes stop words. Allowed values are `standard`, `simple`, and `whitespace`. 
`boost` | Specifies a field-level boost factor applied at query time. Allows you to increase or decrease the relevance score of a specific field during search queries. Default boost value is `1.0`, which means no boost is applied. Allowed values are any positive floating-point number.
`coerce` | Controls how values are converted to the expected field data type during indexing. Default value is `true`, which means that OpenSearch tries to coerce the value to the expected value type. Allowed values are `true` or `false`.
`copy_to` | Copies the value of a field to another field. There is no default value for this parameter. Optional.
`doc_values` | Specifies whether a field should be stored on disk to make sorting and aggregation faster. Default value is `true`, which means that the doc values are enabled. Allowed values are a single field name or a list of field names.
`dynamic` | Determines whether new fields should be added dynamically. Default value is `true`, which means that new fields can be added dynamically. Allowed values are `true`, `false`, or `strict`.
`enabled` | Specifies whether the field is enabled or disabled. Default value is `true`, which means that the field is enabled. Allowed values are `true` or `false`.
`format` | Specifies the date format for date fields. There is no default value for this parameter. Allowed values are any valid date format string, such as `yyyy-MM-dd` or `epoch_millis`.
`ignore_above` | Skips indexing values that exceed the specified length. Default value is `2147483647`, which means that there is no limit on the field value length. Allowed values are any positive integer.
`ignore_malformed` | Specifies whether malformed values should be ignored. Default value is `false`, which means that malformed values are not ignored. Allowed values are `true` or `false`.
`index` | Specifies whether a field should be indexed. Default value is `true`, which means that the field is indexed. Allowed values are `true`, `false`, or `not_analyzed`.
`index_options` | Specifies what information should be stored in an index for scoring purposes. Default value is `docs`, which means that only the document numbers are stored in the index. Allowed values are `docs`, `freqs`, `positions`, or `offsets`.