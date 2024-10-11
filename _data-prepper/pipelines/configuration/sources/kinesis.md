---
layout: default
title: kinesis
parent: Sources
grand_parent: Pipelines
nav_order: 3
---

# kinesis

You can use `kinesis` source in Data Prepper to ingest records from one or more [Amazon Kinesis Data Streams](https://aws.amazon.com/kinesis/data-streams/). 

## Usage

The following example pipeline specifies Kinesis as a source. It ingests data from multiple Kinesis Data streams named `stream1` and `stream2`. It also indicates the `initial_position`, which tells the pipeline from where to start reading Kinesis stream records:

```yaml
version: "2"
kinesis-pipeline:
  source:
    kinesis:
      streams:
        - stream_name: "stream1"
          initial_position: "LATEST"
        - stream_name: "stream2"
          initial_position: "LATEST"
      aws:
        region: "us-west-2"
        sts_role_arn: "arn:aws:iam::123456789012:role/my-iam-role"
```

## Configuration options

The following configuration options are supported for the `kinesis` source.

Option | Required | Type     | Description
:--- |:---------|:---------| :---
`aws` | Yes      | AWS      | The AWS configuration. See [aws](#aws) for more information.
`acknowledgments` | No       | Boolean  | When `true`, enables `kinesis` source to receive [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#end-to-end-acknowledgments) when events are received by OpenSearch sinks.
`streams` | Yes      | List     | Multiple Kinesis Data streams that Data Prepper `kinesis` source uses to read records. You can configure up to 4 streams. For more information about `streams` configuration options, see [Streams](#streams).
`codec` | Yes      | Codec    | The [codec](#codec) to apply.
`buffer_timeout` | No       | Duration | The amount of time allowed for writing events to the Data Prepper buffer before timeout occurs. Any events that the source cannot write to the buffer during the specified amount of time are discarded. Default is `1s`.
`records_to_accumulate` | No       | Integer  | The number of messages that accumulate before being written to the buffer. Default is `100`.
`consumer_strategy` | No       | String   | Consumer strategy to use for ingesting Kinesis data streams. Default is `fan-out`. However, `polling` can also be used. if `polling` is enabled, additional configuration for `polling` will need to be added.
`polling` | No       | polling   | Refer to [polling](#polling).


### Streams

Use the following options in the `streams` array.

Option | Required | Type | Description
:--- |:---------| :--- | :---
`stream_name` | Yes      | String | The name of each Kinesis stream.
`initial_position` | No       | String | The position from where `kinesis` source starts reading stream records. `LATEST` starts reading from the most recent stream record. `EARLIEST` starts reading from the begining of the stream. Default is `LATEST`.
`checkpoint_interval` | No       | Duration | Periodically checkpoint Kinesis streams to avoid duplication of record processing. Default is `PT2M`.
`compression` | No | String  | Specifies the compression format. To decompress records added by [CloudWatch subscription filter](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html) to Kinesis, use the `gzip` compression format.

## codec

The `codec` determines how the `kinesis` source parses each Amazon Kinesis Record. For increased and more efficient performance, you can use [codec combinations]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/codec-processor-combinations/) with certain processors.

### `newline` codec

The `newline` codec parses each single line as a single log event. This is ideal where each Kinesis stream record is processed as a single line. It also matches well when used with the [parse_json]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/parse-json/) processor to parse each line. 

Use the following options to configure the `newline` codec.

Option | Required | Type    | Description
:--- | :--- |:--------| :---
`skip_lines` | No | Integer | The number of lines to skip before creating events. You can use this configuration to skip common header rows. Default is `0`.
`header_destination` | No | String  | A key value to assign to the header line of the stream event. If this option is specified, then each event will contain a `header_destination` field.

### polling
Option | Required | Type    | Description
:--- | :--- |:--------| :---
`max_polling_records` | No | Integer | The number of records to fetch from Kinesis during a single call to get Kinesis stream records.
`idle_time_between_reads` | No | Duration  | The time duration to sleep in between calls to get Kinesis stream records. 

### aws

Use the following options in the AWS configuration.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`region` | No | String | The AWS Region to use for credentials. Defaults to [standard SDK behavior to determine the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
`sts_role_arn` | No | String | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon Kinesis Data Streams (Amazon Kinesis) and Amazon DynamoDb (Amazon DynamoDb). Defaults to `null`, which will use the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`aws_sts_header_overrides` | No | Map | A map of header overrides that the AWS Identity and Access Management (IAM) role assumes for the sink plugin.

## Exposed metadata attributes

The following metadata will be added to each event that is processed by the `kinesis` source. These metadata attributes can be accessed using the [expression syntax `getMetadata` function]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/get-metadata/).

* `kinesis_stream_name`: The name of the Kinesis stream that an event came from.

## Permissions

The following are the minimum required permissions for running `kinesis` as a source:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "kinesis:DescribeStream",
        "kinesis:DescribeStreamConsumer",
        "kinesis:DescribeStreamSummary",
        "kinesis:GetRecords",
        "kinesis:GetShardIterator",
        "kinesis:ListShards",
        "kinesis:ListStreams",
        "kinesis:ListStreamConsumers",
        "kinesis:RegisterStreamConsumer",
        "kinesis:SubscribeToShard"
      ],
      "Resource": [
        "arn:aws:kinesis:us-east-1:{account-id}:stream/stream1",
        "arn:aws:kinesis:us-east-1:{account-id}:stream/stream2"
      ]
    },
    {
      "Sid": "allowCreateTable",
      "Effect": "Allow",
      "Action": [
        "dynamodb:CreateTable",
        "dynamodb:PutItem",
        "dynamodb:DescribeTable",
        "dynamodb:DeleteItem",
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:UpdateItem",
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:{account-id}:table/kinesis-pipeline"
      ]
    }
  ]
}
```

DynamoDb permissions are required as `kinesis` source in Data Prepper uses DynamoDb table for ingestion coordination among multiple workers.  

## Metrics

The `kinesis` source includes the following metrics.

### Counters

* `recordsProcessed`: The number of stream records processed from Kinesis streams.
* `recordProcessingErrors`: The number of processing errors for stream records from Kinesis streams.
* `acknowledgementSetSuccesses`: The total number stream records processed which were successfully added to sink. 
* `acknowledgementSetFailures`: The total number stream records processed which failed to be added to sink.



