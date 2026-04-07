---
layout: default
title: Prometheus
parent: Sinks
grand_parent: Pipelines
nav_order: 59
---

# Prometheus sink

The Prometheus sink buffers OpenTelemetry metrics and exports them in Prometheus time series format using the Remote Write API. It supports both open-source Prometheus and Amazon Managed Service for Prometheus (AMP).

The `prometheus` sink processes only metric data. All other data types are sent to the [DLQ pipeline]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/dlq/), if it is configured.

To ensure compatibility, the Prometheus sink sorts metrics by timestamp within each batch before sending them to the server. It also supports an out-of-order window, which allows ingestion of metrics with older timestamps.

## Usage

The following examples configure the Prometheus sink for different deployment scenarios.

### Open-source Prometheus with no authentication

To use an open-source Prometheus instance, provide an `https://` URL. To use `http://`, set `insecure` to `true`. No `aws` block is needed. Prometheus must be started with the `--web.enable-remote-write-receiver` flag:

```yaml
pipeline:
  ...
  sink:
    - prometheus:
        url: "http://localhost:9090/api/v1/write"
        insecure: true
        threshold:
          max_events: 1000
          flush_interval: PT5S
```
{% include copy.html %}

### Open-source Prometheus with HTTP Basic authentication

To authenticate with HTTP Basic credentials (for example, when Prometheus is behind a reverse proxy with basic authentication enabled), use the `authentication` block:

```yaml
pipeline:
  ...
  sink:
    - prometheus:
        url: "https://localhost:9090/api/v1/write"
        authentication:
          http_basic:
            username: "promuser"
            password: "prompass"
```
{% include copy.html %}

### AMP

To use AMP, provide the `aws` configuration block. An `https://` URL is required when using AWS authentication:

```yaml
pipeline:
  ...
  sink:
    - prometheus:
        url: "https://aps-workspaces.us-east-2.amazonaws.com/workspaces/ws-xxxxxxxx-xxxx/api/v1/remote_write"
        aws:
          region: "us-east-2"
          sts_role_arn: "arn:aws:iam::123456789012:role/data-prepper-prometheus-role"
        threshold:
          max_events: 1000
          flush_interval: PT5S
```
{% include copy.html %}

## IAM permissions

When using AMP, configure AWS Identity and Access Management (IAM) to grant OpenSearch Data Prepper permissions to write to Amazon Managed Service for Prometheus. You can use a configuration similar to the following JSON configuration:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "amp-access",
            "Effect": "Allow",
            "Action": [
                "aps:RemoteWrite"
            ],
            "Resource": "arn:aws:aps:<region>:<account-id:workspace>/<workspace-id>"
        }
    ]
}
```
{% include copy.html %}

## Configuration

Use the following options when customizing the `prometheus` sink.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`url` | Yes | String | The Prometheus Remote Write endpoint URL. Supports `https://` by default. To use `http://`, set `insecure` to `true`. When `aws` is configured, `https://` is required.
`insecure` | No | Boolean | When set to `true`, allows `http://` URLs. By default, only `https://` URLs are permitted. Default is `false`.
`encoding` | No | String | The compression format used for requests. Only `snappy` is supported. Default is `snappy`.
`remote_write_version` | No | String | The version of the Prometheus remote write protocol. Only `0.1.0` is supported.
`content_type` | No | String | The MIME type of the body. Only `application/x-protobuf` is supported.
`out_of_order_time_window` | No | Duration | The time window allowed for late-arriving data points. Data older than this window relative to the latest point will be dropped. Default is `10s`.
`sanitize_names` | No | Boolean | Determines whether metric and label names are sanitized in order to comply with Prometheus naming conventions. Default is `true`.
`connection_timeout` | No | Duration | The maximum amount of time allowed to establish an HTTP connection. Default is `60s`.
`idle_timeout` | No | Duration | The maximum amount of time an idle HTTP connection remains open before being closed. Default is `60s`.
`request_timeout` | No | Duration | The maximum amount of time allowed for a full end-to-end HTTP request to complete. Default is `60s`.
`threshold` | No | [Threshold configuration](#threshold-configuration) | Configuration for batching and flushing time-series data.
`max_retries` | No | Integer | The maximum number of attempts for failed ingestion requests. Uses exponential backoff with jitter on `retryable` status codes (`429`, `502`, `503`, or `504`). Default is `5`.
`aws` | No | [AWS configuration](#aws-configuration) | AWS configuration for AWS Signature Version 4 signing. When present, requests are signed with AWS credentials. Cannot be used with `authentication`.
`authentication` | No | [Authentication configuration](#authentication-configuration) | HTTP Basic authentication credentials. Cannot be used with `aws`.

## Threshold configuration

Use the following options to configure batching and flushing behavior for the Prometheus sink.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`max_events` | No | Integer | The maximum number of events to accumulate before flushing to Prometheus. Default is `1000`.
`max_request_size` | No | String | The maximum size of the request payload before flushing. Default is `1mb`.
`flush_interval` | No | Duration | The maximum amount of time to wait before flushing events. Default is `10s`.

## AWS configuration

When an `aws` block is present, requests are automatically signed with Signature Version 4. An `https://` URL is required. The AWS configuration supports the following options.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`region` | No | String | The AWS Region to use for credentials. Defaults to [standard SDK behavior to determine the region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
`sts_role_arn` | No | String | The STS role to assume for requests to AWS. Defaults to `null`, which uses [standard SDK credential behavior](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`sts_header_overrides` | No | Map | A map of header overrides to make when assuming the IAM role.
`sts_external_id` | No | String | An optional external ID to use when assuming the IAM role.

## Authentication configuration

The `authentication` block supports HTTP Basic authentication. It cannot be used together with `aws` (Signature Version 4 signing). The authentication configuration supports the following options.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`http_basic.username` | Yes | String | The username for HTTP Basic authentication.
`http_basic.password` | Yes | String | The password for HTTP Basic authentication.
