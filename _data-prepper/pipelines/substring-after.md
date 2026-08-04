---
layout: default
title: substringAfter()
parent: Functions
grand_parent: Pipelines
nav_order: 60
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/substring-after/
---

# substringAfter()

The `substringAfter()` function is used to extract the portion of a string that follows the first occurrence of a specified delimiter. It takes two arguments:

1. The first argument is either a literal string or a JSON pointer that represents the source string.

1. The second argument is the delimiter string to search for within the first argument.

If the delimiter is found, the function returns the portion of the string after the first occurrence of the delimiter. If the delimiter is not found, the original string is returned. If the source resolves to `null`, the function returns `null`. If the delimiter is `null` or empty, the original string is returned.

For example, to extract the value after the first occurrence of the `=` character in a field named `header`, use the `substringAfter()` function as follows:

```
'substringAfter(/header, "=")'
```
{% include copy.html %}

If `/header` contains `Content-Type=application/json`, the function returns `application/json`.

Alternatively, you can use a literal string as the first argument:

```
'substringAfter("hello-world-foo", "-")'
```
{% include copy.html %}

The function returns `world-foo` because it extracts the portion of the string after the first `-` character.

The `substringAfter()` function performs a case-sensitive search.
{: .note}

## Example

The following pipeline uses the `substringAfter()` function to extract the domain name from an email address field. It adds the extracted domain name as a new field called `domain`:

```yaml
substring-after-demo:
  source:
    http:
      ssl: false

  processor:
    - add_entries:
        entries:
          - key: domain
            value_expression: 'substringAfter(/email, "@")'

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
        {"email":"user@example.com"},
        {"email":"admin@opensearch.org"}
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
        "_index": "demo-index-2026.03.13",
        "_id": "abc123",
        "_score": 1,
        "_source": {
          "email": "user@example.com",
          "domain": "example.com"
        }
      },
      {
        "_index": "demo-index-2026.03.13",
        "_id": "def456",
        "_score": 1,
        "_source": {
          "email": "admin@opensearch.org",
          "domain": "opensearch.org"
        }
      }
    ]
  }
}
```
