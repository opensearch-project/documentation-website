---
layout: default
title: Mutate event
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Mutate event processors

You can use mutate event processors to add entries to an event, delete entries from an event, rename keys in an event, copy values within an event, and convert value types in an event. <!---Need a better overall description to explain what they do in general.--->

The following processors allow you to mutate an event:

<!--- Need to find out why links below aren't working correctly.>

* [AddEntry] (#AddEntry)
* [CopyValue] (#CopyValue)
* [DeleteEntry] (#DeleteEntry)
* [RenameKey] (#RenameKey)
* [ConvertEntry] (#ConvertEntry)

--->

## AddEntries

The `AddEntries` processor adds entries to an event.

### Configuration

You can configure the `AddEntries` processor with the following options.

Option | Required | Description
:--- | :--- | :---
|`entries` | Yes | A list of entries to add to an event. |
|`key` | Yes | The key of the new entry to be added. |
|`value` | Yes | The value of the new entry to be added. You can use the following data types: strings, booleans, numbers, null, nested objects, and arrays. |
|`overwrite_if_key_exists` | No | When set to `true`, if `key` already exists in the event, then the existing value is overwritten. The default value is `false`. |

### Basic usage

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

Create a log file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with this filepath.

```json
{"message": "value"}
```

When you run this processor, it parses the message into the following output:

```json
{"message": "value", "newMessage": 3}
```

> If `newMessage` already exists, its existing value is overwritten with a value of `3`.

## copy value

The `copy value` processor copies values within an event.

### Configuration

You can configure the `copy value` processor with the following options.

Option | Required | Description
:--- | :--- | :---
| `entries` | Yes | A list of entries to be copied in an event. |
| `from_key` | Yes | The key of the entry to be copied.
| `to_key` | Yes | The key of the new entry to be added.
| `overwrite_if_to_key_exists` | No | When set to a value of `true`, if `to_key` already exists in the event, then the existing value will be overwritten. The default value is `false`. |

### Basic usage

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

Create a log file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with the path of this file:

```json
{"message": "value"}
```

When you run this processor, it parses the message into the following output:

```json
{"message": "value", "newMessage": "value"}
```

> If `newMessage` had already exists, its current value is overwritten with `value`.


## DeleteEntry

The `DeleteEntry` processor deletes entries in an event.

### Configuration

You can configure the `DeleteEntry` processor with the following options.

Option | Required | Description
:--- | :--- | :---
| `with_keys` | Yes | An array of keys of the entries to be deleted. | 

### Basic usage

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

Create the following file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with the path of this file.

```json
{"message": "value", "message2": "value2"}
```

When you run the `DeleteEntry` processor, it parses the message into the following output:

```json
{"message2": "value2"}
```

> If `message` does not exist in the event, then no action occurs.


## RenameKey

The `rename key` processor renames keys in an event.

### Configuration

You can configure the `rename key` processor with the following options.

Option | Required | Description
:--- | :--- | :---
| `entries` | Yes | A list of entries to rename in an event. | 
| `from_key` | Yes | The key of the entry to be renamed. |
| `to_key` | Yes | The new key of the entry.
| `overwrite_if_to_key_exists` | No | When set to a value of`true`, if `to_key` already exists in the event, then the existing value will be overwritten. The default value is `false`.

### Basic usage

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

Create a log file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with the path of this file.

```json
{"message": "value"}
```

When ran, the processor parses the message into the following output:

```json
{"newMessage": "value"}
```

> If `newMessage` already exists, its existing value is overwritten with `value`.

### Special considerations

The renaming operation occurs in a defined order. This means that chaining is implicit with the `RenameKey` processor. See the following `piplines.yaml` file example:

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
{"message": "value"}
```

After the processor runs, the following output appears:

```json
{"message3": "value"}
```

## ConvertEntry

The `ConvertEntry` processor converts a value type associated with the specified key in a message to the specified type. It is a casting processor that changes the types of some fields in the event or message. Some of inputted data may need to be converted to different types, such as an integer or a double, so that it will pass the events through condition-based processors, or to perform conditional routing.

### Configuration

You can configure the `ConvertEntry` processor with the following options.

Option | Required | Description
:--- | :--- | :---
| `key`| Yes | Keys whose value needs to be converted to a different type. | 
| `type` | No | Target type for key value. Possible values are `integer`, `double`, `string`, and `boolean`. Default value is `integer`.|

### Basic usage

To get started with type conversion processor using Data Prepper, create the following `pipeline.yaml` file:

```yaml
type-conv-pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - grok:
        match:
          message: ['%{IPORHOST:clientip} \[%{HTTPDATE:timestamp}\] %{NUMBER:response_status}']
    - convert_entry_type:
        key: "response_status"
        type: "integer"
  sink:
    - stdout:
```

Create a log file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with the path of this file.

```json
{"message": "10.10.10.19 [19/Feb/2015:15:50:36 -0500] 200"}
```

When you run the `Grok` processor, it processor parses the message into the following output:

```json
{"message": "10.10.10.10 [19/Feb/2015:15:50:36 -0500] 200", "clientip":"10.10.10.10", "timestamp": "19/Feb/2015:15:50:36 -0500", "response_status": "200"}
```

The type conversion processor changes the output received into the following output, where the type of `response_status` value changes to an integer:

```json
{"message": "10.10.10.10 [19/Feb/2015:15:50:36 -0500] 200", "clientip":"10.10.10.10", "timestamp": "19/Feb/2015:15:50:36 -0500", "response_status": 200}
```