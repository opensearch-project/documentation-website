---
layout: default
title: otel_logs_source
parent: Sources
grand_parent: Pipelines
nav_order: 25
---

# otel_logs_source

## Overview

`otel_logs_source` is an OpenTelemetry source that follows the [OpenTelemtry Protocol Specification](https://github.com/open-telemetry/oteps/blob/master/text/0035-opentelemetry-protocol.md), receives logs from OpenTelemetry Collector, and receives `ExportLogsServiceRequest` records to process through a Data Prepper pipeline.

This source supports the `OTLP/gRPC` protocol.
{: .note}

## Configuration

You can configure the `otel_logs_source` source with the following options. 

| Option | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| port | No | `21892` | An `int` that represents the port that the `OTel logs source` is running on. |
| path | No | N/A | A `String` that represents the path for sending unframed HTTP requests. This can be used for supporting unframed gRPC with HTTP idiomatic path to a configurable path. It should start with `/` and length should be at least 1. `/opentelemetry.proto.collector.logs.v1.LogsService/Export` endpoint will be disabled for both gRPC and HTTP requests if path is configured. Path can contain `${pipelineName}` placeholder which will be replaced with pipeline name.  If the value is empty and `unframed_requests` is `true`, then the path that the source provides is `/opentelemetry.proto.collector.logs.v1.LogsService/Export`. | 
| request_timeout | No | `10,000` | An `int` that represents the request timeout duration in milliseconds. |
| health_check_service | No | `false` | A boolean that enables the gRPC health check service under `grpc.health.v1/Health/Check`. |
| proto_reflection_service | No | `false` | A boolean that enables a reflection service for Protobuf services (see [ProtoReflectionService](https://grpc.github.io/grpc-java/javadoc/io/grpc/protobuf/services/ProtoReflectionService.html) and [gRPC reflection](https://github.com/grpc/grpc-java/blob/master/documentation/server-reflection-tutorial.md) documents). |
| unframed_requests | No | `false ` | A `boolean` that enables requests which are not framed using the gRPC wire protocol. |
| thread_count(Optional) | No | `500` | The number of threads to keep in the `ScheduledThreadPool`. |
| max_connection_count | No | `500` | The maximum number of open connections allowed. |

### SSL

You can configure SSL in the `otel_logs_source` source with the following options.

| Option | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| ssl | No | `true` | A boolean that enables TLS/SSL. |
| sslKeyCertChainFile | Yes, if `ssl` is set to `true`. | A `string` that represents the SSL certificate chain file path or AWS S3 path. S3 path example `s3://<bucketName>/<path>`. |
| sslKeyFile | Yes, if `ssl` is set to `true`. | A `string` that represents the SSL key file path or AWS S3 path. S3 path example `s3://<bucketName>/<path>`. |
| useAcmCertForSSL | No | `false` | A boolean enables TLS/SSL using certificate and private key from AWS Certificate Manager (ACM). |
| acmCertificateArn | No | Yes, if `useAcmCertForSSL` is set to `true`. | A `string` that represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificate. |
| awsRegion | Yes, if `useAcmCertForSSL` is set to `true` or `sslKeyCertChainFile` and `sslKeyFile` is `AWS S3 path` | N/A. Must be provided. | A `string` that represents the AWS region to use ACM or S3. |

## Usage

To get started, create a `pipeline.yaml` file. See the following `YAML` file configuration example:

```
source:
    - otel_logs_source:
```

## Metrics

You can use the following metrics with the `otel_logs_source` source.

| Option | Type | Description |
| :--- | :--- | :--- | 
| `requestTimeouts` | Counter | Measures the total number of requests that time out. | 
| `requestsReceived` | Counter | Measures the total number of requests received by Otel logs source. |
| `badRequests` | Counter | Measures the total number of requests that could not be parsed. |
| `requestsTooLarge` | Counter | Measures the total number of requests that exceed the maximum allowed size. Indicates the size of the data to be written into the buffer is beyond buffer's maximum capacity. |
| `internalServerError` | Counter | Measures the total number of requests that are erroneous due to any other reason than requestTimeouts or requestsTooLarge error. |
| `successRequests` | Counter | Measures the total number of requests successfully written to the buffer. |
| `payloadSize` | Distribution summary | Measures the distribution of all incoming payload sizes. |
| `requestProcessDuration` | Timer | Measures the duration of request processing. |