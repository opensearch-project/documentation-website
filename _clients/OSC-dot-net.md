---
layout: default
title: Getting started with the high-level .NET client
nav_order: 10
has_children: false
parent: .NET clients
---

# Getting started with the high-level .NET client (OpenSearch.Client)

OpenSearch.Client is a high-level .NET client. It provides strongly typed requests and responses as well as Query DSL. It frees you from constructing raw JSON requests and parsing raw JSON responses by providing models that parse and serialize/deserialize requests and responses automatically. OpenSearch.Client also exposes the OpenSearch.Net low-level client if you need it. For the client's complete API documentation, see the [OpenSearch.Client API documentation](https://opensearch-project.github.io/opensearch-net/api/OpenSearch.Client.html).


This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [`opensearch-net` repo](https://github.com/opensearch-project/opensearch-net).

## Installing OpenSearch.Client

To install OpenSearch.Client, download the [OpenSearch.Client NuGet package](https://www.nuget.org/packages/OpenSearch.Client/) and add it to your project in an IDE of your choice. In Microsoft Visual Studio, follow the following steps: 
- In the **Solution Explorer** panel, right-click on your solution or project and select **Manage NuGet Packages for Solution**.
- Search for the OpenSearch.Client NuGet package, and select **Install**.

Alternatively, add OpenSearch.Client to your project using the .NET CLI:

```bash
dotnet add package OpenSearch.Client --version 2.2.0
```
{% include copy.html %}

You can also add OpenSearch.Client to your .csproj file:

```xml
<Project>
  ...
  <ItemGroup>
    <PackageReference Include="OpenSearch.Client" Version="2.2.0" />
  </ItemGroup>
</Project>
```
{% include copy.html %}

OpenSearch.Client depends on OpenSearch.Net, so installing OpenSearch.Client also installs the low-level client. For information about supported OpenSearch versions and target frameworks, see [Compatibility]({{site.url}}{{site.baseurl}}/clients/dot-net/#compatibility).

## Sample data

The examples on this page use the following `Student` class to represent one student, which is equivalent to one document in the index. The `ToString` method formats a `Student` for console output:

```cs
using System.Globalization;

public class Student
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public double Gpa { get; set; }
    public string GradDate { get; set; } = string.Empty;

    public override string ToString() =>
        string.Format(CultureInfo.InvariantCulture,
            "{% raw %}Student{{firstName='{0}', lastName='{1}', gpa={2}, gradDate={3}}}{% endraw %}",
            FirstName, LastName, Gpa, GradDate);
}
```
{% include copy.html %}

By default, OpenSearch.Client uses camel case to convert property names to field names, so a `Student` is indexed as a document containing the `firstName`, `lastName`, `gpa`, and `gradDate` fields.
{: .note}

## Connecting to OpenSearch

Use the default constructor when creating an OpenSearchClient object to connect to the default OpenSearch host (`http://localhost:9200`). 

```cs
var client  = new OpenSearchClient();
```
{% include copy.html %}

To connect to your OpenSearch cluster through a single node with a known address, specify this address when creating an instance of OpenSearch.Client:

```cs
var nodeAddress = new Uri("http://myserver:9200");
var client = new OpenSearchClient(nodeAddress);
```
{% include copy.html %}

You can also connect to OpenSearch through multiple nodes. Connecting to your OpenSearch cluster with a node pool provides advantages like load balancing and cluster failover support. To connect to your OpenSearch cluster using multiple nodes, specify their addresses and create a `ConnectionSettings` object for the OpenSearch.Client instance:

```cs
var nodes = new Uri[]
{
    new Uri("http://myserver1:9200"),
    new Uri("http://myserver2:9200"),
    new Uri("http://myserver3:9200")
};

var pool = new StaticConnectionPool(nodes);
var settings = new ConnectionSettings(pool);
var client = new OpenSearchClient(settings);
```
{% include copy.html %}

### Using ConnectionSettings

`ConnectionConfiguration` is used to pass configuration options to the low-level OpenSearch.Net client. `ConnectionSettings` inherits from `ConnectionConfiguration` and provides additional configuration options for the high-level client, such as a default index name for requests and the mapping of property names to field names. `ConnectionSettings` is part of the OpenSearch.Client package.

To set the address of the node and the default index name for requests that don't specify the index name, create a `ConnectionSettings` object:

```cs
var node = new Uri("http://myserver:9200");
var config = new ConnectionSettings(node).DefaultIndex("students");
var client = new OpenSearchClient(config);
```
{% include copy.html %}

## Creating an index

The following example creates an index with one primary shard and one replica. It explicitly maps the `gradDate` field as a `date` in the `yyyy-MM-dd` format. OpenSearch maps the other document fields dynamically when you index documents:

```cs
var index = "students";
var createIndexResponse = client.Indices.Create(index, c => c
    .Settings(s => s
        .NumberOfShards(1)
        .NumberOfReplicas(1))
    .Map<Student>(m => m
        .Properties(p => p
            .Date(d => d.Name(f => f.GradDate).Format("yyyy-MM-dd")))));
```
{% include copy.html %}

## Indexing one document

Create one instance of `Student`:

```cs
var student = new Student { FirstName = "John", LastName = "Doe", Gpa = 3.89, GradDate = "2022-05-15" };
```
{% include copy.html %}

To index one document, you can use either fluent lambda syntax or object initializer syntax. The following examples set `Refresh` to `Refresh.True` so that the document is immediately available for search.

Index this `Student` into the `students` index with the ID `1` using fluent lambda syntax:

```cs
var indexResponse = client.Index(student, i => i
    .Index(index)
    .Id("1")
    .Refresh(Refresh.True));
```
{% include copy.html %}

Index this `Student` into the `students` index with the ID `1` using object initializer syntax:

```cs
var indexResponse = client.Index(new IndexRequest<Student>(student, index, "1")
{
    Refresh = Refresh.True
});
```
{% include copy.html %}

## Indexing many documents

Index multiple documents in a single request using the Bulk API:

```cs
var bulkResponse = client.Bulk(b => b
    .Index(index)
    .Refresh(Refresh.True)
    .Index<Student>(op => op
        .Id("2")
        .Document(new Student { FirstName = "Paulo", LastName = "Santos", Gpa = 3.93, GradDate = "2021-05-20" }))
    .Index<Student>(op => op
        .Id("3")
        .Document(new Student { FirstName = "Shirley", LastName = "Rodriguez", Gpa = 3.91, GradDate = "2019-05-10" })));
```
{% include copy.html %}

## Searching for documents

Search for all documents in an index using the following code:

```cs
var searchResponse = client.Search<Student>(s => s
    .Index(index)
    .Query(q => q.MatchAll()));
foreach (var doc in searchResponse.Documents)
{
    Console.WriteLine(doc);
}
```
{% include copy.html %}

Each item in `searchResponse.Documents` is a `Student` object, and its fields are available as properties. To also get the ID of each document, iterate over `searchResponse.Hits`. Each hit contains the document ID in the `Id` property and the `Student` object in the `Source` property:

```cs
foreach (var hit in searchResponse.Hits)
{
    Console.WriteLine($"ID: {hit.Id}, name: {hit.Source.FirstName} {hit.Source.LastName}, GPA: {hit.Source.Gpa}, graduation date: {hit.Source.GradDate}");
}
```
{% include copy.html %}

To search for students who graduated in 2019, use a range query. The following Query DSL range query searches for documents whose `gradDate` falls within 2019:

```json
GET students/_search
{
  "query": {
    "range": {
      "gradDate": {
        "gte": "2019-01-01",
        "lte": "2019-12-31"
      }
    }
  }
}
```

In OpenSearch.Client, this query looks like this:

```cs
var searchResponse = client.Search<Student>(s => s
    .Index(index)
    .Query(q => q
        .DateRange(r => r
            .Field(f => f.GradDate)
            .GreaterThanOrEquals("2019-01-01")
            .LessThanOrEquals("2019-12-31"))));
```
{% include copy.html %}

The response contains one document, which corresponds to the correct student:

```text
Student{firstName='Shirley', lastName='Rodriguez', gpa=3.91, gradDate=2019-05-10}
```

## Paginating results

To paginate results, use the `from` and `size` parameters. The following example sorts students by graduation date and retrieves the results two at a time. The first request returns the first page of results, and the second request returns the next page:

```cs
var firstPageResponse = client.Search<Student>(s => s
    .Index(index)
    .Sort(so => so.Ascending(f => f.GradDate))
    .From(0)
    .Size(2));
foreach (var doc in firstPageResponse.Documents)
{
    Console.WriteLine(doc);
}

var nextPageResponse = client.Search<Student>(s => s
    .Index(index)
    .Sort(so => so.Ascending(f => f.GradDate))
    .From(2)
    .Size(2));
foreach (var doc in nextPageResponse.Documents)
{
    Console.WriteLine(doc);
}
```
{% include copy.html %}

The `from` and `size` parameters work well for the first pages of results. To paginate through a large number of results, use point in time with `search_after`. For more information, see [Paginate results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/).

## Updating a document

Update a document using a partial document. Only the fields in the partial document are updated:

```cs
var updateResponse = client.Update<Student, object>("1", u => u
    .Index(index)
    .Doc(new { gpa = 3.92 }));
```
{% include copy.html %}

## Deleting a document

Delete a document using the following code:

```cs
var deleteResponse = client.Delete<Student>("3", d => d
    .Index(index)
    .Refresh(Refresh.True));
```
{% include copy.html %}

## Deleting an index

Delete an index using the following code:

```cs
var deleteIndexResponse = client.Indices.Delete(index);
```
{% include copy.html %}

## Using OpenSearch.Client methods asynchronously

For applications that require asynchronous code, all method calls in OpenSearch.Client have asynchronous counterparts:

```cs
// synchronous method
var response = client.Index(student, i => i.Index(index).Id("1"));

// asynchronous method
var asyncResponse = await client.IndexAsync(student, i => i.Index(index).Id("1"));
```
{% include copy.html %}

## Falling back on the low-level OpenSearch.Net client

OpenSearch.Client exposes the low-level OpenSearch.Net client through the `LowLevel` property. Use the low-level client to call an API for which OpenSearch.Client does not provide a method or to construct the request body yourself instead of using the OpenSearch.Client query methods. The following example sends a range query as an anonymous object and deserializes the response into a `SearchResponse<Student>`:

```cs
var lowLevelClient = client.LowLevel;

var searchResponseLow = lowLevelClient.Search<SearchResponse<Student>>(index,
    PostData.Serializable(
        new
        {
            query = new
            {
                range = new
                {
                    gradDate = new
                    {
                        gte = "2019-01-01",
                        lte = "2019-12-31"
                    }
                }
            }
        }));

if (searchResponseLow.IsValid)
{
    foreach (var doc in searchResponseLow.Documents)
    {
        Console.WriteLine(doc);
    }
}
```
{% include copy.html %}

## Sample program

This sample program combines the code from the preceding sections. It connects to a cluster that has the Security plugin enabled. To connect to a cluster without the Security plugin, change the lines marked with `// Without security` comments. Before running the sample program, make sure that you have the `Student` class defined in your project.

This sample program is for testing only. It specifies credentials in code and disables certificate validation so that it can connect to a cluster that uses self-signed certificates. In production, load credentials from a secure location and validate the cluster's certificate.
{: .warning}

The following sample program creates a client, creates an index, indexes documents individually and in bulk, searches for documents, updates a document, deletes a document, and then deletes the index:

```cs
using OpenSearch.Client;
using OpenSearch.Net;

namespace NetClientProgram;

internal class Program
{
    public static void Main(string[] args)
    {
        var settings = new ConnectionSettings(new Uri("https://localhost:9200")); // Without security, use http://localhost:9200
        settings.BasicAuthentication("admin", "<custom-admin-password>"); // Without security, remove this line
        settings.ServerCertificateValidationCallback(CertificateValidations.AllowAll); // Without security, remove this line
        var client = new OpenSearchClient(settings);

        // Create the index
        var index = "students";
        Console.WriteLine("Creating index......");
        var createIndexResponse = client.Indices.Create(index, c => c
            .Settings(s => s
                .NumberOfShards(1)
                .NumberOfReplicas(1))
            .Map<Student>(m => m
                .Properties(p => p
                    .Date(d => d.Name(f => f.GradDate).Format("yyyy-MM-dd")))));
        Console.WriteLine("Index created: " + createIndexResponse.Index);

        // Index a document
        Console.WriteLine("\nIndexing one student......");
        var student = new Student { FirstName = "John", LastName = "Doe", Gpa = 3.89, GradDate = "2022-05-15" };
        var indexResponse = client.Index(student, i => i
            .Index(index)
            .Id("1")
            .Refresh(Refresh.True));
        Console.WriteLine($"Result: {indexResponse.Result.ToString().ToLowerInvariant()}, id: {indexResponse.Id}, version: {indexResponse.Version}");

        // Bulk index documents
        Console.WriteLine("\nIndexing many students......");
        var bulkResponse = client.Bulk(b => b
            .Index(index)
            .Refresh(Refresh.True)
            .Index<Student>(op => op
                .Id("2")
                .Document(new Student { FirstName = "Paulo", LastName = "Santos", Gpa = 3.93, GradDate = "2021-05-20" }))
            .Index<Student>(op => op
                .Id("3")
                .Document(new Student { FirstName = "Shirley", LastName = "Rodriguez", Gpa = 3.91, GradDate = "2019-05-10" })));
        Console.WriteLine("Errors: " + bulkResponse.Errors.ToString().ToLowerInvariant());
        foreach (var item in bulkResponse.Items)
        {
            Console.WriteLine($"  {item.Result} id: {item.Id}");
        }

        // Search for all students
        Console.WriteLine("\nSearching for all students......");
        var searchResponse = client.Search<Student>(s => s
            .Index(index)
            .Sort(so => so.Ascending(f => f.GradDate))
            .From(0)
            .Size(2));
        Console.WriteLine("Total hits: " + searchResponse.Total);
        Console.WriteLine("Page 1:");
        foreach (var doc in searchResponse.Documents)
        {
            Console.WriteLine("  " + doc);
        }

        var nextPageResponse = client.Search<Student>(s => s
            .Index(index)
            .Sort(so => so.Ascending(f => f.GradDate))
            .From(2)
            .Size(2));
        Console.WriteLine("Page 2:");
        foreach (var doc in nextPageResponse.Documents)
        {
            Console.WriteLine("  " + doc);
        }

        // Search for students who graduated in 2019
        Console.WriteLine("\nSearching for students who graduated in 2019......");
        var searchResponse2 = client.Search<Student>(s => s
            .Index(index)
            .Query(q => q
                .DateRange(r => r
                    .Field(f => f.GradDate)
                    .GreaterThanOrEquals("2019-01-01")
                    .LessThanOrEquals("2019-12-31"))));
        Console.WriteLine("Total hits: " + searchResponse2.Total);
        foreach (var doc in searchResponse2.Documents)
        {
            Console.WriteLine("  " + doc);
        }

        // Update a document
        Console.WriteLine("\nUpdating a student's GPA......");
        var updateResponse = client.Update<Student, object>("1", u => u
            .Index(index)
            .Doc(new { gpa = 3.92 }));
        Console.WriteLine($"Result: {updateResponse.Result.ToString().ToLowerInvariant()}, version: {updateResponse.Version}");

        // Get the updated document
        var getResponse = client.Get<Student>("1", g => g.Index(index));
        Console.WriteLine("Updated document: " + getResponse.Source);

        // Delete a document
        Console.WriteLine("\nDeleting a student......");
        var deleteResponse = client.Delete<Student>("3", d => d
            .Index(index)
            .Refresh(Refresh.True));
        Console.WriteLine("Result: " + deleteResponse.Result.ToString().ToLowerInvariant());

        // Delete the index
        Console.WriteLine("\nDeleting the index......");
        var deleteIndexResponse = client.Indices.Delete(index);
        Console.WriteLine("Acknowledged: " + deleteIndexResponse.Acknowledged.ToString().ToLowerInvariant());
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
