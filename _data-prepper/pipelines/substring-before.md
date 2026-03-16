---
layout: default
title: substringBefore()
parent: Functions
grand_parent: Pipelines
nav_order: 80
---

# substringBefore()

The `substringBefore()` function is used to extract the portion of a string that precedes the first occurrence of a specified delimiter. It takes two arguments:

1. The first argument is either a literal string or a JSON pointer that represents the source string.

1. The second argument is the delimiter string to search for within the first argument.

If the delimiter is found, the function returns the portion of the string before the first occurrence of the delimiter. If the delimiter is not found, the original string is returned. If the source resolves to `null`, the function returns `null`. If the delimiter is `null` or empty, the original string is returned.

For example, to extract the username from an email address field, use the `substringBefore()` function as follows:

```
'substringBefore(/email, "@")'
```
{% include copy.html %}

If the `/email` field contains `user@example.com`, the function returns `user`.

Alternatively, you can use a literal string as the first argument:

```
'substringBefore("hello-world-foo", "-")'
```
{% include copy.html %}

The function returns `hello` because it extracts the portion of the string before the first `-` character.

The `substringBefore()` function performs a case-sensitive search.
{: .note}

## Example

The following pipeline uses the `substringBefore()` function to extract the URL protocol from a URL field. It adds the extracted protocol as a new field called `protocol`:

```yaml
substring-before-demo:
  source:
    http:
      ssl: false

  processor:
    - add_entries:
        entries:
          - key: protocol
            value_expression: 'substringBefore(/url, "://")'

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
        {"url":"https://opensearch.org/docs"},
        {"url":"http://example.com/page"}
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
          "url": "https://opensearch.org/docs",
          "protocol": "https"
        }
      },
      {
        "_index": "demo-index-2026.03.13",
        "_id": "def456",
        "_score": 1,
        "_source": {
          "url": "http://example.com/page",
          "protocol": "http"
        }
      }
    ]
  }
}
```
