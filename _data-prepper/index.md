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

Let's explore some key fundamentals before [Getting started with Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/). 

## Key concepts and fundamentals

Data Prepper ingest data through customizable [pipelines]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines/). These pipelines consist of pluggable components that you can customize to fit your own needs, allowing you to even plug in your own implementations. A pipeline includes the following components: 

- One [source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/sources/)
- One or more [sinks]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/sinks/)
- (Optional) One [buffer]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/buffers/buffers/)
- (Optional) One or more [processors]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/processors/)

Each pipeline definition contains two required components: `source` and `sink`. If a buffer, a processor, or both are missing from the pipeline, Data Prepper uses the default `bounded_blocking` buffer and a no-op processor. A single instance of Data Prepper can have one or more pipelines.

## Next steps

- [Get started with Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/).
- [Get familiar with Data Prepper pipelines]().

### Buffer

The buffer component acts as the layer between the source and the sink. Buffer can be either in-memory or disk based. The default buffer uses an in-memory queue called `bounded_blocking` that is bounded by the number of events. If the buffer component is not explicitly mentioned in the pipeline configuration, Data Prepper uses the default `bounded_blocking`.

### Processor

Processors are units within the Data Prepper pipeline that can filter, transform, and enrich events using your desired format before publishing the record to the sink component. The processor is not defined in the pipeline configuration; the events publish in the format defined in the source component. You can have more than one processor within a pipeline. When using multiple processors, the processors are run in the order they are defined inside the pipeline specification.

## Sample pipeline configurations

To understand how all pipeline components function within a Data Prepper configuration, see the following examples. Each pipeline configuration uses a YAML file format.

### Minimal component

This pipeline configuration reads from the file source and writes to another file in the same path. It uses the default options for the buffer and processor.

```yml
sample-pipeline:
  source:
    file:
        path: <path/to/input-file>
  sink:
    - file:
        path: <path/to/output-file>
```

### All components

The following pipeline uses a source that reads string events from the `input-file`. The source then pushes the data to the buffer, bounded by a max size of `1024`. The pipeline is configured to have `4` workers, each of them reading a maximum of `256` events from the buffer for every `100 milliseconds`. Each worker runs the `string_converter` processor and writes the output of the processor to the `output-file`.

```yml
sample-pipeline:
  workers: 4 #Number of workers
  delay: 100 # in milliseconds, how often the workers should run
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
