---
layout: default
title: Tarball
parent: Installing OpenSearch Dashboards
nav_order: 30
redirect_from: 
  - /dashboards/install/tar/
---

# Installing OpenSearch Dashboards from a tarball

## Prerequisites

Install OpenSearch. For more information, see [Installing OpenSearch from a tarball]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/tar/).

## Install OpenSearch Dashboards from a tarball

To install OpenSearch Dashboards from a tarball, follow these steps:

1. Download the tarball from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'} or by using the command line (such as with `wget`):

   ```bash
   # x64
   wget https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/{{site.opensearch_dashboards_version}}/opensearch-dashboards-{{site.opensearch_dashboards_version}}-linux-x64.tar.gz

   # ARM64
   wget https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/{{site.opensearch_dashboards_version}}/opensearch-dashboards-{{site.opensearch_dashboards_version}}-linux-arm64.tar.gz
   ```

1. Extract the TAR file to a directory and change to that directory:

   ```bash
   # x64
   tar -zxf opensearch-dashboards-{{site.opensearch_dashboards_version}}-linux-x64.tar.gz
   cd opensearch-dashboards-{{site.opensearch_dashboards_version}}
   # ARM64
   tar -zxf opensearch-dashboards-{{site.opensearch_dashboards_version}}-linux-arm64.tar.gz
   cd opensearch-dashboards-{{site.opensearch_dashboards_version}}
   ```

1. If desired, modify `config/opensearch_dashboards.yml`. By default, OpenSearch Dashboards connects to OpenSearch at `https://localhost:9200` as the `kibanaserver` user and binds to `localhost`, so it cannot be reached from other hosts. To make OpenSearch Dashboards reachable from other hosts, set `server.host` to `0.0.0.0` or to an IP address of the host:

   ```yaml
   server.host: 0.0.0.0
   ```

1. Start OpenSearch Dashboards:

   ```bash
   ./bin/opensearch-dashboards
   ```

1. In a web browser, go to `http://localhost:5601` and log in as the `admin` user using the custom admin password that you set when you installed OpenSearch. If OpenSearch Dashboards runs on a remote host, replace `localhost` with the IP address or DNS name of that host. OpenSearch Dashboards can take about 1 minute to start. For more information, see [Accessing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#accessing-opensearch-dashboards).

## Related documentation

- [Preparing OpenSearch Dashboards for production]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#preparing-opensearch-dashboards-for-production)
