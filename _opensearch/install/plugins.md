---
layout: default
title: OpenSearch plugins
parent: Install OpenSearch
nav_order: 90
---

# OpenSearch plugin installation

You can install individual plugins on an OpenSearch cluster.

---

#### Table of contents
1. TOC
{:toc}
  
---

## Install a plugin

If you are running OpenSearch in a Docker container, plugins must be installed, removed, and configured by modifying the Docker image. For information, see [Install, configure or remove plugins]({{site.url}}{{site.baseurl}}/opensearch/install/docker#install-configure-or-remove-plugins)
{: .note}

The install command takes a plugin id, which may be any of the following:

- An official OpenSearch plugin name
- Maven coordinates to a plugin zip file
- A URL to a plugin zip file

If you're installing an official OpenSearch plugin, use:
```
bin/opensearch-plugin install <plugin-name>
```

For a plugin installed via zip, use:
```
bin/opensearch-plugin install <name|Zip File|Url>
```

Restart your OpenSearch node after installing a plugin.

## Batch mode

When installing plugins that require additional privileges not included by default, the plugins will prompt the user for confirmation of the required privileges. To grant all requested privileges, use batch mode to skip the confirmation prompt.

To force batch mode when installing plugins, add the `-b` or `--batch` option:
```
bin/opensearch-plugin install --batch <plugin-name>
```

## Remove a plugin

```
bin/opensearch-plugin remove <plugin-name>
```
Restart your OpenSearch node after removing a plugin.

## List installed plugins

To check which plugins are currently installed:

```
bin/opensearch-plugin list
```

## Available plugins

| Plugin Name | Compatible OpenSearch Versions |
:--- | :--- |
|opensearch-sql | 1.0.0 or newer |
|opensearch-security| 1.0.0 or newer |
|opensearch-reports-scheduler| 1.0.0 or newer |
|opensearch-performance-analyzer| 1.0.0 or newer |
|opensearch-notebooks| 1.0.0 to 1.1.0 |
|opensearch-knn| 1.0.0 or newer |
|opensearch-job-scheduler| 1.0.0 or newer |
|opensearch-index-management| 1.0.0 or newer |
|opensearch-asynchronous-search| 1.0.0 or newer |
|opensearch-anomaly-detection| 1.0.0 or newer |
|opensearch-cross-cluster-replication| 1.1.0 or newer |
|opensearch-observability| 1.2.0 or newer |
|opensearch-alerting| 1.0.0 or newer |
|opensearch-ml| 1.3.0 or newer |