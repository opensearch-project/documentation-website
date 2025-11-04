---
layout: default
title: OTel trace source
parent: Sources
grand_parent: Pipelines
nav_order: 80
redirect_from:
  - /data-prepper/pipelines/configuration/sources/otel-trace/
---


# OTel trace source 

The `otel_trace_source` is a source for the OpenTelemetry Collector. The following table describes options you can use to configure the `otel_trace_source` source.

## Configuration

You can configure the `otel_trace_source` source with the following options. 

Option | Required | Type | Description
:--- | :--- | :--- | :---
port | No | Integer | The port that the `otel_trace_source` source runs on. Default value is `21890`.
request_timeout | No | Integer | The request timeout, in milliseconds. Default value is `10000`.
health_check_service | No | Boolean | Enables a gRPC health check service under `grpc.health.v1/Health/Check`. Default value is `false`.
unauthenticated_health_check | No | Boolean | Determines whether or not authentication is required on the health check endpoint. OpenSearch Data Prepper ignores this option if no authentication is defined. Default value is `false`.
proto_reflection_service | No | Boolean | Enables a reflection service for Protobuf services (see [gRPC reflection](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) and [gRPC Server Reflection Tutorial](https://github.com/grpc/grpc-java/blob/master/documentation/server-reflection-tutorial.md) docs). Default value is `false`.
unframed_requests | No | Boolean | Enable requests not framed using the gRPC wire protocol.
thread_count | No | Integer | The number of threads to keep in the ScheduledThreadPool. Default value is `200`.
max_connection_count | No | Integer | The maximum allowed number of open connections. Default value is `500`.
| `output_format` | String | Specifies the output format of the generated events. Valid values are `otel` or `opensearch`. Default is `opensearch`. |
max_request_length | No | ByteCount | The maximum number of bytes allowed in the payload of a single gRPC or HTTP request. Default value is `10mb`.
ssl | No | Boolean | Enables connections to the OTel source port over TLS/SSL. Defaults to `true`.
sslKeyCertChainFile | Conditionally | String | File system path or Amazon Simple Storage Service (Amazon S3) path to the security certificate (for example, `"config/demo-data-prepper.crt"` or `"s3://my-secrets-bucket/demo-data-prepper.crt"`). Required if `ssl` is set to `true`.
sslKeyFile | Conditionally | String | File system path or Amazon S3 path to the security key (for example, `"config/demo-data-prepper.key"` or `"s3://my-secrets-bucket/demo-data-prepper.key"`). Required if `ssl` is set to `true`.
useAcmCertForSSL | No | Boolean | Whether to enable TLS/SSL using a certificate and private key from AWS Certificate Manager (ACM). Default value is `false`.
acmCertificateArn | Conditionally | String | Represents the ACM certificate ARN. ACM certificate take preference over S3 or local file system certificate. Required if `useAcmCertForSSL` is set to `true`.
awsRegion | Conditionally | String | Represents the AWS region used by ACM or Amazon S3. Required if `useAcmCertForSSL` is set to `true` or `sslKeyCertChainFile` and `sslKeyFile` are Amazon S3 paths.
authentication | No | Object | An authentication configuration. By default, an unauthenticated server is created for the pipeline. This parameter uses pluggable authentication for HTTPS. To use basic authentication, define the `http_basic` plugin with a `username` and `password`. To provide customer authentication, use or create a plugin that implements [GrpcAuthenticationProvider](https://github.com/opensearch-project/data-prepper/blob/1.2.0/data-prepper-plugins/armeria-common/src/main/java/com/amazon/dataprepper/armeria/authentication/GrpcAuthenticationProvider.java).

## Usage

To use the `otel-metrics` source, create the following `pipeline.yaml` file with `otel_metrics_source` as the source:

```yaml
source:
  otel_trace_source:
```
{% include copy.html %}

If you want to use the OpenTelemetry format for your output, set the `output_format` to `otel`, as shown in the following example:

```yaml
source:
  otel_trace_source:
    output_format: otel
```
{% include copy.html %}

## Example

The following example demonstrates Data Prepper ingesting OTLP traces over HTTPS using a PEM cert and key with unframed HTTP at a custom path, accepting gzip payloads, preserving OTel shaped documents, and indexing them into OpenSearch:

```yaml
otel-traces-https:
  source:
    otel_trace_source:
      ssl: true
      sslKeyFile: /usr/share/data-prepper/certs/dp-key.pem
      sslKeyCertChainFile: /usr/share/data-prepper/certs/dp-cert.pem
      unframed_requests: true
      path: /ingest/${pipelineName}/v1/traces
      compression: gzip
      output_format: otel
      request_timeout: 15000
      health_check_service: true
      proto_reflection_service: true
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        index: otel-traces-https
        username: "admin"
        password: "admin_pass"
        insecure: true
```
{% include copy.html %}

You can test the pipeline using the following command:

```bash
cat > /tmp/otel-trace3.json <<'JSON'
{
  "resourceSpans": [{
    "resource": {"attributes":[
      {"key":"service.name","value":{"stringValue":"billing"}},
      {"key":"service.version","value":{"stringValue":"2.1.0"}}
    ]},
    "scopeSpans": [{
      "scope": {"name":"manual-https"},
      "spans": [{
        "traceId": "1234567890abcdef1234567890abcdef",
        "spanId":  "feedfacecafebeef",
        "name": "PUT /invoice/42",
        "startTimeUnixNano": "1739999999000000000",
        "endTimeUnixNano":   "1740000000000000000",
        "attributes": [
          {"key":"region","value":{"stringValue":"eu-west-1"}},
          {"key":"retry.count","value":{"intValue":"1"}}
        ]
      }]
    }]
  }]
}
JSON

gzip -c /tmp/otel-trace3.json > /tmp/otel-trace3.json.gz

curl -s -X POST "https://localhost:21890/ingest/otel-traces-https/v1/traces" \
  -H 'Content-Type: application/json' \
  -H 'Content-Encoding: gzip' \
  --insecure \
  --data-binary @/tmp/otel-trace3.json.gz
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
        "_index": "otel-traces-https",
        "_id": "V_5RBpoBqZ1V_u-TvYXf",
        "_score": 1,
        "_source": {
          "traceId": "d76df8e7aefcf7469b71d79fd76df8e7aefcf7469b71d79f",
          "droppedLinksCount": 0,
          "instrumentationScope": {
            "name": "manual-https",
            "droppedAttributesCount": 0
          },
          "resource": {
            "schemaUrl": "",
            "attributes": {
              "service.name": "billing",
              "service.version": "2.1.0"
            },
            "droppedAttributesCount": 0
          },
          "kind": "SPAN_KIND_UNSPECIFIED",
          "droppedEventsCount": 0,
          "flags": 0,
          "parentSpanId": "",
          "schemaUrl": "",
          "spanId": "7de79d7da71e71a7de6de79f",
          "traceState": "",
          "name": "PUT /invoice/42",
          "startTime": "2025-02-19T21:19:59Z",
          "attributes": {
            "retry.count": 1,
            "region": "eu-west-1"
          },
          "links": [],
          "endTime": "2025-02-19T21:20:00Z",
          "droppedAttributesCount": 0,
          "durationInNanos": 1000000000,
          "events": [],
          "status": {
            "code": 0,
            "message": ""
          }
        }
      }
    ]
  }
}
```

## Metrics

The `otel_trace_source` source includes the following metrics.

### Counters

- `requestTimeouts`: Measures the total number of requests that time out.
- `requestsReceived`: Measures the total number of requests received by the `otel_trace` source.
- `successRequests`: Measures the total number of requests successfully processed by the `otel_trace` source plugin.
- `badRequests`: Measures the total number of requests with an invalid format processed by the `otel_trace` source plugin.
- `requestsTooLarge`: Measures the total number of requests whose number of spans exceeds the buffer capacity.
- `internalServerError`: Measures the total number of requests processed by the `otel_trace` source with a custom exception type.

### Timers

- `requestProcessDuration`: Measures the latency of requests processed by the `otel_trace` source plugin in seconds.

### Distribution summaries

- `payloadSize`: Measures the incoming request payload size distribution in bytes.
