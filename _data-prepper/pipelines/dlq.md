---
layout: default
title: Dead-letter queues 
parent: Pipelines
nav_order: 15
---

# Dead-letter queues

A dead-letter queue (DLQ) stores events that OpenSearch Data Prepper cannot process or deliver so that you can analyze and reprocess them later. For example, when the `opensearch` sink cannot index a document because the document conflicts with the index mapping, Data Prepper can send the failed event to a DLQ.

Data Prepper supports the following types of DLQs:

- A [DLQ pipeline](#dlq-pipeline): A pipeline named `dlq_pipeline` that receives failed events from all other pipelines. The DLQ pipeline is the recommended DLQ type.
- A [sink-level S3 DLQ](#sink-level-s3-dlq): A `dlq` setting in a plugin, such as the `opensearch` sink, that writes the failed events of that plugin to an Amazon Simple Storage Service (Amazon S3) bucket.

## DLQ pipeline

A DLQ pipeline is a pipeline that receives failed events from the other pipelines defined in your Data Prepper instance. Because the DLQ pipeline is a regular pipeline, you can use processors to transform failed events, [conditional routing]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines/#conditional-routing) to send them to different sinks, and any sink to store them. You define the DLQ pipeline once, and all plugins that support it use it.

The DLQ pipeline is available in Data Prepper 2.13 and later.

### Defining a DLQ pipeline

To define a DLQ pipeline, add a pipeline named `dlq_pipeline` to your pipeline configuration file. The name is fixed and cannot be changed. The DLQ pipeline has the following requirements:

- The DLQ pipeline must not contain a `source`. Data Prepper sends failed events directly to the pipeline's buffer. If you define a source in a pipeline named `dlq_pipeline`, Data Prepper starts the pipeline but does not send failed events to it.
- The DLQ pipeline must contain at least one sink. It can also contain processors, routes, and a buffer.

Data Prepper sends failed events from every other pipeline to the DLQ pipeline. Events that fail in the DLQ pipeline itself are not sent back to it.

The following example sends events from an `http` source to an OpenSearch index named `orders`. Events that the `opensearch` sink cannot index are sent to the DLQ pipeline, which writes them to an index named `failed-events`:

```yaml
orders-pipeline:
  source:
    http:
      path: "/orders"
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        username: admin
        password: "<custom-admin-password>"
        insecure: true
        index: orders

dlq_pipeline:
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        username: admin
        password: "<custom-admin-password>"
        insecure: true
        index: failed-events
```
{% include copy.html %}

If the `orders` index maps the `quantity` field as an `integer`, then the following document fails to index and is sent to the DLQ pipeline:

```bash
curl -X POST "http://localhost:2021/orders" \
  -H "Content-Type: application/json" \
  -d '[{"order_id": "1002", "quantity": "three"}]'
```
{% include copy.html %}

The `failed-events` index then contains the following document:

```json
{
  "order_id": "1002",
  "quantity": "three",
  "_failure_metadata": {
    "pluginId": "opensearch",
    "pluginName": "opensearch",
    "pipelineName": "orders-pipeline",
    "errorMessage": "failed to parse field [quantity] of type [integer] in document with id 'R3lw0qEBhbLHJMWz3ZGw'. Preview of field's value: 'three' caused by For input string: \"three\"",
    "status": 400,
    "index": "orders",
    "indexId": null
  }
}
```

If the DLQ pipeline writes to the same OpenSearch cluster as the sink that failed, then a cluster outage prevents both the sink and the DLQ pipeline from writing events. To store failed events when the cluster is unavailable, write them to a different destination, such as an S3 bucket.
{: .tip}

### Failed event format

The DLQ pipeline receives the original event, not a copy of the request that failed. Before sending the event, the plugin adds a `_failure_metadata` object to the event data. Because `_failure_metadata` is part of the event data, you can access it in processors and route conditions, for example, `/_failure_metadata/pluginName == "opensearch"`.

The following table lists the fields in the `_failure_metadata` object. Each plugin adds only some of these fields.

Field | Data type | Description | Added by
:--- | :--- | :--- | :---
`pluginId` | String | The ID of the plugin that failed to process the event. | `opensearch` sink, `sqs` sink, `rds` source
`pluginName` | String | The name of the plugin that failed to process the event. | All supported plugins
`pipelineName` | String | The name of the pipeline in which the event failed. | All supported plugins
`errorMessage` | String | The error message that describes the failure. | All supported plugins
`status` | Integer | The HTTP status code that OpenSearch returned for the failed document. | `opensearch` sink
`index` | String | The name of the index to which the sink tried to write the document. | `opensearch` sink
`indexId` | String | The document ID used in the failed bulk operation, or `null` if OpenSearch generates the document ID. | `opensearch` sink
`statusCode` | Integer | The HTTP status code returned by the destination endpoint. | `http` sink, `prometheus` sink
`sqsSinkQueueUrl` | String | The URL of the Amazon Simple Queue Service (Amazon SQS) queue to which the sink tried to send the event. | `sqs` sink

### Supported plugins

The following table lists the plugins that send failed events to the DLQ pipeline.

Plugin | Events sent to the DLQ pipeline | Data Prepper version
:--- | :--- | :---
Processors | When any processor throws an exception, the batch of events that the processor was processing. These events do not contain `_failure_metadata`. | 2.13 and later
[`opensearch` sink]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/opensearch/) | Documents that OpenSearch rejects or that the sink cannot write after reaching [`max_retries`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/opensearch/#configure-max_retries). | 2.13 and later
[`prometheus` sink]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/prometheus/) | Events that the sink cannot send to the Prometheus endpoint and events that are not metrics. | 2.14 and later
`sqs` sink | Events that the sink cannot send to the Amazon SQS queue. | 2.15 and later
`http` sink | Events that the sink cannot send to the HTTP endpoint. | 2.16 and later
[`rds` source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/rds/) | Records that fail processing, for example, because of a data type conversion error, during an export or while streaming changes. Streamed change events that the source cannot write to the buffer. | 2.16 and later

### Acknowledgments and circuit breakers

If any pipeline uses [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines/#end-to-end-acknowledgments), Data Prepper enables acknowledgments for the DLQ pipeline. A failed event is acknowledged when a sink in the DLQ pipeline writes the event. If Data Prepper cannot write a failed event to the DLQ pipeline buffer, then it retries every second until the write succeeds. When acknowledgments are disabled, Data Prepper drops the event after the first failed write and increments the `numberOfEventsFailed` metric.

Starting with Data Prepper 2.17, [circuit breakers]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/configuring-data-prepper/#circuit-breakers) do not apply to the DLQ pipeline buffer, so the DLQ pipeline continues to accept failed events when a circuit breaker is open.

### DLQ pipeline metrics

The DLQ pipeline provides the following counters in addition to the standard metrics of its buffer, processors, and sinks:

- `numberOfEventsSuccessful`: The number of failed events written to the DLQ pipeline buffer.
- `numberOfEventsFailed`: The number of failed events that Data Prepper could not write to the DLQ pipeline buffer and dropped.

In the Prometheus metrics endpoint, these counters are named `m__dlq_pipeline_numberOfEventsSuccessful_total` and `m__dlq_pipeline_numberOfEventsFailed_total`.

## Sink-level S3 DLQ

A sink-level S3 DLQ writes the failed events of a single plugin to an S3 bucket. To use a sink-level S3 DLQ, configure the `dlq` setting of a plugin that supports it, such as the `opensearch` sink.

### Configuring a sink-level S3 DLQ

To configure an S3 DLQ for the `opensearch` sink, add the following to your `pipelines.yaml` file:

```yaml
sink:
  - opensearch:
      hosts: ["https://opensearch:9200"]
      index: my-index
      username: admin
      password: "<custom-admin-password>"
      insecure: true

      dlq:
        s3:
          bucket: my-dlq-bucket
          key_path_prefix: dlq-files/
          region: us-west-2
          sts_role_arn: arn:aws:iam::123456789012:role/dlq-role
          bucket_owner: 123456789012
```
{% include copy.html %}

By default, each DLQ file contains a JSON object in which the `dlqObjects` array contains the DLQ objects. When `codec` is `ndjson`, each DLQ file contains one DLQ object per line. Any file written to the `s3` DLQ contains the following name pattern:

```
dlq-v${version}-${pipelineName}-${pluginId}-${timestampIso8601}-${uniqueId}.${extension}
```

The following information is replaced in the name pattern:

- `version`: The Data Prepper version.
- `pipelineName`: The pipeline name indicated in `pipelines.yaml`.
- `pluginId`: The ID of the plugin associated with the DLQ event.
- `extension`: The value of the `codec` option, either `json` or `ndjson`.

### Using a sink-level S3 DLQ with a DLQ pipeline

When you configure both a sink-level S3 DLQ and a DLQ pipeline, the plugin determines which DLQ receives the failed events:

- `opensearch` sink: Starting with Data Prepper 2.17, the sink writes failed documents to the sink-level S3 DLQ. If the write to S3 fails, then the sink sends the documents to the DLQ pipeline. In Data Prepper 2.13--2.16, the sink sends failed documents to the DLQ pipeline and does not use the sink-level S3 DLQ.
- `sqs` sink: The sink sends failed events to the DLQ pipeline and does not use the sink-level S3 DLQ.

### S3 DLQ configuration

The `s3` DLQ supports the following configuration options.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`bucket` | Yes | String | The name of the bucket into which the DLQ outputs failed records.
`key_path_prefix` | No | String | The `key_prefix` used in the Amazon S3 bucket. Defaults to `""`. Supports time value pattern variables, such as `/%{yyyy}/%{MM}/%{dd}`, including any variables listed in the [Java DateTimeFormatter](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html). For example, when using the `/%{yyyy}/%{MM}/%{dd}` pattern, you can set `key_prefix` as `/2023/01/24`.
`region` | No | String | The AWS Region of the S3 bucket. Defaults to `us-east-1`.
`sts_role_arn` | No | String | The STS role the DLQ assumes in order to write to an AWS S3 bucket. Default is `null`, which uses the standard SDK behavior for credentials. To use this option, the S3 bucket must have the `s3:PutObject` permission configured.
`sts_external_id` | No | String | The external ID to use when assuming the STS role. Must be between 2 and 1,224 characters.
`sts_header_overrides` | No | Map | A map of headers to add to the AWS STS `AssumeRole` request.
`force_path_style` | No | Boolean | When `true`, the DLQ addresses the S3 bucket using path-style URLs (`https://s3.<region>.amazonaws.com/<bucket>/<key>`) rather than virtual-hosted-style URLs. Default is `false`.
`legacy_md5_checksum` | No | Boolean | When `true`, the DLQ sends a `Content-MD5` header with each request and calculates checksums only when the S3 operation requires them. Use this setting for S3-compatible storage that does not support the newer AWS SDK checksum algorithms. Default is `false`.
`bucket_owner` | No | String | The AWS account ID of the S3 bucket owner. When set, Data Prepper passes this value to S3 as `expectedBucketOwner`, and S3 rejects writes if it does not match the actual bucket owner. Default is `null`, which performs no explicit bucket owner check.
`codec` | No | String | The format of the DLQ files. Valid values are `json` and `ndjson`. When `json`, each file contains a JSON object in which the `dlqObjects` array contains all DLQ objects in the batch. When `ndjson`, each file contains one DLQ object per line and uses the `.ndjson` file extension. Default is `json`.

When using DLQ with an OpenSearch sink, you can configure the [`max_retries`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/opensearch/#configure-max_retries) option to send failed records to the DLQ after the sink reaches the maximum number of retry attempts.

### S3 DLQ metrics

The `s3` DLQ supports the following metrics.

#### Counter

- `dlqS3RecordsSuccess`: Measures the number of successful records sent to S3.
- `dlqS3RecordsFailed`: Measures the number of records that failed to be sent to S3.
- `dlqS3RequestSuccess`: Measures the number of successful S3 requests.
- `dlqS3RequestFailed`: Measures the number of failed S3 requests.

#### Distribution summary

- `dlqS3RequestSizeBytes`: Measures the distribution of the S3 request's payload size in bytes.

#### Timer

- `dlqS3RequestLatency`: Measures latency when sending each S3 request, including retries.

### DLQ objects

Each object written to the `s3` DLQ contains the following fields:

- `pluginId`: The ID of the plugin that originated the event sent to the DLQ.
- `pluginName`: The name of the plugin.
- `failedData`: An object that contains the failed object and its options. This object is unique to each plugin.
- `pipelineName`: The name of the Data Prepper pipeline in which the event failed.
- `timestamp`: The timestamp of the failure in `ISO8601` format.
