---
layout: default
title: AWS Lambda
parent: Processors
grand_parent: Pipelines
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/aws-lambda/
---

# AWS Lambda processor

The [AWS Lambda](https://aws.amazon.com/lambda/) integration allows you to use serverless computing capabilities within your OpenSearch Data Prepper pipelines for flexible event processing and data routing.

## AWS Lambda processor configuration

The `aws_lambda` processor enables invocation of an AWS Lambda function within your Data Prepper pipeline in order to process events. It supports both synchronous and asynchronous invocations based on your use case.

## Configuration fields

You can configure the processor using the following configuration options.

Field                | Type    | Required | Description                                                                 
-------------------- | ------- | -------- | ---------------------------------------------------------------------------- 
`function_name`      | String  | Required | The name of the AWS Lambda function to invoke. Must be 3--500 characters.                                         
`aws.region`         | String  | Required | The AWS Region in which the Lambda function is located.                         
`aws.sts_role_arn`   | String  | Optional | The Amazon Resource Name (ARN) of the role to assume before invoking the Lambda function. Must be 20--2048 characters.               
`aws.sts_external_id` | String | Optional | An external ID for STS role assumption. Must be 2--1224 characters.
`aws.sts_header_overrides` | Map | Optional | STS header overrides. Maximum of 5 headers supported.
`client.max_retries` | Integer | Optional | The maximum number of retries for failed invocations. Default is `3`.             
`client.api_call_timeout` | Duration | Optional | The API call timeout. Default is `60s`.
`client.connection_timeout` | Duration | Optional | The SDK connection timeout. Default is `60s`.
`client.max_concurrency` | Integer | Optional | The maximum number of concurrent threads on the client. Default is `200`.
`client.base_delay`  | Duration | Optional | The base delay for the exponential backoff. Default is `100ms`.
`client.max_backoff` | Duration | Optional | The maximum backoff time for the exponential backoff. Default is `20s`.
`batch`              | Object  | Optional | The batch settings for the Lambda invocations. Default is `key_name = "events"`. Default threshold is `event_count=100`, `maximum_size="5mb"`, and `event_collect_timeout = 10s`.                            
`lambda_when`        | String  | Optional | A conditional expression that determines when to invoke the Lambda processor.     
`response_codec`     | Object  | Optional |  A codec configuration for parsing Lambda responses. Default is `json`.
`tags_on_failure`    | List    | Optional |  A list of tags to add to events when the Lambda function fails or encounters an exception.
`response_events_match` | Boolean | Optional | Specifies how Data Prepper interprets and processes Lambda function responses. Default is `false`.
`response_mode`      | String  | Optional | The response handling mode, either `replace` or `merge`. Default is `replace`.
`keys`               | List    | Optional | Keys to send to the Lambda function.
`cache`              | Object  | Optional | The cache configuration. Only valid when `response_mode` is `merge` and `keys` are specified.
`cache.ttl`          | Long    | Optional | The cache time-to-live.
`cache.max_size`     | Long    | Optional | The maximum cache size. Must be between 1048576 and 10485760.
`circuit_breaker_retries` | Integer | Optional | The maximum number of circuit breaker checks before proceeding. Default is `0`.
`circuit_breaker_wait_interval` | Long | Optional | The amount of time, in milliseconds, between circuit breaker checks. Default is `1000ms`.

The following is an example configuration:

```yaml
processors:
  - aws_lambda:
      function_name: my-lambda-function
      response_events_match: false
      response_mode: replace
      aws:
        region: us-east-1
        sts_role_arn: arn:aws:iam::123456789012:role/my-lambda-role
      client:
        max_retries: 3
        api_call_timeout: PT60S
        connection_timeout: PT60S
        max_concurrency: 200
        base_delay: "PT0.1S"
        max_backoff: "PT20S"
      batch:
        key_name: events
        threshold:
          event_count: 100
          maximum_size: 5mb
          event_collect_timeout: PT10S
      lambda_when: "/some_key == null"
      keys: ["key1", "key2"]
      cache:
        ttl: 3600
        max_size: 5242880
      circuit_breaker_retries: 0
      circuit_breaker_wait_interval: 1000
      tags_on_failure: ["lambda_failed"]
```
{% include copy.html %}

## Usage

The processor supports the following invocation types:

- `request-response`: The processor waits for Lambda function completion before proceeding.
- `event`: The function is triggered asynchronously without waiting for a response.

### Batch processing

When enabled, events are aggregated and sent in bulk to optimize Lambda invocations. Batch thresholds control the event count, size limit, and timeout.

### Response handling

The processor supports two response modes:
- `replace`: Lambda response replaces the original event data (default)
- `merge`: Lambda response is merged with the original event data

### Caching

When `response_mode` is set to `merge` and `keys` are specified, the processor can cache Lambda responses to improve performance for repeated requests.

### Circuit breaker

The processor includes circuit breaker functionality to handle memory pressure situations gracefully.

### Tags on failure

Custom tags can be applied to events when Lambda processing fails or encounters exceptions using the `tags_on_failure` configuration.

## Behavior

When configured for batching, the AWS Lambda processor groups multiple events into a single request. This grouping is governed by batch thresholds, which can be based on the event count, size limit, or timeout. The processor then sends the entire batch to the Lambda function as a single payload.

## Lambda response handling

The `response_events_match` setting defines how Data Prepper handles the relationship between batch events sent to Lambda and the response received:

- `true`: Lambda returns a JSON array with results for each batched event. Data Prepper maps this array back to its corresponding original event, ensuring that each event in the batch gets the corresponding part of the response from the array.
- `false`: Lambda returns one or more events for the entire batch. Response events are not correlated with the original events. Original event metadata is not preserved in the response events. For example, when `response_events_match` is set to `true`, the Lambda function is expected to return the same number of response events as the number of original requests, maintaining the original order.

## Limitations

Note the following limitations:

- Payload limitation: 6 MB payload limit
- Response codec: JSON-only codec support

## Integration testing

Integration tests for this plugin are executed separately from the main Data Prepper build process. Use the following Gradle command to run these tests:

```bash
./gradlew :data-prepper-plugins:aws-lambda:integrationTest -Dtests.processor.lambda.region="us-east-1" -Dtests.processor.lambda.functionName="lambda_test_function"  -Dtests.processor.lambda.sts_role_arn="arn:aws:iam::123456789012:role/dataprepper-role
```
{% include copy.html %}
