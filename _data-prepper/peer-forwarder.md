---
layout: default
title: Peer Forwarder
nav_order: 12
---

# Peer Forwarder

Peer Forwarder is an HTTP service that performs peer forwarding of an `event` between Data Prepper nodes for aggregation. Currently, Peer Forwarder is supported by the `aggregate`, `service_map_stateful`, and `otel_trace_raw` processors.

Peer Forwarder groups events based on the identification keys provided by the processors. For `service_map_stateful` and `otel_trace_raw`, the identification key is `traceId` by default and cannot be configured. The `aggregate` processor is configured using the `identification_keys` configuration option. From here, you can specify which keys to use for Peer Forwarder. You can find more information about [identification keys](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#identification_keys) on the aggregate processor page.

Peer discovery is currently provided by a static list, a DNS record lookup, or AWS Cloud Map.  

## Discovery modes

The following sections provide information about discovery modes.

### Static

Static discovery mode allows a Data Prepper node to discover nodes using a list of IP addresses or domain names. See the following yaml file for an example of static discovery mode:

```yaml
peer_forwarder:4
  discovery_mode: static
  static_endpoints: ["data-prepper1", "data-prepper2"]
```

### DNS lookup

DNS discovery is preferred over static discovery when scaling out a Data Prepper cluster. The core concept is to configure a DNS provider to return a list of Data Prepper hosts when given a single domain name. This is a [DNS A Record](https://www.cloudflare.com/learning/dns/dns-records/dns-a-record/), which indicates a list of IP addresses of a given domain. See the following yaml file for an example of DNS lookup:

```yaml
peer_forwarder:
  discovery_mode: dns
  domain_name: "data-prepper-cluster.my-domain.net"
```

### AWS Cloud Map

[AWS Cloud Map](https://docs.aws.amazon.com/cloud-map/latest/dg/what-is-cloud-map.html) provides API-based service discovery as well as DNS-based service discovery.

Peer Forwarder can use the API-based service discovery. To support this, you must have an existing Namespace configured for API instance discovery. You can create a new one following the instructions provided by the [Cloud Map documentation](https://docs.aws.amazon.com/cloud-map/latest/dg/working-with-namespaces.html).

Your Data Prepper configuration needs to include:
* `aws_cloud_map_namespace_name` - Set to your Cloud Map Namespace name
* `aws_cloud_map_service_name` - Set to the service name within your specified Namespace
* `aws_region` - The AWS Region where your Namespace exists.
* `discovery_mode` - Set to `aws_cloud_map`

Your Data Prepper configuration can optionally include:
* `aws_cloud_map_query_parameters` - Key-value pairs to filter the results based on the custom attributes attached to an instance. Only instances that match all the specified key-value pairs are returned.

#### Example configuration

```yaml
peer_forwarder:
  discovery_mode: aws_cloud_map
  aws_cloud_map_namespace_name: "my-namespace"
  aws_cloud_map_service_name: "data-prepper-cluster"
  aws_cloud_map_query_parameters:
    instance_type: "r5.xlarge"
  aws_region: "us-east-1"
```

### IAM policy with necessary permissions

The Data Prepper must also be running with the necessary permissions. The following IAM policy shows the necessary permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CloudMapPeerForwarder",
            "Effect": "Allow",
            "Action": "servicediscovery:DiscoverInstances",
            "Resource": "*"
        }
    ]
}
```
---
## Configuration

See the following for optional configuration values.

### Optional configuration

| Value | Description |
| ----  | ----------- |
| `port` | An `int` between 0 and 65535 represents the port Peer Forwarder server is running on. Default value is `4994`.|
| `request_timeout` | Duration - An `int` representing the request timeout in milliseconds for Peer Forwarder HTTP server. Default value is `10000`. |
| `server_thread_count` | An `int` representing number of threads used by the Peer Forwarder server. Defaults to `200`.|
| `client_thread_count` | An `int` representing number of threads used by the Peer Forwarder client. Defaults to `200`.|
| `maxConnectionCount`  |  An `int` representing maximum number of open connections for Peer Forwarder server. Default value is `500`. |
| `discovery_mode` | A `String` representing the peer discovery mode to be used. Allowable values are `local_node`, `static`, `dns`, and `aws_cloud_map`. Defaults to `local_node` which processes events locally.  |
| `static_endpoints` |  A `list` containing endpoints of all Data Prepper instances. Required if `discovery_mode` is set to `static`. |
|  `domain_name` | A `String` representing single domain name to query DNS against. Typically, used by creating multiple [DNS A Records](https://www.cloudflare.com/learning/dns/dns-records/dns-a-record/) for the same domain. Required if `discovery_mode` is set to `dns`.  |
| `aws_cloud_map_namespace_name`  | A `String` representing the Cloud Map Namespace when using AWS Cloud Map service discovery. Required if `discovery_mode` is set to `aws_cloud_map`.  |
| `aws_cloud_map_service_name` |  A `String` representing the Cloud Map service when using AWS Cloud Map service discovery. Required if `discovery_mode` is set to `aws_cloud_map`. |
| `aws_cloud_map_query_parameters`  |  A `Map` of Key/value pairs to filter the results based on the custom attributes attached to an instance. Only instances that match all the specified key-value pairs are returned. |
| `buffer_size` |  An `int` representing max number of unchecked records the buffer accepts (num of unchecked records equals the number of records written into the buffer + the number of in-flight records not yet checked by the Checkpointing API). Default is `512`. |
| `batch_size` |  An `int` representing max number of records the buffer returns on read. Default is `48`. |
|  `aws_region` |  A `String` represents the AWS region to use `ACM`, `S3`, or `AWS Cloud Map`. Required if `use_acm_certificate_for_ssl` is set to `true` or `ssl_certificate_file` and `ssl_key_file` is `AWS S3` path, or if `discovery_mode` is set to `aws_cloud_map`. |
| `drain_timeout`  | A `Duration` representing the wait time for the Peer Forwarder to complete processing data before shutdown. |

## SSL configuration
The SSL configuration for setting up trust manager for the peer forwarding client to connect to other Data Prepper instances.

### Optional SSL configuration

See the table below for optional SSL configuration descriptions.

| Value | Description |
| ----- | ----------- |
| `ssl` | A `boolean` that enables TLS/SSL. Default value is `true`. |
| `ssl_certificate_file`| A `String` representing the SSL certificate chain file path or AWS S3 path. S3 path example `s3://<bucketName>/<path>`. Defaults to the default certificate file,`config/default_certificate.pem`. Read more about how the certificate file is generated at the [Default Certificates](https://github.com/opensearch-project/data-prepper/tree/main/examples/certificates) page. |
| `ssl_key_file`| A `String` represents the SSL key file path or AWS S3 path. S3 path example `s3://<bucketName>/<path>`. Defaults to `config/default_private_key.pem` which is default private key file. Read more about how the private key file is generated at the [Default Certificates](https://github.com/opensearch-project/data-prepper/tree/main/examples/certificates) page. |
| `ssl_insecure_disable_verification` | A `boolean` that disables the verification of server's TLS certificate chain. Default value is `false`. |
| `ssl_fingerprint_verification_only` | A `boolean` that disables the verification of server's TLS certificate chain and instead verifies only the certificate fingerprint. Default value is `false`. |
| `use_acm_certificate_for_ssl` | A `boolean` that enables TLS/SSL using certificate and private key from AWS Certificate Manager (ACM). Default is `false`. |
| `acm_certificate_arn`| A `String` represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificate. Required if `use_acm_certificate_for_ssl` is set to `true`. |
| `acm_private_key_password` | A `String` that represents the ACM private key password that will be used to decrypt the private key. If it's not provided, a random password will be generated. |
| `acm_certificate_timeout_millis` | An `int` representing the timeout in milliseconds for ACM to get certificates. Default value is `120000`. |
| `aws_region` | A `String` represents the AWS Region to use `ACM`, `S3` or `AWS Cloud Map`. Required if `use_acm_certificate_for_ssl` is set to `true` or `ssl_certificate_file` and `ssl_key_file` is `AWS S3` path or if `discovery_mode` is set to `aws_cloud_map`. |

#### Example config

```yaml
peer_forwarder:
  ssl: true
  ssl_certificate_file: "<cert-file-path>"
  ssl_key_file: "<private-key-file-path>"
```

## Authentication

This section describes optional authentication.

`authentication`(optional) : A `Map` that enables mTLS. It can either be `mutual_tls` or `unauthenticated`. The default value is `unauthenticated`.

```yaml
peer_forwarder:
  authentication:
    mutual_tls:
```

## Metrics

This section describes Peer Forwarder's metrics capabilities, including timer, counter, and gauge.

Core Peer Forwarder introduces the following custom metrics and all the metrics are prefixed by `core.peerForwarder`.

### Timer

- `requestForwardingLatency`: measures latency of forwarding requests by the Peer Forwarder client.
- `requestProcessingLatency`: measures latency of processing requests by Peer Forwarder server.

### Counter

See the table below for counter metric options.

| Value | Description |
| ----- | ----------- |
| `requests`| Measures the total number of forwarded requests. |
| `requestsFailed`| Measures the total number of failed requests. Requests with HTTP response code other than `200`. |
| `requestsSuccessful`|  Measures the total number of successful requests. Requests with HTTP response code `200`. |
| `requestsTooLarge`| Measures the total number of requests that are too large to be written to Peer Forwarder buffer. Requests with HTTP response code `413`. |
| `requestTimeouts`| Measures the total number of requests that timed out while writing content to Peer Forwarder buffer. Requests with HTTP response code `408`. |
| `requestsUnprocessable`| Measures the total number of requests that failed due to unprocessable entity. Requests with HTTP response code `422`. |
| `badRequests`| Measures the total number of requests with bad request format. Requests with HTTP response code `400`. |
| `recordsSuccessfullyForwarded`| Measures the total number of forwarded records successfully. |
| `recordsFailedForwarding`| Measures the total number of records failed to be forwarded. |
| `recordsToBeForwarded` | Measures the total number of records to be forwarded. |
| `recordsToBeProcessedLocally` | Measures the total number of records to be processed locally. |
| `recordsActuallyProcessedLocally`| Measures the total number of records actually processed locally. This value is the sum of `recordsToBeProcessedLocally` and `recordsFailedForwarding`. |
| `recordsReceivedFromPeers`| Measures the total number of records received from remote peers. |

### Gauge

`peerEndpoints` Measures number of dynamically discovered peer Data Prepper endpoints. For `static` mode, the size is fixed.
