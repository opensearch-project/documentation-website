---
layout: default
title: otel_trace_source source
parent: Sources
grand_parent: Pipelines
nav_order: 15
---


# otel_trace source 

## Overview

Source for the OpenTelemetry Collector.

Option | Required | Type | Description
:--- | :--- | :--- | :---
port | No | Integer | The port OTel trace source is running on. Default value is `21890`.
request_timeout | No | Integer | The request timeout in milliseconds. Default value is `10_000`.
health_check_service | No | Boolean | Enables a gRPC health check service under `grpc.health.v1/Health/Check`. Default value is `false`.
unauthenticated_health_check | No | Boolean | Determines whether or not authentication is required on the health check endpoint. Data Prepper ignores this option if no authentication is defined. Default value is `false`.
proto_reflection_service | No | Boolean | Enables a reflection service for Protobuf services (see [gRPC reflection](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) and [gRPC Server Reflection Tutorial](https://github.com/grpc/grpc-java/blob/master/documentation/server-reflection-tutorial.md) docs). Default value is `false`.
unframed_requests | No | Boolean | Enable requests not framed using the gRPC wire protocol.
thread_count | No | Integer | The number of threads to keep in the ScheduledThreadPool. Default value is `200`.
max_connection_count | No | Integer | The maximum allowed number of open connections. Default value is `500`.
ssl | No | Boolean | Enables connections to the OTel source port over TLS/SSL. Defaults to `true`.
sslKeyCertChainFile | Conditionally | String | File-system path or AWS S3 path to the security certificate (e.g. `"config/demo-data-prepper.crt"` or `"s3://my-secrets-bucket/demo-data-prepper.crt"`). Required if `ssl` is set to `true`.
sslKeyFile | Conditionally | String | File-system path or AWS S3 path to the security key (e.g. `"config/demo-data-prepper.key"` or `"s3://my-secrets-bucket/demo-data-prepper.key"`). Required if `ssl` is set to `true`.
useAcmCertForSSL | No | Boolean | Whether to enable TLS/SSL using certificate and private key from AWS Certificate Manager (ACM). Default value is `false`.
acmCertificateArn | Conditionally | String | Represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificate. Required if `useAcmCertForSSL` is set to `true`.
awsRegion | Conditionally | String | Represents the AWS region to use ACM or S3. Required if `useAcmCertForSSL` is set to `true` or `sslKeyCertChainFile` and `sslKeyFile` are AWS S3 paths.
authentication | No | Object | An authentication configuration. By default, an unauthenticated server is created for the pipeline. This parameter uses pluggable authentication for HTTPS. To use basic authentication, define the `http_basic` plugin with a `username` and `password`. To provide customer authentication, use or create a plugin that implements [GrpcAuthenticationProvider](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/armeria-common/src/main/java/com/amazon/dataprepper/armeria/authentication/GrpcAuthenticationProvider.java).

<!--- ## Configuration

Content will be added to this section.--->

## Metrics

### Counter
- `requestTimeouts`: measures total number of requests that time out.
- `requestsReceived`: measures total number of requests received by otel trace source.
- `successRequests`: measures total number of requests successfully processed by otel trace source plugin.
- `badRequests`: measures total number of requests with invalid format processed by otel trace source plugin.
- `requestsTooLarge`: measures total number of requests of which the number of spans in the content is larger than the buffer capacity.
- `internalServerError`: measures total number of requests processed by otel trace source with custom exception type.

### Timer
- `requestProcessDuration`: measures latency of requests processed by otel trace source plugin in seconds.

### Distribution Summary
- `payloadSize`: measures the distribution of incoming requests payload sizes in bytes.