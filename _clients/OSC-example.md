---
layout: default
title: More advanced features of the high-level .NET client
nav_order: 12
has_children: false
parent: .NET clients
---

# More advanced features of the high-level .NET client (OpenSearch.Client)

The following example illustrates more advanced features of OpenSearch.Client. For a simple example, see the [Getting started guide]({{site.url}}{{site.baseurl}}/clients/OSC-dot-net/). This example uses the following Student class.

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

## Mappings

OpenSearch uses dynamic mapping to infer field types of the documents that are indexed. However, to have more control over the schema of your document, you can pass an explicit mapping to OpenSearch. You can define data types for some or all fields of your document in this mapping. 

Similarly, OpenSearch.Client uses auto mapping to infer field data types based on the types of the class's properties. To use auto mapping, create a `students` index using the AutoMap's default constructor:

```cs
var createResponse = await osClient.Indices.CreateAsync("students",
    c => c.Map(m => m.AutoMap<Student>()));
```
{% include copy.html %}

If you use auto mapping, Id and GradYear are mapped as integers, Gpa is mapped as a double, and FirstName and LastName are mapped as text with a keyword subfield. If you want to search for FirstName and LastName and allow only case-sensitive full matches, you can suppress analyzing by mapping these fields as keyword only. In Query DSL, you can accomplish this using the following query:

```json
PUT students
{
  "mappings" : {
    "properties" : {
      "firstName" : {
        "type" : "keyword"
      },
      "lastName" : {
        "type" : "keyword"
      }
    }
  }
}
```

In OpenSearch.Client, you can use fluid lambda syntax to mark these fields as keywords:

```cs
var createResponse = await osClient.Indices.CreateAsync(index,
                c => c.Map(m => m.AutoMap<Student>()
                .Properties<Student>(p => p
                .Keyword(k => k.Name(f => f.FirstName))
                .Keyword(k => k.Name(f => f.LastName)))));
```
{% include copy.html %}

## Settings

In addition to mappings, you can specify settings like the number of primary and replica shards when creating an index. The following query sets the number of primary shards to 1 and the number of replica shards to 2:

```json
PUT students
{
  "mappings" : {
    "properties" : {
      "firstName" : {
        "type" : "keyword"
      },
      "lastName" : {
        "type" : "keyword"
      }
    }
  }, 
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 2
  }
}
```

In OpenSearch.Client, the equivalent of the above query is the following:

```cs
var createResponse = await osClient.Indices.CreateAsync(index,
                            c => c.Map(m => m.AutoMap<Student>()
                            .Properties<Student>(p => p
                            .Keyword(k => k.Name(f => f.FirstName))
                            .Keyword(k => k.Name(f => f.LastName))))
                            .Settings(s => s.NumberOfShards(1).NumberOfReplicas(2)));
```
{% include copy.html %}

## Indexing multiple documents using the Bulk API

In addition to indexing one document using `Index` and `IndexDocument` and indexing multiple documents using `IndexMany`, you can gain more control over document indexing by using `Bulk` or `BulkAll`. Indexing documents individually is inefficient because it creates an HTTP request for every document sent. The BulkAll helper frees you from handling retry, chunking or back off request functionality. It automatically retries if the request fails, backs off if the server is down, and controls how many documents are sent in one HTTP request. 

In the following example, `BulkAll` is configured with the index name, number of back off retries, and back off time. Additionally, the maximum degrees of parallelism setting controls the number of parallel HTTP requests containing the data. Finally, the size parameter signals how many documents are sent in one HTTP request. 

We recommend setting the size to 100–1000 documents in production. 
{: .tip}

`BulkAll` takes a stream of data and returns an Observable that you can use to observe the background operation.

```cs
var bulkAll = osClient.BulkAll(ReadData(), r => r
            .Index(index)
            .BackOffRetries(2)
            .BackOffTime("30s")
            .MaxDegreeOfParallelism(4)
            .Size(100));
```
{% include copy.html %}

## Searching with Boolean query

OpenSearch.Client exposes full OpenSearch query capability. In addition to simple searches that use the match query, you can create a more complex Boolean query to search for students who graduated in 2022 and sort them by last name. In the example below, search is limited to 10 documents, and the scroll API is used to control the pagination of results.

```cs
var gradResponse = await osClient.SearchAsync<Student>(s => s
                        .Index(index)
                        .From(0)
                        .Size(10)
                        .Scroll("1m")
                        .Query(q => q
                        .Bool(b => b
                        .Filter(f => f
                        .Term(t => t.Field(fld => fld.GradYear).Value(2022)))))
                        .Sort(srt => srt.Ascending(f => f.LastName)));
```
{% include copy.html %}

The response contains the Documents property with matching documents from OpenSearch. The data is in the form of deserialized JSON objects of Student type, so you can access their properties in a strongly typed fashion. All serialization and deserialization is handled by OpenSearch.Client.

## Aggregations

OpenSearch.Client includes the full OpenSearch query functionality, including aggregations. In addition to grouping search results into buckets (for example, grouping students by GPA ranges), you can calculate metrics like sum or average. The following query calculates the average GPA of all students in the index. 

Setting Size to 0 means OpenSearch will only return the aggregation, not the actual documents.
{: .tip}

```cs
var aggResponse = await osClient.SearchAsync<Student>(s => s
                                .Index(index)
                                .Size(0)
                                .Aggregations(a => a
                                .Average("average gpa", 
                                            avg => avg.Field(fld => fld.Gpa))));
```
{% include copy.html %}

## Sample program for creating an index and indexing data

The following program creates an index, reads a stream of student records from a comma-separated file and indexes this data into OpenSearch.

```cs
using OpenSearch.Client;

namespace NetClientProgram;

internal class Program
{
    private const string index = "students";

    public static IOpenSearchClient osClient = new OpenSearchClient();

    public static async Task Main(string[] args)
    {
        // Check if the index with the name "students" exists
        var existResponse = await osClient.Indices.ExistsAsync(index);

        if (!existResponse.Exists)  // There is no index with this name
        {
            // Create an index "students"
            // Map FirstName and LastName as keyword
            var createResponse = await osClient.Indices.CreateAsync(index,
                c => c.Map(m => m.AutoMap<Student>()
                .Properties<Student>(p => p
                .Keyword(k => k.Name(f => f.FirstName)) 
                .Keyword(k => k.Name(f => f.LastName))))
                .Settings(s => s.NumberOfShards(1).NumberOfReplicas(1)));

            if (!createResponse.IsValid && !createResponse.Acknowledged)
            {
                throw new Exception("Create response is invalid.");
            }

            // Take a stream of data and send it to OpenSearch
            var bulkAll = osClient.BulkAll(ReadData(), r => r
            .Index(index)
            .BackOffRetries(2)
            .BackOffTime("20s")
            .MaxDegreeOfParallelism(4)
            .Size(10));

            // Wait until the data upload is complete.
            // FromMinutes specifies a timeout.
            // r is a response object that is returned as the data is indexed.
            bulkAll.Wait(TimeSpan.FromMinutes(10), r => 
                Console.WriteLine("Data chunk indexed"));
        }
    }

    // Reads student data in the form "Id,FirsName,LastName,GradYear,Gpa"
    public static IEnumerable<Student> ReadData()
    {
        var file = new StreamReader("C:\\search\\students.csv");

        string s;
        while ((s = file.ReadLine()) is not null)
        {
            yield return new Student(s);
        }
    }
}
```
{% include copy.html %}

## Sample program for search

The following program searches students by name and graduation date and calculates the average GPA.

```cs
using OpenSearch.Client;

namespace NetClientProgram;

internal class Program
{
    private const string index = "students";

    public static IOpenSearchClient osClient = new OpenSearchClient();

    public static async Task Main(string[] args)
    {
        await SearchByName();

        await SearchByGradDate();

        await CalculateAverageGpa();
    }

    private static async Task SearchByName()
    {
        Console.WriteLine("Searching for name......");

        var nameResponse = await osClient.SearchAsync<Student>(s => s
                                .Index(index)
                                .Query(q => q
                                .Match(m => m
                                .Field(fld => fld.FirstName)
                                .Query("Zhang"))));

        if (!nameResponse.IsValid)
        {
            throw new Exception("Aggregation query response is not valid.");
        }

        foreach (var s in nameResponse.Documents)
        {
            Console.WriteLine($"{s.Id} {s.LastName} " +
                $"{s.FirstName} {s.Gpa} {s.GradYear}");
        }
    }

    private static async Task SearchByGradDate()
    {
        Console.WriteLine("Searching for grad date......");

        // Search for all students who graduated in 2022
        var gradResponse = await osClient.SearchAsync<Student>(s => s
                                .Index(index)
                                .From(0)
                                .Size(2)
                                .Scroll("1m")
                                .Query(q => q
                                .Bool(b => b
                                .Filter(f => f
                                .Term(t => t.Field(fld => fld.GradYear).Value(2022)))))
                                .Sort(srt => srt.Ascending(f => f.LastName))
                                .Size(10));


        if (!gradResponse.IsValid)
        {
            throw new Exception("Grad date query response is not valid.");
        }

        while (gradResponse.Documents.Any())
        {
            foreach (var data in gradResponse.Documents)
            {
                Console.WriteLine($"{data.Id} {data.LastName} {data.FirstName} " +
                    $"{data.Gpa} {data.GradYear}");
            }
            gradResponse = osClient.Scroll<Student>("1m", gradResponse.ScrollId);
        }
    }

    public static async Task CalculateAverageGpa()
    {
        Console.WriteLine("Calculating average GPA......");

        // Search and aggregate
        // Size 0 means documents are not returned, only aggregation is returned
        var aggResponse = await osClient.SearchAsync<Student>(s => s
                                .Index(index)
                                .Size(0)
                                .Aggregations(a => a
                                .Average("average gpa", 
                                            avg => avg.Field(fld => fld.Gpa))));
       
        if (!aggResponse.IsValid) throw new Exception("Aggregation response not valid");

        var avg = aggResponse.Aggregations.Average("average gpa").Value;
        Console.WriteLine($"Average GPA is {avg}");
    }
}
```
{% include copy.html %}