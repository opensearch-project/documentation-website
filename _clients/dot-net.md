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

You can use both .NET clients in a console program, a .NET core, an ASP.NET core, or in worker services.

To get started with OpenSearch.Client, follow the instructions in [Getting started with the high-level .NET client]({{site.url}}{{site.baseurl}}/clients/OSC-dot-net#installing-opensearchclient) or in [More advanced features of the high-level .NET client]({{site.url}}{{site.baseurl}}/clients/OSC-example), a slightly more advanced walkthrough.