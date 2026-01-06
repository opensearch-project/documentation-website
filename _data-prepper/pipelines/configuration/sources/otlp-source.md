---
layout: default
title: OTLP source
parent: Sources
grand_parent: Pipelines
nav_order: 85
---

# OTLP source

The `otlp` source is a unified OpenTelemetry source that follows the [OpenTelemetry Protocol (OTLP) specification](https://opentelemetry.io/docs/specs/otlp/) and can receive logs, metrics, and traces through a single endpoint. This source consolidates the functionality of the individual `otel_logs_source`, `otel_metrics_source`, and `otel_trace_source` sources, providing a streamlined approach to ingesting all OpenTelemetry telemetry signals.

The `otlp` source supports both the `OTLP/gRPC` and `OTLP/HTTP` protocols. For `OTLP/HTTP`, only Protobuf encoding is supported. This makes it compatible with a wide range of OpenTelemetry collectors and instrumentation libraries.
{: .note}

## Configuration

You can configure the `otlp` source with the following options.

| Option | Type | Description |
| :--- | :--- | :--- |
| `port` | Integer | The port on which the `otlp` source listens. Default is `21893`. |
| `logs_path` | String | The path for sending unframed HTTP requests for logs. Must start with `/` and have a minimum length of 1. Default is `/opentelemetry.proto.collector.logs.v1.LogsService/Export`. |
| `metrics_path` | String | The path for sending unframed HTTP requests for metrics. Must start with `/` and have a minimum length of 1. Default is `/opentelemetry.proto.collector.metrics.v1.MetricsService/Export`. |
| `traces_path` | String | The path for sending unframed HTTP requests for traces. Must start with `/` and have a minimum length of 1. Default is `/opentelemetry.proto.collector.trace.v1.TraceService/Export`. |
| `request_timeout` | Duration | The request timeout duration. Default is `10s`. |
| `retry_info` | Object | Configures retry behavior. Supports `min_delay` (default `100ms`) and `max_delay` (default `2s`) parameters to control exponential backoff. See [Retry information](#retry-information).|
| `health_check_service` | Boolean | Enables a gRPC health check service under `grpc.health.v1.Health/Check`. When `unframed_requests` is `true`, enables HTTP health check at `/health`. Default is `false`. |
| `proto_reflection_service` | Boolean | Enables a reflection service for Protobuf services (see [ProtoReflectionService](https://grpc.github.io/grpc-java/javadoc/io/grpc/protobuf/services/ProtoReflectionService.html) and [gRPC reflection](https://github.com/grpc/grpc-java/blob/master/documentation/server-reflection-tutorial.md)). Default is `false`. |
| `unframed_requests` | Boolean | Enables requests not framed using the gRPC wire protocol. Default is `false`. |
| `thread_count` | Integer | The number of threads to keep in the scheduled thread pool. Default is `200`. |
| `max_connection_count` | Integer | The maximum allowed number of open connections. Default is `500`. |
| `max_request_length` | String | The maximum number of bytes allowed in the payload of a single gRPC or HTTP request. Default is `10mb`. |
| `compression` | String | The compression type applied to the client request payload. Valid values are `none` (no compression) or `gzip` (apply `gzip` decompression). Default is `none`. |
| `output_format` | String | Specifies the decoded output format for all signals (logs, metrics, and traces) if individual output format options are not set. Valid values are `otel` (OpenTelemetry format) and `opensearch` (OpenSearch format). Default is `otel`. |
| `logs_output_format` | String | Specifies the decoded output format specifically for logs. Takes precedence over `output_format` for logs. Valid values are `otel` and `opensearch`. Default is `otel`. |
| `metrics_output_format` | String | Specifies the decoded output format specifically for metrics. Takes precedence over `output_format` for metrics. Valid values are `otel` and `opensearch`. Default is `otel`. |
| `traces_output_format` | String | Specifies the decoded output format specifically for traces. Takes precedence over `output_format` for traces. Valid values are `otel` and `opensearch`. Default is `otel`. |

If an individual output format (for example, `logs_output_format`) is set, it takes precedence over the generic `output_format` for that signal type. If neither is set, the default is `otel`.
{: .note}

### SSL/TLS configuration

You can configure SSL/TLS in the `otlp` source with the following options.

| Option | Type | Description |
| :--- | :--- | :--- |
| `ssl` | Boolean | Enables SSL/TLS. Default is `true`. |
| `ssl_certificate_file` | String | The SSL certificate chain file path or Amazon Simple Storage Service (Amazon S3) path (for example, `s3://<bucketName>/<path>`). Required if `ssl` is set to `true`. |
| `ssl_key_file` | String | The SSL key file path or Amazon S3 path (for example, `s3://<bucketName>/<path>`). Required if `ssl` is set to `true`. |
| `use_acm_cert_for_ssl` | Boolean | Enables SSL/TLS using a certificate and private key from AWS Certificate Manager (ACM). Default is `false`. |
| `acm_certificate_arn` | String | The ACM certificate Amazon Resource Name (ARN). ACM certificates take precedence over Amazon S3 or local file system certificates. Required if `use_acm_cert_for_ssl` is set to `true`. |
| `acm_private_key_password` | String | The ACM private key password that decrypts the private key. If not provided, OpenSearch Data Prepper uses the private key unencrypted. |
| `aws_region` | String | The AWS Region used by ACM or Amazon S3. Required if `use_acm_cert_for_ssl` is set to `true` or if `ssl_certificate_file` and `ssl_key_file` are Amazon S3 paths. |

### Authentication configuration

By default, the `otlp` source runs without authentication. You can configure authentication using the following options.

To explicitly disable authentication, specify the following settings:

```yaml
source:
  otlp:
    authentication:
      unauthenticated:
```
{% include copy.html %}

To enable HTTP Basic authentication, specify the following settings:

```yaml
source:
  otlp:
    authentication:
      http_basic:
        username: my-user
        password: my_s3cr3t
```
{% include copy.html %}

This plugin uses pluggable authentication for gRPC servers. To provide custom authentication, create a plugin that implements [`GrpcAuthenticationProvider`](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/armeria-common/src/main/java/org/opensearch/dataprepper/armeria/authentication/GrpcAuthenticationProvider.java).

### Retry information

You can set retry behavior using the `retry_info` setting, specifying how long to wait for the next request when backpressure occurs. The retry mechanism applies exponential backoff with a configurable maximum delay:

```yaml
source:
  otlp:
    retry_info:
      min_delay: 100ms  # defaults to 100ms
      max_delay: 2s     # defaults to 2s
```
{% include copy.html %}

## Usage

The following examples demonstrate how to configure and use the `otlp` source in various scenarios.

### Basic configuration

To get started with the `otlp` source, create a `pipeline.yaml` file with the following minimal configuration:

```yaml
pipeline:
  source:
    otlp:
      ssl: false
  sink:
    - stdout:
```
{% include copy.html %}

### Routing telemetry signals

One of the key features of the `otlp` source is its ability to route different telemetry signals (logs, metrics, and traces) to different processors or sinks based on your specific needs. Routing is determined by metadata using the `getEventType()` function:

```yaml
version: "2"
otel-telemetry:
  source:
    otlp:
      ssl: false
  route:
    - traces: 'getEventType() == "TRACE"'
    - logs: 'getEventType() == "LOG"'
    - metrics: 'getEventType() == "METRIC"'
  sink:
    - opensearch:
        routes:
          - logs
        hosts: [ "https://opensearch:9200" ]
        index: logs-%{yyyy.MM.dd}
        username: admin
        password: yourStrongPassword123!
        insecure: true
    - pipeline:
        name: traces-raw
        routes:
          - traces
    - pipeline:
        name: otel-metrics
        routes:
          - metrics

traces-raw:
  source:
    pipeline:
      name: otel-telemetry
  processor:
    - otel_trace_raw:
  sink:
    - opensearch:
        hosts: [ "https://opensearch:9200" ]
        index_type: trace-analytics-raw
        username: admin
        password: yourStrongPassword123!
        insecure: true

otel-metrics:
  source:
    pipeline:
      name: otel-telemetry
  processor:
    - otel_metrics:
        calculate_histogram_buckets: true
        calculate_exponential_histogram_buckets: true
        exponential_histogram_max_allowed_scale: 10
        flatten_attributes: false
  sink:
    - opensearch:
        hosts: [ "https://opensearch:9200" ]
        index: metrics-otel-%{yyyy.MM.dd}
        username: admin
        password: yourStrongPassword123!
        insecure: true
```
{% include copy.html %}

### Using OpenSearch output format

To generate data in the OpenSearch format for all telemetry signals, specify the following settings:

```yaml
source:
  otlp:
    output_format: opensearch
```
{% include copy.html %}

To use different output formats for different signal types, specify the following settings:

```yaml
source:
  otlp:
    logs_output_format: opensearch
    metrics_output_format: otel
    traces_output_format: opensearch
```
{% include copy.html %}

### Configuring with SSL/TLS

To enable SSL/TLS with local certificates, specify the following settings:

```yaml
source:
  otlp:
    ssl: true
    ssl_certificate_file: "/path/to/certificate.crt"
    ssl_key_file: "/path/to/private-key.key"
```
{% include copy.html %}

To use the ACM, specify the following settings:

```yaml
source:
  otlp:
    ssl: true
    use_acm_cert_for_ssl: true
    acm_certificate_arn: "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"
    aws_region: "us-east-1"
```
{% include copy.html %}

## Metrics

The `otlp` source includes the following metrics for monitoring its performance and health.

### Counters

The following counters track request activity and errors in the `otlp` source.

| Metric | Description |
| :--- | :--- |
| `requestTimeouts` | The total number of requests that timed out. |
| `requestsReceived` | The total number of requests received by the `otlp` source. |
| `successRequests` | The total number of requests successfully processed by the `otlp` source. |
| `badRequests` | The total number of requests with an invalid format processed by the `otlp` source. |
| `requestsTooLarge` | The total number of requests that exceed the maximum allowed size. |
| `internalServerError` | The total number of requests processed by the `otlp` source with custom exception types. |

### Timers

The following timers track request activity and errors in the `otlp` source.

| Metric | Description |
| :--- | :--- |
| `requestProcessDuration` | The latency of requests processed by the `otlp` source, in seconds. |

### Distribution summaries

The following distribution summaries track request activity and errors in the `otlp` source.

| Metric | Description |
| :--- | :--- |
| `payloadSize` | The distribution of incoming request payload sizes, in bytes. |

## Migrating from individual OpenTelemetry sources

If you're using separate `otel_logs_source`, `otel_metrics_source`, or `otel_trace_source` sources, you can migrate to the unified `otlp` source by following these steps:

1. Replace all three sources with a single `otlp` source.
2. Use [routing configuration](#routing-telemetry-signals) to direct different signal types to their appropriate pipelines.
3. Change the port numbers if needed (the `otlp` source uses port `21893` by default).

### Migration example

The following example demonstrates how to consolidate separate OpenTelemetry log, metric, and trace sources into a single `otlp` source.

Consider a setup where logs, metrics, and traces are configured separately:

```yaml
logs-pipeline:
  source:
    otel_logs_source:
      port: 21892
  sink:
    - opensearch:
        index: logs
```
```yaml
metrics-pipeline:
  source:
    otel_metrics_source:
      port: 21891
  sink:
    - opensearch:
        index: metrics
```
```yaml
traces-pipeline:
  source:
    otel_trace_source:
      port: 21890
  sink:
    - opensearch:
        index: traces
```

You can consolidate logs, metrics, and traces into a single `otlp` source as follows:

```yaml
otlp-pipeline:
  source:
    otlp:
      port: 21893
  route:
    - logs: 'getEventType() == "LOG"'
    - metrics: 'getEventType() == "METRIC"'
    - traces: 'getEventType() == "TRACE"'
  sink:
    - opensearch:
        routes: 
          - logs
        index: logs
    - opensearch:
        routes:
          - metrics
        index: metrics
    - opensearch:
        routes:
          - traces
        index: traces
```
{% include copy.html %}

## Related documentation

- [OTel logs source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/otel-logs-source/)
- [OTel metrics source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/otel-metrics-source/)
- [OTel trace source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/otel-trace-source/)
- [getEventType()]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/get-eventtype/)