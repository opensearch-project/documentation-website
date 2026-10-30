---
layout: default
title: JavaScript client
has_children: true
has_toc: false
nav_order: 40
redirect_from:
  - /clients/javascript/
---

# JavaScript client

The OpenSearch JavaScript (JS) client provides a safer and easier way to interact with your OpenSearch cluster. Rather than using OpenSearch from the browser and potentially exposing your data to the public, you can build an OpenSearch client that takes care of sending requests to your cluster. For the client's complete API documentation and additional examples, see the [JS client API documentation](https://opensearch-project.github.io/opensearch-js/3.6/index.html).

The client contains a library of APIs that let you perform different operations on your cluster and return a standard response body. The example here demonstrates some basic operations like creating an index, adding documents, and searching your data. 

You can use helper methods to simplify the use of complicated API tasks. For more information, see [Helper methods]({{site.url}}{{site.baseurl}}/clients/javascript/helpers/). For more advanced index actions, see the [`opensearch-js` guides](https://github.com/opensearch-project/opensearch-js/tree/main/guides) in GitHub.  

## Installing the JavaScript client

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

To sign requests using the AWS SDK for JavaScript V3, install the V3 credential provider package:

```bash
npm install @aws-sdk/credential-provider-node
```
{% include copy.html %}

To sign requests using the AWS SDK for JavaScript V2, install the V2 SDK:

```bash
npm install aws-sdk
```
{% include copy.html %}

The AWS SDK for JavaScript V2 reached end of support on September 8, 2025. For new applications, use the AWS SDK for JavaScript V3 examples in this section.
{: .note}

In the following examples, replace the endpoint with your domain or collection endpoint, which is listed on the domain's or collection's details page in the Amazon OpenSearch Service console.

Use the following code to authenticate with AWS V2 SDK:

```javascript
const AWS = require('aws-sdk'); // V2 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const client = new Client({
  ...AwsSigv4Signer({
    region: 'us-east-1',
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
  node: 'https://search-<domain-name>-<id>.us-east-1.es.amazonaws.com', // OpenSearch domain endpoint
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
    region: 'us-east-1',
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
  node: 'https://<collection-id>.us-east-1.aoss.amazonaws.com', // OpenSearch Serverless collection endpoint
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
    // Must return a Promise that resolves to a credentials object containing
    // accessKeyId, secretAccessKey, and, optionally, sessionToken and expiration.
    // This function acquires the credentials when the client starts and
    // when the credentials expire.
    // The client treats the credentials as expired if they are within
    // requestTimeout milliseconds of expiration (the default is 30,000).

    // Example with AWS SDK V3:
    getCredentials: () => {
      // Any other credential provider that returns such a Promise can be used.
      const credentialsProvider = defaultProvider();
      return credentialsProvider();
    },
  }),
  node: 'https://search-<domain-name>-<id>.us-east-1.es.amazonaws.com', // OpenSearch domain endpoint
  // node: 'https://<collection-id>.us-east-1.aoss.amazonaws.com' for an OpenSearch Serverless collection endpoint
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
    // Must return a Promise that resolves to a credentials object containing
    // accessKeyId, secretAccessKey, and, optionally, sessionToken and expiration.
    // This function acquires the credentials when the client starts and
    // when the credentials expire.
    // The client treats the credentials as expired if they are within
    // requestTimeout milliseconds of expiration (the default is 30,000).

    // Example with AWS SDK V3:
    getCredentials: () => {
      // Any other credential provider that returns such a Promise can be used.
      const credentialsProvider = defaultProvider();
      return credentialsProvider();
    },
  }),
  node: 'https://<collection-id>.us-east-1.aoss.amazonaws.com', // OpenSearch Serverless collection endpoint
});
```
{% include copy.html %}

Amazon OpenSearch Serverless supports a subset of OpenSearch API operations and does not support the `refresh` parameter used in the examples on this page. For more information, see [Supported operations and plugins in Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-genref.html).
{: .note}

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
    // Must return a Promise that resolves to a credentials object containing
    // accessKeyId, secretAccessKey, and, optionally, sessionToken and expiration.
    // This function acquires the credentials when the client starts and
    // when the credentials expire.
    // The client treats the credentials as expired if they are within
    // requestTimeout milliseconds of expiration (the default is 30,000).

    // Example with AWS SDK V3:
    getCredentials: () => {
      // Any other credential provider that returns such a Promise can be used.
      const credentialsProvider = defaultProvider();
      return credentialsProvider();
    },
  }),
  node: 'https://search-<domain-name>-<id>.us-east-1.es.amazonaws.com', // OpenSearch domain endpoint
  // node: 'https://<collection-id>.us-east-1.aoss.amazonaws.com' for an OpenSearch Serverless collection endpoint
});

exports.handler = async (event, context) => {
  // Use the already initialized client
  const response = await client.indices.create({
    index: "students",
  });

  return response.body;
};
```
{% include copy.html %}

## Creating an index

The following example creates an index with one primary shard and one replica. It explicitly maps the `gradDate` field as a `date` in the `yyyy-MM-dd` format. OpenSearch maps the other document fields dynamically when you index documents:

```javascript
var index_name = "students";

var response = await client.indices.create({
  index: index_name,
  body: {
    settings: {
      index: {
        number_of_shards: 1,
        number_of_replicas: 1,
      },
    },
    mappings: {
      properties: {
        gradDate: { type: "date", format: "yyyy-MM-dd" },
      },
    },
  },
});
```
{% include copy.html %}

## Indexing a document

Index a document into OpenSearch using the client's `index` method:

```javascript
var student = { firstName: "John", lastName: "Doe", gpa: 3.89, gradDate: "2022-05-15" };

var response = await client.index({
  index: index_name,
  id: "1",
  body: student,
  refresh: true,
});
```
{% include copy.html %}

## Bulk indexing

Index multiple documents in one request using the client's `bulk` method. The request body is an array in which each action is followed by the document that it applies to:

```javascript
var response = await client.bulk({
  body: [
    { index: { _index: index_name, _id: "2" } },
    { firstName: "Paulo", lastName: "Santos", gpa: 3.93, gradDate: "2021-05-20" },
    { index: { _index: index_name, _id: "3" } },
    { firstName: "Shirley", lastName: "Rodriguez", gpa: 3.91, gradDate: "2019-05-10" },
  ],
  refresh: true,
});
```
{% include copy.html %}

To build the request body from an array, a stream, or an async generator, use the [bulk helper]({{site.url}}{{site.baseurl}}/clients/javascript/helpers/#bulk-helper).

## Searching for documents

Search for all documents in an index using the client's `search` method:

```javascript
var response = await client.search({
  index: index_name,
  body: {
    query: {
      match_all: {},
    },
  },
});
response.body.hits.hits.forEach((hit) => console.log(hit._source));
```
{% include copy.html %}

Each item in `response.body.hits.hits` is a plain JavaScript object. The document ID is in the `_id` property, and the document fields are properties of the `_source` object:

```javascript
response.body.hits.hits.forEach((hit) => {
  console.log(
    `ID: ${hit._id}, name: ${hit._source.firstName} ${hit._source.lastName}, GPA: ${hit._source.gpa}, graduation date: ${hit._source.gradDate}`
  );
});
```
{% include copy.html %}

Search using a `range` query:

```javascript
var response = await client.search({
  index: index_name,
  body: {
    query: {
      range: {
        gradDate: {
          gte: "2019-01-01",
          lte: "2019-12-31",
        },
      },
    },
  },
});
```
{% include copy.html %}

## Paginating results

To paginate results, use the `from` and `size` parameters. The following example sorts students by graduation date and retrieves the results two at a time. The first request returns the first page of results, and the second request returns the next page:

```javascript
var response = await client.search({
  index: index_name,
  body: {
    from: 0,
    size: 2,
    sort: [{ gradDate: "asc" }],
  },
});
response.body.hits.hits.forEach((hit) => console.log(hit._source));

var nextPage = await client.search({
  index: index_name,
  body: {
    from: 2,
    size: 2,
    sort: [{ gradDate: "asc" }],
  },
});
nextPage.body.hits.hits.forEach((hit) => console.log(hit._source));
```
{% include copy.html %}

The `from` and `size` parameters work well for the first pages of results. To paginate through a large number of results, use point in time with `search_after`. For more information, see [Paginate results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/).

## Updating a document

Update a document using the client's `update` method. The `doc` object contains only the fields to update:

```javascript
var response = await client.update({
  index: index_name,
  id: "1",
  body: {
    doc: { gpa: 3.92 },
  },
});
```
{% include copy.html %}

## Deleting a document

Delete a document using the client's `delete` method:

```javascript
var response = await client.delete({
  index: index_name,
  id: "3",
  refresh: true,
});
```
{% include copy.html %}

## Deleting an index

Delete an index using the `indices.delete()` method:

```javascript
var response = await client.indices.delete({
  index: index_name,
});
```
{% include copy.html %}

## Sample program

This sample program combines the code from the preceding sections. It connects to a cluster that has the Security plugin enabled. To connect to a cluster without the Security plugin, change the lines marked with `// Without security` comments.

This sample program is for testing only. It specifies credentials in code. In production, load credentials from a secure location.
{: .warning}

The following sample program creates a client, creates an index, indexes documents individually and in bulk, searches for documents, updates a document, deletes a document, and then deletes the index:

```javascript
"use strict";

var host = "localhost";
var protocol = "https"; // Without security, use "http"
var port = 9200;
// Without security, remove the following line
var auth = "admin:<custom-admin-password>";
var ca_certs_path = "/full/path/to/root-ca.pem"; // Without security, remove this line

// Optional client certificates if you don't want to use HTTP basic authentication
// var client_cert_path = '/full/path/to/client.pem'
// var client_key_path = '/full/path/to/client-key.pem'

// Create a client with SSL/TLS enabled
var { Client } = require("@opensearch-project/opensearch");
var fs = require("fs"); // Without security, remove this line
var client = new Client({
  // Without security, use node: protocol + "://" + host + ":" + port,
  node: protocol + "://" + auth + "@" + host + ":" + port,
  ssl: { // Without security, remove the ssl block
    ca: fs.readFileSync(ca_certs_path),
    // You can turn off certificate verification (rejectUnauthorized: false) if you're using
    // self-signed certificates with a hostname mismatch.
    // cert: fs.readFileSync(client_cert_path),
    // key: fs.readFileSync(client_key_path)
  },
});

async function main() {
  // Create the index
  var index_name = "students";
  console.log("Creating index......");
  var response = await client.indices.create({
    index: index_name,
    body: {
      settings: {
        index: {
          number_of_shards: 1,
          number_of_replicas: 1,
        },
      },
      mappings: {
        properties: {
          gradDate: { type: "date", format: "yyyy-MM-dd" },
        },
      },
    },
  });
  console.log("Index created: " + response.body.index);

  // Index a document
  console.log("\nIndexing one student......");
  var student = { firstName: "John", lastName: "Doe", gpa: 3.89, gradDate: "2022-05-15" };
  response = await client.index({
    index: index_name,
    id: "1",
    body: student,
    refresh: true,
  });
  console.log("Result: " + response.body.result + ", id: " + response.body._id + ", version: " + response.body._version);

  // Bulk index documents
  console.log("\nIndexing many students......");
  response = await client.bulk({
    body: [
      { index: { _index: index_name, _id: "2" } },
      { firstName: "Paulo", lastName: "Santos", gpa: 3.93, gradDate: "2021-05-20" },
      { index: { _index: index_name, _id: "3" } },
      { firstName: "Shirley", lastName: "Rodriguez", gpa: 3.91, gradDate: "2019-05-10" },
    ],
    refresh: true,
  });
  console.log("Errors: " + response.body.errors);
  response.body.items.forEach((item) =>
    console.log("  " + item.index.result + " id: " + item.index._id));

  // Search for all students
  console.log("\nSearching for all students......");
  response = await client.search({
    index: index_name,
    body: {
      from: 0,
      size: 2,
      sort: [{ gradDate: "asc" }],
    },
  });
  console.log("Total hits: " + response.body.hits.total.value);
  console.log("Page 1:");
  response.body.hits.hits.forEach((hit) => console.log("  " + JSON.stringify(hit._source)));
  response = await client.search({
    index: index_name,
    body: {
      from: 2,
      size: 2,
      sort: [{ gradDate: "asc" }],
    },
  });
  console.log("Page 2:");
  response.body.hits.hits.forEach((hit) => console.log("  " + JSON.stringify(hit._source)));

  // Search for students who graduated in 2019
  console.log("\nSearching for students who graduated in 2019......");
  response = await client.search({
    index: index_name,
    body: {
      query: {
        range: {
          gradDate: {
            gte: "2019-01-01",
            lte: "2019-12-31",
          },
        },
      },
    },
  });
  console.log("Total hits: " + response.body.hits.total.value);
  response.body.hits.hits.forEach((hit) => console.log("  " + JSON.stringify(hit._source)));

  // Update a document
  console.log("\nUpdating a student's GPA......");
  response = await client.update({
    index: index_name,
    id: "1",
    body: {
      doc: { gpa: 3.92 },
    },
  });
  console.log("Result: " + response.body.result + ", version: " + response.body._version);

  // Get the updated document
  response = await client.get({
    index: index_name,
    id: "1",
  });
  console.log("Updated document: " + JSON.stringify(response.body._source));

  // Delete a document
  console.log("\nDeleting a student......");
  response = await client.delete({
    index: index_name,
    id: "3",
    refresh: true,
  });
  console.log("Result: " + response.body.result);

  // Delete the index
  console.log("\nDeleting the index......");
  response = await client.indices.delete({
    index: index_name,
  });
  console.log("Acknowledged: " + response.body.acknowledged);
}

main().catch(console.log);
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

## Related documentation

- To index, update, and delete documents in bulk using the client's helper method, see [Helper methods]({{site.url}}{{site.baseurl}}/clients/javascript/helpers/).
- For more examples of using the client, see the [`opensearch-js` user guide](https://github.com/opensearch-project/opensearch-js/blob/main/USER_GUIDE.md).
- For guides to specific tasks, such as bulk indexing and searching, see the [`opensearch-js` guides](https://github.com/opensearch-project/opensearch-js/tree/main/guides).
- For complete sample applications, see the [`opensearch-js` samples](https://github.com/opensearch-project/opensearch-js/tree/main/samples).
