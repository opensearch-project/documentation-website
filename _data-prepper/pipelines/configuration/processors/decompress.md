---
layout: default
title: Decompress
parent: Processors
grand_parent: Pipelines
nav_order: 90
---

# Decompress processor

The `decompress` processor decompresses any Base64-encoded compressed fields inside of an event.

## Configuration

Option | Required | Type | Description
:--- | :--- | :--- | :---
`keys` | Yes | List<String> | The fields in the event that will be decompressed.                                                                                          
`type` | Yes | Enum | The type of decompression to use for the `keys` in the event. Only `gzip` is supported.                                           
`decompress_when` | No | String| A [Data Prepper conditional expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/) that determines when the `decompress` processor will run on certain events.
`tags_on_failure` | No | List<String> | A list of strings with which to tag events when the processor fails to decompress the `keys` inside an event. Defaults to `_decompression_failure`.                               

## Usage

This example demonstrates a complete pipeline that receives compressed log data, decompresses it, and stores it in OpenSearch:

```yaml
decompress-logs-pipeline:
  source:
    http:
      path: /events
      ssl: false

  processor:
    - decompress:
        keys: ["compressed_log", "compressed_metadata"]
        type: gzip
        tags_on_failure: ["decompression_failed", "gzip_error"]

    # Only parse if decompression succeeded
    - parse_json:
        source: compressed_log
        destination: parsed_log
        parse_when: not hasTags("decompression_failed")

  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: admin_passwrd
        index_type: custom
        index: decompressed-logs-%{yyyy.MM.dd}
        tags_target_key: "tags"
```
{% include copy.html %}

You can test the pipeline using the two following commands:

```bash

GOOD_COMPRESSED_LOG=$(echo '{"message":"Application OK","level":"INFO","service":"api"}' | gzip | base64 | tr -d '\n')
GOOD_COMPRESSED_METADATA=$(echo '{"source_ip":"192.168.1.100","ok":true}' | gzip | base64 | tr -d '\n')

curl -sS -X POST "http://localhost:2021/events" \
  -H "Content-Type: application/json" \
  -d "[
    {
      \"compressed_log\": \"${GOOD_COMPRESSED_LOG}\",
      \"compressed_metadata\": \"${GOOD_COMPRESSED_METADATA}\",
      \"host\": \"web-server-01\",
      \"timestamp\": \"2023-10-13T14:30:45Z\"
    }
  ]"

BAD_COMPRESSED_LOG=$(echo -n 'this is not gzipped' | base64 | tr -d '\n')
GOOD_COMPRESSED_METADATA=$(echo '{"source_ip":"192.168.1.100","ok":true}' | gzip | base64 | tr -d '\n')

curl -sS -X POST "http://localhost:2021/events" \
  -H "Content-Type: application/json" \
  -d "[
    {
      \"compressed_log\": \"${BAD_COMPRESSED_LOG}\",
      \"compressed_metadata\": \"${GOOD_COMPRESSED_METADATA}\",
      \"host\": \"web-server-02\",
      \"timestamp\": \"2023-10-13T14:31:45Z\"
    }
  ]"
```
{% include copy.html %}

The documents stored in OpenSearch contain the following information:

```json
{
  ...
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "decompressed-logs-2025.11.04",
        "_id": "dOv1TpoB5Jwkiy-iuKKs",
        "_score": 1,
        "_source": {
          "compressed_log": """{"message":"Application OK","level":"INFO","service":"api"}
""",
          "compressed_metadata": """{"source_ip":"192.168.1.100","ok":true}
""",
          "host": "web-server-01",
          "timestamp": "2023-10-13T14:30:45Z",
          "parsed_log": {
            "level": "INFO",
            "service": "api",
            "message": "Application OK"
          },
          "tags": []
        }
      },
      {
        "_index": "decompressed-logs-2025.11.04",
        "_id": "dev1TpoB5Jwkiy-iuKKs",
        "_score": 1,
        "_source": {
          "compressed_log": "dGhpcyBpcyBub3QgZ3ppcHBlZA==",
          "compressed_metadata": """{"source_ip":"192.168.1.100","ok":true}
""",
          "host": "web-server-02",
          "timestamp": "2023-10-13T14:31:45Z",
          "tags": [
            "decompression_failed",
            "gzip_error"
          ]
        }
      }
    ]
  }
}
```

## Metrics 

Data Prepper serves metrics from the `/metrics/prometheus` endpoint on port `4900` by default. You can access all the metrics by running the following command:

```bash
curl http://localhost:4900/metrics/prometheus
```
{% include copy.html %}

The following table describes common [abstract processor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java) metrics. 

| Metric name | Type | Description |
| ------------- | ---- | -----------|
| `recordsIn` | Counter | The ingress of records to a pipeline component. |
| `recordsOut` | Counter | The egress of records from a pipeline component. |
| `timeElapsed` | Timer | The time elapsed during execution of a pipeline component. |

### Counter

The `decompress` processor accounts for the following metrics:

* `processingErrors`: The number of processing errors that have occurred in the `decompress` processor.

