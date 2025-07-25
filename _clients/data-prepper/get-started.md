---
layout: default
title: Get Started
parent: Data Prepper
nav_order: 1
canonical_url: https://docs.opensearch.org/latest/data-prepper/getting-started/
redirect_to: https://docs.opensearch.org/latest/data-prepper/getting-started/
nav_exclude: true
---

# Get started with Data Prepper

Data Prepper is an independent component, not an OpenSearch plugin, that converts data for use with OpenSearch. It's not bundled with the all-in-one OpenSearch installation packages.

## 1. Install Data Prepper

To use the Docker image, pull it like any other image:

```bash
docker pull opensearchproject/data-prepper:latest
```

## 2. Define a pipeline

Create a Data Prepper pipeline file, `pipelines.yaml`, with the following configuration:

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
    -v /full/path/to/pipelines.yaml:/usr/share/data-prepper/pipelines.yaml \
    opensearchproject/opensearch-data-prepper:latest
```

This sample pipeline configuration above demonstrates a simple pipeline with a source (`random`) sending data to a sink (`stdout`). For more examples and details on more advanced pipeline configurations, see [Pipelines]({{site.url}}{{site.baseurl}}/clients/data-prepper/pipelines).

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
