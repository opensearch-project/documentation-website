---
layout: default
title: Get Started
nav_order: 10
redirect_from:
  - /clients/data-prepper/get-started/
---

# Get started with Data Prepper

Data Prepper is an independent component, not an OpenSearch plugin, that converts data for use with OpenSearch. It's not bundled with the all-in-one OpenSearch installation packages.

If you are migrating from Open Distro Data Prepper, visit the [Migrating from Open Distro]({{site.url}}{{site.baseurl}}/opensearch/clients/data-prepper/migrate-open-distro/) page. 

## 1. Installing Data Prepper

There are two ways to install Data Prepper:

1. Run the Docker image.
2. Build from source.

The easiest way to use Data Prepper is by running the Docker image. We suggest
you use this approach if you have [Docker](https://www.docker.com) available.

You can pull the Docker image:

```
docker pull opensearchproject/data-prepper:latest
```

If you have special requirements that require you to build from source, or if you
want to contribute, see the [Developer Guide](https://github.com/opensearch-project/data-prepper/blob/main/docs/developer_guide.md).

## 2. Configuring Data Prepper

You must configure Data Prepper with a pipeline before running it.

You will configure two files:

* `data-prepper-config.yaml`
* `pipelines.yaml`

Depending on your use case, we have a few different guides to configuring Data Prepper.
* [Trace Analytics](https://github.com/opensearch-project/data-prepper/blob/main/docs/trace_analytics.md)
* [Log Ingestion](https://github.com/opensearch-project/data-prepper/blob/main/docs/log_analytics.md): Learn how to set up Data Prepper for log observability.
* [Simple Pipeline](https://github.com/opensearch-project/data-prepper/blob/main/docs/simple_pipelines.md): Learn the basics of Data Prepper pipelines with some simple configurations.

## 3. Defining a pipeline

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

## 4. Running Data Prepper

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
The remainder of this page provides examples for running Data Prepper from the Docker image. If you
built from source, refer to the [Developer Guide](https://github.com/opensearch-project/data-prepper/blob/main/docs/developer_guide.md) for more information.

However you configure your pipeline, you will run Data Prepper the same way. You run the Docker
image and supply both the `pipelines.yaml` and `data-prepper-config.yaml` files.

For Data Prepper 2.0 or later, use this command:

```
docker run --name data-prepper -p 4900:4900 -v ${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines/pipelines.yaml -v ${PWD}/data-prepper-config.yaml:/usr/share/data-prepper/config/data-prepper-config.yaml opensearchproject/data-prepper:latest
```

For Data Prepper before version 2.0, use this command:

```
docker run --name data-prepper -p 4900:4900 -v ${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines.yaml -v ${PWD}/data-prepper-config.yaml:/usr/share/data-prepper/data-prepper-config.yaml opensearchproject/data-prepper:1.x
```

Once Data Prepper is running, it will process data until it is shut down. Once you are done, shut it down with the following command:

```
curl -X POST http://localhost:4900/shutdown
```
### Additional configurations

For Data Prepper 2.0 or later, the Log4j 2 configuration file is read from `config/log4j2.properties` in the application's home directory. 
By default, it uses `log4j2-rolling.properties` in the *shared-config* directory.

For Data Prepper 1.5 or earlier, optionally add `"-Dlog4j.configurationFile=config/log4j2.properties"` to the command if you would 
like to pass a custom log4j2 properties file. If no properties file is provided, Data Prepper will default to the log4j2.properties file in the *shared-config* directory.

## Next steps

All Data Prepper instances expose a few APIs. The [API documentation]({{site.url}}{{site.baseurl}}/opensearch/clients/data-prepper/api/) outlines these APIs and
how to configure the server.

Trace Analytics is an important Data Prepper use case. If you haven't yet configured it,
see the [Trace Analytics](https://github.com/opensearch-project/data-prepper/blob/main/docs/trace_analytics.md).

Log Ingestion is also an important Data Prepper use case. To learn more, see the [Log Ingestion Documentation](https://github.com/opensearch-project/data-prepper/blob/main/docs/log_analytics.md).

To learn how to run Data Prepper with a Logstash configuration, see the [Logstash Migration Guide]({{site.url}}{{site.baseurl}}/opensearch/clients/data-prepper/logstash-migration-guide/).

For information on how to monitor Data Prepper, see the [Monitoring](https://github.com/opensearch-project/data-prepper/blob/main/docs/monitoring.md) page.

## Other examples

We have several other Docker [examples](https://github.com/opensearch-project/data-prepper/tree/main/examples/)
that allow you to run Data Prepper in different scenarios.
