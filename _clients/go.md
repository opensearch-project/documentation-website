---
layout: default
title: Go client
nav_order: 50
---

# Go client

The OpenSearch Go client lets you connect your Go application with the data in your OpenSearch cluster. This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client's complete API documentation and additional examples, see the [Go client API documentation](https://pkg.go.dev/github.com/opensearch-project/opensearch-go/v5).

For the client source code, see the [`opensearch-go` repo](https://github.com/opensearch-project/opensearch-go).


## Installing the Go client

The Go client requires Go 1.26 or later.

If you're starting a new project, create a new module by running the following command:

```bash
go mod init <mymodulename>
```
{% include copy.html %}

To add the Go client to your project, run the following command:

```bash
go get github.com/opensearch-project/opensearch-go/v5
```
{% include copy.html %}

Version 5 of the client is not compatible with code written for version 4. For migration instructions, see the [v5 upgrade guide](https://github.com/opensearch-project/opensearch-go/blob/main/UPGRADING_V5.md).

## Connecting to OpenSearch

The examples on this page use the following imports:

```go
import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/opensearch-project/opensearch-go/v5"
	"github.com/opensearch-project/opensearch-go/v5/opensearchapi"
	"github.com/opensearch-project/opensearch-go/v5/opensearchutil"
)
```
{% include copy.html %}

To connect to the default OpenSearch host, create a client object with the address `https://localhost:9200` if you are using the Security plugin:

```go
client, err := opensearchapi.NewClient(opensearchapi.Config{
	Client: opensearch.Config{
		Addresses:            []string{"https://localhost:9200"},
		InsecureSkipVerify:   true,    // For testing only. Use certificate for validation.
		Username:             "admin", // For testing only. Don't store credentials in code.
		Password:             "<custom-admin-password>",
		DiscoverNodesOnStart: new(false),
	},
})
```
{% include copy.html %}

If you are not using the Security plugin, create a client object with the address `http://localhost:9200`:

```go
client, err := opensearchapi.NewClient(opensearchapi.Config{
	Client: opensearch.Config{
		Addresses:            []string{"http://localhost:9200"},
		DiscoverNodesOnStart: new(false),
	},
})
```
{% include copy.html %}

By default, the client discovers the nodes in the cluster when it starts and then sends requests to the nodes' publish addresses. If these addresses are not reachable from your application---for example, when OpenSearch runs in Docker---requests time out. Setting `DiscoverNodesOnStart` to `false` makes the client send requests only to the addresses that you specify in `Addresses`.

## Connecting to Amazon OpenSearch Service

In the following example, replace the endpoint with your domain endpoint, which is listed on the domain's details page in the Amazon OpenSearch Service console.

The following example illustrates connecting to Amazon OpenSearch Service:

```go
package main

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/opensearch-project/opensearch-go/v5"
	"github.com/opensearch-project/opensearch-go/v5/opensearchapi"
	requestsigner "github.com/opensearch-project/opensearch-go/v5/signer/awsv2"
)

const endpoint = "https://search-<domain-name>-<id>.us-east-1.es.amazonaws.com" // OpenSearch domain endpoint

func main() {
	ctx := context.Background()

	awsCfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion("us-east-1"),
		config.WithCredentialsProvider(
			getCredentialProvider("<AWS_ACCESS_KEY>", "<AWS_SECRET_ACCESS_KEY>", "<AWS_SESSION_TOKEN>"),
		),
	)
	if err != nil {
		log.Fatal(err) // Do not log.Fatal in a production-ready app.
	}

	// Create an AWS request signer for Amazon OpenSearch Service.
	signer, err := requestsigner.NewSignerWithService(awsCfg, "es")
	if err != nil {
		log.Fatal(err) // Do not log.Fatal in a production-ready app.
	}

	// Create an OpenSearch client that uses the request signer.
	client, err := opensearchapi.NewClient(opensearchapi.Config{
		Client: opensearch.Config{
			Addresses:            []string{endpoint},
			Signer:               signer,
			DiscoverNodesOnStart: new(false),
		},
	})
	if err != nil {
		log.Fatal("client creation err", err)
	}

	_ = client
	// Your code here
}

func getCredentialProvider(accessKey, secretAccessKey, token string) aws.CredentialsProviderFunc {
	return func(ctx context.Context) (aws.Credentials, error) {
		c := &aws.Credentials{
			AccessKeyID:     accessKey,
			SecretAccessKey: secretAccessKey,
			SessionToken:    token,
		}
		return *c, nil
	}
}
```
{% include copy.html %}

To use the default AWS credential chain in this or the Amazon OpenSearch Serverless example, omit the `config.WithCredentialsProvider` option.

## Connecting to Amazon OpenSearch Serverless

In the following example, replace the endpoint with your collection endpoint, which is listed on the collection's details page in the Amazon OpenSearch Service console.

The following example illustrates connecting to Amazon OpenSearch Serverless:

```go
package main

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/opensearch-project/opensearch-go/v5"
	"github.com/opensearch-project/opensearch-go/v5/opensearchapi"
	requestsigner "github.com/opensearch-project/opensearch-go/v5/signer/awsv2"
)

const endpoint = "https://<collection-id>.us-east-1.aoss.amazonaws.com" // OpenSearch Serverless collection endpoint

func main() {
	ctx := context.Background()

	awsCfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion("us-east-1"),
		config.WithCredentialsProvider(
			getCredentialProvider("<AWS_ACCESS_KEY>", "<AWS_SECRET_ACCESS_KEY>", "<AWS_SESSION_TOKEN>"),
		),
	)
	if err != nil {
		log.Fatal(err) // Do not log.Fatal in a production-ready app.
	}

	// Create an AWS request signer for Amazon OpenSearch Serverless.
	signer, err := requestsigner.NewSignerWithService(awsCfg, "aoss")
	if err != nil {
		log.Fatal(err) // Do not log.Fatal in a production-ready app.
	}

	// Create an OpenSearch client that uses the request signer.
	client, err := opensearchapi.NewClient(opensearchapi.Config{
		Client: opensearch.Config{
			Addresses:            []string{endpoint},
			Signer:               signer,
			DiscoverNodesOnStart: new(false),
		},
	})
	if err != nil {
		log.Fatal("client creation err", err)
	}

	_ = client
	// Your code here
}

func getCredentialProvider(accessKey, secretAccessKey, token string) aws.CredentialsProviderFunc {
	return func(ctx context.Context) (aws.Credentials, error) {
		c := &aws.Credentials{
			AccessKeyID:     accessKey,
			SecretAccessKey: secretAccessKey,
			SessionToken:    token,
		}
		return *c, nil
	}
}
```
{% include copy.html %}

Amazon OpenSearch Serverless supports a subset of OpenSearch API operations and does not support the `refresh` parameter used in the examples on this page. For more information, see [Supported operations and plugins in Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-genref.html).
{: .note}

The `opensearchapi.NewClient` constructor takes an `opensearchapi.Config{}` type. Its `Client` field contains an `opensearch.Config{}` type, which can be customized using options such as a list of OpenSearch node addresses or a username and password combination.

To connect to multiple OpenSearch nodes, specify them in the `Addresses` parameter:

```go
var (
	urls = []string{"http://localhost:9200", "http://localhost:9201", "http://localhost:9202"}
)

client, err := opensearchapi.NewClient(opensearchapi.Config{
	Client: opensearch.Config{
		Addresses:            urls,
		DiscoverNodesOnStart: new(false),
	},
})
```
{% include copy.html %}

The Go client retries requests for a maximum of three times by default. To customize the number of retries, set the `MaxRetries` parameter. Additionally, you can change the list of response codes for which a request is retried by setting the `RetryOnStatus` parameter. The following code snippet creates a new Go client with custom `MaxRetries` and `RetryOnStatus` values:

```go
client, err := opensearchapi.NewClient(opensearchapi.Config{
	Client: opensearch.Config{
		Addresses:            []string{"http://localhost:9200"},
		DiscoverNodesOnStart: new(false),
		MaxRetries:           5,
		RetryOnStatus:        []int{502, 503, 504},
	},
})
```
{% include copy.html %}

## Sample data

The examples on this page use a `Student` struct to represent documents. The JSON tags determine the field names in the indexed documents:

```go
type Student struct {
	FirstName string  `json:"firstName"`
	LastName  string  `json:"lastName"`
	GPA       float64 `json:"gpa"`
	GradDate  string  `json:"gradDate"`
}
```
{% include copy.html %}

## Creating an index

The following example creates an index with one primary shard and one replica. It explicitly maps the `gradDate` field as a `date` in the `yyyy-MM-dd` format. OpenSearch maps the other document fields dynamically when you index documents:

```go
ctx := context.Background()
index := "students"
body := `{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "number_of_replicas": 1
    }
  },
  "mappings": {
    "properties": {
      "gradDate": { "type": "date", "format": "yyyy-MM-dd" }
    }
  }
}`
createResp, err := client.Indices.Create(ctx, opensearchapi.IndicesCreateReq{
	Index:      index,
	BodyReader: strings.NewReader(body),
})
```
{% include copy.html %}

## Indexing a document

Index a document using the following code. Setting the `Refresh` parameter to `true` makes the document immediately available for search:

```go
student := Student{FirstName: "John", LastName: "Doe", GPA: 3.89, GradDate: "2022-05-15"}
indexResp, err := client.Doc.Index(ctx, opensearchapi.IndexReq{
	Index:  index,
	ID:     "1",
	Body:   opensearchutil.NewJSONReader(student),
	Params: &opensearchapi.IndexParams{Refresh: "true"},
})
```
{% include copy.html %}

## Bulk indexing

Index multiple documents in a single request using the following code. The request body contains an action line followed by a document line for each document, and each line must end with a newline character:

```go
students := []struct {
	id      string
	student Student
}{
	{"2", Student{FirstName: "Paulo", LastName: "Santos", GPA: 3.93, GradDate: "2021-05-20"}},
	{"3", Student{FirstName: "Shirley", LastName: "Rodriguez", GPA: 3.91, GradDate: "2019-05-10"}},
}
var bulkBody strings.Builder
for _, s := range students {
	doc, err := json.Marshal(s.student)
	if err != nil {
		return err
	}
	fmt.Fprintf(&bulkBody, "{\"index\":{\"_id\":%q}}\n%s\n", s.id, doc)
}
bulkResp, err := client.Doc.Bulk(ctx, opensearchapi.BulkReq{
	Index:  index,
	Body:   strings.NewReader(bulkBody.String()),
	Params: &opensearchapi.BulkParams{Refresh: "true"},
})
```
{% include copy.html %}

If any of the operations fail, the method returns an `*opensearchapi.PartialBulkError` error together with the response. To check the result of each operation, examine the `bulkResp.Items` field.

## Searching for documents

Search for all documents in an index using the following code:

```go
searchResp, err := client.Search(ctx, &opensearchapi.SearchReq{
	Indices: []string{index},
})
if err != nil {
	return err
}
for _, hit := range searchResp.Hits.Hits {
	var s Student
	if err := json.Unmarshal(hit.Source, &s); err != nil {
		return err
	}
	out, err := json.Marshal(s)
	if err != nil {
		return err
	}
	fmt.Println(string(out))
}
```
{% include copy.html %}

In each item in `searchResp.Hits.Hits`, the `ID` field contains a pointer to the document ID, and the `Source` field contains the document as raw JSON. To access the document fields, unmarshal `Source` into a `Student` struct:

```go
for _, hit := range searchResp.Hits.Hits {
	var s Student
	if err := json.Unmarshal(hit.Source, &s); err != nil {
		return err
	}
	fmt.Printf("ID: %s, name: %s %s, GPA: %v, graduation date: %s\n", *hit.ID, s.FirstName, s.LastName, s.GPA, s.GradDate)
}
```
{% include copy.html %}

Search using a range query:

```go
searchResp, err := client.Search(ctx, &opensearchapi.SearchReq{
	Indices:    []string{index},
	BodyReader: strings.NewReader(`{"query": {"range": {"gradDate": {"gte": "2019-01-01", "lte": "2019-12-31"}}}}`),
})
```
{% include copy.html %}

## Paginating results

To paginate results, use the `from` and `size` parameters. The following example sorts students by graduation date and retrieves the results two at a time. The first request returns the first page of results, and the second request returns the next page:

```go
searchResp, err := client.Search(ctx, &opensearchapi.SearchReq{
	Indices: []string{index},
	Params:  &opensearchapi.SearchParams{From: 0, Size: new(2), Sort: []string{"gradDate:asc"}},
})
if err != nil {
	return err
}
nextResp, err := client.Search(ctx, &opensearchapi.SearchReq{
	Indices: []string{index},
	Params:  &opensearchapi.SearchParams{From: 2, Size: new(2), Sort: []string{"gradDate:asc"}},
})
if err != nil {
	return err
}
for i, resp := range []*opensearchapi.SearchResp{searchResp, nextResp} {
	fmt.Printf("Page %d:\n", i+1)
	for _, hit := range resp.Hits.Hits {
		var s Student
		if err := json.Unmarshal(hit.Source, &s); err != nil {
			return err
		}
		out, err := json.Marshal(s)
		if err != nil {
			return err
		}
		fmt.Println("  " + string(out))
	}
}
```
{% include copy.html %}

The `from` and `size` parameters work well for the first pages of results. To paginate through a large number of results, use point in time with `search_after`. For more information, see [Paginate results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/).

## Updating a document

Update specific fields of a document using a partial document in the `doc` field. Only the specified fields are updated:

```go
updateResp, err := client.Doc.Update(ctx, opensearchapi.UpdateReq{
	Index:      index,
	ID:         "1",
	BodyReader: strings.NewReader(`{"doc": {"gpa": 3.92}}`),
})
```
{% include copy.html %}

## Deleting a document

Delete a document using the following code:

```go
deleteResp, err := client.Doc.Delete(ctx, opensearchapi.DeleteReq{
	Index:  index,
	ID:     "3",
	Params: &opensearchapi.DeleteParams{Refresh: "true"},
})
```
{% include copy.html %}

## Deleting an index

Delete an index using the following code:

```go
deleteIndexResp, err := client.Indices.Delete(ctx, &opensearchapi.IndicesDeleteReq{Indices: []string{index}})
```
{% include copy.html %}

## Sample program

This sample program combines the code from the preceding sections. It connects to a cluster that has the Security plugin enabled. To connect to a cluster without the Security plugin, change the lines marked with `// Without security` comments.

This sample program is for testing only. It specifies credentials in code and disables certificate validation so that it can connect to a cluster that uses self-signed certificates. In production, load credentials from a secure location and validate the cluster's certificate.
{: .warning}

The following sample program creates a client, creates an index, indexes documents individually and in bulk, searches for documents, updates a document, deletes a document, and then deletes the index:

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/opensearch-project/opensearch-go/v5"
	"github.com/opensearch-project/opensearch-go/v5/opensearchapi"
	"github.com/opensearch-project/opensearch-go/v5/opensearchutil"
)

type Student struct {
	FirstName string  `json:"firstName"`
	LastName  string  `json:"lastName"`
	GPA       float64 `json:"gpa"`
	GradDate  string  `json:"gradDate"`
}

func main() {
	if err := run(); err != nil {
		fmt.Println("Error:", err)
		os.Exit(1)
	}
}

func run() error {
	ctx := context.Background()

	client, err := opensearchapi.NewClient(opensearchapi.Config{
		Client: opensearch.Config{
			// Without security, use http://localhost:9200
			Addresses: []string{"https://localhost:9200"},
			// Without security, remove this line
			InsecureSkipVerify: true,
			// Without security, remove this line
			Username: "admin",
			// Without security, remove this line
			Password:             "<custom-admin-password>",
			DiscoverNodesOnStart: new(false),
		},
	})
	if err != nil {
		return err
	}

	// Create the index
	index := "students"
	fmt.Println("Creating index......")
	body := `{
	  "settings": {
	    "index": {
	      "number_of_shards": 1,
	      "number_of_replicas": 1
	    }
	  },
	  "mappings": {
	    "properties": {
	      "gradDate": { "type": "date", "format": "yyyy-MM-dd" }
	    }
	  }
	}`
	createResp, err := client.Indices.Create(ctx, opensearchapi.IndicesCreateReq{
		Index:      index,
		BodyReader: strings.NewReader(body),
	})
	if err != nil {
		return err
	}
	fmt.Println("Index created:", createResp.Index)

	// Index a document
	fmt.Println("\nIndexing one student......")
	student := Student{FirstName: "John", LastName: "Doe", GPA: 3.89, GradDate: "2022-05-15"}
	indexResp, err := client.Doc.Index(ctx, opensearchapi.IndexReq{
		Index:  index,
		ID:     "1",
		Body:   opensearchutil.NewJSONReader(student),
		Params: &opensearchapi.IndexParams{Refresh: "true"},
	})
	if err != nil {
		return err
	}
	fmt.Printf("Result: %s, id: %s, version: %d\n", indexResp.Result, indexResp.ID, indexResp.Version)

	// Bulk index documents
	fmt.Println("\nIndexing many students......")
	students := []struct {
		id      string
		student Student
	}{
		{"2", Student{FirstName: "Paulo", LastName: "Santos", GPA: 3.93, GradDate: "2021-05-20"}},
		{"3", Student{FirstName: "Shirley", LastName: "Rodriguez", GPA: 3.91, GradDate: "2019-05-10"}},
	}
	var bulkBody strings.Builder
	for _, s := range students {
		doc, err := json.Marshal(s.student)
		if err != nil {
			return err
		}
		fmt.Fprintf(&bulkBody, "{\"index\":{\"_id\":%q}}\n%s\n", s.id, doc)
	}
	bulkResp, err := client.Doc.Bulk(ctx, opensearchapi.BulkReq{
		Index:  index,
		Body:   strings.NewReader(bulkBody.String()),
		Params: &opensearchapi.BulkParams{Refresh: "true"},
	})
	if err != nil {
		return err
	}
	fmt.Println("Errors:", bulkResp.Errors)
	for _, item := range bulkResp.Items {
		fmt.Printf("  %s id: %s\n", *item.Index.Result, *item.Index.ID)
	}

	// Search for all students
	fmt.Println("\nSearching for all students......")
	searchResp, err := client.Search(ctx, &opensearchapi.SearchReq{
		Indices: []string{index},
		Params:  &opensearchapi.SearchParams{From: 0, Size: new(2), Sort: []string{"gradDate:asc"}},
	})
	if err != nil {
		return err
	}
	total, err := searchResp.Hits.Total.TotalHits()
	if err != nil {
		return err
	}
	fmt.Println("Total hits:", total.Value)
	nextResp, err := client.Search(ctx, &opensearchapi.SearchReq{
		Indices: []string{index},
		Params:  &opensearchapi.SearchParams{From: 2, Size: new(2), Sort: []string{"gradDate:asc"}},
	})
	if err != nil {
		return err
	}
	for i, resp := range []*opensearchapi.SearchResp{searchResp, nextResp} {
		fmt.Printf("Page %d:\n", i+1)
		for _, hit := range resp.Hits.Hits {
			var s Student
			if err := json.Unmarshal(hit.Source, &s); err != nil {
				return err
			}
			out, err := json.Marshal(s)
			if err != nil {
				return err
			}
			fmt.Println("  " + string(out))
		}
	}

	// Search for students who graduated in 2019
	fmt.Println("\nSearching for students who graduated in 2019......")
	searchResp, err = client.Search(ctx, &opensearchapi.SearchReq{
		Indices:    []string{index},
		BodyReader: strings.NewReader(`{"query": {"range": {"gradDate": {"gte": "2019-01-01", "lte": "2019-12-31"}}}}`),
	})
	if err != nil {
		return err
	}
	total, err = searchResp.Hits.Total.TotalHits()
	if err != nil {
		return err
	}
	fmt.Println("Total hits:", total.Value)
	for _, hit := range searchResp.Hits.Hits {
		var s Student
		if err := json.Unmarshal(hit.Source, &s); err != nil {
			return err
		}
		out, err := json.Marshal(s)
		if err != nil {
			return err
		}
		fmt.Println("  " + string(out))
	}

	// Update a document
	fmt.Println("\nUpdating a student's GPA......")
	updateResp, err := client.Doc.Update(ctx, opensearchapi.UpdateReq{
		Index:      index,
		ID:         "1",
		BodyReader: strings.NewReader(`{"doc": {"gpa": 3.92}}`),
	})
	if err != nil {
		return err
	}
	fmt.Printf("Result: %s, version: %d\n", updateResp.Result, updateResp.Version)

	// Get the updated document
	getResp, err := client.Doc.Get(ctx, opensearchapi.GetReq{Index: index, ID: "1"})
	if err != nil {
		return err
	}
	var updated Student
	if err := json.Unmarshal(getResp.Source, &updated); err != nil {
		return err
	}
	out, err := json.Marshal(updated)
	if err != nil {
		return err
	}
	fmt.Println("Updated document: " + string(out))

	// Delete a document
	fmt.Println("\nDeleting a student......")
	deleteResp, err := client.Doc.Delete(ctx, opensearchapi.DeleteReq{
		Index:  index,
		ID:     "3",
		Params: &opensearchapi.DeleteParams{Refresh: "true"},
	})
	if err != nil {
		return err
	}
	fmt.Println("Result:", deleteResp.Result)

	// Delete the index
	fmt.Println("\nDeleting the index......")
	deleteIndexResp, err := client.Indices.Delete(ctx, &opensearchapi.IndicesDeleteReq{Indices: []string{index}})
	if err != nil {
		return err
	}
	fmt.Println("Acknowledged:", deleteIndexResp.Acknowledged)

	return nil
}
```
{% include copy.html %}

The program produces the following output:

```
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
  {"firstName":"Shirley","lastName":"Rodriguez","gpa":3.91,"gradDate":"2019-05-10"}
  {"firstName":"Paulo","lastName":"Santos","gpa":3.93,"gradDate":"2021-05-20"}
Page 2:
  {"firstName":"John","lastName":"Doe","gpa":3.89,"gradDate":"2022-05-15"}

Searching for students who graduated in 2019......
Total hits: 1
  {"firstName":"Shirley","lastName":"Rodriguez","gpa":3.91,"gradDate":"2019-05-10"}

Updating a student's GPA......
Result: updated, version: 2
Updated document: {"firstName":"John","lastName":"Doe","gpa":3.92,"gradDate":"2022-05-15"}

Deleting a student......
Result: deleted

Deleting the index......
Acknowledged: true
```

## Related documentation

- For more examples of using the client, see the [`opensearch-go` user guide](https://github.com/opensearch-project/opensearch-go/blob/main/USER_GUIDE.md).
- For guides to specific tasks, such as bulk indexing and searching, see the [`opensearch-go` guides](https://github.com/opensearch-project/opensearch-go/tree/main/guides).
