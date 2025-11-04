---
layout: default
title: OTel logs 
parent: Sources
grand_parent: Pipelines
nav_order: 60
---

# OTel logs source


The `otel_logs_source` source is an OpenTelemetry source that follows the [OpenTelemetry Protocol Specification](https://github.com/open-telemetry/oteps/blob/master/text/0035-opentelemetry-protocol.md) and receives logs from the OTel Collector in the form of `ExportLogsServiceRequest` records.

This source supports the `OTLP/gRPC` protocol.
{: .note}

## Configuration

You can configure the `otel_logs_source` source with the following options. 

| Option | Type | Description |
| :--- | :--- | :--- |
| port | Integer | Represents the port that the `otel_logs_source` source is running on. Default value is `21892`. |
| path | String | Represents the path for sending unframed HTTP requests. You can use this option to support an unframed gRPC request with an HTTP idiomatic path to a configurable path. The path should start with `/`, and its length should be at least 1. The `/opentelemetry.proto.collector.logs.v1.LogsService/Export` endpoInteger is disabled for both gRPC and HTTP requests if the path is configured. The path can contain a `${pipelineName}` placeholder, which is replaced with the pipeline name. If the value is empty and `unframed_requests` is `true`, then the source provides the path `/opentelemetry.proto.collector.logs.v1.LogsService/Export`. |
| max_request_length | String | The maximum number of bytes allowed in the payload of a single gRPC or HTTP request. Default value is `10mb`. |
| request_timeout | Integer | Represents the request timeout duration in milliseconds. Default value is `10000`. |
| health_check_service | Boolean | Enables the gRPC health check service under `grpc.health.v1/Health/Check`. Default value is `false`. |
| proto_reflection_service | Boolean | Enables a reflection service for Protobuf services (see [ProtoReflectionService](https://grpc.github.io/grpc-java/javadoc/io/grpc/protobuf/services/ProtoReflectionService.html) and [gRPC reflection](https://github.com/grpc/grpc-java/blob/master/documentation/server-reflection-tutorial.md)). Default value is `false`. |
| unframed_requests | Boolean | Enables requests that are not framed using the gRPC wire protocol. Default value is `false`. |
| thread_count  | Integer | The number of threads to keep in the `ScheduledThreadPool`. Default value is `500`. |
| max_connection_count | Integer | The maximum number of open connections allowed. Default value is `500`. |
| compression | String | The compression type applied to the client request payload. Valid values are `none` or `gzip`. Use `gzip` to apply GZip decompression to the incoming request. Default is `none` (no compression). |
| output_format | String | Specifies the output format of the generated events. Valid values are `otel` or `opensearch`. Default is `opensearch`. |

### SSL

You can configure SSL in the `otel_logs_source` source with the following options.

| Option | Type | Description |
| :--- | :--- | :--- |
| ssl | Boolean | Enables TLS/SSL. Default value is `true`. |
| sslKeyCertChainFile | String | Represents the SSL certificate chain file path or Amazon Simple Storage Service (Amazon S3) path. For example, see the Amazon S3 path `s3://<bucketName>/<path>`. Required if `ssl` is set to `true`.  |
| sslKeyFile | String | Represents the SSL key file path or Amazon S3 path. For example, see the Amazon S3 path `s3://<bucketName>/<path>`. Required if `ssl` is set to `true`.  |
| useAcmCertForSSL | Boolean | Enables TLS/SSL using a certificate and private key from AWS Certificate Manager (ACM). Default value is `false`. |
| acmCertificateArn | String | Represents the ACM certificate Amazon Resource Name (ARN). ACM certificates take precedence over Amazon S3 or local file system certificates. Required if `useAcmCertForSSL` is set to `true`. |
| awsRegion | String | Represents the AWS Region used by ACM or Amazon S3. Required if `useAcmCertForSSL` is set to `true` or `sslKeyCertChainFile` or `sslKeyFile` is the Amazon S3 path. |

## Usage

To get started, create a `pipeline.yaml` file and add `otel_logs_source` as the source:

```yaml
source:
  otel_logs_source:
```
{% include copy.html %}

To generate data in the OpenTelemetry format, set the `output_format` setting to `otel`, as shown in the following example:

```yaml
source:
  otel_logs_source:
    output_format: otel
```
{% include copy.html %}

## Example

The following pipeline demonstrates Data Prepper receiving OTLP logs over HTTPS using PEM certificate and key, with unframed HTTP at a custom path, accepting gzip payloads, and indexing them into OpenSearch using the OpenTelemetry field schema:

```yaml
otel-logs-otel-output:
  source:
    otel_logs_source:
      ssl: true
      sslKeyFile: /usr/share/data-prepper/certs/dp-key.pem
      sslKeyCertChainFile: /usr/share/data-prepper/certs/dp-cert.pem
      unframed_requests: true
      path: /ingest/${pipelineName}/v1/logs
      compression: gzip
      output_format: otel
      request_timeout: 15000
      health_check_service: true
      proto_reflection_service: true
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        index: "otel-logs-otel-output"
        username: "admin"
        password: "admin_pass"
        insecure: true
```
{% include copy.html %}

You can test this pipeline using the following commands:

```bash
cat > /tmp/otel-log3.json <<'JSON'
{
  "resourceLogs": [{
    "resource": {"attributes":[
      {"key":"service.name","value":{"stringValue":"checkout"}},
      {"key":"service.version","value":{"stringValue":"1.4.2"}}
    ]},
    "scopeLogs": [{
      "scope": {"name":"manual-gzip"},
      "logRecords": [{
        "timeUnixNano": "1739999999000000000",
        "severityText": "ERROR",
        "body": {"stringValue":"payment gateway timeout"},
        "attributes":[
          {"key":"region","value":{"stringValue":"eu-west-1"}},
          {"key":"latency_ms","value":{"doubleValue":1234.5}}
        ]
      }]
    }]
  }]
}
JSON

gzip -c /tmp/otel-log3.json > /tmp/otel-log3.json.gz

curl -s -X POST "https://localhost:21892/ingest/otel-logs-otel-output/v1/logs" \
  -H 'Content-Type: application/json' \
  -H 'Content-Encoding: gzip' \
  --insecure \
  --data-binary @/tmp/otel-log3.json.gz
```
{% include copy.html %}

The document stored in OpenSearch contains the following information:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "otel-logs-otel-output",
        "_id": "l24NBpoBk9xzgdmMXFDm",
        "_score": 1,
        "_source": {
          "traceId": "",
          "instrumentationScope": {
            "name": "manual-gzip",
            "droppedAttributesCount": 0
          },
          "resource": {
            "attributes": {
              "service.name": "checkout",
              "service.version": "1.4.2"
            },
            "schemaUrl": "",
            "droppedAttributesCount": 0
          },
          "flags": 0,
          "severityNumber": 0,
          "body": "payment gateway timeout",
          "schemaUrl": "",
          "spanId": "",
          "severityText": "ERROR",
          "attributes": {
            "region": "eu-west-1",
            "latency_ms": 1234.5
          },
          "time": "2025-02-19T21:19:59Z",
          "droppedAttributesCount": 0,
          "observedTimestamp": "1970-01-01T00:00:00Z"
        }
      }
    ]
  }
}
```

## Metrics

You can use the following metrics with the `otel_logs_source` source.

| Option | Type | Description |
| :--- | :--- | :--- | 
| `requestTimeouts` | Counter | Measures the total number of requests that time out. | 
| `requestsReceived` | Counter | Measures the total number of requests received by the `otel_logs_source` source. |
| `badRequests` | Counter | Measures the total number of requests that could not be parsed. |
| `requestsTooLarge` | Counter | Measures the total number of requests that exceed the maximum allowed size. Indicates that the size of the data being written into the buffer is beyond the buffer's maximum capacity. |
| `internalServerError` | Counter | Measures the total number of requests that are erroneous due to errors other than `requestTimeouts` or `requestsTooLarge`. |
| `successRequests` | Counter | Measures the total number of requests successfully written to the buffer. |
| `payloadSize` | Distribution summary | Measures the distribution of all incoming payload sizes. |
| `requestProcessDuration` | Timer | Measures the duration of request processing. |
