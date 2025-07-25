---
layout: default
title: Common REST Parameters
nav_order: 93
canonical_url: https://docs.opensearch.org/latest/api-reference/common-parameters/
---

# Common REST parameters

OpenSearch supports the following parameters for all REST operations:

Option | Description | Example
:--- | :--- | :---
Human-readable output | To convert output units to human-readable values (for example, `1h` for 1 hour and `1kb` for 1,024 bytes), add `?human=true` to the request URL. | `GET <index_name>/_search?human=true`
Pretty result | To get back JSON responses in a readable format, add `?pretty=true` to the request URL. | `GET <index_name>/_search?pretty=true`
Content type | To specify the type of content in the request body, use the `Content-Type` key name in the request header. Most operations support JSON, YAML, and CBOR formats. | `POST _scripts/<template_name> -H 'Content-Type: application/json`
Request body in query string | If the client library does not accept a request body for non-POST requests, use the `source` query string parameter to pass the request body. Also, specify the `source_content_type` parameter with a supported media type such as `application/json`. | `GET _search?source_content_type=application/json&source={"query":{"match_all":{}}}`
Stack traces | To include the error stack trace in the response when an exception is raised, add `error_trace=true` to the request URL. | `GET <index_name>/_search?error_trace=true`
