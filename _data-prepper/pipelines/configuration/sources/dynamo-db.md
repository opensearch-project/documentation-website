---
layout: default
title: dynamodb
parent: Sources
grand_parent: Pipelines
nav_order: 3
---

# dynamodb

The `dynamodb` source enables change data capture (CDC) on [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) tables. It can receive table events, such as `create`, `update`, or `delete`, using DynamoDB streams and supports initial snapshots using [point-in-time recovery (PITR)](https://aws.amazon.com/dynamodb/pitr/).

The source includes two ingestion options to stream DynamoDB events:

1. A _full initial snapshot_ using [PITR](https://aws.amazon.com/dynamodb/pitr/) gets an initial snapshot of the current state of the DynamoDB table. This requires the PITR Snapshots and DyanmoDB option enabled on your DynamoDB table.
2.  Stream events from DynamoDB streams without full initial snapshots. This is useful if you already have a snapshot mechanism within your pipelines. This requires that the DynamoDB stream option is enabled on the DynamoDB table.

## Usage

The following example pipeline specifies DynamoDB as a source. It ingests data from a DyanmoDB table named `table-a` through a PITR snapshot. It also indicates the `start_position`, which tells the pipeline how to read DynamoDB stream events:

```yaml
version: "2"
cdc-pipeline:
  source:
    dynamodb:
      tables:
        - table_arn: "arn:aws:dynamodb:us-west-2:123456789012:table/table-a"
          export:
            s3_bucket: "test-bucket"
            s3_prefix: "myprefix"
          stream:
            start_position: "LATEST" # Read latest data from streams (Default)
      aws:
        region: "us-west-2"
        sts_role_arn: "arn:aws:iam::123456789012:role/my-iam-role"
```

## Configuration options

The following tables describe the configuration options for the `dynamodb` source.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`aws` | Yes | AWS | The AWS configuration. See [aws](#aws) for more information.
`acknowledgments` | No | Boolean  | When `true`, enables `s3` sources to receive [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#end-to-end-acknowledgments) when events are received by OpenSearch sinks.
`shared_acknowledgement_timeout` | No | Duration | The amount of time that elapses before the data read from a DynamoDB stream expires when used with acknowledgements. Default is 10 minutes.
`s3_data_file_acknowledgment_timeout` | No | Duration | The amount of time that elapses before the data read from a DynamoDB export expires when used with acknowledgments. Default is 5 minutes.
`tables` | Yes | List | The configuration for the DynamoDB table. See [tables](#tables) for more information.

### aws

Use the following options in the AWS configuration.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`region` | No | String | The AWS Region to use for credentials. Defaults to [standard SDK behavior to determine the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
`sts_role_arn` | No | String | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon Simple Queue Service (Amazon SQS) and Amazon Simple Storage Service (Amazon S3). Defaults to `null`, which will use the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`aws_sts_header_overrides` | No | Map | A map of header overrides that the AWS Identity and Access Management (IAM) role assumes for the sink plugin.


### tables

Use the following options with the `tables` configuration.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`table_arn` | Yes | String | The Amazon Resource Name (ARN) of the source DynamoDB table.
`export` | No | Export | Determines how to export DynamoDB events. For more information, see [export](#export-options).
`stream` | No | Stream | Determines how the pipeline reads data from the DynamoDB table. For more information, see [stream](#stream-option).

#### Export options

The following options let you customize the export destination for DynamoDB events.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`s3_bucket` | Yes | String | The destination bucket that stores the exported data files.
`s3_prefix` | No | String | The custom prefix for the S3 bucket.
`s3_sse_kms_key_id` | No | String |  An AWS Key Management Service (AWS KMS) key that encrypts the export data files. The `key_id` is the ARN of the KMS key, for example, `arn:aws:kms:us-west-2:123456789012:key/0a4bc22f-bb96-4ad4-80ca-63b12b3ec147`.
`s3_region` | No | String | The Region for the S3 bucket.

#### Stream option

The following option lets you customize how the pipeline reads events from the DynamoDB table.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`start_position` | No | String | The position from where the source starts reading stream events when the DynamoDB stream option is enabled. `LATEST` starts reading events from the most recent stream record. 







