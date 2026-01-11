---
layout: default
title: Prometheus
parent: Sinks
grand_parent: Pipelines
nav_order: 59
---

# Prometheus sink

The prometheus sink buffers OpenTelemetry metrics and exports them in Prometheus TimeSeries format via the Remote Write API. At this time, it is specifically designed to support Amazon Managed Service for Prometheus, utilizing the configured url as the remote write endpoint.

The `prometheus` sink only sends metric type data to prometheus server. All other types of data are sent to [DLQ pipeline](#_data-prepper/pipelines/pipeline.md), if configured

To ensure compatibility, the prometheus sink sorts metrics by timestamp per batch before sending them to the server. It also supports an out-of-order window, enabling the ingestion of metrics with older timestamps.

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

## IAM permissions


To use the `prometheus` sink, configure AWS Identify and Access Management (IAM) to grant Data Prepper permissions to write to Amazon Managed Prometheus. You can use a configuration similar to the following JSON configuration:

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

`url` | Yes       | String                                         | The full URL of the Prometheus remote write endpoint.
`encoding` | No   | String                                         | The compression format used for requests. Only snappy is supported. Default is snappy.
`remote_write_version` | No | String                               | The version of the Prometheus remote write protocol. Only 0.1.0 is supported.
`content_type` | No | String                                       | The MIME type of the body. Only application/x-protobuf is supported.
`out_of_order_time_window` | No      | Duration                     | The time window allowed for late-arriving data points. Data older than this window relative to the latest point will be dropped.
`sanitize_names` | No | Boolean                                    | Determines whether metric and label names are sanitized to comply with Prometheus naming conventions. Default is true.
`connection_timeout` | No | Duration                               | The maximum time allowed to establish an HTTP connection. Default is 60s.
`idle_timeout` | No | Duration                                     | The maximum time an idle HTTP connection remains open before being closed. Default is 60s.
`request_timeout` | No | Duration                                  | The maximum time allowed for a full end-to-end HTTP request to complete. Default is 60s.
`threshold` | No      | [Threshold](#threshold-configuration)      | Configuration for batching and flushing timeseries data. Defaults: max_events=1000, max_request_size=1mb, flush_interval=10s.
`max_retries` | No       | Integer                                 | The maximum number of attempts for failed ingestion requests. Default is 5.
`aws.region`        | String  | Yes                                | The AWS Region where the Amazon Managed Service for Prometheus (AMP) workspace is located.
`aws.sts_role_arn`  | String  | No                                 | The IAM Role ARN to assume for authentication when sending data to AMP.
