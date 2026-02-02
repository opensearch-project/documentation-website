---
layout: default
title: File
parent: Sources
grand_parent: Pipelines
nav_order: 24
---

# File source

The `file` plugin reads events from a local file once when the pipeline starts. It's useful for loading seed data, testing processors and sinks, or replaying a fixed dataset. This source *does not monitor* the file for new lines after startup.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`path` | Yes | String | An absolute path to the input file inside the Data Prepper container, for example, `/usr/share/data-prepper/data/input.jsonl`.
`format` | No | String | Specifies how to interpret the file content. Valid values are `json` and `plain`. Use `json` when your file has one JSON object per line or a JSON array. Use `plain` for raw text lines. Default is `plain`.
`record_type` | No | String | The type of output record produced by the source. Valid values are `event` and `string`. Use `event` to produce structured events expected by downstream processors and the OpenSearch sink. Default is `string`.

### Example

The following examples demonstrate how different file types can be processed.

### JSON file

The following example processes a JSON file:

```yaml
file-to-opensearch:
  source:
    file:
      path: /usr/share/data-prepper/data/input.ndjson
      format: json
      record_type: event
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        index: file-demo
        username: admin
        password: admin_pass
        insecure: true
```
{% include copy.html %}

### Plain text file

A raw text file can be processed using the following pipeline:

```yaml
plain-file-to-opensearch:
  source:
    file:
      path: /usr/share/data-prepper/data/app.log
      format: plain
      record_type: event
  processor:
    - grok:
        match:
          message:
            - '%{TIMESTAMP_ISO8601:timestamp} \[%{LOGLEVEL:level}\] %{GREEDYDATA:msg}'
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        index: plain-file-demo
        username: admin
        password: admin_pass
        insecure: true
```
{% include copy.html %}

### CSV file

You can process a CSV file using the `csv` processor:

```yaml
csv-file-to-opensearch:
  source:
    file:
      path: /usr/share/data-prepper/data/ingest.csv
      format: plain  
      record_type: event     
  processor:
    - csv:
        column_names: ["time","level","message"]
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        index: csv-demo
        username: admin
        password: admin_pass
        insecure: true
```
{% include copy.html %}
