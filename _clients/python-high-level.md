---
layout: default
title: High-level Python client
nav_order: 5
---

# High-level Python client

The OpenSearch high-level Python client (`opensearch-dsl-py`) provides wrapper classes for common OpenSearch entities, like documents, so you can work with them as Python objects. Additionally, the high-level client simplifies writing queries and supplies convenient Python methods for common OpenSearch operations. The high-level Python client supports creating and indexing documents, searching with and without filters, and updating documents using queries.

## Setup

To add the client to your project, install it using [pip](https://pip.pypa.io/):

```bash
pip install opensearch-dsl
```

After installing the client, you can import it like any other module:

```python
from opensearchpy import OpenSearch
from opensearch_dsl import Search
```

If you prefer to add the client manually or just want to examine the source code, see [opensearch-py on GitHub](https://github.com/opensearch-project/opensearch-dsl-py).

## Connecting to OpenSearch

To connect to the default OpenSearch host, create a client object with SSL enabled if you are using the Security plugin. You can use the default credentials for testing purposes:

```python
host = 'localhost'
port = 9200
auth = ('admin', 'admin') # For testing only. Don't store credentials in code.
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

If you have your own client certificates, specify them in the `client_cert_path` and `client_key_path` parameters:

```python
host = 'localhost'
port = 9200
auth = ('admin', 'admin') # For testing only. Don't store credentials in code.
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

## Creating an index

To create an OpenSearch index, use the `client.indices.create()` method. You can use the following code to construct a JSON object with custom settings:

```python
index_name = 'my-dsl-index'
index_body = {
  'settings': {
    'index': {
      'number_of_shards': 4
    }
  }
}

response = client.indices.create(index_name, body=index_body)
```

## Indexing a document

You can index a document into OpenSearch using the `client.index()` method:

```python
document = {
  'title': 'Moneyball',
  'director': 'Bennett Miller',
  'year': '2011'
}

response = client.index(
    index = 'my-dsl-index',
    body = document,
    id = '1',
    refresh = True
)
```

## Searching for documents

You can use the `Search` class to construct a query. The following code creates a Boolean query with a filter:

```python
s = Search(using=client, index=index_name) \
    .filter("term", year="2011") \
    .query("match", title="Moneyball")

response = s.execute()
```

The preceding query is equivalent to the following query in OpenSearch domain-specific language:

```json
GET my-dsl-index/_search 
{
  "query": {
    "bool": {
      "must": {
        "match": {
          "title": "Moneyball"
        }
      },
      "filter": {
        "term" : {
          "year": 2011
        }
      }
    }
  }
}
```

## Deleting a document

You can delete a document using the `client.delete()` method:

```python
response = client.delete(
    index = 'my-dsl-index',
    id = '1'
)
```

## Deleting an index

You can delete an index using the `client.indices.delete()` method:

```python
response = client.indices.delete(
    index = 'my-dsl-index'
)
```

## Sample program

The following sample program creates a client, adds an index with non-default settings, inserts a document, searches for the document, deletes the document, and, finally, deletes the index:

```python
from opensearchpy import OpenSearch
from opensearch_dsl import Search

host = 'localhost'
port = 9200

# Create the client with SSL/TLS enabled, but hostname verification disabled.
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    use_ssl = False,
    verify_certs = False,
    ssl_assert_hostname = False,
    ssl_show_warn = False
)

index_name = 'my-dsl-index'

index_body = {
  'settings': {
    'index': {
      'number_of_shards': 4
    }
  }
}

response = client.indices.create(index_name, index_body)
print('\nCreating index:')
print(response)

# Add a document to the index.
document = {
    'title': 'Moneyball',
    'director': 'Bennett Miller',
    'year': '2011'
}
id = '1'

response = client.index(
    index = index_name,
    body = document,
    id = id,
    refresh = True
)

print('\nAdding document:')
print(response)

# Search for the document.
s = Search(using=client, index=index_name) \
    .filter("term", year="2011") \
    .query("match", title="Moneyball")

response = s.execute()

print('\nSearch results:')
for hit in response:
    print(hit.meta.score, hit.title)

# Delete the document.
print('\nDeleting document:')
print(response)

# Delete the index.
response = client.indices.delete(
    index = index_name
)

print('\nDeleting index:')
print(response)
```
