---
layout: default
title: OTel logs source
parent: Sources
grand_parent: Pipelines
nav_order: 25
---

# OTel logs source


The OTel logs source is an OpenTelemetry source that follows the [OpenTelemetry Protocol Specification](https://github.com/open-telemetry/oteps/blob/master/text/0035-opentelemetry-protocol.md), receives logs from the OTel Collector in the form of `ExportLogsServiceRequest` records.

This source supports the `OTLP/gRPC` protocol.
{: .note}

## Configuration

You can configure the OTel logs source with the following options. 

| Option | Type | Description |
| :--- | :--- | :--- |
| port | int | Represents the port that the OTel logs source is running on. Default value is `21892`. |
| path | string | Represents the path for sending unframed HTTP requests. This can be used for supporting unframed gRPC requests with an HTTP idiomatic path that routes to a configurable path. It should start with `/` and length should be at least 1. When a path is configured, the `/opentelemetry.proto.collector.logs.v1.LogsService/Export` endpoint does not receive both gRPC and HTTP requests. Path can contain a `${pipelineName}` placeholder, which when not replaced, defaults to the current pipeline name.  If the value is empty and `unframed_requests` is `true`, then the source provides `/opentelemetry.proto.collector.logs.v1.LogsService/Export` as the path.  | 
| request_timeout | int | Represents the request timeout duration in milliseconds. Default value is `10,000`. |
| health_check_service | Boolean | Enables the gRPC health check service under `grpc.health.v1/Health/Check`. Default value is `false`. |
| proto_reflection_service | Boolean | Enables a reflection service for Protobuf services (see [ProtoReflectionService](https://grpc.github.io/grpc-java/javadoc/io/grpc/protobuf/services/ProtoReflectionService.html) and [gRPC reflection](https://github.com/grpc/grpc-java/blob/master/documentation/server-reflection-tutorial.md) documents). Default value is `false`. |
| unframed_requests | Boolean | Enables requests which are not framed using the gRPC wire protocol. Default value is `false`. |
| thread_count  | int | The number of threads to keep in the `ScheduledThreadPool`. Default value is `500`. |
| max_connection_count | int | The maximum number of open connections allowed. Default value is `500`. |

### SSL

You can configure SSL in the `otel_logs_source` source with the following options.

| Option | Type | Description |
| :--- | :--- | :--- |
| ssl | Boolean | Enables TLS/SSL. Default value is `true`. |
| sslKeyCertChainFile | string | Represents the SSL certificate chain file path or AWS S3 path. For example, see the S3 path `s3://<bucketName>/<path>`. Required if `ssl` is set to `true`. There is no default value. |
| sslKeyFile | string | Represents the SSL key file path or AWS S3 path. For example, see the S3 path: `s3://<bucketName>/<path>`. Required if `ssl` is set to `true`. There is no default value. |
| useAcmCertForSSL | Boolean | Enables TLS/SSL using certificate and private key from AWS Certificate Manager (ACM). Default value is `false`. |
| acmCertificateArn | string | Represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificate. Required if `useAcmCertForSSL` is set to `true`. |
| awsRegion | string | Represents the AWS region to use ACM or S3.  Required if `useAcmCertForSSL` is set to `true` or `sslKeyCertChainFile` and `sslKeyFile` is AWS S3 path. |

## Usage

To get started, create a `pipeline.yaml` file and add `otel_logs_source` as source:

```
source:
    - otel_logs_source:
```

## Metrics

You can use the following metrics with the `otel_logs_source` source.

| Option | Type | Description |
| :--- | :--- | :--- | 
| `requestTimeouts` | Counter | Measures the total number of requests that time out. | 
| `requestsReceived` | Counter | Measures the total number of requests received by OTel logs source. |
| `badRequests` | Counter | Measures the total number of requests that could not be parsed. |
| `requestsTooLarge` | Counter | Measures the total number of requests that exceed the maximum allowed size. Indicates the size of the data to be written into the buffer is beyond buffer's maximum capacity. |
| `internalServerError` | Counter | Measures the total number of requests that are erroneous due to any other reason than requestTimeouts or requestsTooLarge error. |
| `successRequests` | Counter | Measures the total number of requests successfully written to the buffer. |
| `payloadSize` | Distribution summary | Measures the distribution of all incoming payload sizes. |
| `requestProcessDuration` | Timer | Measures the duration of request processing. |