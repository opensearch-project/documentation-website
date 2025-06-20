---
layout: default
title: Running Data Prepper
nav_order: 15
grand_parent: OpenSearch Data Prepper 
parent: Getting started with OpenSearch Data Prepper
---

This section explains how to run OpenSearch Data Prepper using a defined pipeline configuration. Before starting the service, you must create a valid pipeline YAML file that defines the data flow—from source to sink—with optional processors and buffers.

You can run Data Prepper using a Docker container or a local build, depending on your setup. This page provides examples for running the Docker image, along with configuration options for different versions of Data Prepper. Once launched, Data Prepper begins processing data according to the specified pipeline and continues until it is manually shut down.

## Defining a pipeline

Create a Data Prepper pipeline file named `pipelines.yaml`, similar to the following sample configuration:

```yml
simple-sample-pipeline:
  workers: 2
  delay: "5000"
  source:
    random:
  sink:
    - stdout:
```
{% include copy.html %}

### Basic pipeline configurations

To understand how the pipeline components function within a Data Prepper configuration, see the following examples. Each pipeline configuration uses a `yaml` file format. For more information, see [Pipelines]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines/) for more information and examples.

#### Minimal configuration

The following minimal pipeline configuration reads from the file source and writes the data to another file on the same path. It uses the default options for the `buffer` and `processor` components.

```yml
sample-pipeline:
  source:
    file:
        path: <path/to/input-file>
  sink:
    - file:
        path: <path/to/output-file>
```

#### Comprehensive configuration

The following comprehensive pipeline configuration uses both required and optional components:

```yml
sample-pipeline:
  workers: 4 # Number of workers
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

In the given pipeline configuration, the `source` component reads string events from the `input-file` and pushes the data to a bounded buffer with a maximum size of `1024`. The `workers` component specifies `4` concurrent threads that will process events from the buffer, each reading a maximum of `256` events from the buffer every `100` milliseconds. Each `workers` component runs the `string_converter` processor, which converts the strings to uppercase and writes the processed output to the `output-file`.

## 4. Running Data Prepper

Run the following command with your pipeline configuration YAML.

```bash
docker run --name data-prepper \
    -v /${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines/pipelines.yaml \
    opensearchproject/data-prepper:latest
    
```
{% include copy.html %}

The example pipeline configuration above demonstrates a simple pipeline with a source (`random`) sending data to a sink (`stdout`). For examples of more advanced pipeline configurations, see [Pipelines]({{site.url}}{{site.baseurl}}/clients/data-prepper/pipelines/).

After starting Data Prepper, you should see log output and some UUIDs after a few seconds:

```yml
2021-09-30T20:19:44,147 [main] INFO  com.amazon.dataprepper.pipeline.server.DataPrepperServer - Data Prepper server running at :4900
2021-09-30T20:19:44,681 [random-source-pool-0] INFO  com.amazon.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:45,183 [random-source-pool-0] INFO  com.amazon.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:45,687 [random-source-pool-0] INFO  com.amazon.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:46,191 [random-source-pool-0] INFO  com.amazon.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:46,694 [random-source-pool-0] INFO  com.amazon.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:47,200 [random-source-pool-0] INFO  com.amazon.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:49,181 [simple-test-pipeline-processor-worker-1-thread-1] INFO  com.amazon.dataprepper.pipeline.ProcessWorker -  simple-test-pipeline Worker: Processing 6 records from buffer
07dc0d37-da2c-447e-a8df-64792095fb72
5ac9b10a-1d21-4306-851a-6fb12f797010
99040c79-e97b-4f1d-a70b-409286f2a671
5319a842-c028-4c17-a613-3ef101bd2bdd
e51e700e-5cab-4f6d-879a-1c3235a77d18
b4ed2d7e-cf9c-4e9d-967c-b18e8af35c90
```
The remainder of this page provides examples for running Data Prepper from the Docker image. If you
built it from source, refer to the [Developer Guide](https://github.com/opensearch-project/data-prepper/blob/main/docs/developer_guide.md) for more information.

However you configure your pipeline, you'll run Data Prepper the same way. You run the Docker
image and modify both the `pipelines.yaml` and `data-prepper-config.yaml` files.

For Data Prepper 2.0 or later, use this command:

```
docker run --name data-prepper -p 4900:4900 -v ${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines/pipelines.yaml -v ${PWD}/data-prepper-config.yaml:/usr/share/data-prepper/config/data-prepper-config.yaml opensearchproject/data-prepper:latest
```
{% include copy.html %}

For Data Prepper versions earlier than 2.0, use this command:

```
docker run --name data-prepper -p 4900:4900 -v ${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines.yaml -v ${PWD}/data-prepper-config.yaml:/usr/share/data-prepper/data-prepper-config.yaml opensearchproject/data-prepper:1.x
```
{% include copy.html %}

Once Data Prepper is running, it processes data until it is shut down. Once you are done, shut it down with the following command:

```
POST /shutdown
```
{% include copy-curl.html %}