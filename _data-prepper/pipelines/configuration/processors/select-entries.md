---
layout: default
title: Select entries
parent: Processors
grand_parent: Pipelines
nav_order: 320
---

# Select entries processor

The `select_entries` processor selects entries from an OpenSearch Data Prepper event.
Only the selected entries remain in the processed event and while all other entries are removed. However, the processor does not remove any events from the Data Prepper pipeline.

## Configuration

You can configure the `select_entries` processor using the following options.

| Option | Required | Description |
| :--- |:---------| :--- |
| `include_keys` | No       | A list of keys to be selected from an event. |
| `include_keys_regex` | No | A regex pattern that matches the keys to be selected from an event. |
| `select_when` | No       | A [conditional expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/), such as `/some-key == "test"'`, that will be evaluated to determine whether the processor will be run on the event. If the condition is not met, then the event continues through the pipeline unmodified with all the original fields present. |

## Usage

The following example shows how to configure the `select_entries` processor in the `pipeline.yaml` file:

```yaml
pipeline:
  source:
    ...
  ....  
  processor:
    - select_entries:
        include_keys: [ "key1", "key2" ]
        include_keys_regex: ["^ran.*"]
        select_when: '/some_key == "test"'
  sink:
```
{% include copy.html %}


For example, when your source contains the following event record:

```json
{
  "message": "hello",
  "key1" : "value1",
  "key2" : "value2",
  "some_key" : "test",
  "random1": "another",
  "random2" : "set",
  "random3": "of",
  "random4": "values"
}
```

The `select_entries` processor will output:

```json
{"key1": "value1", "key2": "value2", "random1": "another", "random2" : "set", "random3": "of", "random4": "values"}
```

### Accessing nested fields

Use `/` to access nested fields.

For example, when your source contains the following events with nested fields:

```
{
  "field1": "abc",
  "field2": 123,
  "field3": {
    "name": "Alice",
    "surname": "Smith"
  },
  "field4": {
    "address": "123 Main St"
  }
}
```

You can use the following syntax to select a subset of fields:

```
pipeline:
  source:
    ...
  ....  
  processor:
    - select_entries:
        include_keys:
          - field1
          - field2
          - field3/name
        select_when: '/field3/surname == "Smith"'
  sink:
```

