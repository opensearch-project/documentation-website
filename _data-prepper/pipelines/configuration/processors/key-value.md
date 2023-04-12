---
layout: default
title: key_value
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# key_value

## Overview

You can use the `key_value` processor to parse the specified field into key-value pairs. You can customize the `key_value` processor to parse field information with the following options. The type for each of the following options is `string`.

| Option | Required | Default value | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| source | No | `message` | The message field to be parsed. | `source` is `"message1"`. `{"message1": {"key1=value1"}, "message2": {"key2=value2"}}` parses into `{"message1": {"key1=value1"}, "message2": {"key2=value2"}, "parsed_message": {"key1": "value1"}}`. |
| destination | No | `parsed_message` | The destination field for the parsed source. The parsed source overwrites the preexisting data for that key. | `destination` is `"parsed_data"`. `{"message": {"key1=value1"}}` parses into `{"message": {"key1=value1"}, "parsed_data": {"key1": "value1"}}`. |
| field_delimiter_regex | Conditionally | N/A | A regular expression (regex) specifying the delimiter that separates key-value pairs. Special characters such as `[` and `]` must be escaped with `\\`. This option cannot be defined at the same time as `field_split_characters`. | `field_delimiter_regex` is `"&\\{2\\}"`. `{"key1=value1&&key2=value2"}` parses into `{"key1": "value1", "key2": "value2"}`. |
| field_split_characters | Conditionally | `&` | A string of characters specifying the delimeter that separates key-value pairs. Special regex characters such as `[` and `]` must be escaped with `\\`. This option cannot be defined at the same time as `field_delimiter_regex`. | `field_split_characters` is `"&&"`. `{"key1=value1&&key2=value2"}` parses into `{"key1": "value1", "key2": "value2"}`. |
| key_value_delimiter_regex| Conditionally | N/A | A regex specifying that separates a key and a value within a key-value pair. Special regex characters such as `[` and `]` must be escaped with `\\`. This option cannot be defined at the same time as `value_split_characters`. | `key_value_delimiter_regex` is `"=\\{2\\}"`. `{"key1==value1"}` parses into `{"key1": "value1"}`. |
| value_split_characters | Conditionally | `=` | A string of characters specifying the delimiter that separates a key and value within a key-value pair. Special regex characters such as `[` and `]` must be escaped with `\\`. This option cannot be defined at the same time as `key_value_delimiter_regex`. | `value_split_characters` is `"=="`. `{"key1==value1"}` parses into `{"key1": "value1"}`. |
| non_match_value | No | `null` | When a key-value cannot be successfully split, the key-value pair is placed in the `key` field, and the specified value is placed in the value field. | `key1value1&key2=value2` parses into `{"key1value1": null, "key2": "value2"}`. |
| prefix | No | Empty `string` | A prefix to append before all keys. | `prefix` is `"custom"`. `{"key1=value1"}` parses into `{"customkey1": "value1"}`. This is the only option that has a type of `empty string`.|
| delete_key_regex | No | N/A | A regex specifying the characters to delete from the key. Special regex characters such as `[` and `]` must be escaped with `\\`. | `delete_key_regex` is `"\s"`. `{"key1 =value1"}` parses into `{"key1": "value1"}`. |
| delete_value_regex | No | N/A | A regex specifying the characters to delete from the value. Special regex characters such as `[` and `]` must be escaped with `\\`. | `delete_value_regex` is `"\s"`. `{"key1=value1 "}` parses into `{"key1": "value1"}`. |



<!--- ## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section. --->