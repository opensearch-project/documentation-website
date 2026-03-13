---
layout: default
title: substringBeforeLast()
parent: Functions
grand_parent: Pipelines
nav_order: 60
---

# substringBeforeLast()

The `substringBeforeLast()` function is used to extract the portion of a string that precedes the last occurrence of a specified delimiter. It takes two arguments:

- The first argument is either a literal string or a JSON pointer that represents the source string.

- The second argument is the delimiter string to search for within the first argument.

If the delimiter is found, the function returns everything before the last occurrence of the delimiter. If the delimiter is not found, the original string is returned. If the source resolves to `null`, the function returns `null`. If the delimiter is `null` or empty, the original string is returned.

For example, if you want to strip the file extension from a filename field, you can use the `substringBeforeLast()` function as follows:

```
'substringBeforeLast(/filename, ".")'
```
{% include copy.html %}

If `/filename` contains `archive.tar.gz`, this returns `archive.tar`.

Alternatively, you can use a literal string as the first argument:

```
'substringBeforeLast("one-two-three", "-")'
```
{% include copy.html %}

This returns `one-two` because it extracts everything before the last `-`.

The `substringBeforeLast()` function performs a case-sensitive search.
{: .note}

## Example

The following pipeline uses the `substringBeforeLast()` function to extract the directory path from a full file path and adds it as a new field called `directory`:

```yaml
substring-before-last-demo:
  source:
    http:
      ssl: false

  processor:
    - add_entries:
        entries:
          - key: directory
            value_expression: 'substringBeforeLast(/filepath, "/")'

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
        {"filepath":"/var/log/syslog"},
        {"filepath":"/home/user/docs/report.pdf"}
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
          "filepath": "/var/log/syslog",
          "directory": "/var/log"
        }
      },
      {
        "_index": "demo-index-2026.03.13",
        "_id": "def456",
        "_score": 1,
        "_source": {
          "filepath": "/home/user/docs/report.pdf",
          "directory": "/home/user/docs"
        }
      }
    ]
  }
}
```
