---
layout: default
title: Mutate strings
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Mutate string processors

You can change the way that a string appears using mutate string processesors. For example, you can use the `uppercase_string` processor to convert a string to uppercase, and you can use the `lowercase_string` processor to convert a string to lowercase. The following is a list of processors that allow you to mutate a string:

* [substitute_string](#substitutestringprocessor)
* [split_string](#splitstringprocessor)
* [uppercase_string](#uppercasestringprocessor)
* [lowercase_string](#lowercasestringprocessor)
* [trim_string](#trimstringprocessor)

## substitute_string

The `substitute_string` processor matches a key's value against a regular expression (regex) and replaces all returned matches with a replacement string.

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

* `entries` (required): A list of entries to add to an event.
    * `source` (required): The key to be modified.
    * `from` (required): The regex string to be replaced. Special regex characters such as `[` and `]` must be escaped using `\\` when using double quotes and `\` when using single quotes. See [Class Pattern](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/regex/Pattern.html) for more information.
    * `to` (required): The string to be substituted for each match of `from`.
    
## split_string

The `split_string` processor splits a field into an array using a delimiter character.

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

* `entries` (required): A list of entries to add to an event
* `source` (required): The key to be split
* `delimiter` (optional): The separator character responsible for the split. Cannot be defined at the same time as `delimiter_regex`. At least `delimiter` or `delimiter_regex` must be defined.
* `delimiter_regex` (optional): A regex string responsible for the split. Cannot be defined at the same time as `delimiter`. At least `delimiter` or `delimiter_regex` must be defined.

## uppercase_string

The `uppercase_string` processor converts a key to uppercase.

<!--- Converts a key or a string? Are only keys and strings being converted?--->

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

* `with_keys` (required): A list of keys to convert to uppercase.

## Lowercase string

The `lowercase string` processor converts a string to lowercase.

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
When you run Data Prepper with this `pipeline.yaml` file, you will see the following output:

```json
{"lowercaseField": "testmessage"}
```

### Configuration

<!--- Are these paramters? How are these items used? Need some intro text here.--->

* `with_keys` (required): A list of keys to convert to lowercase

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
When you run Data Prepper with this `pipeline.yaml` file, you will see the following output:

```json
{"trimField": "Space Ship"}
```

### Configuration

<!--- Are these parameters? How are these items used? Need some intro text here.--->

* `with_keys` (required): A list of keys to trim the whitespace from.
