---
layout: default
title: OTel metrics
parent: Sources
grand_parent: Pipelines
nav_order: 70
---

# OTel metrics source

The `otel_metrics_source` is an OpenTelemetry Collector source that collects metric data. The following table describes options you can use to configure the `otel_metrics_source` source. 

## Configuration

You can configure the `otel_metrics_source` source with the following options. 

Option | Required | Type | Description
:--- | :--- | :--- | :---
`port` | No | Integer | The port that the OpenTelemtry metrics source runs on. Default value is `21891`.
`request_timeout` | No | Integer | The request timeout, in milliseconds. Default value is `10000`.
`health_check_service` | No | Boolean | Enables a gRPC health check service under `grpc.health.v1/Health/Check`. Default value is `false`.
`unauthenticated_health_check` | No | Boolean | Determines whether or not authentication is required on the health check endpoint. OpenSearch Data Prepper ignores this option if no authentication is defined. Default value is `false`.
`proto_reflection_service` | No | Boolean | Enables a reflection service for Protobuf services (see [gRPC reflection](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) and [gRPC Server Reflection Tutorial](https://github.com/grpc/grpc-java/blob/master/documentation/server-reflection-tutorial.md) docs). Default value is `false`.
`unframed_requests` | No | Boolean | Enables requests not framed using the gRPC wire protocol.
`thread_count` | No | Integer | The number of threads to keep in the `ScheduledThreadPool`. Default value is `200`.
`max_connection_count` | No | Integer | The maximum allowed number of open connections. Default value is `500`.
| `output_format` | String | Specifies the output format of the generated events. Valid values are `otel` or `opensearch`. Default is `opensearch`. |
`max_request_length` | No | ByteCount | The maximum number of bytes allowed in the payload of a single gRPC or HTTP request. Default value is `10mb`.
`path` | No | String | A custom path for the metrics export service, for example, `/v1/metrics`. Must start with `/`. When set, the source receives gRPC and unframed requests at this path, and the default `/opentelemetry.proto.collector.metrics.v1.MetricsService/Export` path is disabled. The path can contain a `${pipelineName}` placeholder, which is replaced with the pipeline name.
`compression` | No | String | The compression type applied to the client request payload. Valid values are `none` and `gzip`. Use `gzip` to apply gzip decompression to the incoming request. Default is `none`.
`retry_info` | No | Object | Configures the retry delay that the source returns to clients in `RESOURCE_EXHAUSTED` responses, for example, when the buffer is full or a request times out. Supports the `min_delay` (default `100ms`) and `max_delay` (default `2s`) options. The suggested delay starts at `min_delay` and doubles with each consecutive rejection, up to `max_delay`.
`partition_keys` | No | List | The keys used to split each request into partitions when the pipeline uses a buffer that stores raw bytes, such as the `kafka` buffer. Valid values are `name` and `service_name`. The list must contain `name` and can also contain `service_name`. The source then writes metrics to the buffer partitioned by metric name or by service and metric name.
`ssl` | No | Boolean | Enables connections to the OpenTelemetry source port over TLS/SSL. Default value is `true`.
`sslKeyCertChainFile` | Conditionally | String | File-system path or Amazon Simple Storage Service (Amazon S3) path to the security certificate (for example, `"config/demo-data-prepper.crt"` or `"s3://my-secrets-bucket/demo-data-prepper.crt"`). Required if `ssl` is set to `true`.
`sslKeyFile` | Conditionally | String | File-system path or Amazon S3 path to the security key (for example, `"config/demo-data-prepper.key"` or `"s3://my-secrets-bucket/demo-data-prepper.key"`). Required if `ssl` is set to `true`.
`useAcmCertForSSL` | No | Boolean | Whether to enable TLS/SSL using a certificate and private key from AWS Certificate Manager (ACM). Default value is `false`.
`acmCertificateArn` | Conditionally | String | Represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificates. Required if `useAcmCertForSSL` is set to `true`.
`acmPrivateKeyPassword` | No | String | The password used to decrypt the private key exported from ACM. If not provided, Data Prepper generates a random password.
`acmCertIssueTimeOutMillis` | No | Integer | The maximum amount of time, in milliseconds, that Data Prepper waits to retrieve the certificate from ACM. Default value is `120000`.
`awsRegion` | Conditionally | String | Represents the AWS Region used by ACM or Amazon S3. Required if `useAcmCertForSSL` is set to `true` or `sslKeyCertChainFile` and `sslKeyFile` is the Amazon S3 path.
`authentication` | No | Object | An authentication configuration. By default, an unauthenticated server is created for the pipeline. This uses pluggable authentication for HTTPS. To use basic authentication, define the `http_basic` plugin with a `username` and `password`. To provide customer authentication, use or create a plugin that implements [GrpcAuthenticationProvider](https://github.com/opensearch-project/data-prepper/blob/1.2.0/data-prepper-plugins/armeria-common/src/main/java/com/amazon/dataprepper/armeria/authentication/GrpcAuthenticationProvider.java).

## Usage

To use the `otel-metrics` source, create the following `pipeline.yaml` file with `otel_metrics_source` as the source:

```yaml
source:
    - otel_metrics_source:
```
{% include copy.html %}

To use the OpenTelemetry format for your output, set the `output_format` to `otel`, as shown in the following example:

```yaml
source:
    - otel_metrics_source:
        output_format: otel
```
{% include copy.html %}


## Metrics

The `otel_metrics_source` source includes the following metrics.

### Counters

- `requestTimeouts`: Measures the total number of requests that time out.
- `requestsReceived`: Measures the total number of requests received by the OpenTelemetry metrics source.

