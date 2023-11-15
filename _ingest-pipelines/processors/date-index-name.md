---
layout: default
title: Date index name
parent: Ingest processors
nav_order: 55
---

# Date index name

The `date_index_name` processor is used to point documents to the correct time-based index based on the date or timestamp field within the document. The processor sets the `_index` metadata field to a [date math]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/date/#date-math) index name expression. Then the processor fetches the date or timestamp from the `field` field in the document being processed and formats it into a date math index name expression. The extracted date, `index_name_prefix` value, and `date_rounding` value are then combined to create the date math index expression. For example, if the `field` field contains the value `2023-10-30T12:43:29.000Z` and `index_name_prefix` is set to `week_index-` and `date_rounding` is set to `w`, then the date math index name expression is `week_index-2023-10-30`. You can use the `date_formats` field to specify how the date in the date math index expression should be formatted.

The following is the syntax for the `date_index_name` processor:

```json
{
  "date_index_name": {
    "field": "your_date_field or your_timestamp_field",
    "date_rounding": "rounding_value"
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `date_index_name` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field`  | Required  | The date or timestamp field in the incoming document. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets). |
`date_rounding`  | Required | The rounded date format within the index name . Valid values are `y` (year), `M` (month), `w` (week), `d` (day), `h` (hour), `m` (minute), and `s` (second). |
`date_formats` | Optional | An array of date formats used to parse the date or timestamp field. Valid options include a java time pattern or one of the following formats: ISO8601, UNIX, UNIX_MS, or TAI64N. Default is `yyyy-MM-dd'T'HH:mm:ss.SSSXX`. |
`index_name_format` | Optional | The date format. Default is `yyyy-MM-dd`. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets). |
`index_name_prefix` | Optional | The index name prefix to append before the date. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets).
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`locale` | `locale`  | Optional  | The locale to use when parsing the month name and week day of the date. Default is `ENGLISH`. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets).  |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |
`timezone`  | Optional  | The time zone to use when parsing the date. Default is `UTC`. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline.**

The following query creates a pipeline, named `date-index-name1`, that uses the `date_index_name` processor to index logs into monthly indexes: 

```json
PUT /_ingest/pipeline/date-index-name1
{
  "description": "Create weekly index pipeline",
  "processors": [
    {
      "date_index_name": {
        "field": "date_field",
        "index_name_prefix": "week_index-",
        "date_rounding": "w",
        "date_formats": ["YYYY-MM-DD"]
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
        "date_field": "2023-10-30"
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
        "_index": "<week_index-{2023-10-01||/w{yyyy-MM-dd|UTC}}>",
        "_id": "1",
        "_source": {
          "date_field": "2023-10-30"
        },
        "_ingest": {
          "timestamp": "2023-11-13T18:23:10.408593092Z"
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
  "date_field": "2023-10-30"
}
```
{% include copy-curl.html %}

#### Response

The request indexes the document into the index `week_index-2023-10-23` and will index all documents with a timestamp within that week into the same index because the pipeline rounds by week.

```json
{
  "_index": "week_index-2023-10-30",
  "_id": "1",
  "_version": 4,
  "result": "updated",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 3,
  "_primary_term": 1
}
```

**Step 4 (Optional): Retrieve the document.**

To retrieve the document, run the following query:

```json
GET week_index-2023-10-30/_doc/1
```
{% include copy-curl.html %}
