---
layout: default
title: Python client
nav_order: 70
nav_exclude: true
redirect_to: https://opensearch.org/docs/latest/clients/python/
---

# Python client

The OpenSearch Python client provides a more natural syntax for interacting with your cluster. Rather than sending HTTP requests to a given URL, you can create an OpenSearch client for your cluster and call the client's built-in functions.

{% comment %}
`opensearch-py` is the lower-level of the two Python clients. If you want a general client for assorted operations, it's a great choice. If you want a higher-level client strictly for indexing and search operations, consider [opensearch-dsl-py]({{site.url}}{{site.baseurl}}/clients/python-dsl/).
{% endcomment %}


## Setup

To add the client to your project, install it using [pip](https://pip.pypa.io/):

```bash
pip install opensearch-py
```

Then import it like any other module:

```python
from opensearchpy import OpenSearch
```

If you prefer to add the client manually or just want to examine the source code, see [opensearch-py on GitHub](https://github.com/opensearch-project/opensearch-py).


## Sample code

```python
from opensearchpy import OpenSearch

host = 'localhost'
port = 9200
auth = ('admin', 'admin') # For testing only. Don't store credentials in code.
ca_certs_path = '/full/path/to/root-ca.pem' # Provide a CA bundle if you use intermediate CAs with your root CA.

# Optional client certificates if you don't want to use HTTP basic authentication.
# client_cert_path = '/full/path/to/client.pem'
# client_key_path = '/full/path/to/client-key.pem'

# Create the client with SSL/TLS enabled, but hostname verification disabled.
client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    http_auth = auth,
    # client_cert = client_cert_path,
    # client_key = client_key_path,
    use_ssl = True,
    verify_certs = True,
    ssl_assert_hostname = False,
    ssl_show_warn = False,
    ca_certs = ca_certs_path
)

# Create an index with non-default settings.
index_name = 'python-test-index'
index_body = {
  'settings': {
    'index': {
      'number_of_shards': 4
    }
  }
}

response = client.indices.create(index_name, body=index_body)
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
q = 'miller'
query = {
  'size': 5,
  'query': {
    'multi_match': {
      'query': q,
      'fields': ['title^2', 'director']
    }
  }
}

response = client.search(
    body = query,
    index = index_name
)
print('\nSearch results:')
print(response)

# Delete the document.
response = client.delete(
    index = index_name,
    id = id
)

print('\nDeleting document:')
print(response)

# Delete the index.
response = client.indices.delete(
    index = index_name
)

print('\nDeleting index:')
print(response)
```
