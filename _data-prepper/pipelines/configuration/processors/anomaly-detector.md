---
layout: default
title: Anomaly detector
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Anomaly detector

## Overview

The `Anomaly detector` processor takes structured data and runs anomaly detection algorithms on fields you can configure in the data. The data must be either an integer or real number in order for the the anomaly detection algorithm to detect anomalies. We recommend that you deploy the `Aggregate` processor in a pipeline before the `Anomaly detector` processor to achieve the best results.  This is because the `Aggregate` processor aggregates events with same keys onto the same host.

This processor uses the `random_cut_forest` mode to detect anomalies. 


## Configuration

Configuration for this processor involves specifying a key and specifying options for the mode. You can use the following options to configure the `Anomaly detector` processor.

| Name | Required | Description |
| :--- | :--- | :--- |
| `keys` | Yes | A non-ordered `List<String>` which are used as inputs to the ML algorithm to detect anomalies in the values of the keys in the list. At least one key is required.
| `mode` | Yes |  The machine learning (ML) algorithm (or model) to use to detect anomalies. One of the existing [Modes](#modes) must be provided. See [random_cut_forest](#random_cut_forest).

### Keys


### random_cut_forest mode

<!--- Add description for the random_forest_cut mode.--->

| Name | Description |
| :--- | :--- |
| `random_cut_forest` | Processes events using Random Cut Forest ML algorithm to detect anomalies. After passing a bunch of events with `latency` value between 0.2 and 0.3 are passed through the anomaly detector, when an event with `latency` value 11.5 is sent, the following anomaly event will be generated. See [Random Cut Forest (RCF) Algorithm](https://docs.aws.amazon.com/sagemaker/latest/dg/randomcutforest.html) for more details.| 



 ```json
  { "latency": 11.5, "deviation_from_expected":[10.469302736820003],"grade":1.0}
```

Where `deviation_from_expected` is a list of deviations for each of the keys from their corresponding expected values and `grade` is the anomaly grade indicating the severity of the anomaly

       

You can configure `random_cut_forest` mode with the following options. 

| Name | Default value | Range | Description |
| :--- | :--- | :--- |
| `shingle_size` | `4` | 1 - 60 | The shingle size to be used in the ML algorithm. |
| `sample_size` | `256` | 100 - 2500 | Sample size size to be used in the ML algorithm. |
| `time_decay` | `0.1` | 0 - 1.0 | The time decay value to be used in the ML algorithm. Used as (timeDecay/SampleSize) in the ML algorithm. |
| `type` | `metrics` | N/A | Type of data that is being sent to the algorithm. Other types, such as `traces`, will be supported in future releases. |
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

When you run the `Anomaly detector` processor, it parses the messages and extracts the values for the `latency` key, then passes it through `RandomCutForest` machine-learning algorithm.