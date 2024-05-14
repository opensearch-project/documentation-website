---
layout: default
title: documentdb
parent: Sources
grand_parent: Pipelines
nav_order: 2
---

# documentdb

The `documentdb` source reads documents from [Amazon DocumentDB](https://aws.amazon.com/documentdb/) collections.
It can read historical data from an export and keep up-to-date on the data using DocumentDB [Change Streams](https://docs.aws.amazon.com/documentdb/latest/developerguide/change_streams.html).

The `documentdb` source will read data from DocumentDB and put that data into an [Amazon S3](https://aws.amazon.com/s3/) bucket.
From there, other Data Prepper workers will read from the S3 bucket to process data.

## Usage

```
version: "2"
documentdb-pipeline:
  source:
    documentdb:
      host: "docdb-mycluster.cluster-random.us-west-2.docdb.amazonaws.com"
      port: 27017
      authentication:
        username: ${{aws_secrets:secret:username}}
        password: ${{aws_secrets:secret:password}}
      aws:
        sts_role_arn: "arn:aws:iam::123456789012:role/MyRole"
      s3_bucket: my-bucket
      s3_region: us-west-2
      collections:
        - collection: my-collection
          export: true
          stream: true
      acknowledgments: true
```

## Configuration

You can use the following options to configure the `documentdb` source.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`host` | Yes | String  | The hostname of the DocumentDB cluster.
`port` | No | Integer | The port number of the DocumentDB cluster. Defaults to `27017`.
`trust_store_file_path` | No | String | The path to a trust store file that contains the public certificate for the DocumentDB cluster.
`trust_store_password` | No | String | The password for the trust store specified by `trust_store_file_path`.
`authentication` | Yes | authentication | The authentication configuration. See [authentication](#authentication) for more information.
`collections` | Yes | List | A list of [collection](#collection) configurations. Exactly one collection is required.
`s3_bucket` | Yes | String  | The Amazon S3 bucket to use for processing events from DocumentDB.
`s3_prefix` | No | String  | An optional key prefix in Amazon S3. By default, there is no key prefix.
`s3_region` | No | String  | The AWS region where the S3 bucket resides.
`aws` | Yes | AWS | The AWS configuration. See [aws](#aws) for more information.
`id_key` | No | String  | When specified, the `_id` field from DocumentDB will be set to the key name specified by `id_key`. You can use this when need more information beyond an ObjectId string saved to your sink. By default, the `_id` is not made as part of the Event.
`direct_connection` | No | Boolean  | When `true`, the MongoDB driver will connect directly to the specified DocumentDB server or servers without discovering and connecting to the entire replica set. Defaults to `true`.
`read_preference` | No | String  | Determines how to read from DocumentDB. See [Read Preference Modes](https://www.mongodb.com/docs/v3.6/reference/read-preference/#read-preference-modes) for details. Defaults to `primaryPreferred`.
`disable_s3_read_for_leader` | No | Boolean  | When `true`, the current leader node will not read from S3. It will only do the work of reading the stream. Defaults to `false`.
`partition_acknowledgment_timeout` | No | Duration  | Configures how long a node will hold onto a partition. Defaults to `2h`.
`acknowledgments` | No | Boolean  | When `true`, enables [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#end-to-end-acknowledgments) on this source after events are sent to the sinks.
`insecure` | No | Boolean | Disables TLS. Defaults to `false`. Do not use this value in production.
`ssl_insecure_disable_verification` | No | Boolean | Disables TLS hostname verification. Defaults to `false`. Do not use this value in production. Use the `trust_store_file_path` to verify the hostname.

### authentication

The following parameters allow you to configure authentication to the DocumentDB cluster.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`username` | Yes | String | The username to use when authenticating with the DocumentDB cluster. Supports automatic refresh.
`password` | Yes | String | The password to use when authenticating with the DocumentDB cluster. Supports automatic refresh.


### collection

The following parameters allow you to configure the collection to read from the DocumentDB cluster.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`collection` | Yes | String | The name of the collection
`export` | No | Boolean | Whether to include an export or full load. Defaults to `true`.
`stream` | No | Boolean | Whether to enable a stream. Defaults to `true`.
`partition_count` | No | Integer | Defines the number of partitions to create in Amazon S3. Defaults to `100`.
`export_batch_size` | No | Integer | Defaults to `10,000`.
`stream_batch_size` | No | Integer | Defaults to `1,000`.

## aws

Option | Required | Type | Description
:--- | :--- | :--- | :---
`sts_role_arn` | No | String | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon SQS and Amazon S3. Defaults to `null`, which will use the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`aws_sts_header_overrides` | No | Map | A map of header overrides that the IAM role assumes for the sink plugin.
`sts_external_id` | No | String | An STS external ID used when Data Prepper assumes the STS role. For more information, see the `ExternalID` documentation in the [STS AssumeRole](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html) API reference.
