---
layout: default
title: Decompress
parent: Processors
grand_parent: Pipelines
nav_order: 90
---

# Decompress processor

The `decompress` processor decompresses any Base64-encoded compressed fields inside of an event.

## Configuration

Option | Required | Type | Description
:--- | :--- | :--- | :---
`keys` | Yes | List<String> | The fields in the event that will be decompressed.                                                                                          
`type` | Yes | Enum | The type of decompression to use for the `keys` in the event. Only `gzip` is supported.                                           
`decompress_when` | No | String| A [Data Prepper conditional expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/) that determines when the `decompress` processor will run on certain events.
`tags_on_failure` | No | List<String> | A list of strings with which to tag events when the processor fails to decompress the `keys` inside an event. Defaults to `_decompression_failure`.                               

## Usage

The following example shows the `decompress` processor used in `pipelines.yaml`:

```yaml
processor:
  - decompress:
      decompress_when: '/some_key == null'
      keys: [ "base_64_gzip_key" ]
      type: gzip
```
{% include copy.html %}

## Metrics 

The following table describes common [abstract processor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java) metrics.

| Metric name | Type | Description |
| ------------- | ---- | -----------|
| `recordsIn` | Counter | The ingress of records to a pipeline component. |
| `recordsOut` | Counter | The egress of records from a pipeline component. |
| `timeElapsed` | Timer | The time elapsed during execution of a pipeline component. |

### Counter

The `decompress` processor accounts for the following metrics:

* `processingErrors`: The number of processing errors that have occurred in the `decompress` processor.

