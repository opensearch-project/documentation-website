---
layout: default
title: File
parent: Sources
grand_parent: Pipelines
nav_order: 24
---

# File source

The `file` plugin reads events from a local file once at pipeline startup. It is ideal for loading seed data, testing processors and sinks, or replaying a fixed dataset. This source **does not tail** a file for new lines after startup.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`path` | Yes | String | Absolute path to the input file inside the Data Prepper container, for example, `/usr/share/data-prepper/data/input.jsonl`.
`format` | No | String | How to interpret the file content. Allowed values: `json`, `plain`. Use `json` when your file has one JSON object per line, or a JSON array. Use `plain` for raw text lines. Default is `plain`.
`record_type` | No | String | The output record type produced by the source. Allowed values: `event`, `string`. Use `event` to produce structured events that downstream processors and the OpenSearch sink expect. Default is `string`.

### Example

The following examples demonstrate how different file types can be processed.

### Json file

The following example processes json file:

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
        index: "file-demo"
        username: "admin"
        password: "admin_pass"
        insecure: true
```
{% include copy.html %}

### Plain text file

Raw text file can be processed using the following pipeline:

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
        index: "plain-file-demo"
        username: "admin"
        password: "admin_pass"
        insecure: true
```
{% include copy.html %}

### CSV file

You can process csv file using the `csv` processor:

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
        index: "csv-demo"
        username: "admin"
        password: "admin_pass"
        insecure: true
```
{% include copy.html %}
