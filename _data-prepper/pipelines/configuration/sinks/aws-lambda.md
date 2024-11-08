---
layout: default
title: aws_lambda
parent: Sinks
grand_parent: Pipelines
nav_order: 10
---

----------------------------------------------------------------------------------------
# AWS Lambda Sink for Data Prepper

This document provides the configuration details and usage instructions for integrating [AWS Lambda](https://aws.amazon.com/lambda/)
with Data Prepper, both as a processor and as a sink.

## AWS Lambda Sink

```
Field             | Type    | Required | Description                                                                 
----------------- | ------- | -------- | ---------------------------------------------------------------------------- 
function_name     | String  | Yes      | The name of the AWS Lambda function to invoke.                               
invocation_type   | String  | No       | Specifies the invocation type. Default is event.             
aws.region        | String  | Yes      | The AWS region where the Lambda function is located.                         
aws.sts_role_arn  | String  | No       | ARN of the role to assume before invoking the Lambda function.               
max_retries       | Integer | No       | Maximum number of retries if the invocation fails. Default is 3.             
batch             | Object  | No       | Optional batch settings for Lambda invocations. Default key_name = "events". Default Threshold for event_count=100, maximum_size="5mb", event_collect_timeout = 10s                              
lambda_when       | String  | No       | Conditional expression to determine when to invoke the Lambda sink.          
dlq               | Object  | No       | Dead-letter queue (DLQ) configuration for failed invocations.                
```

Example Configuration:
```
sink:
  - aws_lambda:
      function_name: "my-lambda-sink"
      invocation_type: "event"
      aws:
        region: "us-west-2"
        sts_role_arn: "arn:aws:iam::123456789012:role/my-lambda-sink-role"
      max_retries: 5
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

Usage
Invocation Type:
- event: Invokes the function asynchronously without waiting for a response. Default and preferred mode. 
- request-response: Supported in sink but response is not handled.
  Batching: Batching is enabled by default, events are grouped together based on the defined threshold in the batch configuration.
  Dead-Letter Queue (DLQ): A DLQ can be configured to handle failures in Lambda invocations. If the invocation fails after retries, the failed events will be sent to the specified DLQ


## Additional Notes
IAM Role Assumption: Both the processor and sink can assume a specified IAM role (aws.sts_role_arn) before invoking Lambda functions. This allows for more secure handling of AWS resources.
Concurrency Considerations: When using the event invocation type, be mindful of Lambda concurrency limits to avoid throttling.
For further details on AWS Lambda integration with Data Prepper, refer to the AWS Lambda documentation: https://docs.aws.amazon.com/lambda

## Developer Guide

The integration tests for this plugin do not run as part of the Data Prepper build.
The following command runs the integration tests:

```
./gradlew :data-prepper-plugins:aws-lambda:integrationTest -Dtests.sink.lambda.region="us-east-1" -Dtests.sink.lambda.functionName="lambda_test_function"  -Dtests.sink.lambda.sts_role_arn="arn:aws:iam::123456789012:role/dataprepper-role

```