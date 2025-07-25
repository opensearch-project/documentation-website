---
layout: default
title: documentdb
parent: Sources
grand_parent: Pipelines
nav_order: 2
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/sources/documentdb/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/sources/documentdb/
---

# documentdb

The `documentdb` source reads documents from [Amazon DocumentDB](https://aws.amazon.com/documentdb/) collections.
It can read historical data from an export and keep up to date on the data using Amazon DocumentDB [change streams](https://docs.aws.amazon.com/documentdb/latest/developerguide/change_streams.html).

The `documentdb` source reads data from Amazon DocumentDB and puts that data into an [Amazon Simple Storage Service (Amazon S3)](https://aws.amazon.com/s3/) bucket.
Then, other Data Prepper workers read from the S3 bucket to process data.

## Usage
The following example pipeline uses the `documentdb` source:

```yaml
version: "2"
documentdb-pipeline:
  source:
    documentdb:
      host: "docdb-mycluster.cluster-random.us-west-2.docdb.amazonaws.com"
      port: 27017
      authentication:
        {% raw %}username: ${{aws_secrets:secret:username}}
        password: ${{aws_secrets:secret:password}}{% endraw %}
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
{% include copy-curl.html %}

## Configuration

You can use the following options to configure the `documentdb` source.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`host` | Yes | String  | The hostname of the Amazon DocumentDB cluster.
`port` | No | Integer | The port number of the Amazon DocumentDB cluster. Defaults to `27017`.
`trust_store_file_path` | No | String | The path to a truststore file that contains the public certificate for the Amazon DocumentDB cluster.
`trust_store_password` | No | String | The password for the truststore specified by `trust_store_file_path`.
`authentication` | Yes | Authentication | The authentication configuration. See the [authentication](#authentication) section for more information.
`collections` | Yes | List | A list of collection configurations. Exactly one collection is required. See the [collections](#collection) section for more information.
`s3_bucket` | Yes | String  | The S3 bucket to use for processing events from Amazon DocumentDB.
`s3_prefix` | No | String  | An optional Amazon S3 key prefix. By default, there is no key prefix.
`s3_region` | No | String  | The AWS Region in which the S3 bucket resides.
`aws` | Yes | AWS | The AWS configuration. See the [aws](#aws) section for more information.
`id_key` | No | String  | When specified, the Amazon DocumentDB `_id` field is set to the key name specified by `id_key`. You can use this when you need more information than is provided by the `ObjectId` string saved to your sink. By default, the `_id` is not included as part of the event.
`direct_connection` | No | Boolean  | When `true`, the MongoDB driver connects directly to the specified Amazon DocumentDB server(s) without discovering and connecting to the entire replica set. Defaults to `true`.
`read_preference` | No | String  | Determines how to read from Amazon DocumentDB. See [Read Preference Modes](https://www.mongodb.com/docs/v3.6/reference/read-preference/#read-preference-modes) for more information. Defaults to `primaryPreferred`.
`disable_s3_read_for_leader` | No | Boolean  | When `true`, the current leader node does not read from Amazon S3. It only reads the stream. Defaults to `false`.
`partition_acknowledgment_timeout` | No | Duration  | Configures the amount of time during which the node holds a partition. Defaults to `2h`.
`acknowledgments` | No | Boolean  | When set to `true`, enables [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#end-to-end-acknowledgments) on the source after events are sent to the sinks.
`insecure` | No | Boolean | Disables TLS. Defaults to `false`. Do not use this value in production.
`ssl_insecure_disable_verification` | No | Boolean | Disables TLS hostname verification. Defaults to `false`. Do not enable this flag in production. Instead, use the `trust_store_file_path` to verify the hostname.

### `authentication`

The following parameters enable you to configure `authentication` for the Amazon DocumentDB cluster.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`username` | Yes | String | The username to use when authenticating with the Amazon DocumentDB cluster. Supports automatic refresh.
`password` | Yes | String | The password to use when authenticating with the Amazon DocumentDB cluster. Supports automatic refresh.

### `collection`

The following parameters enable you to configure `collection` to read from the Amazon DocumentDB cluster.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`collection` | Yes | String | The name of the collection.
`export` | No | Boolean | Whether to include an export or a full load. Defaults to `true`.
`stream` | No | Boolean | Whether to enable a stream. Defaults to `true`.
`partition_count` | No | Integer | Defines the number of partitions to create in Amazon S3. Defaults to `100`.
`export_batch_size` | No | Integer | Defaults to `10,000`.
`stream_batch_size` | No | Integer | Defaults to `1,000`.

## `aws`

The following parameters enable you to configure your access to Amazon DocumentDB.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`sts_role_arn` | No | String | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon Simple Queue Service (Amazon SQS) and Amazon S3. Defaults to `null`, which uses the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`aws_sts_header_overrides` | No | Map | A map of header overrides that the AWS Identity and Access Management (IAM) role assumes for the sink plugin.
`sts_external_id` | No | String | An external STS ID used when Data Prepper assumes the STS role. See `ExternalID` in the [STS AssumeRole](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html) API reference documentation.
