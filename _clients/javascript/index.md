---
layout: default
title: JavaScript client
has_children: true
nav_order: 40
redirect_from:
  - /clients/javascript/
---

# JavaScript client

The OpenSearch JavaScript (JS) client provides a safer and easier way to interact with your OpenSearch cluster. Rather than using OpenSearch from the browser and potentially exposing your data to the public, you can build an OpenSearch client that takes care of sending requests to your cluster. For the client's complete API documentation and additional examples, see the [JS client API documentation](https://opensearch-project.github.io/opensearch-js/3.6/index.html).

The client contains a library of APIs that let you perform different operations on your cluster and return a standard response body. The example here demonstrates some basic operations like creating an index, adding documents, and searching your data. 

You can use helper methods to simplify the use of complicated API tasks. For more information, see [Helper methods]({{site.url}}{{site.baseurl}}/clients/javascript/helpers/). For more advanced index actions, see the [`opensearch-js` guides](https://github.com/opensearch-project/opensearch-js/tree/main/guides) in GitHub.  

## Setup

The client requires Node.js 14 or later.

To add the client to your project, install it from [`npm`](https://www.npmjs.com):

```bash
npm install @opensearch-project/opensearch
```
{% include copy.html %}

To install a specific version of the client, run the following command:

```bash
npm install @opensearch-project/opensearch@<version>
```
{% include copy.html %}

Do not install versions 3.5.3, 3.6.2, 3.7.0, or 3.8.0. These versions contain malicious code that an external actor published through the project's release infrastructure. For more information and remediation steps, see [GHSA-27f5-xjrr-q9ff](https://github.com/opensearch-project/opensearch-js/security/advisories/GHSA-27f5-xjrr-q9ff).
{: .warning}

If you prefer to add the client manually or only want to examine the source code, see [`opensearch-js`](https://github.com/opensearch-project/opensearch-js) on GitHub.

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
var auth = "admin:<custom-admin-password>"; // For testing only. Don't store credentials in code.
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

If you are not using the Security plugin, create a client object with the address `http://localhost:9200`:

```javascript
var host = "localhost";
var protocol = "http";
var port = 9200;

// Create a client
var { Client } = require("@opensearch-project/opensearch");
var client = new Client({
  node: protocol + "://" + host + ":" + port
});
```
{% include copy.html %}

## Authenticating with Amazon OpenSearch Service: AWS Signature Version 4

The AWS SDK for JavaScript V2 reached end of support on September 8, 2025. For new applications, use the AWS SDK for JavaScript V3 examples in this section.
{: .note}

Use the following code to authenticate with AWS V2 SDK:

```javascript
const AWS = require('aws-sdk'); // V2 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const client = new Client({
  ...AwsSigv4Signer({
    region: 'us-west-2',
    service: 'es',
    // Must return a Promise that resolves to an AWS.Credentials object.
    // This function acquires the credentials when the client starts and
    // when the credentials expire.
    // The client refreshes the credentials only when they expire, using
    // Credentials.refreshPromise when it is available.

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

Use the following code to authenticate with the AWS V2 SDK for Amazon OpenSearch Serverless:

```javascript
const AWS = require('aws-sdk'); // V2 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const client = new Client({
  ...AwsSigv4Signer({
    region: 'us-west-2',
    service: 'aoss',
    // Must return a Promise that resolves to an AWS.Credentials object.
    // This function acquires the credentials when the client starts and
    // when the credentials expire.
    // The client refreshes the credentials only when they expire, using
    // Credentials.refreshPromise when it is available.

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
// Use the aws-v3 import path with the AWS SDK for JavaScript V3. It lazy loads
// only the V3 credential providers.
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws-v3');

const client = new Client({
  ...AwsSigv4Signer({
    region: 'us-east-1',
    service: 'es',  // 'aoss' for OpenSearch Serverless
    // Must return a Promise that resolves to an AWS.Credentials object.
    // This function acquires the credentials when the client starts and
    // when the credentials expire.
    // The client treats the credentials as expired if they are within
    // requestTimeout milliseconds of expiration (the default is 30,000).

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

Use the following code to authenticate with the AWS V3 SDK for Amazon OpenSearch Serverless:

```javascript
const { defaultProvider } = require('@aws-sdk/credential-provider-node'); // V3 SDK.
const { Client } = require('@opensearch-project/opensearch');
// Use the aws-v3 import path with the AWS SDK for JavaScript V3. It lazy loads
// only the V3 credential providers.
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws-v3');

const client = new Client({
  ...AwsSigv4Signer({
    region: 'us-east-1',
    service: 'aoss',
    // Must return a Promise that resolves to an AWS.Credentials object.
    // This function acquires the credentials when the client starts and
    // when the credentials expire.
    // The client treats the credentials as expired if they are within
    // requestTimeout milliseconds of expiration (the default is 30,000).

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

### Authenticating from within an AWS Lambda function

Within an AWS Lambda function, objects declared outside the handler function retain their initialization. For more information, see [Lambda Execution Environment](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html). Thus, you must initialize the OpenSearch client outside of the handler function to ensure the reuse of the original connection in subsequent invocations. This promotes efficiency and eliminates the need to create a new connection each time. 

Initializing the client within the handler function poses a potential risk of encountering a `ConnectionError: getaddrinfo EMFILE error`. This error occurs when multiple connections are created in subsequent invocations, exceeding the system's file descriptor limit.

The following example AWS Lambda function code demonstrates the correct initialization of the OpenSearch client:

```javascript
const { defaultProvider } = require('@aws-sdk/credential-provider-node'); // V3 SDK.
const { Client } = require('@opensearch-project/opensearch');
// Use the aws-v3 import path with the AWS SDK for JavaScript V3. It lazy loads
// only the V3 credential providers.
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws-v3');

const client = new Client({
  ...AwsSigv4Signer({
    region: 'us-east-1',
    service: 'es',  // 'aoss' for OpenSearch Serverless
    // Must return a Promise that resolves to an AWS.Credentials object.
    // This function acquires the credentials when the client starts and
    // when the credentials expire.
    // The client treats the credentials as expired if they are within
    // requestTimeout milliseconds of expiration (the default is 30,000).

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

exports.handler = async (event, context) => {
  const indexName = "books";

  const settings = {
    settings: {
      index: {
        number_of_shards: 4,
        number_of_replicas: 3,
      },
    },
  };

  // Use the already initialized client
  const response = await client.indices.create({
    index: indexName,
    body: settings,
  });

  return response.body;
};
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

Index a document into OpenSearch using the client's `index` method:

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

## Bulk indexing

Index multiple documents in one request using the client's `bulk` method. The request body is an array in which each action is followed by the document that it applies to:

```javascript
var documents = [
  { index: { _index: index_name, _id: "2" } },
  { title: "Fairy Tale", author: "Stephen King", year: "2022", genre: "Fantasy" },
  { index: { _index: index_name, _id: "3" } },
  { title: "The Institute", author: "Stephen King", year: "2019", genre: "Science fiction" },
];

var response = await client.bulk({
  body: documents,
  refresh: true,
});
```
{% include copy.html %}

To build the request body from an array, a stream, or an async generator, use the [bulk helper]({{site.url}}{{site.baseurl}}/clients/javascript/helpers/#bulk-helper).

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

## Updating a document

Update a document using the client's `update` method:

```javascript
var response = await client.update({
  index: index_name,
  id: id,
  body: {
    doc: {
      // Specify the fields and their updated values here
      field1: "new_value1",
      field2: "new_value2",
      // Add more fields as needed
    }
  }
});
```
{% include copy.html %}

For example, the following code updates the `genre` field and adds a `tv_adapted` field to the document specified by `id`:

```javascript
var response = await client.update({
  index: index_name,
  id: id,
  body: {
    doc: {
      genre: "Detective fiction",
      tv_adapted: true
    }
  },
  refresh: true
});
```
{% include copy.html %}

## Deleting a document

Delete a document using the client's `delete` method:

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

The following sample program creates a client, creates an index with non-default settings, indexes documents individually and in bulk, searches for documents, updates a document, deletes a document, and then deletes the index.

### Without security

Use the following sample program when connecting to an OpenSearch cluster that does not have the Security plugin enabled:

```javascript
"use strict";

var host = "localhost";
var protocol = "http";
var port = 9200;

// Create a client
var { Client } = require("@opensearch-project/opensearch");
var client = new Client({
  node: protocol + "://" + host + ":" + port,
});

async function search() {
  // Create an index with non-default settings
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

  // Add a document to the index
  var document = {
    title: "The Outsider",
    author: "Stephen King",
    year: "2018",
    genre: "Crime fiction",
  };

  var id = "1";

  response = await client.index({
    id: id,
    index: index_name,
    body: document,
    refresh: true,
  });

  console.log("Adding document:");
  console.log(response.body);

  // Add multiple documents in one request
  var documents = [
    { index: { _index: index_name, _id: "2" } },
    { title: "Fairy Tale", author: "Stephen King", year: "2022", genre: "Fantasy" },
    { index: { _index: index_name, _id: "3" } },
    { title: "The Institute", author: "Stephen King", year: "2019", genre: "Science fiction" },
  ];

  response = await client.bulk({
    body: documents,
    refresh: true,
  });

  console.log("Bulk indexing documents:");
  console.log(response.body);

  // Search for the documents
  var query = {
    query: {
      match: {
        author: {
          query: "Stephen King",
        },
      },
    },
  };

  response = await client.search({
    index: index_name,
    body: query,
  });

  console.log("Search results:");
  console.log(JSON.stringify(response.body.hits, null, "  "));

  // Update a document
  response = await client.update({
    index: index_name,
    id: id,
    body: {
      doc: {
        genre: "Detective fiction",
        tv_adapted: true,
      },
    },
    refresh: true,
  });

  console.log("Updating document:");
  console.log(response.body);

  // Delete a document
  response = await client.delete({
    index: index_name,
    id: id,
  });

  console.log("Deleting document:");
  console.log(response.body);

  // Delete the index
  response = await client.indices.delete({
    index: index_name,
  });

  console.log("Deleting index:");
  console.log(response.body);
}

search().catch(console.log);
```
{% include copy.html %}

### With security

Use the following sample program when connecting to an OpenSearch cluster that has the Security plugin enabled. Change the credentials and the root certificate path to match your cluster configuration:

```javascript
"use strict";

var host = "localhost";
var protocol = "https";
var port = 9200;
var auth = "admin:<custom-admin-password>"; // For testing only. Don't store credentials in code.
var ca_certs_path = "/full/path/to/root-ca.pem";

// Optional client certificates if you don't want to use HTTP basic authentication
// var client_cert_path = '/full/path/to/client.pem'
// var client_key_path = '/full/path/to/client-key.pem'

// Create a client with SSL/TLS enabled
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
  // Create an index with non-default settings
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

  // Add a document to the index
  var document = {
    title: "The Outsider",
    author: "Stephen King",
    year: "2018",
    genre: "Crime fiction",
  };

  var id = "1";

  response = await client.index({
    id: id,
    index: index_name,
    body: document,
    refresh: true,
  });

  console.log("Adding document:");
  console.log(response.body);

  // Add multiple documents in one request
  var documents = [
    { index: { _index: index_name, _id: "2" } },
    { title: "Fairy Tale", author: "Stephen King", year: "2022", genre: "Fantasy" },
    { index: { _index: index_name, _id: "3" } },
    { title: "The Institute", author: "Stephen King", year: "2019", genre: "Science fiction" },
  ];

  response = await client.bulk({
    body: documents,
    refresh: true,
  });

  console.log("Bulk indexing documents:");
  console.log(response.body);

  // Search for the documents
  var query = {
    query: {
      match: {
        author: {
          query: "Stephen King",
        },
      },
    },
  };

  response = await client.search({
    index: index_name,
    body: query,
  });

  console.log("Search results:");
  console.log(JSON.stringify(response.body.hits, null, "  "));

  // Update a document
  response = await client.update({
    index: index_name,
    id: id,
    body: {
      doc: {
        genre: "Detective fiction",
        tv_adapted: true,
      },
    },
    refresh: true,
  });

  console.log("Updating document:");
  console.log(response.body);

  // Delete a document
  response = await client.delete({
    index: index_name,
    id: id,
  });

  console.log("Deleting document:");
  console.log(response.body);

  // Delete the index
  response = await client.indices.delete({
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
