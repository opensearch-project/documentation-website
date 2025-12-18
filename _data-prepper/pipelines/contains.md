---
layout: default
title: contains()
parent: Functions
grand_parent: Pipelines
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/contains/
---

# contains()

The `contains()` function is used to check if a substring exists within a given string or the value of a field in an event. It takes two arguments:

- The first argument is either a literal string or a JSON pointer that represents the field or value to be searched.

- The second argument is the substring to be searched for within the first argument.
The function returns `true` if the substring specified in the second argument is found within the string or field value represented by the first argument. It returns `false` if it is not.

For example, if you want to check if the string `"abcd"` is contained within the value of a field named `message`, you can use the `contains()` function as follows:

```
'contains(/message, "abcd")'
```
{% include copy.html %}

This call returns `true` if the field `message` contains the substring `abcd` or `false` if it does not.

Alternatively, you can use a literal string as the first argument:

```
'contains("This is a test message", "test")'
```
{% include copy.html %}

In this case, the function returns `true` because the substring `test` is present within the string `This is a test message`.

The `contains()` function performs a case-sensitive search.
{: .note}

## Example

The following pipeline uses the `contains()` function to add a Boolean flag `has_test` based on a substring in `/message` and filters out non-matching events, forwarding only messages that contain the string `ERROR` to OpenSearch:

```yaml
contains-demo-pipeline:
  source:
    http:
      ssl: false

  processor:
    - add_entries:
        entries:
          - key: has_test
            value_expression: contains(/message, "test")
    - drop_events:
        drop_when: not contains(/message, "ERROR")

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

You can test the pipeline using the following command:

```bash
curl -sS -X POST "http://localhost:2021/log/ingest" \
  -H "Content-Type: application/json" \
  -d '[
        {"message":"ok hello"},                  
        {"message":"this has test but ok"},
        {"message":"ERROR: something bad"}, 
        {"message":"ERROR: unit test failed"} 
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
        "_index": "demo-index-2025.10.21",
        "_id": "5YACB5oBqZitdAAb4n3r",
        "_score": 1,
        "_source": {
          "message": "ERROR: something bad",
          "has_test": false
        }
      },
      {
        "_index": "demo-index-2025.10.21",
        "_id": "5oACB5oBqZitdAAb4n3r",
        "_score": 1,
        "_source": {
          "message": "ERROR: unit test failed",
          "has_test": true
        }
      }
    ]
  }
}
```
