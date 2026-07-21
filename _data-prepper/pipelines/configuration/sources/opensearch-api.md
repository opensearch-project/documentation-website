---
layout: default
title: OpenSearch API
parent: Sources
grand_parent: Pipelines
nav_order: 55
---

# OpenSearch API source

The `opensearch_api` source accepts HTTP requests compatible with the [OpenSearch Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/). Standard OpenSearch clients like [Apache Flink OpenSearch Connector](https://nightlies.apache.org/flink/flink-docs-stable/docs/connectors/datastream/opensearch/), Logstash, and [`opensearch-py`]({{site.url}}{{site.baseurl}}/clients/python-low-level/) can send data to Data Prepper through this source.

Unlike the OpenSearch Bulk API, this source writes asynchronously. Events are buffered for downstream processing rather than written directly to OpenSearch. When the `zero` buffer is used, events pass directly to the sink. Regardless of buffer type, the response is synthetic and does not reflect actual indexing results from OpenSearch.

## Usage

The `opensearch_api` source supports the following endpoints:

```json
POST /{path}/_bulk
POST /{path}/{index}/_bulk
```

## Configuration

The following table lists the configuration options for the `opensearch_api` source.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `port` | Integer | No | `9200` | The port the source listens on. Must be 0--65535. |
| `path` | String | No | `/` | The URI path for the endpoint. Must start with `/`. Supports the `${pipelineName}` placeholder. |
| `request_timeout` | Integer | No | `10000` | The request timeout, in milliseconds. |
| `thread_count` | Integer | No | `200` | The number of threads in the scheduled thread pool. |
| `max_connection_count` | Integer | No | `500` | The maximum number of open connections. |
| `max_pending_requests` | Integer | No | `1024` | The maximum number of tasks in the work queue. |
| `health_check_service` | Boolean | No | `false` | Enables a `/health` endpoint on the configured port. |
| `unauthenticated_health_check` | Boolean | No | `false` | If `true`, the health endpoint does not require authentication. |
| `compression` | String | No | `none` | The compression applied to the request payload. Valid values are `none` and `gzip`. |
| `authentication` | Object | No | Unauthenticated | The authentication configuration. See [Authentication](#authentication). |
| `ssl` | Boolean | No | `false` | Enables TLS/SSL. |
| `ssl_certificate_file` | String | Conditional | — | The path to the SSL certificate file. Required if `ssl` is `true` and `use_acm_certificate_for_ssl` is `false`. Supports Amazon Simple Storage Service (Amazon S3) paths (`s3://bucket/path`). |
| `ssl_key_file` | String | Conditional | — | The path to the SSL key file (decrypted). Required if `ssl` is `true` and `use_acm_certificate_for_ssl` is `false`. Supports Amazon S3 paths. |
| `use_acm_certificate_for_ssl` | Boolean | No | `false` | When `true`, uses AWS Certificate Manager (ACM) for TLS certificates. |
| `acm_certificate_arn` | String | Conditional | — | The ACM certificate Amazon Resource Name (ARN). Required if `use_acm_certificate_for_ssl` is `true`. |
| `acm_private_key_password` | String | No | Random | The password to decrypt the ACM private key. |
| `acm_certificate_timeout_millis` | Integer | No | `120000` | The timeout for ACM certificate retrieval, in milliseconds. |
| `aws_region` | String | Conditional | — | The AWS Region for ACM or Amazon S3 certificate access. |

## Authentication

By default, the source runs without authentication. To make this explicit in your configuration, use the `unauthenticated` key:

```yaml
source:
  opensearch_api:
    authentication:
      unauthenticated:
```
{% include copy.html %}

### HTTP basic authentication

The following example configures HTTP basic authentication with a username and password:

```yaml
source:
  opensearch_api:
    authentication:
      http_basic:
        username: my-user
        password: my_s3cr3t
```
{% include copy.html %}

### Custom authentication

To provide custom authentication, create a plugin that implements the [`ArmeriaHttpAuthenticationProvider`](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/armeria-common/src/main/java/org/opensearch/dataprepper/armeria/authentication/ArmeriaHttpAuthenticationProvider.java) interface.

## Event metadata attributes

For each action in the bulk request, the source creates a Data Prepper event with the following metadata attributes.

| Attribute | Description | Example |
|-----------|-------------|---------|
| `opensearch_action` | The bulk action type | `index`, `create`, `update`, `delete` |
| `opensearch_index` | Target index name | `my-index` |
| `opensearch_id` | Document ID (if provided) | `doc-123` |
| `opensearch_routing` | Routing value (if provided) | `user-456` |
| `opensearch_pipeline` | Ingest pipeline (if provided) | `my-pipeline` |

You can reference these attributes in processors and sinks using the `getMetadata` method or `${metadata_key}` syntax.

## Response format

On success, the source returns a JSON response with an empty `items` array:

```json
{
  "took": 5,
  "errors": false,
  "items": []
}
```

The following table lists the response fields.

| Field | Description |
|-------|-------------|
| `took` | The actual processing time, measured from request receipt to buffer write completion, in milliseconds. |
| `errors` | Indicates whether any errors occurred. Always `false` when all data is successfully written to the buffer. |
| `items` | Always an empty array. Because Data Prepper buffers documents for downstream processing rather than indexing them directly, per-item results are not available at request time. |

## Response status codes

The following table lists the possible response status codes.

| Status | Description |
|--------|-------------|
| `200` | Request data successfully written to the buffer. |
| `400` | Request data is malformed or uses an unsupported format. |
| `408` | Request timed out writing to the buffer. |
| `413` | Request payload exceeds the configured buffer capacity. |
| `429` | Source is at full capacity; request rejected. |

## Buffer compatibility

The `opensearch_api` source works with the following buffer types.

| Buffer | Supported | Notes |
|--------|-----------|-------|
| [`bounded_blocking`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/buffers/bounded-blocking/) | Yes | Default. Events are stored in an in-memory blocking queue. |
| [`kafka`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/buffers/kafka/) | Yes | Requires Data Prepper 2.x. Events are serialized to Apache Kafka and reconstructed on the consumer side. |
| `zero` | Yes | Events pass directly to the sink with no buffering. |

## Metrics

The `opensearch_api` source emits the following metrics.

### Counters

The following table lists the counter metrics.

| Metric | Description |
|--------|-------------|
| `requestsReceived` | The total number of requests received by the endpoint. |
| `successRequests` | The total number of requests successfully processed (200). |
| `badRequests` | The total number of requests with invalid format (400). |
| `requestTimeouts` | The total number of requests that timed out (408). |
| `requestsTooLarge` | The total number of requests exceeding buffer capacity (413). |
| `requestsRejected` | The total number of requests rejected due to full capacity (429). |
| `internalServerError` | The total number of requests with internal errors (500). |

### Timer

The following table lists the timer metric.

| Metric | Description |
|--------|-------------|
| `requestProcessDuration` | The request processing latency, in seconds. |

### Distribution summary

The following table lists the distribution summary metric.

| Metric | Description |
|--------|-------------|
| `payloadSize` | The distribution of incoming request payload sizes, in bytes. |

## Examples

The following examples demonstrate common configurations for the `opensearch_api` source.

### Basic pipeline with an OpenSearch sink

The following example configures a pipeline that receives bulk requests and writes events to an OpenSearch sink using metadata attributes:

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
{% include copy.html %}

### SSL enabled

The following example enables SSL with HTTP basic authentication:

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
{% include copy.html %}

### Sending data using cURL

The following example sends a bulk request to the `opensearch_api` source using cURL:

```bash
curl -XPOST "http://localhost:9202/opensearch/_bulk" \
  -H "Content-Type: application/json" \
  -d '{"index":{"_index":"movies","_id":"1"}}
{"title":"Rush","year":2013}
{"delete":{"_index":"movies","_id":"2"}}
'
```
{% include copy-curl.html %}

### Sending data using opensearch-py

The following example sends a bulk request using the `opensearch-py` client:

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
{% include copy.html %}
