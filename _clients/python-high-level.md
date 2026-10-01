---
layout: default
title: High-level Python client
nav_order: 5
---

The standalone high-level Python client (`opensearch-dsl-py`) is deprecated, and its repository is archived. Its functionality is included in the [Python client (`opensearch-py`)]({{site.url}}{{site.baseurl}}/clients/python-low-level/). The examples on this page use the high-level classes provided by `opensearch-py`. To migrate existing code, install `opensearch-py` and replace `opensearch_dsl` imports with `opensearchpy` imports.
{: .warning}

# High-level Python client

The OpenSearch high-level Python client provides wrapper classes for common OpenSearch entities, like documents, so you can work with them as Python objects. Additionally, the high-level client simplifies writing queries and supplies convenient Python methods for common OpenSearch operations. The high-level Python client supports creating and indexing documents, searching with and without filters, and updating documents using queries.

This getting started guide illustrates how to connect to OpenSearch, index documents, and run queries. For the client source code, see the [`opensearch-py` repo](https://github.com/opensearch-project/opensearch-py).

## Setup

The high-level client is part of the `opensearch-py` package. The latest version of the package, 3.2.0, requires Python 3.10 or later. To add the client to your project, install it using [pip](https://pip.pypa.io/):

```bash
pip install opensearch-py
```
{% include copy.html %}

After installing the client, you can import it like any other module:

```python
import json
from opensearchpy import OpenSearch, Search, Index, Mapping, Document, Text, Keyword, Float, Date
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

## Creating an index

The following example creates an index with one primary shard and one replica. It explicitly maps the `gradDate` field as a `date` in the `yyyy-MM-dd` format. OpenSearch maps the other document fields dynamically when you index documents:

```python
index_name = 'students'
index = Index(index_name, using=client)
index.settings(number_of_shards=1, number_of_replicas=1)
index.mapping(Mapping().field('gradDate', Date(format='yyyy-MM-dd')))
response = index.create()
```
{% include copy.html %}

## Indexing a document

You can create a class to represent the documents that you'll index in OpenSearch by extending the `Document` class. The class attribute names are used as the document field names:

```python
class Student(Document):
    firstName = Text()
    lastName = Text()
    gpa = Float()
    gradDate = Keyword()

    class Index:
        name = index_name
```
{% include copy.html %}

To index a document, create an object of the new class and call its `save()` method:

```python
student = Student(meta={'id': '1'}, firstName='John', lastName='Doe', gpa=3.89, gradDate='2022-05-15')
result = student.save(using=client, refresh=True)
```
{% include copy.html %}

## Performing bulk operations

You can perform several operations at the same time by using the `bulk()` method of the client. The operations may be of the same type or of different types. Provide the operations as a list in which each action is followed by its document. The following code converts `Student` objects to documents using the `to_dict()` method:

```python
students = [
    Student(meta={'id': '2'}, firstName='Paulo', lastName='Santos', gpa=3.93, gradDate='2021-05-20'),
    Student(meta={'id': '3'}, firstName='Shirley', lastName='Rodriguez', gpa=3.91, gradDate='2019-05-10')
]
operations = []
for s in students:
    operations.append({'index': {'_index': index_name, '_id': s.meta.id}})
    operations.append(s.to_dict())
response = client.bulk(body=operations, refresh=True)
```
{% include copy.html %}

## Searching for documents

You can use the `Search` class to construct a query. To search for all documents in an index, create a `Search` object without a query. Slicing the `Search` object sets the `from` and `size` parameters, which specify the offset and the number of results to return:

```python
response = Search(using=client, index=index_name)[0:10].execute()
for hit in response:
    print(json.dumps(hit.to_dict(), separators=(',', ':')))
```
{% include copy.html %}

Each item in `response` is a `Hit` object, and the document fields are available as its attributes. The document ID is in the `hit.meta.id` attribute:

```python
for hit in response:
    print(f'ID: {hit.meta.id}, name: {hit.firstName} {hit.lastName}, GPA: {hit.gpa}, graduation date: {hit.gradDate}')
```
{% include copy.html %}

The following code uses a range query to search for students who graduated in 2019:

```python
response = Search(using=client, index=index_name).query('range', gradDate={'gte': '2019-01-01', 'lte': '2019-12-31'}).execute()
```
{% include copy.html %}

The preceding query is equivalent to the following query in OpenSearch domain-specific language (DSL):

```json
GET students/_search
{
  "query": {
    "range": {
      "gradDate": {
        "gte": "2019-01-01",
        "lte": "2019-12-31"
      }
    }
  }
}
```

## Updating a document

To update a document, retrieve it using the `get()` method and then call its `update()` method with the fields to change:

```python
student = Student.get(id='1', using=client)
result = student.update(using=client, gpa=3.92)
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
from opensearchpy import OpenSearch, Search, Index, Mapping, Document, Text, Keyword, Float, Date

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

index_name = 'students'

# Define the structure of a student document.
class Student(Document):
    firstName = Text()
    lastName = Text()
    gpa = Float()
    gradDate = Keyword()

    class Index:
        name = index_name

# Create the index.
print('Creating index......')
index = Index(index_name, using=client)
index.settings(number_of_shards=1, number_of_replicas=1)
index.mapping(Mapping().field('gradDate', Date(format='yyyy-MM-dd')))
response = index.create()
print(f"Index created: {response['index']}")

# Index a document.
print('\nIndexing one student......')
student = Student(meta={'id': '1'}, firstName='John', lastName='Doe', gpa=3.89, gradDate='2022-05-15')
result = student.save(using=client, refresh=True)
print(f"Result: {result}, id: {student.meta.id}, version: {student.meta.version}")

# Bulk index documents.
print('\nIndexing many students......')
students = [
    Student(meta={'id': '2'}, firstName='Paulo', lastName='Santos', gpa=3.93, gradDate='2021-05-20'),
    Student(meta={'id': '3'}, firstName='Shirley', lastName='Rodriguez', gpa=3.91, gradDate='2019-05-10')
]
operations = []
for s in students:
    operations.append({'index': {'_index': index_name, '_id': s.meta.id}})
    operations.append(s.to_dict())
response = client.bulk(body=operations, refresh=True)
print(f"Errors: {str(response['errors']).lower()}")
for item in response['items']:
    print(f"  {item['index']['result']} id: {item['index']['_id']}")

# Search for all students.
print('\nSearching for all students......')
response = Search(using=client, index=index_name)[0:10].execute()
print(f"Total hits: {response.hits.total.value}")
for hit in response:
    print(f"  {json.dumps(hit.to_dict(), separators=(',', ':'))}")

# Search for students who graduated in 2019.
print('\nSearching for students who graduated in 2019......')
response = Search(using=client, index=index_name).query('range', gradDate={'gte': '2019-01-01', 'lte': '2019-12-31'}).execute()
print(f"Total hits: {response.hits.total.value}")
for hit in response:
    print(f"  {json.dumps(hit.to_dict(), separators=(',', ':'))}")

# Update a document.
print("\nUpdating a student's GPA......")
student = Student.get(id='1', using=client)
result = student.update(using=client, gpa=3.92)
print(f"Result: {result}, version: {student.meta.version}")

# Get the updated document.
student = Student.get(id='1', using=client)
print(f"Updated document: {json.dumps(student.to_dict(), separators=(',', ':'))}")

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
