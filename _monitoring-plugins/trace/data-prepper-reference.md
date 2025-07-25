---
layout: default
title: Configuration reference
parent: Trace analytics
nav_order: 25
canonical_url: https://docs.opensearch.org/latest/data-prepper/managing-data-prepper/configuring-data-prepper/
redirect_to: https://docs.opensearch.org/latest/data-prepper/managing-data-prepper/configuring-data-prepper/
nav_exclude: true
---

# Data Prepper configuration reference

This page lists all supported Data Prepper sources, buffers, preppers, and sinks, along with their associated options. For example configuration files, see [Data Prepper]({{site.url}}{{site.baseurl}}/monitoring-plugins/trace/data-prepper/).


## Data Prepper server options

Option | Required | Description
:--- | :--- | :---
ssl | No | Boolean, indicating whether TLS should be used for server APIs. Defaults to true.
keyStoreFilePath | No | String, path to a .jks or .p12 keystore file. Required if ssl is true.
keyStorePassword | No | String, password for keystore. Optional, defaults to empty string.
privateKeyPassword | No | String, password for private key within keystore. Optional, defaults to empty string.
serverPort | No | Integer, port number to use for server APIs. Defaults to 4900


## General pipeline options

Option | Required | Description
:--- | :--- | :---
workers | No | Integer, default 1. Essentially the number of application threads. As a starting point for your use case, try setting this value to the number of CPU cores on the machine.
delay | No | Integer (milliseconds), default 3,000. How long workers wait between buffer read attempts.


## Sources

Sources define where your data comes from.


### otel_trace_source

Source for the OpenTelemetry Collector.

Option | Required | Description
:--- | :--- | :---
port | No | Integer, the port OTel trace source is running on. Default is `21890`.
request_timeout | No | Integer, the request timeout in millis. Default is `10_000`.
health_check_service | No | Boolean, enables a gRPC health check service under `grpc.health.v1/Health/Check`. Default is `false`.
proto_reflection_service | No | Boolean, enables a reflection service for Protobuf services (see [gRPC reflection](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) and [gRPC Server Reflection Tutorial](https://github.com/grpc/grpc-java/blob/master/documentation/server-reflection-tutorial.md) docs). Default is `false`.
unframed_requests | No | Boolean, enable requests not framed using the gRPC wire protocol.
thread_count | No | Integer, the number of threads to keep in the ScheduledThreadPool. Default is `200`.
max_connection_count | No | Integer, the maximum allowed number of open connections. Default is `500`.
ssl | No | Boolean, enables connections to the OTel source port over TLS/SSL. Defaults to `true`.
sslKeyCertChainFile | Conditionally | String, file-system path or AWS S3 path to the security certificate (e.g. `"config/demo-data-prepper.crt"` or `"s3://my-secrets-bucket/demo-data-prepper.crt"`). Required if ssl is set to `true`.
sslKeyFile | Conditionally | String, file-system path or AWS S3 path to the security key (e.g. `"config/demo-data-prepper.key"` or `"s3://my-secrets-bucket/demo-data-prepper.key"`). Required if ssl is set to `true`.
useAcmCertForSSL | No | Boolean, enables TLS/SSL using certificate and private key from AWS Certificate Manager (ACM). Default is `false`.
acmCertificateArn | Conditionally | String, represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificate. Required if `useAcmCertForSSL` is set to `true`.
awsRegion | Conditionally | String, represents the AWS region to use ACM or S3. Required if `useAcmCertForSSL` is set to `true` or `sslKeyCertChainFile` and `sslKeyFile` are AWS S3 paths.


### file

Source for flat file input.

Option | Required | Description
:--- | :--- | :---
path | Yes | String, path to the input file (e.g. `logs/my-log.log`).


### pipeline

Source for reading from another pipeline.

Option | Required | Description
:--- | :--- | :---
name | Yes | String, name of the pipeline to read from.


### stdin

Source for console input. Can be useful for testing. No options.


## Buffers

Buffers store data as it passes through the pipeline. If you implement a custom buffer, it can be memory-based (better performance) or disk-based (larger).


### bounded_blocking

The default buffer. Memory-based.

Option | Required | Description
:--- | :--- | :---
buffer_size | No | Integer, default 512. The maximum number of records the buffer accepts.
batch_size | No | Integer, default 8. The maximum number of records the buffer drains after each read.


## Preppers

Preppers perform some action on your data: filter, transform, enrich, etc.


### otel_trace_raw_prepper

Converts OpenTelemetry data to OpenSearch-compatible JSON documents.

Option | Required | Description
:--- | :--- | :---
root_span_flush_delay | No | Integer, representing the time interval in seconds to flush all the root spans in the prepper together with their descendants. Defaults to 30.
trace_flush_interval | No | Integer, representing the time interval in seconds to flush all the descendant spans without any root span. Defaults to 180.


### service_map_stateful

Uses OpenTelemetry data to create a distributed service map for visualization in OpenSearch Dashboards.

Option | Required | Description
:--- | :--- | :---
window_duration | No | Integer, representing the fixed time window in seconds to evaluate service-map relationships. Defaults to 180.

### peer_forwarder

Forwards ExportTraceServiceRequests via gRPC to other Data Prepper instances. Required for operating Data Prepper in a clustered deployment.

Option | Required | Description
:--- | :--- | :---
time_out | No | Integer, forwarded request timeout in seconds. Defaults to 3 seconds.
span_agg_count | No | Integer, batch size for number of spans per request. Defaults to 48.
target_port | No | Integer, the destination port to forward requests to. Defaults to `21890`.
discovery_mode | No | String, peer discovery mode to be used. Allowable values are `static`, `dns`, and `aws_cloud_map`. Defaults to `static`.
static_endpoints | No | List, containing string endpoints of all Data Prepper instances.
domain_name | No | String, single domain name to query DNS against. Typically used by creating multiple DNS A Records for the same domain.
ssl | No | Boolean, indicating whether TLS should be used. Default is true.
awsCloudMapNamespaceName | Conditionally | String, name of your CloudMap Namespace. Required if `discovery_mode` is set to `aws_cloud_map`.
awsCloudMapServiceName | Conditionally | String, service name within your CloudMap Namespace. Required if `discovery_mode` is set to `aws_cloud_map`.
sslKeyCertChainFile | Conditionally | String, represents the SSL certificate chain file path or AWS S3 path. S3 path example `s3://<bucketName>/<path>`. Required if `ssl` is set to `true`.
useAcmCertForSSL | No | Boolean, enables TLS/SSL using certificate and private key from AWS Certificate Manager (ACM). Default is `false`.
awsRegion | Conditionally | String, represents the AWS region to use ACM, S3, or CloudMap. Required if `useAcmCertForSSL` is set to `true` or `sslKeyCertChainFile` and `sslKeyFile` are AWS S3 paths.
acmCertificateArn | Conditionally | String represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificate. Required if `useAcmCertForSSL` is set to `true`.

### string_converter

Converts strings to uppercase or lowercase. Mostly useful as an example if you want to develop your own prepper.

Option | Required | Description
:--- | :--- | :---
upper_case | No | Boolean, whether to convert to uppercase (`true`) or lowercase (`false`).


## Sinks

Sinks define where Data Prepper writes your data to.


### opensearch

Sink for an OpenSearch cluster.

Option | Required | Description
:--- | :--- | :---
hosts | Yes | List of OpenSearch hosts to write to (e.g. `["https://localhost:9200", "https://remote-cluster:9200"]`).
cert | No | String, path to the security certificate (e.g. `"config/root-ca.pem"`) if the cluster uses the OpenSearch security plugin.
username | No | String, username for HTTP basic authentication.
password | No | String, password for HTTP basic authentication.
aws_sigv4 | No | Boolean, whether to use IAM signing to connect to an Amazon OpenSearch Service domain. For your access key, secret key, and optional session token, Data Prepper uses the default credential chain (environment variables, Java system properties, `~/.aws/credential`, etc.).
aws_region | No | String, AWS region (e.g. `"us-east-1"`) for the domain if you are connecting to Amazon OpenSearch Service.
aws_sts_role | No | String, IAM role which the sink plugin will assume to sign request to Amazon OpenSearch Service. If not provided the plugin will use the default credentials.
trace_analytics_raw | No | Boolean, default false. Whether to export as trace data to the `otel-v1-apm-span-*` index pattern (alias `otel-v1-apm-span`) for use with the Trace Analytics OpenSearch Dashboards plugin.
trace_analytics_service_map | No | Boolean, default false. Whether to export as trace data to the `otel-v1-apm-service-map` index for use with the service map component of the Trace Analytics OpenSearch Dashboards plugin.
index | No | String, name of the index to export to. Only required if you don't use the `trace_analytics_raw` or `trace_analytics_service_map` presets.
template_file | No | String, the path to a JSON [index template]({{site.url}}{{site.baseurl}}/opensearch/index-templates/) file (e.g. `/your/local/template-file.json` if you do not use the `trace_analytics_raw` or `trace_analytics_service_map`. See [otel-v1-apm-span-index-template.json](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/opensearch/src/main/resources/otel-v1-apm-span-index-template.json) for an example.
document_id_field | No | String, the field from the source data to use for the OpenSearch document ID (e.g. `"my-field"`) if you don't use the `trace_analytics_raw` or `trace_analytics_service_map` presets.
dlq_file | No | String, the path to your preferred dead letter queue file (e.g. `/your/local/dlq-file`). Data Prepper writes to this file when it fails to index a document on the OpenSearch cluster.
bulk_size | No | Integer (long), default 5. The maximum size (in MiB) of bulk requests to the OpenSearch cluster. Values below 0 indicate an unlimited size. If a single document exceeds the maximum bulk request size, Data Prepper sends it individually.


### file

Sink for flat file output.

Option | Required | Description
:--- | :--- | :---
path | Yes | String, path for the output file (e.g. `logs/my-transformed-log.log`).


### pipeline

Sink for writing to another pipeline.

Option | Required | Description
:--- | :--- | :---
name | Yes | String, name of the pipeline to write to.


### stdout

Sink for console output. Can be useful for testing. No options.
