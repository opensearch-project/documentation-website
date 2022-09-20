---
layout: default
title: Data Prepper
nav_order: 120
has_children: true
has_toc: false
---

# Data Prepper

Data Prepper is a server side data collector capable of filtering, enriching, transforming, normalizing and aggregating data for downstream analytics and visualization.

Data Prepper lets users build custom pipelines to improve the operational view of applications. Two common uses for Data Prepper are trace and log analytics. [Trace analytics]({{site.url}}{{site.baseurl}}/observability-plugin/trace/index/) can help you visualize the flow of events and identify performance problems, and [log analytics]({{site.url}}{{site.baseurl}}/observability-plugin/log-analytics/) can improve searching, analyzing and provide insights into your application.

## Concepts

Data Prepper is compromised of **Pipelines** that collect and filter data based on the components set within the pipeline. Each component is pluggable, enabling you to use your own custom implementation of each component. These components include: 

- One [source](#source)
- One [buffer](#buffer)
- One or more [processors](#processor)
- One of more [sinks](#sink)

A single instance of Data Prepper can have one or more pipelines. 

Each pipeline definition contains two required components **source** and **sink**. If buffers and processors are missing from the Data Prepper pipeline, Data Prepper uses the default buffer and a no-op processor. 

### Source 

Source is the input component of a pipeline that defines the mechanism through which a Data Prepper pipeline will consume records. A pipeline can have only one source. The source can consume records either by receiving the records over http/s or reading from external endpoints like Kafka, SQS, Cloudwatch, etc. Source has its own configuration options based on the type like the format of the records (such as string, json,  cloudwatch logs, or open telemetry trace). The source component consumes records and writes them to the buffer component. 

### Buffer

The buffer component acts as the layer between the source and the sink. Buffer can be either in-memory or disk-based. The default buffer uses an in-memory queue bounded by the number of records, called `bounded_blocking`. If the buffer component is not explicitly mentioned in the pipeline configuration, Data Prepper uses the default `bounded_blocking`.

### Sink

Sink is the output component of a pipeline that defines the destination(s) to which a Data Prepper pipeline publishes records. A sink destination could be services such as OpenSearch, S3, or another Data Prepper pipeline. When using another Data Prepper pipeline as the sink, you can multiple pipelines together based on the needs to the data. Sink contains it's own configurations options based on the destination type.

### Processor

Processors are units within the Data Prepper pipeline that can filter, transform, and enrich records into your desired format before publishing the record to the sink. The a processor is not defined in the pipeline configuration, the records publish in the format defined in the source component. You can have more than on processor within a pipeline. When using multiple processors, the processors are executed in the order they are defined inside the pipeline spec.

## Sample Pipeline configurations

To understand how all pipeline components function within a Data Prepper configuration, see the following examples. Each pipeline configuration uses a `yml` file format.

### Minimal component

This pipeline configuration reads from file source and writes to that same source. It uses the default options for buffer and processor.

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

The following pipeline uses a source that reads string records from the `input-file`. The source then pushes the data to buffer bounded by max size of `1024`. The pipeline configured to have `4` workers each of them reading maximum of `256` records from the buffer for every `100 milliseconds`. Each worker executes the `string_converter` processor and write the output of the processor to the `output-file`.

```yml
sample-pipeline:
  workers: 4 #Number of workers
  delay: 100 # in milliseconds, how often the workers should run
  source:
    file:
        path: <path/to/input-file>
  buffer:
    bounded_blocking:
      buffer_size: 1024 # max number of records the buffer will accept
      batch_size: 256 # max number of records the buffer will drain for each read
  processor:
    - string_converter:
       upper_case: true
  sink:
    - file:
       path: <path/to/output-file>
```

## Next steps

To get started building your own custom pipelines with Data Prepper, see the [Get Started]({{site.url}}{{site.baseurl}}/clients/data-prepper/get-started/) guide.
