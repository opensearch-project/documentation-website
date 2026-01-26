---
layout: default
title: Prometheus
parent: Sinks
grand_parent: Pipelines
nav_order: 59
---

# Prometheus sink

The Prometheus sink buffers OpenTelemetry metrics and exports them in Prometheus time series format using the Remote Write API. It is currently designed to work with Amazon Managed Service for Prometheus, using the configured `url` as the remote write endpoint.

The `prometheus` sink processes only metric data. All other data types are sent to the [DLQ pipeline]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/dlq/), if it is configured.

To ensure compatibility, the Prometheus sink sorts metrics by timestamp within each batch before sending them to the server. It also supports an out-of-order window, which allows ingestion of metrics with older timestamps.

## Usage

The following example creates a pipeline configured with a `prometheus` sink. It contains additional options for customizing the event and size thresholds for the pipeline:

```yaml
pipeline:
  ...
  sink:
   - prometheus:
        url: "https://aps-workspaces.us-west-2.amazonaws.com/workspaces/ws-1111111-2222/api/v1/remote_write"
        idle_timeout: PT10M
        max_retries: 3
        out_of_order_window: PT10S
        threshold:
          max_events: 500
          flush_interval: PT10S
          max_request_size: 10mb
        aws:
          region: us-east-1
          sts_role_arn: arn:aws:iam::123456789012:role/Data-Prepper
        max_retries: 3
```
{% include copy.html %}

## IAM permissions

To use the `prometheus` sink, configure AWS Identity and Access Management (IAM) to grant OpenSearch Data Prepper permissions to write to Amazon Managed Service for Prometheus. You can use a configuration similar to the following JSON configuration:

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

Option | Required | Type                                            | Description
:--- | :--- | :--- | :--- 
`url` | Yes       | String                                         | The full URL of the Prometheus remote write endpoint.
`encoding` | No   | String                                         | The compression format used for requests. Only `snappy` is supported. Default is `snappy`.
`remote_write_version` | No | String                               | The version of the Prometheus remote write protocol. Only `0.1.0` is supported.
`content_type` | No | String                                       | The MIME type of the body. Only `application/x-protobuf` is supported.
`out_of_order_time_window` | No      | Duration                     | The time window allowed for late-arriving data points. Data older than this window relative to the latest point will be dropped.
`sanitize_names` | No | Boolean                                    | Determines whether metric and label names are sanitized in order to comply with Prometheus naming conventions. Default is `true`.
`connection_timeout` | No | Duration                               | The maximum amount of time allowed to establish an HTTP connection. Default is `60s`.
`idle_timeout` | No | Duration                                     | The maximum amount of time an idle HTTP connection remains open before being closed. Default is `60s`.
`request_timeout` | No | Duration                                  | The maximum amount of time allowed for a full end-to-end HTTP request to complete. Default is `60s`.
`threshold` | No      | [Threshold configuration](#threshold-configuration)      | Configuration for batching and flushing time-series data.
`max_retries` | No       | Integer                                 | The maximum number of attempts for failed ingestion requests. Default is `5`.
`aws.region`        | String  | Yes                                | The AWS Region where the Amazon Managed Service for Prometheus workspace is located.
`aws.sts_role_arn`  | String  | No                                 | The IAM role Amazon Resource Name (ARN) to assume for authentication when sending data to Amazon Managed Service for Prometheus.

## Threshold configuration

Use the following options to configure batching and flushing behavior for the Prometheus sink.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`max_events` | No | Integer | The maximum number of events to accumulate before flushing to Prometheus. Default is `1000`.
`max_request_size` | No | String | The maximum size of the request payload before flushing. Default is `1mb`.
`flush_interval` | No | Duration | The maximum amount of time to wait before flushing events. Default is `10s`.
