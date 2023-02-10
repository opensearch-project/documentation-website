---
layout: default
title: otel_metrics_source
parent: Sources
grand_parent: Pipelines
nav_order: 10
---

# otel_metrics_source

Source for the OpenTelemetry Collector for collecting metric data.

Option | Required | Type | Description
:--- | :--- | :--- | :---
port | No | Integer | The port OTel metrics source is running on. Default is `21891`.
request_timeout | No | Integer | The request timeout in milliseconds. Default is `10_000`.
health_check_service | No | Boolean | Enables a gRPC health check service under `grpc.health.v1/Health/Check`. Default is `false`.
proto_reflection_service | No | Boolean | Enables a reflection service for Protobuf services (see [gRPC reflection](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) and [gRPC Server Reflection Tutorial](https://github.com/grpc/grpc-java/blob/master/documentation/server-reflection-tutorial.md) docs). Default is `false`.
unframed_requests | No | Boolean | Enable requests not framed using the gRPC wire protocol.
thread_count | No | Integer | The number of threads to keep in the ScheduledThreadPool. Default is `200`.
max_connection_count | No | Integer | The maximum allowed number of open connections. Default is `500`.
ssl | No | Boolean | Enables connections to the OTel source port over TLS/SSL. Defaults to `true`.
sslKeyCertChainFile | Conditionally | String | File-system path or AWS S3 path to the security certificate (e.g. `"config/demo-data-prepper.crt"` or `"s3://my-secrets-bucket/demo-data-prepper.crt"`). Required if `ssl` is set to `true`.
sslKeyFile | Conditionally | String | File-system path or AWS S3 path to the security key (e.g. `"config/demo-data-prepper.key"` or `"s3://my-secrets-bucket/demo-data-prepper.key"`). Required if `ssl` is set to `true`.
useAcmCertForSSL | No | Boolean | Whether to enable TLS/SSL using certificate and private key from AWS Certificate Manager (ACM). Default is `false`.
acmCertificateArn | Conditionally | String | Represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificates. Required if `useAcmCertForSSL` is set to `true`.
awsRegion | Conditionally | String | Represents the AWS Region to use ACM or S3. Required if `useAcmCertForSSL` is set to `true` or `sslKeyCertChainFile` and `sslKeyFile` are AWS S3 paths.
authentication | No | Object | An authentication configuration. By default, an unauthenticated server is created for the pipeline. This uses pluggable authentication for HTTPS. To use basic authentication, define the `http_basic` plugin with a `username` and `password`. To provide customer authentication, use or create a plugin that implements [GrpcAuthenticationProvider](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/armeria-common/src/main/java/org/opensearch/dataprepper/armeria/authentication/GrpcAuthenticationProvider.java).

<!--- ## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section. --->