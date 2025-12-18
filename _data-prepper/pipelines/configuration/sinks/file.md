---
layout: default
title: File
parent: Sinks
grand_parent: Pipelines
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/sinks/file/
---

# File sink

Use the `file` sink to create a flat file output, usually a `.log` file.

## Configuration options

The following table describes options you can configure for the `file` sink.

Option | Required | Type | Description
:--- | :--- | :--- | :---
path | Yes | String | Path for the output file (e.g. `logs/my-transformed-log.log`).
append | No | Boolean | When `true`, the sink file is opened in append mode.

## Usage

The following example shows basic usage of the `file` sink:

```yaml
sample-pipeline:
  sink:
    - file:
        path: path/to/output-file
```

