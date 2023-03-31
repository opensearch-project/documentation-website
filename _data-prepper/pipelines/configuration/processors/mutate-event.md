---
layout: default
title: Mutate event
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Mutate event processors

Mutate event processors allow you to modify events in Data Prepper. The following processors are available:

* [AddEntries](#addentries) allows you to add entries to an event.
* [CopyValues](#copyvalues) allows you to copy values within an event.
* [DeleteEntry](#deleteentry) allows you to delete entries from an event.
* [RenameKey](#renamekey) allows you to rename keys in an event.
* [ConvertEntry](#convertentry) allows you to convert value types in an event.

## AddEntries

The `AddEntries` processor adds entries to an event.

### Configuration

You can configure the `AddEntries` processor with the following options.

| Option | Required | Description |
| :--- | :--- | :--- |
| `entries` | Yes | A list of entries to add to an event. |
| `key` | Yes | The key of the new entry to be added. Some examples of keys include: `my_key`, `myKey`, and `object/sub_Key`. |
| `value` | Yes | The value of the new entry to be added. You can use the following data types: strings, booleans, numbers, null, nested objects, and arrays. |
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


Next, create a log file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with this filepath. For more information, see [Configuring Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper).

For example, before you run the `AddEntries` processor, if the `logs_json.log` file contains the following event record:

```json
{"message": "hello"}
```

Then, when you run the `AddEntries` processor using the previous configuration, it adds a new entry `{"newMessage": 3}` to the existing event `{"message": "hello"}` so that the new event contains two entries in the final output:

```json
{"message": "hello", "newMessage": 3}
```

> If `newMessage` already exists, its existing value is overwritten with a value of `3`.


## CopyValues

The `CopyValues` processor copies the values of an existing key within an event to another key.

### Configuration

You can configure the `CopyValues` processor with the following options.

| Option | Required | Description |
:--- | :--- | :---
| `entries` | Yes | A list of entries to be copied in an event. |
| `from_key` | Yes | The key of the entry to be copied. |
| `to_key` | Yes | The key of the new entry to be added. |
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
    - copy_values:
        entries:
        - from_key: "message"
          to_key: "newMessage"
          overwrite_if_to_key_exists: true
  sink:
    - stdout:
```
{% include copy.html %}

Next, create a log file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with this filepath. For more information, see [Configuring Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper).

```json
{"message": "hello"}
```

When you run this processor, it parses the message into the following output:

```json
{"message": "hello", "newMessage": "hello"}
```

> If `newMessage` already exists, its existing value is overwritten with `value`.


## DeleteEntry

The `DeleteEntry` processor deletes entries from an event, such as key-value pairs. You can define the keys you want to delete in the `with-keys` field following `delete_entries` in the YAML configuration file. Those keys along with their values are deleted. 

### Configuration

You can configure the `DeleteEntry` processor with the following options.

| Option | Required | Description |
:--- | :--- | :---
| `with_keys` | Yes | An array of keys of the entries to be deleted. |

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
    - delete_entries:
        with_keys: ["message"]
  sink:
    - stdout:
```
{% include copy.html %}

Next, create a log file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with this filepath. For more information, see [Configuring Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper).

```json
{"message": "hello", "message2": "goodbye"}
```

When you run the `DeleteEntry` processor, it parses the message into the following output:

```json
{"message2": "goodbye"}
```

> If `message` does not exist in the event, then no action occurs.


## RenameKey

The `RenameKey` processor renames keys in an event.

### Configuration

You can configure the `RenameKey` processor with the following options.

Option | Required | Description |
| :--- | :--- | :--- |
| `entries` | Yes | A list of entries to rename in an event. |
| `from_key` | Yes | The key of the entry to be renamed. |
| `to_key` | Yes | The new key of the entry. |
| `overwrite_if_to_key_exists` | No | When set to `true`, the existing value is overwritten if `key` already exists in the event. The default value is `false`. |

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
    - rename_keys:
        entries:
        - from_key: "message"
          to_key: "newMessage"
          overwrite_if_to_key_exists: true
  sink:
    - stdout:
```
{% include copy.html %}


Next, create a log file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with this filepath. For more information, see [Configuring Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper).

```json
{"message": "hello"}
```

When you run the `RenameKey` processor, it parses the message into the following "newMessage" output:

```json
{"newMessage": "hello"}
```

> If `newMessage` already exists, its existing value is overwritten with `value`.



### Special considerations

Renaming operations occur in the order that the key value pair entries are listed in the `pipeline.yaml` file. This means that chaining (where key value pairs are renamed in sequence) is implicit with the `RenameKey` processor. See the following `pipline.yaml` file example:

```yaml
pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - rename_key:
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

After the `RenameKey` processor runs, the following output appears:

```json
{"message3": "hello"}
```

## ConvertEntry

The `ConvertEntry` processor converts a value type associated with the specified key in a message to the specified type. It is a casting processor that changes the types of some fields in the event or message. Some entered data needs to be converted to different types, such as an integer or a double, or a string to an integer, so that it will pass the events through condition-based processors or perform conditional routing. 

### Configuration

You can configure the `ConvertEntry` processor with the following options.

| Option | Required | Description |
| :--- | :--- | :--- |
| `key`| Yes | Keys whose value needs to be converted to a different type. |
| `type` | No | Target type for key value pair. Possible values are `integer`, `double`, `string`, and `boolean`. Default value is `integer`. |

### Usage

To get started, create the following `pipeline.yaml` file:

```yaml
type-conv-pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - convert_entry_type:
        key: "response_status"
        type: "integer"
  sink:
    - stdout:
```
{% include copy.html %}

Next, create a log file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with this filepath. For more information, see [Configuring Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper). 

```json
{"message": "value", "response_status":"200"}
```

The `ConvertEntry` processor changes the output received into the following output, where the type of `response_status` value changes from a string to an integer:

```json
{"message":"value","response_status":200}
```