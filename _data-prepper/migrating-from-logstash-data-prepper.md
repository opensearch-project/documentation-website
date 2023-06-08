---
layout: default
title: Migrating from Logstash
nav_order: 25
redirect_from: 
  - /data-prepper/configure-logstash-data-prepper/
---

# Migrating from Logstash

You can run Data Prepper with a Logstash configuration.

As mentioned in [Getting started with Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/), you'll need to configure Data Prepper with a pipeline using a `pipelines.yaml` file.

Alternatively, if you have a Logstash configuration `logstash.conf` to configure Data Prepper instead of `pipelines.yaml`.

## Supported plugins

As of the Data Prepper 1.2 release, the following plugins from the Logstash configuration are supported:
* HTTP Input plugin
* Grok Filter plugin
* Elasticsearch Output plugin
* Amazon Elasticsearch Output plugin

## Limitations
* Apart from the supported plugins, all other plugins from the Logstash configuration will throw an `Exception` and fail to run.
* Conditionals in the Logstash configuration are not supported as of the Data Prepper 1.2 release.

## Running Data Prepper with a Logstash configuration

1. To install Data Prepper's Docker image, see Installing Data Prepper in [Getting Started with Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started#1-installing-data-prepper).

2. Run the Docker image installed in Step 1 by supplying your `logstash.conf` configuration.

```
docker run --name data-prepper -p 4900:4900 -v ${PWD}/logstash.conf:/usr/share/data-prepper/pipelines.conf opensearchproject/data-prepper:latest pipelines.conf
```

The `logstash.conf` file is converted to `logstash.yaml` by mapping the plugins and attributes in the Logstash configuration to the corresponding plugins and attributes in Data Prepper.
You can find the converted `logstash.yaml` file in the same directory where you stored `logstash.conf`.


The following output in your terminal indicates that Data Prepper is running correctly:

```
INFO  org.opensearch.dataprepper.pipeline.ProcessWorker - log-pipeline Worker: No records received from buffer
```
