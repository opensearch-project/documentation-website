---
layout: default
title: kafka
parent: Sources
grand_parent: Pipelines
nav_order: 6
---

# kafka

The `kafka` source reads records from Apache Kafka [topics](https://kafka.apache.org/intro#intro_concepts_and_terms), which hold events that your Data Prepper pipeline can ingest. It uses Kafka's [Consumer API](https://kafka.apache.org/documentation/#consumerapi) to consume messages from the Kafka broker. 

## Usage

The following example shows the `kafka` source in a Data Prepper pipeline:

```json
log-pipeline:
  source:
    kafka:
      bootstrap_servers:
        - 127.0.0.1:9093
      topics:
        - name: my-topic-1
          workers: 10
          autocommit: false
          autocommit_interval: 5s
          session_timeout: 45s
          max_retry_delay: 1s
          auto_offset_reset: earliest
          thread_waiting_time: 1s
          max_record_fetch_time: 4s
          heart_beat_interval: 3s
          buffer_default_timeout: 5s
          fetch_max_bytes: 52428800
          fetch_max_wait: 500
          fetch_min_bytes: 1
          retry_backoff: 100s
          max_poll_interval: 300000s
          consumer_max_poll_records: 500
        - name: my-topic-2
          workers: 10
      schema:
        registry_url: http://localhost:8081/
        version: 1
      authentication:
        sasl_plaintext:
          username: admin
          password: admin-secret
        sasl_oauth:
          oauth_client_id: 0oa9wc21447Pc5vsV5d8
          oauth_client_secret: aGmOfHqIEvBJGDxXAOOcatiE9PvsPgoEePx8IPPb
          oauth_login_server: https://dev-1365.okta.com
          oauth_login_endpoint: /oauth2/default/v1/token
          oauth_login_grant_type: refresh_token
          oauth_login_scope: kafka
          oauth_introspect_server: https://dev-1365.okta.com
          oauth_introspect_endpoint: /oauth2/default/v1/introspect
          oauth_sasl_mechanism: OAUTHBEARER
          oauth_security_protocol: SASL_PLAINTEXT
          oauth_sasl_login_callback_handler_class: org.apache.kafka.common.security.oauthbearer.secured.OAuthBearerLoginCallbackHandler
          oauth_jwks_endpoint_url: https://dev-1365.okta.com/oauth2/default/v1/keys
  sink:
    - stdout:
```

## Configuration

Use the following configuration options with the `kafka` source.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`bootstrap_servers` | Yes | IP address | The host or port for the initial connection to the Kafka cluster. You can configure multiple Kafka brokers by using the IP address or port number for each broker.
`topics` | Yes | JSON array | The topics inside of Kafka where the Data Prepper `kafka` source reads messages. You can configure up to 10 topics. For more information about options you need to configure inside `topics`, see [Topics](#topics)
`schema` | No | JSON array | Sets the default schema and version for the `kafka` source.
`authentication` | Yes | JSON array | Set the authentication options for both the pipeline and Kafka.


### Topics

Use the following options in the `topics` parameter.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`name` | Yes | String | The name of each Kafka topic.
`workers` | No | Integer | The number of multithreaded consumers associated with each topic. Default is `10`. The maximum value is `200`.
`autocommit` | No | Boolean | When `false`, the consumer's offset will no be periodically committed to Kafka in the background. Default is `false`.
`autocommit_interval` | No | Integer | When `autocommit` is set to `true`, sets the frequency in seconds that the consumer offsets are auto-committed to Kafka. Default is `1s`.
`session_timeout` | No | Integer | The timeout time the source detects client failures when using Kafka's group management features, which can be used to balance the data stream.
`max_retry_delay` | No | Integer | Determines the delay which the source retries during a buffer write error. Default is `1s`.
`auto_offset_reset` | No | String | Automatically resets the offset to the earlier or latest offset. Default is `earliest`.
`thread_waiting_time` | No | Integer | The time that threads wait until the preceding thread completes it's task and signals the next thread.
`max_record_fetch_time` | No | Integer | The maximum time in seconds to fetch a record from a topic. Default is `4s`.
`heart_beat_interval` | No | Integer | The maximum record batch size in bytes accepted by the Kafka broker. Defaults to `52428800`.
`fetch_max_wait` | No | Integer | The maximum amount of data the server returns during a fetch request. Default is `500`.
`fetch_min_bytes` | No | Integer | The minimum amount of data the server returns during a fetch request. Default is `1`.
`retry_backoff` | No | Integer | The amount of time to wait before attempting to retry a failed request to a given topic partition. Default is `5s`.
`max_poll_interval` | No | Integer | The maximum delay between invocations of a `poll()` when using group management. Default is `1s`.
`consumer_max_poll_records` | No | Integer | The maximum number of records returned in single `poll()` call. Default is `1s`.

### Schema

Use the following options inside the `schema` parameter:

Option | Required | Type | Description
:--- | :--- | :--- | :---
`registry_url` | No | String | Deserializes a record value from a bytearray into a string. Default is `org.apache.kafka.common.serialization.StringDeserializer`.
`version` | No | String | Deserializes a record key from a bytearray into a string. Default is `org.apache.kafka.common.serialization.StringDeserializer`.

### Authentication 

Use the following options inside the `authentication` parameter.

#### SASL PLAINTEXT

The following options are required when using the [SASL PLAINTEXT](https://kafka.apache.org/10/javadoc/org/apache/kafka/common/security/auth/SecurityProtocol.html) protocol.

Option | Type | Description
:--- | :--- | :---
`username` | String | The username for the PLAINTEXT auth.
`password` | String | The password for the PLAINTEXT auth.

#### OAuth

Use the following options when configuring for the [OAuth](https://kafka.apache.org/20/javadoc/org/apache/kafka/common/security/oauthbearer/OAuthBearerLoginModule.html) protocol.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`oauth_client_id` | Yes | String | The client ID for the authorization server.
`oauth_client_secret` | Yes | String | The secret only know by the client application and the authorization server.
`oauth_login_server` | Yes | URL | The URL of the OAuth server, for example `https://dev.okta.com`.
`oauth_login_endpoint` | Yes | URL | The endpoint URL of the OAuth server, for example `/oauth2/default/v1/token`.
`oauth_login_grant_type` | No | String | The way the application gets an access token from the OAuth server.
`oauth_login_scope` | No | String | Determines the scope in which the application has access to a user's account.
`oauth_introspect_server` | No | URL | The URL of the introspect server, which is usually similar to `oauth_login_server`.
`oauth_introspect_endpoint` | No | URL | The URL of the introspect server endpoint, for example, `/oauth2/default/v1/introspect`.
`oauth_sasl_mechanism` | No | String | Describes the authentication mechanism. 
`oauth_security_protocol` | No | String | The SASL security protocol, such as `PLAINTEXT` or `SSL`.
`oauth_sasl_login_callback_handler_class` | No | String | The user-defined or built-in Kafka class which handles the login mechanism and the login callback.
`oauth_jwks_endpoint_url` | No | URL | The absolute URL for the OAuth token refresh.