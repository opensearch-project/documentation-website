---
layout: default
title: Ruby client
nav_order: 60
has_children: false
---

# Ruby client

The OpenSearch Ruby client allows you to interact with your OpenSearch clusters through Ruby methods rather than HTTP methods and raw JSON. For the client's complete API documentation and additional examples, see the [`opensearch-transport`](https://rubydoc.info/gems/opensearch-transport), [`opensearch-api`](https://rubydoc.info/gems/opensearch-api), [`opensearch-dsl`](https://rubydoc.info/gems/opensearch-dsl), and [`opensearch-ruby`](https://rubydoc.info/gems/opensearch-ruby/) gem documentation.

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [opensearch-ruby repo](https://github.com/opensearch-project/opensearch-ruby).

## Installing the Ruby client

To install the Ruby gem for the Ruby client, run the following command:

```bash
gem install opensearch-ruby
```
{% include copy.html %}

To use the client, import it as a module:

```ruby
require 'opensearch'
```
{% include copy.html %}

## Connecting to OpenSearch

To connect to the default OpenSearch host, create a client object, passing the default host address in the constructor:

```ruby
client = OpenSearch::Client.new(host: 'http://localhost:9200')
```
{% include copy.html %}

The following example creates a client object with a custom URL and the `log` option set to `true`. It sets the `retry_on_failure` parameter to retry a failed request five times rather than the default three times. Finally, it increases the timeout by setting the `request_timeout` parameter to 120 seconds. It then returns the basic cluster health information:

```ruby
client = OpenSearch::Client.new(
    url: "http://localhost:9200",
    retry_on_failure: 5,
    request_timeout: 120,
    log: true
  )

client.cluster.health
```
{% include copy.html %}

The output is as follows:

```bash
2022-08-25 14:24:52 -0400: GET http://localhost:9200/ [status:200, request:0.048s, query:n/a]
2022-08-25 14:24:52 -0400: < {
  "name" : "opensearch",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "Aw0F5Pt9QF6XO9vXQHIs_w",
  "version" : {
    "distribution" : "opensearch",
    "number" : "2.2.0",
    "build_type" : "tar",
    "build_hash" : "b1017fa3b9a1c781d4f34ecee411e0cdf930a515",
    "build_date" : "2022-08-09T02:27:25.256769336Z",
    "build_snapshot" : false,
    "lucene_version" : "9.3.0",
    "minimum_wire_compatibility_version" : "7.10.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "The OpenSearch Project: https://opensearch.org/"
}

2022-08-25 14:24:52 -0400: GET http://localhost:9200/_cluster/health [status:200, request:0.018s, query:n/a]
2022-08-25 14:24:52 -0400: < {"cluster_name":"docker-cluster","status":"yellow","timed_out":false,"number_of_nodes":1,"number_of_data_nodes":1,"discovered_master":true,"discovered_cluster_manager":true,"active_primary_shards":10,"active_shards":10,"relocating_shards":0,"initializing_shards":0,"unassigned_shards":8,"delayed_unassigned_shards":0,"number_of_pending_tasks":0,"number_of_in_flight_fetch":0,"task_max_waiting_in_queue_millis":0,"active_shards_percent_as_number":55.55555555555556}
```

## Connecting to Amazon OpenSearch Service

To connect to Amazon OpenSearch Service, first install the `opensearch-aws-sigv4` gem:

```bash
gem install opensearch-aws-sigv4
```

```ruby
require 'opensearch-aws-sigv4'
require 'aws-sigv4'

signer = Aws::Sigv4::Signer.new(service: 'es',
                                region: 'us-west-2', # signing service region
                                access_key_id: 'key_id',
                                secret_access_key: 'secret')

client = OpenSearch::Aws::Sigv4Client.new({
    host: 'https://your.amz-managed-opensearch.domain',
    log: true
}, signer)

# create an index and document
index = 'prime'
client.indices.create(index: index)
client.index(index: index, id: '1', body: { name: 'Amazon Echo', 
                                            msrp: '5999', 
                                            year: 2011 })

# search for the document
client.search(body: { query: { match: { name: 'Echo' } } })

# delete the document
client.delete(index: index, id: '1')

# delete the index
client.indices.delete(index: index)
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Serverless

To connect to Amazon OpenSearch Serverless Service, first install the `opensearch-aws-sigv4` gem:

```bash
gem install opensearch-aws-sigv4
```

```ruby
require 'opensearch-aws-sigv4'
require 'aws-sigv4'

signer = Aws::Sigv4::Signer.new(service: 'aoss',
                                region: 'us-west-2', # signing service region
                                access_key_id: 'key_id',
                                secret_access_key: 'secret')

client = OpenSearch::Aws::Sigv4Client.new({
    host: 'https://your.amz-managed-opensearch.domain', # serverless endpoint for OpenSearch Serverless
    log: true
}, signer)

# create an index and document
index = 'prime'
client.indices.create(index: index)
client.index(index: index, id: '1', body: { name: 'Amazon Echo', 
                                            msrp: '5999', 
                                            year: 2011 })

# search for the document
client.search(body: { query: { match: { name: 'Echo' } } })

# delete the document
client.delete(index: index, id: '1')

# delete the index
client.indices.delete(index: index)
```
{% include copy.html %}


## Creating an index 

You don't need to create an index explicitly in OpenSearch. Once you upload a document into an index that does not exist, OpenSearch creates the index automatically. Alternatively, you can create an index explicitly to specify settings like the number of primary and replica shards. To create an index with non-default settings, create an index body hash with those settings:

```ruby
index_body = {
    'settings': {
        'index': {
        'number_of_shards': 1,
        'number_of_replicas': 2 
        }
    }
} 

client.indices.create(
    index: 'students',
    body: index_body
)
```
{% include copy.html %}

## Mappings

OpenSearch uses dynamic mapping to infer field types of the documents that are indexed. However, to have more control over the schema of your document, you can pass an explicit mapping to OpenSearch. You can define data types for some or all fields of your document in this mapping. To create a mapping for an index, use the `put_mapping` method:

```ruby
client.indices.put_mapping(
    index: 'students', 
    body: {
        properties: {
            first_name: { type: 'keyword' },
            last_name: { type: 'keyword' }
        }  
    }
)
```
{% include copy.html %}

By default, string fields are mapped as `text`, but in the mapping above, the `first_name` and `last_name` fields are mapped as `keyword`. This mapping signals to OpenSearch that these fields should not be analyzed and should support only full case-sensitive matches.

You can verify the index's mappings using the `get_mapping` method:

```ruby
response = client.indices.get_mapping(index: 'students')
```
{% include copy.html %}

If you know the mapping of your documents in advance and want to avoid mapping errors (for example, misspellings of a field name), you can set the `dynamic` parameter to `strict`:

```ruby
client.indices.put_mapping(
    index: 'students', 
    body: {
        dynamic: 'strict',
        properties: {
            first_name: { type: 'keyword' },
            last_name: { type: 'keyword' },
            gpa: { type: 'float'},
            grad_year: { type: 'integer'}
        }  
    }
)
```
{% include copy.html %}

With strict mapping, you can index a document with a missing field, but you cannot index a document with a new field. For example, indexing the following document with a misspelled `grad_yea` field fails:

```ruby
document = {
    first_name: 'Connor',
    last_name: 'James',
    gpa: 3.93,
    grad_yea: 2021
}
  
client.index(
    index: 'students',
    body: document,
    id: 100,
    refresh: true
)
```
{% include copy.html %}

OpenSearch returns a mapping error:

```bash
{"error":{"root_cause":[{"type":"strict_dynamic_mapping_exception","reason":"mapping set to strict, dynamic introduction of [grad_yea] within [_doc] is not allowed"}],"type":"strict_dynamic_mapping_exception","reason":"mapping set to strict, dynamic introduction of [grad_yea] within [_doc] is not allowed"},"status":400}
```

## Indexing one document

To index one document, use the `index` method:

```ruby
document = {
    first_name: 'Connor',
    last_name: 'James',
    gpa: 3.93,
    grad_year: 2021
}
  
client.index(
    index: 'students',
    body: document,
    id: 100,
    refresh: true
)
```
{% include copy.html %}

## Updating a document

To update a document, use the `update` method:

```ruby
client.update(index: 'students', 
              id: 100, 
              body: { doc: { gpa: 3.25 } }, 
              refresh: true)
```
{% include copy.html %}

## Deleting a document

To delete a document, use the `delete` method:

```ruby
client.delete(
    index: 'students',
    id: 100,
    refresh: true
)
```
{% include copy.html %}

## Bulk operations

You can perform several operations at the same time by using the `bulk` method. The operations may be of the same type or of different types.

You can index multiple documents using the `bulk` method:

```ruby
actions = [
    { index: { _index: 'students', _id: '200' } },
    { first_name: 'James', last_name: 'Rodriguez', gpa: 3.91, grad_year: 2019 },
    { index: { _index: 'students', _id: '300' } },
    { first_name: 'Nikki', last_name: 'Wolf', gpa: 3.87, grad_year: 2020 }
]
client.bulk(body: actions, refresh: true)
```
{% include copy.html %}

You can delete multiple documents as follows:

```ruby
# Deleting multiple documents.
actions = [
    { delete: { _index: 'students', _id: 200 } },
    { delete: { _index: 'students', _id: 300 } }
]
client.bulk(body: actions, refresh: true)
```
{% include copy.html %}

You can perform different operations when using `bulk` as follows:

```ruby
actions = [
    { index:  { _index: 'students', _id: 100, data: { first_name: 'Paulo', last_name: 'Santos', gpa: 3.29, grad_year: 2022 } } },
    { index:  { _index: 'students', _id: 200, data: { first_name: 'Shirley', last_name: 'Rodriguez', gpa: 3.92, grad_year: 2020 } } },
    { index:  { _index: 'students', _id: 300, data: { first_name: 'Akua', last_name: 'Mansa', gpa: 3.95, grad_year: 2022 } } },
    { index:  { _index: 'students', _id: 400, data: { first_name: 'John', last_name: 'Stiles', gpa: 3.72, grad_year: 2019 } } },
    { index:  { _index: 'students', _id: 500, data: { first_name: 'Li', last_name: 'Juan', gpa: 3.94, grad_year: 2022 } } },
    { index:  { _index: 'students', _id: 600, data: { first_name: 'Richard', last_name: 'Roe', gpa: 3.04, grad_year: 2020 } } },
    { update: { _index: 'students', _id: 100, data: { doc: { gpa: 3.73 } } } },
    { delete: { _index: 'students', _id: 200  } }
]
client.bulk(body: actions, refresh: true)
```
{% include copy.html %}

In the above example, you pass the data and the header together and you denote the data with the `data:` key.

## Searching for a document

To search for a document, use the `search` method. The following example searches for a student whose first or last name is "James." It uses a `multi_match` query to search for two fields (`first_name` and `last_name`), and it is boosting the `last_name` field in relevance with a caret notation (`last_name^2`). 

```ruby
q = 'James'
query = {
  'size': 5,
  'query': {
    'multi_match': {
      'query': q,
      'fields': ['first_name', 'last_name^2']
    }
  }
}

response = client.search(
  body: query,
  index: 'students'
)
```
{% include copy.html %}

If you omit the request body in the `search` method, your query becomes a `match_all` query and returns all documents in the index:

```ruby
client.search(index: 'students')
```
{% include copy.html %}

## Boolean query

The Ruby client exposes full OpenSearch query capability. In addition to simple searches that use the match query, you can create a more complex Boolean query to search for students who graduated in 2022 and sort them by last name. In the example below, search is limited to 10 documents.

```ruby
query = {
    'query': {
        'bool': {
        'filter': {
            'term': {
                'grad_year': 2022
                
            }
        }
        }
    },
    'sort': {
        'last_name': {
            'order': 'asc'
        }
    }       
}

response = client.search(index: 'students', from: 0, size: 10, body: query)
```
{% include copy.html %}

## Multi-search

You can bulk several queries together and perform a multi-search using the `msearch` method. The following code searches for students whose GPAs are outside the 3.1&ndash;3.9 range:

```ruby
actions = [
    {},
    {query: {range: {gpa: {gt: 3.9}}}},
    {},
    {query: {range: {gpa: {lt: 3.1}}}}
]
response = client.msearch(index: 'students', body: actions)
```
{% include copy.html %}

## Scroll

You can paginate your search results using the Scroll API:

```ruby
response = client.search(index: index_name, scroll: '2m', size: 2)

while response['hits']['hits'].size.positive?
    scroll_id = response['_scroll_id']
    puts(response['hits']['hits'].map { |doc| [doc['_source']['first_name'] + ' ' + doc['_source']['last_name']] })
    response = client.scroll(scroll: '1m', body: { scroll_id: scroll_id })
end
```
{% include copy.html %}

First, you issue a search query, specifying the `scroll` and `size` parameters. The `scroll` parameter tells OpenSearch how long to keep the search context. In this case, it is set to two minutes. The `size` parameter specifies how many documents you want to return in each request. 

The response to the initial search query contains a `_scroll_id` that you can use to get the next set of documents. To do this, you use the `scroll` method, again specifying the `scroll` parameter and passing the `_scroll_id` in the body. You don't need to specify the query or index to the `scroll` method. The `scroll` method returns the next set of documents and the `_scroll_id`. It's important to use the latest `_scroll_id` when requesting the next batch of documents because `_scroll_id` can change between requests.

## Deleting an index

You can delete the index using the `delete` method:

```ruby
response = client.indices.delete(index: index_name)
```
{% include copy.html %}

## Sample program

The following is a complete sample program that illustrates all of the concepts described in the preceding sections. The Ruby client's methods return responses as Ruby hashes, which are hard to read. To display JSON responses in a pretty format, the sample program uses the `MultiJson.dump` method.

```ruby
require 'opensearch'

client = OpenSearch::Client.new(host: 'http://localhost:9200')

# Create an index with non-default settings
index_name = 'students'
index_body = {
    'settings': {
      'index': {
        'number_of_shards': 1,
        'number_of_replicas': 2 
      }
    }
  } 

client.indices.create(
    index: index_name,
    body: index_body
)

# Create a mapping
client.indices.put_mapping(
    index: index_name, 
    body: {
        properties: {
            first_name: { type: 'keyword' },
            last_name: { type: 'keyword' }
        }  
    }
)

# Get mappings
response = client.indices.get_mapping(index: index_name)
puts 'Mappings for the students index:'
puts MultiJson.dump(response, pretty: "true")

# Add one document to the index
puts 'Adding one document:'
document = {
    first_name: 'Connor',
    last_name: 'James',
    gpa: 3.93,
    grad_year: 2021
}
id = 100
  
client.index(
    index: index_name,
    body: document,
    id: id,
    refresh: true
)
  
response = client.search(index: index_name)
puts MultiJson.dump(response, pretty: "true")
  
# Update a document
puts 'Updating a document:'
client.update(index: index_name, id: id, body: { doc: { gpa: 3.25 } }, refresh: true)
response = client.search(index: index_name)
puts MultiJson.dump(response, pretty: "true")
print 'The updated gpa is '
puts response['hits']['hits'].map { |doc| doc['_source']['gpa'] }

# Add many documents in bulk
documents = [
{ index: { _index: index_name, _id: '200' } },
{ first_name: 'James', last_name: 'Rodriguez', gpa: 3.91, grad_year: 2019},
{ index: { _index: index_name, _id: '300' } },
{ first_name: 'Nikki', last_name: 'Wolf', gpa: 3.87, grad_year: 2020}
]
client.bulk(body: documents, refresh: true)

# Get all documents in the index
response = client.search(index: index_name)
puts 'All documents in the index after bulk upload:'
puts MultiJson.dump(response, pretty: "true")

# Search for a document using a multi_match query
puts 'Searching for documents that match "James":'
q = 'James'
query = {
  'size': 5,
  'query': {
    'multi_match': {
      'query': q,
      'fields': ['first_name', 'last_name^2']
    }
  }
}

response = client.search(
  body: query,
  index: index_name
)
puts MultiJson.dump(response, pretty: "true")

# Delete the document
response = client.delete(
index: index_name,
id: id,
refresh: true
)

response = client.search(index: index_name)
puts 'Documents in the index after one document was deleted:'
puts MultiJson.dump(response, pretty: "true")

# Delete multiple documents
actions = [
    { delete: { _index: index_name, _id: 200 } },
    { delete: { _index: index_name, _id: 300 } }
]
client.bulk(body: actions, refresh: true)

response = client.search(index: index_name)

puts 'Documents in the index after all documents were deleted:'
puts MultiJson.dump(response, pretty: "true")

# Bulk several operations together
actions = [
    { index:  { _index: index_name, _id: 100, data: { first_name: 'Paulo', last_name: 'Santos', gpa: 3.29, grad_year: 2022 } } },
    { index:  { _index: index_name, _id: 200, data: { first_name: 'Shirley', last_name: 'Rodriguez', gpa: 3.92, grad_year: 2020 } } },
    { index:  { _index: index_name, _id: 300, data: { first_name: 'Akua', last_name: 'Mansa', gpa: 3.95, grad_year: 2022 } } },
    { index:  { _index: index_name, _id: 400, data: { first_name: 'John', last_name: 'Stiles', gpa: 3.72, grad_year: 2019 } } },
    { index:  { _index: index_name, _id: 500, data: { first_name: 'Li', last_name: 'Juan', gpa: 3.94, grad_year: 2022 } } },
    { index:  { _index: index_name, _id: 600, data: { first_name: 'Richard', last_name: 'Roe', gpa: 3.04, grad_year: 2020 } } },
    { update: { _index: index_name, _id: 100, data: { doc: { gpa: 3.73 } } } },
    { delete: { _index: index_name, _id: 200  } }
]
client.bulk(body: actions, refresh: true)

puts 'All documents in the index after bulk operations with scrolling:'
response = client.search(index: index_name, scroll: '2m', size: 2)

while response['hits']['hits'].size.positive?
    scroll_id = response['_scroll_id']
    puts(response['hits']['hits'].map { |doc| [doc['_source']['first_name'] + ' ' + doc['_source']['last_name']] })
    response = client.scroll(scroll: '1m', body: { scroll_id: scroll_id })
end

# Multi search
actions = [
    {},
    {query: {range: {gpa: {gt: 3.9}}}},
    {},
    {query: {range: {gpa: {lt: 3.1}}}}
]
response = client.msearch(index: index_name, body: actions)

puts 'Multi search results:'
puts MultiJson.dump(response, pretty: "true")

# Boolean query
query = {
    'query': {
        'bool': {
        'filter': {
            'term': {
                'grad_year': 2022
                
            }
        }
        }
    },
    'sort': {
        'last_name': {
            'order': 'asc'
        }
    }       
}

response = client.search(index: index_name, from: 0, size: 10, body: query)

puts 'Boolean query search results:'
puts MultiJson.dump(response, pretty: "true")

# Delete the index
puts 'Deleting the index:'
response = client.indices.delete(index: index_name)

puts MultiJson.dump(response, pretty: "true")
```
{% include copy.html %}

# Ruby AWS Sigv4 Client

The [opensearch-aws-sigv4](https://github.com/opensearch-project/opensearch-ruby-aws-sigv4) gem provides the `OpenSearch::Aws::Sigv4Client` class, which has all features of `OpenSearch::Client`. The only difference between these two clients is that `OpenSearch::Aws::Sigv4Client` requires an instance of `Aws::Sigv4::Signer` during instantiation to authenticate with AWS:

```ruby
require 'opensearch-aws-sigv4'
require 'aws-sigv4'

signer = Aws::Sigv4::Signer.new(service: 'es',
                                region: 'us-west-2',
                                access_key_id: 'key_id',
                                secret_access_key: 'secret')

client = OpenSearch::Aws::Sigv4Client.new({ log: true }, signer)

client.cluster.health

client.transport.reload_connections!

client.search q: 'test'
```
{% include copy.html %}