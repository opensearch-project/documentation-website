---
layout: default
title: kafka
parent: Buffers
grand_parent: Pipelines
nav_order: 80
---

# Kafka buffer

The `kafka` buffer buffers data into an Apache Kafka topic. It uses the Kafka topic to persist data while the data is in transit.

The following example shows how to run the Kafka buffer in an HTTP pipeline.
It runs against a locally running Kafka cluster.

```yaml
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
`acknowledgements_timeout` | No | Duration | The maximum amount of time to wait for end-to-end acknowledgments of the records read from the Kafka topic. If the records are not acknowledged within this time, the buffer resets the partitions and reads the records again. By default, acknowledgments effectively never time out.
`authentication` | No | [Authentication](#authentication) | Sets the authentication options for both the pipeline and Kafka. For more information, see [Authentication](#authentication).
`aws` | No | [AWS](#aws) | The AWS configuration. For more information, see [`aws`](#aws).
`bootstrap_servers` | Yes | String list | The host and port for the initial connection to the Kafka cluster. You can configure multiple Kafka brokers by using the IP address or the port number for each broker. When using [Amazon Managed Streaming for Apache Kafka (Amazon MSK)](https://aws.amazon.com/msk/) as your Kafka cluster, the bootstrap server information is obtained from Amazon MSK using the Amazon Resource Name (ARN) provided in the configuration.
`bounded_batch_size` | No | Integer | The maximum number of records drained from the in-memory buffer after each read. The Kafka buffer consumes records from the topic into this in-memory buffer, from which processors read them. Default is `250000`.
`bounded_buffer_size` | No | Integer | The maximum number of records that the in-memory buffer accepts after consuming them from the Kafka topic. Default is `1000000`.
`custom_metric_prefix` | No | String | A custom prefix for the buffer metrics. The prefix replaces the plugin name in the metric names. For example, setting this option to `mybuffer` produces metrics such as `mybufferRead_recordsConsumedRate`. If not specified, the plugin name `kafka` is used.
`drain_timeout` | No | Duration | The maximum amount of time to wait for the buffer to drain when the pipeline shuts down. Default is `30s`.
`encryption` | No | [Encryption](#encryption) | The encryption configuration for encryption in transit. For more information, see [Encryption](#encryption).
`producer_properties` | No | [Producer Properties](#producer_properties) | A list of configurable Kafka producer properties. 
`topics` | Yes | List | A list of [topics](#topic) for the buffer to use. You must supply one topic per buffer.


<!-- vale off -->
### topic
<!-- vale on -->

The `topic` option configures a single Kafka topic and tells the `kafka` buffer how to use that topic.


Option | Required | Type | Description
:--- | :--- | :--- | :---
`name` | Yes | String | The name of the Kafka topic.
`group_id` | Yes | String | Sets Kafka's `group.id` option.
`client_id` | No | String | Sets Kafka's `client.id` option for the buffer's consumers. Must be between 1 and 255 characters long.
`create_topic` | No | Boolean | When `true`, the buffer creates the topic when the pipeline starts. Default is `false`.
`number_of_partitions` | No | Integer | The number of partitions to use when creating the topic. Applies only when `create_topic` is `true`. Default is `1`.
`replication_factor` | No | Integer | The replication factor to use when creating the topic. Applies only when `create_topic` is `true`. Default is `1`.
`workers` | No | Integer | The number of multithreaded consumers associated with each topic. Default is `2`. The maximum value is `200`.
`encryption_key` | No | String | An Advanced Encryption Standard (AES) encryption key used to encrypt and decrypt data within OpenSearch Data Prepper before sending it to Kafka. This value must be plain text or encrypted using AWS Key Management Service (AWS KMS).
`kms` | No | AWS KMS key | When configured, uses an AWS KMS key to encrypt data. See [`kms`](#kms) for more information.
`encryption_id` | No | String | The ID of an encryption engine defined in the `encryption` extension of the `data-prepper-config.yaml` file. The buffer uses this encryption engine to encrypt and decrypt data before sending it to Kafka. Use either `encryption_id` or `encryption_key`, not both.
`auto_commit` | No | Boolean | When `false`, the consumer offset will not be periodically committed to Kafka in the background. Default is `false`.
`commit_interval` | No | Duration | When `auto_commit` is set to `true`, sets how often the consumer offsets are auto-committed to Kafka through Kafka's `auto.commit.interval.ms` option. Default is `5s`.
`session_timeout` | No | Duration | The amount of time during which the source detects client failures when using Kafka's group management features, which can be used to balance the data stream. Default is `45s`.
`auto_offset_reset` | No | String | Automatically resets the offset to the earliest or the latest offset through Kafka's `auto.offset.reset` option. Default is `earliest`.
`thread_waiting_time` | No | Duration | The amount of time that a thread waits for the preceding thread to complete its task and to signal the next thread. The Kafka consumer API poll timeout value is set to half of this setting. Default is `5s`.
`max_partition_fetch_bytes` | No | String | Sets the maximum amount of data returned from each partition through Kafka's `max.partition.fetch.bytes` setting. Default is `1mb`.
`heart_beat_interval` | No | Duration | The expected amount of time between heartbeats to the consumer coordinator when using Kafka's group management facilities through Kafka's `heartbeat.interval.ms` setting. Default is `5s`.
`fetch_max_wait` | No | Duration | The maximum amount of time during which the server blocks a fetch request when there isn't sufficient data to satisfy the `fetch_min_bytes` requirement through Kafka's `fetch.max.wait.ms` setting. Default is `1000ms`.
`fetch_max_bytes` | No | String | The maximum amount of data the server returns for a fetch request through Kafka's `fetch.max.bytes` setting. The maximum value is `50mb`. Default is `50mb`.
`fetch_min_bytes` | No | String | The minimum amount of data the server returns during a fetch request through Kafka's `fetch.min.bytes` setting. Default is `2kb`.
`retry_backoff` | No | Duration | The amount of time to wait before attempting to retry a failed request to a given topic partition. Default is `10s`.
`reconnect_backoff` | No | Duration | The amount of time to wait before attempting to reconnect to a broker through Kafka's `reconnect.backoff.ms` setting. Default is `10s`.
`max_poll_interval` | No | Duration | The maximum delay between invocations of a `poll()` when using group management through Kafka's `max.poll.interval.ms` option. Default is `300s`.
`consumer_max_poll_records` | No | Integer | The maximum number of records returned in a single `poll()` call through Kafka's `max.poll.records` setting. Default is `500`.
`max_message_bytes` | No | Integer | The maximum size of the message, in bytes. Default is 1 MB.


<!-- vale off -->
### kms
<!-- vale on -->

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
`scram` | JSON object | The [SCRAM](#sasl-scram) authentication configuration.
`aws_msk_iam` | String | The Amazon MSK AWS Identity and Access Management (IAM) configuration. If set to `role`, the `sts_role_arn` set in the `aws` configuration is used. Default is `default`.

#### SASL PLAINTEXT

The following options are required when using the [SASL PLAINTEXT](https://kafka.apache.org/10/javadoc/org/apache/kafka/common/security/auth/SecurityProtocol.html) protocol.

Option | Type | Description
:--- | :--- | :---
`username` | String | The username for the PLAINTEXT authentication.
`password` | String | The password for the PLAINTEXT authentication.

#### SASL SCRAM

The following options are required when using the Salted Challenge Response Authentication Mechanism (SCRAM).

Option | Type | Description
:--- | :--- | :---
`username` | String | The username for the SCRAM authentication.
`password` | String | The password for the SCRAM authentication.
`mechanism` | String | The SCRAM mechanism to use, for example, `SCRAM-SHA-256` or `SCRAM-SHA-512`. The value is passed to Kafka's `sasl.mechanism` setting.

#### Encryption

Use the following options when setting SSL encryption.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`type` | No | String | The encryption type. Use `none` to disable encryption. Default is `ssl`.
`certificate` | No | String | The SSL certificate content. Use either this option or `trust_store_file_path`, not both.
`trust_store_file_path` | No | String | The path to the truststore file containing the SSL certificate. Use either this option or `certificate`, not both.
`trust_store_password` | No | String | The password for the truststore file.
`insecure` | No | Boolean | A Boolean flag used to turn off SSL certificate verification. If set to `true`, certificate authority (CA) certificate verification is turned off and insecure HTTP requests are sent. Default is `false`.

<!-- vale off -->
#### producer_properties
<!-- vale on -->

Use the following configuration options to configure a Kafka producer.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`acks` | No | String | The number of acknowledgments the producer requires from the brokers before considering a request complete, through Kafka's `acks` setting. Valid values are `all`, `-1`, `0`, and `1`. If not specified, the Kafka client default is used.
`batch_size` | No | Integer | The maximum size, in bytes, of a batch of records sent to the same partition, through Kafka's `batch.size` setting. If not specified, the Kafka client default is used.
`buffer_memory` | No | String | The total amount of memory that the producer can use to buffer records waiting to be sent to Kafka, through Kafka's `buffer.memory` setting. Default is `50mb`.
`client_dns_lookup` | No | String | Sets Kafka's `client.dns.lookup` option for the producer. Valid values are `use_all_dns_ips` and `resolve_canonical_bootstrap_servers_only`. If not specified, the Kafka client default is used.
`client_id` | No | String | Sets Kafka's `client.id` option for the producer. If not specified, the Kafka client default is used.
`compression_type` | No | String | The compression type for the data that the producer sends, through Kafka's `compression.type` setting, for example, `gzip`, `snappy`, or `zstd`. When the topic uses encryption at rest (`encryption_key`, `kms`, or `encryption_id`), the buffer compresses the data itself before encrypting it and turns off Kafka compression. If not specified, the Kafka client default is used.
`connections_max_idle` | No | Duration | The amount of time after which idle connections are closed, through Kafka's `connections.max.idle.ms` setting. Default is `540s`.
`delivery_timeout` | No | Duration | The maximum amount of time to report the success or failure of a send request, including retries, through Kafka's `delivery.timeout.ms` setting. Default is `120s`.
`enable_idempotence` | No | Boolean | When `true`, the producer writes exactly one copy of each record to the topic, through Kafka's `enable.idempotence` setting. If not specified, the Kafka client default is used.
`interceptor_classes` | No | List | A list of fully qualified class names of Kafka producer interceptors, through Kafka's `interceptor.classes` setting. If not specified, the Kafka client default is used.
`linger_ms` | No | Integer | The amount of time, in milliseconds, that the producer waits for additional records before sending a batch, through Kafka's `linger.ms` setting. If not specified, the Kafka client default is used.
`max_block` | No | Duration | The maximum amount of time that a send request can be blocked, for example, when the producer buffer is full or metadata is unavailable, through Kafka's `max.block.ms` setting. Default is `60s`.
`max_in_flight_requests_per_connection` | No | Integer | The maximum number of unacknowledged requests that the producer sends on a single connection, through Kafka's `max.in.flight.requests.per.connection` setting. If not specified, the Kafka client default is used.
`max_request_size` | No | Integer | The maximum size, in bytes, of the request that the producer sends to Kafka. When `create_topic` is `true` and this value is greater than the default, the topic's `max.message.bytes` setting is also set to this value. Default is `1048576` (1 MB).
`metadata_max_age` | No | Duration | The amount of time after which the producer refreshes metadata, through Kafka's `metadata.max.age.ms` setting. Default is `300s`.
`metadata_max_idle` | No | Duration | The amount of time after which the producer discards cached metadata for an idle topic, through Kafka's `metadata.max.idle.ms` setting. Default is `300s`.
`metric_reporters` | No | List | A list of fully qualified class names of Kafka metric reporters, through Kafka's `metric.reporters` setting. If not specified, the Kafka client default is used.
`metrics_num_samples` | No | Integer | The number of samples maintained to compute Kafka client metrics, through Kafka's `metrics.num.samples` setting. If not specified, the Kafka client default is used.
`metrics_recording_level` | No | String | The highest recording level for Kafka client metrics, through Kafka's `metrics.recording.level` setting. Valid values are `INFO`, `DEBUG`, and `TRACE`. If not specified, the Kafka client default is used.
`metrics_sample_window` | No | Duration | The time window over which Kafka client metric samples are computed, through Kafka's `metrics.sample.window.ms` setting. Default is `300s`.
`partitioner_adaptive_partitioning_enable` | No | Boolean | When `true`, the producer sends more records to partitions on faster brokers, through Kafka's `partitioner.adaptive.partitioning.enable` setting. Default is `false`.
`partitioner_availability_timeout` | No | Duration | If a broker cannot process produce requests for a partition for this amount of time, the partitioner treats the partition as unavailable, through Kafka's `partitioner.availability.timeout.ms` setting. If not specified, the Kafka client default is used.
`partitioner_class` | No | String | The fully qualified class name of the partitioner that determines the partition for each record, through Kafka's `partitioner.class` setting. If not specified, the Kafka client default is used.
`partitioner_ignore_keys` | No | Boolean | When `true`, the producer ignores record keys when choosing a partition, through Kafka's `partitioner.ignore.keys` setting. If not specified, the Kafka client default is used.
`receive_buffer` | No | String | The size of the TCP receive buffer, through Kafka's `receive.buffer.bytes` setting. Default is `50mb`.
`reconnect_backoff` | No | Duration | The amount of time to wait before attempting to reconnect to a broker, through Kafka's `reconnect.backoff.ms` setting. Default is `50ms`.
`reconnect_backoff_max` | No | Duration | The maximum amount of time to wait when repeatedly failing to reconnect to a broker, through Kafka's `reconnect.backoff.max.ms` setting. Default is `1s`.
`request_timeout` | No | Duration | The maximum amount of time that the producer waits for a response to a request, through Kafka's `request.timeout.ms` setting. Default is `30s`.
`retries` | No | Integer | The number of times the producer retries sending a record that failed with a retriable error, through Kafka's `retries` setting. Default is `5`.
`retry_backoff` | No | Duration | The amount of time to wait before retrying a failed request, through Kafka's `retry.backoff.ms` setting. Default is `100ms`.
`send_buffer` | No | String | The size of the TCP send buffer, through Kafka's `send.buffer.bytes` setting. Default is `50mb`.
`socket_connection_setup_timeout` | No | Duration | The amount of time that the producer waits for a socket connection to be established, through Kafka's `socket.connection.setup.timeout.ms` setting. Default is `10s`.
`socket_connection_setup_timeout_max` | No | Duration | The maximum amount of time that the producer waits for a socket connection to be established when repeatedly failing to connect, through Kafka's `socket.connection.setup.timeout.max.ms` setting. Default is `30s`.


<!-- vale off -->
#### aws
<!-- vale on -->

Use the following options when setting up authentication for `aws` services.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`region` | No | String | The AWS Region to use for credentials. Defaults to the [standard SDK behavior for determining the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
`sts_role_arn` | No | String | The AWS STS role to assume for requests to Amazon Simple Queue Service (Amazon SQS) and Amazon Simple Storage Service (Amazon S3). Default is `null`, which will use the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`msk` | No | JSON object | The [Amazon MSK](#msk) configuration settings.
`sts_header_overrides` | No | Map | A map of headers to add to the AWS STS `AssumeRole` request. You can specify up to 5 headers.

<!-- vale off -->
#### msk
<!-- vale on -->

Use the following options inside the `msk` object.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`arn` | Yes | String | The [Amazon MSK ARN](https://docs.aws.amazon.com/msk/1.0/apireference/configurations-arn.html) to use.
`broker_connection_type` | No | String | The type of connector to use with the Amazon MSK broker, either `public`, `single_vpc`, or `multi_vpc`. Default is `single_vpc`.
