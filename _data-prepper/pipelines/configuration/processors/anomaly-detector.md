---
layout: default
title: anomaly_detector
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# anomaly_detector

## Overview

The `anomaly_detector` processor takes structured data and runs anomaly detection algorithms on fields that you can configure in that data. The data must be either an integer or real number in order for the the anomaly detection algorithm to detect anomalies. We recommend that you deploy the `Aggregate` processor in a pipeline before the `anomaly_detector` processor to achieve the best results.  This is because the `Aggregate` processor automatically aggregates events with same keys onto the same host. For example, if you are searching for an anomaly in latencies from a specific IP address, and if all of the events go to the same host, then the host has more data for these events. This additional data results in better training of the ML algorithm, which results in better anomaly detection. 

## Configuration

Configuration for this processor involves specifying a key and specifying options for the mode. You can use the following options to configure the `anomaly_detector` processor.

| Name | Required | Description |
| :--- | :--- | :--- |
| `keys` | Yes | A non-ordered `List<String>` which are used as inputs to the ML algorithm to detect anomalies in the values of the keys in the list. At least one key is required.
| `mode` | Yes |  The machine learning (ML) algorithm (or model) to use to detect anomalies. You must be provide a mode. See [random_cut_forest mode](#random_cut_forest_mode).

### Keys

Keys that are used in the `anomaly_detector` processor are keys that are present in the input event. For example, if the input event is `{"key1":value1, "key2":value2, "key3":value3....}` then any of the keys (such as `key1`, `key2`, `key3`) in the input event can be used as anomaly detector keys as long as their value (such as `value1`, `value2`, `value3`) is an integer or real number.

### random_cut_forest_mode

The Random Cut Forest (RCF) ML algorithm is an unsupervised algorithm for detecting anomalous data points within a data set. In order to detect anomalies, the `anomaly_detector` processor uses the `random_cut_forest` mode. Currently, this is the only mode that the `anomaly_detector` processor uses, but other modes may be supported in future releases.

| Name | Description |
| :--- | :--- |
| `random_cut_forest` | Processes events using Random Cut Forest ML algorithm to detect anomalies. After passing a group of events with `latency`, a value between `0.2` and `0.3` is passed through the `anomaly_detector` processor. When an event with `latency` value `11.5` is sent, the following anomaly event is generated. See [Random Cut Forest (RCF) Algorithm](https://docs.aws.amazon.com/sagemaker/latest/dg/randomcutforest.html) for more details.| 

See the following example of what happens in the `anomaly_detector` processor when it receives input:

 ```json
  { "latency": 11.5, "deviation_from_expected":[10.469302736820003],"grade":1.0}
```

In this example, `deviation_from_expected` is a list of deviations for each of the keys from their corresponding expected values, and `grade` is the anomaly grade that indicates the severity of the anomaly.
     

You can configure `random_cut_forest` mode with the following options. 

| Name | Default value | Range | Description |
| :--- | :--- | :--- | :--- |
| `shingle_size` | `4` | 1 - 60 | The shingle size used in the ML algorithm. |
| `sample_size` | `256` | 100 - 2500 | Sample size size used in the ML algorithm. |
| `time_decay` | `0.1` | 0 - 1.0 | The time decay value used in the ML algorithm. Used as (timeDecay/SampleSize) in the ML algorithm. |
| `type` | `metrics` | N/A | Type of data sent to the algorithm. Other types, such as `traces`, will be supported in future releases. |
| `version` | `1.0` | N/A | The algorithm version number. |

## Usage

To get started, create the following `pipeline.yaml` file. You can use the following pipeline configuration to look for anomalies in the `latency` field in events passed to the processor. The following `yaml` configuration file uses the `random_cut_forest` mode to detect anomalies.

```yaml
ad-pipeline:
  source:
    http:
  processor:
    - anomaly_detector:
        keys: ["latency"]
        mode: 
            random_cut_forest:
  sink:
    - stdout:
```

When you run the `anomaly_detector` processor, the extracted value parses the messages and extracts the values for the `latency` key, then passes it through the `random_cut_forest` ML algorithm. You can configure any key that is comprised of integers or real numbers as values. In the following example, you can configure `bytes` as an anomaly detector. 

`{"ip":"1.2.3.4", "bytes":234234, "latency":0.2}`