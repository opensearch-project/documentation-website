---
layout: default
title: Mutate event
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Mutate event processors

The following processors allow you to mutate an event.

<!--- Why would users want to mutate an event? What does it achieve?--->

## AddEntry

The `AddEntry` processor adds entries to an event.

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

Create the following file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with this filepath.

```json
{"message": "value"}
```

When run, the processor parses the message into the following output:

```json
{"message": "value", "newMessage": 3}
```

> If `newMessage` already exists, its existing value is overwritten with a value of `3`.

### Configuration

* `entries` (required): A list of entries to add to an event
* `key` (required): The key of the new entry to be added
* `value` (required): The value of the new entry to be added. Strings, booleans, numbers, null, nested objects, and arrays containing the aforementioned data types are valid to use
* `overwrite_if_key_exists` (optional): When set to `true`, if `key` already exists in the event, then the existing value is overwritten. The default value is `false`. 

## Copy value

The `copy value` processor copies values within an event.

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

Create the following file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with the path of this file:

```json
{"message": "value"}
```

When run, the processor parses the message into the following output:

```json
{"message": "value", "newMessage": "value"}
```

> If `newMessage` had already existed, its existing value would have been overwritten with `value`

### Configuration
* `entries` - (required) - A list of entries to be copied in an event
    * `from_key` - (required) - The key of the entry to be copied
    * `to_key` - (required) - The key of the new entry to be added
    * `overwrite_if_to_key_exists` - (optional) - When set to `true`, if `to_key` already exists in the event, then the existing value will be overwritten. The default is `false`.


## DeleteEntry

The `DeleteEntry` processor deletes entries in an event.

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

When run, the processor parses the message into the following output:

```json
{"message2": "value2"}
```

> If `message` had not existed in the event, then nothing would have happened

### Configuration

<!---Need some intro text.--->

* `with_keys` - (required) - An array of keys of the entries to be deleted.


## RenameKey

The `rename key` processor renames keys in an event.

### Basic usage

To get started, create the following `pipeline.yaml`.
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

Create the following file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with the path of this file.

```json
{"message": "value"}
```

When run, the processor parses the message into the following output:

```json
{"newMessage": "value"}
```

> If `newMessage` already exists, its existing value is overwritten with `value`.

### Configuration

<!--- Need some intro text here.--->

* `entries` - (required) - A list of entries to rename in an event
    * `from_key` - (required) - The key of the entry to be renamed
    * `to_key` - (required) - The new key of the entry
    * `overwrite_if_to_key_exists` - (optional) - When set to `true`, if `to_key` already exists in the event, then the existing value will be overwritten. The default is `false`.

### Special considerations

The renaming operation occurs in a defined order. <!--- Where is this order defined?---> This means that chaining is implicit with the `RenameKey` processor. See the following `piplines.yaml` file example:

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

The `ConvertEntry` processor converts the type of value associated with the specified key in a message to the specified type. It is a casting processor that changes the types of some fields in the event or message. Some of inputted data may need to be converted to different types, such as an integer or a double. The data may need to be converted so that it will pass the events through condition-based processors, or to perform conditional routing.

## Basic usage

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

Create the following file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with the path of this file.

```json
{"message": "10.10.10.19 [19/Feb/2015:15:50:36 -0500] 200"}
```

When run, the `Grok` processor parses the message into the following output:

```json
{"message": "10.10.10.10 [19/Feb/2015:15:50:36 -0500] 200", "clientip":"10.10.10.10", "timestamp": "19/Feb/2015:15:50:36 -0500", "response_status": "200"}
```

The type conversion processor changes the output received into the following output, where the type of `response_status` value changes to an integer:

```json
{"message": "10.10.10.10 [19/Feb/2015:15:50:36 -0500] 200", "clientip":"10.10.10.10", "timestamp": "19/Feb/2015:15:50:36 -0500", "response_status": 200}
```

### Configuration

* `key` (required): Keys whose value needs to be converted to a different type
* `type`: Target type for key value. Possible values are `integer`, `double`, `string`, and `boolean`. Default value is `integer`.


## Developer guide

This plugin is compatible with Java 14. See the following:

- [Contributing](https://github.com/opensearch-project/data-prepper/blob/main/CONTRIBUTING.md)
- [Monitoring]({{site.url}}{{site.baseurl}}/data-prepper/monitoring/) 


