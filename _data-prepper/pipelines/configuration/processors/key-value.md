---
layout: default
title: Key value processor
parent: Processors
grand_parent: Pipelines
nav_order: 54
---

# key_value


The `key_value` processor parses a field into key/value pairs. The following table describes `key_value` processor options available that help you parse field information into pairs.

Option | Required | Type | Description
:--- | :--- | :--- | :---
source | No | String | The key in the event that is parsed. Default value is `message`.
destination | No | String | The destination key for the parsed source output. Outputting the parsed source overwrites the value of the key if it already exists. Default value is `parsed_message`
field_delimiter_regex | Conditionally | String | A regex specifying the delimiter between key/value pairs. Special regex characters such as `[` and `]` must be escaped using `\\`. This option cannot be defined at the same time as `field_split_characters`.
field_split_characters | Conditionally | String | A string of characters to split between key/value pairs. Special regex characters such as `[` and `]` must be escaped using `\\`. Default value is `&`. This option cannot be defined at the same time as `field_delimiter_regex`.
key_value_delimiter_regex| Conditionally | String | A regex specifying the delimiter between a key and a value. Special regex characters such as `[` and `]` must be escaped using `\\`. There is no default value. This option cannot be defined at the same time as `value_split_characters`.
value_split_characters | Conditionally | String | A string of characters to split between keys and values. Special regex characters such as `[` and `]` must be escaped using `\\`. Default value is `=`. This option cannot be defined at the same time as `key_value_delimiter_regex`.
non_match_value | No | String | When a key/value cannot be successfully split, the key/value is placed in the `key` field, and the specified value is placed in the value field. Default value is `null`.
prefix | No | String | A prefix given to all keys. Default value is empty string.
delete_key_regex | No | String | A regex used to delete characters from the key. Special regex characters such as `[` and `]` must be escaped using `\\`. There is no default value.
delete_value_regex | No | String | A regex used to delete characters from the value. Special regex characters such as `[` and `]` must be escaped using `\\`. There is no default value.



<!--- ## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section. --->