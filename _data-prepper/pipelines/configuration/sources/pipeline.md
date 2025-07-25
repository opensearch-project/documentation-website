---
layout: default
title: pipeline 
parent: Sources
grand_parent: Pipelines
nav_order: 90
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/sources/pipeline/
---

# pipeline

Use the `pipeline` sink to read from another pipeline.

## Configuration options

The `pipeline` sink supports the following configuration options.

| Option | Required | Type   | Description                            |
|:-------|:---------|:-------|:---------------------------------------|
| `name` | Yes      | String | The name of the pipeline to read from. |

## Usage

The following example configures a `pipeline` sink named `sample-pipeline` that reads from a pipeline named `movies`:

```yaml
sample-pipeline:
  source:
    - pipeline:
        name: "movies"
```
{% include copy.html %}
