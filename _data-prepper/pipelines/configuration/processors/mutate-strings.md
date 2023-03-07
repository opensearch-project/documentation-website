---
layout: default
title: Mutate strings
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Mutate string processors

You can change the way that a string appears using mutate string processesors. For example, you can use the `uppercase_string` processor to convert a string to uppercase, and you can use the `lowercase_string` processor to convert a string to lowercase. The following is a list of processors that allow you to mutate a string:

* [substitute_string](#substitute_string)
* [split_string](#split_string)
* [uppercase_string](#uppercase_string)
* [lowercase_string](#lowercase_string)
* [trim_string](#trim_string)

## substitute_string

The `substitute_string` processor matches a key's value against a regular expression (regex) and replaces all returned matches with a replacement string.

### Configuration

You can configure the `substitute_string` processor with the following options.

Option | Required | Description
:--- | :--- | :---
| `entries` | Yes | A list of entries to add to an event. |
| `source` | Yes | The key to be modified. |
| `from` | Yes | The regular expression (regex) string to be replaced. Special regex characters such as `[` and `]` must be escaped using `\\` when using double quotes and `\` when using single quotes. See [Class Pattern](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/regex/Pattern.html) for more information. |
| `to` | Yes | The string to be substituted for each match of `from`. |

### Basic usage

To get started, create the following `pipeline.yaml` file: <!--- Where should this file be stored?--->

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
{% include copy.html %}

Next, create a log file named `logs_json.log`. After that, replace the `path` of the file source in your `pipeline.yaml` file with your file path.

Before you run Data Prepper, the source appears in the following format:

```json
{"message": "ab:cd:ab:cd"}
```

After you run Data Prepper, the source is converted to the following format:

```json
{"message": "ab-cd-ab-cd"}
```

If the `from` regex string does not return a match, the key returns without any changes.
    
## split_string

The `split_string` processor splits a field into an array using a delimiter character.

### Configuration

You can configure the `split_string` processor with the following options.

Option | Required | Description
:--- | :--- | :---
| `entries` | Yes | A list of entries to add to an event. |
| `source` | Yes | The key to be split. |
| `delimiter` | No | The separator character responsible for the split. Cannot be defined at the same time as `delimiter_regex`. At least `delimiter` or `delimiter_regex` must be defined. |
|`delimiter_regex` | No | A regex string responsible for the split. Cannot be defined at the same time as `delimiter`. At least `delimiter` or `delimiter_regex` must be defined. |

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
{% include copy.html %}

Next, create a log file named `logs_json.log`. After that, replace the `path` in the file source of your `pipeline.yaml` file with your file path.

Before you run Data Prepper, the source appears in the following format:

```json
{"message": "hello,world"}
```
After you run Data Prepper, the source is converted to the following format:

```json
{"message":["hello","world"]}
```

## uppercase_string

The `uppercase_string` processor converts a key to uppercase.

### Configuration

You can configure the `uppercase_string` processor with the following options.

Option | Required | Description
:--- | :--- | :---
| `with_keys` | Yes | A list of keys to convert to uppercase. |

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
{% include copy.html %}

Create a log file named `logs_json.log`. After that, replace the `path` in the file source of your `pipeline.yaml` file with the correct file path.

Before you run Data Prepper, the source appears in the following format:

```json
{"uppercaseField": "hello"}
```
After you run Data Prepper, the source is converted to the following format:

```json
{"uppercaseField": "HELLO"}
```

## lowercase_string

The `lowercase string` processor converts a string to lowercase.

### Configuration

You can configure the `lowercase string` processor with the following options.

Option | Required | Description
:--- | :--- | :---
| `with_keys` | Yes | A list of keys to convert to lowercase. |

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
{% include copy.html %}

Create a log file named `logs_json.log`. After that, replace the `path` in the file source of your `pipeline.yaml` file with the correct file path.

Before you run Data Prepper, the source appears in the following format:

```json
{"lowercaseField": "TESTmeSSage"}
```

After you run Data Prepper, the source is converted to the following format:

```json
{"lowercaseField": "testmessage"}
```


## trim_string

The `trim_string` processor removes whitespace from the beginning and end of a key.

### Configuration

You can configure the `trim_string` processor with the following options.

Option | Required | Description
:--- | :--- | :---
| `with_keys` | Yes | A list of keys to trim the whitespace from. |

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
{% include copy.html %}

Create a log file named `logs_json.log`. After that, replace the `path` in the file source of your `pipeline.yaml` file with the correct file path.

Before you run Data Prepper, the source appears in the following format:

```json
{"trimField": " Space Ship "}
```

After you run Data Prepper, the source is converted to the following format:

```json
{"trimField": "Space Ship"}
```
