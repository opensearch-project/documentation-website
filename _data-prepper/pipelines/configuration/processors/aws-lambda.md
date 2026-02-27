---
layout: default
title: AWS Lambda
parent: Processors
grand_parent: Pipelines
nav_order: 40
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
`client.api_call_attempt_timeout` | Duration | Optional | The timeout for individual API call attempts. If not specified, AWS SDK defaults are used.
`client.connection_timeout` | Duration | Optional | The SDK connection timeout. Default is `60s`.
`client.read_timeout` | Duration | Optional | The amount of time the SDK waits for data to be read from an established connection. If not specified, AWS SDK defaults are used.
`client.max_concurrency` | Integer | Optional | The maximum number of concurrent threads on the client. Default is `200`.
`client.base_delay`  | Duration | Optional | The base delay for the exponential backoff. Default is `100ms`.
`client.max_backoff` | Duration | Optional | The maximum backoff time for the exponential backoff. Default is `20s`.
`batch`              | Object  | Optional | The batch settings for the Lambda invocations. Contains `key_name` (default: `"events"`) and `threshold` object with `event_count` (default: `100`), `maximum_size` (default: `"5mb"`), and `event_collect_timeout` (default: `10s`). See [Batch processing](#batch-processing) for details.                            
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
        api_call_attempt_timeout: PT30S  # Optional: per-attempt timeout
        connection_timeout: PT60S
        read_timeout: PT15M              # Optional: for long-running Lambda functions
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

## Timeout configuration

The AWS Lambda processor supports multiple timeout layers following AWS SDK best practices:

- `api_call_timeout`: The total amount of time for the entire API call including all retries.
- `api_call_attempt_timeout`: The time limit for each individual attempt.
- `read_timeout`: The amount of time to wait for data from an established connection.

For Lambda functions that run for longer than 60 seconds, configure both `api_call_timeout` and `read_timeout` to appropriate values. The `api_call_attempt_timeout` enforces a per-attempt timeout, enabling fast failure of slow requests while preserving overall retry behavior.

## Usage

The processor supports the following invocation types:

- `request-response`: The processor waits for Lambda function completion before proceeding.
- `event`: The function is triggered asynchronously without waiting for a response.

### Batch processing

When enabled, events are aggregated and sent in bulk to optimize Lambda invocations. The `batch` configuration has the following structure:

- `key_name`: The key under which events are grouped in the payload sent to Lambda (default: `"events"`).
- `threshold`: An object containing batch threshold settings:
  - `event_count`: Maximum number of events per batch (default: `100`).
  - `maximum_size`: Maximum batch size (default: `"5mb"`).
  - `event_collect_timeout`: Maximum time to wait for collecting events before sending the batch (default: `10s`). Must be between 1 second and 3600 seconds.

**Important**: The `event_collect_timeout` parameter must be specified under `batch.threshold`, not directly under `batch`.

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

## Lambda function implementation

When Data Prepper invokes your Lambda function with batched events, the function receives a JSON object with events grouped under the configured `key_name` (default: `"events"`).

### Input format

Your Lambda function receives the following input structure:

```json
{
  "events": [
    {"field1": "value1", "field2": "value2"},
    {"field1": "value3", "field2": "value4"}
  ]
}
```

The key name (`"events"` in this example) is configurable through the `batch.key_name` parameter.

### Output format

The expected output format depends on the `response_events_match` setting:

#### When `response_events_match: false` (default)

Lambda can return one or more new events. The returned events don't need to match the input count:

```python
def lambda_handler(event, context):
    # Process all input events and return new events
    return [
        {"result": "processed_data_1"},
        {"result": "processed_data_2"}
    ]
```

#### When `response_events_match: true`

Lambda must return an array with the same number of events in the same order as received:

```python
def lambda_handler(event, context):
    input_events = event.get('events', [])
    output = []

    # Process each event and maintain order
    for input_event in input_events:
        processed_event = input_event.copy()
        processed_event["status"] = "processed"
        # Transform data as needed
        for key, value in input_event.items():
            if isinstance(value, str):
                processed_event[key] = value.upper()
        output.append(processed_event)

    # Must return same count as input
    return output
```

### Example Lambda function

The following example demonstrates a complete Lambda function that transforms events:

```python
def lambda_handler(event, context):
    # Get events from the configured key_name (default: "events")
    input_events = event.get('events', [])
    output_events = []

    for input_event in input_events:
        # Add transformation marker
        input_event["_transformed_"] = True

        # Transform string fields to uppercase
        for key, value in input_event.items():
            if isinstance(value, str):
                input_event[key] = value.upper()

        output_events.append(input_event)

    return output_events
```

## Common configuration mistakes

Avoid the following common configuration errors:

- **Incorrect `event_collect_timeout` location**: The `event_collect_timeout` parameter must be under `batch.threshold`, not directly under `batch`.

  ```yaml
  # Incorrect
  batch:
    event_collect_timeout: PT10S  # Wrong location

  # Correct
  batch:
    threshold:
      event_collect_timeout: PT10S  # Correct location
  ```

- **Incorrect `max_retries` location**: The `max_retries` parameter must be under `client`, not at the top level.

  ```yaml
  # Incorrect
  aws_lambda:
    function_name: my-function
    max_retries: 3  # Wrong location

  # Correct
  aws_lambda:
    function_name: my-function
    client:
      max_retries: 3  # Correct location
  ```

- **Return format mismatch**: When `response_events_match: true`, ensure your Lambda function returns the same number of events as received, in the same order.

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
