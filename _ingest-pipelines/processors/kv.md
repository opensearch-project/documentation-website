---
layout: default
title: KV
parent: Ingest processors
nav_order: 200
redirect_from:
   - /api-reference/ingest-apis/processors/lowercase/
---

# KV

The `kv` processor automatically extracts specific event fields or messages that are `key=value` format. This structured format organizes your data by grouping it together based on keys and values. It's helpful for analyzing, visualizing, and using data such as user behavior analytics, performance optimizations, or security investigations. 

## Example
The following is the syntax for the `lowercase` processor: 

```json
{
  "kv": {
    "field": "message",
    "field_split": " ",
    "value_split": " "
  }
}
```
{% include copy-curl.html %}

#### Configuration parameters

The following table lists the required and optional parameters for the `lowercase` processor.

| Name  | Required/Optional  | Description  |
|---|---|---|
`field`  | Required  | The name of the field that contains the data to be parsed. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets). |
`field_split` | Required | The regex pattern for key-value pair splitting. |
`value_split` | Required | The regex pattern for splitting the key from the value within a key-value pair, for example, equal sign `=` or colon `:`.
`include_keys` | Optional | The keys for filtering and inserting. Default is to include all keys. 
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`ignore_missing`  | Optional  | Specifies whether the processor should ignore documents that do not have the specified field. Default is `false`.  |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |
`target_field`  | Optional  | The name of the field in which to insert the extracted keys. Default is `null`. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets). |