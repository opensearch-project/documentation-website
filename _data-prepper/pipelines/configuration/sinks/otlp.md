---
layout: default
title: OTLP
parent: Sinks
grand_parent: Pipelines
nav_order: 52
---

# OTLP sink

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the [`otlp` sink plugin](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/otlp-sink) in the OpenSearch Data Prepper repository.
{: .warning}

The `otlp` sink exports traces, metrics, and logs to an endpoint that accepts [OpenTelemetry Protocol (OTLP)](https://opentelemetry.io/docs/specs/otlp/) requests over HTTP. It encodes each batch as Protobuf, compresses it with `gzip`, and signs the request with AWS Signature Version 4 (SigV4). To send data to an endpoint that accepts SigV4-signed requests, set `service_name` to that endpoint's signing name. Because the sink signs every request and requires AWS credentials, it is designed for endpoints that use AWS authentication.

The sink determines the signal type of each event from the event's type: span events are exported as OTLP trace data, metric events as metric data, and log events as log data. The sink accepts only span, metric, and log events, such as the events produced by the [`otlp` source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/otlp-source/). Any other event is dropped and counted in the `failedRecordsCount` metric.

The sink maintains a separate buffer for each signal type, so each signal type is batched independently. Each request contains a batch of events of a single signal type, assembled according to the [threshold configuration](#threshold-configuration). A batch can contain spans from many traces, and the spans of a single trace can be sent in different requests.

Each sink sends all signals to the single URL configured in `endpoint`. Because OTLP/HTTP endpoints use a different path for each signal (`/v1/traces`, `/v1/metrics`, and `/v1/logs`), configure one `otlp` sink per signal and use [conditional routing]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#conditional-routing) when a pipeline carries more than one signal type. For an example, see [Routing mixed signal types](#routing-mixed-signal-types).

## Prerequisites

To use the `otlp` sink, enable the experimental `otlp` plugin in `data-prepper-config.yaml`:

```yaml
experimental:
  enabled_plugins:
    sink:
      - otlp
```
{% include copy.html %}

## Usage

The following examples configure the `otlp` sink for different scenarios.

### Sending traces to AWS X-Ray

The following pipeline sends spans to the AWS X-Ray OTLP endpoint. Because the endpoint host contains the Region, `aws.region` can be omitted:

```yaml
trace-pipeline:
  source:
    otlp:
      ssl: false
  sink:
    - otlp:
        endpoint: "https://xray.us-east-1.amazonaws.com/v1/traces"
        aws:
          sts_role_arn: "arn:aws:iam::123456789012:role/data-prepper-otlp-role"
```
{% include copy.html %}

### Configuring custom signing values and headers

The following pipeline sends logs to an endpoint that accepts SigV4-signed requests but is not AWS X-Ray. It sets `service_name` to the endpoint's Signature Version 4 signing name, sets `aws.region` explicitly because the endpoint host does not contain a Region, and adds a custom header to every request:

```yaml
log-pipeline:
  source:
    http:
      port: 2021
      path: "/logs"
  sink:
    - otlp:
        endpoint: "https://my-otlp-endpoint.example.com:443/v1/logs"
        service_name: "my-service"
        max_retries: 3
        threshold:
          max_events: 100
          flush_timeout: 5s
        aws:
          region: "us-east-1"
          sts_role_arn: "arn:aws:iam::123456789012:role/data-prepper-otlp-role"
        additional_headers:
          x-custom-header: "my-value"
```
{% include copy.html %}

### Routing mixed signal types

The following pipeline receives all three signal types from an [`otlp` source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/otlp-source/) and routes each one to a sink configured with the matching signal path:

```yaml
otlp-pipeline:
  source:
    otlp:
      ssl: false
  route:
    - traces: 'getEventType() == "TRACE"'
    - metrics: 'getEventType() == "METRIC"'
    - logs: 'getEventType() == "LOG"'
  sink:
    - otlp:
        routes:
          - traces
        endpoint: "https://xray.us-east-1.amazonaws.com/v1/traces"
        aws:
          region: "us-east-1"
    - otlp:
        routes:
          - metrics
        endpoint: "https://my-otlp-endpoint.example.com/v1/metrics"
        service_name: "my-service"
        aws:
          region: "us-east-1"
    - otlp:
        routes:
          - logs
        endpoint: "https://my-otlp-endpoint.example.com/v1/logs"
        service_name: "my-service"
        aws:
          region: "us-east-1"
```
{% include copy.html %}

## Configuration

Use the following options to configure the `otlp` sink.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`endpoint` | Yes | String | The OTLP/HTTP endpoint URL, including the signal path, for example, `https://xray.us-east-1.amazonaws.com/v1/traces`.
`aws` | Yes | [AWS configuration](#aws-configuration) | The AWS configuration used for SigV4 signing. All requests are signed, so this block must be present, even when it is empty.
`service_name` | No | String | The SigV4 signing name used for requests, for example, `logs` or `osis`. Default is `xray`.
`max_retries` | No | Integer | The maximum number of retries for a failed request. The sink retries the `429`, `502`, `503`, and `504` status codes using exponential backoff with jitter. Default is `5`.
`threshold` | No | [Threshold configuration](#threshold-configuration) | The batching and flushing configuration.
`additional_headers` | No | Map | The HTTP headers added to every request. Default is an empty map.

The `aws` block is required in this release. Support for OTLP endpoints that do not use Signature Version 4 signing is not yet available.
{: .note}

Headers in `additional_headers` are added after the request is signed, so they are not part of the Signature Version 4 signature. To keep signing valid, the sink rejects the `Authorization`, `Host`, `Content-Type`, `Content-Encoding`, and `Content-Length` headers and any header whose name begins with `x-amz-`. A pipeline that configures one of these headers fails to start.
{: .note}

## Threshold configuration

The sink flushes a batch when any threshold is reached. Use the following options to configure batching and flushing.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`max_events` | No | Integer | The maximum number of events in a batch. Set to `0` to flush based only on `max_batch_size` and `flush_timeout`. Default is `512`.
`max_batch_size` | No | String | The maximum size of the uncompressed batch payload. Default is `1mb`.
`flush_timeout` | No | Duration | The maximum amount of time to wait before flushing a batch. Must be at least `1ms`. Default is `200ms`.

The sink sets the HTTP response timeout to twice the `flush_timeout` value, within a range of 3 to 10 seconds. For a `flush_timeout` of 1.5 seconds or less, the response timeout is 3 seconds. For a `flush_timeout` between 1.5 and 5 seconds, the response timeout is twice the `flush_timeout`. For a `flush_timeout` of 5 seconds or more, the response timeout is 10 seconds.
{: .note}

Each signal type uses its own queue of events waiting to be batched. The queue capacity is 10 times `max_events`, with a minimum of 2,000 events, so the queue grows when you increase `max_events`. When a queue is full, the sink applies backpressure to the pipeline and does not drop events.

## AWS configuration

Use the following options in the `aws` block to configure credentials and signing.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`region` | No | String | The AWS Region used for SigV4 signing and credentials. If not specified, the sink parses the Region from the hostname in `endpoint` and fails at startup if the hostname does not contain a valid Region.
`sts_role_arn` | No | String | The AWS Security Token Service (AWS STS) role to assume for requests. Defaults to `null`, which uses the [default credential provider chain](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`sts_external_id` | No | String | The external ID to use when assuming the AWS STS role.

## Limitations

The `otlp` sink has the following limitations:

- Traces can be sent only to AWS X-Ray-compatible endpoints (`https://xray.<region>.amazonaws.com/v1/traces`). Metrics and logs can be sent to any OTLP endpoint that accepts SigV4-signed Protobuf requests.
- Only OTLP over HTTP is supported. OTLP over gRPC is not supported.
- When the retries configured in `max_retries` are exhausted, the batch is dropped and the failure is logged and counted. Because the sink retries a batch after a retryable status code, the endpoint can receive the same batch more than once. Dead-letter queue (DLQ) delivery is not supported.

## Metrics

The `otlp` sink provides the following metrics in addition to the [common sink metrics]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/monitoring/).

### Counters

The following counters track the records and responses processed by the `otlp` sink.

Metric | Description
:--- | :---
`recordsOut` | The number of records that the endpoint accepted.
`rejectedRecordsCount` | The number of records that the endpoint rejected or that could not be delivered.
`failedRecordsCount` | The number of records that the sink could not process, including events that are not spans, metrics, or logs.
`rejectedSpansCount`, `rejectedMetricsCount`, `rejectedLogsCount` | The number of rejected records for each signal type.
`failedSpansCount`, `failedMetricsCount`, `failedLogsCount` | The number of failed records for each signal type.
`errorsCount` | The number of unexpected worker thread errors.
`http2xxResponses`, `http4xxResponses`, `http5xxResponses` | The number of responses received for each status code category.

### Timers

The following timer tracks request latency in the `otlp` sink.

Metric | Description
:--- | :---
`httpLatency` | The amount of time taken to receive a response from the endpoint.

### Distribution summaries

The following distribution summaries track payload sizes in the `otlp` sink.

Metric | Description
:--- | :---
`payloadSize` | The distribution of uncompressed request payload sizes, in bytes.
`payloadGzipSize` | The distribution of `gzip`-compressed request payload sizes, in bytes.

### Gauges

The following gauges track the queue of each signal type in the `otlp` sink.

Metric | Description
:--- | :---
`queueSize` | The number of events waiting to be sent.
`queueCapacity` | The total capacity of the queue.

## Related documentation

- [OTLP source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/otlp-source/)
- [getEventType()]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/get-eventtype/)
- [Conditional routing]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#conditional-routing)
