---
layout: default
title: key_value
parent: Processors
grand_parent: Pipelines
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/key-value/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/key-value/
---

# key_value

## Overview

You can use the `key_value` processor to parse the specified field into key-value pairs. You can customize the `key_value` processor to parse field information with the following options. The type for each of the following options is `string`.

| Option | Description | Example |
| :--- | :--- | :--- |
| source | The message field to be parsed. Optional. Default value is `message`. | If `source` is `"message1"`, `{"message1": {"key1=value1"}, "message2": {"key2=value2"}}` parses into `{"message1": {"key1=value1"}, "message2": {"key2=value2"}, "parsed_message": {"key1": "value1"}}`. |
| destination | The destination field for the parsed source. The parsed source overwrites the preexisting data for that key. Optional. Default value is `parsed_message`. | If `destination` is `"parsed_data"`, `{"message": {"key1=value1"}}` parses into `{"message": {"key1=value1"}, "parsed_data": {"key1": "value1"}}`. |
| field_delimiter_regex | A regular expression specifying the delimiter that separates key-value pairs. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be defined at the same time as `field_split_characters`. Optional. If this option is not defined, `field_split_characters` is used. | If `field_delimiter_regex` is `"&\\{2\\}"`, `{"key1=value1&&key2=value2"}` parses into `{"key1": "value1", "key2": "value2"}`. |
| field_split_characters | A string of characters specifying the delimeter that separates key-value pairs. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be defined at the same time as `field_delimiter_regex`. Optional. Default value is `&`. | If `field_split_characters` is `"&&"`, `{"key1=value1&&key2=value2"}` parses into `{"key1": "value1", "key2": "value2"}`. |
| key_value_delimiter_regex | A regular expression specifying the delimiter that separates the key and value within a key-value pair. Special regular expression characters such as `[` and `]` must be escaped with `\\`. This option cannot be defined at the same time as `value_split_characters`. Optional. If this option is not defined, `value_split_characters` is used.  | If `key_value_delimiter_regex` is `"=\\{2\\}"`, `{"key1==value1"}` parses into `{"key1": "value1"}`. |
| value_split_characters | A string of characters specifying the delimiter that separates the key and value within a key-value pair. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be defined at the same time as `key_value_delimiter_regex`. Optional. Default value is `=`. | If `value_split_characters` is `"=="`, `{"key1==value1"}` parses into `{"key1": "value1"}`. |
| non_match_value | When a key-value pair cannot be successfully split, the key-value pair is placed in the `key` field, and the specified value is placed in the `value` field. Optional. Default value is `null`. | `key1value1&key2=value2` parses into `{"key1value1": null, "key2": "value2"}`. |
| prefix | A prefix to append before all keys. Optional. Default value is an empty string. | If `prefix` is `"custom"`, `{"key1=value1"}` parses into `{"customkey1": "value1"}`.|
| delete_key_regex | A regular expression specifying the characters to delete from the key. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be an empty string. Optional. No default value. | If `delete_key_regex` is `"\s"`, `{"key1 =value1"}` parses into `{"key1": "value1"}`. |
| delete_value_regex | A regular expression specifying the characters to delete from the value. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be an empty string. Optional. No default value. | If `delete_value_regex` is `"\s"`, `{"key1=value1 "}` parses into `{"key1": "value1"}`. |



<!--- ## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section. --->