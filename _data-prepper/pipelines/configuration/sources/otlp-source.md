---
layout: default
title: OTLP source
parent: Sources
grand_parent: Pipelines
nav_order: 85
---

# OTLP source

The `otlp` source is a unified OpenTelemetry source that follows the [OpenTelemetry Protocol (OTLP) Specification](https://opentelemetry.io/docs/specs/otlp/) and can receive logs, metrics, and traces through a single endpoint. This source consolidates the functionality of the individual `otel_logs_source`, `otel_metrics_source`, and `otel_trace_source` sources, providing a streamlined approach to ingesting all OpenTelemetry telemetry signals.

The OTLP source supports both the `OTLP/gRPC` and `OTLP/HTTP` protocols. For `OTLP/HTTP`, only Protobuf encoding is currently supported. This makes it compatible with a wide range of OpenTelemetry collectors and instrumentation libraries.
{: .note}

## Configuration

You can configure the `otlp` source with the following options.

| Option | Type | Description |
| :--- | :--- | :--- |
| `port` | Integer | The port on which the OTLP source listens. Default value is `21893`. |
| `logs_path` | String | The path for sending unframed HTTP requests for logs. Must start with `/` and have a minimum length of 1. Default value is `/opentelemetry.proto.collector.logs.v1.LogsService/Export`. |
| `metrics_path` | String | The path for sending unframed HTTP requests for metrics. Must start with `/` and have a minimum length of 1. Default value is `/opentelemetry.proto.collector.metrics.v1.MetricsService/Export`. |
| `traces_path` | String | The path for sending unframed HTTP requests for traces. Must start with `/` and have a minimum length of 1. Default value is `/opentelemetry.proto.collector.trace.v1.TraceService/Export`. |
| `request_timeout` | Integer | The request timeout duration in milliseconds. Default value is `10000`. |
| `health_check_service` | Boolean | Enables a gRPC health check service under `grpc.health.v1.Health/Check`. When `unframed_requests` is also `true`, enables HTTP health check at `/health`. Default value is `false`. |
| `proto_reflection_service` | Boolean | Enables a reflection service for Protobuf services (see [ProtoReflectionService](https://grpc.github.io/grpc-java/javadoc/io/grpc/protobuf/services/ProtoReflectionService.html) and [gRPC reflection](https://github.com/grpc/grpc-java/blob/master/documentation/server-reflection-tutorial.md)). Default value is `false`. |
| `unframed_requests` | Boolean | Enables requests not framed using the gRPC wire protocol. Default value is `false`. |
| `thread_count` | Integer | The number of threads to keep in the ScheduledThreadPool. Default value is `200`. |
| `max_connection_count` | Integer | The maximum allowed number of open connections. Default value is `500`. |
| `max_request_length` | String | The maximum number of bytes allowed in the payload of a single gRPC or HTTP request. Default value is `10mb`. |
| `compression` | String | The compression type applied on the client request payload. Valid values are `none` (no compression) or `gzip` (apply GZip decompression). Default value is `none`. |
| `output_format` | String | Specifies the decoded output format for all signals (logs, metrics, traces) if individual output format options are not set. Valid values are `otel` (OpenTelemetry format) or `opensearch` (OpenSearch format). Default value is `otel`. |
| `logs_output_format` | String | Specifies the decoded output format specifically for logs. Takes precedence over `output_format` for logs. Valid values are `otel` or `opensearch`. Default value is `otel`. |
| `metrics_output_format` | String | Specifies the decoded output format specifically for metrics. Takes precedence over `output_format` for metrics. Valid values are `otel` or `opensearch`. Default value is `otel`. |
| `traces_output_format` | String | Specifies the decoded output format specifically for traces. Takes precedence over `output_format` for traces. Valid values are `otel` or `opensearch`. Default value is `otel`. |

If an individual output format (for example, `logs_output_format`) is set, it takes precedence over the generic `output_format` for that signal type. If neither is set, the default is `otel`.
{: .note}

### SSL/TLS configuration

You can configure SSL/TLS in the `otlp` source with the following options.

| Option | Type | Description |
| :--- | :--- | :--- |
| `ssl` | Boolean | Enables TLS/SSL. Default value is `true`. |
| `sslKeyCertChainFile` | String | Represents the SSL certificate chain file path or Amazon Simple Storage Service (Amazon S3) path. For example, see the Amazon S3 path `s3://<bucketName>/<path>`. Required if `ssl` is set to `true`. |
| `sslKeyFile` | String | Represents the SSL key file path or Amazon S3 path. For example, see the Amazon S3 path `s3://<bucketName>/<path>`. Required if `ssl` is set to `true`. |
| `useAcmCertForSSL` | Boolean | Enables TLS/SSL using a certificate and private key from AWS Certificate Manager (ACM). Default value is `false`. |
| `acmCertificateArn` | String | Represents the ACM certificate Amazon Resource Name (ARN). ACM certificates take precedence over Amazon S3 or local file system certificates. Required if `useAcmCertForSSL` is set to `true`. |
| `awsRegion` | String | Represents the AWS Region used by ACM or Amazon S3. Required if `useAcmCertForSSL` is set to `true` or if `sslKeyCertChainFile` and `sslKeyFile` are Amazon S3 paths. |

### Authentication configuration

By default, the OTLP source runs without authentication. You can configure authentication using the following options.

You can explicitly disable authentication with:

```yaml
source:
  otlp:
    authentication:
      unauthenticated:
```
{% include copy.html %}

To enable HTTP Basic authentication:

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

Data Prepper replies with a `RetryInfo` object specifying how long to wait for the next request when backpressure builds up. The retry information implements exponential backoff with a configurable maximum delay.

```yaml
source:
  otlp:
    retry_info:
      min_delay: 100ms  # defaults to 100ms
      max_delay: 2s     # defaults to 2s
```
{% include copy.html %}

## Usage

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

One of the key features of the OTLP source is the ability to route different telemetry signals (logs, metrics, traces) to different processors or sinks based on specific needs. The routing uses metadata-based routing with the `getEventType()` function.

```yaml
otel-telemetry-pipeline:
  source:
    otlp:
      ssl: false
  route:
    - logs: 'getEventType() == "LOG"'
    - traces: 'getEventType() == "TRACE"'
    - metrics: 'getEventType() == "METRIC"'
  sink:
    - pipeline:
        name: "logs-pipeline"
        routes:
          - "logs"
    - pipeline:
        name: "traces-pipeline"
        routes:
          - "traces"
    - pipeline:
        name: "metrics-pipeline"
        routes:
          - "metrics"

logs-pipeline:
  source:
    pipeline:
      name: "otel-telemetry-pipeline"
  processor:
    # Add logs-specific processors here
  sink:
    - opensearch:
        index: "logs-index"

traces-pipeline:
  source:
    pipeline:
      name: "otel-telemetry-pipeline"
  processor:
    # Add traces-specific processors here
  sink:
    - opensearch:
        index: "traces-index"

metrics-pipeline:
  source:
    pipeline:
      name: "otel-telemetry-pipeline"
  processor:
    # Add metrics-specific processors here
  sink:
    - opensearch:
        index: "metrics-index"
```
{% include copy.html %}

### Using OpenSearch output format

To generate data in the OpenSearch format for all telemetry signals:

```yaml
source:
  otlp:
    output_format: opensearch
```
{% include copy.html %}

To use different output formats for different signal types:

```yaml
source:
  otlp:
    logs_output_format: opensearch
    metrics_output_format: otel
    traces_output_format: opensearch
```
{% include copy.html %}

### Configuring with SSL/TLS

To enable SSL/TLS with local certificates:

```yaml
source:
  otlp:
    ssl: true
    sslKeyCertChainFile: "/path/to/certificate.crt"
    sslKeyFile: "/path/to/private-key.key"
```
{% include copy.html %}

To use AWS Certificate Manager:

```yaml
source:
  otlp:
    ssl: true
    useAcmCertForSSL: true
    acmCertificateArn: "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"
    awsRegion: "us-east-1"
```
{% include copy.html %}

## Metrics

The `otlp` source includes the following metrics to monitor its performance and health.

### Counters

| Metric | Description |
| :--- | :--- |
| `requestTimeouts` | Measures the total number of requests that time out. |
| `requestsReceived` | Measures the total number of requests received by the OTLP source. |
| `successRequests` | Measures the total number of requests successfully processed by the OTLP source. |
| `badRequests` | Measures the total number of requests with invalid format processed by the OTLP source. |
| `requestsTooLarge` | Measures the total number of requests that exceed the maximum allowed size. |
| `internalServerError` | Measures the total number of requests processed by the OTLP source with custom exception types. |

### Timers

| Metric | Description |
| :--- | :--- |
| `requestProcessDuration` | Measures the latency of requests processed by the OTLP source in seconds. |

### Distribution summaries

| Metric | Description |
| :--- | :--- |
| `payloadSize` | Measures the distribution of incoming request payload sizes in bytes. |

## Migration from individual OTel sources

If you're currently using separate `otel_logs_source`, `otel_metrics_source`, or `otel_trace_source` sources, you can migrate to the unified OTLP source by:

1. Replacing all three sources with a single `otlp` source
2. Using the routing configuration shown above to direct different signal types to their appropriate pipelines
3. Adjusting the port numbers if needed (the OTLP source uses port `21893` by default)

The OTLP source provides all the functionality of the individual sources while simplifying configuration and reducing resource usage.