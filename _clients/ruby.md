---
layout: default
title: Ruby client
nav_order: 60
has_children: false
---

# Ruby client

The OpenSearch Ruby client allows you to interact with your OpenSearch clusters through Ruby methods rather than HTTP methods and raw JSON. For the client's complete API documentation, see the [`opensearch-ruby` repository](https://github.com/opensearch-project/opensearch-ruby) documentation. For additional examples, see [`opensearch-transport`](https://rubygems.org/gems/opensearch-transport/), [`opensearch-api`](https://rubygems.org/gems/opensearch-api/), [`opensearch-dsl`](https://rubygems.org/gems/opensearch-dsl/), and [`opensearch-ruby`](https://rubygems.org/gems/opensearch-ruby/) gem documentation.

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [`opensearch-ruby` repo](https://github.com/opensearch-project/opensearch-ruby).

## Installing the Ruby client

To install the Ruby gem for the Ruby client, run the following command:

```bash
gem install opensearch-ruby
```
{% include copy.html %}

Alternatively, add the gem to your `Gemfile` and run `bundle install`. The following example requires client version 3.4.0 or a later 3.x release:

```ruby
gem 'opensearch-ruby', '~> 3.4'
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
2026-09-30 12:29:58 -0400: GET http://localhost:9200/ [status:200, request:0.009s, query:n/a]
2026-09-30 12:29:58 -0400: < {
  "name" : "opensearch-node1",
  "cluster_name" : "opensearch-cluster",
  "cluster_uuid" : "uwutrwdfTVeh8rroYbZh4g",
  "version" : {
    "distribution" : "opensearch",
    "number" : "3.8.0",
    "build_type" : "tar",
    "build_hash" : "e5a3c5691be87af6c12dbe3e158c59c04ee72973",
    "build_date" : "2026-08-03T21:07:36.443334696Z",
    "build_snapshot" : false,
    "lucene_version" : "10.5.0",
    "minimum_wire_compatibility_version" : "2.19.0",
    "minimum_index_compatibility_version" : "2.0.0"
  },
  "tagline" : "The OpenSearch Project: https://opensearch.org/"
}

2026-09-30 12:29:58 -0400: GET http://localhost:9200/_cluster/health [status:200, request:0.007s, query:n/a]
2026-09-30 12:29:58 -0400: < {"cluster_name":"opensearch-cluster","status":"yellow","timed_out":false,"number_of_nodes":1,"number_of_data_nodes":1,"discovered_master":true,"discovered_cluster_manager":true,"active_primary_shards":57,"active_shards":57,"relocating_shards":0,"initializing_shards":0,"unassigned_shards":28,"delayed_unassigned_shards":0,"number_of_pending_tasks":0,"number_of_in_flight_fetch":0,"task_max_waiting_in_queue_millis":0,"active_shards_percent_as_number":67.05882352941175}
```

To connect to a cluster that has the Security plugin enabled, use HTTPS and provide the user credentials:

```ruby
client = OpenSearch::Client.new(
    host: 'https://localhost:9200',
    user: 'admin', # Only for demo purposes. Don't specify your credentials in code.
    password: '<custom-admin-password>',
    transport_options: { ssl: { verify: false } } # For testing only. Use a certificate for validation.
)
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Service

To connect to Amazon OpenSearch Service, first install the `opensearch-aws-sigv4` gem:

```bash
gem install opensearch-aws-sigv4
```
{% include copy.html %}

Then create a client. Replace the endpoint with your domain endpoint, which is listed on the domain's details page in the Amazon OpenSearch Service console:

```ruby
require 'opensearch-aws-sigv4'
require 'aws-sigv4'

signer = Aws::Sigv4::Signer.new(service: 'es',
                                region: 'us-east-1', # must match the Region in the endpoint
                                access_key_id: 'key_id',
                                secret_access_key: 'secret',
                                session_token: 'session_token') # required for temporary credentials, such as IAM roles or SSO

client = OpenSearch::Aws::Sigv4Client.new({
    host: 'https://search-<domain-name>-<id>.us-east-1.es.amazonaws.com',
    log: true
}, signer)

# create an index and document
index = 'students'
client.indices.create(index: index)
client.index(index: index, id: '1', body: { firstName: 'John',
                                            lastName: 'Doe',
                                            gpa: 3.89,
                                            gradDate: '2022-05-15' },
                                            refresh: true)

# search for the document
client.search(index: index, body: { query: { match: { firstName: 'John' } } })

# delete the document
client.delete(index: index, id: '1')

# delete the index
client.indices.delete(index: index)
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Serverless

To connect to Amazon OpenSearch Serverless, first install the `opensearch-aws-sigv4` gem:

```bash
gem install opensearch-aws-sigv4
```
{% include copy.html %}

Then create a client. Replace the endpoint with your collection endpoint, which is listed on the collection's details page in the Amazon OpenSearch Service console:

```ruby
require 'opensearch-aws-sigv4'
require 'aws-sigv4'

signer = Aws::Sigv4::Signer.new(service: 'aoss',
                                region: 'us-east-1', # must match the Region in the endpoint
                                access_key_id: 'key_id',
                                secret_access_key: 'secret',
                                session_token: 'session_token') # required for temporary credentials, such as IAM roles or SSO

client = OpenSearch::Aws::Sigv4Client.new({
    host: 'https://<collection-id>.us-east-1.aoss.amazonaws.com', # Amazon OpenSearch Serverless collection endpoint
    log: true
}, signer)

# check whether an index exists
puts client.indices.exists?(index: 'students')
```
{% include copy.html %}

Amazon OpenSearch Serverless supports a subset of OpenSearch API operations and does not support the `refresh` parameter used in the examples on this page. For more information, see [Supported operations and plugins in Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-genref.html).
{: .note}

## Creating an index

You don't need to create an index explicitly in OpenSearch. Once you upload a document into an index that does not exist, OpenSearch creates the index automatically. To create an index explicitly, use the `indices.create` method and pass the index settings and mappings in the `body` parameter.

The following example creates an index with one primary shard and one replica. It explicitly maps the `gradDate` field as a `date` in the `yyyy-MM-dd` format. OpenSearch maps the other document fields dynamically when you index documents:

```ruby
index_body = {
  settings: {
    index: {
      number_of_shards: 1,
      number_of_replicas: 1
    }
  },
  mappings: {
    properties: {
      gradDate: { type: 'date', format: 'yyyy-MM-dd' }
    }
  }
}
client.indices.create(index: 'students', body: index_body)
```
{% include copy.html %}

## Mappings

OpenSearch uses dynamic mapping to infer field types of the documents that are indexed. However, to have more control over the schema of your document, you can pass an explicit mapping to OpenSearch, as shown in [Creating an index](#creating-an-index). By default, string fields are mapped as `text`. Mapping a field as `keyword` instead signals to OpenSearch that the field should not be analyzed and should support only full case-sensitive matches.

To verify an index's mappings, use the `get_mapping` method:

```ruby
response = client.indices.get_mapping(index: 'students')
```
{% include copy.html %}

If you know the mapping of your documents in advance and want to avoid mapping errors (for example, misspellings of a field name), use the `put_mapping` method to map the remaining fields and set the `dynamic` parameter to `strict`:

```ruby
client.indices.put_mapping(
  index: 'students',
  body: {
    dynamic: 'strict',
    properties: {
      firstName: { type: 'keyword' },
      lastName: { type: 'keyword' },
      gpa: { type: 'float' },
      gradDate: { type: 'date', format: 'yyyy-MM-dd' }
    }
  }
)
```
{% include copy.html %}

With strict mapping, you can index a document with a missing field, but you cannot index a document with a new field. For example, indexing the following document with a misspelled `gradDat` field fails:

```ruby
student = { firstName: 'John', lastName: 'Doe', gpa: 3.89, gradDat: '2022-05-15' }
client.index(index: 'students', id: '1', body: student, refresh: true)
```
{% include copy.html %}

OpenSearch returns a mapping error, and the client raises an `OpenSearch::Transport::Transport::Errors::BadRequest` exception containing the following message:

```bash
[400] {"error":{"root_cause":[{"type":"strict_dynamic_mapping_exception","reason":"mapping set to strict, dynamic introduction of [gradDat] within [_doc] is not allowed"}],"type":"strict_dynamic_mapping_exception","reason":"mapping set to strict, dynamic introduction of [gradDat] within [_doc] is not allowed"},"status":400}
```

## Indexing a document

To index a document, use the `index` method:

```ruby
student = { firstName: 'John', lastName: 'Doe', gpa: 3.89, gradDate: '2022-05-15' }
response = client.index(index: 'students', id: '1', body: student, refresh: true)
```
{% include copy.html %}

## Bulk operations

You can perform several operations at the same time by using the `bulk` method. The operations may be of the same type or of different types.

To index multiple documents, pass each action header followed by its document:

```ruby
actions = [
  { index: { _index: 'students', _id: '2' } },
  { firstName: 'Paulo', lastName: 'Santos', gpa: 3.93, gradDate: '2021-05-20' },
  { index: { _index: 'students', _id: '3' } },
  { firstName: 'Shirley', lastName: 'Rodriguez', gpa: 3.91, gradDate: '2019-05-10' }
]
response = client.bulk(body: actions, refresh: true)
```
{% include copy.html %}

Alternatively, you can pass the header and the data together by denoting the data with the `data:` key. The following request indexes the same two documents:

```ruby
actions = [
  { index: { _index: 'students', _id: '2', data: { firstName: 'Paulo', lastName: 'Santos', gpa: 3.93, gradDate: '2021-05-20' } } },
  { index: { _index: 'students', _id: '3', data: { firstName: 'Shirley', lastName: 'Rodriguez', gpa: 3.91, gradDate: '2019-05-10' } } }
]
response = client.bulk(body: actions, refresh: true)
```
{% include copy.html %}

## Searching for documents

To search for documents, use the `search` method. If you omit the request body, your query becomes a `match_all` query and returns all documents in the index:

```ruby
require 'json'

response = client.search(index: 'students')
response['hits']['hits'].each { |hit| puts JSON.generate(hit['_source']) }
```
{% include copy.html %}

The following example uses a `range` query to search for students who graduated in 2019:

```ruby
query = { query: { range: { gradDate: { gte: '2019-01-01', lte: '2019-12-31' } } } }
response = client.search(index: 'students', body: query)
```
{% include copy.html %}

The following example searches for a student whose first or last name is "Santos." It uses a `multi_match` query to search for two fields (`firstName` and `lastName`), and it is boosting the `lastName` field in relevance with a caret notation (`lastName^2`):

```ruby
query = {
  size: 5,
  query: {
    multi_match: {
      query: 'Santos',
      fields: ['firstName', 'lastName^2']
    }
  }
}
response = client.search(index: 'students', body: query)
```
{% include copy.html %}

## Boolean query

The Ruby client exposes full OpenSearch query capability. In addition to simple searches that use the match query, you can create a more complex Boolean query to search for students who graduated in 2021 or later and sort them by GPA in descending order. In the following example, search is limited to 10 documents:

```ruby
query = {
  query: {
    bool: {
      filter: {
        range: {
          gradDate: { gte: '2021-01-01' }
        }
      }
    }
  },
  sort: {
    gpa: { order: 'desc' }
  }
}
response = client.search(index: 'students', from: 0, size: 10, body: query)
```
{% include copy.html %}

## Multi-search

You can bulk several queries together and perform a multi-search using the `msearch` method. The following code searches for students whose GPAs are greater than 3.9 and for students whose GPAs are less than 3.9:

```ruby
actions = [
  {},
  { query: { range: { gpa: { gt: 3.9 } } } },
  {},
  { query: { range: { gpa: { lt: 3.9 } } } }
]
response = client.msearch(index: 'students', body: actions)
```
{% include copy.html %}

## Paginating results

To paginate results, use the `from` and `size` parameters. The following example sorts students by graduation date and retrieves the results two at a time. The first request returns the first page of results, and the second request returns the next page:

```ruby
require 'json'

query = { sort: [{ gradDate: 'asc' }] }
response = client.search(index: 'students', from: 0, size: 2, body: query)
response['hits']['hits'].each { |hit| puts JSON.generate(hit['_source']) }

response = client.search(index: 'students', from: 2, size: 2, body: query)
response['hits']['hits'].each { |hit| puts JSON.generate(hit['_source']) }
```
{% include copy.html %}

The `from` and `size` parameters work well for the first pages of results. To process a large number of results in a batch, use scroll, as described in [Paginating using scroll](#paginating-using-scroll).

### Paginating using scroll

Use the Scroll API to paginate search results. Scroll keeps a search context open on the cluster and is suited to processing all results in a batch job rather than to user-facing requests. For other use cases, use point in time with `search_after`. For more information, see [Paginate results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/).

The following example retrieves all students two at a time:

```ruby
response = client.search(index: 'students', scroll: '2m', size: 2)

while response['hits']['hits'].size.positive?
  scroll_id = response['_scroll_id']
  puts(response['hits']['hits'].map { |hit| "#{hit['_source']['firstName']} #{hit['_source']['lastName']}" })
  response = client.scroll(scroll: '1m', body: { scroll_id: scroll_id })
end

client.clear_scroll(body: { scroll_id: response['_scroll_id'] })
```
{% include copy.html %}

First, you issue a search query, specifying the `scroll` and `size` parameters. The `scroll` parameter tells OpenSearch how long to keep the search context. In this case, it is set to two minutes. The `size` parameter specifies how many documents you want to return in each request. 

The response to the initial search query contains a `_scroll_id` that you can use to get the next set of documents. To do this, you use the `scroll` method, again specifying the `scroll` parameter and passing the `_scroll_id` in the body. You don't need to specify the query or index to the `scroll` method. The `scroll` method returns the next set of documents and the `_scroll_id`. It's important to use the latest `_scroll_id` when requesting the next batch of documents because `_scroll_id` can change between requests. When you have retrieved all documents, use the `clear_scroll` method to release the search context.

## Updating a document

To update a document, use the `update` method and pass the fields to change in the `doc` object. Then retrieve the updated document using the `get` method:

```ruby
response = client.update(index: 'students', id: '1', body: { doc: { gpa: 3.92 } })
response = client.get(index: 'students', id: '1')
```
{% include copy.html %}

## Deleting a document

To delete a document, use the `delete` method:

```ruby
response = client.delete(index: 'students', id: '3', refresh: true)
```
{% include copy.html %}

To delete multiple documents in one request, use the `bulk` method:

```ruby
actions = [
  { delete: { _index: 'students', _id: '1' } },
  { delete: { _index: 'students', _id: '2' } }
]
response = client.bulk(body: actions, refresh: true)
```
{% include copy.html %}

## Deleting an index

To delete an index, use the `indices.delete` method:

```ruby
response = client.indices.delete(index: 'students')
```
{% include copy.html %}

## Sample program

This sample program combines the code from the preceding sections. It connects to a cluster that has the Security plugin enabled. To connect to a cluster without the Security plugin, change the lines marked with `# Without security` comments.

This sample program is for testing only. It specifies credentials in code and disables certificate validation so that it can connect to a cluster that uses self-signed certificates. In production, load credentials from a secure location and validate the cluster's certificate.
{: .warning}

The following sample program creates a client, creates an index, indexes documents individually and in bulk, searches for documents, updates a document, deletes a document, and then deletes the index:

```ruby
require 'opensearch'
require 'json'

client = OpenSearch::Client.new(
  host: 'https://localhost:9200', # Without security, use http://localhost:9200
  user: 'admin', # Without security, remove this line
  password: '<custom-admin-password>', # Without security, remove this line
  transport_options: { ssl: { verify: false } } # Without security, remove this line
)

# Create the index
index = 'students'
puts 'Creating index......'
index_body = {
  settings: {
    index: {
      number_of_shards: 1,
      number_of_replicas: 1
    }
  },
  mappings: {
    properties: {
      gradDate: { type: 'date', format: 'yyyy-MM-dd' }
    }
  }
}
response = client.indices.create(index: index, body: index_body)
puts "Index created: #{response['index']}"

# Index a document
puts "\nIndexing one student......"
student = { firstName: 'John', lastName: 'Doe', gpa: 3.89, gradDate: '2022-05-15' }
response = client.index(index: index, id: '1', body: student, refresh: true)
puts "Result: #{response['result']}, id: #{response['_id']}, version: #{response['_version']}"

# Bulk index documents
puts "\nIndexing many students......"
actions = [
  { index: { _index: index, _id: '2' } },
  { firstName: 'Paulo', lastName: 'Santos', gpa: 3.93, gradDate: '2021-05-20' },
  { index: { _index: index, _id: '3' } },
  { firstName: 'Shirley', lastName: 'Rodriguez', gpa: 3.91, gradDate: '2019-05-10' }
]
response = client.bulk(body: actions, refresh: true)
puts "Errors: #{response['errors']}"
response['items'].each do |item|
  puts "  #{item['index']['result']} id: #{item['index']['_id']}"
end

# Search for all students
puts "\nSearching for all students......"
query = { sort: [{ gradDate: 'asc' }] }
[0, 2].each_with_index do |from, page|
  response = client.search(index: index, from: from, size: 2, body: query)
  puts "Total hits: #{response['hits']['total']['value']}" if page.zero?
  puts "Page #{page + 1}:"
  response['hits']['hits'].each { |hit| puts "  #{JSON.generate(hit['_source'])}" }
end

# Search for students who graduated in 2019
puts "\nSearching for students who graduated in 2019......"
query = { query: { range: { gradDate: { gte: '2019-01-01', lte: '2019-12-31' } } } }
response = client.search(index: index, body: query)
puts "Total hits: #{response['hits']['total']['value']}"
response['hits']['hits'].each { |hit| puts "  #{JSON.generate(hit['_source'])}" }

# Update a document
puts "\nUpdating a student's GPA......"
response = client.update(index: index, id: '1', body: { doc: { gpa: 3.92 } })
puts "Result: #{response['result']}, version: #{response['_version']}"

# Get the updated document
response = client.get(index: index, id: '1')
puts "Updated document: #{JSON.generate(response['_source'])}"

# Delete a document
puts "\nDeleting a student......"
response = client.delete(index: index, id: '3', refresh: true)
puts "Result: #{response['result']}"

# Delete the index
puts "\nDeleting the index......"
response = client.indices.delete(index: index)
puts "Acknowledged: #{response['acknowledged']}"
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

# Ruby AWS Signature Version 4 client

The [`opensearch-aws-sigv4`](https://github.com/opensearch-project/opensearch-ruby-aws-sigv4) gem provides the `OpenSearch::Aws::Sigv4Client` class, which has all features of `OpenSearch::Client`. The only difference between these two clients is that `OpenSearch::Aws::Sigv4Client` requires an instance of `Aws::Sigv4::Signer` during instantiation to authenticate with AWS:

```ruby
require 'opensearch-aws-sigv4'
require 'aws-sigv4'

signer = Aws::Sigv4::Signer.new(service: 'es',
                                region: 'us-east-1',
                                access_key_id: 'key_id',
                                secret_access_key: 'secret',
                                session_token: 'session_token') # required for temporary credentials, such as IAM roles or SSO

client = OpenSearch::Aws::Sigv4Client.new({
    host: 'https://search-<domain-name>-<id>.us-east-1.es.amazonaws.com',
    log: true
}, signer)

client.cluster.health

client.search(index: 'students', q: 'firstName:John')
```
{% include copy.html %}

## Related documentation

- For more examples of using the client, see the [`opensearch-ruby` user guide](https://github.com/opensearch-project/opensearch-ruby/blob/main/USER_GUIDE.md).
- For guides to specific tasks, such as bulk indexing and searching, see the [`opensearch-ruby` guides](https://github.com/opensearch-project/opensearch-ruby/tree/main/guides).
- For complete sample applications, see the [`opensearch-ruby` samples](https://github.com/opensearch-project/opensearch-ruby/tree/main/samples).
