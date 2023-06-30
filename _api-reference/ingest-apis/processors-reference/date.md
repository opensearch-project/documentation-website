---
layout: default
title: Date
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 50
---

# Date

The `date` processor is used to parse dates from fields in a document annd store them as a timestamp. The syntax for the `date` processor is:

```json
{
  "date": {
    "field": "date_field",
    "formats": ["yyyy-MM-dd'T'HH:mm:ss.SSSZZ"]
  }
}
```

## Configuration parameters

The following table lists the required and optional parameters for the `date` processor.

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field`  | Required  | Name of the field to extract data from.  |
`formats`  | Required | An array of the expected date formats. Can be a java time pattern or one of the following formats: ISO8601, UNIX, UNIX_MS, or TAI64N. The default format is `yyyy-MM-dd'T'HH:mm:ss.SSSZZ`.  |
`target_field`  | Optional  | Name of the field to store the parsed data in.  |
`locale`  | Optional  | The locale to use when parsing the date. Default is English.  |
`timezone `  | Optional  | The timezone to use when parsing the date. Default is UTC.  |
`ignore_missing` | Optional  | If set to `true`, the processor will not fail if the field does not exist. Default is `false`.  | 
`if`  | Optional  | Conditional expression that determines whether the processor should be deployed.  | 
`on_failure`  | Optional  | Action to take if an error occurs. | 
`ignore_failure`  | Optional  | If set to `true`, the processor does not fail if an error occurs.  |
`tag`  | Optional  | Tag that can be used to identify the processor.  | 
`description`  | Optional  | Brief description of the processor.  |  

Following is an example of a pipeline using a `date` processor.

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

PUT testindex1/_doc/1?pipeline=date-output-format
{
  "date_european": "30/06/2023"
}
```

This pipeline adds the new field `date_us` with the desired output format. Following is the GET request and response.

```json
GET testindex1/_doc/1
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 9,
  "_seq_no": 8,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "date_us": "06/30/2023",
    "date_european": "30/06/2023"
  }
}
