---
layout: default
title: join()
parent: Functions
grand_parent: Pipelines
nav_order: 25
---

# join()


The `join()` function joins elements of a list to form a string. The function takes a JSON pointer, which represents the key to a list or map where values are of the list type, and joins the lists as strings using a delimiter. Commas are the default delimiter between strings.

## Parameters

- **delimiter** (string, optional): The string placed between elements. Examples: `","`, `" | "`, `"; "`. Default is `","`.
- **pointer** (required): JSON Pointer resolving to a list in the event.

## Returns
- **string**: All elements concatenated with the chosen delimiter.

## Quick examples
- `join("-", /labels)` returns `"prod-api-us"` for `labels: ["prod","api","us"]`
- `join(" | ", /authors)` returns `"Ada | Linus | Grace"` for `authors: ["Ada","Linus","Grace"]

## Using `join()` in pipeline

You can use `join()` inside processors that support `value_expression`, for example `add_entries`:

```yaml
processor:
  - add_entries:
      entries:
        - key: labels_csv
          value_expression: join(" | ", /labels)
```

## Example

The following pipeline ingests JSON events using the HTTP source, uses `add_entries` with `join()` to build two new fields, `labels_csv` and `authors_pipe`:

```yaml
join-demo:
  source:
    http:
      path: /events
      ssl: false
  processor:
    - add_entries:
        entries:
          - key: labels_csv
            value_expression: join(/labels) # Comma is used by default
          - key: authors_pipe
            value_expression: join(" | ", /authors)
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        index: join-demo-%{yyyy.MM.dd}
        username: admin
        password: admin_password
        index_type: custom
        insecure: true  # set to true for self-signed local clusters
```
{% include copy.html %}

You can test the pipeline using the following command:

```bash
curl "http://localhost:2021/events" \
   -H "Content-Type: application/json" \
   -d '[
    {"message":"hello","labels":["prod","api","us"],"authors":["Ada","Linus","Grace"]},
    {"message":"world","labels":["stage","etl"],"authors":["Marie","Alan"]}
  ]'
```
{% include copy.html %}

The document stored in OpenSearch contains the following information:

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
        "_index": "join-demo-2025.11.06",
        "_id": "aGFyWZoBjfY5UoR7NC36",
        "_score": 1,
        "_source": {
          "message": "hello",
          "labels": [
            "prod",
            "api",
            "us"
          ],
          "authors": [
            "Ada",
            "Linus",
            "Grace"
          ],
          "labels_csv": "prod,api,us",
          "authors_pipe": "Ada | Linus | Grace"
        }
      },
      {
        "_index": "join-demo-2025.11.06",
        "_id": "aWFyWZoBjfY5UoR7NC36",
        "_score": 1,
        "_source": {
          "message": "world",
          "labels": [
            "stage",
            "etl"
          ],
          "authors": [
            "Marie",
            "Alan"
          ],
          "labels_csv": "stage,etl",
          "authors_pipe": "Marie | Alan"
        }
      }
    ]
  }
}
```