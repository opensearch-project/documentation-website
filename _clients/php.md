---
layout: default
title: PHP client
nav_order: 70
---

# PHP client

The OpenSearch PHP client provides a safer and easier way to interact with your OpenSearch cluster. Rather than using OpenSearch from a browser and potentially exposing your data to the public, you can build an OpenSearch client that takes care of sending requests to your cluster. The client contains a library of APIs that let you perform different operations on your cluster and return a standard response body.

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [opensearch-php repo](https://github.com/opensearch-project/opensearch-php).

## Setup

To add the client to your project, install it using [composer](https://getcomposer.org/):

```bash
composer require opensearch-project/opensearch-php
```
{% include copy.html %}

To install a specific major version of the client, run the following command:

```bash
composer require opensearch-project/opensearch-php:<version>
```
{% include copy.html %}

Then require the autload file from composer in your code:

```php
require __DIR__ . '/vendor/autoload.php';
```
{% include copy.html %}

## Connecting to OpenSearch

To connect to the default OpenSearch host, create a client object with the address `https://localhost:9200` if you are using the Security plugin:  

```php
$client = (new \OpenSearch\ClientBuilder())
    ->setHosts(['https://localhost:9200'])
    ->setBasicAuthentication('admin', 'admin') // For testing only. Don't store credentials in code.
    ->setSSLVerification(false) // For testing only. Use certificate for validation
    ->build();
```
{% include copy.html %} 

## Connecting to Amazon OpenSearch Service

The following example illustrates connecting to Amazon OpenSearch Service:

```php
$client = (new \OpenSearch\ClientBuilder())
    ->setSigV4Region('us-east-2')

    ->setSigV4Service('es')
    
    // Default credential provider.
    ->setSigV4CredentialProvider(true)
    
    // Using a custom access key and secret
    ->setSigV4CredentialProvider([
      'key' => 'awskeyid',
      'secret' => 'awssecretkey',
    ])
    
    ->build();
```
{% include copy.html %} 

## Connecting to Amazon OpenSearch Serverless

The following example illustrates connecting to Amazon OpenSearch Serverless Service:

```php
$client = (new \OpenSearch\ClientBuilder())
    ->setSigV4Region('us-east-2')

    ->setSigV4Service('aoss')
    
    // Default credential provider.
    ->setSigV4CredentialProvider(true)
    
    // Using a custom access key and secret
    ->setSigV4CredentialProvider([
      'key' => 'awskeyid',
      'secret' => 'awssecretkey',
    ])
    
    ->build();
```
{% include copy.html %} 


## Creating an index

To create an OpenSearch index with custom settings, use the following code:

```php
$indexName = 'test-index-name';

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
```
{% include copy.html %}

## Indexing a document

You can index a document into OpenSearch using the following code:

```php
$client->create([
    'index' => $indexName,
    'id' => 1,
    'body' => [
        'title' => 'Moneyball',
        'director' => 'Bennett Miller',
        'year' => 2011
    ]
]);
```
{% include copy.html %}

## Searching for documents

The following code uses a `multi_match` query to search for "miller" in the title and director fields. It boosts the documents where "miller" appears in the title field:

```php
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
```
{% include copy.html %}

## Deleting a document

You can delete a document using the following code:

```php
$client->delete([
    'index' => $indexName,
    'id' => 1,
]);
```
{% include copy.html %}

## Deleting an index

You can delete an index using the following code:

```php
$client->indices()->delete([
    'index' => $indexName
]);
```
{% include copy.html %}

## Sample program

The following sample program creates a client, adds an index with non-default settings, inserts a document, searches for the document, deletes the document, and then deletes the index:

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

?>
```
{% include copy.html %}