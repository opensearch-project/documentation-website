---
layout: default
title: opensearch_api
parent: Sources
grand_parent: Pipelines
nav_order: 30
---

# opensearch_api

The `opensearch_api` source accepts HTTP requests compatible with the [OpenSearch Bulk API](https://opensearch.org/docs/latest/api-reference/document-apis/bulk/). This allows standard OpenSearch clients like Flink OpenSearch Connector, Logstash, and opensearch-py to send data to Data Prepper.

Unlike the OpenSearch Bulk API, this source writes asynchronously. Events are buffered for downstream processing (except when `zero` buffer is used, in which case events are directly passed onto the sink) rather than written directly to OpenSearch. Irrespective of the buffer type used, the response is synthetic and does not reflect actual indexing results from OpenSearch.
  
## Usage

The `opensearch_api` source supports the following endpoints:

- `POST /<path>/_bulk` — Bulk API without index in path
- `POST /<path>/<index>/_bulk` — Bulk API with index in path

All standard bulk actions are supported: `index`, `create`, `update`, `delete`.

## Basic pipeline configuration

```yaml
source:
  opensearch_api:
    port: 9202
    path: "/opensearch"
```

## Configuration

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `port` | Integer | No | `9200` | Port the source listens on. Must be between 0 and 65535. |
| `path` | String | No | `/` | URI path for the endpoint. Must start with `/`. Supports `${pipelineName}` placeholder. |
| `request_timeout` | Integer | No | `10000` | Request timeout in milliseconds. |
| `thread_count` | Integer | No | `200` | Number of threads in the ScheduledThreadPool. |
| `max_connection_count` | Integer | No | `500` | Maximum number of open connections. |
| `max_pending_requests` | Integer | No | `1024` | Maximum number of tasks in the work queue. |
| `health_check_service` | Boolean | No | `false` | Enables a `/health` endpoint on the configured port. |
| `unauthenticated_health_check` | Boolean | No | `false` | If `true`, the health endpoint does not require authentication. |
| `compression` | String | No | `none` | Compression applied to the request payload. Supported values: `none`, `gzip`. |
| `authentication` | Object | No | Unauthenticated | Authentication configuration. See [Authentication](#authentication). |
| `ssl` | Boolean | No | `false` | Enables TLS/SSL. |
| `ssl_certificate_file` | String | Conditional | — | Path to the SSL certificate file. Required if `ssl` is `true` and `use_acm_certificate_for_ssl` is `false`. Supports S3 paths (`s3://bucket/path`). |
| `ssl_key_file` | String | Conditional | — | Path to the SSL key file (decrypted). Required if `ssl` is `true` and `use_acm_certificate_for_ssl` is `false`. Supports S3 paths. |
| `use_acm_certificate_for_ssl` | Boolean | No | `false` | Use AWS Certificate Manager for TLS certificates. |
| `acm_certificate_arn` | String | Conditional | — | ACM certificate ARN. Required if `use_acm_certificate_for_ssl` is `true`. |
| `acm_private_key_password` | String | No | Random | Password to decrypt the ACM private key. |
| `acm_certificate_timeout_millis` | Integer | No | `120000` | Timeout for ACM certificate retrieval. |
| `aws_region` | String | Conditional | — | AWS region for ACM or S3 certificate access. |

## Authentication

By default, the source runs without authentication.

### HTTP Basic authentication

```yaml
source:
  opensearch_api:
    authentication:
      http_basic:
        username: my-user
        password: my_s3cr3t
```

### Explicitly unauthenticated

```yaml
source:
  opensearch_api:
    authentication:
      unauthenticated:
```

### Custom authentication

Implement the `ArmeriaHttpAuthenticationProvider` interface to provide custom authentication.

## Supported bulk actions

The source supports all OpenSearch bulk actions:

| Action | Description | Requires document body |
|--------|-------------|----------------------|
| `index` | Index a document (create or replace) | Yes |
| `create` | Create a document (fail if exists) | Yes |
| `update` | Update an existing document | Yes |
| `delete` | Delete a document | No |

## Event metadata attributes

For each action in the bulk request, the source creates a Data Prepper event with the following metadata attributes:

| Attribute | Description | Example |
|-----------|-------------|---------|
| `opensearch_action` | The bulk action type | `index`, `create`, `update`, `delete` |
| `opensearch_index` | Target index name | `my-index` |
| `opensearch_id` | Document ID (if provided) | `doc-123` |
| `opensearch_routing` | Routing value (if provided) | `user-456` |
| `opensearch_pipeline` | Ingest pipeline (if provided) | `my-pipeline` |

These attributes can be referenced in processors and sinks using the `getMetadata` method or `${metadata_key}` syntax.

## Response format

On success, the source returns a JSON response with an empty `items` array. Sample:

```json
{
  "took": 5,
  "errors": false,
  "items": []
}
```

| Field | Description |
|-------|-------------|
| `took` | Actual processing time in milliseconds (measured from request receipt to buffer write completion). |
| `errors` | `false` when all data is successfully written to the buffer. |
| `items` | Always an empty array. Because Data Prepper buffers documents for downstream processing rather than indexing them directly, per-item results are not available at request time. |

This response format is verified to work with the RestHighLevelClient 1.3.x.

## Response status codes

| Status | Description |
|--------|-------------|
| `200` | Request data successfully written to the buffer. |
| `400` | Request data is malformed or uses an unsupported format. |
| `408` | Request timed out writing to the buffer. |
| `413` | Request payload exceeds the configured buffer capacity. |
| `429` | Source is at full capacity; request rejected. |

## Buffer compatibility

The `opensearch_api` source works with the following buffer types:

| Buffer | Supported | Notes |
|--------|-----------|-------|
| `bounded_blocking` | Yes | Default. Events stored as `Record<Event>` objects in a `BlockingQueue`. |
| `kafka` | Yes | Requires Data Prepper 2.x with ByteDecoder support. Raw bytes are written to Kafka; a `ByteDecoder` reconstructs events on the consumer side. |
| `zero` | Yes | Writes synchronously to OpenSearch (no buffering). |


## Metrics

### Counters

| Metric | Description |
|--------|-------------|
| `requestsReceived` | Total requests received by the endpoint. |
| `successRequests` | Total requests successfully processed (200). |
| `badRequests` | Total requests with invalid format (400). |
| `requestTimeouts` | Total requests that timed out (408). |
| `requestsTooLarge` | Total requests exceeding buffer capacity (413). |
| `requestsRejected` | Total requests rejected due to full capacity (429). |
| `internalServerError` | Total requests with internal errors (500). |

### Timer

| Metric | Description |
|--------|-------------|
| `requestProcessDuration` | Latency of request processing in seconds. |

### Distribution summary

| Metric | Description |
|--------|-------------|
| `payloadSize` | Distribution of incoming request payload sizes in bytes. |

## Examples

### Basic pipeline with OpenSearch sink

```yaml
opensearch-pipeline:
  source:
    opensearch_api:
      port: 9202
      path: "/opensearch"
  sink:
    - opensearch:
        hosts: ["https://opensearch-node:9200"]
        index: "${getMetadata(\"opensearch_index\")}"
        document_id: "${getMetadata(\"opensearch_id\")}"
        routing: "${getMetadata(\"opensearch_routing\")}"
        action: "${getMetadata(\"opensearch_action\")}"
```

### With SSL enabled

```yaml
opensearch-pipeline:
  source:
    opensearch_api:
      port: 9202
      ssl: true
      ssl_certificate_file: "/certs/server.crt"
      ssl_key_file: "/certs/server.key"
      authentication:
        http_basic:
          username: admin
          password: admin
  sink:
    - opensearch:
        hosts: ["https://opensearch-node:9200"]
        index: "${getMetadata(\"opensearch_index\")}"
        action: "${getMetadata(\"opensearch_action\")}"
```

### Sending data with curl

```bash
curl -XPOST "http://localhost:9202/opensearch/_bulk" \
  -H "Content-Type: application/json" \
  -d '{"index":{"_index":"movies","_id":"1"}}
{"title":"Rush","year":2013}
{"delete":{"_index":"movies","_id":"2"}}
'
```

### Sending data with opensearch-py

```python
from opensearchpy import OpenSearch

client = OpenSearch(
    hosts=[{"host": "localhost", "port": 9202}],
    use_ssl=False,
    url_prefix="/opensearch"
)

client.bulk(body=[
    {"index": {"_index": "movies", "_id": "1"}},
    {"title": "Rush", "year": 2013},
])
```
