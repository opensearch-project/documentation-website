---
layout: default
title: AWS Lambda
parent: Sinks
grand_parent: Pipelines
nav_order: 10
---

# AWS Lambda sink

This page explains how to configure and use [AWS Lambda](https://aws.amazon.com/lambda/) with OpenSearch Data Prepper, enabling Lambda functions to serve as both processors and sinks.

## Configuration

Configure the Lambda sink using the following parameters.

Field             | Type    | Required | Description                                                                 
--------------------| ------- | -------- | ---------------------------------------------------------------------------- 
`function_name`     | String  | Yes      | The name of the AWS Lambda function to invoke.                               
`invocation_type`   | String  | No       | Specifies the invocation type. Default is `event`.             
`aws.region`        | String  | Yes      | The AWS Region in which the Lambda function is located.                         
`aws.sts_role_arn`  | String  | No       | The Amazon Resource Name (ARN) of the role to assume before invoking the Lambda function.               
`max_retries`       | Integer | No       | The maximum number of sink-level retries if the Lambda invocation fails. This controls Data Prepper's retry logic. Default is `3`.
`client.max_retries` | Integer | No | The maximum number of AWS SDK client-level retries for individual API calls. This controls the underlying SDK retry mechanism for network or service errors. Default is `3`.             
`client.api_call_timeout` | Duration | No | The total timeout for the entire API call including all retries. Default is `60s`.
`client.api_call_attempt_timeout` | Duration | No | The timeout for each individual retry attempt. If not specified, AWS SDK defaults are used.
`client.connection_timeout` | Duration | No | The SDK connection timeout. Default is `60s`.
`client.read_timeout` | Duration | No | The amount of time the SDK waits for data to be read from an established connection. If not specified, AWS SDK defaults are used.
`client.max_concurrency` | Integer | No | The maximum number of concurrent threads in the client. Default is `200`.
`client.base_delay`  | Duration | No | The base delay for the exponential backoff. Default is `100ms`.
`client.max_backoff` | Duration | No | The maximum backoff time for the exponential backoff. Default is `20s`.             
`batch`             | Object  | No       | Optional batch settings for Lambda invocations. Default is `key_name = events`. Default threshold is `event_count=100`, `maximum_size="5mb"`, and `event_collect_timeout = 10s`.
`lambda_when`       | String  | No       | A conditional expression that determines when to invoke the Lambda sink.          
`dlq`               | Object  | No       | The dead-letter queue (DLQ) configuration for failed invocations.                

#### Example configuration

```yaml
sink:
  - aws_lambda:
      function_name: "my-lambda-sink"
      invocation_type: "event"
      aws:
        region: "us-west-2"
        sts_role_arn: "arn:aws:iam::123456789012:role/my-lambda-sink-role"
      max_retries: 5
      client:
        max_retries: 3
        api_call_timeout: PT60S
        api_call_attempt_timeout: PT30S  # Optional: per-attempt timeout
        connection_timeout: PT60S
        read_timeout: PT15M              # Optional: for long-running Lambda functions
        max_concurrency: 200
        base_delay: PT0.1S
        max_backoff: PT20S
      batch:
        key_name: "events"
        threshold:
          event_count: 50
          maximum_size: "3mb"
          event_collect_timeout: PT5S
      lambda_when: "event['type'] == 'log'"
      dlq:
        region: "us-east-1"
        sts_role_arn: "arn:aws:iam::123456789012:role/my-sqs-role"
        bucket: "<<your-dlq-bucket-name>>"
```
{% include copy.html %}

## Timeout configuration

The AWS Lambda sink supports multiple timeout layers following AWS SDK best practices:

- `api_call_timeout`: The total amount of time for the entire API call including all retries.
- `api_call_attempt_timeout`: The time limit for each individual attempt.
- `read_timeout`: The amount of time to wait for data from an established connection.

For Lambda functions that run for longer than 60 seconds, configure both `api_call_timeout` and `read_timeout` to appropriate values. 

## Usage

The invocation types are as follows:

- `event` (Default): Executes functions asynchronously without waiting for responses.  
- `request-response` (Sink only): Executes functions synchronously, though responses are not processed.
- `batch`: Automatically groups events based on configured thresholds. 
- `dlq`: Supports the DLQ configuration for failed invocations after retry attempts.

Data Prepper components use an AWS Identity and Access Management (IAM) role assumption, `aws.sts_role_arn`, for secure Lambda function invocation and respect Lambda's concurrency limits during event processing. For more information, see the [AWS Lambda documentation](https://docs.aws.amazon.com/lambda).
{: .note}

## Developer guide

Integration tests must be executed separately from the main Data Prepper build. Execute them with the following command:

```bash
./gradlew :data-prepper-plugins:aws-lambda:integrationTest -Dtests.sink.lambda.region="us-east-1" -Dtests.sink.lambda.functionName="lambda_test_function"  -Dtests.sink.lambda.sts_role_arn="arn:aws:iam::123456789012:role/dataprepper-role
```
{% include copy.html %}
