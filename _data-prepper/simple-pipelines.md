---
layout: default
title: Simple pipelines
nav_order: 12
---

# Simple pipelines

This tutorial guides you through creating a simple Data Prepper pipeline and how to configure it.

## Installation

First, install Data Prepper with Docker using the following command:

```
docker pull opensearchproject/data-prepper:latest
```

## Simple configuration

To help you get started, we have provided a simple configuration that you can use to run Data Prepper. It generates random strings and writes them to `stdout`. 

Create a Data Prepper configuration file, `data-prepper-config.yaml`, and include the following line:

```
ssl: true
```

Create a Data Prepper pipeline file, `pipelines.yaml`, and include the following lines:

```
simple-sample-pipeline:
  workers: 2
  delay: "5000"
  source:
    random:
  sink:
    - stdout:
```

## Run Data Prepper

The following are examples of running Data Prepper from the Docker image. If you make changes to the code and build artifacts locally, you need to make some modifications to the example commands. 

For Data Prepper 2.0 or later, use this command:

```
docker run --name data-prepper -p 4900:4900 -v ${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines/pipelines.yaml -v ${PWD} /data-prepper-config.yaml:/usr/share/data-prepper/config/data-prepper-config.yaml opensearchproject/data-prepper:latest
```

For Data Prepper versions previous to 2.0, use this command:

```
docker run --name data-prepper -p 4900:4900 -v ${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines.yaml -v ${PWD}/data-prepper-config.yaml:/usr/share/data-prepper/data-prepper-config.yaml opensearchproject/data-prepper:latest
```

You should see log output and, after a few seconds, some UUIDs in the log output. It should look something like the following:

```
2021-09-30T20:19:44,147 [main] INFO  org.opensearch.dataprepper.pipeline.server.DataPrepperServer - Data Prepper server running at :4900
2021-09-30T20:19:44,681 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:45,183 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:45,687 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:46,191 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:46,694 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:47,200 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:47,704 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:48,207 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:48,677 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:49,179 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:49,181 [simple-test-pipeline-processor-worker-1-thread-1] INFO  org.opensearch.dataprepper.pipeline.ProcessWorker -  simple-test-pipeline Worker: Processing 6 records from buffer
07dc0d37-da2c-447e-a8df-64792095fb72
5ac9b10a-1d21-4306-851a-6fb12f797010
99040c79-e97b-4f1d-a70b-409286f2a671
5319a842-c028-4c17-a613-3ef101bd2bdd
e51e700e-5cab-4f6d-879a-1c3235a77d18
b4ed2d7e-cf9c-4e9d-967c-b18e8af35c90
```

In another terminal, you can access the Data Prepper server API:

```
curl https://localhost:4900/list
```

It will output a JSON response with the current pipelines:

```
{"pipelines":[{"name":"simple-test-pipeline"}]}
```


## Shut down Data Prepper

You can shut down Data Prepper either by using the shutdown API or by stopping the Docker process:

```
curl -X POST https://localhost:4900/shutdown
```

## Adding a processor

The previous example demonstrates the bare minimum a pipeline can have: A source sending data to a sink. The following example adds a string converter processor. This simple processor transforms the string by making it uppercase:

```
simple-sample-pipeline:
  workers: 2
  delay: "5000"
  source:
    random:
  processor:
    - string_converter:
        upper_case: true
  sink:
    - stdout:
```

Once configured, run Data Prepper again.

For Data Prepper 2.0 or later, use this command:
```
docker run --name data-prepper -p 4900:4900 -v ${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines/pipelines.yaml -v ${PWD} /data-prepper-config.yaml:/usr/share/data-prepper/config/data-prepper-config.yaml opensearchproject/data-prepper:latest
```

For Data Prepper versions previous to 2.0, use this command:
```
docker run --name data-prepper -p 4900:4900 -v ${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines.yaml -v ${PWD}/data-prepper-config.yaml:/usr/share/data-prepper/data-prepper-config.yaml opensearchproject/data-prepper:latest
```

You will see output that looks like the following:

```
2021-10-01T09:58:19,907 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-10-01T09:58:19,908 [simple-sample-pipeline-processor-worker-1-thread-1] INFO  org.opensearch.dataprepper.pipeline.ProcessWorker -  simple-sample-pipeline Worker: Processing 6 records from buffer
B77D726E-2B92-458B-8C14-E5F8C403F1B0
6B8FCC48-ED40-462C-8C43-AB218C1DA478
3D0054FB-5D93-444F-A1AC-51827BD4FF37
733D1AB9-2260-42D8-B1F1-08B8D206E06B
EFC73B62-E976-4314-86C8-1E76F7EF9BCC
8D4E7DB3-6D6C-4AB7-925F-5F7C6CCD1058
```

Shut down Data Prepper by using this curl request:

```
curl -X POST http://localhost:4900/shutdown
```

## Next steps

This page explains the basics of Data Prepper. If you want to set up a useful observability suite, visit the [Trace Analytics documentation](trace_analytics.md).
