---
layout: default
title: copy_values 
parent: Processors
grand_parent: Pipelines
nav_order: 48
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/copy-values/
---

# copy_values

The `copy_values` processor copies values within an event and is a [mutate event]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/mutate-event/) processor. 

## Configuration

You can configure the `copy_values` processor with the following options.

| Option | Required | Type | Description |
:--- | :--- | :--- | :---
| `entries` | Yes | [entry](#entry) | A list of entries to be copied in an event. See [entry](#entry) for more information. |
| `from_list` | No | String | The key for the list of objects to be copied. |
| `to_list` | No | String | The key for the new list to be added. |
| `overwrite_if_to_list_exists` | No | Boolean | When set to `true`, the existing value is overwritten if the `key` specified by `to_list` already exists in the event. Default is `false`. |

## entry

For each entry, you can configure the following options.

| Option | Required | Type | Description |
:--- | :--- | :--- | :---
| `from_key` | Yes | String | The key for the entry to be copied. |
| `to_key` | Yes | String | The key for the new entry to be added. |
| `overwrite_if_to_key_exists` | No | Boolean | When set to `true`, the existing value is overwritten if the `key` already exists in the event. Default is `false`. |


## Usage

The following examples show you how to use the `copy_values` processor.

### Example: Copy values and skip existing fields

The following example shows you how to configure the processor to copy values and skip existing fields:

```yaml
...
  processor:
    - copy_values:
        entries:
          - from_key: "message1"
            to_key: "message2"
          - from_key: "message1"
            to_key: "message3"
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"message1": "hello", "message2": "bye"}
```

The processor copies "message1" to "message3" but not to "message2" because "message2" already exists. The processed event contains the following data:

```json
{"message1": "hello", "message2": "bye", "message3": "hello"}
```

### Example: Copy values with overwrites

The following example shows you how to configure the processor to copy values:

```yaml
...
  processor:
    - copy_values:
        entries:
          - from_key: "message1"
            to_key: "message2"
            overwrite_if_to_key_exists: true
          - from_key: "message1"
            to_key: "message3"
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"message1": "hello", "message2": "bye"}
```

The processor copies "message1" to both "message2" and "message3", overwriting the existing value in "message2". The processed event contains the following data:

```json
{"message1": "hello", "message2": "hello", "message3": "hello"}
```

### Example: Selectively copy values between two lists of objects

The following example shows you how to configure the processor to copy values between lists:

```yaml
...
  processor:
    - copy_values:
        from_list: mylist
        to_list: newlist
        entries:
          - from_key: name
            to_key: fruit_name
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{
  "mylist": [
    {"name": "apple", "color": "red"},
    {"name": "orange", "color": "orange"}
  ]
}
```

The processed event contains a `newlist` with selectively copied fields:

```json
{
  "newlist": [
    {"fruit_name": "apple"},
    {"fruit_name": "orange"}
  ],
  "mylist": [
    {"name": "apple", "color": "red"},
    {"name": "orange", "color": "orange"}
  ]
}
```
