---
layout: default
title: Configuring Data Prepper
parent: Managing Data Prepper
nav_order: 5
---

# Configuring Data Prepper

This is the reference for Data Prepper configuration files (data-prepper-config.yaml). These are general Data Prepper configurations independent from pipelines.

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

#### General options for peer forwarding

Option | Required | Type | Description
:--- | :--- | :--- | :---
port | No | Integer | The peer forwarding server port. Valid options are between 0 and 65535. Defaults is 4994.
request_timeout | No | Integer | Request timeout for the peer forwarder HTTP server in milliseconds. Default is 10000.
server_thread_count | No | Integer | Number of threads used by the peer forwarder server. Default is 200.
client_thread_count | No | Integer | Number of threads used by the peer forwarder client. Default is 200.
max_connection_count | No | Integer | Maximum number of open connections for the peer forwarder server. Default is 500.
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

