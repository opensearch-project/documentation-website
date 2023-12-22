---
layout: default
title: Dead-letter queues 
parent: Pipelines
nav_order: 13
---

# Dead-letter queues

Data Prepper pipelines support dead-letter queues (DLQs) for offloading failed events and making them accessible for analysis.

As of Data Prepper 2.3, only the `s3` source supports DLQs.

## Configure a DLQ writer

To configure a DLQ writer for the `s3` source, add the following to your pipeline.yaml file:

```yaml
  sink:
    opensearch:
      dlq:
        s3:
          bucket: "my-dlq-bucket"
          key_path_prefix: "dlq-files/"
          region: "us-west-2"
          sts_role_arn: "arn:aws:iam::123456789012:role/dlq-role"
```

The resulting DLQ file outputs as a JSON array of DLQ objects. Any file written to the S3 DLQ contains the following name pattern:

```
dlq-v${version}-${pipelineName}-${pluginId}-${timestampIso8601}-${uniqueId}
```
The following information is replaced in the name pattern:


- `version`: The Data Prepper version.
- `pipelineName`: The pipeline name indicated in pipeline.yaml.
- `pluginId`: The ID of the plugin associated with the DLQ event.

## Configuration

DLQ supports the following configuration options.

Option | Required | Type | Description
:--- | :--- | :--- | :---
bucket | Yes | String | The name of the bucket into which the DLQ outputs failed records.
key_path_prefix | No | String | The `key_prefix` used in the S3 bucket. Defaults to `""`. Supports time value pattern variables, such as `/%{yyyy}/%{MM}/%{dd}`, including any variables listed in the [Java DateTimeFormatter](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html). For example, when using the `/%{yyyy}/%{MM}/%{dd}` pattern, you can set `key_prefix` as `/2023/01/24`.
region | No | String | The AWS Region of the S3 bucket. Defaults to `us-east-1`.
sts_role_arn | No | String | The STS role the DLQ assumes in order to write to an AWS S3 bucket. Default is `null`, which uses the standard SDK behavior for credentials. To use this option, the S3 bucket must have the `S3:PutObject` permission configured.

When using DLQ with an OpenSearch sink, you can configure the [max_retries]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/opensearch/#configure-max_retries) option to send failed data to the DLQ when the sink reaches the maximum number of retries.


## Metrics

DLQ supports the following metrics.

### Counter

- `dlqS3RecordsSuccess`: Measures the number of successful records sent to S3.
- `dlqS3RecordsFailed`: Measures the number of records that failed to be sent to S3.
- `dlqS3RequestSuccess`: Measures the number of successful S3 requests.
- `dlqS3RequestFailed`: Measures the number of failed S3 requests.

### Distribution summary

- `dlqS3RequestSizeBytes`: Measures the distribution of the S3 request's payload size in bytes.

### Timer

- `dlqS3RequestLatency`: Measures latency when sending each S3 request, including retries.

## DLQ objects

DLQ supports the following DLQ objects:

* `pluginId`: The ID of the plugin that originated the event sent to the DLQ.
* `pluginName`: The name of the plugin.
* `failedData` : An object that contains the failed object and its options. This object is unique to each plugin.
* `pipelineName`: The name of the Data Prepper pipeline in which the event failed.
* `timestamp`: The timestamp of the failures in an `ISO8601` format.

