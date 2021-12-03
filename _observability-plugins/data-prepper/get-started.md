---
layout: default
title: Get Started
parent: Data Prepper
nav_order: 1
---

# Get started with Data Prepper

Data Prepper is an independent component, not an OpenSearch plugin, that converts data for use with OpenSearch. It's not bundled with the all-in-one OpenSearch installation packages.

## Install Data Prepper

To use the Docker image, pull it like any other image:

```bash
docker pull opensearchproject/data-prepper:latest
```

## Define a pipeline

Build a pipeline by creating a pipeline configuration YAML using any of the built-in Data Prepper plugins. 

For more examples and details on pipeline configurations see [Pipelines]({{site.url}}{{site.baseurl}}/observability-plugins/data-prepper/pipelines) guide.

## Start Data Prepper

Run the following command with your pipeline configuration YAML.

```bash
docker run --name data-prepper -v /full/path/to/pipelines.yaml:/usr/share/data-prepper/pipelines.yaml opensearchproject/opensearch-data-prepper:latest
```

### Migrating from Logstash

Data Prepper supports Logstash configuration files for a limited set of plugins. Simply use the logstash config to run Data Prepper.

```bash
docker run --name data-prepper -v /full/path/to/logstash.conf:/usr/share/data-prepper/pipelines.conf opensearchproject/opensearch-data-prepper:latest
```

This feature is limited by feature parity of Data Prepper. As of Data Prepper 1.2 release, the following plugins from the Logstash configuration are supported:

- HTTP Input plugin
- Grok Filter plugin
- Elasticsearch Output plugin
- Amazon Elasticsearch Output plugin

### Configure the Data Prepper server
Data Prepper itself provides administrative HTTP endpoints such as `/list` to list pipelines and `/metrics/prometheus` to provide Prometheus-compatible metrics data. The port which serves these endpoints has a TLS configuration and is specified by a separate YAML file. Data Prepper docker images secures these endpoints by default. We strongly recommend providing your own configuration file for securing production environments. Example:

```yml
ssl: true
keyStoreFilePath: "/usr/share/data-prepper/keystore.jks"
keyStorePassword: "password"
privateKeyPassword: "other_password"
serverPort: 1234
```