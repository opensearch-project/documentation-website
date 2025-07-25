---
layout: default
title: PHP client
nav_order: 90
nav_exclude: true
redirect_to: https://docs.opensearch.org/latest/clients/php/
canonical_url: https://docs.opensearch.org/latest/clients/php/
---

# PHP client

The OpenSearch PHP client provides a safer and easier way to interact with your OpenSearch cluster. Rather than using OpenSearch from the browser and potentially exposing your data to the public, you can build an OpenSearch client that takes care of sending requests to your cluster.

The client contains a library of APIs that let you perform different operations on your cluster and return a standard response body. The example here demonstrates some basic operations like creating an index, adding documents, and searching your data.

## Setup

To add the client to your project, install it using [composer](https://getcomposer.org/):

```bash
composer require opensearch-project/opensearch-php
```

To install a specific major version of the client, run the following command:

```bash
composer require opensearch-project/opensearch-php:<version>
```

Then require the autload file from composer in your code:

```php
require __DIR__ . '/vendor/autoload.php';
```

## Sample code

```php
<?php

require __DIR__ . '/vendor/autoload.php';

$client = (new \OpenSearch\ClientBuilder())
    ->setHosts(['https://localhost:9200'])
    ->setBasicAuthentication('admin', 'admin') // For testing only. Don't store credentials in code.
    ->setSSLVerification(false) // For testing only. Use certificate for validation
    ->build();

$indexName = 'test-index-name';

// Print OpenSearch version information on console.
var_dump($client->info());

// Create an index with non-default settings.
$client->indices()->create([
    'index' => $indexName,
    'body' => [
        'settings' => [
            'index' => [
                'number_of_shards' => 4
            ]
        ]
    ]
]);

$client->create([
    'index' => $indexName,
    'id' => 1,
    'body' => [
        'title' => 'Moneyball',
        'director' => 'Bennett Miller',
        'year' => 2011
    ]
]);

// Search for it
var_dump(
    $client->search([
        'index' => $indexName,
        'body' => [
            'size' => 5,
            'query' => [
                'multi_match' => [
                    'query' => 'miller',
                    'fields' => ['title^2', 'director']
                ]
            ]
        ]
    ])
);

// Delete a single document
$client->delete([
    'index' => $indexName,
    'id' => 1,
]);


// Delete index
$client->indices()->delete([
    'index' => $indexName
]);
```
