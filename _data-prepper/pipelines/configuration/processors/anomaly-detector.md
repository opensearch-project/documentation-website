---
layout: default
title: Anomaly detector
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Anomaly detector

## Overview

The `Anomaly detector` processor takes structured data and runs anomaly detection algorithms on fields you can configure in the data. The data must be either an integer or real number in order for the the anomaly detection algorithm to detect anomalies. We recommend that you deploy the `Aggregate` processor before the `Anomaly detector` processor in a pipeline to achieve the best results because the `Aggregate` processor aggregates events with same keys onto the same host. <!--- This needs some clarification.--->

This processor uses the random cut forest mode to detect anomalies. <!--- Add other modes to this description if they exist.--->


## Configuration

Configuration for this processor involves specifying a key and specifying options for the mode. You can use the following options to configure the `Anomaly detector` processor.

| Name | Required | Description |
| :--- | :--- | :--- |
| `keys` | Yes | A non-ordered `List<String>` which are used as inputs to the ML algorithm to detect anomalies in the values of the keys in the list. At least one key is required.
| `mode` | Yes |  The ML algorithm (or model) to use to detect anomalies. One of the existing [Modes](#modes) must be provided. See [random_cut_forest](#random_cut_forest).

### Keys

<!-- Explain keys here,--->

<!--- Examples of keys.--->

<!--- Make the following into a table.--->

### random_cut_forest mode
* `random_cut_forest`: Processes events using Random Cut Forest ML algorithm to detect anomalies.
  * After passing a bunch of events with `latency` value between 0.2 and 0.3 are passed through the anomaly detector, when an event with `latency` value 11.5 is sent, the following anomaly event will be generated
  * More details about this can be found at https://docs.aws.amazon.com/sagemaker/latest/dg/randomcutforest.html
        ```json
            { "latency": 11.5, "deviation_from_expected":[10.469302736820003],"grade":1.0}
        ```
        Where `deviation_from_expected` is a list of deviations for each of the keys from their corresponding expected values and `grade` is the anomaly grade indicating the severity of the anomaly

        <!--- What other modes exist? Is this the only mode?-->

You can configure `random_cut_forest` mode with the following options. 

 <!--- Convert to table.--->

* `shingle_size` - shingle size to be used in the ML algorithm
  * Default: `4`
  * Range: 1 - 60
* `sample_size` - sample size size to be used in the ML algorithm
  * Default: `256`
  * Range: 100 - 2500
* `time_decay` - time decay value to be used in the ML algorithm. Used as (timeDecay/SampleSize) in the ML algorithm
  * Default: `0.1`
  * Range: 0 - 1.0
* `type` - Type of data that is being sent to the algorithm
  * Default: `metrics`
  * Others types like `traces` will be supported in future
* `version` - version of the algorithm
  * Default: `1.0`


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

When you run the `Anomaly detector` processor, it parses the messages and extracts the values for the `latency` key, then passes it <!--- The key?---> through `RandomCutForest` <!--- Where does this appear? Is it accurate? Should it be random_cut_forest? Can we say random_cut_forest mode? ---> machine-learning algorithm.

<!--- Is parsing the correct terminlogy? Is it necessary to include it? --->
<!--- Is latency the only option for the key? What are there other keys?--->
