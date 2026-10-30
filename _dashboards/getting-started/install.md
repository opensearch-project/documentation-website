---
layout: default
title: Install OpenSearch Dashboards
parent: Getting started
nav_order: 10
---

# Install OpenSearch Dashboards

OpenSearch Dashboards is the user interface for OpenSearch. To follow the tutorials using your own instance, install OpenSearch and OpenSearch Dashboards by following these steps.

## Step 1: Install OpenSearch and OpenSearch Dashboards

Choose one of the following options:

- To try OpenSearch and OpenSearch Dashboards using Docker, follow the [Installation quickstart]({{site.url}}{{site.baseurl}}/getting-started/quickstart/).

- To install OpenSearch Dashboards for production, first install OpenSearch using one of the methods in [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/), and then install OpenSearch Dashboards using one of the methods in [Installing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/).

## Step 2 (Optional): Configure OpenSearch Dashboards

You can configure OpenSearch Dashboards settings in the `opensearch_dashboards.yml` file. This file controls server options, authentication, plugin settings, and features like [workspaces]({{site.url}}{{site.baseurl}}/dashboards/workspace/). After changing the configuration file, restart OpenSearch Dashboards for the changes to take effect.

For a full list of settings, see [Configuring OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-dashboards/).

Some settings can also be changed in OpenSearch Dashboards without editing `opensearch_dashboards.yml`. For more information, see [Advanced settings]({{site.url}}{{site.baseurl}}/dashboards/management/advanced-settings/).

## Next steps

- Learn how to navigate the interface in [Access OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/getting-started/access/).
