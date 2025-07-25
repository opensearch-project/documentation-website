---
layout: default
title: kafka
parent: Buffers
grand_parent: Pipelines
nav_order: 80
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/buffers/kafka/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/buffers/kafka/
---

# kafka

The `kafka` buffer buffers data into an Apache Kafka topic. It uses the Kafka topic to persist data while the data is in transit.

The following example shows how to run the Kafka buffer in an HTTP pipeline.
It runs against a locally running Kafka cluster.

```
kafka-buffer-pipeline:
  source:
    http:
  buffer:
    kafka:
      bootstrap_servers: ["localhost:9092"]
      encryption:
        type: none
      topics:
        - name: my-buffer-topic
          group_id: data-prepper
          create_topic: true
  processor:
    - grok:
        match:
          message: [ "%{COMMONAPACHELOG}" ]
  sink:
    - stdout:
```

## Configuration options

Use the following configuration options with the `kafka` buffer.


Option | Required | Type | Description
--- | --- | --- | ---
`authentication` | No | [Authentication](#authentication) | Sets the authentication options for both the pipeline and Kafka. For more information, see [Authentication](#authentication).
`aws` | No | [AWS](#aws) | The AWS configuration. For more information, see [aws](#aws).
`bootstrap_servers` | Yes | String list | The host and port for the initial connection to the Kafka cluster. You can configure multiple Kafka brokers by using the IP address or the port number for each broker. When using [Amazon Managed Streaming for Apache Kafka (Amazon MSK)](https://aws.amazon.com/msk/) as your Kafka cluster, the bootstrap server information is obtained from Amazon MSK using the Amazon Resource Name (ARN) provided in the configuration.
`encryption` | No | [Encryption](#encryption) | The encryption configuration for encryption in transit. For more information, see [Encryption](#encryption).
`producer_properties` | No | [Producer Properties](#producer_properties) | A list of configurable Kafka producer properties. 
`topics` | Yes | List | A list of [topics](#topic) for the buffer to use. You must supply one topic per buffer.


### topic

The `topic` option configures a single Kafka topic and tells the `kafka` buffer how to use that topic.


Option | Required | Type | Description
:--- | :--- | :--- | :---
`name` | Yes | String | The name of the Kafka topic.
`group_id` | Yes | String | Sets Kafka's `group.id` option.
`workers` | No | Integer | The number of multithreaded consumers associated with each topic. Default is `2`. The maximum value is `200`.
`encryption_key` | No | String | An Advanced Encryption Standard (AES) encryption key used to encrypt and decrypt data within Data Prepper before sending it to Kafka. This value must be plain text or encrypted using AWS Key Management Service (AWS KMS).
`kms` | No | AWS KMS key | When configured, uses an AWS KMS key to encrypt data. See [`kms`](#kms) for more information.
`auto_commit` | No | Boolean | When `false`, the consumer offset will not be periodically committed to Kafka in the background. Default is `false`.
`commit_interval` | No | Integer | When `auto_commit` is set to `true`, sets how often, in seconds, the consumer offsets are auto-committed to Kafka through Kafka's `auto.commit.interval.ms` option. Default is `5s`.
`session_timeout` | No | Integer | The amount of time during which the source detects client failures when using Kafka's group management features, which can be used to balance the data stream. Default is `45s`.
`auto_offset_reset` | No | String | Automatically resets the offset to the earliest or the latest offset through Kafka's `auto.offset.reset` option. Default is `latest`.
`thread_waiting_time` | No | Integer | The amount of time that a thread waits for the preceding thread to complete its task and to signal the next thread. The Kafka consumer API poll timeout value is set to half of this setting. Default is `5s`.
`max_partition_fetch_bytes` | No | Integer | Sets the maximum limit, in megabytes, for data returns from each partition through Kafka's `max.partition.fetch.bytes` setting. Default is `1mb`.
`heart_beat_interval` | No | Integer | The expected amount of time between heartbeats to the consumer coordinator when using Kafka's group management facilities through Kafka's `heartbeat.interval.ms` setting. Default is `5s`.
`fetch_max_wait` | No | Integer | The maximum amount of time during which the server blocks a fetch request when there isn't sufficient data to satisfy the `fetch_min_bytes` requirement through Kafka's `fetch.max.wait.ms` setting. Default is `500ms`.
`fetch_max_bytes` | No | Integer | The maximum record size accepted by the broker through Kafka's `fetch.max.bytes` setting. Default is `50mb`.
`fetch_min_bytes` | No | Integer | The minimum amount of data the server returns during a fetch request through Kafka's `retry.backoff.ms` setting. Default is `1b`.
`retry_backoff` | No | Integer | The amount of time to wait before attempting to retry a failed request to a given topic partition. Default is `10s`.
`max_poll_interval` | No | Integer | The maximum delay between invocations of a `poll()` when using group management through Kafka's `max.poll.interval.ms` option. Default is `300s`.
`consumer_max_poll_records` | No | Integer | The maximum number of records returned in a single `poll()` call through Kafka's `max.poll.records` setting. Default is `500`.
`max_message_bytes` | No | Integer | The maximum size of the message, in bytes. Default is 1 MB.


### kms

When using AWS KMS, the AWS KMS key can decrypt the `encryption_key` so that it is not stored in plain text. To configure AWS KMS with the `kafka` buffer, use the following options.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`key_id` | Yes | String | The ID of the AWS KMS key. It may be the full key ARN or a key alias.
`region` | No | String | The AWS Region of the AWS KMS key.
`sts_role_arn` | No | String | The AWS Security Token Service (AWS STS) role ARN to use to access the AWS KMS key.
`encryption_context` | No | Map | When provided, messages sent to the topic will include this map as an AWS KMS encryption context.


### Authentication

The following option is required inside the `authentication` object.

Option | Type | Description
:--- | :--- | :---
`sasl` | JSON object | The Simple Authentication and Security Layer (SASL) authentication configuration.


### SASL

Use one of the following options when configuring SASL authentication.

Option | Type | Description
:--- | :--- | :---
`plaintext` | JSON object | The [PLAINTEXT](#sasl-plaintext) authentication configuration.
`aws_msk_iam` | String | The Amazon MSK AWS Identity and Access Management (IAM) configuration. If set to `role`, the `sts_role_arn` set in the `aws` configuration is used. Default is `default`.

#### SASL PLAINTEXT

The following options are required when using the [SASL PLAINTEXT](https://kafka.apache.org/10/javadoc/org/apache/kafka/common/security/auth/SecurityProtocol.html) protocol.

Option | Type | Description
:--- | :--- | :---
`username` | String | The username for the PLAINTEXT authentication.
`password` | String | The password for the PLAINTEXT authentication.

#### Encryption

Use the following options when setting SSL encryption.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`type` | No | String | The encryption type. Use `none` to disable encryption. Default is `ssl`.
`insecure` | No | Boolean | A Boolean flag used to turn off SSL certificate verification. If set to `true`, certificate authority (CA) certificate verification is turned off and insecure HTTP requests are sent. Default is `false`.

#### producer_properties

Use the following configuration options to configure a Kafka producer.
Option | Required | Type | Description
:--- | :--- | :--- | :---
`max_request_size` | No | Integer | The maximum size of the request that the producer sends to Kafka. Default is 1 MB.


#### aws

Use the following options when setting up authentication for `aws` services.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`region` | No | String | The AWS Region to use for credentials. Defaults to the [standard SDK behavior for determining the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
`sts_role_arn` | No | String | The AWS STS role to assume for requests to Amazon Simple Queue Service (Amazon SQS) and Amazon Simple Storage Service (Amazon S3). Default is `null`, which will use the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`msk` | No | JSON object | The [Amazon MSK](#msk) configuration settings.

#### msk

Use the following options inside the `msk` object.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`arn` | Yes | String | The [Amazon MSK ARN](https://docs.aws.amazon.com/msk/1.0/apireference/configurations-arn.html) to use.
`broker_connection_type` No | String | The type of connector to use with the Amazon MSK broker, either `public`, `single_vpc`, or `multi_vpc`. Default is `single_vpc`.
