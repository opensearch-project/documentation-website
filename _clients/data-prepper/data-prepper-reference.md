---
layout: default
title: Configuration reference
parent: Data Prepper
nav_order: 3
canonical_url: https://docs.opensearch.org/latest/data-prepper/managing-data-prepper/configuring-data-prepper/
redirect_to: https://docs.opensearch.org/latest/data-prepper/managing-data-prepper/configuring-data-prepper/
nav_exclude: true
---

# Data Prepper configuration reference

This page lists all supported Data Prepper server, sources, buffers, preppers, and sinks, along with their associated options. For example configuration files, see [Data Prepper]({{site.url}}{{site.baseurl}}/clients/data-prepper/pipelines/).

## Data Prepper server options

Option | Required | Type | Description
:--- | :--- | :--- | :---
ssl | No | Boolean | Indicates whether TLS should be used for server APIs. Defaults to true.
keyStoreFilePath | No | String | Path to a .jks or .p12 keystore file. Required if ssl is true.
keyStorePassword | No | String | Password for keystore. Optional, defaults to empty string.
privateKeyPassword | No | String | Password for private key within keystore. Optional, defaults to empty string.
serverPort | No | Integer | Port number to use for server APIs. Defaults to 4900
metricRegistries | No | List | Metrics registries for publishing the generated metrics. Currently supports Prometheus and CloudWatch. Defaults to Prometheus.

## General pipeline options

Option | Required | Type | Description
:--- | :--- | :--- | :---
workers | No | Integer | Essentially the number of application threads. As a starting point for your use case, try setting this value to the number of CPU cores on the machine. Default is 1.
delay | No | Integer | Amount of time in milliseconds workers wait between buffer read attempts. Default is 3,000.


## Sources

Sources define where your data comes from.


### otel_trace_source

Source for the OpenTelemetry Collector.

Option | Required | Type | Description
:--- | :--- | :--- | :---
port | No | Integer | The port OTel trace source is running on. Default is `21890`.
request_timeout | No | Integer | The request timeout in milliseconds. Default is `10_000`.
health_check_service | No | Boolean | Enables a gRPC health check service under `grpc.health.v1/Health/Check`. Default is `false`.
proto_reflection_service | No | Boolean | Enables a reflection service for Protobuf services (see [gRPC reflection](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) and [gRPC Server Reflection Tutorial](https://github.com/grpc/grpc-java/blob/master/documentation/server-reflection-tutorial.md) docs). Default is `false`.
unframed_requests | No | Boolean | Enable requests not framed using the gRPC wire protocol.
thread_count | No | Integer | The number of threads to keep in the ScheduledThreadPool. Default is `200`.
max_connection_count | No | Integer | The maximum allowed number of open connections. Default is `500`.
ssl | No | Boolea | Enables connections to the OTel source port over TLS/SSL. Defaults to `true`.
sslKeyCertChainFile | Conditionally | String | File-system path or AWS S3 path to the security certificate (e.g. `"config/demo-data-prepper.crt"` or `"s3://my-secrets-bucket/demo-data-prepper.crt"`). Required if ssl is set to `true`.
sslKeyFile | Conditionally | String | File-system path or AWS S3 path to the security key (e.g. `"config/demo-data-prepper.key"` or `"s3://my-secrets-bucket/demo-data-prepper.key"`). Required if ssl is set to `true`.
useAcmCertForSSL | No | Boolean | Whether to enable TLS/SSL using certificate and private key from AWS Certificate Manager (ACM). Default is `false`.
acmCertificateArn | Conditionally | String | Represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificate. Required if `useAcmCertForSSL` is set to `true`.
awsRegion | Conditionally | String | Represents the AWS region to use ACM or S3. Required if `useAcmCertForSSL` is set to `true` or `sslKeyCertChainFile` and `sslKeyFile` are AWS S3 paths.
authentication | No | Object| An authentication configuration. By default, this runs an unauthenticated server. This uses pluggable authentication for HTTPS. To use basic authentication, define the `http_basic` plugin with a `username` and `password`. To provide customer authentication use or create a plugin which implements: [GrpcAuthenticationProvider](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/armeria-common/src/main/java/com/amazon/dataprepper/armeria/authentication/GrpcAuthenticationProvider.java).

### http_source

This is a source plugin that supports HTTP protocol. Currently ONLY support Json UTF-8 codec for incoming request, e.g. `[{"key1": "value1"}, {"key2": "value2"}]`.

Option | Required | Type | Description
:--- | :--- | :--- | :---
port | No | Integer | The port the source is running on. Default is `2021`. Valid options are between `0` and `65535`.
request_timeout | No | Integer | The request timeout in millis. Default is `10_000`.
thread_count | No | Integer | The number of threads to keep in the ScheduledThreadPool. Default is `200`.
max_connection_count | No | Integer | The maximum allowed number of open connections. Default is `500`.
max_pending_requests | No | Integer | The maximum number of allowed tasks in ScheduledThreadPool work queue. Default is `1024`.
authentication | No | Object | An authentication configuration. By default, this runs an unauthenticated server. This uses pluggable authentication for HTTPS. To use basic authentication define the `http_basic` plugin with a `username` and `password`. To provide customer authentication use or create a plugin which implements: [ArmeriaHttpAuthenticationProvider](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/armeria-common/src/main/java/com/amazon/dataprepper/armeria/authentication/ArmeriaHttpAuthenticationProvider.java).

### file

Source for flat file input.

Option | Required | Type | Description
:--- | :--- | :--- | :---
path | Yes | String | Path to the input file (e.g. `logs/my-log.log`).
format | No | String | Format of each line in the file. Valid options are `json` or `plain`. Default is `plain`.
record_type | No | String | The record type that will be stored. Valid options are `string` or `event`. Default is `string`. If you would like to use the file source for log analytics use cases like grok, set this option to `event`.

### pipeline

Source for reading from another pipeline.

Option | Required | Type | Description
:--- | :--- | :--- | :---
name | Yes | String | Name of the pipeline to read from.


### stdin

Source for console input. Can be useful for testing. No options.


## Buffers

Buffers store data as it passes through the pipeline. If you implement a custom buffer, it can be memory-based (better performance) or disk-based (larger).


### bounded_blocking

The default buffer. Memory-based.

Option | Required | Type | Description
:--- | :--- | :--- | :---
buffer_size | No | Integer | The maximum number of records the buffer accepts. Default is 512.
batch_size | No | Integer | The maximum number of records the buffer drains after each read. Default is 8.


## Preppers

Preppers perform some action on your data: filter, transform, enrich, etc.


### otel_trace_raw_prepper

Converts OpenTelemetry data to OpenSearch-compatible JSON documents.

Option | Required | Type | Description
:--- | :--- | :--- | :---
root_span_flush_delay | No | Integer | Represents the time interval in seconds to flush all the root spans in the prepper together with their descendants. Default is 30.
trace_flush_interval | No | Integer | Represents the time interval in seconds to flush all the descendant spans without any root span. Default is 180.


### service_map_stateful

Uses OpenTelemetry data to create a distributed service map for visualization in OpenSearch Dashboards.

Option | Required | Type | Description
:--- | :--- | :--- | :---
window_duration | No | Integer | Represents the fixed time window in seconds to evaluate service-map relationships. Default is 180.

### peer_forwarder

Forwards ExportTraceServiceRequests via gRPC to other Data Prepper instances. Required for operating Data Prepper in a clustered deployment.

Option | Required | Type | Description
:--- | :--- | :--- | :---
time_out | No | Integer | Forwarded request timeout in seconds. Defaults to 3 seconds.
span_agg_count | No | Integer | Batch size for number of spans per request. Defaults to 48.
target_port | No | Integer | The destination port to forward requests to. Defaults to `21890`.
discovery_mode | No | String | Peer discovery mode to be used. Allowable values are `static`, `dns`, and `aws_cloud_map`. Defaults to `static`.
static_endpoints | No | List | List containing string endpoints of all Data Prepper instances.
domain_name | No | String | Single domain name to query DNS against. Typically used by creating multiple DNS A Records for the same domain.
ssl | No | Boolean | Indicates whether TLS should be used. Default is true.
awsCloudMapNamespaceName | Conditionally | String | Name of your CloudMap Namespace. Required if `discovery_mode` is set to `aws_cloud_map`.
awsCloudMapServiceName | Conditionally | String | Service name within your CloudMap Namespace. Required if `discovery_mode` is set to `aws_cloud_map`.
sslKeyCertChainFile | Conditionally | String | Represents the SSL certificate chain file path or AWS S3 path. S3 path example `s3://<bucketName>/<path>`. Required if `ssl` is set to `true`.
useAcmCertForSSL | No | Boolean | Enables TLS/SSL using certificate and private key from AWS Certificate Manager (ACM). Default is `false`.
awsRegion | Conditionally | String | Represents the AWS region to use ACM, S3, or CloudMap. Required if `useAcmCertForSSL` is set to `true` or `sslKeyCertChainFile` and `sslKeyFile` are AWS S3 paths.
acmCertificateArn | Conditionally | String | Represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificate. Required if `useAcmCertForSSL` is set to `true`.

### string_converter

Converts strings to uppercase or lowercase. Mostly useful as an example if you want to develop your own prepper.

Option | Required | Type | Description
:--- | :--- | :--- | :---
upper_case | No | Boolean | Whether to convert to uppercase (`true`) or lowercase (`false`).

### grok_prepper

Takes unstructured data and utilizes pattern matching to structure and extract important keys and make data more structured and queryable.

Option | Required | Type | Description
:--- | :--- | :--- | :---
match | No | Map | Specifies which keys to match specific patterns against. Default is an empty body.
keep_empty_captures | No | Boolean | Enables preserving `null` captures. Default value is `false`.
named_captures_only | No | Boolean | enables whether to keep only named captures. Default value is `true`.
break_on_match | No | Boolean | Specifies wether to match all patterns or stop once the first successful match is found. Default is `true`.
keys_to_overwrite | No | List | Specifies which existing keys are to be overwritten if there is a capture with the same key value. Default is `[]`.
pattern_definitions | No | Map | Allows for custom pattern use inline. Default value is an empty body.
patterns_directories | No | List | Specifies the path of directories that contain customer pattern files. Default value is an empty list.
pattern_files_glob | No | String | Specifies which pattern files to use from the directories specified for `pattern_directories`. Default is `*`.
target_key | No | String | Specifies a parent level key to store all captures. Default value is `null`.
timeout_millis | No | Integer | Maximum amount of time that should take place for the matching. Setting to `0` disables the timeout. Default value is `30,000`.

## Sinks

Sinks define where Data Prepper writes your data to.


### OpenSearch

Sink for an OpenSearch cluster.

Option | Required | Type | Description
:--- | :--- | :--- | :---
hosts | Yes | List | List of OpenSearch hosts to write to (e.g. `["https://localhost:9200", "https://remote-cluster:9200"]`).
cert | No | String | Path to the security certificate (e.g. `"config/root-ca.pem"`) if the cluster uses the OpenSearch security plugin.
username | No | String | Username for HTTP basic authentication.
password | No | String | Password for HTTP basic authentication.
aws_sigv4 | No | Boolean | default false. Whether to use IAM signing to connect to an Amazon OpenSearch Service domain. For your access key, secret key, and optional session token, Data Prepper uses the default credential chain (environment variables, Java system properties, `~/.aws/credential`, etc.).
aws_region | No | String | AWS region (e.g. `"us-east-1"`) for the domain if you are connecting to Amazon OpenSearch Service.
aws_sts_role_arn | No | String | IAM role which the sink plugin assumes to sign request to Amazon OpenSearch Service. If not provided the plugin uses the default credentials.
socket_timeout | No | Integer | the timeout in milliseconds for waiting for data (or, put differently, a maximum period inactivity between two consecutive data packets). A timeout value of zero is interpreted as an infinite timeout. If this timeout value is either negative or not set, the underlying Apache HttpClient would rely on operating system settings for managing socket timeouts.
connect_timeout | No | Integer | The timeout in milliseconds used when requesting a connection from the connection manager. A timeout value of zero is interpreted as an infinite timeout. If this timeout value is either negative or not set, the underlying Apache HttpClient would rely on operating system settings for managing connection timeouts.
insecure | No | Boolean | Whether to verify SSL certificates. If set to true, CA certificate verification is disabled and insecure HTTP requests are sent instead. Default is false.
proxy | No | String | The address of a [forward HTTP proxy server](https://en.wikipedia.org/wiki/Proxy_server). The format is "&lt;host name or IP&gt;:&lt;port&gt;". Examples: "example.com:8100", "http://example.com:8100", "112.112.112.112:8100". Port number cannot be omitted.
trace_analytics_raw | No | Boolean | Deprecated in favor of `index_type`. Whether to export as trace data to the `otel-v1-apm-span-*` index pattern (alias `otel-v1-apm-span`) for use with the Trace Analytics OpenSearch Dashboards plugin. Default is false.
trace_analytics_service_map | No | Boolean | Deprecated in favor of `index_type`. Whether to export as trace data to the `otel-v1-apm-service-map` index for use with the service map component of the Trace Analytics OpenSearch Dashboards plugin. | Default is false.
index | No | String | Name of the index to export to. Only required if you don't use the `trace-analytics-raw` or `trace-analytics-service-map` presets. In other words, this parameter is applicable and required only if index_type is explicitly `custom` or defaults to `custom`.
index_type | No | String | This index type instructs the Sink plugin what type of data it is handling. Valid values: `custom`, `trace-analytics-raw`, `trace-analytics-service-map`. Default is `custom`.
template_file | No | String | Path to a JSON [index template]({{site.url}}{{site.baseurl}}/opensearch/index-templates/) file (e.g. `/your/local/template-file.json` if you do not use the `trace_analytics_raw` or `trace_analytics_service_map`.) See [otel-v1-apm-span-index-template.json](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/opensearch/src/main/resources/otel-v1-apm-span-index-template.json) for an example.
document_id_field | No | String | The field from the source data to use for the OpenSearch document ID (e.g. `"my-field"`) if you don't use the `trace_analytics_raw` or `trace_analytics_service_map` presets.
dlq_file | No | String | The path to your preferred dead letter queue file (e.g. `/your/local/dlq-file`). Data Prepper writes to this file when it fails to index a document on the OpenSearch cluster.
bulk_size | No | Integer (long) | The maximum size (in MiB) of bulk requests to the OpenSearch cluster. Values below 0 indicate an unlimited size. If a single document exceeds the maximum bulk request size, Data Prepper sends it individually. Default is 5.
ism_policy_file | No | String | The absolute file path for an ISM (Index State Management) policy JSON file. This policy file is effective only when there is no built-in policy file for the index type. For example, `custom` index type is currently the only one without a built-in policy file, thus it would use the policy file here if it's provided through this parameter. For more information, see [ISM policies]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/).
number_of_shards | No | Integer | The number of primary shards that an index should have on the destination OpenSearch server. This parameter is effective only when `template_file` is either explicitly provided in Sink configuration or built-in. If this parameter is set, it would override the value in index template file. For more information, see [create index]({{site.url}}{{site.baseurl}}/opensearch/rest-api/index-apis/create-index/).
number_of_replicas | No | Integer | The number of replica shards each primary shard should have on the destination OpenSearch server. For example, if you have 4 primary shards and set number_of_replicas to 3, the index has 12 replica shards. This parameter is effective only when `template_file` is either explicitly provided in Sink configuration or built-in. If this parameter is set, it would override the value in index template file. For more information, see [create index]({{site.url}}{{site.baseurl}}/opensearch/rest-api/index-apis/create-index/).

### file

Sink for flat file output.

Option | Required | Type | Description
:--- | :--- | :--- | :---
path | Yes | String | Path for the output file (e.g. `logs/my-transformed-log.log`).


### pipeline

Sink for writing to another pipeline.

Option | Required | Type | Description
:--- | :--- | :--- | :---
name | Yes | String | Name of the pipeline to write to.


### stdout

Sink for console output. Can be useful for testing. No options.
