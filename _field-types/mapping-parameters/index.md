---
layout: default
title: Mapping parameters
nav_order: 75
has_children: true
has_toc: false
---

# Mapping parameters

Mapping parameters are used to configure the behavior of fields in an index. For parameter use cases, see the mapping parameter's respective page.

The following table lists OpenSearch mapping parameters.

Parameter | Description
:--- | :---
`analyzer` | Specifies the analyzer used to analyze string fields. Default is the `standard` analyzer, which is a general-purpose analyzer that splits text on white space and punctuation, converts to lowercase, and removes stop words. Allowed values are `standard`, `simple`, and`whitespace`. 
`boost` | Specifies a field-level query time to boost. Default boost value is `1.0`, which means no boost is applied. Allowed values are any floating-point number.
`coerce` | Tries to convert the value to the specified data type. Default value is `true`, which means OpenSearch tries to coerce the value to the expected value type. Allowed values are `true` or `false`.
`copy_to` | Copies the values of this field to another field. There is no default value for this parameter. It is an optional parameter that allows you to copy the value of a field to another field. 
`doc_values` | Specifies whether the field should be stored on disk to make sorting and aggregation faster. Default value is `true`, which means the doc values are enabled. Allowed values are a single field name or a list of field names. Allowed values are `true` or `false`.
`dynamic` | Determines whether new fields should be added dynamically. Default value is `true`, which means new fields can be added dynamically. Allowed values are `true`, `false`, or `strict`.
`enabled` | Specifies whether the field is enabled or disabled. Default value is `true`, which means the field is enabled. Allowed values are `true` or `false`.
`format` | Specifies the date format for date fields. There is no default value for this parameter. It is used for date fields to specify the date format. Allowed values are any valid date format string, such as `yyyy-MM-dd` or `epoch_millis`.
`ignore_above` | Skips indexing values that are longer than the specified length. Default value is `2147483647`, which means there is no limit on the length of the field value. Allowed values are any positive integer.
`ignore_malformed` | Specifies whether malformed values should be ignored. Default value is `false`, which means malformed values are not ignored. . Allowed values are `true` or `false`.
`index` | Specifies whether the field should be indexed. Default value is `true`, which means the field is indexed. Allowed values are `true`, `false`, or `not_analyzed`.
`index_options` | Specifies what information should be stored in the index for scoring purposes. Default value `docs`, which means only the document numbers are stored in the index. Allowed values are `docs`, `freqs`, `positions`, or `offsets`.