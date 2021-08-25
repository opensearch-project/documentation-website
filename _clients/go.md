---
layout: default
title: Go client
nav_order: 80
---

# Go client

<>

## Setup

To add the client to your project, import it like any other module:

```go
go mod init
go get github.com/opensearch-project/opensearch-go
```

### Sample response

```go
go: downloading github.com/opensearch-project/opensearch-go v0.0.0-20210823214927-3567f157dece
go get: added github.com/opensearch-project/opensearch-go v0.0.0-20210823214927-3567f157dece
```

## Sample code

Create a new file called main.go:


```go
package main

import (
	"crypto/tls"
	"fmt"
	"github.com/opensearch-project/opensearch-go"
	"log"
	"net/http"
)

func main () {
	// Instantiate a new OpenSearch client object instance

	client, err := opensearch.NewClient(opensearch.Config{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		},
		Addresses: []string{"https://localhost:9200"},
		Username: "admin", // For testing only. Don't store credentials in code.
		Password: "admin",
	})

// ca_certs_path = '/full/path/to/root-ca.pem' # Provide a CA bundle if you use intermediate CAs with your root CA. Optional client certificates if you don't want to use HTTP basic authentication.
// client_cert_path = '/full/path/to/client.pem'
// client_key_path = '/full/path/to/client-key.pem'

	if err != nil {
		fmt.Println("cannot initialize", err)
	}

// Have the client instance return a response

	log.Println(client.Info())
}
```

```go
$ go run main.go

2021/08/24 23:56:05 [200 OK] {
  "name" : "c825aab1d9cc",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "jsIDR0FTR5qXZr4XkZ-GlA",
  "version" : {
    "distribution" : "opensearch",
    "number" : "1.0.0",
    "build_type" : "tar",
    "build_hash" : "34550c5b17124ddc59458ef774f6b43a086522e3",
    "build_date" : "2021-07-02T23:22:21.383695Z",
    "build_snapshot" : false,
    "lucene_version" : "8.8.2",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "The OpenSearch Project: https://opensearch.org/"
}
 <nil>
```

For all APIs -
https://github.com/opensearch-project/opensearch-go/tree/main/opensearchapi
