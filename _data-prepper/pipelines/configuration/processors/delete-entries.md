---
layout: default
title: delete_entries
parent: Processors
grand_parent: Pipelines
nav_order: 51
---

# delete_entries

The `delete_entries` processor deletes entries, such as key-value pairs, from an event. You can define the keys you want to delete in the `with-keys` field following `delete_entries` in the YAML configuration file. Those keys and their values are deleted. 

## Configuration

You can configure the `delete_entries` processor with the following options.

| Option | Required | Description |
:--- | :--- | :---
| `with_keys` | Yes | An array of keys for the entries to be deleted. |

## Usage

To get started, create the following `pipeline.yaml` file:

```yaml
pipeline:
  source:
    ...
  ....  
  processor:
    - delete_entries:
        with_keys: ["message"]
  sink:
```
{% include copy.html %}

Next, create a log file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` file with that filepath. For more information, see [Configuring Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper).

For example, before you run the `delete_entries` processor, if the `logs_json.log` file contains the following event record:

```json
{"message": "hello", "message2": "goodbye"}
```

When you run the `delete_entries` processor, it parses the message into the following output:

```json
{"message2": "goodbye"}
```

> If `message` does not exist in the event, then no action occurs.
