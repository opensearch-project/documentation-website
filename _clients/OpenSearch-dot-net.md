---
layout: default
title: Low-level .NET client
nav_order: 30
has_children: false
parent: .NET clients
---

# Low-level .NET client (OpenSearch.Net)

OpenSearch.Net is a low-level .NET client that provides the foundational layer of communication with OpenSearch. It is dependency free, and it can handle round-robin load balancing, transport, and the basic request/response cycle. OpenSearch.Net contains all OpenSearch API endpoints as methods. When using OpenSearch.Net, you need to construct the queries yourself.

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [`opensearch-net` repo](https://github.com/opensearch-project/opensearch-net).

## Stable release

This documentation reflects the latest updates available in the [GitHub repository](https://github.com/opensearch-project/opensearch-net) and may include changes unavailable in the current stable release. The current stable release in NuGet is [2.2.0](https://www.nuget.org/packages/OpenSearch.Net/2.2.0). For information about supported OpenSearch versions and target frameworks, see [Compatibility]({{site.url}}{{site.baseurl}}/clients/dot-net/#compatibility).

## Installing the OpenSearch.Net client

To install OpenSearch.Net, download the [OpenSearch.Net NuGet package](https://www.nuget.org/packages/OpenSearch.Net) and add it to your project in an IDE of your choice. In Microsoft Visual Studio, use the following steps:
- In the **Solution Explorer** panel, right-click on your solution or project and select **Manage NuGet Packages for Solution**.
- Search for the OpenSearch.Net NuGet package, and select **Install**.

Alternatively, add OpenSearch.Net to your project using the .NET CLI:

```bash
dotnet add package OpenSearch.Net --version 2.2.0
```
{% include copy.html %}

You can also add OpenSearch.Net to your .csproj file:

```xml
<Project>
  ...
  <ItemGroup>
    <PackageReference Include="OpenSearch.Net" Version="2.2.0" />
  </ItemGroup>
</Project>
```
{% include copy.html %}

## Sample data

The examples on this page use the following `Student` class to represent one student, which is equivalent to one document in the index. The `ToString` method formats a `Student` for console output:

```cs
using System.Globalization;
using System.Runtime.Serialization;

public class Student
{
    [DataMember(Name = "firstName")]
    public string FirstName { get; set; } = string.Empty;

    [DataMember(Name = "lastName")]
    public string LastName { get; set; } = string.Empty;

    [DataMember(Name = "gpa")]
    public double Gpa { get; set; }

    [DataMember(Name = "gradDate")]
    public string GradDate { get; set; } = string.Empty;

    public override string ToString() =>
        string.Format(CultureInfo.InvariantCulture,
            "{% raw %}Student{{firstName='{0}', lastName='{1}', gpa={2}, gradDate={3}}}{% endraw %}",
            FirstName, LastName, Gpa, GradDate);
}
```
{% include copy.html %}

By default, OpenSearch.Net serializes property names exactly as they are declared. The `DataMember` attributes specify the field names, so a `Student` is indexed as a document containing the `firstName`, `lastName`, `gpa`, and `gradDate` fields.
{: .note}

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

To sign requests to Amazon OpenSearch Service using AWS Signature Version 4, install the OpenSearch.Net.Auth.AwsSigV4 package. This package depends on OpenSearch.Net, so it also installs OpenSearch.Net:

```bash
dotnet add package OpenSearch.Net.Auth.AwsSigV4 --version 2.2.0
```
{% include copy.html %}

`AwsSigV4HttpConnection` signs requests using credentials from the default AWS credential provider chain. The Region that you pass to `AwsSigV4HttpConnection` must match the Region of your domain or collection. The following examples use the `us-east-1` Region.

In the following example, replace the endpoint with your domain endpoint, which is listed on the domain's details page in the Amazon OpenSearch Service console.

The following example illustrates connecting to Amazon OpenSearch Service:

```cs
using Amazon;
using OpenSearch.Net;
using OpenSearch.Net.Auth.AwsSigV4;

namespace Application
{
    class Program
    {
        static void Main(string[] args)
        {
            var endpoint = new Uri("https://search-<domain-name>-<id>.us-east-1.es.amazonaws.com");
            var connection = new AwsSigV4HttpConnection(RegionEndpoint.USEast1, service: AwsSigV4HttpConnection.OpenSearchService);
            var config = new ConnectionConfiguration(endpoint, connection);
            var client = new OpenSearchLowLevelClient(config);

            Console.WriteLine(client.RootNodeInfo<StringResponse>().Body);
        }
    }
}
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Serverless

The following example illustrates connecting to Amazon OpenSearch Serverless. Replace the endpoint with your collection endpoint, which is listed on the collection's details page in the Amazon OpenSearch Service console:

```cs
using Amazon;
using OpenSearch.Net;
using OpenSearch.Net.Auth.AwsSigV4;

namespace Application
{
    class Program
    {
        static void Main(string[] args)
        {
            var endpoint = new Uri("https://<collection-id>.us-east-1.aoss.amazonaws.com");
            var connection = new AwsSigV4HttpConnection(RegionEndpoint.USEast1, service: AwsSigV4HttpConnection.OpenSearchServerlessService);
            var config = new ConnectionConfiguration(endpoint, connection);
            var client = new OpenSearchLowLevelClient(config);

            Console.WriteLine(client.Cat.Indices<StringResponse>().Body);
        }
    }
}
```
{% include copy.html %}

Amazon OpenSearch Serverless supports a subset of OpenSearch API operations and does not support the `refresh` parameter used in the examples on this page. For more information, see [Supported operations and plugins in Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-genref.html).
{: .note}

## Using ConnectionConfiguration

Use `ConnectionConfiguration` to pass configuration options to the OpenSearch.Net client. The following example uses `ConnectionConfiguration` to:

- Enable gzip-compressed requests and responses.
- Signal to OpenSearch to return formatted JSON.

```cs
var uri = new Uri("http://localhost:9200");
var connectionPool = new SingleNodeConnectionPool(uri);
var settings = new ConnectionConfiguration(connectionPool)
    .EnableHttpCompression()
    .PrettyJson();

var client = new OpenSearchLowLevelClient(settings);
```
{% include copy.html %}

## Creating an index

The following example creates an index with one primary shard and one replica. It explicitly maps the `gradDate` field as a `date` in the `yyyy-MM-dd` format. OpenSearch maps the other document fields dynamically when you index documents:

```cs
var index = "students";
var createIndexResponse = client.Indices.Create<DynamicResponse>(index,
    PostData.Serializable(new
    {
        settings = new
        {
            index = new
            {
                number_of_shards = 1,
                number_of_replicas = 1
            }
        },
        mappings = new
        {
            properties = new
            {
                gradDate = new { type = "date", format = "yyyy-MM-dd" }
            }
        }
    }));
```
{% include copy.html %}

The generic type parameter of each method specifies the response type. `DynamicResponse` lets you read values from the response body by path, for example, `createIndexResponse.Get<string>("index")`. `StringResponse` returns the response body as a string.

## Indexing one document

To index a document, first create an instance of the `Student` class:

```cs
var student = new Student { FirstName = "John", LastName = "Doe", Gpa = 3.89, GradDate = "2022-05-15" };
```
{% include copy.html %}

Alternatively, you can create a student using an anonymous type. In this case, the property names are the field names:

```cs
var student = new { firstName = "John", lastName = "Doe", gpa = 3.89, gradDate = "2022-05-15" };
```
{% include copy.html %}

Next, upload this student into the `students` index with the ID `1` using the `Index` method. Setting `Refresh` to `Refresh.True` makes the document immediately available for search:

```cs
var indexResponse = client.Index<DynamicResponse>(index, "1",
    PostData.Serializable(student),
    new IndexRequestParameters { Refresh = Refresh.True });
```
{% include copy.html %}

## Indexing many documents using the Bulk API

To index many documents, use the Bulk API to bundle many operations into one request:

```cs
var bulkBody = new object[]
{
    new { index = new { _index = index, _id = "2" } },
    new Student { FirstName = "Paulo", LastName = "Santos", Gpa = 3.93, GradDate = "2021-05-20" },
    new { index = new { _index = index, _id = "3" } },
    new Student { FirstName = "Shirley", LastName = "Rodriguez", Gpa = 3.91, GradDate = "2019-05-10" }
};
var bulkResponse = client.Bulk<StringResponse>(PostData.MultiJson(bulkBody),
    new BulkRequestParameters { Refresh = Refresh.True });
```
{% include copy.html %}

You can send the request body as an anonymous object, string, byte array, or stream in APIs that take a body. For APIs that take multiline JSON, you can send the body as a list of bytes or a list of objects, like in the preceding example. The `PostData` class has static methods to send the body in all of these forms.

## Searching for documents

To construct a Query DSL query, use anonymous types within the request body. The following query searches for all students:

```cs
var searchResponse = client.Search<StringResponse>(index,
    PostData.Serializable(new { query = new { match_all = new { } } }));
Console.WriteLine(searchResponse.Body);
```
{% include copy.html %}

The following range query searches for students who graduated in 2019:

```cs
var searchResponse = client.Search<StringResponse>(index,
    PostData.Serializable(new
    {
        query = new
        {
            range = new
            {
                gradDate = new { gte = "2019-01-01", lte = "2019-12-31" }
            }
        }
    }));
Console.WriteLine(searchResponse.Body);
```
{% include copy.html %}

Alternatively, you can use strings to construct the request. When using strings, you have to escape the `"` character:

```cs
var searchResponse = client.Search<StringResponse>(index,
    @" {
    ""query"":
        {
            ""range"":
            {
                ""gradDate"":
                {
                    ""gte"": ""2019-01-01"",
                    ""lte"": ""2019-12-31""
                }
            }
        }
    }");
Console.WriteLine(searchResponse.Body);
```
{% include copy.html %}

## Paginating results

To paginate results, use the `from` and `size` parameters. The following example sorts students by graduation date and retrieves the results two at a time. The first request returns the first page of results, and the second request returns the next page:

```cs
var firstPageResponse = client.Search<StringResponse>(index,
    PostData.Serializable(new
    {
        from = 0,
        size = 2,
        sort = new[] { new { gradDate = "asc" } },
        query = new { match_all = new { } }
    }));
Console.WriteLine(firstPageResponse.Body);

var nextPageResponse = client.Search<StringResponse>(index,
    PostData.Serializable(new
    {
        from = 2,
        size = 2,
        sort = new[] { new { gradDate = "asc" } },
        query = new { match_all = new { } }
    }));
Console.WriteLine(nextPageResponse.Body);
```
{% include copy.html %}

The `from` and `size` parameters work well for the first pages of results. To paginate through a large number of results, use point in time with `search_after`. For more information, see [Paginate results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/).

## Updating a document

Update a document by sending a partial document in the `doc` field. Only the fields in the partial document are updated:

```cs
var updateResponse = client.Update<DynamicResponse>(index, "1",
    PostData.Serializable(new { doc = new { gpa = 3.92 } }));
```
{% include copy.html %}

## Deleting a document

Delete a document using the following code:

```cs
var deleteResponse = client.Delete<DynamicResponse>(index, "3",
    new DeleteRequestParameters { Refresh = Refresh.True });
```
{% include copy.html %}

## Deleting an index

Delete an index using the following code:

```cs
var deleteIndexResponse = client.Indices.Delete<DynamicResponse>(index);
```
{% include copy.html %}

## Using OpenSearch.Net methods asynchronously

For applications that require asynchronous code, all method calls in OpenSearch.Net have asynchronous counterparts:

```cs
// synchronous method
var response = client.Index<StringResponse>(index, "1",
                                PostData.Serializable(student));

// asynchronous method
var asyncResponse = await client.IndexAsync<StringResponse>(index, "1",
                                    PostData.Serializable(student));
```
{% include copy.html %}

## Handling exceptions

By default, OpenSearch.Net does not throw exceptions when an operation is unsuccessful. For example, the following query searches for a document in an index that does not exist:

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

The response contains the 404 error status code, but no exception is thrown. You can see the status code in the `status` field:

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

To determine whether a request succeeded, use the following properties of the response object:

```cs
Console.WriteLine("Success: " + searchResponse.Success);
Console.WriteLine("SuccessOrKnownError: " + searchResponse.SuccessOrKnownError);
Console.WriteLine("Original Exception: " + searchResponse.OriginalException);
```
{% include copy.html %}

- `Success` returns true if the response code is in the 2xx range or the response code has one of the expected values for this request.
- `SuccessOrKnownError` returns true if the response is successful or the response code is in the 400–501 or 505–599 ranges. If SuccessOrKnownError is true, the request is not retried.
- `OriginalException` holds the original exception for the unsuccessful responses.

## Sample program

This sample program combines the code from the preceding sections. It connects to a cluster that has the Security plugin enabled. To connect to a cluster without the Security plugin, change the lines marked with `// Without security` comments. Before running the sample program, make sure that you have the `Student` class defined in your project. To print the returned documents, the sample program uses `System.Text.Json` to deserialize the `_source` of each document into a `Student`.

This sample program is for testing only. It specifies credentials in code and disables certificate validation so that it can connect to a cluster that uses self-signed certificates. In production, load credentials from a secure location and validate the cluster's certificate.
{: .warning}

The following sample program creates a client, creates an index, indexes documents individually and in bulk, searches for documents, updates a document, deletes a document, and then deletes the index:

```cs
using System.Text.Json;
using OpenSearch.Net;

namespace NetClientProgram;

internal class Program
{
    public static void Main(string[] args)
    {
        var config = new ConnectionConfiguration(new Uri("https://localhost:9200")); // Without security, use http://localhost:9200
        config.BasicAuthentication("admin", "<custom-admin-password>"); // Without security, remove this line
        config.ServerCertificateValidationCallback(CertificateValidations.AllowAll); // Without security, remove this line
        var client = new OpenSearchLowLevelClient(config);

        // Create the index
        var index = "students";
        Console.WriteLine("Creating index......");
        var createIndexResponse = client.Indices.Create<DynamicResponse>(index,
            PostData.Serializable(new
            {
                settings = new
                {
                    index = new
                    {
                        number_of_shards = 1,
                        number_of_replicas = 1
                    }
                },
                mappings = new
                {
                    properties = new
                    {
                        gradDate = new { type = "date", format = "yyyy-MM-dd" }
                    }
                }
            }));
        Console.WriteLine("Index created: " + createIndexResponse.Get<string>("index"));

        // Index a document
        Console.WriteLine("\nIndexing one student......");
        var student = new Student { FirstName = "John", LastName = "Doe", Gpa = 3.89, GradDate = "2022-05-15" };
        var indexResponse = client.Index<DynamicResponse>(index, "1",
            PostData.Serializable(student),
            new IndexRequestParameters { Refresh = Refresh.True });
        Console.WriteLine($"Result: {indexResponse.Get<string>("result")}, id: {indexResponse.Get<string>("_id")}, version: {indexResponse.Get<long>("_version")}");

        // Bulk index documents
        Console.WriteLine("\nIndexing many students......");
        var bulkBody = new object[]
        {
            new { index = new { _index = index, _id = "2" } },
            new Student { FirstName = "Paulo", LastName = "Santos", Gpa = 3.93, GradDate = "2021-05-20" },
            new { index = new { _index = index, _id = "3" } },
            new Student { FirstName = "Shirley", LastName = "Rodriguez", Gpa = 3.91, GradDate = "2019-05-10" }
        };
        var bulkResponse = client.Bulk<StringResponse>(PostData.MultiJson(bulkBody),
            new BulkRequestParameters { Refresh = Refresh.True });
        using (var bulkJson = JsonDocument.Parse(bulkResponse.Body))
        {
            Console.WriteLine("Errors: " + bulkJson.RootElement.GetProperty("errors").GetRawText());
            foreach (var item in bulkJson.RootElement.GetProperty("items").EnumerateArray())
            {
                var operation = item.GetProperty("index");
                Console.WriteLine($"  {operation.GetProperty("result")} id: {operation.GetProperty("_id")}");
            }
        }

        // Search for all students
        Console.WriteLine("\nSearching for all students......");
        var searchResponse = client.Search<StringResponse>(index,
            PostData.Serializable(new
            {
                from = 0,
                size = 2,
                sort = new[] { new { gradDate = "asc" } },
                query = new { match_all = new { } }
            }));
        PrintTotal(searchResponse);
        Console.WriteLine("Page 1:");
        PrintStudents(searchResponse);

        var nextPageResponse = client.Search<StringResponse>(index,
            PostData.Serializable(new
            {
                from = 2,
                size = 2,
                sort = new[] { new { gradDate = "asc" } },
                query = new { match_all = new { } }
            }));
        Console.WriteLine("Page 2:");
        PrintStudents(nextPageResponse);

        // Search for students who graduated in 2019
        Console.WriteLine("\nSearching for students who graduated in 2019......");
        var searchResponse2 = client.Search<StringResponse>(index,
            PostData.Serializable(new
            {
                query = new
                {
                    range = new
                    {
                        gradDate = new { gte = "2019-01-01", lte = "2019-12-31" }
                    }
                }
            }));
        PrintTotal(searchResponse2);
        PrintStudents(searchResponse2);

        // Update a document
        Console.WriteLine("\nUpdating a student's GPA......");
        var updateResponse = client.Update<DynamicResponse>(index, "1",
            PostData.Serializable(new { doc = new { gpa = 3.92 } }));
        Console.WriteLine($"Result: {updateResponse.Get<string>("result")}, version: {updateResponse.Get<long>("_version")}");

        // Get the updated document
        var getResponse = client.Get<StringResponse>(index, "1");
        using (var getJson = JsonDocument.Parse(getResponse.Body))
        {
            var updatedStudent = getJson.RootElement.GetProperty("_source").Deserialize<Student>(JsonOptions);
            Console.WriteLine("Updated document: " + updatedStudent);
        }

        // Delete a document
        Console.WriteLine("\nDeleting a student......");
        var deleteResponse = client.Delete<DynamicResponse>(index, "3",
            new DeleteRequestParameters { Refresh = Refresh.True });
        Console.WriteLine("Result: " + deleteResponse.Get<string>("result"));

        // Delete the index
        Console.WriteLine("\nDeleting the index......");
        var deleteIndexResponse = client.Indices.Delete<StringResponse>(index);
        using (var deleteIndexJson = JsonDocument.Parse(deleteIndexResponse.Body))
        {
            Console.WriteLine("Acknowledged: " + deleteIndexJson.RootElement.GetProperty("acknowledged").GetRawText());
        }
    }

    // Deserializes camelCase JSON field names into Student properties
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    // Prints the total number of hits
    private static void PrintTotal(StringResponse searchResponse)
    {
        using var json = JsonDocument.Parse(searchResponse.Body);
        var hits = json.RootElement.GetProperty("hits");
        Console.WriteLine("Total hits: " + hits.GetProperty("total").GetProperty("value"));
    }

    // Prints the student in each hit
    private static void PrintStudents(StringResponse searchResponse)
    {
        using var json = JsonDocument.Parse(searchResponse.Body);
        var hits = json.RootElement.GetProperty("hits");
        foreach (var hit in hits.GetProperty("hits").EnumerateArray())
        {
            var student = hit.GetProperty("_source").Deserialize<Student>(JsonOptions);
            Console.WriteLine("  " + student);
        }
    }
}
```
{% include copy.html %}

The sample program produces the following output:

```text
Creating index......
Index created: students

Indexing one student......
Result: created, id: 1, version: 1

Indexing many students......
Errors: false
  created id: 2
  created id: 3

Searching for all students......
Total hits: 3
Page 1:
  Student{firstName='Shirley', lastName='Rodriguez', gpa=3.91, gradDate=2019-05-10}
  Student{firstName='Paulo', lastName='Santos', gpa=3.93, gradDate=2021-05-20}
Page 2:
  Student{firstName='John', lastName='Doe', gpa=3.89, gradDate=2022-05-15}

Searching for students who graduated in 2019......
Total hits: 1
  Student{firstName='Shirley', lastName='Rodriguez', gpa=3.91, gradDate=2019-05-10}

Updating a student's GPA......
Result: updated, version: 2
Updated document: Student{firstName='John', lastName='Doe', gpa=3.92, gradDate=2022-05-15}

Deleting a student......
Result: deleted

Deleting the index......
Acknowledged: true
```

## Related documentation

- For more examples of using the client, see the [`opensearch-net` user guide](https://github.com/opensearch-project/opensearch-net/blob/main/USER_GUIDE.md).
- For guides to specific tasks, such as bulk indexing and searching, see the [`opensearch-net` guides](https://github.com/opensearch-project/opensearch-net/tree/main/guides).
- For complete sample applications, see the [`opensearch-net` samples](https://github.com/opensearch-project/opensearch-net/tree/main/samples).
