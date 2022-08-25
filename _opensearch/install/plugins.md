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
- [Maven coordinates](https://mvnrepository.com/artifact/org.opensearch.plugin) to a plugin zip file
- A URL to a plugin zip file

If you're installing an official OpenSearch plugin, use:
```bash
bin/opensearch-plugin install <plugin-name>
```

For a plugin installed via zip, use:
```bash
bin/opensearch-plugin install <name|Zip File|Url>
```

Restart your OpenSearch node after installing a plugin.

## Batch mode

When installing plugins that require additional privileges not included by default, the plugins will prompt the user for confirmation of the required privileges. To grant all requested privileges, use batch mode to skip the confirmation prompt.

To force batch mode when installing plugins, add the `-b` or `--batch` option:
```bash
bin/opensearch-plugin install --batch <plugin-name>
```

## Remove a plugin

```bash
bin/opensearch-plugin remove <plugin-name>
```
Restart your OpenSearch node after removing a plugin.

## List installed plugins

To check which plugins are currently installed:

```bash
bin/opensearch-plugin list
```

## Available plugins

### Bundled Plugins

The following plugins are bundled with all OpenSearch distributions except for minimum distribution packages.

| Plugin Name | Repository | OpenSearch Compatible Versions |
| :--- | :--- | :--- |
| Alerting | [opensearch-alerting](https://github.com/opensearch-project/alerting) | 1.0.0 or newer |
| Anomaly Detection | [opensearch-anomaly-detection](https://github.com/opensearch-project/anomaly-detection) | 1.0.0 or newer |
| Asynchronous Search | [opensearch-asynchronous-search](https://github.com/opensearch-project/asynchronous-search) | 1.0.0 or newer |
| Cross Cluster Replication | [opensearch-cross-cluster-replication](https://github.com/opensearch-project/cross-cluster-replication) | 1.1.0 or newer |
| Dashboard Notebooks<sup>1</sup> | [opensearch-notebooks](https://github.com/opensearch-project/dashboards-notebooks) | 1.0.0 to 1.1.0 |
| Dashboard Reports | [opensearch-reports-scheduler](https://github.com/opensearch-project/dashboards-reports) | 1.0.0 or newer |
| Geospatial | [opensearch-geospatial](https://github.com/opensearch-project/geospatial) | 2.2.0 or newer |
| Index Management | [opensearch-index-management](https://github.com/opensearch-project/index-management) | 1.0.0 or newer |
| Job Scheduler | [opensearch-job-scheduler](https://github.com/opensearch-project/job-scheduler) | 1.0.0 or newer |
| k-NN | [opensearch-knn](https://github.com/opensearch-project/k-NN) | 1.0.0 or newer |
| ML Commons | [opensearch-ml](https://github.com/opensearch-project/ml-commons) | 1.3.0 or newer |
| Observability | [opensearch-observability](https://github.com/opensearch-project/observability) | 1.2.0 or newer |
| Performance Analyzer | [opensearch-performance-analyzer](https://github.com/opensearch-project/performance-analyzer) | 1.0.0 or newer |
| Security | [opensearch-security](https://github.com/opensearch-project/security) | 1.0.0 or newer |
| SQL | [opensearch-sql](https://github.com/opensearch-project/sql) | 1.0.0 or newer |

<sup>1</sup>Dashboard Notebooks was merged in to the Observability plugin with the release of OpenSearch 1.2.0.

### Additional plugins

Members of the OpenSearch community have built countless plugins for the service. Although it isn't possible to build an exhaustive list of every plugin, since many plugins are not maintained within the OpenSearch GitHub repository, the following list of plugins are available to be installed by name using `bin/opensearch-plugin install <plugin-name>`.

| Plugin Name | OpenSearch Compatible Versions |
| :--- | :--- |
| analysis-icu | 1.0.0 or newer |
| analysis-kuromoji | 1.0.0 or newer |
| analysis-nori | 1.0.0 or newer |
| analysis-phonetic | 1.0.0 or newer |
| analysis-smartcn | 1.0.0 or newer |
| analysis-stempel | 1.0.0 or newer |
| analysis-ukrainian | 1.0.0 or newer |
| discovery-azure-classic | 1.0.0 or newer |
| discovery-ec2 | 1.0.0 or newer |
| discovery-gce | 1.0.0 or newer |
| ingest-attachment | 1.0.0 or newer |
| mapper-annotated-text | 1.0.0 or newer |
| mapper-murmur3 | 1.0.0 or newer |
| mapper-size | 1.0.0 or newer |
| repository-azure | 1.0.0 or newer |
| repository-gcs | 1.0.0 or newer |
| repository-hdfs | 1.0.0 or newer |
| repository-s3 | 1.0.0 or newer |
| store-smb | 1.0.0 or newer |
| transport-nio | 1.0.0 or newer |