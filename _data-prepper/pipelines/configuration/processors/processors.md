---
layout: default
title: Processors
has_children: true
parent: Pipelines
nav_order: 25
---

# Processors

Processors perform some action on your data: filter, transform, enrich, etc.

Prior to Data Prepper 1.3, Processors were named Preppers. Starting in Data Prepper 1.3, the term Prepper is deprecated in favor of Processor. Data Prepper will continue to support the term "Prepper" until 2.0, where it will be removed.
{: .note }

## copy_values

Copy values within an event. `copy_values`  is part of [mutate event](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-event-processors#mutate-event-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of entries to be copied. Valid values are `from_key`, `to_key`, and `overwrite_if_key_exists`.
from_key | N/A | N/A | The key of the entry to be copied.
to_key | N/A | N/A | The key of the new entry to be added.
overwrite_if_to_key_exists | No | Boolean | If true, the existing value gets overwritten if the key already exists within the event. Default is `false`.


## delete_entries

Delete entries in an event. `delete_entries` is part of [mutate event](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-event-processors#mutate-event-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
with_keys | Yes | List |  An array of keys of the entries to be deleted.

## rename_keys

Rename keys in an event. `rename_keys` is part of [mutate event](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-event-processors#mutate-event-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of entries. Valid values are `from_key`, `to_key`, and `overwrite_if_key_exists`. Renaming occurs in the order defined.
from_key | N/A | N/A | The key of the entry to be renamed.
to_key | N/A | N/A | The new key of the entry.
overwrite_if_to_key_exists | No | Boolean | If true, the existing value gets overwritten if `to_key` already exists in the event.

## substitute_string

Matches a key's value against a regular expression and replaces all matches with a replacement string. `substitute_string` is part of [mutate string](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-string-processors#mutate-string-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of entries. Valid values are `source`, `from`, and `to`.
source | N/A | N/A | The key to modify.
from | N/A | N/A | The Regex String to be replaced. Special regex characters such as `[` and `]` must be escaped using `\\` when using double quotes and `\ ` when using single quotes. See [Java Patterns](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/regex/Pattern.html) for more information.
to | N/A | N/A | The String to be substituted for each match of `from`.

## split_string

Splits a field into an array using a delimiter character. `split_string` is part of [mutate string](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-string-processors#mutate-string-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of entries. Valid values are `source`, `delimiter`, and `delimiter_regex`.
source | N/A | N/A | The key to split.
delimiter | No | N/A | The separator character responsible for the split. Cannot be defined at the same time as `delimiter_regex`. At least `delimiter` or `delimiter_regex` must be defined.
delimiter_regex | No | N/A | The regex string responsible for the split. Cannot be defined at the same time as `delimiter`. At least `delimiter` or `delimiter_regex` must be defined.

## uppercase_string

Converts a string to its uppercase counterpart. `uppercase_string` is part of [mutate string](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-string-processors#mutate-string-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
with_keys | Yes | List | A list of keys to convert to uppercase.

## lowercase_string

Converts a string to its lowercase counterpart. `lowercase_string` is part of [mutate string](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-string-processors#mutate-string-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
with_keys | Yes | List | A list of keys to convert to lowercase.

## trim_string

Strips whitespace from the beginning and end of a key. `trim_string` is part of [mutate string](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-string-processors#mutate-string-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
with_keys | Yes | List | A list of keys to trim the whitespace from.

## csv

Takes in an Event and parses its CSV data into columns.

Option | Required | Type | Description
:--- | :--- | :--- | :---
source | No | String | The field in the Event that will be parsed. Default is `message`.
quote_character | No | String | The character used as a text qualifier for a single column of data. Default is double quote `"`.
delimiter | No | String | The character separating each column. Default is `,`.
delete_header | No | Boolean | If specified, the header on the Event (`column_names_source_key`) deletes after the Event is parsed. If there’s no header on the Event, no actions is taken. Default is true.
column_names_source_key | No | String | The field in the Event that specifies the CSV column names, which will be autodetected. If there must be extra column names, the column names autogenerate according to their index. If `column_names` is also defined, the header in `column_names_source_key` can also be used to generate the Event fields. If too few columns are specified in this field, the remaining column names autogenerate. If too many column names are specified in this field, CSV processor omits the extra column names.
column_names | No | List | User-specified names for the CSV columns. Default is `[column1, column2, ..., columnN]` if there are N columns of data in the CSV record and `column_names_source_key` is not defined. If `column_names_source_key` is defined, the header in `column_names_source_key` generates the Event fields. If too few columns are specified in this field, the remaining column names will autogenerate. If too many column names are specified in this field, CSV processor omits the extra column names.

## json

Takes in an Event and parses its JSON data, including any nested fields.

Option | Required | Type | Description
:--- | :--- | :--- | :---
source | No | String | The field in the `Event` that will be parsed. Default is `message`.
destination | No | String | The destination field of the parsed JSON. Defaults to the root of the `Event`. Cannot be `""`, `/`, or any whitespace-only `String` because these are not valid `Event` fields.
pointer | No | String | A JSON Pointer to the field to be parsed. There is no `pointer` by default, meaning the entire `source` is parsed. The `pointer` can access JSON Array indices as well. If the JSON Pointer is invalid then the entire `source` data is parsed into the outgoing `Event`. If the pointed-to key already exists in the `Event` and the `destination` is the root, then the pointer uses the entire path of the key.


# Routes

Routes define conditions that can be used in sinks for conditional routing. Routes are specified at the same level as processors and sinks under the name `route` and consist of a list of key-value pairs, where the key is the name of a route and the value is a Data Prepper expression representing the routing condition.

# Sinks

Sinks define where Data Prepper writes your data to. 