---
layout: default
title: GRPC APIs
has_children: true
nav_order: 25
---

# GRPC APIs
**Introduced 3.0**
{: .label .label-purple }

The OpenSearch gRPC plugin provides an alternative, high-performance transport layer using [gRPC](https://grpc.io/) for communication with OpenSearch. It uses protocol buffers over gRPC for lower overhead and faster serialization. This reduces overhead, speeds up serialization, and improves request-side latency, based on initial benchmarking results.

This plugin is experimental and not recommended for production use. APIs and behavior may change without notice in future releases.
{: .note}


The primary goal of the gRPC plugin is to:

* Offer a **binary-encoded** alternative to HTTP/REST-based communication.  
* **Improve performance** for bulk workloads and large-scale ingestion scenarios.  
* **Enable more efficient client integrations** across languages, like Java, Go, Python, using native gRPC stubs.

## Enabling the plugin

To enable the gRPC plugin (transport-grpc) in OpenSearch, 
1. Install the `transport-grpc` plugin. For more information, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).  

1. Add the following settings to `opensearch.yml`:
```yaml
aux.transport.types: [experimental-transport-grpc]
aux.transport.experimental-transport-grpc.port: '9400-9500' // optional
```
{% include copy.html %}

Alternatively, configure a secure transport using the following settings:
```yaml
aux.transport.types: [experimental-secure-transport-grpc]
aux.transport.experimental-transport-grpc.port: '9400-9500' // optional
```
{% include copy-curl.html %}

1. Configure additional settings if needed (see [Advanced GRPC settings](#advanced-grpc-settings)):
```yaml
grpc.host: localhost
grpc.publish_host: 10.74.124.163
grpc.bind_host: 0.0.0.0
```
{% include copy.html %}


## Advanced GRPC settings

OpenSearch supports the following advanced network settings for GRPC communication:

- `grpc.host` (Static, list): Sets the address of an OpenSearch node for GRPC communication. The `grpc.host` setting is a combination of `grpc.bind_host` and `grpc.publish_host` if they are the same value. An alternative to `grpc.host` is to configure `grpc.bind_host` and `grpc.publish_host` separately as needed. 

- `grpc.bind_host` (Static, list): Specifies an address or addresses to which an OpenSearch node binds to listen for incoming GRPC connections. 

- `grpc.publish_host` (Static, list): Specifies an address or addresses that an OpenSearch node publishes to other nodes for GRPC communication.

These settings are similar to the [HTTP Network settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/network-settings/#advanced-http-settings).

## Client usage

There are two ways to use the protobufs:

1. **Raw protobufs:** Download the raw protobuf schema from the [OpenSearch Protobufs GitHub repository (v0.3.0)](https://github.com/opensearch-project/opensearch-protobufs).   
2. **Java clients only:** Download the `opensearch-protobufs` jar from the Central Maven repository: [https://repo1.maven.org/maven2/org/opensearch/protobufs/0.3.0](https://repo1.maven.org/maven2/org/opensearch/protobufs/0.3.0).

## Supported APIs
This feature is currently under development and currently supports the following APIs:
- [Bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/))
- [Search]({{site.url}}{{site.baseurl}}/api-reference/search/) (for select query types).

See detailed API Documentation for more information and example requests: 

* [Bulk API (gRPC) Usage Guide]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) 
* [Search API (gRPC) Usage guide]({{site.url}}{{site.baseurl}}/api-reference/search/) 

## Notes

* The plugin is currently **not enabled by default**.  
* Submitting requests requires **Protobuf and gRPC** setup on client side.  
* Only the **[Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/)** and limited functionality of the **[Search APIs]({{site.url}}{{site.baseurl}}/api-reference/search/)** are implemented at this stage.
