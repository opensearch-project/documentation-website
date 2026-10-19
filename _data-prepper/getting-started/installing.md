---
layout: default
title: Installing and configuring Data Prepper
parent: Getting started
nav_order: 10
---

# Installing and configuring Data Prepper

You can install OpenSearch Data Prepper using the Docker image or a Linux archive. To build Data Prepper from source, see the [Data Prepper Developer Guide](https://github.com/opensearch-project/data-prepper/blob/main/docs/developer_guide.md).

## Installing the Docker image

To use Data Prepper in Docker, install [Docker](https://docs.docker.com/get-docker/) and pull the Data Prepper image:

```bash
docker pull opensearchproject/data-prepper:latest
```
{% include copy.html %}

The Data Prepper home directory in the image is `/usr/share/data-prepper`. To provide configuration files, mount them into this directory when you start the container. For more information, see [Running Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/running/).

## Installing a Linux archive

Download a Data Prepper archive for your platform from the [OpenSearch downloads page](https://opensearch.org/downloads/){:target='\_blank'}. Each release provides the following archives:

- `opensearch-data-prepper-jdk-<version>-linux-<architecture>.tar.gz`: Includes a Java runtime.
- `opensearch-data-prepper-<version>-linux-<architecture>.tar.gz`: Does not include a Java runtime. To use this archive, install Java on your host.

Extract the archive, replacing `<version>` and `<architecture>` with the values in the file name:

```bash
tar -xzf opensearch-data-prepper-jdk-<version>-linux-<architecture>.tar.gz
```
{% include copy.html %}

The extracted directory is the Data Prepper home directory.

## Directory structure

The Data Prepper home directory contains the following files and directories.

| Path | Description |
| :--- | :--- |
| `bin/data-prepper` | The script that starts Data Prepper. |
| `pipelines/` | The directory for pipeline configuration files. Data Prepper loads every YAML file in this directory. This directory contains no pipelines after installation. |
| `config/data-prepper-config.yaml` | The Data Prepper server configuration file. |
| `config/log4j2-rolling.properties` | The Log4j 2 logging configuration file. |
| `lib/` | The Data Prepper libraries and plugins. |

## Server and logging configuration

Data Prepper also reads the following optional configuration files from the `config` directory of the Data Prepper home directory.

### Server configuration

The `config/data-prepper-config.yaml` file configures the Data Prepper server, which exposes the [core APIs]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/core-apis/) on port `4900`. The Docker image and the Linux archives include different default server configurations.

| Setting | Docker image | Linux archive |
| :--- | :--- | :--- |
| TLS | Enabled, using a self-signed certificate. Send requests using `https`. | Disabled. Send requests using `http`. |
| Authentication | HTTP basic authentication using the username `admin` and the password `admin`. | None. |

The default certificate and credentials in the Docker image are intended for testing only. Replace them before using Data Prepper in production.
{: .warning}

To change these settings, replace `config/data-prepper-config.yaml` with your own file. For example, the following file disables TLS for the core APIs:

```yaml
ssl: false
serverPort: 4900
```
{% include copy.html %}

For all server settings, see [Configuring OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/configuring-data-prepper/).

### Logging configuration

Data Prepper reads its logging configuration from `config/log4j2-rolling.properties`. To customize logging, either replace this file or set the `JAVA_OPTS` environment variable to point to a different file:

```bash
export JAVA_OPTS="-Dlog4j.configurationFile=/path/to/log4j2.properties"
```
{% include copy.html %}

For more information, see [Configuring Log4j]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/configuring-log4j/).

## Next steps

- [Configure a pipeline]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/configuring-pipelines/) for Data Prepper to run.
