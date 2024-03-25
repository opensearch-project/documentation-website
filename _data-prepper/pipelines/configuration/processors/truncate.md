---
layout: default
title: truncate
parent: Processors
grand_parent: Pipelines
nav_order: 121
---

# truncate

The `truncate` processor truncates a key's value at the beginning, the end or, on both sides of the value string based on processor's configuration. If the key's value is a list, then each member in the string list is truncated. Non-string members of the list are left untouched. When the `truncate_when` option is provided, the truncation of the input is done only when the condition specified is true for the event being processed.

## Configuration

You can configure the `truncate` processor using the following options.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`entries` | Yes | String list | A list of entries to add to an event.
`source_keys` | Yes | String list | The list of sources keys that will be modified by the processor.
`truncate_when` | No | Conditional expression | A condition that, when met, determines when the truncate operation is performed. 
`start_at` | No | Integer | Where inside the string value to start the truncation process. Default is `0`, which means the truncation of each key's value starts at the beginning.
`length` | No | Integer| The length of the string after truncation. When not specified, the processor will measure the length based on where the string ends.

For the `truncate` processor to run either the `start_at` or `length` options must be present in the configuration. For greater customization, you can define both values inside the configuration. 

## Usage

The following examples show how to configure the `truncate` processor inside the `pipeline.yaml` file:

## Example: Minimum configuration

The following example shows the minimum configuration of the `truncate` processor:

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

Then, the `truncate` processor produces the following output in which: 

- The `message1` and `message 2` keys have the `start_at` setting set to `0`, indicating the truncation will being the start of the string, with the string itself truncated to a length of `5`.
- The `info` key has the `start_at` setting set to `4`, indicating the truncation will begin at the `i` letter of the string, with the string truncated to a length of `6`.
- The `log` key has a `start_at` setting set to `5` with no length indicated, meaning truncation will being at letter `l` of the string.

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

When the `truncate` processors runs on the events, only the first event is truncated because the `id` key contains a value of `1`:

```json
{"message": "world", "id": 1}
{"message": "hello, world,not-truncated", "id": 2}
```
