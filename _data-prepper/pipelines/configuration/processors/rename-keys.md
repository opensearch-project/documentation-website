---
layout: default
title: Rename keys
parent: Processors
grand_parent: Pipelines
nav_order: 310
---

# Rename keys processor

The `rename_keys` processor renames keys in an event.

## Configuration

You can configure the `rename_keys` processor with the following options.

| Option | Required | Description |
| :--- | :--- | :--- |
| `entries` | Yes | A list of event entries to rename. |
| `from_key` | Yes | The key of the entry to be renamed. |
| `to_key` | Yes | The new key of the entry. |
| `overwrite_if_to_key_exists` | No | When set to `true`, the existing value is overwritten if `key` already exists in the event. The default value is `false`. |

## Usage

To get started, create the following `pipeline.yaml` file:

```yaml
rename-keys-nested-pipeline:
  source:
    http:
      path: /logs
      ssl: false
  processor:
    - rename_keys:
        entries:
          # Top-level rename
          - from_key: message
            to_key: msg
          # Level-2 (nested) renames — use slash paths
          - from_key: user/name
            to_key: user/username
          - from_key: user/id
            to_key: user/user_id
          - from_key: http/response/code
            to_key: http/status_code
          # If a target exists already, overwrite it
          - from_key: env
            to_key: metadata/environment
            overwrite_if_to_key_exists: true
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: admin_password
        index_type: custom
        index: rename-%{yyyy.MM.dd}
```
{% include copy.html %}

You can test this pipeline using the following command:

```bash
curl -sS -X POST "http://localhost:2021/logs" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "message": "hello world",
      "user": { "name": "alice", "id": 123 },
      "http": { "response": { "code": 200 } },
      "env": "prod",
      "metadata": { "environment": "staging" }
    },
    {
      "message": "goodbye",
      "user": { "name": "bob", "id": 456 },
      "http": { "response": { "code": 503 } },
      "env": "dev"
    }
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
        "_index": "rename-2025.11.04",
        "_id": "kq3NTpoBNvg1WLcAJOak",
        "_score": 1,
        "_source": {
          "user": {
            "username": "alice",
            "user_id": 123
          },
          "http": {
            "response": {},
            "status_code": 200
          },
          "metadata": {
            "environment": "prod"
          },
          "msg": "hello world"
        }
      },
      {
        "_index": "rename-2025.11.04",
        "_id": "k63NTpoBNvg1WLcAJOak",
        "_score": 1,
        "_source": {
          "user": {
            "username": "bob",
            "user_id": 456
          },
          "http": {
            "response": {},
            "status_code": 503
          },
          "msg": "goodbye",
          "metadata": {
            "environment": "dev"
          }
        }
      }
    ]
  }
}
```

## Special considerations

Renaming operations occur in the order that the key-value pair entries are listed in the `pipeline.yaml` file. This means that chaining (where key-value pairs are renamed in sequence) is implicit in the `rename_keys` processor. See the following example `pipeline.yaml` file:

```yaml
  processor:
    - rename_keys:
        entries:
        - from_key: "message"
          to_key: "message2"
        - from_key: "message2"
          to_key: "message3"
```

If the processor receives `{"message": "hello"}`, the resultng output will be:

```json
{"message3": "hello"}
```
