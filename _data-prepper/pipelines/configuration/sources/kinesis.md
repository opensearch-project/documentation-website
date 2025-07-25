---
layout: default
title: kinesis
parent: Sources
grand_parent: Pipelines
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/sources/kinesis/
---

# kinesis

You can use the Data Prepper `kinesis` source to ingest records from one or more [Amazon Kinesis Data Streams](https://aws.amazon.com/kinesis/data-streams/).

## Usage

The following example pipeline specifies Kinesis as a source. The pipeline ingests data from multiple Kinesis data streams named `stream1` and `stream2` and sets the `initial_position` to indicate the starting point for reading the stream records:

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

The `kinesis` source supports the following configuration options.

Option | Required | Type     | Description
:--- |:---------|:---------| :---
`aws` | Yes      | AWS      | Specifies the AWS configuration. See [`aws`](#aws).
`acknowledgments` | No       | Boolean  | When set to `true`, enables the `kinesis` source to receive [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#end-to-end-acknowledgments) when events are received by OpenSearch sinks.
`streams` | Yes      | List     | Configures a list of multiple Kinesis data streams that the `kinesis` source uses to read records. You can configure up to four streams. See [Streams](#streams).
`codec` | Yes      | Codec    | Specifies the [codec](#codec) to apply.
`buffer_timeout` | No       | Duration | Sets the amount of time allowed for writing events to the Data Prepper buffer before timeout occurs. Any events that the source cannot write to the buffer during the specified amount of time are discarded. Default is `1s`.
`records_to_accumulate` | No       | Integer  | Determines the number of messages that accumulate before being written to the buffer. Default is `100`.
`consumer_strategy` | No       | String   | Selects the consumer strategy to use for ingesting Kinesis data streams. The default is `fan-out`, but `polling` can also be used. If `polling` is enabled, the additional configuration is required.
`polling` | No       | polling   | See [polling](#polling).

### Streams

You can use the following options in the `streams` array.

Option | Required | Type | Description
:--- |:---------| :--- | :---
`stream_name` | Yes      | String | Defines the name of each Kinesis data stream.
`initial_position` | No       | String | Sets the `initial_position` to determine at what point the `kinesis` source starts reading stream records. Use `LATEST` to start from the most recent record or `EARLIEST` to start from the beginning of the stream. Default is `LATEST`.
`checkpoint_interval` | No       | Duration | Configure the `checkpoint_interval` to periodically checkpoint Kinesis data streams and avoid duplication of record processing. Default is `PT2M`.
`compression` | No | String  | Specifies the compression format. To decompress records added by a [CloudWatch Logs Subscription Filter](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html) to Kinesis, use the `gzip` compression format.

## codec

The `codec` determines how the `kinesis` source parses each Kinesis stream record. For increased and more efficient performance, you can use [codec combinations]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/codec-processor-combinations/) with certain processors.

### json codec

The `json` codec parses each single line as a single JSON object from a JSON array and then creates a Data Prepper event for each object in the array. It can be used for parsing nested CloudWatch events into individual log entries. 
It also supports the below configuration to use with this codec.

Option | Required | Type    | Description
:--- | :--- |:--------| :---
`key_name` | No | String | The name of the input field from which to extract the JSON array and create Data Prepper events.
`include_keys` | No | List | The list of input fields to be extracted and added as additional fields in the Data Prepper event.
`include_keys_metadata` | No | List | The list of input fields to be extracted and added to the Data Prepper event metadata object.

### `newline` codec

The `newline` codec parses each Kinesis stream record as a single log event, making it ideal for processing single-line records. It also works well with the [`parse_json` processor]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/parse-json/) to parse each line.   

You can use the following options to configure the `newline` codec.

Option | Required | Type    | Description
:--- | :--- |:--------| :---
`skip_lines` | No | Integer | Sets the number of lines to skip before creating events. You can use this configuration to skip common header rows. Default is `0`.
`header_destination` | No | String  | Defines a key value to assign to the header line of the stream event. If this option is specified, then each event will contain a `header_destination` field.

### polling

When the `consumer_strategy` is set to `polling`, the `kinesis` source uses a polling-based approach to read records from the Kinesis data streams, instead of the default `fan-out` approach.

Option | Required | Type    | Description
:--- | :--- |:--------| :---
`max_polling_records` | No | Integer | Sets the number of records to fetch from Kinesis during a single call.
`idle_time_between_reads` | No | Duration  | Defines the amount of idle time between calls. 

### aws

You can use the following options in the `aws` configuration.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`region` | No | String | Sets the AWS Region to use for credentials. Defaults to the [standard SDK behavior for determining the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
`sts_role_arn` | No | String | Defines the AWS Security Token Service (AWS STS) role to assume for requests to Amazon Kinesis Data Streams and Amazon DynamoDB. Defaults to `null`, which uses the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`aws_sts_header_overrides` | No | Map | Defines a map of header overrides that the AWS Identity and Access Management (IAM) role assumes for the sink plugin.

## Exposed metadata attributes

The `kinesis` source adds the following metadata to each processed event. You can access the metadata attributes using the [expression syntax `getMetadata` function]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/get-metadata/).

- `stream_name`: Contains the name of the Kinesis data stream from which the event was obtained.

## Permissions

The following minimum permissions are required in order to run `kinesis` as a source:

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

The `kinesis` source uses a DynamoDB table for ingestion coordination among multiple workers, so you need DynamoDB permissions.

## Metrics

The `kinesis` source includes the following metrics.

### Counters

* `recordsProcessed`: Counts the number of processed stream records.
* `recordProcessingErrors`: Counts the number of stream record processing errors.
* `acknowledgementSetSuccesses`: Counts the number of processed stream records that were successfully added to the sink.
* `acknowledgementSetFailures`: Counts the number of processed stream records that failed to be added to the sink.
