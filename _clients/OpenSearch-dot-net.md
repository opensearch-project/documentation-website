---
layout: default
title: Low-level .NET client
nav_order: 30
has_children: false
parent: .NET clients
---

# Low-level .NET client (OpenSearch.Net)

OpenSearch.Net is a low-level .NET client that provides the foundational layer of communication with OpenSearch. It is dependency free, and it can handle round-robin load balancing, transport, and the basic request/response cycle. OpenSearch.Net contains all OpenSearch API endpoints as methods. When using OpenSearch.Net, you need to construct the queries yourself.

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [opensearch-net repo](https://github.com/opensearch-project/opensearch-net).

## Stable Release

This documentation reflects the latest updates available in the [GitHub repository](https://github.com/opensearch-project/opensearch-net) and may include changes unavailable in the current stable release. The current stable release in NuGet is [1.2.0](https://www.nuget.org/packages/OpenSearch.Net.Auth.AwsSigV4/1.2.0).

## Example

The following example illustrates connecting to OpenSearch, indexing documents, and sending queries on the data. It uses the Student class to represent one student, which is equivalent to one document in the index.

```cs
public class Student
{
    public int Id { get; init; }
    public string FirstName { get; init; }
    public string LastName { get; init; }
    public int GradYear { get; init; }
    public double Gpa { get; init; }
}
```
{% include copy.html %}

## Installing the Opensearch.Net client

To install Opensearch.Net, download the [Opensearch.Net NuGet package](https://www.nuget.org/packages/OpenSearch.Net) and add it to your project in an IDE of your choice. In Microsoft Visual Studio, follow the steps below: 
- In the **Solution Explorer** panel, right-click on your solution or project and select **Manage NuGet Packages for Solution**.
- Search for the OpenSearch.Net NuGet package, and select **Install**.

Alternatively, you can add OpenSearch.Net to your .csproj file:

```xml
<Project>
  ...
  <ItemGroup>
    <PackageReference Include="Opensearch.Net" Version="1.0.0" />
  </ItemGroup>
</Project>
```
{% include copy.html %}

## Connecting to OpenSearch

Use the default constructor when creating an OpenSearchLowLevelClient object to connect to the default OpenSearch host (`http://localhost:9200`). 

```cs
var client  = new OpenSearchLowLevelClient();
```
{% include copy.html %}

To connect to your OpenSearch cluster through a single node with a known address, create a ConnectionConfiguration object with that address and pass it to the OpenSearch.Net constructor:

```cs
var nodeAddress = new Uri("http://myserver:9200");
var config = new ConnectionConfiguration(nodeAddress);
var client = new OpenSearchLowLevelClient(config);
```
{% include copy.html %}

You can also use a [connection pool]({{site.url}}{{site.baseurl}}/clients/dot-net-conventions#connection-pools) to manage the nodes in the cluster. Additionally, you can set up a connection configuration to have OpenSearch return the response as formatted JSON.

```cs
var uri = new Uri("http://localhost:9200");
var connectionPool = new SingleNodeConnectionPool(uri);
var settings = new ConnectionConfiguration(connectionPool).PrettyJson();
var client = new OpenSearchLowLevelClient(settings);
```
{% include copy.html %}

To connect to your OpenSearch cluster using multiple nodes, create a connection pool with their addresses. In this example, a [`SniffingConnectionPool`]({{site.url}}{{site.baseurl}}/clients/dot-net-conventions#connection-pools) is used because it keeps track of nodes being removed or added to the cluster, so it works best for clusters that scale automatically. 

```cs
var uris = new[]
{
    new Uri("http://localhost:9200"),
    new Uri("http://localhost:9201"),
    new Uri("http://localhost:9202")
};
var connectionPool = new SniffingConnectionPool(uris);
var settings = new ConnectionConfiguration(connectionPool).PrettyJson();
var client = new OpenSearchLowLevelClient(settings);
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Service

The following example illustrates connecting to Amazon OpenSearch Service:

```cs
using OpenSearch.Client;
using OpenSearch.Net.Auth.AwsSigV4;

namespace Application
{
    class Program
    {
        static void Main(string[] args)
        {
            var endpoint = new Uri("https://search-xxx.region.es.amazonaws.com");
            var connection = new AwsSigV4HttpConnection(RegionEndpoint.APSoutheast2, service: AwsSigV4HttpConnection.OpenSearchService);
            var config = new ConnectionSettings(endpoint, connection);
            var client = new OpenSearchClient(config);

            Console.WriteLine($"{client.RootNodeInfo().Version.Distribution}: {client.RootNodeInfo().Version.Number}");
        }
    }
}
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Serverless

The following example illustrates connecting to Amazon OpenSearch Serverless Service:

```cs
using OpenSearch.Client;
using OpenSearch.Net.Auth.AwsSigV4;

namespace Application
{
    class Program
    {
        static void Main(string[] args)
        {
            var endpoint = new Uri("https://search-xxx.region.aoss.amazonaws.com");
            var connection = new AwsSigV4HttpConnection(RegionEndpoint.APSoutheast2, service: AwsSigV4HttpConnection.OpenSearchServerlessService);
            var config = new ConnectionSettings(endpoint, connection);
            var client = new OpenSearchClient(config);

            Console.WriteLine($"{client.RootNodeInfo().Version.Distribution}: {client.RootNodeInfo().Version.Number}");
        }
    }
}
```
{% include copy.html %}


## Using ConnectionSettings

`ConnectionConfiguration` is used to pass configuration options to the OpenSearch.Net client. `ConnectionSettings` inherits from `ConnectionConfiguration` and provides additional configuration options.
The following example uses `ConnectionSettings` to:
- Set the default index name for requests that don't specify the index name.
- Enable gzip-compressed requests and responses.
- Signal to OpenSearch to return formatted JSON. 
- Make field names lowercase.

```cs
var uri = new Uri("http://localhost:9200");
var connectionPool = new SingleNodeConnectionPool(uri);
var settings = new ConnectionSettings(connectionPool)
    .DefaultIndex("students")
    .EnableHttpCompression()
    .PrettyJson()
    .DefaultFieldNameInferrer(f => f.ToLower());

var client = new OpenSearchLowLevelClient(settings);
```
{% include copy.html %}

## Indexing one document

To index a document, you first need to create an instance of the Student class:

```cs
var student = new Student { 
    Id = 100, 
    FirstName = "Paulo", 
    LastName = "Santos", 
    Gpa = 3.93, 
    GradYear = 2021 
};
```
{% include copy.html %}

Alternatively, you can create an instance of Student using an anonymous type:

```cs
var student = new { 
    Id = 100, 
    FirstName = "Paulo", 
    LastName = "Santos", 
    Gpa = 3.93, 
    GradYear = 2021 
};
```
{% include copy.html %}

Next, upload this Student into the `students` index using the `Index` method:

```cs
var response = client.Index<StringResponse>("students", "100", 
                                PostData.Serializable(student));
Console.WriteLine(response.Body);
```
{% include copy.html %}

The generic type parameter of the `Index` method specifies the response body type. In the example above, the response is a string.

## Indexing many documents using the Bulk API

To index many documents, use the Bulk API to bundle many operations into one request:

```cs
var studentArray = new object[]
{
    new {index = new { _index = "students", _type = "_doc", _id = "200"}},
    new {   Id = 200, 
            FirstName = "Shirley", 
            LastName = "Rodriguez", 
            Gpa = 3.91, 
            GradYear = 2019
    },
    new {index = new { _index = "students", _type = "_doc", _id = "300"}},
    new {   Id = 300, 
            FirstName = "Nikki", 
            LastName = "Wolf", 
            Gpa = 3.87, 
            GradYear = 2020
    }
};

var manyResponse = client.Bulk<StringResponse>(PostData.MultiJson(studentArray));
```
{% include copy.html %}

You can send the request body as an anonymous object, string, byte array, or stream in APIs that take a body. For APIs that take multiline JSON, you can send the body as a list of bytes or a list of objects, like in the example above. The `PostData` class has static methods to send the body in all of these forms. 

## Searching for a document

To construct a Query DSL query, use anonymous types within the request body. The following query searches for all students who graduated in 2021:

```cs
var searchResponseLow = client.Search<StringResponse>("students",
    PostData.Serializable(
    new
    {
        from = 0,
        size = 20,

        query = new
        {
            term = new
            {
                gradYear = new
                {
                    value = 2019
                }
            }
        }
    })); 

Console.WriteLine(searchResponseLow.Body);
```
{% include copy.html %}

Alternatively, you can use strings to construct the request. When using strings, you have to escape the `"` character:

```cs
var searchResponse = client.Search<StringResponse>("students",
    @" {
    ""query"":
        {
            ""match"":
            {
                ""lastName"":
                {
                    ""query"": ""Santos""
                }
            }
        }
    }");

Console.WriteLine(searchResponse.Body);
```
{% include copy.html %}

## Using OpenSearch.Net methods asynchronously

For applications that require asynchronous code, all method calls in OpenSearch.Client have asynchronous counterparts:

```cs
// synchronous method
var response = client.Index<StringResponse>("students", "100", 
                                PostData.Serializable(student));

// asynchronous method
var response = client.IndexAsync<StringResponse>("students", "100", 
                                    PostData.Serializable(student));
```
{% include copy.html %}

## Handling exceptions

By default, OpenSearch.Net does not throw exceptions when an operation is unsuccessful. In particular, OpenSearch.Net does not throw exceptions if the response status code has one of the expected values for this request. For example, the following query searches for a document in an index that does not exist:

```cs
var searchResponse = client.Search<StringResponse>("students1",
    @" {
    ""query"":
        {
            ""match"":
            {
                ""lastName"":
                {
                    ""query"": ""Santos""
                }
            }
        }
    }");

Console.WriteLine(searchResponse.Body);
```
{% include copy.html %}

The response contains an error status code 404, which is one of the expected error codes for search requests, so no exception is thrown. You can see the status code in the `status` field:

```json
{
  "error" : {
    "root_cause" : [
      {
        "type" : "index_not_found_exception",
        "reason" : "no such index [students1]",
        "index" : "students1",
        "resource.id" : "students1",
        "resource.type" : "index_or_alias",
        "index_uuid" : "_na_"
      }
    ],
    "type" : "index_not_found_exception",
    "reason" : "no such index [students1]",
    "index" : "students1",
    "resource.id" : "students1",
    "resource.type" : "index_or_alias",
    "index_uuid" : "_na_"
  },
  "status" : 404
}
```

To configure OpenSearch.Net to throw exceptions, turn on the `ThrowExceptions()` setting on `ConnectionConfiguration`:

```cs
var uri = new Uri("http://localhost:9200");
var connectionPool = new SingleNodeConnectionPool(uri);
var settings = new ConnectionConfiguration(connectionPool)
                        .PrettyJson().ThrowExceptions();
var client = new OpenSearchLowLevelClient(settings);
```
{% include copy.html %}

You can use the following properties of the response object to determine response success:

```cs
Console.WriteLine("Success: " + searchResponse.Success);
Console.WriteLine("SuccessOrKnownError: " + searchResponse.SuccessOrKnownError);
Console.WriteLine("Original Exception: " + searchResponse.OriginalException);
```

- `Success` returns true if the response code is in the 2xx range or the response code has one of the expected values for this request.
- `SuccessOrKnownError` returns true if the response is successful or the response code is in the 400–501 or 505–599 ranges. If SuccessOrKnownError is true, the request is not retried.
- `OriginalException` holds the original exception for the unsuccessful responses.

## Sample program 

The following program creates an index, indexes data, and searches for documents.

```cs
using OpenSearch.Net;
using OpenSearch.Client;

namespace NetClientProgram;

internal class Program
{
    public static void Main(string[] args)
    {
        // Create a client with custom settings
        var uri = new Uri("http://localhost:9200");
        var connectionPool = new SingleNodeConnectionPool(uri);
        var settings = new ConnectionSettings(connectionPool)
            .PrettyJson();
        var client = new OpenSearchLowLevelClient(settings);


        Console.WriteLine("Indexing one student......");
        var student = new Student { 
            Id = 100, 
            FirstName = "Paulo", 
            LastName = "Santos", 
            Gpa = 3.93, 
            GradYear = 2021 };v
        var response = client.Index<StringResponse>("students", "100",  
                                        PostData.Serializable(student));
        Console.WriteLine(response.Body);

        Console.WriteLine("Indexing many students......");
        var studentArray = new object[]
        {
            new { index = new { _index = "students", _type = "_doc", _id = "200"}},
            new {
                Id = 200, 
                FirstName = "Shirley", 
                LastName = "Rodriguez", 
                Gpa = 3.91, 
                GradYear = 2019},
            new { index = new { _index = "students", _type = "_doc", _id = "300"}},
            new {
                Id = 300, 
                FirstName = "Nikki", 
                LastName = "Wolf", 
                Gpa = 3.87, 
                GradYear = 2020}
        };

        var manyResponse = client.Bulk<StringResponse>(PostData.MultiJson(studentArray));

        Console.WriteLine(manyResponse.Body);


        Console.WriteLine("Searching for students who graduated in 2019......");
        var searchResponseLow = client.Search<StringResponse>("students",
            PostData.Serializable(
            new
            {
                from = 0,
                size = 20,

                query = new
                {
                    term = new
                    {
                        gradYear = new
                        {
                            value = 2019
                        }
                    }
                }
            }));

        Console.WriteLine(searchResponseLow.Body);

        Console.WriteLine("Searching for a student with the last name Santos......");

        var searchResponse = client.Search<StringResponse>("students",
            @" {
            ""query"":
                {
                    ""match"":
                    {
                        ""lastName"":
                        {
                            ""query"": ""Santos""
                        }
                    }
                }
            }");

        Console.WriteLine(searchResponse.Body);
    }
}
```
{% include copy.html %}
