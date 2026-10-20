---
layout: default
title: Getting started
nav_order: 5
has_children: true
has_toc: false
redirect_from:
  - /clients/data-prepper/get-started/
  - /data-prepper/getting-started/
steps:
  - heading: "Install and configure Data Prepper"
    description: "Install Data Prepper using the Docker image or a Linux archive and learn how it's configured."
    link: "/data-prepper/getting-started/installing/"
  - heading: "Configure pipelines"
    description: "Learn about the pipeline structure and the server and logging configuration files."
    link: "/data-prepper/getting-started/configuring-pipelines/"
  - heading: "Run Data Prepper"
    description: "Start Data Prepper using a minimal pipeline, send a test event, and then stop Data Prepper."
    link: "/data-prepper/getting-started/running/"
  - heading: "Ingest log data into OpenSearch"
    description: "Build a pipeline that parses raw Apache access logs, writes them to an OpenSearch index, and lets you search the parsed fields."
    link: "/data-prepper/getting-started/ingesting-log-data/"
---

# Getting started with OpenSearch Data Prepper

OpenSearch Data Prepper is a server-side data collector that receives data from your applications, transforms it, and sends it to OpenSearch. Data Prepper runs separately from OpenSearch and is not included in the OpenSearch installation packages.

## Pipelines and events

Data Prepper runs _pipelines_. Each pipeline reads data from a _source_, transforms or drops events using one or more _processors_, and writes the result to one or more _sinks_. Between the source and the processors, events wait in a _buffer_. For example, a pipeline can receive log lines over HTTP, parse each line into fields, and write the result to an OpenSearch index. A single Data Prepper instance can run multiple pipelines.

An _event_ is a single data item, such as a log line, that moves through a pipeline. Each event consists of key-value pairs called _fields_, similar to a JSON object. When a pipeline writes to OpenSearch, each event becomes a document. Other sinks, such as Amazon S3, serialize events into files. Processors read and modify the fields of each event before the event reaches a sink.

## Configuration files

Data Prepper uses the following configuration files.

| File | Required | Description |
| :--- | :--- | :--- |
| Pipeline configuration | Yes | One or more YAML files that define the pipelines to run, including their sources, processors, and sinks. Data Prepper does not provide a default pipeline and does not start if no pipeline configuration file exists. For more information, see [Configuring pipelines]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/configuring-pipelines/). |
| `data-prepper-config.yaml` | No | Settings for the Data Prepper server, such as the port, TLS, and authentication for the [core APIs]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/core-apis/). Data Prepper includes a default server configuration file. |
| `log4j2-rolling.properties` | No | The [Log4j 2](https://logging.apache.org/log4j/2.x/) logging configuration. Data Prepper includes a default logging configuration file. |

Because a pipeline is required, you define at least one pipeline before you start Data Prepper.

## Next steps

To get started with Data Prepper, follow these steps in order:

{% include list.html list_items=page.steps %}
