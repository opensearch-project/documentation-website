---
layout: default
title: otel_metrics
parent: Processors
grand_parent: Pipelines
nav_order: 72
---

# otel_metrics 

The `otel_metrics` processor serializes a collection of `ExportMetricsServiceRequest` records sent from the [OTel metrics source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/otel-metrics-source/) into a collection of string records.

## Usage

To get started, add the following processor to your `pipeline.yaml` configuration file:

``` yaml
processor:
    - otel_metrics_raw_processor:
```
{% include copy.html %}

## Configuration

You can use the following optional parameters to configure histogram buckets and their default values. A histogram displays numerical data by grouping data into buckets. You can use histogram buckets to view sets of events that are organized by the total event count and aggregate sum for all events. For more detailed information, see [OpenTelemetry Histograms](https://opentelemetry.io/docs/reference/specification/metrics/data-model/#histogram).

| Parameter | Default value | Description |
| :---    | :---    | :---    |
| `calculate_histogram_buckets` | `True` | Whether or not to calculate histogram buckets. |
| `calculate_exponential_histogram_buckets` | `True` | Whether or not to calculate exponential histogram buckets. |
| `exponential_histogram_max_allowed_scale` | `10` | Maximum allowed scale in exponential histogram calculation. | 
| `flatten_attributes` | `False` | Whether or not to flatten the `attributes` field in the JSON data. |

### calculate_histogram_buckets

If `calculate_histogram_buckets` is not set to `false`, then the following `JSON` file will be added to every histogram JSON. If `flatten_attributes` is set to `false`, the `JSON` string format of the metrics does not change the attributes field. If `flatten_attributes` is set to `true`, the values in the attributes field are placed in the parent `JSON` object. The default value is `true`. See the following `JSON` example:

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

You can create detailed representations of histogram buckets and their boundaries. You can control this feature by using the following parameters in your `pipeline.yaml` file:

```yaml
  processor:
    - otel_metrics_raw_processor:
        calculate_histogram_buckets: true
        calculate_exponential_histogram_buckets: true
        exponential_histogram_max_allowed_scale: 10
        flatten_attributes: false
```
{% include copy.html %}

Each array element describes one bucket. Each bucket contains the lower boundary, upper boundary, and its value count. This is a specific form of more detailed OpenTelemetry representation that is a part of the `JSON` output created by the `otel_metrics` processor. See the following `JSON` file, which is added to each `JSON` histogram by the `otel_metrics` processor:

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



### calculate_exponential_histogram_buckets

If `calculate_exponential_histogram_buckets` is set to `true` (the default setting), the following `JSON` values are added to each `JSON` histogram:

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

The following `JSON` file is a more detailed form of OpenTelemetry representation that consists of negative and positive buckets, a scale parameter, an offset, and a list of bucket counts: 


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


### exponential_histogram_max_allowed_scale

The `exponential_histogram_max_allowed_scale` parameter defines the maximum allowed scale for an exponential histogram. If you increase this parameter, you will increase potential memory consumption. See the [OpenTelemetry specifications](https://github.com/open-telemetry/opentelemetry-proto/blob/main/opentelemetry/proto/metrics/v1/metrics.proto) for more information on exponential histograms and their computational complexity.

All exponential histograms that have a scale that is above the configured parameter (by default, a value of `10`) are discarded and logged with an error level. You can check the log that Data Prepper creates to see the `ERROR` log message.

The absolute scale value is used for comparison, so a scale of `-11` that is treated equally to `11` exceeds the configured value of `10` and can be discarded.
{: .note}

## Metrics

The following table describes metrics that are common to all processors.

| Metric name | Type | Description |
| ------------- | ---- | -----------|
| `recordsIn` | Counter | Metric representing the number of ingress records. |
| `recordsOut` | Counter | Metric representing the number of egress records. |
| `timeElapsed` | Timer | Metric representing the time elapsed during execution of records. |
