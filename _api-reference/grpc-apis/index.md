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

**Bulk and KNN search generally available 3.2**
{: .label .label-green }

The gRPC Bulk API and KNN search queries are generally available starting with OpenSearch 3.2. Other gRPC search functionality remains experimental. For OpenSearch 3.0 and 3.1, all gRPC APIs were experimental and not recommended for production use. For updates on the progress of experimental features or to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/16787).
{: .note}

The OpenSearch gRPC functionality provides an alternative, high-performance transport layer using [gRPC](https://grpc.io/) for communication with OpenSearch. It uses protocol buffers over gRPC for lower overhead and faster serialization. This reduces overhead, speeds up serialization, and improves request-side latency, based on initial benchmarking results.

The primary goal of gRPC support is to:

* Offer a **binary-encoded** alternative to HTTP/REST-based communication.
* **Improve performance** for bulk workloads and large-scale ingestion scenarios.
* **Enable more efficient client integrations** across languages, like Java, Go, and Python, using native gRPC stubs.

## Performance benefits

Using gRPC APIs provides several advantages over HTTP APIs:

- **Reduced latency**: Binary protocol buffers eliminate JSON parsing overhead
- **Better throughput**: More efficient network utilization for high-frequency queries
- **Lower CPU usage**: Reduced serialization/deserialization costs
- **Type safety**: Protocol buffer schemas provide compile-time validation
- **Smaller payload sizes**: Binary encoding reduces network traffic

## Enabling gRPC APIs

To enable gRPC APIs in OpenSearch:

**OpenSearch 3.2 and later:**
The `transport-grpc` module is included by default with OpenSearch installations. Simply add the following settings to `opensearch.yml` to enable it:

**OpenSearch 3.0 and 3.1:**
1. Install the `transport-grpc` plugin. For more information, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).
2. Add the following settings to `opensearch.yml`:

**For all versions, add these settings to `opensearch.yml`:**
```yaml
aux.transport.types: [experimental-transport-grpc]
aux.transport.experimental-transport-grpc.port: '9400-9500' // optional
```
{% include copy.html %}

    Alternatively, configure a secure transport protocol using the following settings:
    ```yaml
    aux.transport.types: [experimental-secure-transport-grpc]
    aux.transport.experimental-transport-grpc.port: '9400-9500' // optional
    ```
    {% include copy.html %}

1. Configure additional settings if needed (see [Advanced gRPC settings](#advanced-grpc-settings)):
    ```yaml
    grpc.host: localhost
    grpc.publish_host: 10.74.124.163
    grpc.bind_host: 0.0.0.0
    ```
    {% include copy.html %}

**Note about the module transition:**
Starting with OpenSearch 3.2, `transport-grpc` moved from a core plugin to a module to enable external plugins (such as k-NN) to extend gRPC functionality. This change allows for better integration and performance improvements. For more details, see [GitHub issue #18893](https://github.com/opensearch-project/OpenSearch/issues/18893) and [PR #18897](https://github.com/opensearch-project/OpenSearch/pull/18897).
{: .note}

## Advanced gRPC settings

OpenSearch supports the following advanced network settings for gRPC communication:

- `grpc.host` (Static, list): Sets the address of an OpenSearch node for gRPC communication. The `grpc.host` setting is a combination of `grpc.bind_host` and `grpc.publish_host` if they are the same value. An alternative to `grpc.host` is to configure `grpc.bind_host` and `grpc.publish_host` separately, as needed.

- `grpc.bind_host` (Static, list): Specifies an address or addresses to which an OpenSearch node binds to listen for incoming gRPC connections.

- `grpc.publish_host` (Static, list): Specifies an address or addresses that an OpenSearch node publishes to other nodes for gRPC communication.

These settings are similar to the [HTTP Network settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/network-settings/#advanced-http-settings).

## Using gRPC APIs

To submit gRPC requests, you must have a set of protobufs on the client side. You can obtain the protobufs in the following ways:

- **Raw protobufs**: Download the raw protobuf schema from the [OpenSearch Protobufs GitHub repository (v0.6.0)](https://github.com/opensearch-project/opensearch-protobufs). You can then generate client-side code using the protocol buffer compilers for the [supported languages](https://grpc.io/docs/languages/).
- **Java client-side programs only**: Download the `opensearch-protobufs` jar from the [Maven Central repository](https://repo1.maven.org/maven2/org/opensearch/protobufs/0.6.0).

## Supported APIs

The following gRPC APIs are supported:

- [Bulk]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/bulk/)
- [Search]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/search/) (for select query types)
- [KNN]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/knn/) (KNN search queries) **Generally available 3.2**
