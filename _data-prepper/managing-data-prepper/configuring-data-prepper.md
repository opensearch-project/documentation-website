---
layout: default
title: Configuring OpenSearch Data Prepper
parent: Managing OpenSearch Data Prepper
nav_order: 5
redirect_from:
 - /clients/data-prepper/data-prepper-reference/
 - /monitoring-plugins/trace/data-prepper-reference/
---

# Configuring OpenSearch Data Prepper

You can customize your OpenSearch Data Prepper configuration by editing the `data-prepper-config.yaml` file in your Data Prepper installation. The following configuration options are independent from pipeline configuration options.

> **New in this version:** A practical **latency tuning guide** with ready‑to‑paste YAML, plus links between global settings and the knobs that most affect end‑to‑end delay.

---

## Data Prepper configuration

Use the following options to customize your Data Prepper configuration.

Option | Required | Type | Description
:--- | :--- |:--- | :---
ssl | No | Boolean | Indicates whether TLS should be used for server APIs. Defaults to `true`.
keyStoreFilePath | No | String | The path to a `.jks` or `.p12` keystore file. Required if `ssl` is `true`.
keyStorePassword | No | String | The password for keystore. Optional, defaults to empty string.
privateKeyPassword | No | String | The password for a private key within keystore. Optional, defaults to empty string.
serverPort | No | Integer | The port number to use for server APIs. Defaults to `4900`.
metricRegistries | No | List | The metrics registries for publishing generated metrics. Currently supports **Prometheus** and **Amazon CloudWatch**. Defaults to **Prometheus**.
metricTags | No | Map | A map of key‑value pairs as common metric tags to metric registries (max 3). `serviceName` is reserved and defaults to `DataPrepper`. You can also set it with `DATAPREPPER_SERVICE_NAME`. If `serviceName` is defined in `metricTags`, that value wins.
authentication | No | Object | The authentication configuration for the server APIs. Valid option: `http_basic` with `username` and `password`. If not defined, the server does **not** perform authentication.
processorShutdownTimeout | No | Duration | The time given to processors to clear in‑flight data and shut down gracefully. Default: `30s`.
sinkShutdownTimeout | No | Duration | The time given to sinks to clear in‑flight data and shut down gracefully. Default: `30s`.
peer_forwarder | No | Object | The Peer Forwarder configuration. See [Peer Forwarder options](#peer-forwarder-options).
circuit_breakers | No | [circuit_breakers](#circuit-breakers) | Configure circuit breaker(s) on incoming data.
extensions | No | Object | Extension plugin configuration shared by pipelines. See [Extension plugins](#extension-plugins).

### Peer Forwarder options

The following section details various configuration options for peer forwarding.

#### General options for peer forwarding

Option | Required | Type | Description
:--- | :--- | :--- | :---
port | No | Integer | Peer forwarding server port (`0`–`65535`). Default: `4994`.
request_timeout | No | Integer | Peer Forwarder HTTP server request timeout in **milliseconds**. Default: `10000`.
server_thread_count | No | Integer | The number of threads used by the Peer Forwarder **server**. Default: `200`.
client_thread_count | No | Integer | The number of threads used by the Peer Forwarder **client**. Default: `200`.
max_connection_count | No | Integer | The maximum number of open connections for the Peer Forwarder server. Default: `500`.
max_pending_requests | No | Integer | The maximum number of allowed tasks in the ScheduledThreadPool work queue. Default: `1024`.
discovery_mode | No | String | The peer discovery mode. One of `local_node`, `static`, `dns`, or `aws_cloud_map`. Default: `local_node` (process locally).
static_endpoints | Conditionally | List | The endpoints for all Data Prepper instances. **Required** if `discovery_mode: static`.
domain_name | Conditionally | String |The domain name to query for DNS‑based discovery (multiple A records). **Required** if `discovery_mode: dns`.
aws_cloud_map_namespace_name | Conditionally | String | The Cloud Map namespace. **Required** if `discovery_mode: aws_cloud_map`.
aws_cloud_map_service_name | Conditionally | String | The Cloud Map service name. **Required** if `discovery_mode: aws_cloud_map`.
aws_cloud_map_query_parameters | No | Map | The key‑value filters applied to Cloud Map instance attributes.
buffer_size | No | Integer | Maximum number of **unchecked** records the buffer accepts (written + in‑flight not yet checkpointed). Default: `512`.
batch_size | No | Integer | The maximum number of records returned on read. Default: `48`.
aws_region | Conditionally | String | The AWS region to use with ACM, S3, or AWS Cloud Map. **Required** if `use_acm_certificate_for_ssl: true`, or `ssl_certificate_file` / `ssl_key_file` is an S3 path, or `discovery_mode: aws_cloud_map`.
drain_timeout | No | Duration | The wait time for the Peer Forwarder to complete processing before shutdown. Default: `10s`.

#### TLS/SSL options for Peer Forwarder

Option | Required | Type | Description
:--- | :--- | :--- | :---
ssl | No | Boolean | Enables TLS/SSL. Default: `true`.
ssl_certificate_file | Conditionally | String | The SSL certificate chain file path or S3 path (`s3://<bucket>/<path>`). **Required** if `ssl: true` and `use_acm_certificate_for_ssl: false`. Default: `config/default_certificate.pem`. See the certificate examples in the Data Prepper repo.
ssl_key_file | Conditionally | String | The SSL private key file path or S3 path. **Required** if `ssl: true` and `use_acm_certificate_for_ssl: false`. Default: `config/default_private_key.pem`.
ssl_insecure_disable_verification | No | Boolean | Disables verification of the server TLS certificate chain. Default: `false`.
ssl_fingerprint_verification_only | No | Boolean | Verifies only the certificate fingerprint (disables chain verification). Default: `false`.
use_acm_certificate_for_ssl | No | Boolean | Enables TLS/SSL using certificate and private key from **AWS Certificate Manager (ACM)**. Default: `false`.
acm_certificate_arn | Conditionally | String | The ACM certificate ARN. Required if `use_acm_certificate_for_ssl: true`.
acm_private_key_password | No | String | The password to decrypt the ACM private key. If not provided, Data Prepper generates a random password.
acm_certificate_timeout_millis | No | Integer | The timeout (ms) for retrieving ACM certificates. Default: `120000`.
aws_region | Conditionally | String | The AWS region used with ACM, S3, or AWS Cloud Map. **Required** if `use_acm_certificate_for_ssl: true`, `ssl_certificate_file` / `ssl_key_file` is an S3 path, or `discovery_mode: aws_cloud_map`.

#### Authentication options for Peer Forwarder

Option | Required | Type | Description
:--- | :--- | :--- | :---
authentication | No | Map | The authentication method. One of `mutual_tls` (mTLS) or `unauthenticated` (no authentication). Default: `unauthenticated`.

---

## Circuit breakers

Data Prepper provides a circuit breaker to help prevent exhausting Java heap memory. This is useful when pipelines have **stateful** processors which retain memory outside of buffers.

When a circuit breaker trips, Data Prepper rejects incoming data routed into buffers until the breaker resets.

Option | Required | Type | Description
:--- | :--- |:---| :---
heap | No | [heap](#heap-circuit-breaker) | Enables a heap circuit breaker. Disabled by default.

### Heap circuit breaker

Configure Data Prepper to trip a circuit breaker when JVM heap reaches a specified usage threshold.

Option | Required | Type | Description
:--- |:---|:---| :---
usage | Yes | Bytes | The JVM heap usage at which to trip the circuit breaker (e.g., `6.5gb`). If current usage exceeds this value, the breaker opens.
reset | No  | Duration | The minimum time the breaker remains open before new checks. Default: `1s`.
check_interval | No | Duration | The time between heap‑size checks. Default: `500ms`.

---

## Extension plugins

Data Prepper supports user‑configurable **extension plugins**. Extension plugins provide reusable configuration shared across pipeline plugins (sources, buffers, processors, sinks).

### AWS extension plugins

Add the following to `data-prepper-config.yaml` under `extensions.aws`:

Option | Required | Type | Description
:--- |:---|:---| :---
aws | No  | Object | The AWS extension plugins configuration.

#### AWS secrets extension plugin

Configure [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) for referencing secret values in pipeline plugins:

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
{% include copy-curl.html %}

Reference secrets from `pipelines.yaml` under `extensions > aws`:

Option | Required | Type | Description
:--- |:---|:---| :---
secrets | No  | Object | The AWS Secrets Manager configuration. See [Secrets](#secrets) for more details.

### Secrets

Use the following settings under the `secrets` extension:

Option | Required | Type | Description
:--- |:---|:---| :---
secret_id  | Yes | String | The AWS secret name or ARN.
region | No | String | The AWS region of the secret. Default: `us-east-1`.
sts_role_arn | No | String | The AWS STS role to assume for Secrets Manager requests. Default: `null` (standard SDK behavior for credentials).
refresh_interval | No | Duration | The poll interval for refreshing secret values. Default: `PT1H`. See [Automatically refreshing secrets](#automatically-refreshing-secrets).
disable_refresh | No | Boolean | Disable regular polling for the latest secret values. Default: `false`. When `true`, `refresh_interval` is ignored.

#### Reference secrets

In `pipelines.yaml`, reference secret values in plugin settings using:

* Plaintext: `{% raw %}${{aws_secrets:<YOUR_SECRET_CONFIG_ID>}}{% endraw %}`
* JSON key: `{% raw %}${{aws_secrets:<YOUR_SECRET_CONFIG_ID>:<YOUR_KEY>}}{% endraw %}`

Supported plugin setting types for secret substitution: String, Number, Long, Short, Integer, Double, Float, Boolean, Character.

Example `data-prepper-config.yaml` with two secret config IDs (`host-secret-config`, `credential-secret-config`):

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
{% include copy-curl.html %}

You can then reference these secrets from `pipelines.yaml`:

```yaml
sink:
  - opensearch:
      hosts: [ {% raw %}"${{aws_secrets:host-secret-config}}"{% endraw %} ]
      username: {% raw %}"${{aws_secrets:credential-secret-config:username}}"{% endraw %}
      password: {% raw %}"${{aws_secrets:credential-secret-config:password}}"{% endraw %}
      index: "test-migration"
```
{% include copy-curl.html %}

#### Automatically refreshing secrets

For each secret configuration, Data Prepper polls the latest value on a regular interval to support rotating secrets in AWS Secrets Manager. Refreshed values are utilized by plugins that can refresh their connections/authentication (for example, sinks). For multiple secret configurations, jitter within `60s` is applied across all configurations during the initial polling.
