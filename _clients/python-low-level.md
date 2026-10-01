---
layout: default
title: Python client
nav_order: 10
has_children: true
has_toc: false
redirect_from: 
  - /clients/python/
---

# Python client

The OpenSearch low-level Python client (`opensearch-py`) provides wrapper methods for the OpenSearch REST API so that you can interact with your cluster more naturally in Python. Rather than sending raw HTTP requests to a given URL, you can create an OpenSearch client for your cluster and call the client's built-in functions. 

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For additional information, see the following resources: 
- [OpenSearch Python repo](https://github.com/opensearch-project/opensearch-py)
- [API reference](https://opensearch-project.github.io/opensearch-py/api-ref.html) 
- [User guides](https://github.com/opensearch-project/opensearch-py/tree/main/guides)
- [Samples](https://github.com/opensearch-project/opensearch-py/tree/main/samples)

If you have any questions or would like to contribute, you can [create an issue](https://github.com/opensearch-project/opensearch-py/issues) to interact with the OpenSearch Python team directly. 

## Installing the Python client

The latest version of the client, `opensearch-py` 3.2.0, requires Python 3.10 or later. To add the client to your project, install it using [pip](https://pip.pypa.io/):

```bash
pip install opensearch-py
```
{% include copy.html %}

After installing the client, you can import it like any other module:

```python
from opensearchpy import OpenSearch
```
{% include copy.html %}

## Sample data

The examples on this page use student documents. Each document is a Python dictionary that contains the `firstName`, `lastName`, `gpa`, and `gradDate` fields. For example, the following dictionary represents one student:

```python
document = {'firstName': 'John', 'lastName': 'Doe', 'gpa': 3.89, 'gradDate': '2022-05-15'}
```
{% include copy.html %}

## Connecting to OpenSearch

To connect to the default OpenSearch host, create a client object with SSL enabled if you are using the Security plugin. Replace `<custom-admin-password>` with the admin password that you set when installing OpenSearch:

```python
host = 'localhost'
port = 9200
auth = ('admin', '<custom-admin-password>') # For testing only. Don't store credentials in code.
ca_certs_path = '/full/path/to/root-ca.pem' # Provide a CA bundle if you use intermediate CAs with your root CA.

# Create the client with SSL/TLS enabled, but hostname verification disabled.
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    http_auth = auth,
    use_ssl = True,
    verify_certs = True,
    ssl_assert_hostname = False,
    ssl_show_warn = False,
    ca_certs = ca_certs_path
)
```
{% include copy.html %}

If you have your own client certificates, specify them in the `client_cert_path` and `client_key_path` parameters:

```python
host = 'localhost'
port = 9200
auth = ('admin', '<custom-admin-password>') # For testing only. Don't store credentials in code.
ca_certs_path = '/full/path/to/root-ca.pem' # Provide a CA bundle if you use intermediate CAs with your root CA.

# Optional client certificates if you don't want to use HTTP basic authentication.
client_cert_path = '/full/path/to/client.pem'
client_key_path = '/full/path/to/client-key.pem'

# Create the client with SSL/TLS enabled, but hostname verification disabled.
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    http_auth = auth,
    client_cert = client_cert_path,
    client_key = client_key_path,
    use_ssl = True,
    verify_certs = True,
    ssl_assert_hostname = False,
    ssl_show_warn = False,
    ca_certs = ca_certs_path
)
```
{% include copy.html %}

If you are not using the Security plugin, create a client object with SSL disabled:

```python
host = 'localhost'
port = 9200

# Create the client with SSL/TLS and hostname verification disabled.
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    use_ssl = False,
    verify_certs = False,
    ssl_assert_hostname = False,
    ssl_show_warn = False
)
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Service

To sign requests to Amazon OpenSearch Service or Amazon OpenSearch Serverless using IAM credentials, install the AWS SDK for Python (Boto3):

```bash
pip install boto3
```
{% include copy.html %}

In the following example, replace the endpoint with your domain endpoint, which is listed on the domain's details page in the Amazon OpenSearch Service console.

The following example illustrates connecting to Amazon OpenSearch Service using IAM credentials:

```python
from opensearchpy import OpenSearch, RequestsHttpConnection, RequestsAWSV4SignerAuth
import boto3

host = 'search-<domain-name>-<id>.us-east-1.es.amazonaws.com' # Domain endpoint without https://
region = 'us-east-1'
service = 'es'
credentials = boto3.Session().get_credentials()
auth = RequestsAWSV4SignerAuth(credentials, region, service)

client = OpenSearch(
    hosts = [{'host': host, 'port': 443}],
    http_auth = auth,
    use_ssl = True,
    verify_certs = True,
    connection_class = RequestsHttpConnection,
    pool_maxsize = 20
)
```
{% include copy.html %}

To connect to Amazon OpenSearch Service through HTTP with a username and password, use the following code:

```python
from opensearchpy import OpenSearch

host = 'search-<domain-name>-<id>.us-east-1.es.amazonaws.com' # Domain endpoint without https://
auth = ('admin', '<custom-admin-password>') # For testing only. Don't store credentials in code.

client = OpenSearch(
    hosts=[{"host": host, "port": 443}],
    http_auth=auth,
    http_compress=True,  # enables gzip compression for request bodies
    use_ssl=True,
    verify_certs=True,
    ssl_assert_hostname=False,
    ssl_show_warn=False,
)
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Serverless

In the following example, replace the endpoint with your collection endpoint, which is listed on the collection's details page in the Amazon OpenSearch Service console.

The following example illustrates connecting to Amazon OpenSearch Serverless:

```python
from opensearchpy import OpenSearch, RequestsHttpConnection, RequestsAWSV4SignerAuth
import boto3

host = '<collection-id>.us-east-1.aoss.amazonaws.com' # Collection endpoint without https://
region = 'us-east-1'
service = 'aoss'
credentials = boto3.Session().get_credentials()
auth = RequestsAWSV4SignerAuth(credentials, region, service)

client = OpenSearch(
    hosts = [{'host': host, 'port': 443}],
    http_auth = auth,
    use_ssl = True,
    verify_certs = True,
    connection_class = RequestsHttpConnection,
    pool_maxsize = 20
)
```
{% include copy.html %}

Amazon OpenSearch Serverless supports a subset of OpenSearch API operations and does not support the `refresh` parameter used in the examples on this page. For more information, see [Supported operations and plugins in Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-genref.html).
{: .note}

## Creating an index

The following example creates an index with one primary shard and one replica. It explicitly maps the `gradDate` field as a `date` in the `yyyy-MM-dd` format. OpenSearch maps the other document fields dynamically when you index documents:

```python
index_name = 'students'
index_body = {
    'settings': {
        'index': {
            'number_of_shards': 1,
            'number_of_replicas': 1
        }
    },
    'mappings': {
        'properties': {
            'gradDate': {'type': 'date', 'format': 'yyyy-MM-dd'}
        }
    }
}
response = client.indices.create(index=index_name, body=index_body)
```
{% include copy.html %}

## Indexing a document

To index the `document` dictionary from [Sample data](#sample-data), use the `client.index()` method:

```python
response = client.index(index=index_name, id='1', body=document, refresh=True)
```
{% include copy.html %}

## Performing bulk operations

You can perform several operations at the same time by using the `bulk()` method of the client. The operations may be of the same type or of different types. Provide the operations as a list in which each action is followed by its document:

```python
operations = [
    {'index': {'_index': index_name, '_id': '2'}},
    {'firstName': 'Paulo', 'lastName': 'Santos', 'gpa': 3.93, 'gradDate': '2021-05-20'},
    {'index': {'_index': index_name, '_id': '3'}},
    {'firstName': 'Shirley', 'lastName': 'Rodriguez', 'gpa': 3.91, 'gradDate': '2019-05-10'}
]
response = client.bulk(body=operations, refresh=True)
```
{% include copy.html %}

## Searching for documents

To search for all documents in an index, use the `client.search()` method without a query:

```python
response = client.search(index=index_name)
```
{% include copy.html %}

The response is a dictionary, and each item in `response['hits']['hits']` is a dictionary that contains the document ID in the `_id` key and the document fields in the `_source` key:

```python
for hit in response['hits']['hits']:
    source = hit['_source']
    print(f"ID: {hit['_id']}, name: {source['firstName']} {source['lastName']}, GPA: {source['gpa']}, graduation date: {source['gradDate']}")
```
{% include copy.html %}

To search using a query, provide the query in the request body. The following code uses a range query to search for students who graduated in 2019:

```python
query = {'query': {'range': {'gradDate': {'gte': '2019-01-01', 'lte': '2019-12-31'}}}}
response = client.search(index=index_name, body=query)
```
{% include copy.html %}

## Paginating results

To paginate results, use the `from` and `size` parameters. The following example sorts students by graduation date and retrieves the results two at a time. The first request returns the first page of results, and the second request returns the next page:

```python
response = client.search(index=index_name, body={'from': 0, 'size': 2, 'sort': [{'gradDate': 'asc'}]})
next_response = client.search(index=index_name, body={'from': 2, 'size': 2, 'sort': [{'gradDate': 'asc'}]})
for page in [response, next_response]:
    for hit in page['hits']['hits']:
        print(hit['_source'])
```
{% include copy.html %}

The `from` and `size` parameters work well for the first pages of results. To paginate through a large number of results, use point in time with `search_after`. For more information, see [Paginate results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/).

## Updating a document

You can update a document using the `client.update()` method. The fields in the `doc` object are merged into the existing document:

```python
response = client.update(index=index_name, id='1', body={'doc': {'gpa': 3.92}})
```
{% include copy.html %}

## Deleting a document

You can delete a document using the `client.delete()` method:

```python
response = client.delete(index=index_name, id='3', refresh=True)
```
{% include copy.html %}

## Deleting an index

You can delete an index using the `client.indices.delete()` method:

```python
response = client.indices.delete(index=index_name)
```
{% include copy.html %}

## Sample program

This sample program combines the code from the preceding sections. It connects to a cluster that has the Security plugin enabled. To connect to a cluster without the Security plugin, change the lines marked with `# Without security` comments.

This sample program is for testing only. It specifies credentials in code. In production, load credentials from a secure location.
{: .warning}

The following sample program creates a client, creates an index, indexes documents individually and in bulk, searches for documents, updates a document, deletes a document, and then deletes the index:

```python
import json
from opensearchpy import OpenSearch

host = 'localhost'
port = 9200
# Without security, remove this line
auth = ('admin', '<custom-admin-password>')
# Without security, remove this line
ca_certs_path = '/full/path/to/root-ca.pem' # Provide a CA bundle if you use intermediate CAs with your root CA.

# Create the client with SSL/TLS enabled, but hostname verification disabled.
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    http_auth = auth, # Without security, remove this line
    use_ssl = True, # Without security, use use_ssl = False
    verify_certs = True, # Without security, use verify_certs = False
    ssl_assert_hostname = False,
    ssl_show_warn = False,
    ca_certs = ca_certs_path # Without security, remove this line
)

# Create the index.
index_name = 'students'
index_body = {
    'settings': {
        'index': {
            'number_of_shards': 1,
            'number_of_replicas': 1
        }
    },
    'mappings': {
        'properties': {
            'gradDate': {'type': 'date', 'format': 'yyyy-MM-dd'}
        }
    }
}
print('Creating index......')
response = client.indices.create(index=index_name, body=index_body)
print(f"Index created: {response['index']}")

# Index a document.
print('\nIndexing one student......')
document = {'firstName': 'John', 'lastName': 'Doe', 'gpa': 3.89, 'gradDate': '2022-05-15'}
response = client.index(index=index_name, id='1', body=document, refresh=True)
print(f"Result: {response['result']}, id: {response['_id']}, version: {response['_version']}")

# Bulk index documents.
print('\nIndexing many students......')
operations = [
    {'index': {'_index': index_name, '_id': '2'}},
    {'firstName': 'Paulo', 'lastName': 'Santos', 'gpa': 3.93, 'gradDate': '2021-05-20'},
    {'index': {'_index': index_name, '_id': '3'}},
    {'firstName': 'Shirley', 'lastName': 'Rodriguez', 'gpa': 3.91, 'gradDate': '2019-05-10'}
]
response = client.bulk(body=operations, refresh=True)
print(f"Errors: {str(response['errors']).lower()}")
for item in response['items']:
    print(f"  {item['index']['result']} id: {item['index']['_id']}")

# Search for all students.
print('\nSearching for all students......')
for page, start in enumerate([0, 2], start=1):
    response = client.search(index=index_name, body={'from': start, 'size': 2, 'sort': [{'gradDate': 'asc'}]})
    if page == 1:
        print(f"Total hits: {response['hits']['total']['value']}")
    print(f"Page {page}:")
    for hit in response['hits']['hits']:
        print(f"  {json.dumps(hit['_source'], separators=(',', ':'))}")

# Search for students who graduated in 2019.
print('\nSearching for students who graduated in 2019......')
query = {'query': {'range': {'gradDate': {'gte': '2019-01-01', 'lte': '2019-12-31'}}}}
response = client.search(index=index_name, body=query)
print(f"Total hits: {response['hits']['total']['value']}")
for hit in response['hits']['hits']:
    print(f"  {json.dumps(hit['_source'], separators=(',', ':'))}")

# Update a document.
print("\nUpdating a student's GPA......")
response = client.update(index=index_name, id='1', body={'doc': {'gpa': 3.92}})
print(f"Result: {response['result']}, version: {response['_version']}")

# Get the updated document.
response = client.get(index=index_name, id='1')
print(f"Updated document: {json.dumps(response['_source'], separators=(',', ':'))}")

# Delete a document.
print('\nDeleting a student......')
response = client.delete(index=index_name, id='3', refresh=True)
print(f"Result: {response['result']}")

# Delete the index.
print('\nDeleting the index......')
response = client.indices.delete(index=index_name)
print(f"Acknowledged: {str(response['acknowledged']).lower()}")
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

- To analyze data and upload ML models from Python, see [Python ML client]({{site.url}}{{site.baseurl}}/clients/opensearch-py-ml/).
- For the client API reference, see the [`opensearch-py` API documentation](https://opensearch-project.github.io/opensearch-py/).
- For more examples of using the client, see the [`opensearch-py` user guide](https://github.com/opensearch-project/opensearch-py/blob/main/USER_GUIDE.md).
- For guides to specific tasks, such as bulk indexing and searching, see the [`opensearch-py` guides](https://github.com/opensearch-project/opensearch-py/tree/main/guides).
- For complete sample applications, see the [`opensearch-py` samples](https://github.com/opensearch-project/opensearch-py/tree/main/samples).
