---
layout: default
title: JavaScript client
has_children: true
nav_order: 40
---

# Getting started

The OpenSearch JavaScript (JS) client provides a safer and easier way to interact with your OpenSearch cluster. Rather than using OpenSearch from the browser and potentially exposing your data to the public, you can build an OpenSearch client that takes care of sending requests to your cluster.

The client contains a library of APIs that let you perform different operations on your cluster and return a standard response body. The example here demonstrates some basic operations like creating an index, adding documents, and searching your data.

## Setup

To add the client to your project, install it from [npm](https://www.npmjs.com):

```bash
npm install @opensearch-project/opensearch
```

To install a specific major version of the client, run the following command:

```bash
npm install @opensearch-project/opensearch@<version>
```

If you prefer to add the client manually or just want to examine the source code, see [opensearch-js](https://github.com/opensearch-project/opensearch-js) on GitHub.

Then require the client:

```javascript
const { Client } = require("@opensearch-project/opensearch");
```

## Sample code

```javascript
"use strict";

var host = "localhost";
var protocol = "https";
var port = 9200;
var auth = "admin:admin"; // For testing only. Don't store credentials in code.
var ca_certs_path = "/full/path/to/root-ca.pem";

// Optional client certificates if you don't want to use HTTP basic authentication.
// var client_cert_path = '/full/path/to/client.pem'
// var client_key_path = '/full/path/to/client-key.pem'

// Create a client with SSL/TLS enabled.
var { Client } = require("@opensearch-project/opensearch");
var fs = require("fs");
var client = new Client({
  node: protocol + "://" + auth + "@" + host + ":" + port,
  ssl: {
    ca: fs.readFileSync(ca_certs_path),
    // You can turn off certificate verification (rejectUnauthorized: false) if you're using self-signed certificates with a hostname mismatch.
    // cert: fs.readFileSync(client_cert_path),
    // key: fs.readFileSync(client_key_path)
  },
});

async function search() {
  // Create an index with non-default settings.
  var index_name = "books";
  var settings = {
    settings: {
      index: {
        number_of_shards: 4,
        number_of_replicas: 3,
      },
    },
  };

  var response = await client.indices.create({
    index: index_name,
    body: settings,
  });

  console.log("Creating index:");
  console.log(response.body);

  // Add a document to the index.
  var document = {
    title: "The Outsider",
    author: "Stephen King",
    year: "2018",
    genre: "Crime fiction",
  };

  var id = "1";

  var response = await client.index({
    id: id,
    index: index_name,
    body: document,
    refresh: true,
  });

  console.log("Adding document:");
  console.log(response.body);

  // Search for the document.
  var query = {
    query: {
      match: {
        title: {
          query: "The Outsider",
        },
      },
    },
  };

  var response = await client.search({
    index: index_name,
    body: query,
  });

  console.log("Search results:");
  console.log(response.body.hits);

  // Delete the document.
  var response = await client.delete({
    index: index_name,
    id: id,
  });

  console.log("Deleting document:");
  console.log(response.body);

  // Delete the index.
  var response = await client.indices.delete({
    index: index_name,
  });

  console.log("Deleting index:");
  console.log(response.body);
}

search().catch(console.log);
```

## Circuit breaker

The `memoryCircuitBreaker` option can be used to prevent errors caused by a response payload being too large to fit into the heap memory available to the client.

The `memoryCircuitBreaker` object contains two fields:

- `enabled`: A Boolean used to turn the circuit breaker on or off. Defaults to `false`.
- `maxPercentage`: The threshold that determines whether the circuit breaker engages. Valid values are floats in the [0, 1] range that represent percentages in decimal form. Any value that exceeds that range will correct to `1.0`.

The following example instantiates a client with the circuit breaker enabled and its threshold set to 80% of the available heap size limit:

```javascript
var client = new Client({
  memoryCircuitBreaker: {
    enabled: true,
    maxPercentage: 0.8,
  },
});
```
