---
layout: default
title: Date index name
parent: Ingest processors
nav_order: 55
---

# Date index name

The `date_index_name` processor is used to point documents to the correct index based on the date or timestamp field within the document. The processor can be used for purposes such as log retention and index partitioning.

The following is the syntax for the `date_index_name` processor:

```json
{
  "date_index_name": {
    "field": "date_field or timestamp_field",
    "date_rounding": "M"
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `date_index_name` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field`  | Required  | The date or timestamp field in the incoming document. <Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets).> |
`date_rounding`  | Required | The rounded date format within the index name . Valid values are `y` (year), `M` (month), `w` (week), `d` (day), `h` (hour), `m` (minute), and `s` (second). |
`date_formats` | Optional | An array of date formats to parse the date or timestamp field. Default is <yyyy-MM-dd'T'HH:mm:ss.SSSXX>. |
`index_name_format` | Optional | The date format. Default is <MM-dd-yyyy>. | Supports [template snippets]({site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets). |
`index_name_prefix` | Optional | 
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`locale` | `locale`  | Optional  | The locale to use when parsing the date. Default is `ENGLISH`. Supports [template snippets]({site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets).  |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |
`timezone`  | Optional  | The time zone to use when parsing the date. Default is `UTC`. Supports [template snippets]({site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets). |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline.**

The following query creates a pipeline, named `date-index-name1`, that uses the `date_index_name` processor to index logs into monthly indexes: 

```json
PUT /_ingest/pipeline/date-index-name1
{
  "description": "Monthly log indexing pipeline",
  "processors": [
    {
      "date_index_name": {
        "field": "@timestamp",
        "date_rounding": "M",
        "index_name_format": "yyyy-MM",
        "date_formats": ["ISO8601"]
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 2 (Optional): Test the pipeline.**

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/date-index-name1/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "@timestamp": "2023-10-30T12:43:29.000Z"
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Response

The following example response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "<{2023-10||/M{yyyy-MM|UTC}}>",
        "_id": "1",
        "_source": {
          "@timestamp": "2023-10-30T12:43:29.000Z"
        },
        "_ingest": {
          "timestamp": "2023-10-30T18:57:41.674876009Z"
        }
      }
    }
  ]
}
```

**Step 3: Ingest a document.**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=date-index-name1
{
  "@timestamp": "2023-10-30T12:43:29.000Z"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document.**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

#### Response

The following shows an example reponse:

```json
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 56,
  "_seq_no": 55,
  "_primary_term": 29,
  "found": true,
  "_source": {
    "response_code": "200",
    "http_method": "POST",
    "http_version": "HTTP/1.1",
    "client_ip": "192.168.1.10",
    "message": """192.168.1.10 - - [03/Nov/2023:15:20:45 +0000] "POST /login HTTP/1.1" 200 3456""",
    "url": "/login",
    "response_size": "3456",
    "timestamp": "03/Nov/2023:15:20:45 +0000"
  }
}
```
