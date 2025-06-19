---
layout: default
title: Install and configure OpenSearch Data Prepper
nav_order: 10
grand_parent: OpenSearch Data Prepper 
parent: Getting started with OpenSearch Data Prepper
---


## 1. Installing Data Prepper

There are two ways to install Data Prepper: you can run the Docker image or build from source.

The easiest way to use Data Prepper is by running the Docker image. We suggest that you use this approach if you have [Docker](https://www.docker.com) available. Run the following command:  

```
docker pull opensearchproject/data-prepper:latest
```
{% include copy.html %}

If you have special requirements that require you to build from source, or if you want to contribute, see the [Developer Guide](https://github.com/opensearch-project/data-prepper/blob/main/docs/developer_guide.md).

## 2. Configuring Data Prepper

Two configuration files are required to run a Data Prepper instance. Optionally, you can configure a Log4j 2 configuration file. See [Configuring Log4j]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/configuring-log4j/) for more information. The following list describes the purpose of each configuration file:

* `pipelines.yaml`: This file describes which data pipelines to run, including sources, processors, and sinks. 
* `data-prepper-config.yaml`: This file contains Data Prepper server settings that allow you to interact with exposed Data Prepper server APIs. 
* `log4j2-rolling.properties` (optional): This file contains Log4j 2 configuration options and can be a JSON, YAML, XML, or .properties file type. 

For Data Prepper versions earlier than 2.0, the `.jar` file expects the pipeline configuration file path to be followed by the server configuration file path. See the following configuration path example:

```
java -jar data-prepper-core-$VERSION.jar pipelines.yaml data-prepper-config.yaml
```

Optionally, you can add `"-Dlog4j.configurationFile=config/log4j2.properties"` to the command to pass a custom Log4j 2 configuration file. If you don't provide a properties file, Data Prepper defaults to the `log4j2.properties` file in the `shared-config` directory.


Starting with Data Prepper 2.0, you can launch Data Prepper by using the following `data-prepper` script that does not require any additional command line arguments:

```
bin/data-prepper
```

Configuration files are read from specific subdirectories in the application's home directory:
1. `pipelines/`: Used for pipeline configurations. Pipeline configurations can be written in one or more YAML files.
2. `config/data-prepper-config.yaml`: Used for the Data Prepper server configuration.

You can supply your own pipeline configuration file path followed by the server configuration file path. However, this method will not be supported in a future release. See the following example:

```
bin/data-prepper pipelines.yaml data-prepper-config.yaml
```

The Log4j 2 configuration file is read from the `config/log4j2.properties` file located in the application's home directory.

To configure Data Prepper, see the following information for each use case: 

* [Trace analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/): Learn how to collect trace data and customize a pipeline that ingests and transforms that data. 
* [Log analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/log-analytics/): Learn how to set up Data Prepper for log observability.