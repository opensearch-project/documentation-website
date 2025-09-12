---
layout: default
title: gRPC APIs
has_children: true
has_toc: false
nav_order: 25
redirect_from:
  - /api-reference/grpc-apis/
---

# gRPC APIs
**Introduced 3.0**
{: .label .label-purple }

**Bulk and k-NN search generally available 3.2**
{: .label .label-green }

Starting with OpenSearch version 3.2, the gRPC [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/bulk/) and [k-NN search queries]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/knn/) are generally available. These use [protobuf version 0.6.0](https://github.com/opensearch-project/opensearch-protobufs/releases/tag/0.6.0). However, expect updates to the protobuf structure as the feature matures in upcoming versions. Other gRPC search functionality remains experimental and not recommended for production use. For updates on the progress of these features or to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/16787).
{: .note}

The OpenSearch gRPC functionality provides an alternative, high-performance transport layer using [gRPC](https://grpc.io/) for communication with OpenSearch. It uses protocol buffers over gRPC for lower overhead and faster serialization. This reduces overhead, speeds up serialization, and improves request-side latency, based on initial benchmarking results.

The primary goal of gRPC support is to:

* Offer a **binary-encoded** alternative to HTTP/REST-based communication.
* **Improve performance** for bulk workloads and large-scale ingestion scenarios.
* **Enable more efficient client integrations** across languages, like Java, Go, and Python, using native gRPC stubs.

## Performance benefits

Using gRPC APIs provides several advantages over HTTP APIs:

- **Reduced latency**: Binary protocol buffers eliminate JSON parsing overhead.
- **Higher throughput**: More efficient network utilization for high-frequency queries.
- **Lower CPU usage**: Reduced serialization and deserialization costs.
- **Type safety**: Protocol buffer schemas provide compile-time validation.
- **Smaller payload sizes**: Binary encoding reduces network traffic.

## Enabling gRPC APIs

The `transport-grpc` module is included by default with OpenSearch installations. To enable it, add the following settings to `opensearch.yml`:

```yaml
aux.transport.types: [transport-grpc]
aux.transport.transport-grpc.port: '9400-9500' // optional
```
{% include copy.html %}

Alternatively, configure a secure transport protocol using the following settings:

```yaml
aux.transport.types: [secure-transport-grpc]
aux.transport.transport-grpc.port: '9400-9500' // optional
```
{% include copy.html %}

Configure additional settings if needed (see [Advanced gRPC settings](#advanced-grpc-settings)):

```yaml
grpc.host: localhost
grpc.publish_host: 10.74.124.163
grpc.bind_host: 0.0.0.0
```
{% include copy.html %}

## Advanced gRPC settings

OpenSearch supports the following advanced settings for gRPC communication. These settings can be configured in `opensearch.yml`.

| Setting name | Description | Example value | Default value |
| :---- | :---- | :---- | :---- |
| `grpc.publish_port` | The external port number that this node uses to publish itself to peers for gRPC transport. | `9400` | `-1` (disabled) |
| `grpc.host` | A list of addresses the gRPC server will bind to. | `["0.0.0.0"]` | `[]` |
| `grpc.bind_host` | A list of addresses to bind the gRPC server to. Can be distinct from publish hosts. | `["0.0.0.0", "::"]` | Value of `grpc.host` |
| `grpc.publish_host` | A list of hostnames or IPs published to peers for client connections. | `["thisnode.example.com"]` | Value of `grpc.host` |
| `grpc.netty.worker_count` | The number of Netty worker threads for the gRPC server. Controls concurrency and parallelism. | `2` | Number of processors |
| `grpc.netty.executor_count` | Number of threads in the ForkJoinPool for processing gRPC service calls. Controls request processing parallelism. | `32` | 2*Number of processors |
| `grpc.netty.max_concurrent_connection_calls` | The maximum number of simultaneous in-flight requests allowed per client connection. | `200` | `100` |
| `grpc.netty.max_connection_age` | The maximum age a connection can reach before being gracefully closed. Supports time units like `ms`, `s`, or `m`. See [Time units]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). | `500ms` | Not set (no limit) |
| `grpc.netty.max_connection_idle` | The maximum duration for which a connection can be idle before being closed. Supports time units like `ms`, `s`, or `m`. See [Time units]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). | `2m` | Not set (no limit) |
| `grpc.netty.keepalive_timeout` | The amount of time to wait for `keepalive` ping acknowledgment before closing the connection. Supports [time units]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). | `1s` | Not set |
| `grpc.netty.max_msg_size` | The maximum inbound message size for gRPC requests. Supports units like `b`, `kb`, `mb`, or `gb`. See [Supported units]({{site.url}}{{site.baseurl}}/api-reference/units/). | `10mb` or `10485760` | `10mb` |

### Example configuration

The following is an example of a complete gRPC configuration in `opensearch.yml`:

```yaml
# Basic gRPC transport configuration
aux.transport.types: [transport-grpc]
aux.transport.transport-grpc.port: '9400-9500'

# Advanced gRPC settings
grpc.host: ["0.0.0.0"]
grpc.bind_host: ["0.0.0.0", "::"]
grpc.publish_host: ["thisnode.example.com"]
grpc.publish_port: 9400
grpc.netty.worker_count: 4
grpc.netty.max_concurrent_connection_calls: 200
grpc.netty.max_connection_age: 500ms
grpc.netty.max_connection_idle: 2m
grpc.netty.keepalive_timeout: 1s
grpc.netty.max_msg_size: 10mb
```
{% include copy.html %}

These settings are similar to the [HTTP Network settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/network-settings/#advanced-http-settings) but specifically apply to gRPC communication.

## Using gRPC APIs

To submit gRPC requests, you must have a set of protobufs on the client side. You can obtain the protobufs in the following ways:

- **Raw protobufs**: Download the raw protobuf schema from the [OpenSearch Protobufs GitHub repository (v0.6.0)](https://github.com/opensearch-project/opensearch-protobufs/releases/tag/0.6.0). You can then generate client-side code using the protocol buffer compilers for the [supported languages](https://grpc.io/docs/languages/).
- **Java client-side programs only**: Download the `opensearch-protobufs` jar from the [Maven Central repository](https://repo1.maven.org/maven2/org/opensearch/protobufs/0.6.0).

## Supported APIs

The following gRPC APIs are supported:

- [Bulk]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/bulk/) **Generally available 3.2**
- [Search]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/search/) (for select query types)
- [k-NN]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/knn/) (k-NN search queries) **Generally available 3.2**
