---
layout: default
title: Date
parent: Ingest processors
nav_order: 50
redirect_from:
   - /api-reference/ingest-apis/processors/date/
---

This documentation describes using the `date` processor in OpenSearch ingest pipelines. Consider using the [Data Prepper `date` processor]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/date/), which runs outside the OpenSearch cluster, if your use case involves large or complex datasets.
{: .note}

# Date processor

The `date` processor is used to parse dates from document fields and to add the parsed data to a new field. By default, the parsed data is stored in the `@timestamp` field. 

## Syntax

The following is the syntax for the `date` processor:

```json
{
  "date": {
    "field": "date_field",
    "formats": ["yyyy-MM-dd'T'HH:mm:ss.SSSZZ"]
  }
}
```
{% include copy.html %}

## Parameters

The following table lists the required and optional parameters for the `date` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field`  | Required  | The name of the field containing the data to be converted. |
`formats`  | Required | An array of the expected date formats. The processor tries every format in the order specified. If more than one format can parse the date, the last matching format determines the result. Can be a [date format]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/#formats) or one of the following formats: ISO8601, UNIX, UNIX_MS, or TAI64N.  |
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running the processor. |
`ignore_failure` | Optional | Specifies whether the processor continues execution even if it encounters errors. If set to `true`, failures are ignored. Default is `false`. |
`locale`  | Optional  | The locale to use when parsing the date. If not specified, the root locale is used, which parses English month and day names. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets).  |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`output_format` | Optional | The [date format]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/#formats) to use for the target field. Default is `yyyy-MM-dd'T'HH:mm:ss.SSSXXX`, for example, `2023-06-30T00:00:00.000Z`. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. For more information, see [Using processor tags for monitoring and debugging]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#using-processor-tags-for-monitoring-and-debugging). |
`target_field`  | Optional  | The name of the field in which to store the parsed data. Default target field is `@timestamp`. | 
`timezone`  | Optional  | The time zone to use when parsing the date. Default is `UTC`. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets). |

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline, named `date-output-format`, that uses the `date` processor to convert from European date format to US date format, adding the new field `date_us` with the desired `output_format`:

```json
PUT /_ingest/pipeline/date-output-format
{
  "description": "Pipeline that converts European date format to US date format",
  "processors": [
    {
      "date": {
        "field" : "date_european",
        "formats" : ["dd/MM/yyyy", "UNIX"],
        "target_field": "date_us",
        "output_format": "MM/dd/yyy",
        "timezone" : "UTC"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 2 (Optional): Test the pipeline

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/date-output-format/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "date_european": "30/06/2023"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The following example response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "date_us": "06/30/2023",
          "date_european": "30/06/2023"
        },
        "_ingest": {
          "timestamp": "2023-08-22T17:08:46.275195504Z"
        }
      }
    }
  ]
}
```

### Step 3: Ingest a document

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=date-output-format
{
  "date_european": "30/06/2023"
}
```
{% include copy-curl.html %}

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

The response contains the ingested document, transformed as shown in the response in Step 2.

## Using time zones and locales from the document

Because the `timezone` and `locale` parameters support template snippets, you can read them from fields in the document being processed. This is useful when documents come from sources in different regions. The following request parses a French date string using the time zone and locale stored in the `store` object:

```json
POST _ingest/pipeline/_simulate
{
  "pipeline": {
    "processors": [
      {
        "date": {
          "field": "order_date",
          "formats": ["dd MMMM yyyy HH:mm"],
          "timezone": "{% raw %}{{{store.timezone}}}{% endraw %}",
          "locale": "{% raw %}{{{store.locale}}}{% endraw %}"
        }
      }
    ]
  },
  "docs": [
    {
      "_source": {
        "order_date": "14 octobre 2026 09:30",
        "store": {
          "timezone": "Europe/Paris",
          "locale": "fr"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response shows that the date was parsed using the French month name and the Paris time zone:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "order_date": "14 octobre 2026 09:30",
          "store": {
            "locale": "fr",
            "timezone": "Europe/Paris"
          },
          "@timestamp": "2026-10-14T09:30:00.000+02:00"
        },
        "_ingest": {
          "timestamp": "2026-10-14T20:32:15.764960761Z"
        }
      }
    }
  ]
}
```
