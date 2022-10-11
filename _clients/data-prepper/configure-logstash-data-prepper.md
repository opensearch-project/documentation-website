---
layout: default
title: Configure Logstash for Data Prepper
parent: Data Prepper
nav_order: 2
---
# Configure Logstash for Data Prepper
You can run Data Prepper with a Logstash configuration.

As mentioned in the [Getting Started]({{site.url}}{{site.baseurl}}/opensearch/clients/data-prepper/getting-started) guide, you'll need to configure Data Prepper with a pipeline using a `pipelines.yaml` file.

Alternatively, if you have a Logstash configuration `logstash.conf` to configure Data Prepper instead of `pipelines.yaml`.

## Supported Plugins

As of the Data Prepper 1.2 release, the following plugins from the Logstash configuration are supported:
* HTTP Input plugin
* Grok Filter plugin
* Elasticsearch Output plugin
* Amazon Elasticsearch Output plugin

## Limitations
* Apart from the supported plugins, all other plugins from the Logstash configuration will throw an `Exception` and fail to execute.
* Conditionals in the Logstash configuration are not supported as of Data Prepper 1.2 release.

## Running Data Prepper with Logstash Configuration

1. To install Data Prepper's docker image, visit the _Installation_ section in [Getting Started]({{site.url}}{{site.baseurl}}/opensearch/clients/data-prepper/getting_started).

2. Run the docker image pulled in Step 1 by supplying your `logstash.conf` configuration.

```
docker run --name data-prepper -p 4900:4900 -v ${PWD}/logstash.conf:/usr/share/data-prepper/pipelines.conf opensearchproject/data-prepper:latest pipelines.conf
```

The `logstash.conf` file gets converted to `logstash.yaml` by mapping the plugins and attributes in the Logstash configuration to the corresponding plugins and attributes in Data Prepper.
You can find the converted `logstash.yaml` file in the same directory where you placed `logstash.conf`.


The following output in your terminal indicates that Data Prepper is running correctly:

```
INFO  org.opensearch.dataprepper.pipeline.ProcessWorker - log-pipeline Worker: No records received from buffer
```