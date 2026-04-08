---
layout: default
title: Drop events
parent: Processors
grand_parent: Pipelines
nav_order: 130
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/drop-events/
---

# Drop events processor

The `drop_events` processor drops all the events that are passed into it. The following table describes when events are dropped and how exceptions for dropping events are handled. 

Option | Required | Type | Description
:--- | :--- | :--- | :---
drop_when | Yes | String | Accepts an OpenSearch Data Prepper expression string following the [expression syntax]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/). Configuring `drop_events` with `drop_when: true` drops all the events received.
handle_failed_events | No | Enum | Specifies how exceptions are handled when an exception occurs while evaluating an event. Default is `drop`, which drops the event so that it is not sent to any sinks or further processors. Valid values are: <br> - `drop`: The event will be dropped and a warning will be logged.<br> - `drop_silently`: The event will be dropped without warning. <br> - `skip`: The event will not be dropped and a warning will be logged. <br> - `skip_silently`: The event will not be dropped and no warning will be logged.<br>For more information, see [handle_failed_events](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/drop-events-processor#handle_failed_events).

## Examples

The following are examples of pipeline configurations using `drop_events` processors.

The examples don't use security and are for demonstration purposes only. We strongly recommend configuring SSL before using these examples in production.
{: .warning}

### Filter out debug logs

The following example configuration demonstrates filtering out `DEBUG` level logs to reduce noise and storage costs while allowing `INFO`, `WARN`, and `ERROR` events:

```yaml
filter-debug-logs-pipeline:
  source:
    http:
      path: /events
      ssl: false

  processor:
    - drop_events:
        drop_when: '/level == "DEBUG"'
        handle_failed_events: drop

  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: admin_pass
        index_type: custom
        index: filtered-logs-%{yyyy.MM.dd}
```
{% include copy.html %}

You can test this pipeline using the following command:

```bash
curl -sS -X POST "http://localhost:2021/events" \
  -H "Content-Type: application/json" \
  -d '[
        {"level": "DEBUG", "message": "Database connection established", "service": "user-service", "timestamp": "2023-10-13T14:30:45Z"},
        {"level": "INFO", "message": "User login successful", "service": "user-service", "timestamp": "2023-10-13T14:31:00Z"},
        {"level": "ERROR", "message": "Database connection failed", "service": "user-service", "timestamp": "2023-10-13T14:32:00Z"},
        {"level": "WARN", "message": "Cache miss detected", "service": "user-service", "timestamp": "2023-10-13T14:33:00Z"}
      ]'
```
{% include copy.html %}

The documents stored in OpenSearch contain the following information:

```json
{
  ...
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "filtered-logs-2025.10.13",
        "_id": "1zsA3pkBWoWOQ0uhY3EJ",
        "_score": 1,
        "_source": {
          "level": "INFO",
          "message": "User login successful",
          "service": "user-service",
          "timestamp": "2023-10-13T14:31:00Z"
        }
      },
      {
        "_index": "filtered-logs-2025.10.13",
        "_id": "2DsA3pkBWoWOQ0uhY3EJ",
        "_score": 1,
        "_source": {
          "level": "ERROR",
          "message": "Database connection failed",
          "service": "user-service",
          "timestamp": "2023-10-13T14:32:00Z"
        }
      },
      {
        "_index": "filtered-logs-2025.10.13",
        "_id": "2TsA3pkBWoWOQ0uhY3EJ",
        "_score": 1,
        "_source": {
          "level": "WARN",
          "message": "Cache miss detected",
          "service": "user-service",
          "timestamp": "2023-10-13T14:33:00Z"
        }
      }
    ]
  }
}
```

### Multi-condition event filtering

The following example shows how to drop events based on multiple criteria, such as debug logs, error status codes, and missing user IDs, in order to ensure that only valid and important events reach OpenSearch:

```yaml
multi-condition-filter-pipeline:
  source:
    http:
      path: /events
      ssl: false

  processor:
    - drop_events:
        drop_when: '/level == "DEBUG" or /status_code >= 400 or /user_id == null'
        handle_failed_events: drop_silently
    
    - date:
        from_time_received: true
        destination: "@timestamp"

  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: admin_pass
        index_type: custom
        index: filtered-events-%{yyyy.MM.dd}
```
{% include copy.html %}

You can test this pipeline using the following command:

```bash
curl -sS -X POST "http://localhost:2021/events" \
  -H "Content-Type: application/json" \
  -d '[
        {"level": "DEBUG", "message": "Cache hit", "status_code": 200, "user_id": "user123", "timestamp": "2023-10-13T14:33:00Z"},
        {"level": "INFO", "message": "Request failed", "status_code": 500, "user_id": "user123", "timestamp": "2023-10-13T14:34:00Z"},
        {"level": "INFO", "message": "Anonymous request", "status_code": 200, "timestamp": "2023-10-13T14:35:00Z"},
        {"level": "INFO", "message": "User request processed", "status_code": 200, "user_id": "user123", "timestamp": "2023-10-13T14:36:00Z"},
        {"level": "INFO", "message": "Another valid request", "status_code": 201, "user_id": "user456", "timestamp": "2023-10-13T14:37:00Z"}
      ]'
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
        "_index": "filtered-events-2025.10.13",
        "_id": "7DsB3pkBWoWOQ0uhmHH4",
        "_score": 1,
        "_source": {
          "level": "INFO",
          "message": "User request processed",
          "status_code": 200,
          "user_id": "user123",
          "timestamp": "2023-10-13T14:36:00Z",
          "@timestamp": "2025-10-13T14:37:47.636Z"
        }
      },
      {
        "_index": "filtered-events-2025.10.13",
        "_id": "7TsB3pkBWoWOQ0uhmHH4",
        "_score": 1,
        "_source": {
          "level": "INFO",
          "message": "Another valid request",
          "status_code": 201,
          "user_id": "user456",
          "timestamp": "2023-10-13T14:37:00Z",
          "@timestamp": "2025-10-13T14:37:47.636Z"
        }
      }
    ]
  }
}
```

### Intelligent data sampling

The following example demonstrates how to implement sampling strategies that drop high-volume traffic based on request ID patterns and internal IP addresses in order to manage data volume while preserving representative samples:

```yaml
sampling-pipeline:
  source:
    http:
      path: /events
      ssl: false

  processor:
    # Sample based on request_id being in specific sets
    - drop_events:
        drop_when: '/sampling_rate > 0.4 and /request_id not in {1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000}'
        handle_failed_events: skip
    
    - drop_events:
        drop_when: '/source_ip =~ "^192.168.*"'
        handle_failed_events: skip

  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: admin_pass
        index_type: custom
        index: sampled-events-%{yyyy.MM.dd}
```
{% include copy.html %}

You can test this pipeline using the following command:

```bash
curl -sS -X POST "http://localhost:2021/events" \
  -H "Content-Type: application/json" \
  -d '[
        {"request_id": 12345, "sampling_rate": 0.9, "source_ip": "10.0.0.1", "message": "High volume request - dropped", "timestamp": "2023-10-13T14:37:00Z"},
        {"request_id": 5000, "sampling_rate": 0.9, "source_ip": "10.0.0.1", "message": "High volume request - sampled", "timestamp": "2023-10-13T14:37:30Z"},
        {"request_id": 12346, "sampling_rate": 0.6, "source_ip": "192.168.1.100", "message": "Internal request - dropped", "timestamp": "2023-10-13T14:38:00Z"},
        {"request_id": 12347, "sampling_rate": 0.3, "source_ip": "203.0.113.45", "message": "External request - passed", "timestamp": "2023-10-13T14:39:00Z"},
        {"request_id": 1000, "sampling_rate": 0.9, "source_ip": "10.0.0.2", "message": "Another sampled request", "timestamp": "2023-10-13T14:40:00Z"}
      ]'
```
{% include copy.html %}

The documents stored in OpenSearch contain the following information:

```json
{
  ...
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "sampled-events-2025.10.13",
        "_id": "i2Ej3pkBh3nNS_N9KazV",
        "_score": 1,
        "_source": {
          "request_id": 5000,
          "sampling_rate": 0.9,
          "source_ip": "10.0.0.1",
          "message": "High volume request - sampled",
          "timestamp": "2023-10-13T14:37:30Z"
        }
      },
      {
        "_index": "sampled-events-2025.10.13",
        "_id": "jGEj3pkBh3nNS_N9KazV",
        "_score": 1,
        "_source": {
          "request_id": 12347,
          "sampling_rate": 0.3,
          "source_ip": "203.0.113.45",
          "message": "External request - passed",
          "timestamp": "2023-10-13T14:39:00Z"
        }
      },
      {
        "_index": "sampled-events-2025.10.13",
        "_id": "jWEj3pkBh3nNS_N9KazV",
        "_score": 1,
        "_source": {
          "request_id": 1000,
          "sampling_rate": 0.9,
          "source_ip": "10.0.0.2",
          "message": "Another sampled request",
          "timestamp": "2023-10-13T14:40:00Z"
        }
      }
    ]
  }
}
```
