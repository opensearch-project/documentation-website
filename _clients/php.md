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

Use a PSR client to connect to OpenSearch. For information about the supported PSR clients, see [Client factories](https://github.com/opensearch-project/opensearch-php/blob/main/USER_GUIDE.md#client-factories). For information about basic authentication using PSR clients, see [Basic authentication using a PSR client](https://github.com/opensearch-project/opensearch-php/blob/main/guides/auth.md#using-a-psr-client).

## Connecting to Amazon OpenSearch Service

For information about connecting to Amazon OpenSearch Service, see [IAM authentication using a PSR client](https://github.com/opensearch-project/opensearch-php/blob/main/guides/auth.md#using-a-psr-client-1).


## Creating an index

To create an OpenSearch index with custom settings, use the following code:

```php
public function createIndex()
{
    $this->client->indices()->create([
        'index' => INDEX_NAME,
        'body' => [
            'settings' => [
                'index' => [
                    'number_of_shards' => 4
                ]
            ]
        ]
    ]);
}
```
{% include copy.html %}

## Indexing a document

You can index a document into OpenSearch using the following code:

```php
public function create()
{
    $time = time();
    $this->existingID = $time;
    $this->deleteID = $time . '_uniq';


    // Create a document passing the id
    $this->client->create([
        'id' => $time,
        'index' => INDEX_NAME,
        'body' => $this->getData($time)
    ]);

    // Create a document passing the id
    $this->client->create([
        'id' => $this->deleteID,
        'index' => INDEX_NAME,
        'body' => $this->getData($time)
    ]);

    // Create a document without passing the id (will be generated automatically)
    $this->client->create([
        'index' => INDEX_NAME,
        'body' => $this->getData($time + 1)
    ]);
}
```
{% include copy.html %}

## Searching for documents

The following code uses a `multi_match` query to search for "miller" in the title and director fields. It boosts the documents where "miller" appears in the title field:

```php
public function search()
{
    $docs = $this->client->search([
        //index to search in or '_all' for all indices
        'index' => INDEX_NAME,
        'size' => 1000,
        'body' => [
            'query' => [
                'prefix' => [
                    'name' => 'wrecking'
                ]
            ]
        ]
    ]);
    var_dump($docs['hits']['total']['value'] > 0);

    // Search for it
    $docs = $this->client->search([
        'index' => INDEX_NAME,
        'body' => [
            'size' => 5,
            'query' => [
                'multi_match' => [
                    'query' => 'miller',
                    'fields' => ['title^2', 'director']
                ]
            ]
        ]
    ]);
    var_dump($docs['hits']['total']['value'] > 0);
}
```
{% include copy.html %}

## Deleting a document

You can delete a document using the following code:

```php
public function deleteByID()
{
    $this->client->delete([
        'id' => $this->deleteID,
        'index' => INDEX_NAME,
    ]);
}
```
{% include copy.html %}

## Deleting an index

You can delete an index using the following code:

```php
public function deleteByIndex()
{
    $this->client->indices()->delete([
        'index' => INDEX_NAME
    ]);
}
```
{% include copy.html %}

## Sample program

The following sample program creates a client and performs various OpenSearch operations:

```php
<?php
require __DIR__ . '/vendor/autoload.php';

define('INDEX_NAME', 'test_elastic_index_name2');

class MyOpenSearchClass
{

    protected ?\OpenSearch\Client $client;
    protected $existingID = 1668504743;
    protected $deleteID = 1668504743;
    protected $bulkIds = [];


    public function __construct()
    {
        // Simple Setup
        $this->client = (new \OpenSearch\GuzzleClientFactory())->create([
            'base_uri' => 'https://localhost:9200',
            'auth' => ['admin', getenv('OPENSEARCH_PASSWORD')],
            'verify' => false, // Disables SSL verification for local development.
        ]);
    }


    // Create an index with non-default settings.
    public function createIndex()
    {
        $this->client->indices()->create([
            'index' => INDEX_NAME,
            'body' => [
                'settings' => [
                    'index' => [
                        'number_of_shards' => 4
                    ]
                ]
            ]
        ]);
    }

    public function info()
    {
        // Print OpenSearch version information on console.
        var_dump($this->client->info());
    }

    // Create a document
    public function create()
    {
        $time = time();
        $this->existingID = $time;
        $this->deleteID = $time . '_uniq';


        // Create a document passing the id
        $this->client->create([
            'id' => $time,
            'index' => INDEX_NAME,
            'body' => $this->getData($time)
        ]);

        // Create a document passing the id
        $this->client->create([
            'id' => $this->deleteID,
            'index' => INDEX_NAME,
            'body' => $this->getData($time)
        ]);

        // Create a document without passing the id (will be generated automatically)
        $this->client->create([
            'index' => INDEX_NAME,
            'body' => $this->getData($time + 1)
        ]);

        //This should throw an exception because ID already exists
        // $this->client->create([
        //     'id' => $this->existingID,
        //     'index' => INDEX_NAME,
        //     'body' => $this->getData($this->existingID)
        // ]);
    }

    public function update()
    {
        $this->client->update([
            'id' => $this->existingID,
            'index' => INDEX_NAME,
            'body' => [
                //data must be wrapped in 'doc' object
                'doc' => ['name' => 'updated']
            ]
        ]);
    }

    public function bulk()
    {
        $bulkData = [];
        $time = time();
        for ($i = 0; $i < 20; $i++) {
            $id = ($time + $i) . rand(10, 200);
            $bulkData[] = [
                'index' => [
                    '_index' => INDEX_NAME,
                    '_id' => $id,
                ]
            ];
            $this->bulkIds[] = $id;
            $bulkData[] = $this->getData($time + $i);
        }
        //will not throw exception! check $response for error
        $response = $this->client->bulk([
            //default index
            'index' => INDEX_NAME,
            'body' => $bulkData
        ]);

        //give elastic a little time to create before update
        sleep(2);

        // bulk update
        for ($i = 0; $i < 15; $i++) {
            $bulkData[] = [
                'update' => [
                    '_index' => INDEX_NAME,
                    '_id' => $this->bulkIds[$i],
                ]
            ];
            $bulkData[] = [
                'doc' => [
                    'name' => 'bulk updated'
                ]
            ];
        }

        //will not throw exception! check $response for error
        $response = $this->client->bulk([
            //default index
            'index' => INDEX_NAME,
            'body' => $bulkData
        ]);
    }
    public function deleteByQuery(string $query)
    {
        if ($query == '') {
            return;
        }
        $this->client->deleteByQuery([
            'index' => INDEX_NAME,
            'q' => $query
        ]);
    }

    // Delete a single document
    public function deleteByID()
    {
        $this->client->delete([
            'id' => $this->deleteID,
            'index' => INDEX_NAME,
        ]);
    }

    public function search()
    {
        $docs = $this->client->search([
            //index to search in or '_all' for all indices
            'index' => INDEX_NAME,
            'size' => 1000,
            'body' => [
                'query' => [
                    'prefix' => [
                        'name' => 'wrecking'
                    ]
                ]
            ]
        ]);
        var_dump($docs['hits']['total']['value'] > 0);

        // Search for it
        $docs = $this->client->search([
            'index' => INDEX_NAME,
            'body' => [
                'size' => 5,
                'query' => [
                    'multi_match' => [
                        'query' => 'miller',
                        'fields' => ['title^2', 'director']
                    ]
                ]
            ]
        ]);
        var_dump($docs['hits']['total']['value'] > 0);
    }

    // Write queries in SQL
    public function searchUsingSQL()
    {
        $docs = $this->client->sql()->query([
          'query' => "SELECT * FROM " . INDEX_NAME . " WHERE name = 'wrecking'",
          'format' => 'json'
        ]);
        var_dump($docs['hits']['total']['value'] > 0);
    }

    public function getMultipleDocsByIDs()
    {
        $docs = $this->client->search([
            //index to search in or '_all' for all indices
            'index' => INDEX_NAME,
            'body' => [
                'query' => [
                    'ids' => [
                        'values' => $this->bulkIds
                    ]
                ]
            ]
        ]);
        var_dump($docs['hits']['total']['value'] > 0);
    }

    public function getOneByID()
    {
        $docs = $this->client->search([
            //index to search in or '_all' for all indices
            'index' => INDEX_NAME,
            'size' => 1,
            'body' => [
                'query' => [
                    'bool' => [
                        'filter' => [
                            'term' => [
                                '_id' => $this->existingID
                            ]
                        ]
                    ]
                ]
            ]
        ]);
        var_dump($docs['hits']['total']['value'] > 0);
    }

    public function searchByPointInTime()
    {
        $result = $this->client->createPointInTime([
            'index' => INDEX_NAME,
            'keep_alive' => '10m'
        ]);
        $pitId = $result['pit_id'];

        // Get first page of results in Point-in-Time
        $result = $this->client->search([
            'body' => [
                'pit' => [
                    'id' => $pitId,
                    'keep_alive' => '10m',
                ],
                'size' => 10, // normally you would do 10000
                'query' => [
                    'match_all' => (object)[]
                ],
                'sort' => '_id',
            ]
        ]);
        var_dump($result['hits']['total']['value'] > 0);

        $last = end($result['hits']['hits']);
        $lastSort = $last['sort'] ?? null;

        // Get next page of results in Point-in-Time
        $result = $this->client->search([
            'body' => [
                'pit' => [
                    'id' => $pitId,
                    'keep_alive' => '10m',
                ],
                'search_after' => $lastSort,
                'size' => 10, // normally you would do 10000
                'query' => [
                    'match_all' => (object)[]
                ],
                'sort' => '_id',
            ]
        ]);
        var_dump($result['hits']['total']['value'] > 0);

        // Close Point-in-Time
        $result = $this->client->deletePointInTime([
            'body' => [
              'pit_id' => $pitId,
            ]
        ]);
        var_dump($result['pits'][0]['successful']);
    }

    // Delete index
    public function deleteByIndex()
    {
        $this->client->indices()->delete([
            'index' => INDEX_NAME
        ]);
    }

    //simple data to index
    public function getData($time = -1)
    {
        if ($time == -1) {
            $time = time();
        }
        return [
            'name' => date('c', $time) . " - i came in like a wrecking ball",
            'time' => $time,
            'date' => date('c', $time)
        ];
    }
}

try {

    $e = new MyOpenSearchClass();
    $e->info();
    $e->createIndex();
    $e->create();
    //give elastic a little time to create before update
    sleep(2);
    $e->update();
    $e->bulk();
    $e->getOneByID();
    $e->getMultipleDocsByIDs();
    $e->search();
    $e->searchUsingSQL();
    $e->searchByPointInTime();
    $e->deleteByQuery('');
    $e->deleteByID();
    $e->deleteByIndex();
} catch (\Throwable $th) {
    echo 'uncaught error ' . $th->getMessage() . "\n";
}

```
{% include copy.html %}

## Next steps

- [PHP client main user guide](https://github.com/opensearch-project/opensearch-php/blob/main/USER_GUIDE.md)
- [Other PHP client user guides](https://github.com/opensearch-project/opensearch-php/tree/main/guides)