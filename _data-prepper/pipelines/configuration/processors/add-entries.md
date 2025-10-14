---
layout: default
title: Add entries
parent: Processors
grand_parent: Pipelines
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/add-entries/
---

# Add entries processor

The `add_entries` processor adds entries to an event.

## Configuration

You can configure the `add_entries` processor with the following options.

| Option | Required | Description |
| :--- | :--- | :--- |
| `entries` | Yes | A list of entries to add to an event. |
| `key` | No | The key of the new entry to be added. Some examples of keys include `my_key`, `myKey`, and `object/sub_Key`. The key can also be a format expression, for example, `${/key1}` to use the value of field `key1` as the key. |
| `metadata_key` | No | The key for the new metadata attribute. The argument must be a literal string key and not a JSON Pointer. Either one string key or `metadata_key` is required. |
| `value` | No | The value of the new entry to be added, which can be used with any of the following data types: strings, Booleans, numbers, null, nested objects, and arrays. |
| `format` | No | A format string to use as the value of the new entry, for example, `${key1}-${key2}`, where `key1` and `key2` are existing keys in the event. Required if neither `value` nor `value_expression` is specified. |
| `value_expression` | No | An expression string to use as the value of the new entry. For example, `/key` is an existing key in the event with a type of either a number, a string, or a Boolean. Expressions can also contain functions returning number/string/integer. For example, `length(/key)` will return the length of the key in the event when the key is a string. For more information about keys, see [Expression syntax]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/).  |
| `add_when` | No | A [conditional expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/), such as `/some-key == "test"'`, that will be evaluated to determine whether the processor will be run on the event. |
| `overwrite_if_key_exists` | No | When set to `true`, the existing value is overwritten if `key` already exists in the event. The default value is `false`. |
| `append_if_key_exists` | No | When set to `true`, the existing value will be appended if a `key` already exists in the event. An array will be created if the existing value is not an array. Default is `false`. |


## Usage

The following examples show how the `add_entries` processor can be used in different cases.

### Example: Add entries with simple values

The following example shows you how to configure the processor to add entries with simple values:

```yaml
... 
  processor:
    - add_entries:
        entries:
          - key: "name"
            value: "John"
          - key: "age"
            value: 20
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"message": "hello"}
```

The processed event will contain the following data:

```json
{"message": "hello", "name": "John", "age": 20}
```

### Example: Add entries using format strings

The following example shows you how to configure the processor to add entries with values from other fields:

```yaml
... 
  processor:
    - add_entries:
        entries:
          - key: "date"
            format: "${month}-${day}"
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"month": "Dec", "day": 1}
```

The processed event will contain the following data:

```json
{"month": "Dec", "day": 1, "date": "Dec-1"}
```

### Example: Add entries using value expressions

The following example shows you how to configure the processor to use the `value_expression` option:

```yaml
... 
  processor:
    - add_entries:
        entries:
          - key: "length"
            value_expression: "length(/message)"
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"message": "hello"}
```

The processed event will contain the following data:

```json
{"message": "hello", "length": 5}
```

### Example: Add metadata

The following example shows you how to configure the processor to add metadata to events:

```yaml
... 
  processor:
    - add_entries:
        entries:
          - metadata_key: "length"
            value_expression: "length(/message)"
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"message": "hello"}
```

The processed event will have the same data, with the metadata, `{"length": 5}`, attached. You can subsequently use expressions like `getMetadata("length")` in the pipeline. For more information, see [`getMetadata` function]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/get-metadata/).


### Example: Add a dynamic key

The following example shows you how to configure the processor to add metadata to events using a dynamic key:

```yaml
... 
  processor:
    - add_entries:
        entries:
          - key: "${/param_name}"
            value_expression: "/param_value"
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"param_name": "cpu", "param_value": 50}
```

The processed event will contain the following data:

```json
{"param_name": "cpu", "param_value": 50, "cpu": 50}
```

### Example: Overwrite existing entries

The following example shows you how to configure the processor to overwrite existing entries:

```yaml
... 
  processor:
    - add_entries:
        entries:
          - key: "message"
            value: "bye"
            overwrite_if_key_exists: true
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"message": "hello"}
```

The processed event will contain the following data:

```json
{"message": "bye"}
```

If `overwrite_if_key_exists` is not set to `true`, then the input event will not be changed after processing.

### Example: Append values to existing entries

The following example shows you how to configure the processor to append values to existing entries:

```yaml
... 
  processor:
    - add_entries:
        entries:
          - key: "message"
            value: "world"
            append_if_key_exists: true
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"message": "hello"}
```

The processed event will contain the following data:

```json
{"message": ["hello", "world"]}
```
