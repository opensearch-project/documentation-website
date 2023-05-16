---
layout: default
title: copy_values 
parent: Processors
grand_parent: Pipelines
nav_order: 48
---

# copy_values

The `copy_values` processor copies values within an event and is a [mutate event]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/mutate-event/) processor. 

## Configuration

You can configure the `copy_values` processor with the following options.

| Option | Required | Description |
:--- | :--- | :---
| `entries` | Yes | A list of entries to be copied in an event. |
| `from_key` | Yes | The key of the entry to be copied. |
| `to_key` | Yes | The key of the new entry to be added. |
| `overwrite_if_key_exists` | No | When set to `true`, the existing value is overwritten if `key` already exists in the event. The default value is `false`. |

## Usage

To get started, create the following `pipeline.yaml` file:

```yaml
pipeline:
  source:
    ...
  ....  
  processor:
    - copy_values:
        entries:
        - from_key: "message"
          to_key: "newMessage"
          overwrite_if_to_key_exists: true
  sink:
```
{% include copy.html %}

Next, create a log file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` file with that filepath. For more information, see [Configuring Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper). 

For example, before you run the `copy_values` processor, if the `logs_json.log` file contains the following event record:

```json
{"message": "hello"}
```

When you run this processor, it parses the message into the following output:

```json
{"message": "hello", "newMessage": "hello"}
```

If `newMessage` already exists, its existing value is overwritten with `value`.
