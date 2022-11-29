---
layout: default
title: Sources
parent: Reference
nav_order: 30
---

# Sources

Sources define where your data comes from.

## otel_trace_source

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

## http_source

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

## otel_metrics_source

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


## s3

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

### sqs

The following are configure usage of Amazon SQS in the S3 Source plugin.

Option | Required | Type | Description
:--- | :--- | :--- | :---
queue_url | Yes | String | The URL of the Amazon SQS queue from which messages are received.
maximum_messages | No | Integer | The maximum number of messages to receive from the SQS queue in any single request. Default is `10`.
visibility_timeout | No | Duration | The visibility timeout to apply to messages read from the SQS queue. This should be set to the amount of time that Data Prepper may take to read all the S3 objects in a batch. Default is `30s`.
wait_time | No | Duration | The time to wait for long polling on the SQS API. Default is `20s`.
poll_delay | No | Duration | A delay to place between reading and processing a batch of SQS messages and making a subsequent request. Default is `0s`.


### aws

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