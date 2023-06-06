---
layout: default
title: JavaScript client
has_children: true
nav_order: 40
redirect_from:
  - /clients/javascript/
---

# JavaScript client

The OpenSearch JavaScript (JS) client provides a safer and easier way to interact with your OpenSearch cluster. Rather than using OpenSearch from the browser and potentially exposing your data to the public, you can build an OpenSearch client that takes care of sending requests to your cluster. For the client's complete API documentation and additional examples, see the [JS client API documentation](https://opensearch-project.github.io/opensearch-js/2.2/index.html).

The client contains a library of APIs that let you perform different operations on your cluster and return a standard response body. The example here demonstrates some basic operations like creating an index, adding documents, and searching your data. 

You can use helper methods to simplify the use of complicated API tasks. For more information, see [Helper methods]({{site.url}}{{site.baseurl}}/clients/javascript/helpers/). For more advanced index actions, see the [`opensearch-js` guides](https://github.com/opensearch-project/opensearch-js/tree/main/guides) in GitHub.  

## Setup

To add the client to your project, install it from [npm](https://www.npmjs.com):

```bash
npm install @opensearch-project/opensearch
```
{% include copy.html %}

To install a specific major version of the client, run the following command:

```bash
npm install @opensearch-project/opensearch@<version>
```
{% include copy.html %}

If you prefer to add the client manually or just want to examine the source code, see [opensearch-js](https://github.com/opensearch-project/opensearch-js) on GitHub.

Then require the client:

```javascript
const { Client } = require("@opensearch-project/opensearch");
```
{% include copy.html %}

## Connecting to OpenSearch

To connect to the default OpenSearch host, create a client object with the address `https://localhost:9200` if you are using the Security plugin:  

```javascript
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
    // You can turn off certificate verification (rejectUnauthorized: false) if you're using 
    // self-signed certificates with a hostname mismatch.
    // cert: fs.readFileSync(client_cert_path),
    // key: fs.readFileSync(client_key_path)
  },
});
```
{% include copy.html %}

## Authenticating with Amazon OpenSearch Service – AWS Sigv4

Use the following code to authenticate with AWS V2 SDK:

```javascript
const AWS = require('aws-sdk'); // V2 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const client = new Client({
  ...AwsSigv4Signer({
    region: 'us-west-2',
    service: 'es',
    // Must return a Promise that resolve to an AWS.Credentials object.
    // This function is used to acquire the credentials when the client start and
    // when the credentials are expired.
    // The Client will refresh the Credentials only when they are expired.
    // With AWS SDK V2, Credentials.refreshPromise is used when available to refresh the credentials.

    // Example with AWS SDK V2:
    getCredentials: () =>
      new Promise((resolve, reject) => {
        // Any other method to acquire a new Credentials object can be used.
        AWS.config.getCredentials((err, credentials) => {
          if (err) {
            reject(err);
          } else {
            resolve(credentials);
          }
        });
      }),
  }),
  node: 'https://search-xxx.region.es.amazonaws.com', // OpenSearch domain URL
});
```
{% include copy.html %}

AWS V2 SDK for Amazon OpenSearch Serverless

```javascript
const AWS = require('aws-sdk'); // V2 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const client = new Client({
  ...AwsSigv4Signer({
    region: 'us-west-2',
    service: 'aoss',
    // Must return a Promise that resolve to an AWS.Credentials object.
    // This function is used to acquire the credentials when the client start and
    // when the credentials are expired.
    // The Client will refresh the Credentials only when they are expired.
    // With AWS SDK V2, Credentials.refreshPromise is used when available to refresh the credentials.

    // Example with AWS SDK V2:
    getCredentials: () =>
      new Promise((resolve, reject) => {
        // Any other method to acquire a new Credentials object can be used.
        AWS.config.getCredentials((err, credentials) => {
          if (err) {
            reject(err);
          } else {
            resolve(credentials);
          }
        });
      }),
  }),
  node: "https://xxx.region.aoss.amazonaws.com" // OpenSearch domain URL
});
```
{% include copy.html %}

Use the following code to authenticate with AWS V3 SDK:

```javascript
const { defaultProvider } = require('@aws-sdk/credential-provider-node'); // V3 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const client = new Client({
  ...AwsSigv4Signer({
    region: 'us-east-1',
    service: 'es',  // 'aoss' for OpenSearch Serverless
    // Must return a Promise that resolve to an AWS.Credentials object.
    // This function is used to acquire the credentials when the client start and
    // when the credentials are expired.
    // The Client will refresh the Credentials only when they are expired.
    // With AWS SDK V2, Credentials.refreshPromise is used when available to refresh the credentials.

    // Example with AWS SDK V3:
    getCredentials: () => {
      // Any other method to acquire a new Credentials object can be used.
      const credentialsProvider = defaultProvider();
      return credentialsProvider();
    },
  }),
  node: 'https://search-xxx.region.es.amazonaws.com', // OpenSearch domain URL
  // node: "https://xxx.region.aoss.amazonaws.com" for OpenSearch Serverless
});
```
{% include copy.html %}

AWS V3 SDK for Amazon OpenSearch Serverless

```javascript
const { defaultProvider } = require('@aws-sdk/credential-provider-node'); // V3 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const client = new Client({
  ...AwsSigv4Signer({
    region: 'us-east-1',
    service: 'aoss',
    // Must return a Promise that resolve to an AWS.Credentials object.
    // This function is used to acquire the credentials when the client start and
    // when the credentials are expired.
    // The Client will refresh the Credentials only when they are expired.
    // With AWS SDK V2, Credentials.refreshPromise is used when available to refresh the credentials.

    // Example with AWS SDK V3:
    getCredentials: () => {
      // Any other method to acquire a new Credentials object can be used.
      const credentialsProvider = defaultProvider();
      return credentialsProvider();
    },
  }),
  node: "https://xxx.region.aoss.amazonaws.com" // OpenSearch domain URL
});
```
{% include copy.html %}

## Creating an index

To create an OpenSearch index, use the `indices.create()` method. You can use the following code to construct a JSON object with custom settings:

```javascript
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
```
{% include copy.html %}

## Indexing a document

You can index a document into OpenSearch using the client's `index` method:

```javascript
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
```
{% include copy.html %}

## Searching for documents

The easiest way to search for documents is to construct a query string. The following code uses a `match` query to search for "The Outsider" in the title field:

```javascript
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
```
{% include copy.html %}

## Deleting a document

You can delete a document using the client's `delete` method:

```javascript
var response = await client.delete({
  index: index_name,
  id: id,
});
```
{% include copy.html %}

## Deleting an index

You can delete an index using the `indices.delete()` method:

```javascript
var response = await client.indices.delete({
  index: index_name,
});
```
{% include copy.html %}

## Sample program

The following sample program creates a client, adds an index with non-default settings, inserts a document, searches for the document, deletes the document, and then deletes the index:

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
    // You can turn off certificate verification (rejectUnauthorized: false) if you're using 
    // self-signed certificates with a hostname mismatch.
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
{% include copy.html %}
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
{% include copy.html %}