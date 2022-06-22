---
layout: default
title: Configuration reference
parent: Data Prepper
nav_order: 3
---

# Data Prepper configuration reference

This page lists all supported Data Prepper server, sources, buffers, processors, and sinks, along with their associated options. For example configuration files, see [Data Prepper]({{site.url}}{{site.baseurl}}/clients/data-prepper/pipelines/).

## Data Prepper server options

Option | Required | Type | Description
:--- | :--- | :--- | :---
ssl | No | Boolean | Indicates whether TLS should be used for server APIs. Defaults to true.
keyStoreFilePath | No | String | Path to a .jks or .p12 keystore file. Required if `ssl` is true.
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
ssl | No | Boolean | Enables connections to the OTel source port over TLS/SSL. Defaults to `true`.
sslKeyCertChainFile | Conditionally | String | File-system path or AWS S3 path to the security certificate (e.g. `"config/demo-data-prepper.crt"` or `"s3://my-secrets-bucket/demo-data-prepper.crt"`). Required if `ssl` is set to `true`.
sslKeyFile | Conditionally | String | File-system path or AWS S3 path to the security key (e.g. `"config/demo-data-prepper.key"` or `"s3://my-secrets-bucket/demo-data-prepper.key"`). Required if `ssl` is set to `true`.
useAcmCertForSSL | No | Boolean | Whether to enable TLS/SSL using certificate and private key from AWS Certificate Manager (ACM). Default is `false`.
acmCertificateArn | Conditionally | String | Represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificate. Required if `useAcmCertForSSL` is set to `true`.
awsRegion | Conditionally | String | Represents the AWS region to use ACM or S3. Required if `useAcmCertForSSL` is set to `true` or `sslKeyCertChainFile` and `sslKeyFile` are AWS S3 paths.
authentication | No | Object | An authentication configuration. By default, an unauthenticated server is created for the pipeline. This parameter uses pluggable authentication for HTTPS. To use basic authentication, define the `http_basic` plugin with a `username` and `password`. To provide customer authentication, use or create a plugin that implements [GrpcAuthenticationProvider](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/armeria-common/src/main/java/com/amazon/dataprepper/armeria/authentication/GrpcAuthenticationProvider.java).
record_type | No | String | A string represents the supported record data type that is written into the buffer plugin. Value options are `otlp` or `event`. Default is `otlp`.
`otlp` | No | String | Otel-trace-source writes each incoming `ExportTraceServiceRequest` request as record data type into the buffer.
`event` | No | String | Otel-trace-source decodes each incoming `ExportTraceServiceRequest` request into a collection of Data Prepper internal spans serving as buffer items. To achieve better performance in this mode, we recommend setting buffer capacity proportional to the estimated number of spans in the incoming request payload.

### http_source

This is a source plugin that supports HTTP protocol. Currently ONLY support Json UTF-8 codec for incoming request, e.g. `[{"key1": "value1"}, {"key2": "value2"}]`.

Option | Required | Type | Description
:--- | :--- | :--- | :---
port | No | Integer | The port the source is running on. Default is `2021`. Valid options are between `0` and `65535`.
request_timeout | No | Integer | The request timeout in millis. Default is `10_000`.
thread_count | No | Integer | The number of threads to keep in the ScheduledThreadPool. Default is `200`.
max_connection_count | No | Integer | The maximum allowed number of open connections. Default is `500`.
max_pending_requests | No | Integer | The maximum number of allowed tasks in ScheduledThreadPool work queue. Default is `1024`.
authentication | No | Object | An authentication configuration. By default, this creates an unauthenticated server for the pipeline. This uses pluggable authentication for HTTPS. To use basic authentication define the `http_basic` plugin with a `username` and `password`. To provide customer authentication, use or create a plugin that implements [ArmeriaHttpAuthenticationProvider](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/armeria-common/src/main/java/com/amazon/dataprepper/armeria/authentication/ArmeriaHttpAuthenticationProvider.java).

### otel_metrics_source

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
authentication | No | Object | An authentication configuration. By default, an unauthenticated server is created for the pipeline. This uses pluggable authentication for HTTPS. To use basic authentication, define the `http_basic` plugin with a `username` and `password`. To provide customer authentication, use or create a plugin that implements [GrpcAuthenticationProvider](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/armeria-common/src/main/java/com/amazon/dataprepper/armeria/authentication/GrpcAuthenticationProvider.java).



### file

Source for flat file input.

Option | Required | Type | Description
:--- | :--- | :--- | :---
path | Yes | String | Path to the input file (e.g. `logs/my-log.log`).
format | No | String | Format of each line in the file. Valid options are `json` or `plain`. Default is `plain`.
record_type | No | String | The record type to store. Valid options are `string` or `event`. Default is `string`. If you would like to use the file source for log analytics use cases like grok, set this option to `event`.

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


## Processors

Processors perform some action on your data: filter, transform, enrich, etc.

Prior to Data Prepper 1.3, Processors were named Preppers. Starting in Data Prepper 1.3, the term Prepper is deprecated in favor of Processor. Data Prepper will continue to support the term "Prepper" until 2.0, where it will be removed.
{: .note }


### otel_trace_raw_prepper

Converts OpenTelemetry data to OpenSearch-compatible JSON documents and fills in trace group related fields in those JSON documents. It requires `record_type` to be set as `otlp` in `otel_trace_source`.

Option | Required | Type | Description
:--- | :--- | :--- | :---
trace_flush_interval | No | Integer | Represents the time interval in seconds to flush all the descendant spans without any root span. Default is 180.

### otel_trace_raw

This processor is a Data Prepper event record type compatible version of `otel_trace_raw_prepper` that fills in trace group related fields into all incoming Data Prepper span records. It requires `record_type` to be set as `event` in `otel_trace_source`.

Option | Required | Type | Description
:--- | :--- | :--- | :---
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
ssl | No | Boolean | Indicates whether to use TLS. Default is true.
awsCloudMapNamespaceName | Conditionally | String | Name of your CloudMap Namespace. Required if `discovery_mode` is set to `aws_cloud_map`.
awsCloudMapServiceName | Conditionally | String | Service name within your CloudMap Namespace. Required if `discovery_mode` is set to `aws_cloud_map`.
sslKeyCertChainFile | Conditionally | String | Represents the SSL certificate chain file path or AWS S3 path. S3 path example `s3://<bucketName>/<path>`. Required if `ssl` is set to `true`.
useAcmCertForSSL | No | Boolean | Enables TLS/SSL using certificate and private key from AWS Certificate Manager (ACM). Default is `false`.
awsRegion | Conditionally | String | Represents the AWS Region to use ACM, S3, or CloudMap. Required if `useAcmCertForSSL` is set to `true` or `sslKeyCertChainFile` and `sslKeyFile` are AWS S3 paths.
acmCertificateArn | Conditionally | String | Represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificate. Required if `useAcmCertForSSL` is set to `true`.

### string_converter

Converts string to uppercase or lowercase. Mostly useful as an example if you want to develop your own processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
upper_case | No | Boolean | Whether to convert to uppercase (`true`) or lowercase (`false`).

### aggregate

Groups events together based on the keys provided and performs a action on each group.

Option | Required | Type | Description
:--- | :--- | :--- | :---
identification_keys | Yes | List | A unordered list by which to group Events. Events with the same values for these keys are put into the same group. If an Event does not contain one of the `identification_keys`, then the value of that key is considered to be equal to `null`. At least one identification_key is required. (e.g. `["sourceIp", "destinationIp", "port"]`).
action | Yes | AggregateAction | The action to be performed for each group. One of the available Aggregate Actions must be provided or you can create custom aggregate actions. `remove_duplicates` and `put_all` are available actions. For more information, see [creating custom aggregate actions](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#creating-new-aggregate-actions).
group_duration | No | String | The amount of time that a group should exist before it is concluded automatically. Supports ISO_8601 notation strings ("PT20.345S", "PT15M", etc.) as well as simple notation for seconds (`"60s"`) and milliseconds (`"1500ms"`). Default value is `180s`.

### date

Adds a default timestamp to the event or parses timestamp fields, and converts it to ISO 8601 format, which can be used as event timestamp.

Option | Required | Type | Description
:--- | :--- | :--- | :---
match | Conditionally | List | List of `key` and `patterns` where patterns is a list. The list of match can have exactly one `key` and `patterns`. There is no default value. This option cannot be defined at the same time as `from_time_received`. Include multiple date processors in your pipeline if both options should be used.
from_time_received | Conditionally | Boolean | A boolean that is used for adding default timestamp to event data from event metadata which is the time when source receives the event. Default value is `false`. This option cannot be defined at the same time as `match`. Include multiple date processors in your pipeline if both options should be used.
destination | No | String | Field to store the timestamp parsed by date processor. It can be used with both `match` and `from_time_received`. Default value is `@timestamp`.
source_timezone | No | String | Time zone used to parse dates. It is used in case zone or offset cannot be extracted from the value. If zone or offset are part of the value, then timezone is ignored. Find all the available timezones [the list of database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) in the "TZ database name" column.
destination_timezone | No | String | Timezone used for storing timestamp in `destination` field. The available timezone values are the same as `source_timestamp`.
locale | No | String | Locale is used for parsing dates. It's commonly used for parsing month names(`MMM`). It can have language, country and variant fields using IETF BCP 47 or String representation of [Locale](https://docs.oracle.com/javase/8/docs/api/java/util/Locale.html) object. For example `en-US` for IETF BCP 47 and `en_US` for string representation of Locale. Full list of locale fields which includes language, country and variant can be found [the language subtag registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry). Default value is `Locale.ROOT`.

### drop_events

Drops all the events that are passed into this processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
drop_when | Yes | String | Accepts a Data Prepper Expression string following the [Data Prepper Expression Syntax](https://github.com/opensearch-project/data-prepper/blob/main/docs/expression_syntax.md). Configuring `drop_events` with `drop_when: true` drops all the events received.
handle_failed_events | No | Enum | Specifies how exceptions are handled when an exception occurs while evaluating an event. Default value is `drop`, which drops the event so it doesn't get sent to OpenSearch. Available options are `drop`, `drop_silently`, `skip`, `skip_silently`. For more information, see [handle_failed_events](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/drop-events-processor#handle_failed_events).

### grok_prepper

Takes unstructured data and utilizes pattern matching to structure and extract important keys and make data more structured and queryable.

Option | Required | Type | Description
:--- | :--- | :--- | :---
match | No | Map | Specifies which keys to match specific patterns against. Default is an empty body.
keep_empty_captures | No | Boolean | Enables preserving `null` captures. Default value is `false`.
named_captures_only | No | Boolean | enables whether to keep only named captures. Default value is `true`.
break_on_match | No | Boolean | Specifies whether to match all patterns or stop once the first successful match is found. Default is `true`.
keys_to_overwrite | No | List | Specifies which existing keys are to be overwritten if there is a capture with the same key value. Default is `[]`.
pattern_definitions | No | Map | Allows for custom pattern use inline. Default value is an empty body.
patterns_directories | No | List | Specifies the path of directories that contain customer pattern files. Default value is an empty list.
pattern_files_glob | No | String | Specifies which pattern files to use from the directories specified for `pattern_directories`. Default is `*`.
target_key | No | String | Specifies a parent level key to store all captures. Default value is `null`.
timeout_millis | No | Integer | Maximum amount of time that should take place for the matching. Setting to `0` disables the timeout. Default value is `30,000`.

### key_value

Takes in a field and parses it into key/value pairs.

Option | Required | Type | Description
:--- | :--- | :--- | :---
source | No | String | The key in the event that is parsed. Default value is `message`.
destination | No | String | The key where to output the parsed source to. Doing so overwrites the value of the key if it exists. Default value is `parsed_message`
field_delimiter_regex | Conditionally | String | A regex specifying the delimiter between key/value pairs. Special regex characters such as `[` and `]` must be escaped using `\\`. This option cannot be defined at the same time as `field_split_characters`.
field_split_characters | Conditionally | String | A string of characters to split between key/value pairs. Special regex characters such as `[` and `]` must be escaped using `\\`. Default value is `&`. This option cannot be defined at the same time as `field_delimiter_regex`.
key_value_delimiter_regex| Conditionally | String | A regex specifying the delimiter between a key and a value. Special regex characters such as `[` and `]` must be escaped using `\\`. There is no default value. This option cannot be defined at the same time as `value_split_characters`.
value_split_characters | Conditionally | String | A string of characters to split between keys and values. Special regex characters such as `[` and `]` must be escaped using `\\`. Default value is `=`. This option cannot be defined at the same time as `key_value_delimiter_regex`.
non_match_value | No | String | When a key/value cannot be successfully split, the key/value is be placed in the key field and the specified value in the value field. Default value is `null`.
prefix | No | String | A prefix given to all keys. Default value is empty string.
delete_key_regex | No | String | A regex used to delete characters from the key. Special regex characters such as `[` and `]` must be escaped using `\\`. There is no default value.
delete_value_regex | No | String | A regex used to delete characters from the value. Special regex characters such as `[` and `]` must be escaped using `\\`. There is no default value.

### add_entries

Adds an entry to event. `add_entries` is part of [mutate event](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-event-processors#mutate-event-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of events to be added. Valid entries are `key`, `value`, and `overwrite_if_key_exists`.
key | N/A | N/A | Key of the new event to be added.
value | N/A | N/A | Value of the new entry to be added. Valid data types are strings, booleans, numbers, null, nested objects, and arrays containing the aforementioned data types.
overwrite_if_key_exists | No | Boolean | If true, the existing value gets overwritten if the key already exists within the event. Default is `false`.

### copy_values

Copy values within an event. `copy_values`  is part of [mutate event](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-event-processors#mutate-event-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of entries to be copied. Valid values are `from_key`, `to_key`, and `overwrite_if_key_exists`.
from_key | N/A | N/A | The key of the entry to be copied.
to_key | N/A | N/A | The key of the new entry to be added.
overwrite_if_to_key_exists | No | Boolean | If true, the existing value gets overwritten if the key already exists within the event. Default is `false`.


### delete_entries

Delete entries in an event. `delete_entries` is part of [mutate event](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-event-processors#mutate-event-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
with_keys | Yes | List |  An array of keys of the entries to be deleted.

### rename_keys

Rename keys in an event. `rename_keys` is part of [mutate event](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-event-processors#mutate-event-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of entries. Valid values are `from_key`, `to_key`, and `overwrite_if_key_exists`. Renaming occurs in the order defined.
from_key | N/A | N/A | The key of the entry to be renamed.
to_key | N/A | N/A | The new key of the entry.
overwrite_if_to_key_exists | No | Boolean | If true, the existing value gets overwritten if `to_key` already exists in the event.

### substitute_string

Matches a key's value against a regular expression and replaces all matches with a replacement string. `substitute_string` is part of [mutate string](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-string-processors#mutate-string-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of entries. Valid values are `source`, `from`, and `to`.
source | N/A | N/A | The key to modify.
from | N/A | N/A | The Regex String to be replaced. Special regex characters such as `[` and `]` must be escaped using `\\` when using double quotes and `\ ` when using single quotes. See [Java Patterns](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/regex/Pattern.html) for more information.
to | N/A | N/A | The String to be substituted for each match of `from`.

### split_string

Splits a field into an array using a delimiter character. `split_string` is part of [mutate string](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-string-processors#mutate-string-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
entries | Yes | List | List of entries. Valid values are `source`, `delimiter`, and `delimiter_regex`.
source | N/A | N/A | The key to split.
delimiter | No | N/A | The separator character responsible for the split. Cannot be defined at the same time as `delimiter_regex`. At least `delimiter` or `delimiter_regex` must be defined.
delimiter_regex | No | N/A | The regex string responsible for the split. Cannot be defined at the same time as `delimiter`. At least `delimiter` or `delimiter_regex` must be defined.

### uppercase_string

Converts a string to its uppercase counterpart. `uppercase_string` is part of [mutate string](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-string-processors#mutate-string-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
with_keys | Yes | List | A list of keys to convert to uppercase.

### lowercase_string

Converts a string to its lowercase counterpart. `lowercase_string` is part of [mutate string](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-string-processors#mutate-string-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
with_keys | Yes | List | A list of keys to convert to lowercase.

### trim_string

Strips whitespace from the beginning and end of a key. `trim_string` is part of [mutate string](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/mutate-string-processors#mutate-string-processors) processors.

Option | Required | Type | Description
:--- | :--- | :--- | :---
with_keys | Yes | List | A list of keys to trim the whitespace from.

## Sinks

Sinks define where Data Prepper writes your data to.


### opensearch

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
insecure | No | Boolean | Whether to verify SSL certificates. If set to true, CA certificate verification is disabled and insecure HTTP requests are sent instead. Default is `false`.
proxy | No | String | The address of a [forward HTTP proxy server](https://en.wikipedia.org/wiki/Proxy_server). The format is "&lt;host name or IP&gt;:&lt;port&gt;". Examples: "example.com:8100", "http://example.com:8100", "112.112.112.112:8100". Port number cannot be omitted.
trace_analytics_raw | No | Boolean | Deprecated in favor of `index_type`. Whether to export as trace data to the `otel-v1-apm-span-*` index pattern (alias `otel-v1-apm-span`) for use with the Trace Analytics OpenSearch Dashboards plugin. Default is `false`.
trace_analytics_service_map | No | Boolean | Deprecated in favor of `index_type`. Whether to export as trace data to the `otel-v1-apm-service-map` index for use with the service map component of the Trace Analytics OpenSearch Dashboards plugin. Default is `false`.
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
