---
layout: default
title: Go client
nav_order: 80
---

# Go client

The OpenSearch Go client lets you connect your Go application with the data in your OpenSearch cluster.


## Setup

If you're starting a new project, create a new module by running:

```go
go mod init <mymodulename>
```

To add the Go client to your project, import it like any other module:

```go
go get github.com/opensearch-project/opensearch-go
```
## Connecting to OpenSearch

To connect to the default OpenSearch host, create a client object as follows:

```go
client, err := opensearch.NewClient(opensearch.Config{
        Transport: &http.Transport{
            TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
        },
        Addresses: []string{"https://localhost:9200"},
        Username:  "admin", // For testing only. Don't store credentials in code.
        Password:  "admin",
        RetryOnStatus: []int{429, 502, 503, 504},
    })
```

The Go client constructor takes an `opensearch.Config{}` type, which can be customized using options such as a list of OpenSearch node addresses or a username and password combination.

To connect to multiple OpenSearch nodes, specify them in the `Addresses` parameter:

```go
var (
    urls = []string{"http://localhost:9200", "http://localhost:9201", "http://localhost:9202"}
)

client, err := opensearch.NewClient(opensearch.Config{
        Transport: &http.Transport{
            TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
        },
        Addresses: urls,
})
```

The Go client retries requests for a maximum of three times by default. To customize the number of retries, set the `MaxRetries` parameter. Additionally, you can change the list of response codes for which a request is retried by setting the `RetryOnStatus` parameter. 

```go
client, err := opensearch.NewClient(opensearch.Config{
        Transport: &http.Transport{
            TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
        },
        Addresses: []string{"http://localhost:9200"},
        MaxRetries: 5,
        RetryOnStatus: []int{502, 503, 504},
    })
```

## Creating an index

To create an OpenSearch index, use the `IndicesCreateRequest` method. You can construct a JSON object with custom settings as follows:

```go
settings := strings.NewReader(`{
    'settings': {
        'index': {
            'number_of_shards': 1,
            'number_of_replicas': 0
            }
        }
    }`)

res := opensearchapi.IndicesCreateRequest{
    Index: "go-test-index1", 
    Body:  settings,
}
```

## Indexing a document

You can index a document into OpenSearch as follows:

```go
document := strings.NewReader(`{
    "title": "Moneyball",
    "director": "Bennett Miller",
    "year": "2011"
}`)

docId := "1"
req := opensearchapi.IndexRequest{
    Index:      "go-test-index1",
    DocumentID: docId,
    Body:       document,
}
insertResponse, err := req.Do(context.Background(), client)
```

## Performing bulk operations

You can perform several operations at the same time by using the `Bulk` method of the client. The operations may be of the same type or of different types.

```go
blk, err := client.Bulk(
		strings.NewReader(`
    { "index" : { "_index" : "go-test-index1", "_id" : "2" } }
    { "title" : "Interstellar", "director" : "Christopher Nolan", "year" : "2014"}
    { "create" : { "_index" : "go-test-index1", "_id" : "3" } }
    { "title" : "Star Trek Beyond", "director" : "Justin Lin", "year" : "2015"}
    { "update" : {"_id" : "3", "_index" : "go-test-index1" } }
    { "doc" : {"year" : "2016"} }
`),
	)
```

## Searching for documents

The easiest way to search for documents is to construct a query string. The following code uses a `multi_match` query to search for "miller" in the title and director fields. It boosts the documents where "miller" is in the title field. 

```go
content := strings.NewReader(`{
    "size": 5,
    "query": {
        "multi_match": {
        "query": "miller",
        "fields": ["title^2", "director"]
        }
    }
}`)

search := opensearchapi.SearchRequest{
    Index: []string{"go-test-index1"},
    Body: content,
}

searchResponse, err := search.Do(context.Background(), client)
```

## Deleting a document

You can delete a document as follows:

```go
delete := opensearchapi.DeleteRequest{
    Index:      "go-test-index1",
    DocumentID: "1",
}

deleteResponse, err := delete.Do(context.Background(), client)
```

## Deleting an index

You can delete an index as follows:

```go
deleteIndex := opensearchapi.IndicesDeleteRequest{
    Index: []string{"go-test-index1"},
}

deleteIndexResponse, err := deleteIndex.Do(context.Background(), client)
```

## Sample program

This sample program creates a client, adds an index with non-default settings, inserts a document, performs bulk operations, searches for the document, deletes the document, and finally deletes the index:

```go
package main
import (
    "os"
    "context"
    "crypto/tls"
    "fmt"
    opensearch "github.com/opensearch-project/opensearch-go"
    opensearchapi "github.com/opensearch-project/opensearch-go/opensearchapi"
    "net/http"
    "strings"
)
const IndexName = "go-test-index1"
func main() {
    // Initialize the client with SSL/TLS enabled.
    client, err := opensearch.NewClient(opensearch.Config{
        Transport: &http.Transport{
            TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
        },
        Addresses: []string{"https://localhost:9200"},
        Username:  "admin", // For testing only. Don't store credentials in code.
        Password:  "admin",
    })
    if err != nil {
        fmt.Println("cannot initialize", err)
        os.Exit(1)
    }

    // Print OpenSearch version information on console.
    fmt.Println(client.Info())

    // Define index settings.
    settings := strings.NewReader(`{
     'settings': {
       'index': {
            'number_of_shards': 1,
            'number_of_replicas': 2
            }
          }
     }`)

    // Create an index with non-default settings.
    res := opensearchapi.IndicesCreateRequest{
        Index: IndexName, 
        Body:  settings,
    }
    fmt.Println("Creating index")
    fmt.Println(res)

    // Add a document to the index.
    document := strings.NewReader(`{
        "title": "Moneyball",
        "director": "Bennett Miller",
        "year": "2011"
    }`)

    docId := "1"
    req := opensearchapi.IndexRequest{
        Index:      IndexName,
        DocumentID: docId,
        Body:       document,
    }
    insertResponse, err := req.Do(context.Background(), client)
    if err != nil {
        fmt.Println("failed to insert document ", err)
        os.Exit(1)
    }
    fmt.Println("Inserting a document")
    fmt.Println(insertResponse)
   
    // Perform bulk operations.
    blk, err := client.Bulk(
		strings.NewReader(`
    { "index" : { "_index" : "go-test-index1", "_id" : "2" } }
    { "title" : "Interstellar", "director" : "Christopher Nolan", "year" : "2014"}
    { "create" : { "_index" : "go-test-index1", "_id" : "3" } }
    { "title" : "Star Trek Beyond", "director" : "Justin Lin", "year" : "2015"}
    { "update" : {"_id" : "3", "_index" : "go-test-index1" } }
    { "doc" : {"year" : "2016"} }
`),
	)

    if err != nil {
        fmt.Println("failed to perform bulk operations", err)
        os.Exit(1)
    }
    fmt.Println("Performing bulk operations")
    fmt.Println(blk)

    // Search for the document.
    content := strings.NewReader(`{
       "size": 5,
       "query": {
           "multi_match": {
           "query": "miller",
           "fields": ["title^2", "director"]
           }
      }
    }`)

    search := opensearchapi.SearchRequest{
        Index: []string{IndexName},
        Body: content,
    }

    searchResponse, err := search.Do(context.Background(), client)
    if err != nil {
        fmt.Println("failed to search document ", err)
        os.Exit(1)
    }
    fmt.Println("Searching for a document")
    fmt.Println(searchResponse)

    // Delete the document.
    delete := opensearchapi.DeleteRequest{
        Index:      IndexName,
        DocumentID: docId,
    }

    deleteResponse, err := delete.Do(context.Background(), client)
    if err != nil {
        fmt.Println("failed to delete document ", err)
        os.Exit(1)
    }
    fmt.Println("Deleting a document")
    fmt.Println(deleteResponse)

    // Delete the previously created index.
    deleteIndex := opensearchapi.IndicesDeleteRequest{
        Index: []string{IndexName},
    }

    deleteIndexResponse, err := deleteIndex.Do(context.Background(), client)
    if err != nil {
        fmt.Println("failed to delete index ", err)
        os.Exit(1)
    }
    fmt.Println("Deleting the index")
    fmt.Println(deleteIndexResponse)
}
```
