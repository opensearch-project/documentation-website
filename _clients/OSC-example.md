---
layout: default
title: More advanced features of the high-level .NET client
nav_order: 12
has_children: false
parent: .NET clients
---

# More advanced features of the high-level .NET client (OpenSearch.Client)

The following example illustrates more advanced features of OpenSearch.Client. For a simple example, see the [Getting started guide]({{site.url}}{{site.baseurl}}/clients/OSC-dot-net/). This example uses the following `Student` class, which is the same class used in the [Getting started guide]({{site.url}}{{site.baseurl}}/clients/OSC-dot-net/). OpenSearch.Client converts its property names to the `firstName`, `lastName`, `gpa`, and `gradDate` field names. The `ToString` method formats a `Student` for console output:

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

## Mappings

OpenSearch uses dynamic mapping to infer field types of the documents that are indexed. However, to have more control over the schema of your document, you can pass an explicit mapping to OpenSearch. You can define data types for some or all fields of your document in this mapping. 

Similarly, OpenSearch.Client uses auto mapping to infer field data types based on the types of the class's properties. To use auto mapping, create a `students` index using the AutoMap's default constructor:

```cs
var createResponse = await osClient.Indices.CreateAsync("students",
    c => c.Map(m => m.AutoMap<Student>()));
```
{% include copy.html %}

If you use auto mapping, `Gpa` is mapped as a double, and `FirstName`, `LastName`, and `GradDate` are string properties, so they are mapped as text with a keyword subfield. To search date ranges on `GradDate`, map it as a `date` in the `yyyy-MM-dd` format. If you want to search for `FirstName` and `LastName` and allow only case-sensitive full matches, you can suppress analyzing by mapping these fields as keyword only. In Query DSL, you can accomplish this using the following query:

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
      },
      "gradDate" : {
        "type" : "date",
        "format" : "yyyy-MM-dd"
      }
    }
  }
}
```

In OpenSearch.Client, you can use fluid lambda syntax to map these fields:

```cs
var createResponse = await osClient.Indices.CreateAsync(index,
                c => c.Map(m => m.AutoMap<Student>()
                .Properties<Student>(p => p
                .Keyword(k => k.Name(f => f.FirstName))
                .Keyword(k => k.Name(f => f.LastName))
                .Date(d => d.Name(f => f.GradDate).Format("yyyy-MM-dd")))));
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
      },
      "gradDate" : {
        "type" : "date",
        "format" : "yyyy-MM-dd"
      }
    }
  }, 
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 2
  }
}
```

In OpenSearch.Client, the equivalent of the preceding query is the following:

```cs
var createResponse = await osClient.Indices.CreateAsync(index,
                            c => c.Map(m => m.AutoMap<Student>()
                            .Properties<Student>(p => p
                            .Keyword(k => k.Name(f => f.FirstName))
                            .Keyword(k => k.Name(f => f.LastName))
                            .Date(d => d.Name(f => f.GradDate).Format("yyyy-MM-dd"))))
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

OpenSearch.Client exposes full OpenSearch query capability. In addition to simple searches that use the match query, you can create a more complex Boolean query that filters on a `gradDate` range to search for students who graduated in 2022 and sort them by last name. In the following example, search is limited to 10 documents, and the scroll API is used to control the pagination of results.

```cs
var gradResponse = await osClient.SearchAsync<Student>(s => s
                        .Index(index)
                        .From(0)
                        .Size(10)
                        .Scroll("1m")
                        .Query(q => q
                        .Bool(b => b
                        .Filter(f => f
                        .DateRange(r => r
                            .Field(fld => fld.GradDate)
                            .GreaterThanOrEquals("2022-01-01")
                            .LessThanOrEquals("2022-12-31")))))
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

The sample program in this section reads student records from a `students.csv` file located in the directory from which you run the program. Create the file with one student record per line in the `FirstName,LastName,Gpa,GradDate` format, specifying the graduation date in the `yyyy-MM-dd` format. Do not include a header row. For example:

```text
John,Doe,3.89,2022-05-15
Wei,Zhang,3.65,2022-05-15
Zhang,Li,3.72,2022-06-10
```
{% include copy.html %}

The following program deletes the `students` index if it exists, creates the index, reads the student records from the file, and indexes them into OpenSearch:

```cs
using System.Globalization;
using OpenSearch.Client;

namespace NetClientProgram;

internal class Program
{
    private const string index = "students";

    public static IOpenSearchClient osClient = new OpenSearchClient();

    public static async Task Main(string[] args)
    {
        // Delete the "students" index if it exists so that the index is created with the following mappings
        var existResponse = await osClient.Indices.ExistsAsync(index);

        if (existResponse.Exists)
        {
            await osClient.Indices.DeleteAsync(index);
        }

        // Create an index "students"
        // Map FirstName and LastName as keyword and GradDate as date
        var createResponse = await osClient.Indices.CreateAsync(index,
            c => c.Map(m => m.AutoMap<Student>()
            .Properties<Student>(p => p
            .Keyword(k => k.Name(f => f.FirstName))
            .Keyword(k => k.Name(f => f.LastName))
            .Date(d => d.Name(f => f.GradDate).Format("yyyy-MM-dd"))))
            .Settings(s => s.NumberOfShards(1).NumberOfReplicas(1)));

        if (!createResponse.IsValid || !createResponse.Acknowledged)
        {
            throw new Exception("Create response is invalid.");
        }

        // Take a stream of data and send it to OpenSearch
        var bulkAll = osClient.BulkAll(ReadData(), r => r
        .Index(index)
        .BackOffRetries(2)
        .BackOffTime("20s")
        .MaxDegreeOfParallelism(4)
        .Size(10)
        .RefreshOnCompleted());

        // Wait until the data upload is complete.
        // FromMinutes specifies a timeout.
        // r is a response object that is returned as the data is indexed.
        bulkAll.Wait(TimeSpan.FromMinutes(10), r =>
            Console.WriteLine("Data chunk indexed"));
    }

    // Reads student data in the form "FirstName,LastName,Gpa,GradDate"
    public static IEnumerable<Student> ReadData()
    {
        foreach (var line in File.ReadLines("students.csv"))
        {
            var fields = line.Split(',');
            yield return new Student
            {
                FirstName = fields[0],
                LastName = fields[1],
                Gpa = double.Parse(fields[2], CultureInfo.InvariantCulture),
                GradDate = fields[3]
            };
        }
    }
}
```
{% include copy.html %}

## Sample program for search

The following program searches students by name and graduation date, calculates the average GPA, and then deletes the index.

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

        // Delete the index
        Console.WriteLine("Deleting the index......");
        var deleteIndexResponse = await osClient.Indices.DeleteAsync(index);
        Console.WriteLine("Acknowledged: " + deleteIndexResponse.Acknowledged.ToString().ToLowerInvariant());
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
            throw new Exception("Name query response is not valid.");
        }

        foreach (var s in nameResponse.Documents)
        {
            Console.WriteLine("  " + s);
        }
    }

    private static async Task SearchByGradDate()
    {
        Console.WriteLine("Searching for grad date......");

        // Search for all students who graduated in 2022
        var gradResponse = await osClient.SearchAsync<Student>(s => s
                                .Index(index)
                                .From(0)
                                .Size(10)
                                .Scroll("1m")
                                .Query(q => q
                                .Bool(b => b
                                .Filter(f => f
                                .DateRange(r => r
                                    .Field(fld => fld.GradDate)
                                    .GreaterThanOrEquals("2022-01-01")
                                    .LessThanOrEquals("2022-12-31")))))
                                .Sort(srt => srt.Ascending(f => f.LastName)));


        if (!gradResponse.IsValid)
        {
            throw new Exception("Grad date query response is not valid.");
        }

        while (gradResponse.Documents.Any())
        {
            foreach (var data in gradResponse.Documents)
            {
                Console.WriteLine("  " + data);
            }
            gradResponse = await osClient.ScrollAsync<Student>("1m", gradResponse.ScrollId);
        }

        // Release the resources held by the scroll context
        await osClient.ClearScrollAsync(c => c.ScrollId(gradResponse.ScrollId));
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

## Related documentation

- For more examples of using the client, see the [`opensearch-net` user guide](https://github.com/opensearch-project/opensearch-net/blob/main/USER_GUIDE.md).
- For guides to specific tasks, such as bulk indexing and searching, see the [`opensearch-net` guides](https://github.com/opensearch-project/opensearch-net/tree/main/guides).
- For complete sample applications, see the [`opensearch-net` samples](https://github.com/opensearch-project/opensearch-net/tree/main/samples).
