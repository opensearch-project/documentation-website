---
layout: default
title: truncate
parent: Processors
grand_parent: Pipelines
nav_order: 121
---

# truncate

The `truncate` processor truncates a key's value at the beginning, the end, or on both sides of the value string, based on the processor's configuration. If the key's value is a list, then each member in the string list is truncated. Non-string members of the list are not truncated. When the `truncate_when` option is provided, input is truncated only when the condition specified is `true` for the event being processed.

## Configuration

You can configure the `truncate` processor using the following options.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`entries` | Yes | String list | A list of entries to add to an event.
`source_keys` | No | String list | The list of source keys that will be modified by the processor. The default value is an empty list, which indicates that all values will be truncated.
`truncate_when` | No | Conditional expression | A condition that, when met, determines when the truncate operation is performed. 
`start_at` | No | Integer | Where in the string value to start truncation. Default is `0`, which specifies to start truncation at the beginning of each key's value.
`length` | No | Integer| The length of the string after truncation. When not specified, the processor will measure the length based on where the string ends.

Either the `start_at` or `length` options must be present in the configuration in order for the `truncate` processor to run. You can define both values in the configuration in order to further customize where truncation occurs in the string.

## Usage

The following examples show how to configure the `truncate` processor in the `pipeline.yaml` file:

## Example: Minimum configuration

The following example shows the minimum configuration for the `truncate` processor:

```yaml
pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - truncate:
        entries:
          - source_keys: ["message1", "message2"]
            length: 5
          - source_keys: ["info"]
            length: 6
            start_at: 4
          - source_keys: ["log"]
            start_at: 5
  sink:
    - stdout:
```

For example, the following event contains several keys with string values:

```json
{"message1": "hello,world", "message2": "test message", "info", "new information", "log": "test log message"}
```

The `truncate` processor produces the following output, where:

- The `start_at` setting is `0` for the `message1` and `message 2` keys, indicating that truncation will begin at the start of the string, with the string itself truncated to a length of `5`.
- The `start_at` setting is `4` for the `info` key, indicating that truncation will begin at letter `i` of the string, with the string truncated to a length of `6`.
- The `start_at` setting is `5` for the `log` key, with no length specified, indicating that truncation will begin at letter `l` of the string.

```json
{"message1":"hello", "message2":"test ", "info":"inform", "log": "log message"}
```


## Example: Using `truncate_when`

The following example configuration shows the `truncate` processor with the `truncate_when` option configured:

```yaml
pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - truncate:
        entries:
          - source_keys: ["message"]
            length: 5
            start_at: 8
            truncate_when: '/id == 1'
  sink:
    - stdout:
```

The following example contains two events:

```json
{"message": "hello, world", "id": 1}
{"message": "hello, world,not-truncated", "id": 2}
```

When the `truncate` processor runs on the events, only the first event is truncated because the `id` key contains a value of `1`:

```json
{"message": "world", "id": 1}
{"message": "hello, world,not-truncated", "id": 2}
```
