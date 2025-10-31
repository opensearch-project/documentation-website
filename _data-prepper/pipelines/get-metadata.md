---
layout: default
title: getMetadata()
parent: Functions
grand_parent: Pipelines
nav_order: 15
---

# getMetadata()

The `getMetadata()` function takes one literal string argument and looks up specific keys in event metadata. 

If the key contains a `/`, then the function looks up the metadata recursively. When passed, the expression returns the value corresponding to the key. 

The value returned can be of any type. For example, if the metadata contains `{"key1": "value2", "key2": 10}`, then the function `getMetadata("key1")` returns `value2`. The function `getMetadata("key2")` returns `10`.

## Example 

The following pipeline writes request derived values into event metadata, then uses `getMetadata()` in the OpenSearch sink to build tenant scoped daily index names and document IDs:

```yaml
metadata-pass-demo:
  source:
    http:
      ssl: false

  processor:
    - add_entries:
        entries:
          - metadata_key: "tenant"         # write to metadata
            value_expression: "/tenant"
          - metadata_key: "ingest_marker"
            value: "batch-001"
    - add_entries:
        entries:
          - key: "tenant_from_meta"
            value_expression: 'getMetadata("tenant")'

  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: "admin_pass"
        index_type: custom
        # Use metadata inside sink format strings
        index: 'demo-%{yyyy.MM.dd}-${getMetadata("tenant")}'
        document_id: '${/id}-${getMetadata("tenant")}'
```
{% include copy.html %}

You can test the pipeline using the following command:

```bash
curl -sS -X POST "http://localhost:2021/events" \
  -H "Content-Type: application/json" \
  -d '[{"id":"1","tenant":"eu","message":"hello"}, {"id":"2","tenant":"us","message":"hi"}]'
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
        "_index": "demo-2025.10.22-eu",
        "_id": "1-eu",
        "_score": 1,
        "_source": {
          "id": "1",
          "tenant": "eu",
          "message": "hello",
          "tenant_from_meta": "eu"
        }
      },
      {
        "_index": "demo-2025.10.22-us",
        "_id": "2-us",
        "_score": 1,
        "_source": {
          "id": "2",
          "tenant": "us",
          "message": "hi",
          "tenant_from_meta": "us"
        }
      }
    ]
  }
}
```
