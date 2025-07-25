---
layout: default
title: select_entries
parent: Processors
grand_parent: Pipelines
nav_order: 59
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/select-entries/
---

# select_entries

The `select_entries` processor selects entries from an OpenSearch Data Prepper event.
Only the selected entries remain in the processed event and while all other entries are removed. However, the processor does not remove any events from the OpenSearch Data Prepper pipeline.

## Configuration

You can configure the `select_entries` processor using the following options.

| Option | Required | Description |
| :--- | :--- | :--- |
| `include_keys` | Yes | A list of keys to be selected from an event. |
| `select_when` | No | A [conditional expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/), such as `/some-key == "test"'`, that will be evaluated to determine whether the processor will be run on the event. If the condition is not met, then the event continues through the pipeline unmodified with all the original fields present. |

## Usage

The following example shows how to configure the `select_entries` processor in the `pipeline.yaml` file:

```yaml
pipeline:
  source:
    ...
  ....  
  processor:
    - select_entries:
        include_keys: [ "key1", "key2" ]
        select_when: '/some_key == "test"'
  sink:
```
{% include copy.html %}


For example, when your source contains the following event record:

```json
{"message": "hello", "key1" : "value1", "key2" : "value2", "some_key" : "test"}
```

The `select_entries` processor includes only `key1` and `key2` in the processed output:

```json
{"key1": "value1", "key2": "value2"}
```
