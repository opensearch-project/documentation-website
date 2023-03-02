---
layout: default
title: OpenTelemetry metrics string
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# OpenTelemetry (OTel) metrics string processor 

The `otel metrics string` processor serializes a collection of `ExportMetricsServiceRequest` sent from the [otel-metrics-source]({{site.url}}{{site.baseurl}}//data-prepper/pipelines/configuration/sources/otel-metrics-source/) into a collection of string records.

## Usage

See the following `.yaml` configuration file:

```
processor:
    - otel_metrics_raw_processor
```

## Configuration

You can create detailed representations of histogram buckets and their boundaries. You can control this feature by using the following parameters:

```yaml
  processor:
    - otel_metrics_raw_processor:
        calculate_histogram_buckets: true
        calculate_exponential_histogram_buckets: true
        exponential_histogram_max_allowed_scale: 10
        flatten_attributes: false
```

There are three possible parameters: `calculate_histogram_buckets`, `calculate_exponential_histogram_buckets` and `exponential_histogram_max_allowed_scale`. If `calculate_histogram_buckets` and `calculate_exponential_histogram_buckets` are not provided, then the default value is `false`. If the `exponential_histogram_max_allowed_scale` parameter is not provided, the default value is `10`.

If `calculate_histogram_buckets` is not set to `false`, the following JSON file will be added to every histogram JSON. If `flatten_attributes` is set to `false`, the JSON string format of the metrics does not change the attributes field. If `flatten_attributes` is set to `true`, the values in the attributes field are placed in the parent JSON object. The default value is `true`.

```json
 "buckets": [
    {
      "min": 0.0,
      "max": 5.0,
      "count": 2
    },
    {
      "min": 5.0,
      "max": 10.0,
      "count": 5
    }
  ]
```

Each array element describes one bucket. Each bucket contains the lower boundary, upper boundary, and its value count. This is an explicit form of denser OpenTelemetry representation that is a part of the JSON output created by the following plugin:

<!--- Is this correct? Is this a plugin? It looks like a JSON file.--->

```json
 "explicitBounds": [
    5.0,
    10.0
  ],
   "bucketCountsList": [
    2,
    5
  ]
```


If `calculate_exponential_histogram_buckets` is not set to `false`, the following JSON values are added to each JSON historgram:

```json

    "negativeBuckets": [
        {
        "min": 0.0,
        "max": 5.0,
        "count": 2
        },
        {
        "min": 5.0,
        "max": 10.0,
        "count": 5
        }
    ],
...
    "positiveBuckets": [
        {
        "min": 0.0,
        "max": 5.0,
        "count": 2
        },
        {
        "min": 5.0,
        "max": 10.0,
        "count": 5
        }
    ],
```

The following JSON file is a more detailed form of the dense OpenTelemetry representation, which consists of negative and positive buckets, a scale parameter, offset, and list of bucket counts. 


```json
    "negative": [
        1,
        2,
        3
    ],
    "positive": [
        1,
        2,
        3
    ],
    "scale" : -3,
    "negativeOffset" : 0,
    "positiveOffset" : 1
```

The `exponential_histogram_max_allowed_scale` parameter defines the maximum allowed scale for an exponential histogram. Increasing this parameter increases potential memory consumption. See the [OpenTelemetry specifications](https://github.com/open-telemetry/opentelemetry-proto/blob/main/opentelemetry/proto/metrics/v1/metrics.proto) for more information on exponential histograms and their computational complexity.

All exponential histograms that have a scale that is above the configured parameter (by default, `10`) are discarded and logged with an error level. 

**Note**: The absolute scale value is used for comparison, so a scale of `-11` that is treated equally to `11` exceeds the configured value of `10` and can be discarded.

## Metrics

This plugin uses common metrics in [AbstractProcessor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java) and does not include custom metrics.