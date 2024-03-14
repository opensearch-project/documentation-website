---
layout: default
title: decompress
parent: Processors
grand_parent: Pipelines
nav_order: 40
---

# decompress

The `decompress` processor will decompress base64 encoded compressed fields of an Event.

## Configuration

| Option            | Required | Type         | Description                                                                                                                                                                                                |
|:------------------|:---------|:-------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| 
| `keys`            | Yes      | List<String> | The fields in the `event` that will be decompressed.                                                                                                                                                       |
| `type`            | Yes      | Enum         | The type of decompression to use for the `keys` specified. Must be `gzip`                                                                                                                                  |
| `decompress_when` | No       | String       | A [Data Prepper Conditional Expression](https://opensearch.org/docs/latest/data-prepper/pipelines/expression-syntax/) to determine which Events this processor should be run on. Defaults to no condition. |
| `tags_on_failure` | No       | List<String> | A List of strings to tag Events with when the processor fails to decompress the `keys` on the Event. Defaults to [ `_decompression_failure` ]                                                              |

# Usage

```yaml
processor:
  - decompress:
      decompress_when: '/some_key == null'
      keys: [ "base_64_gzip_key" ]
      type: gzip
```

# Metrics 

The following table describes common [Abstract processor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java) metrics.

| Metric name | Type | Description |
| ------------- | ---- | -----------|
| `recordsIn` | Counter | Metric representing the ingress of records to a pipeline component. |
| `recordsOut` | Counter | Metric representing the egress of records from a pipeline component. |
| `timeElapsed` | Timer | Metric representing the time elapsed during execution of a pipeline component. |


The `decompress` processor includes the following custom metrics.

### Counter

* `processingErrors`: The number of processing errors that have occurred in the `decompress` processor.

