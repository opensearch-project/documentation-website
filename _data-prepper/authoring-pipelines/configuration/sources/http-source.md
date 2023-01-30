---
layout: default
title: http_source
parent: Sources
grand_parent: Authoring pipelines
nav_order: 5
---

# http_source

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

<!--- ## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section. --->