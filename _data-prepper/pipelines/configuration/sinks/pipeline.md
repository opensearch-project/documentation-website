---
layout: default
title: pipeline 
parent: Sinks
grand_parent: Pipelines
nav_order: 55
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/sinks/pipeline/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/sinks/pipeline/
---

# pipeline

Use the `pipeline` sink to write to another pipeline.

## Configuration options

The `pipeline` sink supports the following configuration options.

Option | Required | Type | Description
:--- | :--- | :--- | :---
name | Yes | String | Name of the pipeline to write to.

## Usage

The following example configures a `pipeline` sink that writes to a pipeline named `movies`:

```
sample-pipeline:
  sink:
    - pipeline:
        name: movies
```
