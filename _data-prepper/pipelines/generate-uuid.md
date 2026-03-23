---
layout: default
title: generateUuid()
parent: Functions
grand_parent: Pipelines
nav_order: 11
---

# generateUuid()

The `generateUuid()` function takes no arguments and returns a randomly generated [UUID version 4](https://www.rfc-editor.org/rfc/rfc4122) string, for example, `"550e8400-e29b-41d4-a716-446655440000"`. Each call produces a unique value using a cryptographically strong random number generator, so collision probability is negligible in practice.

This function is useful when source records do not contain a natural unique identifier---for example, when running asynchronous batch inference jobs that require a stable key to match inference results back to the original records.

## Usage

Use `generateUuid()` as a `value_expression` in the [`add_entries`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/add-entries/) processor:

```yaml
processor:
  - add_entries:
      entries:
        - key: recordId
          value_expression: 'generateUuid()'
```
{% include copy.html %}

This adds a `recordId` field containing a unique UUID to every event passing through the processor.

## Example

The following pipeline assigns a unique `recordId` to each incoming log record before forwarding it to OpenSearch:

```yaml
uuid-demo-pipeline:
  source:
    http:
      ssl: false

  processor:
    - add_entries:
        entries:
          - key: recordId
            value_expression: 'generateUuid()'

  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: admin_password
        index_type: custom
        index: demo-index-%{yyyy.MM.dd}
```
{% include copy.html %}

Given the following input event:

```json
{ "message": "user login", "user": "alice" }
```
{% include copy.html %}

The document stored in OpenSearch contains the following information:

```json
{
  "message": "user login",
  "user": "alice",
  "recordId": "550e8400-e29b-41d4-a716-446655440000"
}
```
