---
layout: default
title: Data Prepper 
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
permalink: /data-prepper/
redirect_from: 
  - /clients/data-prepper/index/
  - /monitoring-plugins/trace/data-prepper/
  - /data-prepper/index/
---

# Data Prepper

Data Prepper is a server-side data ingestion tool that collects, transforms, and prepares data for downstream analytics and visualizations to give you operational visibility and insight into application performance. Key uses cases include [trace analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/) and [log analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/log-analytics/). 

## Key concepts and fundamentals

Data Prepper ingests data through customizable [pipelines]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines/). These pipelines consist of pluggable components that you can customize to fit your own needs, allowing you to even plug in your own implementations. A Data Prepper pipeline has the following components: 

- One [source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/sources/)
- One or more [sinks]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/sinks/)
- (Optional) One [buffer]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/buffers/buffers/)
- (Optional) One or more [processors]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/processors/)

Each pipeline definition contains two required components: `source` and `sink`. If a buffer, a processor, or both are missing from the pipeline, Data Prepper uses the default `bounded_blocking` buffer and a no-op processor. Note that a single instance of Data Prepper can have one or more pipelines.

## Pipeline architecture

The following pipeline examples show the architecture for a minimal configuration that uses only the required components and a comprehensive configuration that uses required and optional components. Each pipeline configuration uses the YAML file format.

### Minimal configuration

The following minimal pipeline configuration reads from the file source and writes the data to another file in the same path. It uses the default options for the `buffer` and `processor` components.

```yml
sample-pipeline:
  source:
    file:
        path: <path/to/input-file>
  sink:
    - file:
        path: <path/to/output-file>
```

### Comprehensive configuration

The following comprehensive pipeline configuration uses required and optional components.

```yml
sample-pipeline:
  workers: 4 # Number of workers
  delay: 100 # In milliseconds, how often the workers should run
  source:
    file:
        path: <path/to/input-file>
  buffer:
    bounded_blocking:
      buffer_size: 1024 # max number of events the buffer will accept
      batch_size: 256 # max number of events the buffer will drain for each read
  processor:
    - string_converter:
       upper_case: true
  sink:
    - file:
       path: <path/to/output-file>
```

In the given pipeline configuration, the `source` component reads string events from the `input-file` and pushes the data to a bounded buffer with a maximum size of `1024`. The `workers` component specifies `4` concurrent threads that will process events from the buffer, each reading a maximum of `256` events from the buffer every `100` milliseconds. Each `workers` runs the `string_converter` processor, which converts the strings to uppercase, and writes the processed output to `output-file`.

## Next steps

- [Get started with Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/).
- [Get familiar with Data Prepper pipelines]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines/).
- [Explore common use cases]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/common-use-cases/) 
