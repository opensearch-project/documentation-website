---
layout: default
title: aws_lambda
parent: Processors
grand_parent: Pipelines
nav_order: 10
---

# aws_lambda 

You can use the `aws_lambda` processor to invoke AWS Lambda functions synchronously or asynchronously to process events in your Data Prepper pipeline. The [AWS Lambda](https://aws.amazon.com/lambda/) integration allows developers to use serverless computing capabilities within their Data Prepper pipelines for flexible event processing and data routing.

## Processor configuration

The following example configuration show a typical AWS Lambda processor configuration in Data Prepper, including the key configuration fields and their usage:

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

## Configuring the processor

Using the batch configuration options, the `aws_lambda` processor can group multiple events into a single request. Events are collected until eaching defined thresholds for event count, size limit, or timeout, then sent as one payload to the Lambda function.

### Configuration fields

You can configure the processor using the following configuration options. 

| Field             | Type     | Required | Default | Description |
|-------------------|----------|----------|---------|-------------|
| `function_name`   | String   | Required | -       | The name of the AWS Lambda function to invoke. Must be between 3 and 500 characters. |
| `aws`             | Object   | Required | -       | AWS authentication settings.                                                         |
| `invocation_type` | String   | Optional | `request-response` | Specifies the invocation type. Choose either `request-response` or `EVENT`. |
| `client`          | Object   | Optional | -       | The AWS SDK client configuration.                                                    |
| `batch`           | Object   | Optional | -       | Optional batch settings for Lambda invocations.                                      |     
| `response_codec`  | Object   | Optional | -       | The Lambda response parsing configuration.                                           |
| `response_events_match` | Boolean  | Optional | `false` | The Lambda response handling behavior                                           |
| `lambda_when`     | String | Optional   | -       | A conditional expression that determines when to invoke the processor.               |
| `tags_on_failure` | List   | Optional   | `[]`    | The tags applied on Lambda execution failures.                                       |

### AWS authentication options

You can configure the processor using the following AWS authentication options. 

| Field    | Type   | Required | Description |
|----------|--------|----------|-------------|
| `region` | String | Required | The AWS region where the Lambda function is deployed.                                            |
| `sts_role_arn`| String | Optional | The Amazon Resource Number (ARN) of the role to assume before invoking the Lambda function. |
| `sts_external_id` | String | Optional | The external ID to use when assuming the role.                                          |
| `sts_header_overrides` | Map | Optional | The map of headers to override in the STS request. Maximum of five headers allowed.   |

### Client options

You can configure the processor using the following client options. 

| Field              | Type     | Default | Description                                       |
|--------------------|----------|---------|---------------------------------------------------|
| `max_retries`      | Integer  | 3       | Maximum number of retries for failed requests.    |
| `api_call_timeout` | Duration | 60s     | Timeout for API calls.                            |
| `connection_timeout`| Duration | 60s    | Timeout for establishing a connection.            |
| `max_concurrency`  | Integer  | 200     | Maximum number of concurrent connections.         |
| `base_delay`       | Duration | 100ms   | Base delay for exponential backoff.               |
| `max_backoff`      | Duration | 20s     | Maximum backoff time for exponential backoff.     |

### Batch options

You can configure the processor using the following batch options.

| Field     | Type   | Default | Description                               |
|-----------|--------|---------|-------------------------------------------|
| `key_name` | String | `events` | Key name for the batch of events.       |
| threshold | Object | -       | Threshold options for batching.           |

### Threshold options

You can configure the processor using the following threshold options.

| Field                | Type     | Default | Description                                    |
|----------------------|----------|---------|------------------------------------------------|
| event_count          | Integer  | 100     | Maximum number of events in a batch.           |
| maximum_size         | String   | 5mb     | Maximum size of a batch.                       |
| event_collect_timeout| Duration | 10s     | Timeout for collecting events for a batch.     |

## Lambda response handling

The `response_events_match` parameter controls how Data Prepper processes Lambda function responses:

- `true`: The Lambda function returns a JSON array with results for each batched event. Data Prepper maintains event correlation by mapping each element of the response array to its matching source event in the original batch sequence.
- `false`: The Lambda function returns one or more events for the entire batch. Response events are processed independently when `response_events_match` is `false`, discarding the original event context and metadata. Conversely, setting it to `true` requires the Lambda function to return a matching array of responses that preserves the order and count of input events.

#### Example Lambda function

```
import json

def lambda_handler(event, context):
    output = []
    for input in input_arr = event['<batch-key-name>']:
        input["transformed"] = "true";
        output.append(input)
   
    return output
```
{% include copy-curl.html %}

### Limitations

Note the following limitations:

- Payload limitation: 6 MB payload limit
- Response codec: JSON-only codec support

## Integration testing

Integration tests for this plugin are executed separately from the main Data Prepper build process. Use the following Gradle command to run these tests:

```
./gradlew :data-prepper-plugins:aws-lambda:integrationTest -Dtests.processor.lambda.region="us-east-1" -Dtests.processor.lambda.functionName="lambda_test_function"  -Dtests.processor.lambda.sts_role_arn="arn:aws:iam::123456789012:role/dataprepper-role
```
{% include copy-curl.html %}
