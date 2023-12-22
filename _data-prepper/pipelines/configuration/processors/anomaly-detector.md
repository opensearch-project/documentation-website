---
layout: default
title: anomaly_detector
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# anomaly_detector

The anomaly detector processor takes structured data and runs anomaly detection algorithms on fields that you can configure in that data. The data must be either an integer or a real number for the anomaly detection algorithm to detect anomalies. Deploying the aggregate processor in a pipeline before the anomaly detector processor can help you achieve the best results, as the aggregate processor automatically aggregates events by key and keeps them on the same host. For example, if you are searching for an anomaly in latencies from a specific IP address and if all the events go to the same host, then the host has more data for these events. This additional data results in better training of the machine learning (ML) algorithm, which results in better anomaly detection. 

## Configuration

You can configure the anomaly detector processor by specifying a key and the options for the selected mode. You can use the following options to configure the anomaly detector processor.

| Name | Required | Description |
| :--- | :--- | :--- |
| `keys` | Yes | A non-ordered `List<String>` that is used as input to the ML algorithm to detect anomalies in the values of the keys in the list. At least one key is required.
| `mode` | Yes | The ML algorithm (or model) used to detect anomalies. You must provide a mode. See [random_cut_forest mode](#random_cut_forest-mode).
| `identification_keys` | No | If provided, anomalies will be detected within each unique instance of this key. For example, if you provide the `ip` field, anomalies will be detected separately for each unique IP address.
| `cardinality_limit` | No | If using the `identification_keys` settings, a new ML model will be created for every degree of cardinality. This can cause a large amount of memory usage, so it is helpful to set a limit on the number of models. Default limit is 5000.
| `verbose` | No | RCF will try to automatically learn and reduce the number of anomalies detected. For example, if latency is consistently between 50 and 100, and then suddenly jumps to around 1000, only the first one or two data points after the transition will be detected (unless there are other spikes/anomalies). Similarly, for repeated spikes to the same level, RCF will likely eliminate many of the spikes after a few initial ones. This is because the default setting is to minimize the number of alerts detected. Setting the `verbose` setting to `true` will cause RCF to consistently detect these repeated cases, which may be useful for detecting anomalous behavior that lasts an extended period of time.


### Keys

Keys that are used in the anomaly detector processor are present in the input event. For example, if the input event is `{"key1":value1, "key2":value2, "key3":value3}`, then any of the keys (such as `key1`, `key2`, `key3`) in that input event can be used as anomaly detector keys as long as their value (such as `value1`, `value2`, `value3`) is an integer or real number.

### random_cut_forest mode

The random cut forest (RCF) ML algorithm is an unsupervised algorithm for detecting anomalous data points within a dataset. To detect anomalies, the anomaly detector processor uses the `random_cut_forest` mode.

| Name | Description |
| :--- | :--- |
| `random_cut_forest` | Processes events using the RCF ML algorithm to detect anomalies. | 

RCF is an unsupervised ML algorithm for detecting anomalous data points within a dataset. Data Prepper uses RCF to detect anomalies in data by passing the values of the configured key to RCF. For example, when an event with a latency value of 11.5 is sent, the following anomaly event is generated:


 ```json
  { "latency": 11.5, "deviation_from_expected":[10.469302736820003],"grade":1.0}
```

In this example, `deviation_from_expected` is a list of deviations for each of the keys from their corresponding expected values, and `grade` is the anomaly grade that indicates the anomaly severity.
     

You can configure `random_cut_forest` mode with the following options. 

| Name | Default value | Range | Description |
| :--- | :--- | :--- | :--- |
| `shingle_size` | `4` | 1--60 | The shingle size used in the ML algorithm. |
| `sample_size` | `256` | 100--2500 | The sample size used in the ML algorithm. |
| `time_decay` | `0.1` | 0--1.0 | The time decay value used in the ML algorithm. Used as the mathematical expression `timeDecay` divided by `SampleSize` in the ML algorithm. |
| `type` | `metrics` | N/A | The type of data sent to the algorithm. |
| `version` | `1.0` | N/A | The algorithm version number. |

## Usage

To get started, create the following `pipeline.yaml` file. You can use the following pipeline configuration to look for anomalies in the `latency` field in events that are passed to the processor. Then you can use the following YAML configuration file `random_cut_forest` mode to detect anomalies:

```yaml
ad-pipeline:
  source:
    ...
  ....  
  processor:
    - anomaly_detector:
        keys: ["latency"]
        mode: 
            random_cut_forest:
```

When you run the anomaly detector processor, the processor extracts the value for the `latency` key, and then passes the value through the RCF ML algorithm. You can configure any key that comprises integers or real numbers as values. In the following example, you can configure `bytes` or `latency` as the key for an anomaly detector. 

`{"ip":"1.2.3.4", "bytes":234234, "latency":0.2}`
