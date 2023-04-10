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
| source | No | `message` | The key in the event that is parsed. | `source` is `"message1"`. `{"message1": {"key1=value1"}, "message2": {"key2=value2"}}` parses into `{"message1": {"key1=value1"}, "message2": {"key2=value2"}, "parsed_message": {"key1": "value1"}}`. |
| destination | No | `parsed_message` | The destination key for the parsed source output. Outputting the parsed source overwrites the value of the key if it already exists. | `destination` is `"parsed_data"`. `{"message": {"key1=value1"}}` parses into `{"message": {"key1=value1"}, "parsed_data": {"key1": "value1"}}`. |
| field_delimiter_regex | Conditionally | N/A | A regular expression (regex) specifying the delimiter between key-value pairs. Special regex characters such as `[` and `]` must be escaped using `\\`. This option cannot be defined at the same time as `field_split_characters`. | `field_delimiter_regex` is `"&\\{2\\}"`. `{"key1=value1&&key2=value2"}` parses into `{"key1": "value1", "key2": "value2"}`. |
| field_split_characters | Conditionally | `&` | A string of characters to split between key-value pairs. Special regex characters such as `[` and `]` must be escaped using `\\`. This option cannot be defined at the same time as `field_delimiter_regex`. | `field_split_characters` is `"&&"`. `{"key1=value1&&key2=value2"}` parses into `{"key1": "value1", "key2": "value2"}`. |
| key_value_delimiter_regex| Conditionally | N/A | A regex specifying the delimiter between a key and a value. Special regex characters such as `[` and `]` must be escaped using `\\`. This option cannot be defined at the same time as `value_split_characters`. | `key_value_delimiter_regex` is `"=\\{2\\}"`. `{"key1==value1"}` parses into `{"key1": "value1"}`. |
| value_split_characters | Conditionally | `=` | A string of characters to split between keys and values. Special regex characters such as `[` and `]` must be escaped using `\\`. This option cannot be defined at the same time as `key_value_delimiter_regex`. | `value_split_characters` is `"=="`. `{"key1==value1"}` parses into `{"key1": "value1"}`. |
| non_match_value | No | `null` | When a key-value cannot be successfully split, the key-value is placed in the `key` field, and the specified value is placed in the value field. | `key1value1&key2=value2` parses into `{"key1value1": null, "key2": "value2"}`. |
| prefix | No | Empty `string` | A prefix given to all keys. | `prefix` is `"custom"`. `{"key1=value1"}` parses into `{"customkey1": "value1"}`. This is the only option that has a type of `empty string`.|
| delete_key_regex | No | N/A | A regex used to delete characters from the key. Special regex characters such as `[` and `]` must be escaped using `\\`. | `delete_key_regex` is `"\s"`. `{"key1 =value1"}` parses into `{"key1": "value1"}`. |
| delete_value_regex | No | N/A | A regex used to delete characters from the value. Special regex characters such as `[` and `]` must be escaped using `\\`. | `delete_value_regex` is `"\s"`. `{"key1=value1 "}` parses into `{"key1": "value1"}`. |



<!--- ## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section. --->