---
layout: default
title: Configuring OpenSearch Data Prepper
parent: Managing OpenSearch Data Prepper
nav_order: 5
redirect_from:
 - /clients/data-prepper/data-prepper-reference/
 - /monitoring-plugins/trace/data-prepper-reference/
canonical_url: https://docs.opensearch.org/latest/data-prepper/managing-data-prepper/configuring-data-prepper/
---

# Configuring OpenSearch Data Prepper

You can customize your OpenSearch Data Prepper configuration by editing the `data-prepper-config.yaml` file in your Data Prepper installation. The following configuration options are independent from pipeline configuration options.

## Data Prepper configuration

Use the following options to customize your Data Prepper configuration.

Option | Required | Type | Description
:--- | :--- |:--- | :---
`ssl` | No | Boolean | Indicates whether TLS should be used for server APIs. Default is `true`.
`keyStoreFilePath` | No | String | The path to a `.jks` or `.p12` keystore file. Required if `ssl` is `true`.
`keyStorePassword` | No | String | The password for the keystore. Optional; Defaults to an empty string.
`privateKeyPassword` | No | String | The password for a private key within the keystore. Optional; Defaults to an empty string.
`serverPort` | No | Integer | The port number to use for server APIs. Default is `4900`.
`metricRegistries` | No | List | The metric registries for publishing generated metrics. Currently supports **Prometheus** and **Amazon CloudWatch**. Default is **Prometheus**.
`metricTags` | No | Map | A map of up to three key-value pairs that define common metric tags for metric registries. The `serviceName` key is reserved (default is `DataPrepper`). You can override it by setting the environment variable `DATAPREPPER_SERVICE_NAME`. If `serviceName` is included in `metricTags`, it takes precedence.
`authentication` | No | Object | The authentication configuration for the server APIs. Valid value is `http_basic`, which requires a `username` and `password`. If not defined, the server does not perform authentication.
`processorShutdownTimeout` | No | Duration | The amount of time allowed for processors to finish processing in-flight data and shut down gracefully. Default is `30s`.
`sinkShutdownTimeout` | No | Duration | The amount of time allowed for sinks to clear in‑flight data and shut down gracefully. Default is `30s`.
`peer_forwarder` | No | Object | The Peer Forwarder configuration. See [Peer Forwarder options](#peer-forwarder-options).
`circuit_breakers` | No | [circuit_breakers](#circuit-breakers) | Configures one or more circuit breakers to control incoming data.
`extensions` | No | Object | The extension plugin configurations shared by pipelines. See [Extension plugins](#extension-plugins).

### Peer Forwarder options

The following section details various configuration options for peer forwarding.

#### General options for peer forwarding

The following table lists the general configuration for peer forwarding.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`port` | No | Integer | The peer forwarding server port (`0`–`65535`). Default is `4994`.
`request_timeout` | No | Integer | The Peer Forwarder HTTP server request timeout, in milliseconds. Default is `10000`.
`server_thread_count` | No | Integer | The number of threads used by the Peer Forwarder server. Default is `200`.
`client_thread_count` | No | Integer | The number of threads used by the Peer Forwarder client. Default is `200`.
`max_connection_count` | No | Integer | The maximum number of open connections for the Peer Forwarder server. Default is `500`.
`max_pending_requests` | No | Integer | The maximum number of tasks in the `ScheduledThreadPool` work queue. Default is `1024`.
`discovery_mode` | No | String | The peer discovery mode. Valid values are `local_node` (process locally), `static` (fixed list of peers), `dns` (DNS A records), or `aws_cloud_map` (AWS service registry). Default is `local_node`.
`static_endpoints` | Conditional | List | The endpoints for all Data Prepper instances. Required if `discovery_mode` is set to `static`.
`domain_name` | Conditional | String | The domain name used for DNS-based discovery (supports multiple A records). Required if `discovery_mode` is set to `dns`.
`aws_cloud_map_namespace_name` | Conditional | String | The AWS Cloud Map namespace. Required if `discovery_mode` is set to `aws_cloud_map`.
`aws_cloud_map_service_name` | Conditional | String | The AWS Cloud Map service name. Required if `discovery_mode` is set to `aws_cloud_map`.
`aws_cloud_map_query_parameters` | No | Map | The key‑value filters applied to AWS Cloud Map instance attributes.
`buffer_size` | No | Integer | The maximum number of unchecked records the buffer can hold, including written and in-flight records that haven't been checkpointed. Default is `512`.
`batch_size` | No | Integer | The maximum number of records returned in a single read operation. Default is `48`.
`aws_region` | Conditional | String | The AWS Region used with AWS Certificate Manager (ACM), Amazon Simple Storage Service (Amazon S3), or AWS Cloud Map. Required if:<br> - `use_acm_certificate_for_ssl: true`. <br> - `ssl_certificate_file` or `ssl_key_file` is an S3 path. <br> - `discovery_mode` is set to `aws_cloud_map`.
`drain_timeout` | No | Duration | The amount of time allowed for Peer Forwarder to complete processing before shutdown. Default is `10s`.

#### TLS/SSL options for Peer Forwarder

Use the following options to enable and configure TLS/SSL for Peer Forwarder, including certificate sources (files, S3, or ACM) and verification behavior.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`ssl` | No | Boolean | Enables TLS/SSL. Default is `true`.
`ssl_certificate_file` | Conditionally | String | The SSL certificate chain file path or S3 path (`s3://<bucket>/<path>`). Required if `ssl: true` and `use_acm_certificate_for_ssl: false`. Default is `config/default_certificate.pem`. See the [configuration example](https://github.com/opensearch-project/data-prepper/blob/17c3e290676e6c774cb8a0d4d8eaec7ae8bd696a/data-prepper-core/src/test/resources/valid_peer_forwarder_config_with_mutual_tls.yml) in the Data Prepper repo.
`ssl_key_file` | Conditionally | String | The SSL private key file path or S3 path. Required if `ssl` is set to `true` and `use_acm_certificate_for_ssl` is set to `false`. Default is `config/default_private_key.pem`.
`ssl_insecure_disable_verification` | No | Boolean | Disables verification of the server TLS certificate chain. Default is `false`.
`ssl_fingerprint_verification_only` | No | Boolean | If `true`, verifies only the certificate fingerprint (disables chain verification). Default is `false`.
`use_acm_certificate_for_ssl` | No | Boolean | If `true`, enables TLS/SSL using a certificate and private key from ACM. Default is `false`.
`acm_certificate_arn` | Conditionally | String | The ACM certificate Amazon Resource Name (ARN). Required if `use_acm_certificate_for_ssl` is set to `true`.
`acm_private_key_password` | No | String | The password used to decrypt the ACM private key. If not provided, Data Prepper generates a random password.
`acm_certificate_timeout_millis` | No | Integer | The timeout for retrieving ACM certificates, in milliseconds. Default is `120000`.
`aws_region` | Conditionally | String | The AWS Region used with ACM, S3, or AWS Cloud Map. Required if `use_acm_certificate_for_ssl` is set to `true`, the `ssl_certificate_file` or `ssl_key_file` is an S3 path, or `discovery_mode` is set to `aws_cloud_map`.

#### Authentication options for Peer Forwarder

Use the following option to specify how Peer Forwarder authenticates requests between peers.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`authentication` | No | Map | The authentication method. Valid values are `mutual_tls` (mTLS) or `unauthenticated` (no authentication). Default is `unauthenticated`.

## Circuit breakers

Data Prepper includes a circuit breaker to help prevent Java heap memory exhaustion. This is particularly useful for pipelines that use stateful processors, which retain data in memory beyond the buffers.

When a circuit breaker is triggered, Data Prepper rejects incoming data routed into buffers until the breaker resets.

The following table lists the available circuit breaker configuration blocks.

Option | Required | Type | Description
:--- | :--- |:---| :---
`heap` | No | [heap](#heap-circuit-breaker) | Enables a heap circuit breaker. Disabled by default.

### Heap circuit breaker

The `heap` circuit breaker configures Data Prepper to reject incoming data when the JVM heap reaches a specified usage threshold. The `heap` parameter supports the following values.

Option | Required | Type | Description
:--- |:---|:---| :---
`usage` | Yes | Bytes | The JVM heap usage at which to trigger the circuit breaker (for example, `6.5gb`). If current usage exceeds this value, the breaker is triggered.
`check_interval` | No | Duration | The time interval between heap size checks that determine whether the circuit breaker should be activated. Default is `500ms`.
`reset` | No  | Duration | The minimum amount of time the circuit breaker remains activated before new heap size checks can attempt to deactivate it. Default is `1s`.

## Extension plugins

Data Prepper supports user‑configurable extension plugins. Extension plugins provide a reusable configuration shared across pipeline plugins (sources, buffers, processors, or sinks).

### AWS extension plugin

The `aws` extension provides the `secrets` configuration, which integrates with [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) to securely manage sensitive configuration values in your pipelines. The following example shows a basic configuration:

```yaml
extensions:
  aws:
    secrets:
      <YOUR_SECRET_CONFIG_ID_1>:
        secret_id: <YOUR_SECRET_ID_1>
        region: <YOUR_REGION_1>
        sts_role_arn: <YOUR_STS_ROLE_ARN_1>
        refresh_interval: <YOUR_REFRESH_INTERVAL>
        disable_refresh: false
      <YOUR_SECRET_CONFIG_ID_2>:
        # ...
```
{% include copy.html %}

### Secrets

The `secrets` configuration supports the following parameters.

Option | Required | Type | Description
:--- |:---|:---| :---
`secret_id`  | Yes | String | The AWS secret name or ARN.
`region` | No | String | The AWS Region containing the secret. Default is `us-east-1`.
`sts_role_arn` | No | String | The AWS Security Token Service (AWS STS) role to assume for Secrets Manager requests. Default is `null` (standard SDK behavior for credentials).
`refresh_interval` | No | Duration | The poll interval for refreshing secret values. Default is `PT1H`. See [Automatically refreshing secrets](#automatically-refreshing-secrets).
`disable_refresh` | No | Boolean | Disables regular polling for the latest secret values. Default is `false`. When `true`, `refresh_interval` is ignored.

#### Reference secrets

In `pipelines.yaml`, reference secret values in plugin settings using:

* Plaintext: `{% raw %}${{aws_secrets:<YOUR_SECRET_CONFIG_ID>}}{% endraw %}`
* JSON key: `{% raw %}${{aws_secrets:<YOUR_SECRET_CONFIG_ID>:<YOUR_KEY>}}{% endraw %}`

You can use the following setting types for secret substitution: string, number, long, short, integer, double, float, Boolean, or character.

The following is an example `data-prepper-config.yaml` with two secret configuration IDs (`host-secret-config` and `credential-secret-config`):

```yaml
extensions:
  aws:
    secrets:
      host-secret-config:
        secret_id: <YOUR_SECRET_ID_1>
        region: <YOUR_REGION_1>
        sts_role_arn: <YOUR_STS_ROLE_ARN_1>
        refresh_interval: <YOUR_REFRESH_INTERVAL_1>
      credential-secret-config:
        secret_id: <YOUR_SECRET_ID_2>
        region: <YOUR_REGION_2>
        sts_role_arn: <YOUR_STS_ROLE_ARN_2>
        refresh_interval: <YOUR_REFRESH_INTERVAL_2>
```
{% include copy.html %}

You can then reference these secrets in `pipelines.yaml` as follows:

```yaml
sink:
  - opensearch:
      hosts: [{% raw %}"${{aws_secrets:host-secret-config}}"{% endraw %}]
      username: {% raw %}"${{aws_secrets:credential-secret-config:username}}"{% endraw %}
      password: {% raw %}"${{aws_secrets:credential-secret-config:password}}"{% endraw %}
      index: "test-migration"
```
{% include copy.html %}

#### Automatically refreshing secrets

For each secret configuration, Data Prepper polls the latest value at a regular interval to support rotating secrets in AWS Secrets Manager. Refreshed values are used by plugins that can refresh their connections/authentication (for example, sinks). For multiple secret configurations, a jitter of up to `60s` is applied across all configurations during the initial polling.
