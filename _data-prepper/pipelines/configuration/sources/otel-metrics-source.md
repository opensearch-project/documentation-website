---
layout: default
title: otel_metrics_source
parent: Sources
grand_parent: Pipelines
nav_order: 10
---

# otel_metrics_source

`otel_metrics_source` is an OpenTelemetry Collector source that collects metric data. The following table describes options you can use to configure the `otel_metrics_source` source. 

Option | Required | Type | Description
:--- | :--- | :--- | :---
port | No | Integer | The port that the OpenTelemtry metrics source runs on. Default value is `21891`.
request_timeout | No | Integer | The request timeout, in milliseconds. Default value is `10000`.
health_check_service | No | Boolean | Enables a gRPC health check service under `grpc.health.v1/Health/Check`. Default value is `false`.
proto_reflection_service | No | Boolean | Enables a reflection service for Protobuf services (see [gRPC reflection](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) and [gRPC Server Reflection Tutorial](https://github.com/grpc/grpc-java/blob/master/documentation/server-reflection-tutorial.md) docs). Default value is `false`.
unframed_requests | No | Boolean | Enables requests not framed using the gRPC wire protocol.
thread_count | No | Integer | The number of threads to keep in the `ScheduledThreadPool`. Default value is `200`.
max_connection_count | No | Integer | The maximum allowed number of open connections. Default value is `500`.
ssl | No | Boolean | Enables connections to the OpenTelemetry source port over TLS/SSL. Default value is `true`.
sslKeyCertChainFile | Conditionally | String | File-system path or Amazon Simple Storage Service (Amazon S3) path to the security certificate (for example, `"config/demo-data-prepper.crt"` or `"s3://my-secrets-bucket/demo-data-prepper.crt"`). Required if `ssl` is set to `true`.
sslKeyFile | Conditionally | String | File-system path or Amazon S3 path to the security key (for example, `"config/demo-data-prepper.key"` or `"s3://my-secrets-bucket/demo-data-prepper.key"`). Required if `ssl` is set to `true`.
useAcmCertForSSL | No | Boolean | Whether to enable TLS/SSL using a certificate and private key from AWS Certificate Manager (ACM). Default value is `false`.
acmCertificateArn | Conditionally | String | Represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificates. Required if `useAcmCertForSSL` is set to `true`.
awsRegion | Conditionally | String | Represents the AWS Region used by ACM or Amazon S3. Required if `useAcmCertForSSL` is set to `true` or `sslKeyCertChainFile` and `sslKeyFile` is the Amazon S3 path.
authentication | No | Object | An authentication configuration. By default, an unauthenticated server is created for the pipeline. This uses pluggable authentication for HTTPS. To use basic authentication, define the `http_basic` plugin with a `username` and `password`. To provide customer authentication, use or create a plugin that implements [GrpcAuthenticationProvider](https://github.com/opensearch-project/data-prepper/blob/1.2.0/data-prepper-plugins/armeria-common/src/main/java/com/amazon/dataprepper/armeria/authentication/GrpcAuthenticationProvider.java).

<!--- ## Configuration

Content will be added to this section.--->

## Metrics

The `otel_metrics_source` source includes the following metrics.

### Counters

- `requestTimeouts`: Measures the total number of requests that time out.
- `requestsReceived`: Measures the total number of requests received by the OpenTelemetry metrics source.

