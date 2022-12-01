---
layout: default
title: Processors
parent: Reference
nav_order: 44
---

# Processors

Processors perform some action on your data: filter, transform, enrich, etc.

Prior to Data Prepper 1.3, Processors were named Preppers. Starting in Data Prepper 1.3, the term Prepper is deprecated in favor of Processor. Data Prepper will continue to support the term "Prepper" until 2.0, where it will be removed.
{: .note }


## otel_trace_raw

This processor is a Data Prepper event record type replacement of `otel_trace_raw_prepper` (no longer supported since Data Prepper 2.0). 
The processor fills in trace group related fields including 

* `traceGroup`: root span name
* `endTime`: end time of the entire trace in ISO 8601
* `durationInNanos`: duration of the entire trace in nanoseconds
* `statusCode`: status code for the entire trace in nanoseconds

in all incoming Data Prepper span records by state caching the root span info per traceId. 

Option | Required | Type | Description
:--- | :--- | :--- | :---
trace_flush_interval | No | Integer | Represents the time interval in seconds to flush all the descendant spans without any root span. Default is 180.

## service_map_stateful

Uses OpenTelemetry data to create a distributed service map for visualization in OpenSearch Dashboards.

Option | Required | Type | Description
:--- | :--- | :--- | :---
window_duration | No | Integer | Represents the fixed time window in seconds to evaluate service-map relationships. Default is 180.

## string_converter

Converts string to uppercase or lowercase. Mostly useful as an example if you want to develop your own processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
upper_case | No | Boolean | Whether to convert to uppercase (`true`) or lowercase (`false`).

## aggregate

Groups events together based on the keys provided and performs a action on each group.

Option | Required | Type | Description
:--- | :--- | :--- | :---
identification_keys | Yes | List | A unordered list by which to group Events. Events with the same values for these keys are put into the same group. If an Event does not contain one of the `identification_keys`, then the value of that key is considered to be equal to `null`. At least one identification_key is required. (e.g. `["sourceIp", "destinationIp", "port"]`).
action | Yes | AggregateAction | The action to be performed for each group. One of the available Aggregate Actions must be provided or you can create custom aggregate actions. `remove_duplicates` and `put_all` are available actions. For more information, see [creating custom aggregate actions](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#creating-new-aggregate-actions).
group_duration | No | String | The amount of time that a group should exist before it is concluded automatically. Supports ISO_8601 notation strings ("PT20.345S", "PT15M", etc.) as well as simple notation for seconds (`"60s"`) and milliseconds (`"1500ms"`). Default value is `180s`.

## date

Adds a default timestamp to the event or parses timestamp fields, and converts it to ISO 8601 format, which can be used as event timestamp.

Option | Required | Type | Description
:--- | :--- | :--- | :---
match | Conditionally | List | List of `key` and `patterns` where patterns is a list. The list of match can have exactly one `key` and `patterns`. There is no default value. This option cannot be defined at the same time as `from_time_received`. Include multiple date processors in your pipeline if both options should be used.
from_time_received | Conditionally | Boolean | A boolean that is used for adding default timestamp to event data from event metadata which is the time when source receives the event. Default value is `false`. This option cannot be defined at the same time as `match`. Include multiple date processors in your pipeline if both options should be used.
destination | No | String | Field to store the timestamp parsed by date processor. It can be used with both `match` and `from_time_received`. Default value is `@timestamp`.
source_timezone | No | String | Time zone used to parse dates. It is used in case zone or offset cannot be extracted from the value. If zone or offset are part of the value, then timezone is ignored. Find all the available timezones [the list of database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) in the "TZ database name" column.
destination_timezone | No | String | Timezone used for storing timestamp in `destination` field. The available timezone values are the same as `source_timestamp`.
locale | No | String | Locale is used for parsing dates. It's commonly used for parsing month names(`MMM`). It can have language, country and variant fields using IETF BCP 47 or String representation of [Locale](https://docs.oracle.com/javase/8/docs/api/java/util/Locale.html) object. For example `en-US` for IETF BCP 47 and `en_US` for string representation of Locale. Full list of locale fields which includes language, country and variant can be found [the language subtag registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry). Default value is `Locale.ROOT`.

## drop_events

Drops all the events that are passed into this processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
drop_when | Yes | String | Accepts a Data Prepper Expression string following the [Data Prepper Expression Syntax](https://github.com/opensearch-project/data-prepper/blob/main/docs/expression_syntax.md). Configuring `drop_events` with `drop_when: true` drops all the events received.
handle_failed_events | No | Enum | Specifies how exceptions are handled when an exception occurs while evaluating an event. Default value is `drop`, which drops the event so it doesn't get sent to OpenSearch. Available options are `drop`, `drop_silently`, `skip`, `skip_silently`. For more information, see [handle_failed_events](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/drop-events-processor#handle_failed_events).

## grok

Takes unstructured data and utilizes pattern matching to structure and extract important keys and make data more structured and queryable.

Option | Required | Type | Description
:--- | :--- | :--- | :---
match | No | Map | Specifies which keys to match specific patterns against. Default is an empty body.
keep_empty_captures | No | Boolean | Enables preserving `null` captures. Default value is `false`.
named_captures_only | No | Boolean | enables whether to keep only named captures. Default value is `true`.
break_on_match | No | Boolean | Specifies whether to match all patterns or stop once the first successful match is found. Default is `true`.
keys_to_overwrite | No | List | Specifies which existing keys are to be overwritten if there is a capture with the same key value. Default is `[]`.
pattern_definitions | No | Map | Allows for custom pattern use inline. Default value is an empty body.
patterns_directories | No | List | Specifies the path of directories that contain customer pattern files. Default value is an empty list.
pattern_files_glob | No | String | Specifies which pattern files to use from the directories specified for `pattern_directories`. Default is `*`.
target_key | No | String | Specifies a parent level key to store all captures. Default value is `null`.
timeout_millis | No | Integer | Maximum amount of time that should take place for the matching. Setting to `0` disables the timeout. Default value is `30,000`.

## key_value

Takes in a field and parses it into key/value pairs.

Option | Required | Type | Description
:--- | :--- | :--- | :---
source | No | String | The key in the event that is parsed. Default value is `message`.
destination | No | String | The key where to output the parsed source to. Doing so overwrites the value of the key if it exists. Default value is `parsed_message`
field_delimiter_regex | Conditionally | String | A regex specifying the delimiter between key/value pairs. Special regex characters such as `[` and `]` must be escaped using `\\`. This option cannot be defined at the same time as `field_split_characters`.
field_split_characters | Conditionally | String | A string of characters to split between key/value pairs. Special regex characters such as `[` and `]` must be escaped using `\\`. Default value is `&`. This option cannot be defined at the same time as `field_delimiter_regex`.
key_value_delimiter_regex| Conditionally | String | A regex specifying the delimiter between a key and a value. Special regex characters such as `[` and `]` must be escaped using `\\`. There is no default value. This option cannot be defined at the same time as `value_split_characters`.
value_split_characters | Conditionally | String | A string of characters to split between keys and values. Special regex characters such as `[` and `]` must be escaped using `\\`. Default value is `=`. This option cannot be defined at the same time as `key_value_delimiter_regex`.
non_match_value | No | String | When a key/value cannot be successfully split, the key/value is be placed in the key field and the specified value in the value field. Default value is `null`.
prefix | No | String | A prefix given to all keys. Default value is empty string.
delete_key_regex | No | String | A regex used to delete characters from the key. Special regex characters such as `[` and `]` must be escaped using `\\`. There is no default value.
delete_value_regex | No | String | A regex used to delete characters from the value. Special regex characters such as `[` and `]` must be escaped using `\\`. There is no default value.

## add_entries

Adds an entry to event. `add_entries` is part of [mutate event](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-event-processors#mutate-event-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of events to be added. Valid entries are `key`, `value`, and `overwrite_if_key_exists`.
key | N/A | N/A | Key of the new event to be added.
value | N/A | N/A | Value of the new entry to be added. Valid data types are strings, booleans, numbers, null, nested objects, and arrays containing the aforementioned data types.
overwrite_if_key_exists | No | Boolean | If true, the existing value gets overwritten if the key already exists within the event. Default is `false`.

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