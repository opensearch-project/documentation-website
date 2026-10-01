---
layout: default
title: PHP client
nav_order: 70
---

# PHP client

The OpenSearch PHP client provides a safer and easier way to interact with your OpenSearch cluster. Rather than using OpenSearch from a browser and potentially exposing your data to the public, you can build an OpenSearch client that takes care of sending requests to your cluster. The client contains a library of APIs that let you perform different operations on your cluster and return a standard response body.

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [`opensearch-php` repo](https://github.com/opensearch-project/opensearch-php).

## Installing the PHP client

The client requires PHP 8.2 or later. To add the client to your project, install it using [Composer](https://getcomposer.org/):

```bash
composer require opensearch-project/opensearch-php
```
{% include copy.html %}

To install a specific version of the client, run the following command:

```bash
composer require opensearch-project/opensearch-php:<version>
```
{% include copy.html %}

The client sends requests through any HTTP client that implements [PSR-18](https://www.php-fig.org/psr/psr-18/), so you must also install one. To use [Guzzle](https://docs.guzzlephp.org/en/stable/), run the following command:

```bash
composer require guzzlehttp/guzzle
```
{% include copy.html %}

To use the [Symfony HTTP client](https://symfony.com/doc/current/http_client.html), run the following command:

```bash
composer require symfony/http-client
```
{% include copy.html %}

Then require the `autoload` file from `composer` in your code:

```php
require __DIR__ . '/vendor/autoload.php';
```
{% include copy.html %}

## Connecting to OpenSearch

Create a client using `GuzzleClientFactory` or `SymfonyClientFactory`. The `base_uri` option is required. The factory passes all other options to the underlying HTTP client. The following code connects to a cluster that does not have the Security plugin enabled:

```php
$client = (new \OpenSearch\GuzzleClientFactory())->create([
    'base_uri' => 'http://localhost:9200',
]);
```
{% include copy.html %}

To connect to a cluster that has the Security plugin enabled, provide credentials and TLS options:

```php
$client = (new \OpenSearch\GuzzleClientFactory())->create([
    'base_uri' => 'https://localhost:9200',
    // Only for demo purposes. Don't specify your credentials in code.
    'auth' => ['admin', '<custom-admin-password>'],
    'verify' => false, // Disables TLS certificate verification. Use only for local development.
]);
```
{% include copy.html %}

The Symfony HTTP client accepts equivalent options:

```php
$client = (new \OpenSearch\SymfonyClientFactory())->create([
    'base_uri' => 'https://localhost:9200',
    // Only for demo purposes. Don't specify your credentials in code.
    'auth_basic' => ['admin', '<custom-admin-password>'],
    'verify_peer' => false, // Disables TLS certificate verification. Use only for local development.
]);
```
{% include copy.html %}

For more information about the supported PSR clients, see [Client factories](https://github.com/opensearch-project/opensearch-php/blob/main/USER_GUIDE.md#client-factories). For more information about basic authentication, see [Basic authentication using a PSR client](https://github.com/opensearch-project/opensearch-php/blob/main/guides/auth.md#using-a-psr-client).

## Connecting to Amazon OpenSearch Service

To sign requests using AWS Identity and Access Management (IAM) credentials, install the AWS SDK for PHP:

```bash
composer require aws/aws-sdk-php
```
{% include copy.html %}

In the following example, replace the endpoint with your domain endpoint, which is listed on the domain's details page in the Amazon OpenSearch Service console.

Then pass the `auth_aws` option when you create the client:

```php
$client = (new \OpenSearch\GuzzleClientFactory())->create([
    'base_uri' => 'https://search-<domain-name>-<id>.us-east-1.es.amazonaws.com',
    'auth_aws' => [
        'region' => 'us-east-1',
        'service' => 'es',
    ],
]);
```
{% include copy.html %}

Because the example does not specify `credentials`, the AWS SDK for PHP resolves credentials using the default credential provider chain. The chain checks environment variables, the shared AWS config and credentials files, and the IAM role of the Amazon EC2 instance or container in which the code runs.

To pass credentials explicitly, add the `credentials` option. Specify `session_token` only when you use temporary credentials:

```php
$client = (new \OpenSearch\GuzzleClientFactory())->create([
    'base_uri' => 'https://search-<domain-name>-<id>.us-east-1.es.amazonaws.com',
    'auth_aws' => [
        'region' => 'us-east-1',
        'service' => 'es',
        'credentials' => [
            'access_key' => getenv('AWS_ACCESS_KEY_ID'),
            'secret_key' => getenv('AWS_SECRET_ACCESS_KEY'),
            'session_token' => getenv('AWS_SESSION_TOKEN'),
        ],
    ],
]);
```
{% include copy.html %}

For more information, see [IAM authentication using a PSR client](https://github.com/opensearch-project/opensearch-php/blob/main/guides/auth.md#using-a-psr-client-1).

## Connecting to Amazon OpenSearch Serverless

In the following example, replace the endpoint with your collection endpoint, which is listed on the collection's details page in the Amazon OpenSearch Service console.

To connect to Amazon OpenSearch Serverless, set `service` to `aoss` and specify your collection endpoint. The following example checks whether an index exists:

```php
$client = (new \OpenSearch\GuzzleClientFactory())->create([
    'base_uri' => 'https://<collection-id>.us-east-1.aoss.amazonaws.com',
    'auth_aws' => [
        'region' => 'us-east-1',
        'service' => 'aoss',
    ],
]);

$exists = $client->indices()->exists(['index' => 'students']);
echo $exists ? 'Index exists' : 'Index does not exist', PHP_EOL;
```
{% include copy.html %}

Amazon OpenSearch Serverless supports a subset of OpenSearch API operations and does not support the `refresh` parameter used in the examples on this page. For more information, see [Supported operations and plugins in Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-genref.html).
{: .note}

## Creating an index

The following example creates an index with one primary shard and one replica. It explicitly maps the `gradDate` field as a `date` in the `yyyy-MM-dd` format. OpenSearch maps the other document fields dynamically when you index documents:

```php
$index = 'students';

$client->indices()->create([
    'index' => $index,
    'body' => [
        'settings' => [
            'index' => [
                'number_of_shards' => 1,
                'number_of_replicas' => 1,
            ],
        ],
        'mappings' => [
            'properties' => [
                'gradDate' => ['type' => 'date', 'format' => 'yyyy-MM-dd'],
            ],
        ],
    ],
]);
```
{% include copy.html %}

## Indexing a document

Index a document using the following code. Set `refresh` to `true` to make the document available for search immediately:

```php
$response = $client->index([
    'index' => $index,
    'id' => '1',
    'body' => [
        'firstName' => 'John',
        'lastName' => 'Doe',
        'gpa' => 3.89,
        'gradDate' => '2022-05-15',
    ],
    'refresh' => true,
]);
```
{% include copy.html %}

To create a document only if its ID does not already exist, use `create()` instead of `index()`. A `create()` request for an existing ID returns a `409` response.

## Bulk indexing

Index multiple documents in a single request using the following code. The request body alternates between an action line and the document to which the action applies:

```php
$response = $client->bulk([
    'body' => [
        ['index' => ['_index' => $index, '_id' => '2']],
        ['firstName' => 'Paulo', 'lastName' => 'Santos', 'gpa' => 3.93, 'gradDate' => '2021-05-20'],
        ['index' => ['_index' => $index, '_id' => '3']],
        ['firstName' => 'Shirley', 'lastName' => 'Rodriguez', 'gpa' => 3.91, 'gradDate' => '2019-05-10'],
    ],
    'refresh' => true,
]);
```
{% include copy.html %}

A bulk request does not throw an exception when an individual action fails, so check the `errors` field of the response and the `items` array for per-action results.

## Searching for documents

Search for all documents in an index using the following code:

```php
$response = $client->search([
    'index' => $index,
]);

foreach ($response['hits']['hits'] as $hit) {
    echo json_encode($hit['_source']) . "\n";
}
```
{% include copy.html %}

Search using a range query:

```php
$response = $client->search([
    'index' => $index,
    'body' => [
        'query' => [
            'range' => [
                'gradDate' => [
                    'gte' => '2019-01-01',
                    'lte' => '2019-12-31',
                ],
            ],
        ],
    ],
]);
```
{% include copy.html %}

To write the query in SQL, use the `sql()` namespace. The response contains a `schema` array describing the columns and a `datarows` array containing the matching rows:

```php
$response = $client->sql()->query([
    'body' => [
        'query' => "SELECT firstName, lastName, gpa FROM $index WHERE gradDate BETWEEN '2019-01-01' AND '2019-12-31'",
    ],
]);
```
{% include copy.html %}

## Paginating results

To paginate results, use the `from` and `size` parameters. The following example sorts students by graduation date and retrieves the results two at a time. The first request returns the first page of results, and the second request returns the next page:

```php
foreach ([0, 2] as $from) {
    $response = $client->search([
        'index' => $index,
        'body' => [
            'from' => $from,
            'size' => 2,
            'sort' => [['gradDate' => 'asc']],
        ],
    ]);

    foreach ($response['hits']['hits'] as $hit) {
        echo json_encode($hit['_source']) . "\n";
    }
}
```
{% include copy.html %}

The `from` and `size` parameters work well for the first pages of results. To paginate through a large number of results, use point in time with `search_after`, as described in [Paginating using a point in time](#paginating-using-a-point-in-time).

### Paginating using a point in time

To paginate through a large number of results or to page through a fixed view of the index, use a point in time (PIT) with `search_after`. Create a PIT, pass its ID in the search body, and use the `sort` values of the last hit as the `search_after` value for the next page:

```php
$response = $client->createPit([
    'index' => $index,
    'keep_alive' => '10m',
]);
$pitId = $response['pit_id'];

// Get the first page of results.
$response = $client->search([
    'body' => [
        'pit' => ['id' => $pitId, 'keep_alive' => '10m'],
        'size' => 2,
        'sort' => [['gradDate' => 'asc']],
    ],
]);
$last = end($response['hits']['hits']);

// Get the next page of results.
$response = $client->search([
    'body' => [
        'pit' => ['id' => $pitId, 'keep_alive' => '10m'],
        'search_after' => $last['sort'],
        'size' => 2,
        'sort' => [['gradDate' => 'asc']],
    ],
]);

// Delete the point in time.
$client->deletePit([
    'body' => ['pit_id' => [$pitId]],
]);
```
{% include copy.html %}

## Updating a document

Update a document by wrapping the changed fields in a `doc` object:

```php
$response = $client->update([
    'index' => $index,
    'id' => '1',
    'body' => [
        'doc' => [
            'gpa' => 3.92,
        ],
    ],
]);
```
{% include copy.html %}

## Deleting a document

Delete a document using the following code:

```php
$response = $client->delete([
    'index' => $index,
    'id' => '3',
    'refresh' => true,
]);
```
{% include copy.html %}

To delete all documents that match a query, use `deleteByQuery()`:

```php
$response = $client->deleteByQuery([
    'index' => $index,
    'body' => [
        'query' => [
            'range' => [
                'gradDate' => [
                    'gte' => '2021-01-01',
                    'lte' => '2021-12-31',
                ],
            ],
        ],
    ],
]);
```
{% include copy.html %}

## Deleting an index

Delete an index using the following code:

```php
$response = $client->indices()->delete([
    'index' => $index,
]);
```
{% include copy.html %}

## Sample program

This sample program combines the code from the preceding sections. It connects to a cluster that has the Security plugin enabled. To connect to a cluster without the Security plugin, change the lines marked with `// Without security` comments.

This sample program is for testing only. It specifies credentials in code and disables certificate validation so that it can connect to a cluster that uses self-signed certificates. In production, load credentials from a secure location and validate the cluster's certificate.
{: .warning}

The following sample program creates a client, creates an index, indexes documents individually and in bulk, searches for documents, updates a document, deletes a document, and then deletes the index:

```php
<?php

require __DIR__ . '/vendor/autoload.php';

$client = (new \OpenSearch\GuzzleClientFactory())->create([
    'base_uri' => 'https://localhost:9200', // Without security, use http://localhost:9200
    'auth' => ['admin', '<custom-admin-password>'], // Without security, remove this line
    'verify' => false, // Without security, remove this line
]);

try {
    // Create the index
    $index = 'students';
    echo "Creating index......\n";
    $response = $client->indices()->create([
        'index' => $index,
        'body' => [
            'settings' => [
                'index' => [
                    'number_of_shards' => 1,
                    'number_of_replicas' => 1,
                ],
            ],
            'mappings' => [
                'properties' => [
                    'gradDate' => ['type' => 'date', 'format' => 'yyyy-MM-dd'],
                ],
            ],
        ],
    ]);
    echo "Index created: {$response['index']}\n";

    // Index a document
    echo "\nIndexing one student......\n";
    $response = $client->index([
        'index' => $index,
        'id' => '1',
        'body' => [
            'firstName' => 'John',
            'lastName' => 'Doe',
            'gpa' => 3.89,
            'gradDate' => '2022-05-15',
        ],
        'refresh' => true,
    ]);
    echo "Result: {$response['result']}, id: {$response['_id']}, version: {$response['_version']}\n";

    // Bulk index documents
    echo "\nIndexing many students......\n";
    $response = $client->bulk([
        'body' => [
            ['index' => ['_index' => $index, '_id' => '2']],
            ['firstName' => 'Paulo', 'lastName' => 'Santos', 'gpa' => 3.93, 'gradDate' => '2021-05-20'],
            ['index' => ['_index' => $index, '_id' => '3']],
            ['firstName' => 'Shirley', 'lastName' => 'Rodriguez', 'gpa' => 3.91, 'gradDate' => '2019-05-10'],
        ],
        'refresh' => true,
    ]);
    echo 'Errors: ' . var_export($response['errors'], true) . "\n";
    foreach ($response['items'] as $item) {
        $action = array_key_first($item);
        echo "  {$item[$action]['result']} id: {$item[$action]['_id']}\n";
    }

    // Search for all students
    echo "\nSearching for all students......\n";
    $response = $client->search([
        'index' => $index,
        'body' => [
            'from' => 0,
            'size' => 2,
            'sort' => [['gradDate' => 'asc']],
        ],
    ]);
    echo "Total hits: {$response['hits']['total']['value']}\n";
    echo "Page 1:\n";
    foreach ($response['hits']['hits'] as $hit) {
        echo '  ' . json_encode($hit['_source']) . "\n";
    }

    $response = $client->search([
        'index' => $index,
        'body' => [
            'from' => 2,
            'size' => 2,
            'sort' => [['gradDate' => 'asc']],
        ],
    ]);
    echo "Page 2:\n";
    foreach ($response['hits']['hits'] as $hit) {
        echo '  ' . json_encode($hit['_source']) . "\n";
    }

    // Search for students who graduated in 2019
    echo "\nSearching for students who graduated in 2019......\n";
    $response = $client->search([
        'index' => $index,
        'body' => [
            'query' => [
                'range' => [
                    'gradDate' => [
                        'gte' => '2019-01-01',
                        'lte' => '2019-12-31',
                    ],
                ],
            ],
        ],
    ]);
    echo "Total hits: {$response['hits']['total']['value']}\n";
    foreach ($response['hits']['hits'] as $hit) {
        echo '  ' . json_encode($hit['_source']) . "\n";
    }

    // Update a document
    echo "\nUpdating a student's GPA......\n";
    $response = $client->update([
        'index' => $index,
        'id' => '1',
        'body' => [
            'doc' => [
                'gpa' => 3.92,
            ],
        ],
    ]);
    echo "Result: {$response['result']}, version: {$response['_version']}\n";

    // Get the updated document
    $response = $client->get([
        'index' => $index,
        'id' => '1',
    ]);
    echo 'Updated document: ' . json_encode($response['_source']) . "\n";

    // Delete a document
    echo "\nDeleting a student......\n";
    $response = $client->delete([
        'index' => $index,
        'id' => '3',
        'refresh' => true,
    ]);
    echo "Result: {$response['result']}\n";

    // Delete the index
    echo "\nDeleting the index......\n";
    $response = $client->indices()->delete([
        'index' => $index,
    ]);
    echo 'Acknowledged: ' . var_export($response['acknowledged'], true) . "\n";
} catch (\OpenSearch\Exception\HttpExceptionInterface $e) {
    echo 'OpenSearch returned an error: ' . $e->getMessage() . "\n";
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

- For more examples of using the client, see the [`opensearch-php` user guide](https://github.com/opensearch-project/opensearch-php/blob/main/USER_GUIDE.md).
- For guides to specific tasks, such as authentication and sending raw requests, see the [`opensearch-php` guides](https://github.com/opensearch-project/opensearch-php/tree/main/guides).
- For complete sample applications, see the [`opensearch-php` samples](https://github.com/opensearch-project/opensearch-php/tree/main/samples).
