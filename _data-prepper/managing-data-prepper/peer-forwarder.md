---
layout: default
title: Peer forwarder
nav_order: 12
parent: Managing Data Prepper
---

# Peer forwarder

Peer forwarder is an HTTP service that performs peer forwarding of an `event` between Data Prepper nodes for aggregation. This HTTP service uses a hash-ring approach to aggregate events and determine which Data Prepper node it should handle on a given trace before rerouting it to that node. Currently, peer forwarder is supported by the `aggregate`, `service_map_stateful`, and `otel_traces_raw` [processors]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/processors/).

Peer Forwarder groups events based on the identification keys provided by the supported processors. For `service_map_stateful` and `otel_traces_raw`, the identification key is `traceId` by default and cannot be configured. The `aggregate` processor is configured using the `identification_keys` configuration option. From here, you can specify which keys to use for Peer Forwarder. See [Aggregate Processor page](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#identification_keys) for more information about identification keys.

Peer discovery allows Data Prepper to find other nodes that it will communicate with. Currently, peer discovery is provided by a static list, a DNS record lookup, or AWS Cloud Map.  

## Discovery modes

The following sections provide information about discovery modes.

### Static

Static discovery mode allows a Data Prepper node to discover nodes using a list of IP addresses or domain names. See the following YAML file for an example of static discovery mode:

```yaml
peer_forwarder:4
  discovery_mode: static
  static_endpoints: ["data-prepper1", "data-prepper2"]
```

### DNS lookup

DNS discovery is preferred over static discovery when scaling out a Data Prepper cluster. DNS discovery configures a DNS provider to return a list of Data Prepper hosts when given a single domain name. This list consists of a [DNS A record](https://www.cloudflare.com/learning/dns/dns-records/dns-a-record/), and a list of IP addresses of a given domain. See the following YAML file for an example of DNS lookup:

```yaml
peer_forwarder:
  discovery_mode: dns
  domain_name: "data-prepper-cluster.my-domain.net"
```

### AWS Cloud Map

[AWS Cloud Map](https://docs.aws.amazon.com/cloud-map/latest/dg/what-is-cloud-map.html) provides API-based service discovery as well as DNS-based service discovery.

Peer forwarder can use the API-based service discovery in AWS Cloud Map. To support this, you must have an existing namespace configured for API instance discovery. You can create a new one by following the instructions provided by the [AWS Cloud Map documentation](https://docs.aws.amazon.com/cloud-map/latest/dg/working-with-namespaces.html).

Your Data Prepper configuration needs to include the following:
* `aws_cloud_map_namespace_name` – Set to your AWS Cloud Map namespace name.
* `aws_cloud_map_service_name` – Set to the service name within your specified namespace.
* `aws_region` – Set to the AWS Region in which your namespace exists.
* `discovery_mode` – Set to `aws_cloud_map`.

Your Data Prepper configuration can optionally include the following:
* `aws_cloud_map_query_parameters` – Key-value pairs are used to filter the results based on the custom attributes attached to an instance. Results include only those instances that match all of the specified key-value pairs.

#### Example configuration

See the following YAML file example of AWS Cloud Map configuration:

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

Data Prepper must also be running with the necessary permissions. The following AWS Identity and Access Management (IAM) policy shows the necessary permissions:

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


## Configuration

The following table provides optional configuration values.


| Value | Type | Description |
| ----  | --- |  ----------- |
| `port` | Integer | A value between 0 and 65535 that represents the port that the peer forwarder server is running on. Default value is `4994`. |
| `request_timeout` | Integer | Represents the request timeout duration in milliseconds for the peer forwarder HTTP server. Default value is `10000`. |
| `server_thread_count` | Integer | Represents the number of threads used by the peer forwarder server. Default value is `200`.|
| `client_thread_count` | Integer | Represents the number of threads used by the peer forwarder client. Default value is `200`.|
| `maxConnectionCount`  | Integer | Represents the maximum number of open connections for the peer forwarder server. Default value is `500`. |
| `discovery_mode` | String | Represents the peer discovery mode to be used. Allowable values are `local_node`, `static`, `dns`, and `aws_cloud_map`. Defaults to `local_node`, which processes events locally. |
| `static_endpoints` | List | Contains the endpoints of all Data Prepper instances. Required if `discovery_mode` is set to `static`. |
|  `domain_name` | String | Represents the single domain name to query DNS against. Typically used by creating multiple [DNS A records](https://www.cloudflare.com/learning/dns/dns-records/dns-a-record/) for the same domain. Required if `discovery_mode` is set to `dns`. |
| `aws_cloud_map_namespace_name`  | String | Represents the AWS Cloud Map namespace when using AWS Cloud Map service discovery. Required if `discovery_mode` is set to `aws_cloud_map`.  |
| `aws_cloud_map_service_name` | String | Represents the AWS Cloud Map service when using AWS Cloud Map service discovery. Required if `discovery_mode` is set to `aws_cloud_map`. |
| `aws_cloud_map_query_parameters`  | Map | Key-value pairs used to filter the results based on the custom attributes attached to an instance. Only instances that match all the specified key-value pairs are returned. |
| `buffer_size` | Integer | Represents the maximum number of unchecked records the buffer accepts (the number of unchecked records equals the number of records written into the buffer plus the number of records that are still processing and not yet checked by the Checkpointing API). Default is `512`. |
| `batch_size` |  Integer | Represents the maximum number of records that the buffer returns on read. Default is `48`. |
|  `aws_region` |  String | Represents the AWS Region that uses `ACM`, `Amazon S3`, or `AWS Cloud Map` and is required when any of the following conditions are met:<br> - The `use_acm_certificate_for_ssl` setting is set to `true`. <br> - Either `ssl_certificate_file` or `ssl_key_file` specifies an Amazon Simple Storage Service (Amazon S3) URI (for example, s3://mybucket/path/to/public.cert).<br> - The `discovery_mode` is set to `aws_cloud_map`. |
| `drain_timeout`  | Duration | Represents the amount of time that peer forwarder will wait to complete data processing before shutdown. |

## SSL configuration

The following table provides optional SSL configuration values that allow you to set up a trust manager for the peer forwarder client in order to connect to other Data Prepper instances.

| Value | Type | Description |
| ----- | ---- | ----------- |
| `ssl` | Boolean | Enables TLS/SSL. Default value is `true`. |
| `ssl_certificate_file`| String | Represents the SSL certificate chain file path or Amazon S3 path. The following is an example of an Amazon S3 path: `s3://<bucketName>/<path>`. Defaults to the default certificate file,`config/default_certificate.pem`. See [Default Certificates](https://github.com/opensearch-project/data-prepper/tree/main/examples/certificates) for more information about how the certificate is generated. |
| `ssl_key_file`| String | Represents the SSL key file path or Amazon S3 path. Amazon S3 path example: `s3://<bucketName>/<path>`. Defaults to `config/default_private_key.pem` which is the default private key file. See [Default Certificates](https://github.com/opensearch-project/data-prepper/tree/main/examples/certificates) for more information about how the private key file is generated. |
| `ssl_insecure_disable_verification` | Boolean | Disables the verification of the server's TLS certificate chain. Default value is `false`. |
| `ssl_fingerprint_verification_only` | Boolean | Disables the verification of the server's TLS certificate chain and instead verifies only the certificate fingerprint. Default value is `false`. |
| `use_acm_certificate_for_ssl` | Boolean | Enables TLS/SSL using the certificate and private key from AWS Certificate Manager (ACM). Default value is `false`. |
| `acm_certificate_arn`| String | Represents the ACM certificate Amazon Resource Name (ARN). The ACM certificate takes precedence over Amazon S3 or the local file system certificate. Required if `use_acm_certificate_for_ssl` is set to `true`. |
| `acm_private_key_password` | String | Represents the ACM private key password that will be used to decrypt the private key. If it's not provided, a random password will be generated. |
| `acm_certificate_timeout_millis` | Integer | Represents the timeout in milliseconds required for ACM to get certificates. Default value is `120000`. |
| `aws_region` | String | Represents the AWS Region that uses ACM, Amazon S3, or AWS Cloud Map. Required if `use_acm_certificate_for_ssl` is set to `true` or `ssl_certificate_file`. Also required when the `ssl_key_file` is set to use the Amazon S3 path or if `discovery_mode` is set to `aws_cloud_map`. |

#### Example configuration

The following YAML file provides an example configuration:

```yaml
peer_forwarder:
  ssl: true
  ssl_certificate_file: "<cert-file-path>"
  ssl_key_file: "<private-key-file-path>"
```

## Authentication

`Authentication` is optional and is a `Map` that enables mutual TLS (mTLS). It can either be `mutual_tls` or `unauthenticated`. The default value is `unauthenticated`. The following YAML file provides an example of authentication:

```yaml
peer_forwarder:
  authentication:
    mutual_tls:
```

## Metrics

Core peer forwarder introduces the following custom metrics. All the metrics are prefixed by `core.peerForwarder`.

### Timer

Peer forwarder's timer capability provides the following information:

- `requestForwardingLatency`: Measures latency of requests forwarded by the peer forwarder client.
- `requestProcessingLatency`: Measures latency of requests processed by the peer forwarder server.

### Counter

The following table provides counter metric options.

| Value | Description |
| ----- | ----------- |
| `requests`| Measures the total number of forwarded requests. |
| `requestsFailed`| Measures the total number of failed requests. Applies to requests with an HTTP response code other than `200`. |
| `requestsSuccessful`|  Measures the total number of successful requests. Applies to requests with HTTP response code `200`. |
| `requestsTooLarge`| Measures the total number of requests that are too large to be written to the peer forwarder buffer. Applies to requests with HTTP response code `413`. |
| `requestTimeouts`| Measures the total number of requests that time out while writing content to the peer forwarder buffer. Applies to requests with HTTP response code `408`. |
| `requestsUnprocessable`| Measures the total number of requests that fail due to an unprocessable entity. Applies to requests with HTTP response code `422`. |
| `badRequests`| Measures the total number of requests with a bad request format. Applies to requests with HTTP response code `400`. |
| `recordsSuccessfullyForwarded`| Measures the total number of successfully forwarded records. |
| `recordsFailedForwarding`| Measures the total number of records that fail to be forwarded. |
| `recordsToBeForwarded` | Measures the total number of records to be forwarded. |
| `recordsToBeProcessedLocally` | Measures the total number of records to be processed locally. |
| `recordsActuallyProcessedLocally`| Measures the total number of records actually processed locally. This value is the sum of `recordsToBeProcessedLocally` and `recordsFailedForwarding`. |
| `recordsReceivedFromPeers`| Measures the total number of records received from remote peers. |

### Gauge

`peerEndpoints` Measures the number of dynamically discovered peer Data Prepper endpoints. For `static` mode, the size is fixed.
