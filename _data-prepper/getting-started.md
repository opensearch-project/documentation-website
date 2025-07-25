---
layout: default
title: Getting started
nav_order: 5
redirect_from:
  - /clients/data-prepper/get-started/
canonical_url: https://docs.opensearch.org/latest/data-prepper/getting-started/
---

# Getting started with OpenSearch Data Prepper

OpenSearch Data Prepper is an independent component, not an OpenSearch plugin, that converts data for use with OpenSearch. It's not bundled with the all-in-one OpenSearch installation packages.

If you are migrating from Open Distro OpenSearch Data Prepper, see [Migrating from Open Distro]({{site.url}}{{site.baseurl}}/data-prepper/migrate-open-distro/). 
{: .note}

## 1. Installing OpenSearch Data Prepper

There are two ways to install OpenSearch Data Prepper: you can run the Docker image or build from source.

The easiest way to use OpenSearch Data Prepper is by running the Docker image. We suggest that you use this approach if you have [Docker](https://www.docker.com) available. Run the following command:  

```
docker pull opensearchproject/data-prepper:latest
```
{% include copy.html %}

If you have special requirements that require you to build from source, or if you want to contribute, see the [Developer Guide](https://github.com/opensearch-project/data-prepper/blob/main/docs/developer_guide.md).

## 2. Configuring OpenSearch Data Prepper

Two configuration files are required to run an OpenSearch Data Prepper instance. Optionally, you can configure a Log4j 2 configuration file. See [Configuring Log4j]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/configuring-log4j/) for more information. The following list describes the purpose of each configuration file:

* `pipelines.yaml`: This file describes which data pipelines to run, including sources, processors, and sinks. 
* `data-prepper-config.yaml`: This file contains OpenSearch Data Prepper server settings that allow you to interact with exposed OpenSearch Data Prepper server APIs. 
* `log4j2-rolling.properties` (optional): This file contains Log4j 2 configuration options and can be a JSON, YAML, XML, or .properties file type. 

For OpenSearch Data Prepper versions earlier than 2.0, the `.jar` file expects the pipeline configuration file path to be followed by the server configuration file path. See the following configuration path example:

```
java -jar data-prepper-core-$VERSION.jar pipelines.yaml data-prepper-config.yaml
```

Optionally, you can add `"-Dlog4j.configurationFile=config/log4j2.properties"` to the command to pass a custom Log4j 2 configuration file. If you don't provide a properties file, OpenSearch Data Prepper defaults to the `log4j2.properties` file in the `shared-config` directory.


Starting with OpenSearch Data Prepper 2.0, you can launch OpenSearch Data Prepper by using the following `data-prepper` script that does not require any additional command line arguments:

```
bin/data-prepper
```

Configuration files are read from specific subdirectories in the application's home directory:
1. `pipelines/`: Used for pipeline configurations. Pipeline configurations can be written in one or more YAML files.
2. `config/data-prepper-config.yaml`: Used for the OpenSearch Data Prepper server configuration.

You can supply your own pipeline configuration file path followed by the server configuration file path. However, this method will not be supported in a future release. See the following example:
```
bin/data-prepper pipelines.yaml data-prepper-config.yaml
```

The Log4j 2 configuration file is read from the `config/log4j2.properties` file located in the application's home directory.

To configure OpenSearch Data Prepper, see the following information for each use case: 

* [Trace analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/): Learn how to collect trace data and customize a pipeline that ingests and transforms that data. 
* [Log analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/log-analytics/): Learn how to set up OpenSearch Data Prepper for log observability.

## 3. Defining a pipeline

Create an OpenSearch Data Prepper pipeline file named `pipelines.yaml` using the following configuration:

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

## 4. Running OpenSearch Data Prepper

Run the following command with your pipeline configuration YAML.

```bash
docker run --name data-prepper \
    -v /${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines/pipelines.yaml \
    opensearchproject/data-prepper:latest
    
```
{% include copy.html %}

The example pipeline configuration above demonstrates a simple pipeline with a source (`random`) sending data to a sink (`stdout`). For examples of more advanced pipeline configurations, see [Pipelines]({{site.url}}{{site.baseurl}}/clients/data-prepper/pipelines/).

After starting OpenSearch Data Prepper, you should see log output and some UUIDs after a few seconds:

```yml
2021-09-30T20:19:44,147 [main] INFO  com.amazon.dataprepper.pipeline.server.DataPrepperServer - OpenSearch Data Prepper server running at :4900
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
The remainder of this page provides examples for running OpenSearch Data Prepper from the Docker image. If you
built it from source, refer to the [Developer Guide](https://github.com/opensearch-project/data-prepper/blob/main/docs/developer_guide.md) for more information.

However you configure your pipeline, you'll run OpenSearch Data Prepper the same way. You run the Docker
image and modify both the `pipelines.yaml` and `data-prepper-config.yaml` files.

For OpenSearch Data Prepper 2.0 or later, use this command:

```
docker run --name data-prepper -p 4900:4900 -v ${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines/pipelines.yaml -v ${PWD}/data-prepper-config.yaml:/usr/share/data-prepper/config/data-prepper-config.yaml opensearchproject/data-prepper:latest
```
{% include copy.html %}

For OpenSearch Data Prepper versions earlier than 2.0, use this command:

```
docker run --name data-prepper -p 4900:4900 -v ${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines.yaml -v ${PWD}/data-prepper-config.yaml:/usr/share/data-prepper/data-prepper-config.yaml opensearchproject/data-prepper:1.x
```
{% include copy.html %}

Once OpenSearch Data Prepper is running, it processes data until it is shut down. Once you are done, shut it down with the following command:

```
POST /shutdown
```
{% include copy-curl.html %}

### Additional configurations

For OpenSearch Data Prepper 2.0 or later, the Log4j 2 configuration file is read from `config/log4j2.properties` in the application's home directory. By default, it uses `log4j2-rolling.properties` in the *shared-config* directory.

For OpenSearch Data Prepper 1.5 or earlier, optionally add `"-Dlog4j.configurationFile=config/log4j2.properties"` to the command if you want to pass a custom log4j2 properties file. If no properties file is provided, OpenSearch Data Prepper defaults to the log4j2.properties file in the *shared-config* directory.

## Next steps

Trace analytics is an important OpenSearch Data Prepper use case. If you haven't yet configured it, see [Trace analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/).

Log ingestion is also an important OpenSearch Data Prepper use case. To learn more, see [Log analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/log-analytics/).

To learn how to run OpenSearch Data Prepper with a Logstash configuration, see [Migrating from Logstash]({{site.url}}{{site.baseurl}}/data-prepper/migrating-from-logstash-data-prepper/).

For information on how to monitor OpenSearch Data Prepper, see [Monitoring]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/monitoring/).

## More examples

For more examples of OpenSearch Data Prepper, see [examples](https://github.com/opensearch-project/data-prepper/tree/main/examples/) in the OpenSearch Data Prepper repo. 
