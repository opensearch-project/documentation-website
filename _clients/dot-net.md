---
layout: default
title: .NET clients
nav_order: 75
has_children: true
has_toc: false
---

# .NET clients

OpenSearch has two .NET clients: a low-level [OpenSearch.Net]({{site.url}}{{site.baseurl}}/clients/OpenSearch-dot-net/) client, and a high-level [OSC]({{site.url}}{{site.baseurl}}/clients/OSC-dot-net/) client.

[OpenSearch.Net]({{site.url}}{{site.baseurl}}/clients/OpenSearch-dot-net/) is a low-level .NET client that provides the foundational layer of communicating with OpenSearch. It is dependency-free, and it can handle round-robin load balancing, transport, and the basic request/response cycle. OpenSearch.Net contains methods for all OpenSearch API endpoints.

[OSC]({{site.url}}{{site.baseurl}}/clients/OSC-dot-net/) is a high-level .NET client on top of OpenSearch.Net. It provides strongly typed requests and responses, as well as Query DSL. It frees you from constructing raw JSON requests and parsing raw JSON responses by supplying models that parse and serialize/deserialize requests and responses automatically. OSC also exposes the OpenSearch.Net low-level client if you need it. OSC includes the following advanced functionality:

- Automapping: given a C# type, OSC can infer the correct mapping to send to OpenSearch.
- Operator overloading in queries.
- Type and index inference.

You can use both .NET clients in a console program, .NET core, ASP.NET core, or worker services.

To get started with OSC, follow the [getting started guide]({{site.url}}{{site.baseurl}}/clients/OSC-dot-net#installing-the-osc-client) or a slightly [more advanced example]({{site.url}}{{site.baseurl}}/clients/OSC-dot-net/osc-example).