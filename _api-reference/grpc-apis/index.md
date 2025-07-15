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

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/16787).    
{: .warning}

The OpenSearch gRPC plugin provides an alternative, high-performance transport layer using [gRPC](https://grpc.io/) for communication with OpenSearch. It uses protocol buffers over gRPC for lower overhead and faster serialization. This reduces overhead, speeds up serialization, and improves request-side latency, based on initial benchmarking results.

The primary goal of the gRPC plugin is to:

* Offer a **binary-encoded** alternative to HTTP/REST-based communication.  
* **Improve performance** for bulk workloads and large-scale ingestion scenarios.  
* **Enable more efficient client integrations** across languages, like Java, Go, and Python, using native gRPC stubs.

## Enabling the plugin

To enable the gRPC plugin (`transport-grpc`) in OpenSearch: 
1. Install the `transport-grpc` plugin. For more information, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).  

1. Add the following settings to `opensearch.yml`:
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


## Advanced gRPC settings

OpenSearch supports the following advanced network settings for gRPC communication:

- `grpc.host` (Static, list): Sets the address of an OpenSearch node for gRPC communication. The `grpc.host` setting is a combination of `grpc.bind_host` and `grpc.publish_host` if they are the same value. An alternative to `grpc.host` is to configure `grpc.bind_host` and `grpc.publish_host` separately, as needed. 

- `grpc.bind_host` (Static, list): Specifies an address or addresses to which an OpenSearch node binds to listen for incoming gRPC connections. 

- `grpc.publish_host` (Static, list): Specifies an address or addresses that an OpenSearch node publishes to other nodes for gRPC communication.

These settings are similar to the [HTTP Network settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/network-settings/#advanced-http-settings).

## Using gRPC APIs

To submit gRPC requests, you must have a set of protobufs on the client side. You can obtain the protobufs in the following ways:

- **Raw protobufs**: Download the raw protobuf schema from the [OpenSearch Protobufs GitHub repository (v0.3.0)](https://github.com/opensearch-project/opensearch-protobufs). You can then generate client-side code using the protocol buffer compilers for the [supported languages](https://grpc.io/docs/languages/). 
- **Java client-side programs only**: Download the `opensearch-protobufs` jar from the [Maven Central repository](https://repo1.maven.org/maven2/org/opensearch/protobufs/0.3.0).

## Supported APIs

This feature is currently under development and supports the following APIs:

- [Bulk]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/bulk/)
- [Search]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/search/) (for select query types)
