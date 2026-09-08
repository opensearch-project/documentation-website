---
layout: default
title: Installation quickstart
parent: Getting started
nav_order: 10
---

# OpenSearch Dashboards installation quickstart

This guide helps you quickly install OpenSearch and OpenSearch Dashboards using [Docker](https://www.docker.com/). For other installation methods, see [Installing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/).

## Prerequisite

Before you begin, install [Docker](https://docs.docker.com/get-docker/) on your machine.

## Option 1: Try OpenSearch Dashboards in one command

Use this method to quickly spin up OpenSearch and OpenSearch Dashboards on your local machine with minimal setup.

This configuration disables security and should only be used in test environments.
{: .note }

Start OpenSearch:

```bash
docker pull opensearchproject/opensearch:latest && docker run -d -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" -e "DISABLE_SECURITY_PLUGIN=true" --name opensearch opensearchproject/opensearch:latest
```
{% include copy.html %}

Start OpenSearch Dashboards:

```bash
docker pull opensearchproject/opensearch-dashboards:latest && docker run -d -p 5601:5601 -e "OPENSEARCH_HOSTS=http://host.docker.internal:9200" -e "DISABLE_SECURITY_DASHBOARDS_PLUGIN=true" --name opensearch-dashboards opensearchproject/opensearch-dashboards:latest
```
{% include copy.html %}

After both containers start, verify that OpenSearch is running:

```bash
curl http://localhost:9200
```
{% include copy.html %}

Then open OpenSearch Dashboards at [http://localhost:5601](http://localhost:5601).

## Option 2: Set up a Docker Compose cluster

For more control over your setup, use Docker Compose to run a multi-node cluster:

1. Set up OpenSearch. See the [OpenSearch Installation quickstart]({{site.url}}{{site.baseurl}}/getting-started/quickstart/#option-2-set-up-a-custom-docker-cluster).
2. Set up OpenSearch Dashboards. See [Installing OpenSearch Dashboards with Docker]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/docker/).

## Other installation methods

For non-Docker installation methods (tarball, RPM, Debian, Helm, Windows), see [Installing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/).

## Configuring OpenSearch Dashboards

You can configure OpenSearch Dashboards settings in the `opensearch_dashboards.yml` file. This file controls server options, authentication, plugin settings, and features like [workspaces]({{site.url}}{{site.baseurl}}/dashboards/workspace/). After changing the configuration file, restart OpenSearch Dashboards for the changes to take effect.

For a full list of settings, see [Configuring OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-dashboards/).

## Next steps

- Learn how to navigate the interface in [Access OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/getting-started/access/).
