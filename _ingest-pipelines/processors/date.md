---
layout: default
title: Date
parent: Ingest processors
nav_order: 50
redirect_from:
   - /api-reference/ingest-apis/processors/date/
---

# Date
**Introduced 1.0**
{: .label .label-purple }

The `date` processor is used to parse dates from document fields and to add the parsed data to a new field. By default, the parsed data is stored in the `@timestamp` field. 

## Example
The following is the syntax for the `date` processor:

```json
{
  "date": {
    "field": "date_field",
    "formats": ["yyyy-MM-dd'T'HH:mm:ss.SSSZZ"]
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `date` processor.

Parameter | Required | Description |
|-----------|-----------|-----------|
`field`  | Required  | The name of the field to which the data should be converted. Supports template snippets. |
`formats`  | Required | An array of the expected date formats. Can be a [date format]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/date/#formats) or one of the following formats: ISO8601, UNIX, UNIX_MS, or TAI64N.  |
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`locale`  | Optional  | The locale to use when parsing the date. Default is `ENGLISH`. Supports template snippets.  |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`output_format` | Optional | The [date format]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/date/#formats) to use for the target field. Default is `yyyy-MM-dd'T'HH:mm:ss.SSSZZ`. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |
`target_field`  | Optional  | The name of the field in which to store the parsed data. Default target field is `@timestamp`. | 
`timezone`  | Optional  | The time zone to use when parsing the date. Default is `UTC`. Supports template snippets. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline.**

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

**Step 2 (Optional): Test the pipeline.**

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
        "date_us": "06/30/2023",
        "date_european": "30/06/2023"
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

**Step 3: Ingest a document.**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=date-output-format
{
  "date_european": "30/06/2023"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document.**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}
