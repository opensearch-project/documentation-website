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
`function_name`      | String  | Required | The name of the AWS Lambda function to invoke.                               
`invocation_type`    | String  | Required | Specifies the invocation type, either `request-response` or `event`. Default is `request-response`.           
`aws.region`         | String  | Required | The AWS Region in which the Lambda function is located.                         
`aws.sts_role_arn`   | String  | Optional | The Amazon Resource Name (ARN) of the role to assume before invoking the Lambda function.               
`max_retries`        | Integer | Optional | The maximum number of retries for failed invocations. Default is `3`.             
`batch`              | Object  | Optional | The batch settings for the Lambda invocations. Default is `key_name = "events"`. Default threshold is `event_count=100`, `maximum_size="5mb"`, and `event_collect_timeout = 10s`.                            
`lambda_when`        | String  | Optional | A conditional expression that determines when to invoke the Lambda processor.     
`response_codec`     | Object  | Optional |  A codec configuration for parsing Lambda responses. Default is `json`.
`tags_on_match_failure` | List | Optional |  A list of tags to add to events when Lambda matching fails or encounters an unexpected error.
`sdk_timeout`        | Duration| Optional | Configures the SDK's client connection timeout period. Default is `60s`. 
`response_events_match` | Boolean | Optional | Specifies how Data Prepper interprets and processes Lambda function responses. Default is `false`.
`client`            | Object  | Optional | The client configuration.
`api_call_timeout`   | Duration | Optional | The amount of time that the SDK maintains the API call before timing out, in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Durations).
`base_delay`         | Duration | Optional | The base delay for exponential backoff, in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Durations).
`connection_timeout` | Duration | Optional | The amount of time that the SDK maintains the connection to the client before timing out, in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Durations).
`max_backoff`        | Duration | Optional | The maximum backoff time for exponential backoff, in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Durations).
`max_concurrency`    | Integer  | Optional | The maximum concurrency defined on the client side. 
`max_retries`        | Integer | Optional | The maximum number of retries before failing.  


#### Example configuration

```
processors:
  - aws_lambda:
      function_name: "my-lambda-function"
      invocation_type: "request-response"
      response_events_match: false
      client:
        connection_timeout: PT5M
        api_call_timeout: PT5M
      aws:
        region: "us-east-1"
        sts_role_arn: "arn:aws:iam::123456789012:role/my-lambda-role"
      max_retries: 3
      batch:
        key_name: "events"
        threshold:
          event_count: 100
          maximum_size: "5mb"
          event_collect_timeout: PT10S
      lambda_when: "event['status'] == 'process'"

```
{% include copy.html %}

## Usage

The processor supports the following invocation types:

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

## Limitations

Note the following limitations:

- Payload limitation: 6 MB payload limit
- Response codec: JSON-only codec support

## Integration testing

Integration tests for this plugin are executed separately from the main Data Prepper build process. Use the following Gradle command to run these tests:

```
./gradlew :data-prepper-plugins:aws-lambda:integrationTest -Dtests.processor.lambda.region="us-east-1" -Dtests.processor.lambda.functionName="lambda_test_function"  -Dtests.processor.lambda.sts_role_arn="arn:aws:iam::123456789012:role/dataprepper-role
```
{% include copy.html %}
