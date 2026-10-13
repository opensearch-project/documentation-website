---
layout: default
title: .NET clients
nav_order: 75
has_children: true
has_toc: false
---

# .NET clients

OpenSearch has two .NET clients: a low-level [OpenSearch.Net]({{site.url}}{{site.baseurl}}/clients/OpenSearch-dot-net/) client and a high-level [OpenSearch.Client]({{site.url}}{{site.baseurl}}/clients/OSC-dot-net/) client.

[OpenSearch.Net]({{site.url}}{{site.baseurl}}/clients/OpenSearch-dot-net/) is a low-level .NET client that provides the foundational layer of communication with OpenSearch. It is dependency free, and it can handle round-robin load balancing, transport, and the basic request/response cycle. OpenSearch.Net contains methods for all OpenSearch API endpoints.

[OpenSearch.Client]({{site.url}}{{site.baseurl}}/clients/OSC-dot-net/) is a high-level .NET client on top of OpenSearch.Net. It provides strongly typed requests and responses as well as Query DSL. It frees you from constructing raw JSON requests and parsing raw JSON responses by supplying models that parse and serialize/deserialize requests and responses automatically. OpenSearch.Client also exposes the OpenSearch.Net low-level client if you need it. OpenSearch.Client includes the following advanced functionality:

- Automapping: Given a C# type, OpenSearch.Client can infer the correct mapping to send to OpenSearch.
- Operator overloading in queries.
- Type and index inference.

You can use both .NET clients in a console program, a .NET Core application, an ASP.NET Core application, or a worker service.

To get started with OpenSearch.Client, follow the instructions in [Getting started with the high-level .NET client]({{site.url}}{{site.baseurl}}/clients/OSC-dot-net#installing-opensearchclient) or in [More advanced features of the high-level .NET client]({{site.url}}{{site.baseurl}}/clients/OSC-example/), a slightly more advanced walkthrough.

## Compatibility

The following table lists the OpenSearch.Client and OpenSearch.Net versions that are compatible with each OpenSearch version.

| OpenSearch version | Client version |
|:---|:---|
| 1.x | 1.0.0, 1.1.0 |
| 2.x | 1.1.0 or later |
| 3.x | 2.0.0 or later |

The 2.x clients support .NET 8 or later and .NET Framework 4.7.2 or later. Both clients target .NET Standard 2.0 and .NET Standard 2.1. OpenSearch.Net and OpenSearch.Net.Auth.AwsSigV4 also target .NET 8 and .NET 10.

For the latest compatibility information, see the [`COMPATIBILITY.md`](https://github.com/opensearch-project/opensearch-net/blob/main/COMPATIBILITY.md) file in the client repository. For information about breaking changes between client versions, see the [upgrading guide](https://github.com/opensearch-project/opensearch-net/blob/main/UPGRADING.md).
