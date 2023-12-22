---
layout: default
title: .NET client considerations
nav_order: 20
has_children: false
parent: .NET clients
---

# .NET client considerations and best practices

The following sections provide information regarding the considerations and best practices for using .NET clients.

## Registering OpenSearch.Client as a singleton

As a rule, you should set up your OpenSearch.Client as a singleton. OpenSearch.Client manages connections to the server and the states of the nodes in a cluster. Additionally, each client uses a lot of configuration for its setup. Therefore, it is beneficial to create an OpenSearch.Client instance once and reuse it for all OpenSearch operations. The client is thread safe, so the same instance can be shared by multiple threads.

## Exceptions

The following are the types of exceptions that may be thrown by .NET clients:

- `OpenSearchClientException` is a known exception that occurs either in the request pipeline (for example, timeout reached) or in OpenSearch (for example, malformed query). If it is an OpenSearch exception, the `ServerError` response property contains the error that OpenSearch returns. 
- `UnexpectedOpenSearchClientException` is an unknown exception (for example, an error during deserialization) and is a subclass of OpenSearchClientException.
- System exceptions are thrown when the API is not used properly. 

## Nodes

To create a node, pass a `Uri` object into its constructor:

```cs
var uri = new Uri("http://example.org/opensearch");
var node = new Node(uri);
```
{% include copy.html %}

When first created, a node is master eligible, and its `HoldsData` property is set to true. 
The `AbsolutePath` property of the node created above is `"/opensearch/"`: A trailing forward slash is appended so that the paths can be easily combined. If not specified, the default `Port` is 80.

Nodes are considered equal if they have the same endpoint. Metadata is not taken into account when checking nodes for equality.
{: .note}

## Connection pools

Connection pools are instances of `IConnectionPool` and are responsible for managing the nodes in the OpenSearch cluster. We recommend creating a [singleton client](#registering-opensearchclient-as-a-singleton) with a single `ConnectionSettings` object. The lifetime of both the client and its `ConnectionSettings` is the lifetime of the application.

The following are connection pool types.

- **SingleNodeConnectionPool**

`SingleNodeConnectionPool` is the default connection pool that is used if no connection pool is passed to the `ConnectionSettings` constructor. Use `SingleNodeConnectionPool` if you have only one node in the cluster or if your cluster has a load balancer as an entry point. `SingleNodeConnectionPool` does not support sniffing or pinging and does not mark nodes as dead or alive. 

- **CloudConnectionPool**

`CloudConnectionPool` is a subclass of `SingleNodeConnectionPool` that takes a Cloud ID and credentials. Like `SingleNodeConnectionPool`, `CloudConnectionPool` does not support sniffing or pinging.

- **StaticConnectionPool**

`StaticConnectionPool` is used for a small cluster when you do not want to turn on sniffing to learn about cluster topology. `StaticConnectionPool` does not support sniffing, but can support pinging.

- **SniffingConnectionPool**

`SniffingConnectionPool` is a subclass of `StaticConnectionPool`. It is thread safe and supports sniffing and pinging. `SniffingConnectionPool` can be reseeded at run time, and you can specify node roles when seeding.

- **StickyConnectionPool**

`StickyConnectionPool` is set up to return the first live node, which then persists between requests. It can be seeded using an enumerable of `Uri` or `Node` objects. `StickyConnectionPool` does not support sniffing but supports pinging.

- **StickySniffingConnectionPool**

`StickySniffingConnectionPool` is a subclass of `SniffingConnectionPool`. Like `StickyConnectionPool`, it returns the first live node2, which then persists between requests. `StickySniffingConnectionPool` supports sniffing and sorting so that each instance of your application can favor a different node. Nodes have weights associated with them and can be sorted by weight.

## Retries

If a request does not succeed, it is automatically retried. By default, the number of retries is the number of nodes known to OpenSearch.Client in your cluster. The number of retries is also limited by the timeout parameter, so OpenSearch.Client retries requests as many times as possible within the timeout period. 

To set the maximum number of retries, specify the number in the `MaximumRetries` property on the `ConnectionSettings` object.

```cs
var settings = new ConnectionSettings(connectionPool).MaximumRetries(5);
```
{% include copy.html %}

You can also set a `RequestTimeout` that specifies a timeout for a single request and a `MaxRetryTimeout` that specifies the time limit for all retry attempts. In the example below, `RequestTimeout` is set to 4 seconds, and `MaxRetryTimeout` is set to 12 seconds, so the maximum number of attempts for a query is 3. 

```cs
var settings = new ConnectionSettings(connectionPool)
            .RequestTimeout(TimeSpan.FromSeconds(4))
            .MaxRetryTimeout(TimeSpan.FromSeconds(12));
```
{% include copy.html %}

## Failover

If you are using a connection pool with multiple nodes, a request is retried if it returns a 502 (Bad Gateway), 503 (Service Unavailable), or 504 (Gateway Timeout) HTTP error response code. If the response code is an error code in the 400–501 or 505–599 ranges, the request is not retried.

A response is considered valid if the response code is in the 2xx range or the response code has one of the expected values for this request. For example, 404 (Not Found) is a valid response for a request that checks whether an index exists.