---
layout: default
title: key_value
parent: Processors
grand_parent: Pipelines
nav_order: 56
---

# key_value


You can use the `key_value` processor to parse the specified field into key-value pairs. You can customize the `key_value` processor to parse field information with the following options. The type for each of the following options is `string`.

| Option | Description | Example |
| :--- | :--- | :--- |
| source | The message field to be parsed. Optional. Default value is `message`. | If `source` is `"message1"`, `{"message1": {"key1=value1"}, "message2": {"key2=value2"}}` parses into `{"message1": {"key1=value1"}, "message2": {"key2=value2"}, "parsed_message": {"key1": "value1"}}`. |
| destination | The destination field for the parsed source. The parsed source overwrites the preexisting data for that key. Optional. If `destination` is set to `null`, the parsed fields will be written to the root of the event. Default value is `parsed_message`. | If `destination` is `"parsed_data"`, `{"message": {"key1=value1"}}` parses into `{"message": {"key1=value1"}, "parsed_data": {"key1": "value1"}}`. |
| field_delimiter_regex | A regular expression specifying the delimiter that separates key-value pairs. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be defined at the same time as `field_split_characters`. Optional. If this option is not defined, `field_split_characters` is used. | If `field_delimiter_regex` is `"&\\{2\\}"`, `{"key1=value1&&key2=value2"}` parses into `{"key1": "value1", "key2": "value2"}`. |
| field_split_characters | A string of characters specifying the delimeter that separates key-value pairs. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be defined at the same time as `field_delimiter_regex`. Optional. Default value is `&`. | If `field_split_characters` is `"&&"`, `{"key1=value1&&key2=value2"}` parses into `{"key1": "value1", "key2": "value2"}`. |
| key_value_delimiter_regex | A regular expression specifying the delimiter that separates the key and value within a key-value pair. Special regular expression characters such as `[` and `]` must be escaped with `\\`. This option cannot be defined at the same time as `value_split_characters`. Optional. If this option is not defined, `value_split_characters` is used.  | If `key_value_delimiter_regex` is `"=\\{2\\}"`, `{"key1==value1"}` parses into `{"key1": "value1"}`. |
| value_split_characters | A string of characters specifying the delimiter that separates the key and value within a key-value pair. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be defined at the same time as `key_value_delimiter_regex`. Optional. Default value is `=`. | If `value_split_characters` is `"=="`, `{"key1==value1"}` parses into `{"key1": "value1"}`. |
| non_match_value | When a key-value pair cannot be successfully split, the key-value pair is placed in the `key` field, and the specified value is placed in the `value` field. Optional. Default value is `null`. | `key1value1&key2=value2` parses into `{"key1value1": null, "key2": "value2"}`. |
| prefix | A prefix to append before all keys. Optional. Default value is an empty string. | If `prefix` is `"custom"`, `{"key1=value1"}` parses into `{"customkey1": "value1"}`.|
| delete_key_regex | A regular expression specifying the characters to delete from the key. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be an empty string. Optional. No default value. | If `delete_key_regex` is `"\s"`, `{"key1 =value1"}` parses into `{"key1": "value1"}`. |
| delete_value_regex | A regular expression specifying the characters to delete from the value. Special regular expression characters such as `[` and `]` must be escaped with `\\`. Cannot be an empty string. Optional. No default value. | If `delete_value_regex` is `"\s"`, `{"key1=value1 "}` parses into `{"key1": "value1"}`. |
| include_keys | An array specifying the keys that should be added for parsing. By default, all keys will be added. | If `include_keys` is `["key2"]`,`key1=value1&key2=value2` will parse into `{"key2": "value2"}`. |
| exclude_keys | An array specifying the parsed keys that should not be added to the event. By default, no keys will be excluded. | If `exclude_keys` is `["key2"]`, `key1=value1&key2=value2` will parse into `{"key1": "value1"}`. |
| default_values | A map specifying the default keys and their values that should be added to the event in case these keys do not exist in the source field being parsed. If the default key already exists in the message, the value is not changed. The `include_keys` filter will be applied to the message before `default_values`. | If `default_values` is `{"defaultkey": "defaultvalue"}`, `key1=value1` will parse into `{"key1": "value1", "defaultkey": "defaultvalue"}`. <br /> If `default_values` is `{"key1": "abc"}`, `key1=value1` will parse into `{"key1": "value1"}`. <br /> If `include_keys` is `["key1"]` and `default_values` is `{"key2": "value2"}`, `key1=value1&key2=abc` will parse into `{"key1": "value1", "key2": "value2"}`. |
| transform_key | When to lowercase, uppercase, or capitalize keys. | If `transform_key` is `lowercase`, `{"Key1=value1"}` will parse into `{"key1": "value1"}`. <br /> If `transform_key` is `uppercase`, `{"key1=value1"}` will parse into `{"KEY1": "value1"}`. <br /> If `transform_key` is `capitalize`, `{"key1=value1"}` will parse into `{"Key1": "value1"}`. |
| whitespace | Specifies whether to be lenient or strict with the acceptance of unnecessary white space surrounding the configured value-split sequence. Default is `lenient`. | If `whitespace` is `"lenient"`, `{"key1  =  value1"}` will parse into `{"key1  ": "  value1"}`. If `whitespace` is `"strict"`, `{"key1  =  value1"}` will parse into `{"key1": "value1"}`. |
| skip_duplicate_values | A Boolean option for removing duplicate key-value pairs. When set to `true`, only one unique key-value pair will be preserved. Default is `false`. | If `skip_duplicate_values` is `false`, `{"key1=value1&key1=value1"}` will parse into `{"key1": ["value1", "value1"]}`. If  `skip_duplicate_values` is `true`, `{"key1=value1&key1=value1"}` will parse into `{"key1": "value1"}`. |
| remove_brackets | Specifies whether to treat square brackets, angle brackets, and parentheses as value "wrappers" that should be removed from the value. Default is `false`. | If `remove_brackets` is `true`, `{"key1=(value1)"}` will parse into `{"key1": value1}`. If `remove_brackets` is `false`, `{"key1=(value1)"}` will parse into `{"key1": "(value1)"}`. |
| recursive | Specifies whether to recursively obtain additional key-value pairs from values. The extra key-value pairs will be stored as sub-keys of the root key. Default is `false`. The levels of recursive parsing must be defined by different brackets for each level: `[]`, `()`, and `<>`, in this order. Any other configurations specified will only be applied to the outmost keys. <br />When `recursive` is `true`: <br /> `remove_brackets` cannot also be `true`;<br />`skip_duplicate_values` will always be `true`; <br />`whitespace` will always be `"strict"`. | If `recursive` is true, `{"item1=[item1-subitem1=item1-subitem1-value&item1-subitem2=(item1-subitem2-subitem2A=item1-subitem2-subitem2A-value&item1-subitem2-subitem2B=item1-subitem2-subitem2B-value)]&item2=item2-value"}` will parse into `{"item1": {"item1-subitem1": "item1-subitem1-value", "item1-subitem2" {"item1-subitem2-subitem2A": "item1-subitem2-subitem2A-value", "item1-subitem2-subitem2B": "item1-subitem2-subitem2B-value"}}}`. |
| overwrite_if_destination_exists | Specifies whether to overwrite existing fields if there are key conflicts when writing parsed fields to the event. Default is `true`. | If `overwrite_if_destination_exists` is `true` and destination is `null`, `{"key1": "old_value", "message": "key1=new_value"}` will parse into `{"key1": "new_value", "message": "key1=new_value"}`. |
| tags_on_failure | When a `kv` operation causes a runtime exception within the processor, the operation is safely stopped without crashing the processor, and the event is tagged with the provided tags. | If `tags_on_failure` is set to `["keyvalueprocessor_failure"]`, `{"tags": ["keyvalueprocessor_failure"]}` will be added to the event's metadata in the event of a runtime exception. |



<!--- ## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section. --->