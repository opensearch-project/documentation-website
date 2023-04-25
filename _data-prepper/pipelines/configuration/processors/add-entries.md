---
layout: default
title: Add entries processor
parent: Processors
grand_parent: Pipelines
nav_order: 40
---

# add_entries

The `add_entries` processor adds entries to an event.

### Configuration

You can configure the `add_entries` processor with the following options.

| Option | Required | Description |
| :--- | :--- | :--- |
| `entries` | Yes | A list of entries to add to an event. |
| `key` | Yes | The key of the new entry to be added. Some examples of keys include `my_key`, `myKey`, and `object/sub_Key`. |
| `value` | Yes | The value of the new entry to be added. You can use the following data types: strings, Booleans, numbers, null, nested objects, and arrays. |
| `overwrite_if_key_exists` | No | When set to `true`, the existing value is overwritten if `key` already exists in the event. The default value is `false`. |

### Usage

To get started, create the following `pipeline.yaml` file:

```yaml
pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - add_entries:
        entries:
        - key: "newMessage"
          value: 3
          overwrite_if_key_exists: true
  sink:
    - stdout:
```
{% include copy.html %}


Next, create a log file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` file with that filepath. For more information, see [Configuring Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper).

For example, before you run the `add_entries` processor, if the `logs_json.log` file contains the following event record:

```json
{"message": "hello"}
```

Then when you run the `add_entries` processor using the previous configuration, it adds a new entry `{"newMessage": 3}` to the existing event `{"message": "hello"}` so that the new event contains two entries in the final output:

```json
{"message": "hello", "newMessage": 3}
```

> If `newMessage` already exists, its existing value is overwritten with a value of `3`.

