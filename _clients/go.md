---
layout: default
title: Go client
nav_order: 50
---

# Go client

The OpenSearch Go client lets you connect your Go application with the data in your OpenSearch cluster. This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client's complete API documentation and additional examples, see the [Go client API documentation](https://pkg.go.dev/github.com/opensearch-project/opensearch-go/v5).

For the client source code, see the [`opensearch-go` repo](https://github.com/opensearch-project/opensearch-go).


## Setup

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
	"github.com/opensearch-project/opensearch-go/v5"
	"github.com/opensearch-project/opensearch-go/v5/opensearchapi"
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

const endpoint = "" // For example, https://search-domain.region.es.amazonaws.com

func main() {
	ctx := context.Background()

	awsCfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion("<AWS_REGION>"),
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

## Connecting to Amazon OpenSearch Serverless

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

const endpoint = "" // For example, https://collection-id.region.aoss.amazonaws.com

func main() {
	ctx := context.Background()

	awsCfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion("<AWS_REGION>"),
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

## Creating an index

To create an OpenSearch index, use the `Indices.Create` method. The following code creates an index with custom settings:

```go
settings := strings.NewReader(`{
	"settings": {
		"index": {
			"number_of_shards": 1,
			"number_of_replicas": 0
		}
	}
}`)

createResp, err := client.Indices.Create(ctx, opensearchapi.IndicesCreateReq{
	Index:      "go-test-index1",
	BodyReader: settings,
})
```
{% include copy.html %}

## Indexing a document

To index a document, use the `Doc.Index` method. Setting the `Refresh` parameter to `true` makes the document immediately available for search:

```go
document := strings.NewReader(`{
	"title": "Moneyball",
	"director": "Bennett Miller",
	"year": "2011"
}`)

indexResp, err := client.Doc.Index(ctx, opensearchapi.IndexReq{
	Index:  "go-test-index1",
	ID:     "1",
	Body:   document,
	Params: &opensearchapi.IndexParams{Refresh: "true"},
})
```
{% include copy.html %}

## Performing bulk operations

To perform several operations in a single request, use the `Doc.Bulk` method. The operations may be of the same type or of different types. Each line of the request body must be a complete JSON object followed by a newline character:

```go
bulkResp, err := client.Doc.Bulk(ctx, opensearchapi.BulkReq{
	Body: strings.NewReader(`{ "index": { "_index": "go-test-index1", "_id": "2" } }
{ "title": "Interstellar", "director": "Christopher Nolan", "year": "2014" }
{ "create": { "_index": "go-test-index1", "_id": "3" } }
{ "title": "Star Trek Beyond", "director": "Justin Lin", "year": "2015" }
{ "update": { "_index": "go-test-index1", "_id": "3" } }
{ "doc": { "year": "2016" } }
`),
	Params: &opensearchapi.BulkParams{Refresh: "true"},
})
```
{% include copy.html %}

If any of the operations fail, the method returns an `*opensearchapi.PartialBulkError` error together with the response. To check the result of each operation, examine the `bulkResp.Items` field.

## Searching for documents

The easiest way to search for documents is to construct a query string. The following code uses a `multi_match` query to search for "miller" in the title and director fields. It boosts the documents where "miller" appears in the title field:

```go
query := strings.NewReader(`{
	"size": 5,
	"query": {
		"multi_match": {
			"query": "miller",
			"fields": ["title^2", "director"]
		}
	}
}`)

searchResp, err := client.Search(ctx, &opensearchapi.SearchReq{
	Indices:    []string{"go-test-index1"},
	BodyReader: query,
})
if err != nil {
	return err
}
for _, hit := range searchResp.Hits.Hits {
	fmt.Printf("Search hit: %s\n", hit.Source)
}
```
{% include copy.html %}

## Updating a document

To update specific fields of a document, use the `Doc.Update` method:

```go
updateResp, err := client.Doc.Update(ctx, opensearchapi.UpdateReq{
	Index:      "go-test-index1",
	ID:         "1",
	BodyReader: strings.NewReader(`{ "doc": { "year": "2012" } }`),
})
```
{% include copy.html %}

## Deleting a document

To delete a document, use the `Doc.Delete` method:

```go
deleteResp, err := client.Doc.Delete(ctx, opensearchapi.DeleteReq{
	Index: "go-test-index1",
	ID:    "1",
})
```
{% include copy.html %}

## Deleting an index

To delete an index, use the `Indices.Delete` method:

```go
deleteIndexResp, err := client.Indices.Delete(ctx, &opensearchapi.IndicesDeleteReq{
	Indices: []string{"go-test-index1"},
})
```
{% include copy.html %}

## Sample program

The following sample program creates a client, creates an index with non-default settings, indexes a document, performs bulk operations, searches for documents, updates a document, deletes a document, and then deletes the index. The program connects to a cluster that does not have the Security plugin enabled. To connect to a cluster that uses the Security plugin, replace the client configuration with the one in [Connecting to OpenSearch](#connecting-to-opensearch):

```go
package main

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/opensearch-project/opensearch-go/v5"
	"github.com/opensearch-project/opensearch-go/v5/opensearchapi"
)

const IndexName = "go-test-index1"

func main() {
	if err := example(); err != nil {
		fmt.Println("Error:", err)
		os.Exit(1)
	}
}

func example() error {
	ctx := context.Background()

	// Initialize the client.
	client, err := opensearchapi.NewClient(opensearchapi.Config{
		Client: opensearch.Config{
			Addresses: []string{"http://localhost:9200"},
			// Send requests only to the listed address.
			DiscoverNodesOnStart: new(false),
		},
	})
	if err != nil {
		return err
	}

	// Print OpenSearch version information.
	infoResp, err := client.Info(ctx, nil)
	if err != nil {
		return err
	}
	fmt.Printf("Connected to %s, version %s\n", infoResp.ClusterName, infoResp.Version.Number)

	// Create an index with non-default settings.
	settings := strings.NewReader(`{
		"settings": {
			"index": {
				"number_of_shards": 1,
				"number_of_replicas": 0
			}
		}
	}`)

	createResp, err := client.Indices.Create(ctx, opensearchapi.IndicesCreateReq{
		Index:      IndexName,
		BodyReader: settings,
	})
	if err != nil {
		return err
	}
	fmt.Printf("Created index: %s\n", createResp.Index)

	// Index a document.
	document := strings.NewReader(`{
		"title": "Moneyball",
		"director": "Bennett Miller",
		"year": "2011"
	}`)

	docID := "1"
	indexResp, err := client.Doc.Index(ctx, opensearchapi.IndexReq{
		Index:  IndexName,
		ID:     docID,
		Body:   document,
		Params: &opensearchapi.IndexParams{Refresh: "true"},
	})
	if err != nil {
		return err
	}
	fmt.Printf("Indexed document: %s, result: %s\n", indexResp.ID, indexResp.Result)

	// Perform bulk operations.
	bulkResp, err := client.Doc.Bulk(ctx, opensearchapi.BulkReq{
		Body: strings.NewReader(`{ "index": { "_index": "go-test-index1", "_id": "2" } }
{ "title": "Interstellar", "director": "Christopher Nolan", "year": "2014" }
{ "create": { "_index": "go-test-index1", "_id": "3" } }
{ "title": "Star Trek Beyond", "director": "Justin Lin", "year": "2015" }
{ "update": { "_index": "go-test-index1", "_id": "3" } }
{ "doc": { "year": "2016" } }
`),
		Params: &opensearchapi.BulkParams{Refresh: "true"},
	})
	if err != nil {
		return err
	}
	fmt.Printf("Bulk operations completed: %d items, errors: %t\n", len(bulkResp.Items), bulkResp.Errors)

	// Search for documents.
	query := strings.NewReader(`{
		"size": 5,
		"query": {
			"multi_match": {
				"query": "miller",
				"fields": ["title^2", "director"]
			}
		}
	}`)

	searchResp, err := client.Search(ctx, &opensearchapi.SearchReq{
		Indices:    []string{IndexName},
		BodyReader: query,
	})
	if err != nil {
		return err
	}
	for _, hit := range searchResp.Hits.Hits {
		fmt.Printf("Search hit: %s\n", hit.Source)
	}

	// Update a document.
	updateResp, err := client.Doc.Update(ctx, opensearchapi.UpdateReq{
		Index:      IndexName,
		ID:         docID,
		BodyReader: strings.NewReader(`{ "doc": { "year": "2012" } }`),
	})
	if err != nil {
		return err
	}
	fmt.Printf("Updated document: %s, result: %s\n", updateResp.ID, updateResp.Result)

	// Delete a document.
	deleteResp, err := client.Doc.Delete(ctx, opensearchapi.DeleteReq{
		Index: IndexName,
		ID:    docID,
	})
	if err != nil {
		return err
	}
	fmt.Printf("Deleted document: %s, result: %s\n", deleteResp.ID, deleteResp.Result)

	// Delete the index.
	deleteIndexResp, err := client.Indices.Delete(ctx, &opensearchapi.IndicesDeleteReq{
		Indices: []string{IndexName},
	})
	if err != nil {
		return err
	}
	fmt.Printf("Deleted index: %t\n", deleteIndexResp.Acknowledged)

	return nil
}
```
{% include copy.html %}
