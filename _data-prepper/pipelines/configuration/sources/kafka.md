---
layout: default
title: kafka
parent: Sources
grand_parent: Pipelines
nav_order: 6
---

# kafka

You can use the Apache Kafka source (`kafka`) in Data Prepper to read records from one or more Kafka [topics](https://kafka.apache.org/intro#intro_concepts_and_terms). These records hold events that your Data Prepper pipeline can ingest. The `kafka` source uses Kafka's [Consumer API](https://kafka.apache.org/documentation/#consumerapi) to consume messages from the Kafka broker, which then creates Data Prepper events for further processing by the Data Prepper pipeline.

## Usage

The following example shows the `kafka` source in a Data Prepper pipeline:

```json
kafka-pipeline:
  source:
    kafka:
      bootstrap_servers:
        - 127.0.0.1:9093
      topics:
        - name: Topic1
          group_id: groupID1
        - name: Topic2
          group_id: groupID1
```

## Configuration

Use the following configuration options with the `kafka` source.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`bootstrap_servers` | Yes, when not using Amazon Managed Streaming for Apache Kafka (Amazon MSK) as a cluster. | IP address | The host or port for the initial connection to the Kafka cluster. You can configure multiple Kafka brokers by using the IP address or port number for each broker. When using [Amazon MSK](https://aws.amazon.com/msk/) as your Kafka cluster, the bootstrap server information is obtained from MSK using the MSK Amazon Resource Name (ARN) provided in the configuration.
`topics` | Yes | JSON array | The Kafka topics that the Data Prepper `kafka` source uses to read messages. You can configure up to 10 topics. For more information about `topics` configuration options, see [Topics](#topics).
`schema` | No | JSON object | The schema registry configuration. For more information, see [Schema](#schema).
`authentication` | No | JSON object | Set the authentication options for both the pipeline and Kafka. For more information, see [Authentication](#authentication).
`encryption` | No | JSON object | The encryption configuration. For more information, see [Encryption](#encryption).
`aws` | No | JSON object | The AWS configuration. For more information, see [aws](#aws).
`acknowledgments` | No | Boolean | If `true`, enables the `kafka` source to receive [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines/#end-to-end-acknowledgments) when events are received by OpenSearch sinks. Default is `false`.
`client_dns_lookup` | Yes, when a DNS alias is used. | String | Sets Kafka's `client.dns.lookup` option. Default is `default`.

### Topics

Use the following options in the `topics` array.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`name` | Yes | String | The name of each Kafka topic.
`group_id` | Yes | String | Sets Kafka's `group.id` option.
`workers` | No | Integer | The number of multithreaded consumers associated with each topic. Default is `2`. The maximum value is `200`.
`serde_format` | No | String | Indicates the serialization and deserialization format of the messages in the topic. Default is `plaintext`.
`auto_commit` | No | Boolean | When `false`, the consumer's offset will not be periodically committed to Kafka in the background. Default is `false`.
`commit_interval` | No | Integer | When `auto_commit` is set to `true`, sets how frequently, in seconds, the consumer offsets are auto-committed to Kafka through Kafka's `auto.commit.interval.ms` option. Default is `5s`.
`session_timeout` | No | Integer | The amount of time during which the source detects client failures when using Kafka's group management features, which can be used to balance the data stream. Default is `45s`.
`auto_offset_reset` | No | String | Automatically resets the offset to an earlier or the latest offset through Kafka's `auto.offset.reset` option. Default is `latest`.
`thread_waiting_time` | No | Integer | The amount of time that threads wait for the preceding thread to complete its task and to signal the next thread. The Kafka consumer API poll timeout value is set to half of this setting. Default is `5s`.
`max_partition_fetch_bytes` | No | Integer | Sets the maximum limit in megabytes for max data returns from each partition through Kafka's `max.partition.fetch.bytes` setting. Default is `1mb`.
`heart_beat_interval` | No | Integer | The expected amount of time between heartbeats to the consumer coordinator when using Kafka's group management facilities through Kafka's `heartbeat.interval.ms` setting. Default is `5s`.
`fetch_max_wait` | No | Integer | The maximum amount of time during which the server blocks a fetch request when there isn't sufficient data to satisfy the `fetch_min_bytes` requirement through Kafka's `fetch.max.wait.ms` setting. Default is `500ms`.
`fetch_max_bytes` | No | Integer | The maximum record size accepted by the broker through Kafka's `fetch.max.bytes` setting. Default is `50mb`.
`fetch_min_bytes` | No | Integer | The minimum amount of data the server returns during a fetch request through Kafka's `retry.backoff.ms` setting. Default is `1b`.
`retry_backoff` | No | Integer | The amount of time to wait before attempting to retry a failed request to a given topic partition. Default is `10s`.
`max_poll_interval` | No | Integer | The maximum delay between invocations of a `poll()` when using group management through Kafka's `max.poll.interval.ms` option. Default is `300s`.
`consumer_max_poll_records` | No | Integer | The maximum number of records returned in a single `poll()` call through Kafka's `max.poll.records` setting. Default is `500`.
`key_mode` | No | String | Indicates how the key field of the Kafka message should be handled. The default setting is `include_as_field`, which includes the key in the `kafka_key` event. The `include_as_metadata` setting includes the key in the event's metadata. The `discard` setting discards the key. 

### Schema

The following option is required inside the `schema` configuration.

Option | Type | Description
:--- | :--- | :---
`type` | String | Sets the type of schema based on your registry, either the AWS Glue Schema Registry, `aws_glue`, or the Confluent Schema Registry, `confluent`. When using the `aws_glue` registry, set any [AWS](#aws) configuration options.

The following configuration options are only required when using a `confluent` registry.

Option | Type | Description
:--- | :--- | :---
`registry_url` | String | Deserializes a record value from a `bytearray` into a string. Default is `org.apache.kafka.common.serialization.StringDeserializer`.
`version` | String | Deserializes a record key from a `bytearray` into a string. Default is `org.apache.kafka.common.serialization.StringDeserializer`.
`schema_registry_api_key` | String | The schema registry API key.
`schema_registry_api_secret` | String | The schema registry API secret.

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
`aws_msk_iam` | String | The Amazon MSK AWS Identity and Access Management (IAM) configuration. If set to `role`, the `sts_role_arm` set in the `aws` configuration is used. Default is `default`.



#### SASL PLAINTEXT

The following options are required when using the [SASL PLAINTEXT](https://kafka.apache.org/10/javadoc/org/apache/kafka/common/security/auth/SecurityProtocol.html) protocol.

Option | Type | Description
:--- | :--- | :---
`username` | String | The username for the PLAINTEXT auth.
`password` | String | The password for the PLAINTEXT auth.

#### Encryption 

Use the following options when setting SSL encryption.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`type` | No | String | The encryption type. Use `none` to disable encryption. Default is `ssl`.
`Insecure` | No | Boolean | A Boolean flag used to turn off SSL certificate verification. If set to `true`, certificate authority (CA) certificate verification is turned off and insecure HTTP requests are sent. Default is `false`.


#### AWS

Use the following options when setting up authentication for `aws` services.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`region` | No | String | The AWS Region to use for credentials. Defaults to [standard SDK behavior to determine the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
`sts_role_arn` | No | String | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon Simple Queue Service (Amazon SQS) and Amazon Simple Storage Service (Amazon S3). Default is `null`, which will use the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`msk` | No | JSON object | The [MSK](#msk) configuration settings.

#### MSK

Use the following options inside the `msk` object.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`arn` | Yes | String | The [MSK ARN](https://docs.aws.amazon.com/msk/1.0/apireference/configurations-arn.html) to use.
`broker_connection_type` No | String | The type of connector to use with the MSK broker, either `public`, `single_vpc`, or `multip_vpc`. Default is `single_vpc`.

