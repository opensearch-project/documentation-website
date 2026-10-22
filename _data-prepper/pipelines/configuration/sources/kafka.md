---
layout: default
title: Kafka
parent: Sources
grand_parent: Pipelines
nav_order: 40
---

# Kafka source

You can use the Apache Kafka source (`kafka`) in OpenSearch Data Prepper to read records from one or more Kafka [topics](https://kafka.apache.org/intro#intro_concepts_and_terms). These records hold events that your Data Prepper pipeline can ingest. The `kafka` source uses Kafka's [Consumer API](https://kafka.apache.org/documentation/#consumerapi) to consume messages from the Kafka broker, which then creates Data Prepper events for further processing by the Data Prepper pipeline.

## Usage

The following example shows the `kafka` source in a Data Prepper pipeline:

```yaml
kafka-pipeline:
  source:
    kafka:
      bootstrap_servers:
        - 127.0.0.1:9092
      topics:
        - name: Topic1
          group_id: groupID1
        - name: Topic2
          group_id: groupID1
  sink:
    - stdout: {}
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
`acknowledgments_timeout` | No | Duration | The maximum amount of time to wait for end-to-end acknowledgments of the records read from Kafka. Applies only when `acknowledgments` is `true`. If the records are not acknowledged within this time, their offsets are not committed. By default, acknowledgments effectively never time out.
`client_dns_lookup` | Yes, when a DNS alias is used. | String | Sets Kafka's `client.dns.lookup` option. Default is `default`.

### Topics

Use the following options in the `topics` array for each topic.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`name` | Yes | String | The name of each Kafka topic.
`group_id` | Yes | String | Sets Kafka's `group.id` option.
`client_id` | No | String | Sets Kafka's `client.id` option for the topic's consumers. Must be between 1 and 255 characters long.
`workers` | No | Integer | The number of multithreaded consumers associated with each topic. Default is `2`. The maximum value is `200`.
`serde_format` | No | String | Indicates the serialization and deserialization format of the messages in the topic. Default is `plaintext`.
`auto_commit` | No | Boolean | When `false`, the consumer's offset will not be periodically committed to Kafka in the background. Default is `false`.
`commit_interval` | No | Duration | When `auto_commit` is set to `true`, sets how frequently the consumer offsets are auto-committed to Kafka through Kafka's `auto.commit.interval.ms` option. Default is `5s`.
`session_timeout` | No | Duration | The amount of time during which the source detects client failures when using Kafka's group management features, which can be used to balance the data stream. Default is `45s`.
`auto_offset_reset` | No | String | Automatically resets the offset to an earlier or the latest offset through Kafka's `auto.offset.reset` option. Default is `earliest`.
`thread_waiting_time` | No | Duration | The amount of time that threads wait for the preceding thread to complete its task and to signal the next thread. The Kafka consumer API poll timeout value is set to half of this setting. Default is `5s`.
`max_partition_fetch_bytes` | No | String | Sets the maximum amount of data returned from each partition through Kafka's `max.partition.fetch.bytes` setting. Default is `1mb`.
`heart_beat_interval` | No | Duration | The expected amount of time between heartbeats to the consumer coordinator when using Kafka's group management facilities through Kafka's `heartbeat.interval.ms` setting. Default is `5s`.
`fetch_max_wait` | No | Integer | The maximum amount of time, in milliseconds, during which the server blocks a fetch request when there isn't sufficient data to satisfy the `fetch_min_bytes` requirement through Kafka's `fetch.max.wait.ms` setting. Default is `500`.
`fetch_max_bytes` | No | String | The maximum amount of data the server returns for a fetch request through Kafka's `fetch.max.bytes` setting. The maximum value is `50mb`. Default is `50mb`.
`fetch_min_bytes` | No | String | The minimum amount of data the server returns during a fetch request through Kafka's `fetch.min.bytes` setting. Default is `1b`.
`retry_backoff` | No | Duration | The amount of time to wait before attempting to retry a failed request to a given topic partition. Default is `10s`.
`reconnect_backoff` | No | Duration | The amount of time to wait before attempting to reconnect to a broker through Kafka's `reconnect.backoff.ms` setting. Default is `10s`.
`max_poll_interval` | No | Duration | The maximum delay between invocations of a `poll()` when using group management through Kafka's `max.poll.interval.ms` option. Default is `300s`.
`consumer_max_poll_records` | No | Integer | The maximum number of records returned in a single `poll()` call through Kafka's `max.poll.records` setting. Default is `500`.
`isolation_level` | No | String | Controls how the consumer reads messages written transactionally, through Kafka's `isolation.level` setting. Valid values are `read_uncommitted`, which returns all messages, and `read_committed`, which returns only messages from committed transactions. Default is `read_uncommitted`.
`key_mode` | No | String | Indicates how the key field of the Kafka message should be handled. The default setting is `include_as_field`, which includes the key in the `kafka_key` event. The `include_as_metadata` setting includes the key in the event's metadata. The `discard` setting discards the key.

### Schema

The `schema` configuration has the following options.

Option | Type | Required | Description
:--- | :--- | :--- | :---
`type` | String | Yes | Sets the type of schema based on your registry. Valid values are `aws_glue` (AWS Glue schema registry) and `confluent` (Confluent schema registry) . When using the `aws_glue` registry, set any [AWS](#aws) configuration options.
`override_endpoint` | Boolean | No | When `true` and `type` is `aws_glue`, the `kafka` source uses the `registry_url` as the AWS Glue Schema Registry endpoint. Default is `false`.
`basic_auth_credentials_source` | String | No | Where schema registry credentials come from. Use `USER_INFO` when providing `api_key/api_secret`. Other valid values are `URL` and `SASL_INHERIT`. Default typically aligns with the underlying client.

The following configuration options are only required when using a `confluent` registry.

Option | Type | Description
:--- | :--- | :---
`registry_url` | String | The base URL of the schema registry (for example, `http://schema-registry:8081` or `https://sr.example.com`).
`version` | Integer | The schema version to use per subject. If not specified, the latest version is used.
`api_key` | String | The schema registry API key.
`api_secret` | String | The schema registry API secret.

The following example configures a schema registry:

```yaml
schema:
  type: confluent
  registry_url: "http://schema-registry:8081"
  api_key: "<optional if using basic/key auth>"
  api_secret: "<optional if using basic/key auth>"
```
{% include copy.html %}

#### Schema registry over TLS

The Kafka source uses the JVM truststore when connecting to the schema registry over `https`. If the schema registry is signed by a custom CA, add that CA to the Data Prepper JVM truststore or provide a custom truststore using environment variables. 

You can use the following command to build a truststore with your CA certificate:

```bash
keytool -importcert -noprompt -alias sr-ca -file sr-ca.pem -keystore /usr/share/data-prepper/certs/sr.truststore.jks -storepass changeit
```
{% include copy.html %}

The following command configures Data Prepper using `JAVA_TOOL_OPTIONS`:

```yaml
JAVA_TOOL_OPTIONS=-Djavax.net.ssl.trustStore=/usr/share/data-prepper/certs/sr.truststore.jks -Djavax.net.ssl.trustStorePassword=changeit
```
{% include copy.html %}

You can configure Data Pepper in `docker-compose.yaml` using the following method:

```yaml
environment:
  - JAVA_TOOL_OPTIONS=-Djavax.net.ssl.trustStore=/usr/share/data-prepper/certs/sr.truststore.jks -Djavax.net.ssl.trustStorePassword=changeit
volumes:
  - ./certs:/usr/share/data-prepper/certs:ro
```
{% include copy.html %}

### Authentication

The `authentication` section configures SASL:

```yaml
authentication:
  sasl:
    plaintext:
      username: alice
      password: secret
```
{% include copy.html %}

| Option | Type | Description |
|:---|:---|:---|
| `sasl` | Object | SASL configuration. |

#### SASL

Use one of the following options when configuring SASL authentication.

Option | Type | Description
:--- | :--- | :---
`plaintext` | JSON object | The plaintext authentication configuration. The alias `plain` is also supported for backward compatibility. For more information, see [SASL plaintext](#sasl-plaintext).
`scram` | JSON object | The Salted Challenge Response Authentication Mechanism (SCRAM) authentication configuration. For more information, see [SASL SCRAM](#sasl-scram).
`aws_msk_iam` | String | The Amazon MSK AWS Identity and Access Management (IAM) configuration. If set to `role`, the `sts_role_arn` set in the `aws` configuration is used. Default is `default`.

##### SASL plaintext

The following options are required when using the [SASL.plain](https://kafka.apache.org/10/javadoc/org/apache/kafka/common/security/auth/SecurityProtocol.html) protocol.

| Option | Type | Description |
|:---|:---|:---|
| `username` | String | The SASL/PLAIN username. |
| `password` | String | The SASL/PLAIN password. |

##### SASL SCRAM

The following options are required when using SCRAM authentication.

| Option | Type | Description |
|:---|:---|:---|
| `username` | String | The SCRAM username. |
| `password` | String | The SCRAM password. |
| `mechanism` | String | The SCRAM mechanism to use, for example, `SCRAM-SHA-256` or `SCRAM-SHA-512`. The value is passed to Kafka's `sasl.mechanism` setting. |

### Encryption

Use the following options when setting SSL encryption.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`type` | No | String | The encryption type. Use `none` to disable encryption. Default is `ssl`.
`certificate` | No | String | The SSL certificate content. Use either this option or `trust_store_file_path`, not both.
`trust_store_file_path` | No | String | The path to the truststore file containing the SSL certificate. Use either this option or `certificate`, not both.
`trust_store_password` | No | String | The password for the truststore file.
`insecure` | No | Boolean | A Boolean flag used to turn off SSL certificate verification. If set to `true`, certificate authority (CA) certificate verification is turned off and insecure HTTP requests are sent. Default is `false`.

Use the following configuration to enable SSL encryption:

```yaml
encryption:
  type: ssl
  # With public CA: no extra config needed.
  # With private CA: trust using JVM truststore.
```
{% include copy.html %}

### AWS

Use the following options when setting up authentication for `aws` services.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`region` | No | String | The AWS Region to use for credentials. Defaults to [standard SDK behavior to determine the Region](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/region-selection.html).
`sts_role_arn` | No | String | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon Simple Queue Service (Amazon SQS) and Amazon Simple Storage Service (Amazon S3). Default is `null`, which will use the [standard SDK behavior for credentials](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/credentials.html).
`msk` | No | JSON object | The [MSK](#msk) configuration settings.
`sts_header_overrides` | No | Map | A map of headers to add to the AWS STS `AssumeRole` request. You can specify up to 5 headers.
`role_session_name` | No | String | The role session name to use when authenticating to Amazon MSK using the role specified in `sts_role_arn`. Applies only when `aws_msk_iam` is set to `role`.

#### MSK

Use the following options inside the `msk` object.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`arn` | Yes | String | The [MSK ARN](https://docs.aws.amazon.com/msk/1.0/apireference/configurations-arn.html) to use.
`broker_connection_type` | No | String | The type of connector to use with the MSK broker. Valid values are `public`, `single_vpc`, and `multi_vpc`. Default is `single_vpc`.

## Configuration examples

This section demonstrates different pipeline configuration options.

### Basic Kafka source

The following example pipeline reads JSON messages from a single plaintext Kafka topic with multiple consumer workers, parses them, and indexes them into OpenSearch:

```yaml
kafka-pipeline:
  source:
    kafka:
      bootstrap_servers:
        - localhost:9092
      topics:
        - name: my-topic
          group_id: data-prepper-group
          workers: 4
  processor:
    - parse_json:
  sink:
    - opensearch:
        hosts: ["https://localhost:9200"]
        username: admin
        password: "<custom-admin-password>"
        index: kafka-data
```
{% include copy.html %}

### Kafka source with SSL encryption

The following example pipeline connects to a Kafka broker over TLS, consumes messages from a secure topic, and writes the results to OpenSearch:

```yaml
kafka-pipeline:
  source:
    kafka:
      bootstrap_servers:
        - kafka-broker.example.com:9093
      topics:
        - name: secure-topic
          group_id: secure-group
      encryption:
        type: ssl
  sink:
    - opensearch:
        hosts: ["https://localhost:9200"]
        username: admin
        password: "<custom-admin-password>"
        index: secure-kafka-data
```
{% include copy.html %}

### Kafka source with SASL PLAIN authentication

The following example pipeline authenticates to Kafka using the SASL/PLAIN protocol over TLS, consumes messages from the topic, and indexes them into OpenSearch:

```yaml
kafka-pipeline:
  source:
    kafka:
      bootstrap_servers:
        - kafka-broker.example.com:9094
      topics:
        - name: authenticated-topic
          group_id: auth-group
      encryption:
        type: ssl
      authentication:
        sasl:
          plaintext:
            username: kafka-user
            password: kafka-password
  sink:
    - opensearch:
        hosts: ["https://localhost:9200"]
        username: admin
        password: "<custom-admin-password>"
        index: authenticated-kafka-data
```
{% include copy.html %}

### Amazon MSK with AWS Glue schema registry

The following example configures Amazon MSK with the AWS Glue schema registry, consumes messages from an MSK cluster using AWS settings, deserializes the payload using the AWS Glue schema registry, normalizes timestamps, and writes to an Amazon OpenSearch domain:

```yaml
msk-pipeline:
  source:
    kafka:
      acknowledgments: true
      topics:
        - name: my-msk-topic
          group_id: msk-consumer-group
          auto_offset_reset: earliest
      aws:
        region: us-east-1
        sts_role_arn: arn:aws:iam::123456789012:role/data-prepper-role
        msk:
          arn: arn:aws:kafka:us-east-1:123456789012:cluster/my-cluster-name/uuid
      schema:
        type: aws_glue
  processor:
    - date:
        match:
          - key: timestamp
            patterns: ["epoch_milli"]
        destination: "@timestamp"
  sink:
    - opensearch:
        hosts: ["https://search-my-domain.us-east-1.opensearch.amazonaws.com"]
        aws:
          region: us-east-1
          sts_role_arn: arn:aws:iam::123456789012:role/opensearch-role
        index: msk-data
        index_type: custom
```
{% include copy.html %}

### Confluent Kafka with schema registry

The following example configures Confluent Kafka with the schema registry, connects to Confluent Cloud over TLS using SASL and Confluent schema registry credentials, decodes payloads, and indexes them into OpenSearch:

```yaml
confluent-pipeline:
  source:
    kafka:
      bootstrap_servers:
        - pkc-xxxxx.us-east-1.aws.confluent.cloud:9092
      topics:
        - name: confluent-topic
          group_id: confluent-group
          auto_offset_reset: earliest
      encryption:
        type: ssl
      authentication:
        sasl:
          plaintext:
            username: confluent-api-key
            password: confluent-api-secret
      schema:
        type: confluent
        registry_url: https://psrc-xxxxx.us-east-1.aws.confluent.cloud
        api_key: "{% raw %}${{aws_secrets:schema-secret:schema_registry_api_key}}{% endraw %}"
        api_secret: "{% raw %}${{aws_secrets:schema-secret:schema_registry_api_secret}}{% endraw %}"
        basic_auth_credentials_source: USER_INFO
  sink:
    - opensearch:
        hosts: ["https://localhost:9200"]
        username: admin
        password: "<custom-admin-password>"
        index_type: custom
        index: confluent-data
```
{% include copy.html %}

