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

1. Download the tarball from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}.

1. Extract the TAR file to a directory and change to that directory:

   ```bash
   # x64
   tar -zxf opensearch-dashboards-{{site.opensearch_dashboards_version}}-linux-x64.tar.gz
   cd opensearch-dashboards-{{site.opensearch_dashboards_version}}
   # ARM64
   tar -zxf opensearch-dashboards-{{site.opensearch_dashboards_version}}-linux-arm64.tar.gz
   cd opensearch-dashboards-{{site.opensearch_dashboards_version}}
   ```

1. If desired, modify `config/opensearch_dashboards.yml`.

1. Start OpenSearch Dashboards:

   ```bash
   ./bin/opensearch-dashboards
   ```

1. In a web browser, go to `http://localhost:5601` and log in as the `admin` user using the custom admin password that you set when you installed OpenSearch. If OpenSearch Dashboards runs on a remote host, replace `localhost` with the IP address or DNS name of that host. For more information, see [Accessing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#accessing-opensearch-dashboards).

## Related documentation

- [Preparing OpenSearch Dashboards for production]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#preparing-opensearch-dashboards-for-production)
