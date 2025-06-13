---

layout: default
title: Wrapper
parent: Specialized queries
nav_order: 80
---

# Wrapper

The `wrapper` query lets you submit a complete query in Base64-encoded JSON format. It is useful when the query must be embedded in contexts that only support string values.

Use this query only when you need to work around system constraints. For readability and maintainability, it's better to use standard JSON-based queries when possible.

## Example use case

If you want to run the following query:

```json
{
  "match": {
    "title": "headphones"
  }
}
```

Encode this JSON as a Base64 string. The Base64-encoded version is:

```
eyAibWF0Y2giOiB7InRpdGxlIjogImhlYWRwaG9uZXMifSB9
```

Wrap this base64 encoded string in a `wrapper` query:

```json
POST /products/_search
{
  "query": {
    "wrapper": {
      "query": "eyAibWF0Y2giOiB7InRpdGxlIjogImhlYWRwaG9uZXMifSB9"
    }
  }
}
```
{% include copy-curl.html %}

This executes the same query as the original `match` clause.
