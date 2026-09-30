---
layout: default
title: PHP client
nav_order: 70
---

# PHP client

The OpenSearch PHP client provides a safer and easier way to interact with your OpenSearch cluster. Rather than using OpenSearch from a browser and potentially exposing your data to the public, you can build an OpenSearch client that takes care of sending requests to your cluster. The client contains a library of APIs that let you perform different operations on your cluster and return a standard response body.

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [`opensearch-php` repo](https://github.com/opensearch-project/opensearch-php).

## Setup

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
    'auth' => ['admin', getenv('OPENSEARCH_PASSWORD')],
    'verify' => false, // Disables TLS certificate verification. Use only for local development.
]);
```
{% include copy.html %}

The Symfony HTTP client accepts equivalent options:

```php
$client = (new \OpenSearch\SymfonyClientFactory())->create([
    'base_uri' => 'https://localhost:9200',
    'auth_basic' => ['admin', getenv('OPENSEARCH_PASSWORD')],
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

Then pass the `auth_aws` option when you create the client:

```php
$client = (new \OpenSearch\GuzzleClientFactory())->create([
    'base_uri' => 'https://<domain-endpoint>',
    'auth_aws' => [
        'region' => 'us-west-2',
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

To connect to Amazon OpenSearch Serverless, set `service` to `aoss`. If you omit `credentials`, the AWS SDK resolves credentials from the default provider chain. For more information, see [IAM authentication using a PSR client](https://github.com/opensearch-project/opensearch-php/blob/main/guides/auth.md#using-a-psr-client-1).

## Creating an index

Create an index with custom settings using the following code:

```php
$index = 'students';

$client->indices()->create([
    'index' => $index,
    'body' => [
        'settings' => [
            'index' => [
                'number_of_shards' => 1,
                'number_of_replicas' => 0,
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
        'first_name' => 'John',
        'last_name' => 'Doe',
        'gpa' => 3.89,
        'grad_year' => 2022,
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
        ['first_name' => 'Paulo', 'last_name' => 'Santos', 'gpa' => 3.93, 'grad_year' => 2021],
        ['index' => ['_index' => $index, '_id' => '3']],
        ['first_name' => 'Shirley', 'last_name' => 'Rodriguez', 'gpa' => 3.91, 'grad_year' => 2019],
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
    'body' => [
        'query' => [
            'match_all' => (object)[],
        ],
    ],
]);

foreach ($response['hits']['hits'] as $hit) {
    print_r($hit['_source']);
}
```
{% include copy.html %}

Search using a term query:

```php
$response = $client->search([
    'index' => $index,
    'body' => [
        'query' => [
            'term' => [
                'grad_year' => 2019,
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
        'query' => "SELECT first_name, gpa FROM $index WHERE grad_year = 2019",
    ],
]);
```
{% include copy.html %}

## Paginating results using a point in time

To page through a fixed view of the index, create a point in time (PIT), pass its ID in the search body, and use the `sort` values of the last hit as the `search_after` value for the next page:

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
        'query' => ['match_all' => (object)[]],
        'sort' => '_id',
    ],
]);
$last = end($response['hits']['hits']);

// Get the next page of results.
$response = $client->search([
    'body' => [
        'pit' => ['id' => $pitId, 'keep_alive' => '10m'],
        'search_after' => $last['sort'],
        'size' => 2,
        'query' => ['match_all' => (object)[]],
        'sort' => '_id',
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
    'refresh' => true,
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
            'term' => [
                'grad_year' => 2021,
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

The following sample program creates a client, creates an index, indexes documents individually and in bulk, searches for documents, updates a document, deletes a document, and then deletes the index:

```php
<?php

require __DIR__ . '/vendor/autoload.php';

$index = 'students';

$client = (new \OpenSearch\GuzzleClientFactory())->create([
    'base_uri' => 'http://localhost:9200',
]);

try {
    // Print cluster information.
    $info = $client->info();
    echo "Cluster: {$info['cluster_name']}, version: {$info['version']['number']}\n";

    // Create an index.
    $client->indices()->create([
        'index' => $index,
        'body' => [
            'settings' => [
                'index' => [
                    'number_of_shards' => 1,
                    'number_of_replicas' => 0,
                ],
            ],
        ],
    ]);
    echo "Created index $index\n";

    // Index a document.
    echo "\nIndexing one student...\n";
    $response = $client->index([
        'index' => $index,
        'id' => '1',
        'body' => [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'gpa' => 3.89,
            'grad_year' => 2022,
        ],
        'refresh' => true,
    ]);
    echo "Result: {$response['result']}, ID: {$response['_id']}, version: {$response['_version']}\n";

    // Index multiple documents in one request.
    echo "\nIndexing many students...\n";
    $response = $client->bulk([
        'body' => [
            ['index' => ['_index' => $index, '_id' => '2']],
            ['first_name' => 'Paulo', 'last_name' => 'Santos', 'gpa' => 3.93, 'grad_year' => 2021],
            ['index' => ['_index' => $index, '_id' => '3']],
            ['first_name' => 'Shirley', 'last_name' => 'Rodriguez', 'gpa' => 3.91, 'grad_year' => 2019],
        ],
        'refresh' => true,
    ]);
    echo 'Errors: ' . var_export($response['errors'], true) . "\n";
    foreach ($response['items'] as $item) {
        $action = array_key_first($item);
        echo "  {$item[$action]['result']} ID: {$item[$action]['_id']}\n";
    }

    // Search for all students.
    echo "\nSearching for all students...\n";
    $response = $client->search([
        'index' => $index,
        'body' => [
            'query' => [
                'match_all' => (object)[],
            ],
        ],
    ]);
    echo "Total hits: {$response['hits']['total']['value']}\n";
    foreach ($response['hits']['hits'] as $hit) {
        echo '  ' . json_encode($hit['_source']) . "\n";
    }

    // Search for students who graduated in 2019.
    echo "\nSearching for students who graduated in 2019...\n";
    $response = $client->search([
        'index' => $index,
        'body' => [
            'query' => [
                'term' => [
                    'grad_year' => 2019,
                ],
            ],
        ],
    ]);
    echo "Total hits: {$response['hits']['total']['value']}\n";
    foreach ($response['hits']['hits'] as $hit) {
        echo '  ' . json_encode($hit['_source']) . "\n";
    }

    // Update a student's GPA.
    echo "\nUpdating a student's GPA...\n";
    $response = $client->update([
        'index' => $index,
        'id' => '1',
        'body' => [
            'doc' => [
                'gpa' => 3.92,
            ],
        ],
        'refresh' => true,
    ]);
    echo "Result: {$response['result']}, version: {$response['_version']}\n";

    // Get the updated document.
    $response = $client->get([
        'index' => $index,
        'id' => '1',
    ]);
    echo 'Updated document: ' . json_encode($response['_source']) . "\n";

    // Delete a student.
    echo "\nDeleting a student...\n";
    $response = $client->delete([
        'index' => $index,
        'id' => '3',
        'refresh' => true,
    ]);
    echo "Result: {$response['result']}\n";

    // Delete the index.
    echo "\nDeleting the index...\n";
    $response = $client->indices()->delete([
        'index' => $index,
    ]);
    echo 'Acknowledged: ' . var_export($response['acknowledged'], true) . "\n";
} catch (\OpenSearch\Exception\HttpExceptionInterface $e) {
    echo 'OpenSearch returned an error: ' . $e->getMessage() . "\n";
} catch (\Throwable $e) {
    echo 'Uncaught error: ' . $e->getMessage() . "\n";
}
```
{% include copy.html %}

The program produces the following output:

```
Cluster: opensearch-cluster, version: 3.8.0
Created index students

Indexing one student...
Result: created, ID: 1, version: 1

Indexing many students...
Errors: false
  created ID: 2
  created ID: 3

Searching for all students...
Total hits: 3
  {"first_name":"John","last_name":"Doe","gpa":3.89,"grad_year":2022}
  {"first_name":"Paulo","last_name":"Santos","gpa":3.93,"grad_year":2021}
  {"first_name":"Shirley","last_name":"Rodriguez","gpa":3.91,"grad_year":2019}

Searching for students who graduated in 2019...
Total hits: 1
  {"first_name":"Shirley","last_name":"Rodriguez","gpa":3.91,"grad_year":2019}

Updating a student's GPA...
Result: updated, version: 2
Updated document: {"first_name":"John","last_name":"Doe","gpa":3.92,"grad_year":2022}

Deleting a student...
Result: deleted

Deleting the index...
Acknowledged: true
```

## Next steps

- [PHP client main user guide](https://github.com/opensearch-project/opensearch-php/blob/main/USER_GUIDE.md)
- [Other PHP client user guides](https://github.com/opensearch-project/opensearch-php/tree/main/guides)
