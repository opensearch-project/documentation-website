---
layout: default
title: Configuration reference
parent: Data Prepper
nav_order: 3
canonical_url: https://docs.opensearch.org/latest/data-prepper/managing-data-prepper/configuring-data-prepper/
redirect_to: https://docs.opensearch.org/latest/data-prepper/managing-data-prepper/configuring-data-prepper/
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
serverPort | No | Integer | Port number to use for server APIs. Defaults to 4900.
metricRegistries | No | List | Metrics registries for publishing the generated metrics. Currently supports Prometheus and CloudWatch. Defaults to Prometheus.
metricTags | No | Map | Key-value pairs as common metric tags to metric registries. The maximum number of pairs is three. Note that `serviceName` is a reserved tag key with `DataPrepper` as default tag value. Alternatively, administrators can set this value through the environment variable `DATAPREPPER_SERVICE_NAME`. If `serviceName` is defined in `metricTags`, that value overwrites those set through the above methods.
authentication | No | Object | Authentication configuration. Valid option is `http_basic` with `username` and `password` properties. If not defined, the server does not perform authentication.
processorShutdownTimeout | No | Duration | Time given to processors to clear any in-flight data and gracefully shutdown. Default is 30s.
sinkShutdownTimeout | No | Duration | Time given to sinks to clear any in-flight data and gracefully shutdown. Default is 30s.
peer_forwarder | No | Object | Peer forwarder configurations. See [Peer forwarder options](#peer-forwarder-options) for more details.

### Peer forwarder options

The following section details various configuration options for peer forwarder.

#### General options for peer forwarder

Option | Required | Type | Description
:--- | :--- | :--- | :---
port | No | Integer | The port number peer forwarder server is running on. Valid options are between 0 and 65535. Defaults is 4994.
request_timeout | No | Integer | Request timeout in milliseconds for peer forwarder HTTP server. Default is 10000.
server_thread_count | No | Integer | Number of threads used by peer forwarder server. Default is 200.
client_thread_count | No | Integer | Number of threads used by peer forwarder client. Default is 200.
max_connection_count | No | Integer | Maximum number of open connections for peer forwarder server. Default is 500.
max_pending_requests | No | Integer | Maximum number of allowed tasks in ScheduledThreadPool work queue. Default is 1024.
discovery_mode | No | String | Peer discovery mode to use. Valid options are `local_node`, `static`, `dns`, or `aws_cloud_map`. Defaults to `local_node`, which processes events locally.
static_endpoints | Conditionally | List | A list containing endpoints of all Data Prepper instances. Required if `discovery_mode` is set to static.
domain_name | Conditionally | String | A single domain name to query DNS against. Typically, used by creating multiple DNS A Records for the same domain. Required if `discovery_mode` is set to dns.
aws_cloud_map_namespace_name | Conditionally | String | Cloud Map namespace when using AWS Cloud Map service discovery. Required if `discovery_mode` is set to `aws_cloud_map`.
aws_cloud_map_service_name | Conditionally | String | Cloud Map service name when using AWS Cloud Map service discovery. Required if `discovery_mode` is set to `aws_cloud_map`.
aws_cloud_map_query_parameters | No | Map | Key-value pairs to filter the results based on the custom attributes attached to an instance. Only instances that match all the specified key-value pairs are returned.
buffer_size | No | Integer | Max number of unchecked records the buffer accepts. Number of unchecked records is the sum of the number of records written into the buffer and the num of in-flight records not yet checked by the Checkpointing API. Default is 512.
batch_size | No | Integer | Max number of records the buffer returns on read. Default is 48.
aws_region | Conditionally | String | AWS region to use ACM, S3 or AWS Cloud Map. Required if `use_acm_certificate_for_ssl` is set to true or `ssl_certificate_file` and `ssl_key_file` is AWS S3 path or `discovery_mode` is set to `aws_cloud_map`.
drain_timeout | No | Duration | Wait time for the peer forwarder to complete processing data before shutdown. Default is 10s.

#### TLS/SSL options for peer forwarder

Option | Required | Type | Description
:--- | :--- | :--- | :---
ssl | No | Boolean | Enables TLS/SSL. Default is true.
ssl_certificate_file | Conditionally | String | SSL certificate chain file path or AWS S3 path. S3 path example `s3://<bucketName>/<path>`. Required if `ssl` is true and `use_acm_certificate_for_ssl` is false. Defaults to `config/default_certificate.pem` which is the default certificate file. Read more about how the certificate file is generated [here](https://github.com/opensearch-project/data-prepper/tree/main/examples/certificates).
ssl_key_file | Conditionally | String | SSL key file path or AWS S3 path. S3 path example `s3://<bucketName>/<path>`. Required if `ssl` is true and `use_acm_certificate_for_ssl` is false. Defaults to `config/default_private_key.pem` which is the default private key file. Read more about how the default private key file is generated [here](https://github.com/opensearch-project/data-prepper/tree/main/examples/certificates).
ssl_insecure_disable_verification | No | Boolean | Disables the verification of server's TLS certificate chain. Default is false.
ssl_fingerprint_verification_only | No | Boolean | Disables the verification of server's TLS certificate chain and instead verifies only the certificate fingerprint. Default is false.
use_acm_certificate_for_ssl | No | Boolean | Enables TLS/SSL using certificate and private key from AWS Certificate Manager (ACM). Default is false.
acm_certificate_arn | Conditionally | String | ACM certificate ARN. The ACM certificate takes preference over S3 or a local file system certificate. Required if `use_acm_certificate_for_ssl` is set to true.
acm_private_key_password | No | String | ACM private key password that decrypts the private key. If not provided, Data Prepper generates a random password.
acm_certificate_timeout_millis | No | Integer | Timeout in milliseconds for ACM to get certificates. Default is 120000.
aws_region | Conditionally | String | AWS region to use ACM, S3 or AWS Cloud Map. Required if `use_acm_certificate_for_ssl` is set to true or `ssl_certificate_file` and `ssl_key_file` is AWS S3 path or `discovery_mode` is set to `aws_cloud_map`.

#### Authentication options for peer forwarder

Option | Required | Type | Description
:--- | :--- | :--- | :---
authentication | No | Map | Authentication method to use. Valid options are `mutual_tls` (use mTLS) or `unauthenticated` (no authentication). Default is `unauthenticated`.


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
unauthenticated_health_check | No | Boolean | Determines whether or not authentication is required on the health check endpoint. Data Prepper ignores this option if no authentication is defined. Default is `false`.
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

### http_source

This is a source plugin that supports HTTP protocol. Currently ONLY support Json UTF-8 codec for incoming request, e.g. `[{"key1": "value1"}, {"key2": "value2"}]`.

Option | Required | Type | Description
:--- | :--- | :--- | :---
port | No | Integer | The port the source is running on. Default is `2021`. Valid options are between `0` and `65535`.
health_check_service | No | Boolean | Enables health check service on `/health` endpoint on the defined port. Default is `false`.
unauthenticated_health_check | No | Boolean | Determines whether or not authentication is required on the health check endpoint. Data Prepper ignores this option if no authentication is defined. Default is `false`.
request_timeout | No | Integer | The request timeout in millis. Default is `10_000`.
thread_count | No | Integer | The number of threads to keep in the ScheduledThreadPool. Default is `200`.
max_connection_count | No | Integer | The maximum allowed number of open connections. Default is `500`.
max_pending_requests | No | Integer | The maximum number of allowed tasks in ScheduledThreadPool work queue. Default is `1024`.
authentication | No | Object | An authentication configuration. By default, this creates an unauthenticated server for the pipeline. This uses pluggable authentication for HTTPS. To use basic authentication define the `http_basic` plugin with a `username` and `password`. To provide customer authentication, use or create a plugin that implements [ArmeriaHttpAuthenticationProvider](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/armeria-common/src/main/java/com/amazon/dataprepper/armeria/authentication/ArmeriaHttpAuthenticationProvider.java).
ssl | No | Boolean | Enables TLS/SSL. Default is false.
ssl_certificate_file | Conditionally | String | SSL certificate chain file path or AWS S3 path. S3 path example `s3://<bucketName>/<path>`. Required if `ssl` is true and `use_acm_certificate_for_ssl` is false.
ssl_key_file | Conditionally | String | SSL key file path or AWS S3 path. S3 path example `s3://<bucketName>/<path>`. Required if `ssl` is true and `use_acm_certificate_for_ssl` is false.
use_acm_certificate_for_ssl | No | Boolean | Enables TLS/SSL using certificate and private key from AWS Certificate Manager (ACM). Default is false.
acm_certificate_arn | Conditionally | String | ACM certificate ARN. The ACM certificate takes preference over S3 or a local file system certificate. Required if `use_acm_certificate_for_ssl` is set to true.
acm_private_key_password | No | String | ACM private key password that decrypts the private key. If not provided, Data Prepper generates a random password.
acm_certificate_timeout_millis | No | Integer | Timeout in milliseconds for ACM to get certificates. Default is 120000.
aws_region | Conditionally | String | AWS region to use ACM or S3. Required if `use_acm_certificate_for_ssl` is set to true or `ssl_certificate_file` and `ssl_key_file` is AWS S3 path.

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


### s3

This is a source plugin that reads events from [Amazon Simple Storage Service](https://aws.amazon.com/s3/) (Amazon S3) objects.

Option | Required | Type | Description
:--- | :--- | :--- | :---
notification_type | Yes | String | Must be `sqs`
compression | No | String | The compression algorithm to apply: `none`, `gzip`, or `automatic`. Default is `none`.
codec | Yes | Codec | The codec to apply. Must be `newline`, `json`, or `csv`.
sqs | Yes | sqs | The [Amazon Simple Queue Service](https://aws.amazon.com/sqs/) (Amazon SQS) configuration. See [sqs](#sqs) for details.
aws | Yes | aws | The AWS configuration. See [aws](#aws) for details.
on_error | No | String |  Determines how to handle errors in Amazon SQS. Can be either `retain_messages` or `delete_messages`. If `retain_messages`, then Data Prepper will leave the message in the SQS queue and try again. This is recommended for dead-letter queues. If `delete_messages`, then Data Prepper will delete failed messages. Default is `retain_messages`.
buffer_timeout | No | Duration | The timeout for writing events to the Data Prepper buffer. Any events that the S3 Source cannot write to the buffer in this time will be discarded. Default is 10 seconds.
records_to_accumulate | No | Integer | The number of messages that accumulate before writing to the buffer. Default is 100.
metadata_root_key | No | String | Base key for adding S3 metadata to each Event. The metadata includes the key and bucket for each S3 object. Defaults to `s3/`.
disable_bucket_ownership_validation | No | Boolean | If `true`, then the S3 Source will not attempt to validate that the bucket is owned by the expected account. The only expected account is the same account that owns the SQS queue. Defaults to `false`.

#### sqs

The following are configure usage of Amazon SQS in the S3 Source plugin.

Option | Required | Type | Description
:--- | :--- | :--- | :---
queue_url | Yes | String | The URL of the Amazon SQS queue from which messages are received.
maximum_messages | No | Integer | The maximum number of messages to receive from the SQS queue in any single request. Default is `10`.
visibility_timeout | No | Duration | The visibility timeout to apply to messages read from the SQS queue. This should be set to the amount of time that Data Prepper may take to read all the S3 objects in a batch. Default is `30s`.
wait_time | No | Duration | The time to wait for long polling on the SQS API. Default is `20s`.
poll_delay | No | Duration | A delay to place between reading and processing a batch of SQS messages and making a subsequent request. Default is `0s`.


#### aws

Option | Required | Type | Description
:--- | :--- | :--- | :---
region | No | String | The AWS Region to use for credentials. Defaults to [standard SDK behavior to determine the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
sts_role_arn | No | String | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon SQS and Amazon S3. Defaults to null, which will use the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).


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


### otel_trace_raw

This processor is a Data Prepper event record type replacement of `otel_trace_raw_prepper` (no longer supported since Data Prepper 2.0). 
The processor fills in trace group related fields including 

* `traceGroup`: root span name
* `endTime`: end time of the entire trace in ISO 8601
* `durationInNanos`: duration of the entire trace in nanoseconds
* `statusCode`: status code for the entire trace in nanoseconds

in all incoming Data Prepper span records by state caching the root span info per traceId. 

Option | Required | Type | Description
:--- | :--- | :--- | :---
trace_flush_interval | No | Integer | Represents the time interval in seconds to flush all the descendant spans without any root span. Default is 180.

### service_map_stateful

Uses OpenTelemetry data to create a distributed service map for visualization in OpenSearch Dashboards.

Option | Required | Type | Description
:--- | :--- | :--- | :---
window_duration | No | Integer | Represents the fixed time window in seconds to evaluate service-map relationships. Default is 180.

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

### grok

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

### csv

Takes in an Event and parses its CSV data into columns.

Option | Required | Type | Description
:--- | :--- | :--- | :---
source | No | String | The field in the Event that will be parsed. Default is `message`.
quote_character | No | String | The character used as a text qualifier for a single column of data. Default is double quote `"`.
delimiter | No | String | The character separating each column. Default is `,`.
delete_header | No | Boolean | If specified, the header on the Event (`column_names_source_key`) deletes after the Event is parsed. If there’s no header on the Event, no actions is taken. Default is true.
column_names_source_key | No | String | The field in the Event that specifies the CSV column names, which will be autodetected. If there must be extra column names, the column names autogenerate according to their index. If `column_names` is also defined, the header in `column_names_source_key` can also be used to generate the Event fields. If too few columns are specified in this field, the remaining column names autogenerate. If too many column names are specified in this field, CSV processor omits the extra column names.
column_names | No | List | User-specified names for the CSV columns. Default is `[column1, column2, ..., columnN]` if there are N columns of data in the CSV record and `column_names_source_key` is not defined. If `column_names_source_key` is defined, the header in `column_names_source_key` generates the Event fields. If too few columns are specified in this field, the remaining column names will autogenerate. If too many column names are specified in this field, CSV processor omits the extra column names.

### json

Takes in an Event and parses its JSON data, including any nested fields.

Option | Required | Type | Description
:--- | :--- | :--- | :---
source | No | String | The field in the `Event` that will be parsed. Default is `message`.
destination | No | String | The destination field of the parsed JSON. Defaults to the root of the `Event`. Cannot be `""`, `/`, or any whitespace-only `String` because these are not valid `Event` fields.
pointer | No | String | A JSON Pointer to the field to be parsed. There is no `pointer` by default, meaning the entire `source` is parsed. The `pointer` can access JSON Array indices as well. If the JSON Pointer is invalid then the entire `source` data is parsed into the outgoing `Event`. If the pointed-to key already exists in the `Event` and the `destination` is the root, then the pointer uses the entire path of the key.


## Routes

Routes define conditions that can be used in sinks for conditional routing. Routes are specified at the same level as processors and sinks under the name `route` and consist of a list of key-value pairs, where the key is the name of a route and the value is a Data Prepper expression representing the routing condition.


## Sinks

Sinks define where Data Prepper writes your data to.

### General options for all sink types

Option | Required | Type | Description
:--- | :--- | :--- | :---
routes | No | List | List of routes that the sink accepts. If not specified, the sink accepts all upstream events.


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
index | Conditionally | String | Name of the export index. Applicable and required only when the `index_type` is `custom`.
index_type | No | String | This index type tells the Sink plugin what type of data it is handling. Valid values: `custom`, `trace-analytics-raw`, `trace-analytics-service-map`, `management-disabled`. Default is `custom`.
template_file | No | String | Path to a JSON [index template]({{site.url}}{{site.baseurl}}/opensearch/index-templates/) file (e.g. `/your/local/template-file.json`) if `index_type` is `custom`. See [otel-v1-apm-span-index-template.json](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/opensearch/src/main/resources/otel-v1-apm-span-index-template.json) for an example.
document_id_field | No | String | The field from the source data to use for the OpenSearch document ID (e.g. `"my-field"`) if `index_type` is `custom`.
dlq_file | No | String | The path to your preferred dead letter queue file (e.g. `/your/local/dlq-file`). Data Prepper writes to this file when it fails to index a document on the OpenSearch cluster.
bulk_size | No | Integer (long) | The maximum size (in MiB) of bulk requests to the OpenSearch cluster. Values below 0 indicate an unlimited size. If a single document exceeds the maximum bulk request size, Data Prepper sends it individually. Default is 5.
ism_policy_file | No | String | The absolute file path for an ISM (Index State Management) policy JSON file. This policy file is effective only when there is no built-in policy file for the index type. For example, `custom` index type is currently the only one without a built-in policy file, thus it would use the policy file here if it's provided through this parameter. For more information, see [ISM policies]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/).
number_of_shards | No | Integer | The number of primary shards that an index should have on the destination OpenSearch server. This parameter is effective only when `template_file` is either explicitly provided in Sink configuration or built-in. If this parameter is set, it would override the value in index template file. For more information, see [Create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/).
number_of_replicas | No | Integer | The number of replica shards each primary shard should have on the destination OpenSearch server. For example, if you have 4 primary shards and set number_of_replicas to 3, the index has 12 replica shards. This parameter is effective only when `template_file` is either explicitly provided in Sink configuration or built-in. If this parameter is set, it would override the value in index template file. For more information, see [Create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/).

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
