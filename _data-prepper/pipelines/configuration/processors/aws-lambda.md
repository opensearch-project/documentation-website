---
layout: default
title: aws_lambda
parent: Processors
grand_parent: Pipelines
nav_order: 10
---

# aws_lambda integration for Data Prepper

The [AWS Lambda](https://aws.amazon.com/lambda/) integration allows developers to use serverless computing capabilities within their Data Prepper pipelines for flexible event processing and data routing.

## AWS Lambda processor configuration

The `aws_lambda` processor enables invocation of an AWS Lambda function within your Data Prepper pipeline in order to process events. It supports both synchronous and asynchronous invocations based on your use case.

## Configuration fields

You can configure the processor using the following configuration options.

# AWS Lambda Processor and Sink for Data Prepper

This document provides the configuration details and usage instructions for integrating AWS Lambda with Data Prepper, both as a processor and as a sink.

## AWS Lambda Processor

The AWS Lambda processor allows you to invoke an AWS Lambda function in your Data Prepper pipeline to process events. This can be used for synchronous or asynchronous invocations based on your requirements.

### Configuration Fields

| Field                 | Type     | Required | Default          | Description                                                                                                       |
|-----------------------|----------|----------|------------------|-------------------------------------------------------------------------------------------------------------------|
| function_name         | String   | Yes      | -                | The name of the AWS Lambda function to invoke. Must be between 3 and 500 characters.                              |
| invocation_type       | String   | No       | request-response | Specifies the invocation type: either request-response or EVENT.                                                  |
| aws                   | Object   | Yes      | -                | AWS authentication options.                                                                                       |
| client                | Object   | No       | -                | Client options for AWS SDK.                                                                                       |
| batch                 | Object   | No       | -                | Batch options for Lambda invocations.                                                                             |
| response_codec        | Object   | No       | -                | Codec configuration for parsing Lambda responses.                                                                 |
| response_events_match | Boolean  | No       | false            | Defines how Data Prepper treats the response from Lambda.                                                         |
| lambda_when           | String   | No       | -                | Defines a condition for when to use this processor.                                                               |
| tags_on_failure       | List     | No       | []               | List of tags to be set on the event when Lambda fails or an exception occurs.                                     |

### AWS Authentication Options

| Field                | Type   | Required | Description                                                                    |
|----------------------|--------|----------|--------------------------------------------------------------------------------|
| region               | String | Yes      | The AWS region where the Lambda function is located.                           |
| sts_role_arn         | String | No       | ARN of the role to assume before invoking the Lambda function.                 |
| sts_external_id      | String | No       | External ID to use when assuming the role.                                     |
| sts_header_overrides | Map    | No       | Map of headers to override in the STS request. Maximum of 5 headers allowed.   |

### Client Options

| Field              | Type     | Default                | Description                                                           |
|--------------------|----------|------------------------|-----------------------------------------------------------------------|
| max_retries        | Integer  | 3                      | Maximum number of retries for failed requests.                        |
| api_call_timeout   | Duration | 60s                    | Timeout for API calls.                                                |
| connection_timeout | Duration | 60s                    | Timeout for establishing a connection.                                |
| max_concurrency    | Integer  | 200                    | Maximum number of concurrent connections.                             |
| base_delay         | Duration | 100ms                  | Base delay for exponential backoff.                                   |
| max_backoff        | Duration | 20s                    | Maximum backoff time for exponential backoff.                         |

### Batch Options

| Field     | Type   | Default | Description                               |
|-----------|--------|---------|-------------------------------------------|
| key_name  | String | events  | Key name for the batch of events.         |
| threshold | Object | -       | Threshold options for batching.           |

#### Threshold Options

| Field                | Type     | Default | Description                                    |
|----------------------|----------|---------|------------------------------------------------|
| event_count          | Integer  | 100     | Maximum number of events in a batch.           |
| maximum_size         | String   | 5mb     | Maximum size of a batch.                       |
| event_collect_timeout| Duration | 10s     | Timeout for collecting events for a batch.     |

#### Example configuration

```
processors:
  - aws_lambda:
      function_name: "my-lambda-function"
      invocation_type: "request-response"
      response_events_match: false
      aws:
        region: "us-east-1"
        sts_role_arn: "arn:aws:iam::123456789012:role/my-lambda-role"
      client:
        max_retries: 3
      batch:
        key_name: "events"
        threshold:
          event_count: 100
          maximum_size: "5mb"
          event_collect_timeout: PT10S
      lambda_when: "/loglevel == 'INFO'"
      tags_on_failure: ["lambda_error", "processing_failed"]

```
{% include copy-curl.html %}

## Usage

The processor supports the following:
- `request-response`: The processor waits for Lambda function completion before proceeding.
- `event`: The function is triggered asynchronously without waiting for a response.
- `batch`: When enabled, events are aggregated and sent in bulk to optimize Lambda invocations. Batch thresholds control the event count, size limit, and timeout.
- `codec`: JSON is used for both request and response codecs. Lambda must return JSON array outputs.
- `tags_on_match_failure`: Custom tags can be applied to events when Lambda processing fails or encounters unexpected issues.

## Behavior

When configured for batching, the AWS Lambda processor groups multiple events into a single request. This grouping is governed by batch thresholds, which can be based on the event count, size limit, or timeout. The processor then sends the entire batch to the Lambda function as a single payload.

## Lambda response handling

The `response_events_match` setting defines how Data Prepper handles the relationship between batch events sent to Lambda and the response received:

- `true`: Lambda returns a JSON array with results for each batched event. Data Prepper maps this array back to its corresponding original event, ensuring that each event in the batch gets the corresponding part of the response from the array.
- `false`: Lambda returns one or more events for the entire batch. Response events are not correlated with the original events. Original event metadata is not preserved in the response events. For example, when `response_events_match` is set to `true`, the Lambda function is expected to return the same number of response events as the number of original requests, maintaining the original order.

Note: Return from lambda should always be an array

## Limitations

Note the following limitations:

- Payload limitation: 6 MB payload limit
- Response codec: JSON-only codec support

- ## Example Lambda
```
import json

def lambda_handler(event, context):
    output = []
    for input in input_arr = event['<batch-key-name>']:
        input["transformed"] = "true";
        output.append(input)
   
    return output
```

## Integration testing

Integration tests for this plugin are executed separately from the main Data Prepper build process. Use the following Gradle command to run these tests:

```
./gradlew :data-prepper-plugins:aws-lambda:integrationTest -Dtests.processor.lambda.region="us-east-1" -Dtests.processor.lambda.functionName="lambda_test_function"  -Dtests.processor.lambda.sts_role_arn="arn:aws:iam::123456789012:role/dataprepper-role
```

{% include copy-curl.html %}
