---
layout: default
title: startsWith()
parent: Functions
grand_parent: Pipelines
nav_order: 40
---

# startsWith()

The `startsWith()` function checks whether a string starts with the given string. It takes two arguments:

- The first argument is either a literal string or a JSON pointer that represents the field or value to be checked.

- The second argument is the string to be checked in the first argument.
The function returns `true` if the string or field value represented by the first argument starts with the string specified in the second argument and `false` otherwise.

For example, to check whether the value of a field name `message` starts with a string `"abcd"`, use the `startsWith()` function as follows:

```
startsWith('/message', 'abcd')
```
{% include copy.html %}

This call returns `true` if the `message` field starts with the string `abcd` or `false` if it does not.

Alternatively, you can use a literal string as the first argument:

```
startsWith('abcdef', 'abcd')
```
{% include copy.html %}

In this case, the function returns `true` because the string `abcdef` starts with `abcd`.

The `startsWith()` function performs a case-sensitive check.
{: .note }

## Example

The following pipeline uses `startsWith()` to add two boolean flags `starts_abcd` and `starts_error`, and only forwards events to OpenSearch that beginning with "ERROR:":

```yaml
startswith-demo:
  source:
    http:
      ssl: false

  processor:
    - add_entries:
        entries:
          - key: starts_abcd
            value_expression: startsWith(/message, "abcd")

          - key: starts_error
            value_expression: startsWith(/message, "ERROR:")

    # forward only messages that start with "ERROR:"
    - drop_events:
        drop_when: not startsWith(/message, "ERROR:")

  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]  
        insecure: true  
        username: admin
        password: admin_pass
        index_type: custom
        index: startswith-demo-%{yyyy.MM.dd}
```
{% include copy.html %}

You can test the pipeline using the following command:

```bash
curl -X POST "http://localhost:2021/log/ingest" \
  -H "Content-Type: application/json" \
  -d '[                                                              
        {"message":"ok hello"},
        {"message":"abcd-hello"},
        {"message":"ERROR: something bad"},
        {"message":"ERROR: abcd unit test failed"}
      ]'
```
{% include copy.html %}

The documents stored in OpenSearch contain the following information:

```json
{
  ...
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "startswith-demo-2025.11.10",
        "_id" : "X97tbpoBnoSLj36HBGoL",
        "_score" : 1.0,
        "_source" : {
          "starts_abcd" : false,
          "starts_error" : true,
          "message" : "ERROR: something bad"
        }
      },
      {
        "_index" : "startswith-demo-2025.11.10",
        "_id" : "YN7tbpoBnoSLj36HBGoL",
        "_score" : 1.0,
        "_source" : {
          "starts_abcd" : false,
          "starts_error" : true,
          "message" : "ERROR: abcd unit test failed"
        }
      }
    ]
  }
}
```