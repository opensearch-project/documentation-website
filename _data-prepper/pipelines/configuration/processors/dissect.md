---
layout: default
title: dissect
parent: Processors
grand_parent: Pipelines
nav_order: 52
---

# dissect

The `dissect` processor extracts values from an event and map them to individual fields based on user defined Dissect patterns. The processor is well-suited for field extraction from log messages with a known structure. 

## Basic usage

For an example using dissect processor, create the following `pipeline.yaml`.
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

Then create the following file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with the path of a file containing this JSON data:

```
{"log": "07-25-2023 10:00:00 ERROR: error message"}
```

The `dissect` processor will retrieve the fields (`Date`, `Time`, `Log_Type`, and `Message`) from the `log` message, , based on the pattern `%{Date} %{Time} %{Type}: %{Message}` configured in the pipeline.

When you run Data Prepper with this `pipeline.yaml` passed in, you should see the following standard output.

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
| `map` | Yes | Map | Defines the dissect patterns for specific keys. For details on how to define fields in the dissect pattern, see [Field notations](#field-notations) |
| `target_types` | No | Map | Specifies the data types for extract fields. Valid options are `integer`, `double`, `string`, and `boolean`. By default, all fields are of `string` type. |
| `dissect_when` | No | String | Specifies a condition for performing the dissect operation using a [Data Prepper expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/). If specified, dissect only when the expression evaluates to true. |

### Field notations

You can define a dissect patterns with the following types of fields.

#### Normal field

A field without a suffix or prefix. The field will be directly added to the output Event. The format is `%{field_name}`.

#### Skip field

A field that will not be put in the event. The format is `%{}` or `%{?field_name}`.

#### Append field

A field that will be combined with other fields. To append multiple values and put the final value in the field, we can use + before the field name in the dissect pattern. The format is `%{+field_name}`. 

For example, with a pattern `%{+field_name}, %{+field_name}`, log message `"foo, bar"` will parse into `{"field_name": "foobar"}`.

We can also define the order the concatenation with the help of suffix `/<integer>`. 

For example, with a pattern `"%{+field_name/2}, %{+field_name/1}"`, log message `"foo, bar"` will parse into `{"field_name": "barfoo"}`.

If the order is not mentioned, the append operation will take place in the order of fields specified in the dissect pattern. 

#### Indirect field

A field that uses the value from another field as field name. While defining a pattern, prefix the field with a `&` to assign the value found with this field to the value of another field found as the key.

For example, with a pattern `"%{?field_name}, %{&field_name}"`, log message `"foo, bar"` will parse into `{“foo”: “bar”}`. Here we can see that `foo` which is captured from the skip field `%{?field_name}` serves as the key to the value captured form the field `%{&field_name}`.

#### Padded field

A field with paddings to the right removed. `->` operator can be used as a suffix to a field to indicate that white spaces after this field can be ignored.

For example, with a pattern `%{field1->} %{field2}`, log message `“firstname    lastname”` will parse into `{“field1”: “firstname”, “field2”: “lastname”}`.
