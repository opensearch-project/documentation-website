---
layout: default
title: dissect
parent: Processors
grand_parent: Pipelines
nav_order: 52
---

# dissect

The `dissect` processor extracts values from an event and maps them to individual fields based on user-defined `dissect` patterns. The processor is well suited for field extraction from log messages with a known structure. 

## Basic usage

To use the `dissect` processor, create the following `pipeline.yaml` file:

```yaml
dissect-pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - dissect:
        map:
          log: "%{Date} %{Time} %{Log_Type}: %{Message}"
  sink:
    - stdout:
```

Then create the following file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` file with the path of a file containing the following JSON data:

```
{"log": "07-25-2023 10:00:00 ERROR: error message"}
```

The `dissect` processor will retrieve the fields (`Date`, `Time`, `Log_Type`, and `Message`) from the `log` message, based on the pattern `%{Date} %{Time} %{Type}: %{Message}` configured in the pipeline.

After running the pipeline, you should receive the following standard output:

```
{
    "log" : "07-25-2023 10:00:00 ERROR: Some error",
    "Date" : "07-25-2023"
    "Time" : "10:00:00"
    "Log_Type" : "ERROR"
    "Message" : "error message"
}
```

## Configuration

You can configure the `dissect` processor with the following options.

| Option | Required | Type | Description |
| :--- | :--- | :--- | :--- |
| `map` | Yes | Map | Defines the `dissect` patterns for specific keys. For details on how to define fields in the `dissect` pattern, see [Field notations](#field-notations). |
| `target_types` | No | Map | Specifies the data types for extract fields. Valid options are `integer`, `double`, `string`, and `boolean`. By default, all fields are of the `string` type. |
| `dissect_when` | No | String | Specifies a condition for performing the `dissect` operation using a [Data Prepper expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/). If specified, the `dissect` operation will only run when the expression evaluates to true. |

### Field notations

You can define `dissect` patterns with the following field types.

#### Normal field

A field without a suffix or prefix. The field will be directly added to the output event. The format is `%{field_name}`.

#### Skip field

A field that will not be included in the event. The format is `%{}` or `%{?field_name}`.

#### Append field

A field that will be combined with other fields. To append multiple values and include the final value in the field, use `+` before the field name in the `dissect` pattern. The format is `%{+field_name}`. 

For example, with the pattern `%{+field_name}, %{+field_name}`, log message `"foo, bar"` will parse into `{"field_name": "foobar"}`.

You can also define the order of the concatenation with the help of the suffix `/<integer>`. 

For example, with a pattern `"%{+field_name/2}, %{+field_name/1}"`, log message `"foo, bar"` will parse into `{"field_name": "barfoo"}`.

If the order is not mentioned, the append operation will occur in the order of the fields specified in the `dissect` pattern. 

#### Indirect field

A field that uses the value from another field as its field name. When defining a pattern, prefix the field with a `&` to assign the value found in the field as the key in the key-value pair.

For example, with a pattern `"%{?field_name}, %{&field_name}"`, the log message `"foo, bar"` will parse into `{“foo”: “bar”}`. In the log message, `foo` is captured from the skip field `%{?field_name}`. `foo` then serves as the key to the value captured from the field `%{&field_name}`.

#### Padded field

A field with the paddings to the right removed. The `->` operator can be used as a suffix to indicate that white spaces after this field can be ignored.

For example, with a pattern `%{field1->} %{field2}`, log message `“firstname    lastname”` will parse into `{“field1”: “firstname”, “field2”: “lastname”}`.
