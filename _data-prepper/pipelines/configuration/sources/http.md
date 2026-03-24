---
layout: default
title: HTTP
parent: Sources
grand_parent: Pipelines
nav_order: 30
redirect_from:
  - /data-prepper/pipelines/configuration/sources/http-source/
---

# HTTP source

The `http` plugin accepts HTTP requests from clients. The following table describes options you can use to configure the `http` source.

Option | Required | Type | Description
:--- | :--- | :--- | :---
port | No | Integer | The port that the source is running on. Default value is `2021`. Valid options are between `0` and `65535`.
path | No | String | The URI path for log ingestion should start with a forward slash (/), for example, `/${pipelineName}/logs`. The `${pipelineName}` placeholder will be replaced with the pipeline name. The default value is `/log/ingest`.
health_check_service | No | Boolean | Enables the health check service on the `/health` endpoint on the defined port. Default value is `false`.
unauthenticated_health_check | No | Boolean | Determines whether or not authentication is required on the health check endpoint. OpenSearch Data Prepper ignores this option if no authentication is defined. Default value is `false`.
request_timeout | No | Integer | The request timeout, in milliseconds. Default value is `10000`.
thread_count | No | Integer | The number of threads to keep in the ScheduledThreadPool. Default value is `200`.
max_connection_count | No | Integer | The maximum allowed number of open connections. Default value is `500`.
max_pending_requests | No | Integer | The maximum allowed number of tasks in the `ScheduledThreadPool` work queue. Default value is `1024`.
max_request_length | No | ByteCount | The maximum number of bytes allowed in the payload of a single HTTP request. Default value is `10mb`.
authentication | No | Object | An authentication configuration. By default, this creates an unauthenticated server for the pipeline. This uses pluggable authentication for HTTPS. To use basic authentication define the `http_basic` plugin with a `username` and `password`. To provide customer authentication, use or create a plugin that implements [ArmeriaHttpAuthenticationProvider](https://github.com/opensearch-project/data-prepper/blob/1.2.0/data-prepper-plugins/armeria-common/src/main/java/com/amazon/dataprepper/armeria/authentication/ArmeriaHttpAuthenticationProvider.java).
ssl | No | Boolean | Enables TLS/SSL. Default value is `false`.
ssl_certificate_file | Conditionally | String | The SSL certificate chain file path or Amazon Simple Storage Service (Amazon S3) path (for example, `s3://<bucketName>/<path>`). Required if `ssl` is set to `true` and `use_acm_certificate_for_ssl` is set to `false`.
ssl_key_file | Conditionally | String | The SSL key file path or Amazon S3 path (for example, `s3://<bucketName>/<path>`). Required if `ssl` is set to `true` and `use_acm_certificate_for_ssl` is set to `false`.
use_acm_certificate_for_ssl | No | Boolean | Enables TLS/SSL using the certificate and private key from AWS Certificate Manager (ACM). Default is `false`.
acm_certificate_arn | Conditionally | String | The ACM certificate Amazon Resource Name (ARN). The ACM certificate takes preference over Amazon S3 or a local file system certificate. Required if `use_acm_certificate_for_ssl` is set to true.
acm_private_key_password | No | String | ACM private key password that decrypts the private key. If not provided, Data Prepper generates a random password.
acm_certificate_timeout_millis | No | Integer | Timeout, in milliseconds, that ACM takes to get certificates. Default value is 120000.
aws_region | Conditionally | String | AWS region used by ACM or Amazon S3. Required if `use_acm_certificate_for_ssl` is set to true or `ssl_certificate_file` and `ssl_key_file` is the Amazon S3 path.

<!--- ## Configuration

Content will be added to this section.--->

## Ingestion

Clients should send HTTP `POST` requests to the endpoint `/log/ingest`.

The `http` protocol only supports the JSON UTF-8 codec for incoming requests, for example, `[{"key1": "value1"}, {"key2": "value2"}]`.

## Example

The following examples demonstrate different configurations that can be used with the `http` source.

### Minimal HTTP source

The following is the minimal configuration using all default values:

```yaml
minimal-http-pipeline:
  source:
    http:
  sink:
    - stdout: {}
```
{% include copy.html %}

You can test this pipeline using the following command:

```bash
curl -s "http://localhost:2021/log/ingest" \
  -H "Content-Type: application/json" \
  --data '[{"msg":"one"},{"msg":"two"}]'
```
{% include copy.html %}

You should see the following output in the Data Prepper logs:

```
{"msg":"one"}
{"msg":"two"}
```

### Custom path using the pipeline name and health check

The following example uses a custom path, configures a custom port, and enables health checks:

```yaml
audit-pipeline:
  source:
    http:
      port: 2022
      path: "/${pipelineName}/logs"  # -> /audit-pipeline/logs
      health_check_service: true
      unauthenticated_health_check: true
  sink:
    - stdout: {}
```
{% include copy.html %}

You can use the following command to check the pipeline health:

```bash
curl -s "http://localhost:2022/health"
```
{% include copy.html %}

You can ingest data using the following command:

```bash
curl -s "http://localhost:2022/audit-pipeline/logs" \
  -H "Content-Type: application/json" \
  --data '[{"event":"login","user":"alice"}]'
```
{% include copy.html %}

### Basic authentication on the source

The following example configures a custom port and path, enables health checks, and configures basic authentication:

```yaml
secure-intake-pipeline:
  source:
    http:
      port: 2023
      path: /ingest
      authentication:
        http_basic:
          username: ingest
          password: s3cr3t
      health_check_service: true
      unauthenticated_health_check: true
  sink:
    - stdout: {}
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: admin_password
        index_type: custom
        index: demo-%{yyyy.MM.dd}
```
{% include copy.html %}

You can test this pipeline using the following command:

```bash
curl -s -u ingest:s3cr3t "http://localhost:2023/ingest" \
  -H "Content-Type: application/json" \
  --data '[{"service":"web","status":"ok"}]'
```
{% include copy.html %}

## Metrics

The `http` source includes the following metrics.

### Counters

- `requestsReceived`: Measures the total number of requests received by the `/log/ingest` endpoint.
- `requestsRejected`: Measures the total number of requests rejected (429 response status code) by the HTTP Source plugin.
- `successRequests`: Measures the total number of requests successfully processed (200 response status code) the by HTTP Source plugin.
- `badRequests`: Measures the total number of requests with either an invalid content type or format processed by the HTTP Source plugin (400 response status code).
- `requestTimeouts`: Measures the total number of requests that time out in the HTTP source server (415 response status code).
- `requestsTooLarge`: Measures the total number of requests where the size of the event is larger than the buffer capacity (413 response status code).
- `internalServerError`: Measures the total number of requests processed by the HTTP Source with a custom exception type (500 response status code).

### Timers

- `requestProcessDuration`: Measures the latency of requests processed by the HTTP Source plugin in seconds. 

### Distribution summaries

- `payloadSize`: Measures the incoming request payload size in bytes.
