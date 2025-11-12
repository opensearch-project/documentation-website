---
layout: default
title: Add entries
parent: Processors
grand_parent: Pipelines
nav_order: 10
---

# Add entries processor

The `add_entries` processor adds entries to an event.

## Configuration

You can configure the `add_entries` processor with the following options.

| Option | Required | Description |
| :--- | :--- | :--- |
| `entries` | Yes | A list of entries to add to an event. |
| `key` | No | The key of the new entry to be added. Some examples of keys include `my_key`, `myKey`, and `object/sub_Key`. The key can also be a format expression, for example, `${/key1}` to use the value of field `key1` as the key. |
| `metadata_key` | No | The key for the new metadata attribute. The argument must be a literal string key and not a JSON Pointer. Either one string key or `metadata_key` is required. |
| `value` | No | The value of the new entry to be added, which can be used with any of the following data types: strings, Booleans, numbers, null, nested objects, and arrays. |
| `format` | No | A format string to use as the value of the new entry, for example, `${key1}-${key2}`, where `key1` and `key2` are existing keys in the event. Required if neither `value` nor `value_expression` is specified. |
| `value_expression` | No | An expression string to use as the value of the new entry. For example, `/key` is an existing key in the event with a type of either a number, a string, or a Boolean. Expressions can also contain functions returning number/string/integer. For example, `length(/key)` will return the length of the key in the event when the key is a string. For more information about keys, see [Expression syntax]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/).  |
| `add_when` | No | A [conditional expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/), such as `/some-key == "test"'`, that will be evaluated to determine whether the processor will be run on the event. |
| `overwrite_if_key_exists` | No | When set to `true`, the existing value is overwritten if `key` already exists in the event. The default value is `false`. |
| `append_if_key_exists` | No | When set to `true`, the existing value will be appended if a `key` already exists in the event. An array will be created if the existing value is not an array. Default is `false`. |


## Usage

The following examples show how the `add_entries` processor can be used in different cases.

### Example: Add entries with simple values

The following example shows you how to configure the processor to add entries with simple values:

```yaml
... 
  processor:
    - add_entries:
        entries:
          - key: "name"
            value: "John"
          - key: "age"
            value: 20
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"message": "hello"}
```

The processed event will contain the following data:

```json
{"message": "hello", "name": "John", "age": 20}
```

### Example: Add entries using format strings

The following example shows you how to configure the processor to add entries with values from other fields:

```yaml
... 
  processor:
    - add_entries:
        entries:
          - key: "date"
            format: "${month}-${day}"
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"month": "Dec", "day": 1}
```

The processed event will contain the following data:

```json
{"month": "Dec", "day": 1, "date": "Dec-1"}
```

### Example: Add entries using value expressions

The following example shows you how to configure the processor to use the `value_expression` option:

```yaml
... 
  processor:
    - add_entries:
        entries:
          - key: "length"
            value_expression: "length(/message)"
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"message": "hello"}
```

The processed event will contain the following data:

```json
{"message": "hello", "length": 5}
```

### Example: Add metadata

The following example shows you how to configure the processor to add metadata to events:

```yaml
... 
  processor:
    - add_entries:
        entries:
          - metadata_key: "length"
            value_expression: "length(/message)"
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"message": "hello"}
```

The processed event will have the same data, with the metadata, `{"length": 5}`, attached. You can subsequently use expressions like `getMetadata("length")` in the pipeline. For more information, see [`getMetadata` function]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/get-metadata/).


### Example: Add a dynamic key

The following example shows you how to configure the processor to add metadata to events using a dynamic key:

```yaml
... 
  processor:
    - add_entries:
        entries:
          - key: "${/param_name}"
            value_expression: "/param_value"
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"param_name": "cpu", "param_value": 50}
```

The processed event will contain the following data:

```json
{"param_name": "cpu", "param_value": 50, "cpu": 50}
```

### Example: Overwrite existing entries

The following example shows you how to configure the processor to overwrite existing entries:

```yaml
... 
  processor:
    - add_entries:
        entries:
          - key: "message"
            value: "bye"
            overwrite_if_key_exists: true
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"message": "hello"}
```

The processed event will contain the following data:

```json
{"message": "bye"}
```

If `overwrite_if_key_exists` is not set to `true`, then the input event will not be changed after processing.

### Example: Append values to existing entries

The following example shows you how to configure the processor to append values to existing entries:

```yaml
... 
  processor:
    - add_entries:
        entries:
          - key: "message"
            value: "world"
            append_if_key_exists: true
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{"message": "hello"}
```

The processed event will contain the following data:

```json
{"message": ["hello", "world"]}
```

## Example

The following pipeline performs these actions:

1. Adds an `app_id` field using the format string `${app}-${env}`.
2. Adds a `message_len` field with the value of `length(/message)`.
3. Adds a metadata key `msg_len_meta` with the value of `length(/message)`.
4. If both `/metric/name` and `/metric/value` exist, creates a new field named after `/metric/name` and sets its value to `/metric/value`.
5. If `/level == "error"`, adds the field `severity: "high"`.
6. Appends `"ingested"` to the `tags` field, ensuring that the `tags` field is an array.
7. Set `env_normalized: "prod"`, overwriting the existing value it the field already exists.

```yaml
example-pipeline:
  source:
    http:
      path: /events
      ssl: false

  processor:
    - add_entries:
        entries:
          - key: app_id
            format: ${app}-${env}

          - key: message_len
            value_expression: length(/message)

          - metadata_key: msg_len_meta
            value_expression: length(/message)

          # dynamic key from the event, only when both metric fields exist
          - key: ${/metric/name}
            value_expression: /metric/value
            add_when: "/metric/name != null and /metric/value != null"

          # set severity ONLY on error level
          - key: severity
            value: high
            add_when: '/level == "error"'

          # append behavior: if tags already exists, it becomes/extends an array
          - key: tags
            value: ingested
            append_if_key_exists: true

          # overwrite behavior
          - key: env_normalized
            value: prod
            overwrite_if_key_exists: true

  sink:
    - opensearch:
        hosts: [https://opensearch:9200]
        insecure: true
        username: admin
        password: admin_password
        index_type: custom
        index: example-%{yyyy.MM.dd}
```
{% include copy.html %}

You can test this pipeline by executing the following command:

```bash
curl -sS -X POST "http://localhost:2021/events" \
  -H "Content-Type: application/json" \
  -d '[
        {"app":"shop","env":"dev","message":"hello","level":"info","metric":{"name":"cpu","value":42}},
        {"app":"shop","env":"prod","message":"boom","level":"error"},
        {"app":"api","env":"stage","message":"hi","level":"warn","metric":{"name":"mem","value":2048},"tags":"pretag"}
      ]'
```
{% include copy.html %}

The documents stored in OpenSearch contain the following information:

```json
"hits": [
  {
    "_index": "example-2025.10.10",
    "_id": "BnvWzpkBTMZ443JmHuHI",
    "_score": 1,
    "_source": {
      "app": "shop",
      "env": "dev",
      "message": "hello",
      "level": "info",
      "metric": {
        "name": "cpu",
        "value": 42
      },
      "app_id": "shop-dev",
      "message_len": 5,
      "cpu": 42,
      "tags": "ingested",
      "env_normalized": "prod"
    }
  },
  {
    "_index": "example-2025.10.10",
    "_id": "B3vWzpkBTMZ443JmHuHI",
    "_score": 1,
    "_source": {
      "app": "shop",
      "env": "prod",
      "message": "boom",
      "level": "error",
      "app_id": "shop-prod",
      "message_len": 4,
      "severity": "high",
      "tags": "ingested",
      "env_normalized": "prod"
    }
  },
  {
    "_index": "example-2025.10.10",
    "_id": "CHvWzpkBTMZ443JmHuHI",
    "_score": 1,
    "_source": {
      "app": "api",
      "env": "stage",
      "message": "hi",
      "level": "warn",
      "metric": {
        "name": "mem",
        "value": 2048
      },
      "tags": [
        "pretag",
        "ingested"
      ],
      "app_id": "api-stage",
      "message_len": 2,
      "mem": 2048,
      "env_normalized": "prod"
    }
  }
]

```
