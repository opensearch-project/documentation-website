---
layout: default
title: rds
parent: Sources
grand_parent: Pipelines
nav_order: 95
---

# rds

The `rds` source enables change data capture (CDC) on [Amazon Relational Database Service (Amazon RDS)](https://aws.amazon.com/rds/) and [Amazon Aurora](https://aws.amazon.com/aurora/) databases. It can receive database events, such as `INSERT`, `UPDATE`, or `DELETE`, using database replication logs and supports initial load using RDS exports to Amazon Simple Storage Service (Amazon S3).

The source supports the following database engines:
- Aurora MySQL and Aurora PostgreSQL
- RDS MySQL and RDS PostgreSQL

The source includes two ingestion options for ingesting data from Aurora/RDS:

1. Export: A full initial export from Aurora/RDS to S3 gets an initial load of the current state of the Aurora/RDS database.
2. Stream: Stream events from database replication logs (MySQL binlog or PostgreSQL WAL). 

## Usage

The following example pipeline specifies an `rds` source. It ingests data from an Aurora MySQL cluster:

```yaml
version: "2"
rds-pipeline:
  source:
    rds:
      db_identifier: "my-rds-instance"
      engine: "aurora-mysql"
      database: "mydb"
      authentication:
        username: "myuser"
        password: "mypassword"
      s3_bucket: "my-export-bucket"
      s3_region: "us-west-2"
      s3_prefix: "rds-exports"
      export:
        kms_key_id: "arn:aws:kms:us-west-2:123456789012:key/12345678-1234-1234-1234-123456789012"
        export_role_arn: "arn:aws:iam::123456789012:role/rds-export-role"
      stream: true
      aws:
        region: "us-west-2"
        sts_role_arn: "arn:aws:iam::123456789012:role/my-pipeline-role"
```

## Configuration options

The following tables describe the configuration options for the `rds` source.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`db_identifier` | Yes | String | The identifier for the RDS instance or Aurora cluster.
`cluster` | No | Boolean | Whether the `db_identifier` refers to a cluster (`true`) or an instance (`false`). Default is `false`. For Aurora engines, this option is always `true`.
`engine` | Yes | String | The database engine type. Must be one of `mysql`, `postgresql`, `aurora-mysql`, or `aurora-postgresql`.
`database` | Yes | String | The name of the database to connect to.
`tables` | No | Object | The configuration for specifying which tables to include or exclude. See [tables](#tables) for more information.
`authentication` | Yes | Object | Database authentication credentials. See [authentication](#authentication) for more information.
`aws` | Yes | Object | The AWS configuration. See [aws](#aws) for more information.
`acknowledgments` | No | Boolean | When `true`, enables the source to receive [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#end-to-end-acknowledgments) when events are received by OpenSearch sinks. Default is `true`.
`s3_data_file_acknowledgment_timeout` | No | Duration | The amount of time that elapses before the data read from an RDS export expires when used with acknowledgments. Default is 30 minutes.
`stream_acknowledgment_timeout` | No | Duration | The amount of time that elapses before the data read from database streams expires when used with acknowledgments. Default is 10 minutes.
`s3_bucket` | Yes | String | The name of the S3 bucket in which RDS export data will be stored.
`s3_prefix` | No | String | The prefix for S3 objects in the export bucket.
`s3_region` | No | String | The AWS Region for the S3 bucket. If not specified, uses the same Region as specified in the [aws](#aws) configuration.
`partition_count` | No | Integer | The number of folder partitions in the S3 buffer. Must be between 1 and 1,000. Default is 100.
`export` | No | Object | The configuration for RDS export operations. See [export](#export-options) for more information.
`stream` | No | Boolean | Whether to enable streaming of database change events. Default is `false`.
`tls` | No | Object | The TLS configuration for database connections. See [tls](#tls-options) for more information.
`disable_s3_read_for_leader` | No | Boolean | Whether to disable S3 read operations for the leader node. Default is `false`.

### aws

Use the following options in the AWS configuration.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`region` | No | String | The AWS Region to use for credentials. Defaults to the [standard SDK behavior for determining the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
`sts_role_arn` | No | String | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon RDS and Amazon S3. Defaults to `null`, which will use the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`sts_external_id` | No | String | The external ID to use when assuming the STS role. Must be between 2 and 1,224 characters.
`sts_header_overrides` | No | Map | A map of header overrides that the AWS Identity and Access Management (IAM) role assumes for the source plugin. Maximum of 5 headers.

### authentication

Use the following options for database authentication.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`username` | Yes | String | The database username for authentication.
`password` | Yes | String | The database password for authentication.

### tables

Use the following options to specify which tables to include in the data capture.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`include` | No | List | A list of table names to include in data capture. Maximum of 1,000 tables. If specified, only these tables will be processed.
`exclude` | No | List | A list of table names to exclude from data capture. Maximum of 1,000 tables. These tables will be ignored even if they match include patterns.

### export options

The following options let you customize the RDS export functionality.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`kms_key_id` | Yes | String | The AWS Key Management Service (AWS KMS) key ID or Amazon Resource Name (ARN) to use for encrypting the export data.
`export_role_arn` | Yes | String | The ARN of the IAM role that RDS will assume to perform the export operation.

### tls options

The following options let you configure TLS for database connections.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`insecure` | No | Boolean | Whether to disable TLS encryption for database connections. Default is `false` (TLS enabled).

## Exposed metadata attributes

The following metadata will be added to each event that is processed by the `rds` source. These metadata attributes can be accessed using the [expression syntax `getMetadata` function]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/get-metadata/).

* `primary_key`: The primary key of the database record. For tables with composite primary keys, values are concatenated with a `|` separator.
* `event_timestamp`: The timestamp, in epoch milliseconds, of when the database change occurred. For export events, this represents the export time. For stream events, this represents the transaction commit time.
* `document_version`: A long integer number generated from the event timestamp to use as the document version. 
* `opensearch_action`: The bulk action that will be used to send the event to OpenSearch, such as `index` or `delete`.
* `change_event_type`: The stream event type. Can be `insert`, `update`, or `delete`.
* `table_name`: The name of the database table from which the event originated.
* `schema_name`: The name of the schema from which the event originated. For MySQL, `schema_name` is the same as `database_name`.
* `database_name`: The name of the database from which the event originated.
* `ingestion_type`: Indicates whether the event originated from an export or stream. Valid values are `EXPORT` and `STREAM`.
* `s3_partition_key`: Events are stored in an S3 staging bucket before processing. This metadata indicates the location in the S3 bucket where the event is stored before processing.

## Permissions

The following are the required permissions for running RDS as a source:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "allowReadingFromS3Buckets",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:GetBucketLocation",
        "s3:ListBucket",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::s3_bucket",
        "arn:aws:s3:::s3_bucket/*"
      ]
    },
    {
      "Sid": "AllowDescribeInstances",
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBInstances"
      ],
      "Resource": [
        "arn:aws:rds:region:account-id:db:*"
      ]
    },
    {
      "Sid": "AllowDescribeClusters",
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBClusters"
      ],
      "Resource": [
        "arn:aws:rds:region:account-id:cluster:*"
      ]
    },
    {
      "Sid": "AllowSnapshots",
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBClusterSnapshots",
        "rds:CreateDBClusterSnapshot",
        "rds:DescribeDBSnapshots",
        "rds:CreateDBSnapshot",
        "rds:AddTagsToResource"
      ],
      "Resource": [
        "arn:aws:rds:region:account-id:cluster:*",
        "arn:aws:rds:region:account-id:cluster-snapshot:*",
        "arn:aws:rds:region:account-id:db:*",
        "arn:aws:rds:region:account-id:snapshot:*"
      ]
    },
    {
      "Sid": "AllowExport",
      "Effect": "Allow",
      "Action": [
        "rds:StartExportTask"
      ],
      "Resource": [
        "arn:aws:rds:region:account-id:cluster:*",
        "arn:aws:rds:region:account-id:cluster-snapshot:*",
        "arn:aws:rds:region:account-id:snapshot:*"
      ]
    },
    {
      "Sid": "AllowDescribeExports",
      "Effect": "Allow",
      "Action": [
        "rds:DescribeExportTasks"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AllowAccessToKmsForExport",
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt",
        "kms:Encrypt",
        "kms:DescribeKey",
        "kms:RetireGrant",
        "kms:CreateGrant",
        "kms:ReEncrypt*",
        "kms:GenerateDataKey*"
      ],
      "Resource": [
        "arn:aws:kms:region:account-id:key/export-key-id"
      ]
      },
    {
      "Sid": "AllowPassingExportRole",
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": [
        "arn:aws:iam::account-id:role/export-role"
      ]
    }
  ]
}
```

## Metrics

The `rds` source includes the following metrics:

* `exportJobSuccess`: The number of RDS export tasks that have succeeded.
* `exportJobFailure`: The number of RDS export tasks that have failed.
* `exportS3ObjectsTotal`: The total number of export data files found in S3.
* `exportS3ObjectsProcessed`: The total number of export data files that have been processed successfully from S3.
* `exportS3ObjectsErrors`: The total number of export data files that have failed to be processed from S3.
* `exportRecordsTotal`: The total number of records found in the export.
* `exportRecordsProcessed`: The total number of export records that have been processed successfully.
* `exportRecordsProcessingErrors`: The number of export record processing errors.
* `changeEventsProcessed`: The number of change events processed from database streams.
* `changeEventsProcessingErrors`: The number of processing errors for change events from database streams.
* `bytesReceived`: The total number of bytes received by the source.
* `bytesProcessed`: The total number of bytes processed by the source.
* `positiveAcknowledgementSets`: The number of acknowledgement sets that are positively acknowledged in stream processing.
* `negativeAcknowledgementSets`: The number of acknowledgement sets that are negatively acknowledged in stream processing.
* `checkpointCount`: The total number of checkpoints in stream processing.
* `noDataExtendLeaseCount`: The number of times that the lease is extended on a partition with no new data processed since the last checkpoint. 
* `giveupPartitionCount`: The number of times a partition is given up.
* `replicationLogEntryProcessingTime`: The time taken to process a replication log event.
* `replicationLogEntryProcessingErrors`: The number of replication log events that have failed to process.
