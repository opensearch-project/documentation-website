---
layout: default
title: OTel logs source
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# OTel Logs Source

## Overview

The `OTel logs source` is a source that follows the [OTLP Protocol](https://github.com/open-telemetry/oteps/blob/master/text/0035-opentelemetry-protocol.md) and exports `ExportLogsServiceRequest` records. 

This source supports ```OTLP/grpc```. <!--- Is this a source or a processor?--->


## Configuration

You can configure the `otel_logs_source` source with the following options.

<!--- Convert to table.--->

* port(Optional) => An `int` represents the port OTel logs source is running on. Default is ```21892```.
* path(Optional) => A `String` which represents the path for sending unframed HTTP requests. This can be used for supporting unframed gRPC with HTTP idiomatic path to a configurable path. It should start with `/` and length should be at least 1. `/opentelemetry.proto.collector.logs.v1.LogsService/Export` endpoint will be disabled for both gRPC and HTTP requests if path is configured. Path can contain `${pipelineName}` placeholder which will be replaced with pipeline name.
* request_timeout(Optional) => An `int` represents request timeout in millis. Default is ```10_000```.
* health_check_service(Optional) => A boolean enables a gRPC health check service under ```grpc.health.v1 / Health / Check```. Default is ```false```.
* proto_reflection_service(Optional) => A boolean enables a reflection service for Protobuf services (see [ProtoReflectionService](https://grpc.github.io/grpc-java/javadoc/io/grpc/protobuf/services/ProtoReflectionService.html) and [gRPC reflection](https://github.com/grpc/grpc-java/blob/master/documentation/server-reflection-tutorial.md) docs). Default is ```false```.
* unframed_requests(Optional) => A boolean to enable requests not framed using the gRPC wire protocol. 
* thread_count(Optional) => the number of threads to keep in the ScheduledThreadPool. Default is `200`.
* max_connection_count(Optional) => the maximum allowed number of open connections. Default is `500`.

### SSL

You can configure SSL in the `otel_logs_source` source with the following options.

<!--- Convert to table.--->
Option | Required | Type | Description
:--- | :--- | :--- | :---
* ssl(Optional) => A boolean enables TLS/SSL. Default is ```true```.
* sslKeyCertChainFile(Optional) => A `String` represents the SSL certificate chain file path or AWS S3 path. S3 path example ```s3://<bucketName>/<path>```. Required if ```ssl``` is set to ```true```.
* sslKeyFile(Optional) => A `String` represents the SSL key file path or AWS S3 path. S3 path example ```s3://<bucketName>/<path>```. Required if ```ssl``` is set to ```true```.
* useAcmCertForSSL(Optional) => A boolean enables TLS/SSL using certificate and private key from AWS Certificate Manager (ACM). Default is ```false```.
* acmCertificateArn(Optional) => A `String` represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificate. Required if ```useAcmCertForSSL``` is set to ```true```.
* awsRegion(Optional) => A `String` represents the AWS region to use ACM or S3. Required if ```useAcmCertForSSL``` is set to ```true``` or ```sslKeyCertChainFile``` and ```sslKeyFile``` is ```AWS S3 path```.

## Usage

To get started, create a `pipeline.yaml` file. See the following `YAML` file configuration example:

```
source:
    - otel_logs_source:
```


## Metrics

You can use the following metrics with the `otel_logs_source` source.

### Counter

<!--- Convert to table.--->
Option | Required | Type | Description
:--- | :--- | :--- | :---
- `requestTimeouts`: measures total number of requests that time out.
- `requestsReceived`: measures total number of requests received by Otel logs source.
- `badRequests`: measures total number of requests that could not be parsed.
- `requestsTooLarge`: measures total number of requests that exceed the maximum allowed size. Indicates the size of the data to be written into the buffer is beyond buffer's maximum capacity.
- `internalServerError`: measures total number of requests that are erroneous due to any other reason than requestTimeouts or requestsTooLarge error.
- `successRequests`: measures total number of requests successfully written to the buffer.

<!--- Consolidate the entries below into the table?--->

### Summary
- `payloadSize`: measures the distribution of all incoming payload sizes.

### Timer
- `requestProcessDuration`: measures the duration of request processing.