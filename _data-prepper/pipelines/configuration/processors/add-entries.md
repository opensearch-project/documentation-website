---
layout: default
title: add_entries
parent: Processors
grand_parent: Pipelines
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/add-entries/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/add-entries/
---

# add_entries

The `add_entries` processor adds entries to an event.

### Configuration

You can configure the `add_entries` processor with the following options.

| Option | Required | Description |
| :--- | :--- | :--- |
| `entries` | Yes | A list of entries to add to an event. |
| `key` | Yes | The key of the new entry to be added. Some examples of keys include `my_key`, `myKey`, and `object/sub_Key`. |
| `metadata_key` | Yes | The key for the new metadata attribute. The argument must be a literal string key and not a JSON Pointer. Either one string key or `metadata_key` is required. |
| `format` | No | A format string to use as the value of the new entry, for example, `${key1}-${key2}`, where `key1` and `key2` are existing keys in the event. Required if neither `value` nor `value_expression` is specified. |
| `value_expression` | No | An expression string to use as the value of the new entry. For example, `/key` is an existing key in the event with a type of either a number, a string, or a Boolean. Expressions can also contain functions returning number/string/integer. For example, `length(/key)` will return the length of the key in the event when the key is a string. For more information about keys, see [Expression syntax](https://docs.opensearch.org/latest/data-prepper/pipelines/expression-syntax/).  |
| `add_when` | No | A [conditional expression](https://docs.opensearch.org/latest/data-prepper/pipelines/expression-syntax/), such as `/some-key == "test"'`, that will be evaluated to determine whether the processor will be run on the event. |
| `value` | Yes | The value of the new entry to be added. You can use the following data types: strings, Booleans, numbers, null, nested objects, and arrays. |
| `overwrite_if_key_exists` | No | When set to `true`, the existing value is overwritten if `key` already exists in the event. The default value is `false`. |

### Usage

To get started, create the following `pipeline.yaml` file:

```yaml
pipeline:
  source:
    ...
  ....  
  processor:
    - add_entries:
        entries:
        - key: "newMessage"
          value: 3
          overwrite_if_key_exists: true
        - metadata_key: myMetadataKey
          value_expression: 'length("newMessage")'
          add_when: '/some_key == "test"'
  sink:
```
{% include copy.html %}


For example, when your source contains the following event record:

```json
{"message": "hello"}
```

And then you run the `add_entries` processor using the example pipeline, it adds a new entry, `{"newMessage": 3}`, to the existing event, `{"message": "hello"}`, so that the new event contains two entries in the final output:

```json
{"message": "hello", "newMessage": 3}
```

If `newMessage` already exists, its existing value is overwritten with a value of `3`.

