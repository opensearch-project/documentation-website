---
layout: default
title: Mutate strings
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Mutate string processors

<!--- Need intro text on what mutate string processors do as a whole.--->

The following is a list of processors that allow you to mutate a string:

* [substitute_string](#substitutestringprocessor)
* [split_string](#splitstringprocessor)
* [uppercase_string](#uppercasestringprocessor)
* [lowercase_string](#lowercasestringprocessor)
* [trim_string](#trimstringprocessor)

<!--- Is it necessary to provide this list, or to link to the processors within this page?--->


## substitute_string

The `substitute_string` processor matches a key's value against a regular expression and replaces all matches with a replacement string.

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
    - substitute_string:
        entries:
          - source: "message"
            from: ":"
            to: "-"
  sink:
    - stdout:
```

Create the following file named `logs_json.log` and replace the `path` of the file source in your `pipeline.yaml` file with your file path:

```json
{"message": "ab:cd:ab:cd"}
```

When you run Data Prepper with the `pipeline.yaml` file, you will see the following output:

```json
{"message": "ab-cd-ab-cd"}
```

If the `from` regex string does not return a match, the key returns without any changes.

### Configuration

<!--- Are these paramters? How are these items used? Need some intro text here.--->

* `entries` - (required) - A list of entries to add to an event.
    * `source` - (required) - The key to be modified.
    * `from` - (required) - The regex string to be replaced. Special regex characters such as `[` and `]` must be escaped using `\\` when using double quotes and `\` when using single quotes. See [here](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/regex/Pattern.html) for more information.
    * `to` - (required) - The string to be substituted for each match of `from`.
    

## split_string

The `split_string` processor splits a field into an array using a delimiter character.

### Basic Usage

To get started, create the following `pipeline.yaml` file:

```yaml
pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - split_string:
        entries:
          - source: "message"
            delimiter: ","
  sink:
    - stdout:
```

Create the following file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with your file path:

```json
{"message": "hello,world"}
```
When you run Data Prepper with this `pipeline.yaml` file, you should see the following output:

```json
{"message":["hello","world"]}
```

### Configuration

<!--- Are these paramters? How are these items used? Need some intro text here.--->

* `entries` - (required) - A list of entries to add to an event
    * `source` - (required) - The key to be split
    * `delimiter` - (optional) - The separator character responsible for the split. Cannot be defined at the same time as `delimiter_regex`. At least `delimiter` or `delimiter_regex` must be defined.
    * `delimiter_regex` - (optional) - A regex string responsible for the split. Cannot be defined at the same time as `delimiter`. At least `delimiter` or `delimiter_regex` must be defined.

## uppercase_string

The `uppercase_string` processor converts a key to uppercase.

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
    - uppercase_string:
        with_keys:
          - "uppercaseField"
  sink:
    - stdout:
```

Create the following file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with the correct file path:

```json
{"uppercaseField": "hello"}
```
When you run Data Prepper with this `pipeline.yaml` file, you should see the following output:

```json
{"uppercaseField": "HELLO"}
```

### Configuration

<!--- Are these paramters? How are these items used? Need some intro text here.--->

* `with_keys` - (required) - A list of keys to convert to uppercase.


## Lowercase string

The `lowercase string` processor converts a string to its lowercase counterpart.

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
    - lowercase_string:
        with_keys:
          - "lowercaseField"
  sink:
    - stdout:
```

Create the following file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with the path of this file.

```json
{"lowercaseField": "TESTmeSSage"}
```
When you run Data Prepper with this `pipeline.yaml`, you should see the following output:

```json
{"lowercaseField": "testmessage"}
```

### Configuration

<!--- Are these paramters? How are these items used? Need some intro text here.--->

* `with_keys` - (required) - A list of keys to convert to Lowercase

## trim_string

The `trim_string` processor removes whitespace from the beginning and end of a key.

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
    - trim_string:
        with_keys:
          - "trimField"
  sink:
    - stdout:
```

Create the following file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with the your file path:

```json
{"trimField": " Space Ship "}
```
When you run Data Prepper with this `pipeline.yaml`, you should see the following output:

```json
{"trimField": "Space Ship"}
```

### Configuration

<!--- Are these paramters? How are these items used? Need some intro text here.--->

* `with_keys` - (required) - A list of keys to trim the whitespace from.


## Developer guide

This plugin is compatible with Java 14. See the following:

- [Contributing](https://github.com/opensearch-project/data-prepper/blob/main/CONTRIBUTING.md)
- [Monitoring]({{site.url}}{{site.baseurl}}/data-prepper/monitoring/) <!--- Is this correct?---> 
