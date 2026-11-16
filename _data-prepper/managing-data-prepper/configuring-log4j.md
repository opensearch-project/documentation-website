---
layout: default
title: Configuring Log4j
parent: Managing OpenSearch Data Prepper
nav_order: 20
---

# Configuring Log4j

You can configure logging using Log4j in OpenSearch Data Prepper. 

## Logging 

Data Prepper uses [SLF4J](https://www.slf4j.org/) with a [Log4j 2 binding](https://logging.apache.org/log4j/2.x/log4j-slf4j-impl.html).

Data Prepper reads its Log4j 2 configuration from the `config/log4j2-rolling.properties` file in the Data Prepper home directory. To customize logging, edit or replace this file. In Docker, the file path is `/usr/share/data-prepper/config/log4j2-rolling.properties`.

To use a configuration file in a different location, set the `log4j.configurationFile` system property in the `JAVA_OPTS` environment variable before starting Data Prepper:

```bash
export JAVA_OPTS="-Dlog4j.configurationFile=/path/to/log4j2.properties"
bin/data-prepper
```
{% include copy.html %}

In Docker, pass the environment variable using the `-e` option and mount the configuration file into the container:

```bash
docker run --name data-prepper \
  -e JAVA_OPTS="-Dlog4j.configurationFile=/usr/share/data-prepper/custom/log4j2.properties" \
  -v ${PWD}/log4j2.properties:/usr/share/data-prepper/custom/log4j2.properties \
  -v ${PWD}/pipelines.yaml:/usr/share/data-prepper/pipelines/pipelines.yaml \
  opensearchproject/data-prepper:latest
```
{% include copy.html %}

See the [Log4j 2 configuration documentation](https://logging.apache.org/log4j/2.x/manual/configuration.html) for more information about Log4j 2 configuration.

