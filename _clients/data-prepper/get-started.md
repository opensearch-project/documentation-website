---
layout: default
title: Get Started
parent: Data Prepper
nav_order: 1
---

# Get started with Data Prepper

Data Prepper is an independent component, not an OpenSearch plugin, that converts data for use with OpenSearch. It's not bundled with the all-in-one OpenSearch installation packages.

## 1. Install Data Prepper

To use the Docker image, pull it like any other image:

```bash
docker pull opensearchproject/data-prepper:latest
```

## 2. Define a pipeline

Create a Data Prepper pipeline file, `my-pipelines.yaml`, with the following configuration:

```yml
simple-sample-pipeline:
  workers: 2
  delay: "5000"
  source:
    random:
  sink:
    - stdout:
```

## 3. Start Data Prepper

Run the following command with your pipeline configuration YAML.

```bash
docker run --name data-prepper \
    -v /full/path/to/my-pipelines.yaml:/usr/share/data-prepper/pipelines/my-pipelines.yaml \
    opensearchproject/opensearch-data-prepper:latest
```

This sample pipeline configuration above demonstrates a simple pipeline with a source (`random`) sending data to a sink (`stdout`). For more examples and details on more advanced pipeline configurations, see [Pipelines]({{site.url}}{{site.baseurl}}/clients/data-prepper/pipelines).

After starting Data Prepper, you should see log output and some UUIDs after a few seconds:

```yml
2021-09-30T20:19:44,147 [main] INFO  org.opensearch.dataprepper.pipeline.server.DataPrepperServer - Data Prepper server running at :4900
2021-09-30T20:19:44,681 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:45,183 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:45,687 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:46,191 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:46,694 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:47,200 [random-source-pool-0] INFO  org.opensearch.dataprepper.plugins.source.RandomStringSource - Writing to buffer
2021-09-30T20:19:49,181 [simple-test-pipeline-processor-worker-1-thread-1] INFO  org.opensearch.dataprepper.pipeline.ProcessWorker -  simple-test-pipeline Worker: Processing 6 records from buffer
{"message":"1043a78e-1312-4341-8c1e-227e34a1fbf3"}
{"message":"b1529b81-1ee1-4cdb-b5d7-11586e570ae6"}
{"message":"56d83593-4c95-4bc4-9c0b-e061d9b23192"}
{"message":"254153df-4534-4f5e-bb31-98b984f2ac29"}
{"message":"ad1430e6-8486-4d84-a2ef-de30315dea07"}
{"message":"81c5e621-79aa-4850-9bf1-68642d70c1ee"}
```
