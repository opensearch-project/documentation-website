---
layout: default
title: Prometheus
parent: Sinks
grand_parent: Pipelines
nav_order: 59
---

# Prometheus sink

The `prometheus` sink buffers and writes batches of open telemetry metrics data in Prometheus TimeSeries format to Prometheus server using remote write API.Currently, amazon managed prometheus server is supported as the prometheus server. The configured `url` provides the amazon managed prometheus server's remote write endpoint.

The `prometheus` sink only sends metric type data to prometheus server. All other types of data are sent to [DLQ pipeline](#_data-prepper/pipelines/pipeline.md), if configured

The `prometheus` sink sorts metrics by their timestamp in each batch before sending to the prometheus server.

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

`url` | Yes       | String                                         | path to prometheus server remote write endpoint
`encoding` | No   | String                                         | encoding mode (only "snappy" encoding mode is supported)
`remote_write_version` | No | String                               | remote write version number (only version "0.1.0" supported )
`content_type` | No | String                                       | content type (only "application/x-protobuf")
`out_of_order_time_window` | No      | Integer                     | Time window (in seconds) to accept late-arriving data points.
`sanitize_names` | No | Boolean                                    | indicates if metric and label names should be sanitized or not. Default `true`.
`connection_timeout` | No | Duration                               | The amount of time allowed for http request connection establishment. Default is `60s`.
`idle_timeout` | No | Duration                                     | The maximum amount of time an HTTP connection is allowed to remain open but inactive (no data sent or received) before it is automatically closed. Default is `60s`.
`request_timeout` | No | Duration                                  | The maximum amount of time a client is willing to wait for an HTTP request to complete end-to-end before aborting it. Default is `60s`.
`threshold` | No      | [Threshold](#threshold-configuration)      | Condition for sending timeseries to Prometheus Server. Default threshold is `max_Events=1000`, `max_request_size=1mb`, and `flush_interval=10s`
`max_retries` | No       | Integer                                 | The maximum number of retries for Prometheus ingestion requests. Default is `5`.
`aws.region`        | String  | Yes                                | The AWS Region in which the AMP Server is located.                         
`aws.sts_role_arn`  | String  | No                                 | The Amazon Resource Name (ARN) of the role to assume before invoking the AMP Server.



