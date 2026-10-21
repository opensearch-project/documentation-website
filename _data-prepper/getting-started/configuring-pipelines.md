---
layout: default
title: Configuring pipelines
parent: Getting started
nav_order: 15
---

# Configuring pipelines

OpenSearch Data Prepper requires at least one pipeline to start. You define pipelines in YAML files in the `pipelines` directory of the Data Prepper home directory (`/usr/share/data-prepper/pipelines` in the Docker image). Data Prepper loads every YAML file in this directory at startup.

## Pipeline structure

A pipeline configuration has the following structure:

```yaml
<pipeline-name>:
  source:
    <source-name>:
      <source-options>
  buffer:
    <buffer-name>:
      <buffer-options>
  processor:
    - <processor-name>:
        <processor-options>
  sink:
    - <sink-name>:
        <sink-options>
  workers: <number-of-workers>
  delay: <delay-in-milliseconds>
```

Each pipeline has a name and consists of the following components.

| Component | Required | Description |
| :--- | :--- | :--- |
| [`source`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/sources/) | Yes | The component that receives or reads data. Each pipeline has exactly one source. |
| [`buffer`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/buffers/buffers/) | No | The component that holds events between the source and the processors. If you don't specify a buffer, Data Prepper uses the [`bounded_blocking`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/buffers/bounded-blocking/) buffer. |
| [`processor`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/processors/) | No | A list of processors that transform each event. Data Prepper runs the processors in the order in which they are listed. If you don't specify any processors, events pass through the pipeline unchanged. |
| [`sink`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sinks/sinks/) | Yes | A list of one or more destinations for the processed events. Each event is sent to every sink. |

A pipeline can also contain the following settings, which control how the pipeline reads events from the buffer.

| Setting | Required | Description |
| :--- | :--- | :--- |
| `workers` | No | The number of threads that read events from the buffer and run the processors. Default is `1`. |
| `delay` | No | The number of milliseconds that each worker waits between buffer reads. Default is `3000`. |

## Reading and writing files

The following pipeline reads lines from a text file and writes them to another file. The pipeline doesn't specify a buffer or processors, so it uses the default buffer and passes events through unchanged:

```yaml
file-pipeline:
  source:
    file:
      path: /usr/share/data-prepper/data/input.txt
      record_type: event
  sink:
    - file:
        path: /usr/share/data-prepper/data/output.txt
```
{% include copy.html %}

The `record_type: event` setting makes the `file` source produce events. Without this setting, the source produces raw strings. Processors that operate on event fields, such as `uppercase_string`, cannot process raw strings: the pipeline produces no output and logs no error.
{: .important}

Data Prepper converts each line of `input.txt` into an event containing a `message` field and writes the events to `output.txt`. For example, an input file containing the lines `first line` and `second line` produces the following output:

```json
{"message":"first line"}
{"message":"second line"}
```

## Pipeline containing all components

The following pipeline specifies every component and setting:

```yaml
uppercase-pipeline:
  workers: 2
  delay: 100
  source:
    file:
      path: /usr/share/data-prepper/data/input.txt
      record_type: event
  buffer:
    bounded_blocking:
      buffer_size: 1024
      batch_size: 256
  processor:
    - uppercase_string:
        with_keys: ["message"]
  sink:
    - file:
        path: /usr/share/data-prepper/data/output.txt
```
{% include copy.html %}

This pipeline processes events as follows:

1. The `file` source reads each line of `input.txt` as an event and writes it to the buffer.
1. The `bounded_blocking` buffer holds up to 1,024 events. If the buffer is full, the source waits until space is available.
1. Two worker threads read from the buffer. Every 100 milliseconds, each worker reads up to 256 events.
1. Each worker runs the [`uppercase_string`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/uppercase-string/) processor, which converts the value of the `message` field to uppercase.
1. The `file` sink writes the processed events to `output.txt`.

The output file contains the following events:

```json
{"message":"SECOND LINE"}
{"message":"FIRST LINE"}
```

Because two workers process events in parallel, the output order can differ from the input order.

To run the pipelines on this page, see [Running pipelines that read and write files]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/running/#running-pipelines-that-read-and-write-files).

## Multiple pipelines

A Data Prepper instance can run multiple pipelines. You can define each pipeline in its own file or define several pipelines in one file. For example, the following file defines two pipelines:

```yaml
file-pipeline:
  source:
    file:
      path: /usr/share/data-prepper/data/input.txt
      record_type: event
  sink:
    - stdout:

http-pipeline:
  source:
    http:
      ssl: false
  sink:
    - stdout:
```
{% include copy.html %}

Pipelines can send events to each other. For more information, see [Pipelines]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines/).

## Next steps

- [Run Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/running/) and send it a test event.
