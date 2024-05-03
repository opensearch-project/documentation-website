---
layout: default
title: Common REST Parameters
nav_order: 93
redirect_from:
  - /opensearch/common-parameters/
---

# Common REST parameters
**Introduced 1.0**
{: .label .label-purple }

OpenSearch supports the following parameters for all REST operations:

## Human-readable output

To convert output units to human-readable values (for example, `1h` for 1 hour and `1kb` for 1,024 bytes), add `?human=true` to the request URL.  

#### Example request

The following request requires response values to be in human-readable format:

```json

GET <index_name>/_search?human=true
```

## Pretty result

To get back JSON responses in a readable format, add `?pretty=true` to the request URL.  

#### Example request

The following request requires the response to be displayed in pretty JSON format:

```json

GET <index_name>/_search?pretty=true
```

## Content type

To specify the type of content in the request body, use the `Content-Type` key name in the request header. Most operations support JSON, YAML, and CBOR formats.  

#### Example request

The following request specifies JSON format for the request body:

```json

curl -H "Content-type: application/json" -XGET localhost:9200/_scripts/<template_name>
```

## Request body in query string

If the client library does not accept a request body for non-POST requests, use the `source` query string parameter to pass the request body. Also, specify the `source_content_type` parameter with a supported media type such as `application/json`.  


#### Example request

The following request searches the documents in the `shakespeare` index for a specific field and value:

```json

GET shakespeare/search?source={"query":{"exists":{"field":"speaker"}}}&source_content_type=application/json
```

## Stack traces

To include the error stack trace in the response when an exception is raised, add `error_trace=true` to the request URL.  

#### Example request

The following request sets `error_trace` to `true` so that the response returns exception-triggered errors:

```json

GET <index_name>/_search?error_trace=true
```

## Filtered responses

To reduce the response size use the `filter_path` parameter to filter the fields that are returned. This parameter takes a comma-separated list of filters. It supports using wildcards to match any field or part of a field's name. You can also exclude fields with `-`.  

#### Example request

The following request specifies filters to limit the fields returned in the response:

```json

GET _search?filter_path=<field_name>.*,-<field_name>
```
