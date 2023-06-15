---
layout: default
title: Configuration files
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
---

# Configuration files

OpenSearch and OpenSearch Dashboards offer a large number of settings that allow you to customize and tune the behavior of your distribution. These settings are stored in configuration YAML files. See the topics in this section for specific settings.

For a standard download of OpenSearch, you can find `opensearch.yml` in `/usr/share/opensearch/config/opensearch.yml` (Docker) or `/etc/opensearch/opensearch.yml` (most Linux distributions) on each node.

A standard Docker download stores the `opensearch_dashboards.yml` file in the following location: `/usr/share/opensearch-dashboards/config/opensearch_dashboards.yml`.

The demo configuration includes a number of settings for the Security plugin that you should modify before using OpenSearch for a production workload. To learn more, see [Security]({{site.url}}{{site.baseurl}}/security/).