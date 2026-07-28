---
layout: default
title: Python gRPC transport
nav_order: 15
---

# Python gRPC transport

**Introduced 2.8.0**
{: .label .label-purple }

The OpenSearch Python gRPC transport provides a high-performance alternative to the default REST transport for bulk ingestion workloads. It uses [protocol buffers](https://protobuf.dev/) over [gRPC](https://grpc.io/) for binary serialization and HTTP/2 multiplexing.

The gRPC transport is **transparent** — you use the same `client.bulk()` method you already know. Supported operations are automatically routed over gRPC, while all other operations use REST. No code changes are required beyond client initialization.

For the client source code, see the [`opensearch-py` repo](https://github.com/opensearch-project/opensearch-py).

## Setup

To add gRPC support to your project, install `opensearch-py` with the gRPC extra:

```bash
pip install opensearch-py[grpc]
```
{% include copy.html %}

This installs the required dependencies including `grpcio` and `opensearch-protobufs`.

## Connecting to OpenSearch with gRPC

To use gRPC for bulk operations, create an `OpenSearchGrpc` client instead of the standard `OpenSearch` client. Provide both the REST host (for non-bulk operations) and the gRPC host:

```python
from opensearchpy import OpenSearchGrpc

client = OpenSearchGrpc(
    hosts=[{"host": "localhost", "port": 9200}],
    grpc_hosts=[{"host": "localhost", "port": 9400}],
)
```
{% include copy.html %}

All operations use the same API as the standard client. Bulk operations are automatically routed to gRPC on port 9400, while search, index management, and other operations go to REST on port 9200.

## Connecting with basic authentication

To connect to a cluster with basic authentication:

```python
from opensearchpy import OpenSearchGrpc

client = OpenSearchGrpc(
    hosts=[{"host": "localhost", "port": 9200}],
    grpc_hosts=[{"host": "localhost", "port": 9400}],
    http_auth=("admin", "admin"),
    use_ssl=True,
    verify_certs=False,
)
```
{% include copy.html %}

## Connecting to Amazon OpenSearch Service

To connect to Amazon OpenSearch Service with IAM authentication:

```python
from opensearchpy import OpenSearchGrpc, RequestsHttpConnection, AWSV4SignerAuth
import boto3

host = "search-mydomain.us-east-1.es.amazonaws.com"
region = "us-east-1"
credentials = boto3.Session().get_credentials()
auth = AWSV4SignerAuth(credentials, region, "es")

client = OpenSearchGrpc(
    hosts=[{"host": host, "port": 443}],
    grpc_hosts=[{"host": host, "port": 9400}],
    http_auth=auth,
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection,
)
```
{% include copy.html %}

## Supported operations

The gRPC transport currently supports the following operations:

| Operation | gRPC support | Notes |
| :--- | :--- | :--- |
| Bulk (index, create, update, delete) | **Generally available** | All four operation types supported |
| Search | Routed to REST | Automatic, transparent to user |
| All other operations | Routed to REST | Automatic, transparent to user |

## Performing bulk operations

Bulk operations work identically to the standard REST client. The `OpenSearchGrpc` client routes them to gRPC automatically:

```python
from opensearchpy import OpenSearchGrpc

client = OpenSearchGrpc(
    hosts=[{"host": "localhost", "port": 9200}],
    grpc_hosts=[{"host": "localhost", "port": 9400}],
)

# Create an index (goes via REST)
client.indices.create(index="movies")

# Bulk indexing (goes via gRPC automatically)
body = [
    {"index": {"_index": "movies", "_id": "1"}},
    {"title": "The Dark Knight", "year": 2008},
    {"index": {"_index": "movies", "_id": "2"}},
    {"title": "Inception", "year": 2010},
]

response = client.bulk(body=body, refresh=True)
print(f"Errors: {response['errors']}")
print(f"Took: {response['took']}ms")
```
{% include copy.html %}

The response format is identical to the REST bulk API — no code changes needed.

## Searching for documents

Search operations are automatically routed to REST by the gRPC transport:

```python
# Search (goes via REST automatically)
response = client.search(
    index="movies",
    body={"query": {"match_all": {}}}
)

for hit in response["hits"]["hits"]:
    print(hit["_source"])
```
{% include copy.html %}

## Server configuration

To use the gRPC transport, the OpenSearch server must have gRPC enabled. Add the following to `opensearch.yml`:

```yaml
aux.transport.types: [transport-grpc]
aux.transport.transport-grpc.port: '9400'
```
{% include copy.html %}

For more information about server-side gRPC settings, see [gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/#grpc-settings).

## Next steps

- For the full Python client API, see the [`opensearch-py` API documentation](https://opensearch-project.github.io/opensearch-py/).
- For Python code samples, see [Samples](https://github.com/opensearch-project/opensearch-py/tree/main/samples).
