---
layout: default
title: rename_keys
parent: Processors
grand_parent: Pipelines
nav_order: 85
---

# rename_keys

The `rename_keys` processor renames keys in an event.

## Configuration

You can configure the `rename_keys` processor with the following options.

| Option | Required | Description |
| :--- | :--- | :--- |
| `entries` | Yes | A list of event entries to rename. |
| `from_key` | Yes | The key of the entry to be renamed. |
| `to_key` | Yes | The new key of the entry. |
| `overwrite_if_to_key_exists` | No | When set to `true`, the existing value is overwritten if `key` already exists in the event. The default value is `false`. |

## Usage

To get started, create the following `pipeline.yaml` file:

```yaml
pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - rename_keys:
        entries:
        - from_key: "message"
          to_key: "newMessage"
          overwrite_if_to_key_exists: true
  sink:
    - stdout:
```
{% include copy.html %}


Next, create a log file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` file with that filepath. For more information, see [Configuring Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper).

For example, before you run the `rename_keys` processor, if the `logs_json.log` file contains the following event record:

```json
{"message": "hello"}
```

When you run the `rename_keys` processor, it parses the message into the following "newMessage" output:

```json
{"newMessage": "hello"}
```

> If `newMessage` already exists, its existing value is overwritten with `value`.



## Special considerations

Renaming operations occur in the order that the key-value pair entries are listed in the `pipeline.yaml` file. This means that chaining (where key-value pairs are renamed in sequence) is implicit in the `rename_keys` processor. See the following example `pipeline.yaml` file:

```yaml
pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - rename_keys:
        entries:
        - from_key: "message"
          to_key: "message2"
        - from_key: "message2"
          to_key: "message3"
  sink:
    - stdout:
```

Add the following contents to the `logs_json.log` file:

```json
{"message": "hello"}
```
{% include copy.html %}

After the `rename_keys` processor runs, the following output appears:

```json
{"message3": "hello"}
```