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

<<<<<<< HEAD
<table>
  <thead style="text-align: left">
    <tr>
      <th>OpenSearch version</th>
      <th>Plugin versions</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <tr>
    <td>2.0.1.0</td>
    <td>
      <pre>opensearch-alerting                  2.0.1.0
opensearch-anomaly-detection         2.0.1.0
opensearch-asynchronous-search       2.0.1.0
opensearch-cross-cluster-replication 2.0.1.0
opensearch-index-management          2.0.1.0
opensearch-job-scheduler             2.0.1.0
opensearch-knn                       2.0.1.0
opensearch-ml                        2.0.1.0
opensearch-notifications             2.0.1.0
opensearch-observability             2.0.1.0
opensearch-performance-analyzer      2.0.1.0
opensearch-reports-scheduler         2.0.1.0
opensearch-security                  2.0.1.0
opensearch-sql                       2.0.1.0
</pre>
</td>
</tr>
  <tr>
    <td>2.0.0.0</td>
    <td>
      <pre>opensearch-alerting                  2.0.0.0
opensearch-anomaly-detection         2.0.0.0
opensearch-asynchronous-search       2.0.0.0
opensearch-cross-cluster-replication 2.0.0.0
opensearch-index-management          2.0.0.0
opensearch-job-scheduler             2.0.0.0
opensearch-knn                       2.0.0.0
opensearch-ml                        2.0.0.0
opensearch-notifications             2.0.0.0
opensearch-observability             2.0.0.0
opensearch-performance-analyzer      2.0.0.0
opensearch-reports-scheduler         2.0.0.0
opensearch-security                  2.0.0.0
opensearch-sql                       2.0.0.0
</pre>
</td>
</tr>
  <tr>
    <td>2.0.0.0-rc1</td>
    <td>
      <pre>opensearch-alerting                  2.0.0.0-rc1
opensearch-anomaly-detection         2.0.0.0-rc1
opensearch-asynchronous-search       2.0.0.0-rc1
opensearch-cross-cluster-replication 2.0.0.0-rc1
opensearch-index-management          2.0.0.0-rc1
opensearch-job-scheduler             2.0.0.0-rc1
opensearch-knn                       2.0.0.0-rc1
opensearch-ml                        2.0.0.0-rc1
opensearch-observability             2.0.0.0-rc1
opensearch-performance-analyzer      2.0.0.0-rc1
opensearch-reports-scheduler         2.0.0.0-rc1
opensearch-security                  2.0.0.0-rc1
opensearch-sql                       2.0.0.0-rc1
</pre>
</td>
</tr>
<tr>
    <td>1.3.3</td>
    <td>
      <pre>opensearch-alerting                  1.3.3.0
opensearch-anomaly-detection         1.3.3.0
opensearch-asynchronous-search       1.3.3.0
opensearch-cross-cluster-replication 1.3.3.0
opensearch-index-management          1.3.3.0
opensearch-job-scheduler             1.3.3.0
opensearch-knn                       1.3.3.0
opensearch-ml                        1.3.3.0
opensearch-observability             1.3.3.0
opensearch-performance-analyzer      1.3.3.0
opensearch-reports-scheduler         1.3.3.0
opensearch-security                  1.3.3.0
opensearch-sql                       1.3.3.0
</pre>
</td>
</tr>
  <tr>
  <tr>
    <td>1.3.2</td>
    <td>
      <pre>opensearch-alerting                  1.3.2.0
opensearch-anomaly-detection         1.3.2.0
opensearch-asynchronous-search       1.3.2.0
opensearch-cross-cluster-replication 1.3.2.0
opensearch-index-management          1.3.2.0
opensearch-job-scheduler             1.3.2.0
opensearch-knn                       1.3.2.0
opensearch-ml                        1.3.2.0
opensearch-observability             1.3.2.0
opensearch-performance-analyzer      1.3.2.0
opensearch-reports-scheduler         1.3.2.0
opensearch-security                  1.3.2.0
opensearch-sql                       1.3.2.0
</pre>
</td>
</tr>
  <tr>
    <td>1.3.1</td>
    <td>
      <pre>opensearch-alerting                  1.3.1.0
opensearch-anomaly-detection         1.3.1.0
opensearch-asynchronous-search       1.3.1.0
opensearch-cross-cluster-replication 1.3.1.0
opensearch-index-management          1.3.1.0
opensearch-job-scheduler             1.3.1.0
opensearch-knn                       1.3.1.0
opensearch-ml                        1.3.1.0
opensearch-observability             1.3.1.0
opensearch-performance-analyzer      1.3.1.0
opensearch-reports-scheduler         1.3.1.0
opensearch-security                  1.3.1.0
opensearch-sql                       1.3.1.0
</pre>
</td>
</tr>
  <tr>
    <td>1.3.0</td>
    <td>
      <pre>opensearch-alerting                  1.3.0.0
opensearch-anomaly-detection         1.3.0.0
opensearch-asynchronous-search       1.3.0.0
opensearch-cross-cluster-replication 1.3.0.0
opensearch-index-management          1.3.0.0
opensearch-job-scheduler             1.3.0.0
opensearch-knn                       1.3.0.0
opensearch-ml                        1.3.0.0
opensearch-observability             1.3.0.0
opensearch-performance-analyzer      1.3.0.0
opensearch-reports-scheduler         1.3.0.0
opensearch-security                  1.3.0.0
opensearch-sql                       1.3.0.0
</pre>
</td>
</tr>
  <tr>
    <td>1.2.4</td>
    <td>
      <pre>opensearch-alerting                  1.2.4.0
opensearch-anomaly-detection         1.2.4.0
opensearch-asynchronous-search       1.2.4.0
opensearch-cross-cluster-replication 1.2.4.0
opensearch-index-management          1.2.4.0
opensearch-job-scheduler             1.2.4.0
opensearch-knn                       1.2.4.0
opensearch-observability             1.2.4.0
opensearch-performance-analyzer      1.2.4.0
opensearch-reports-scheduler         1.2.4.0
opensearch-security                  1.2.4.0
opensearch-sql                       1.2.4.0
</pre>
</td>
</tr>
    <td>1.2.3</td>
    <td>
      <pre>opensearch-alerting                  1.2.3.0
opensearch-anomaly-detection         1.2.3.0
opensearch-asynchronous-search       1.2.3.0
opensearch-cross-cluster-replication 1.2.3.0
opensearch-index-management          1.2.3.0
opensearch-job-scheduler             1.2.3.0
opensearch-knn                       1.2.3.0
opensearch-observability             1.2.3.0
opensearch-performance-analyzer      1.2.3.0
opensearch-reports-scheduler         1.2.3.0
opensearch-security                  1.2.3.0
opensearch-sql                       1.2.3.0
</pre>
</td>
</tr>
  <tr>
    <td>1.2.2</td>
    <td>
      <pre>opensearch-alerting                  1.2.2.0
opensearch-anomaly-detection         1.2.2.0
opensearch-asynchronous-search       1.2.2.0
opensearch-cross-cluster-replication 1.2.2.0
opensearch-index-management          1.2.2.0
opensearch-job-scheduler             1.2.2.0
opensearch-knn                       1.2.2.0
opensearch-observability             1.2.2.0
opensearch-performance-analyzer      1.2.2.0
opensearch-reports-scheduler         1.2.2.0
opensearch-security                  1.2.2.0
opensearch-sql                       1.2.2.0
</pre>
</td>
</tr>
  <tr>
    <td>1.2.1</td>
    <td>
      <pre>opensearch-alerting                  1.2.1.0
opensearch-anomaly-detection         1.2.1.0
opensearch-asynchronous-search       1.2.1.0
opensearch-cross-cluster-replication 1.2.1.0
opensearch-index-management          1.2.1.0
opensearch-job-scheduler             1.2.1.0
opensearch-knn                       1.2.1.0
opensearch-observability             1.2.1.0
opensearch-performance-analyzer      1.2.1.0
opensearch-reports-scheduler         1.2.1.0
opensearch-security                  1.2.1.0
opensearch-sql                       1.2.1.0
</pre>
</td>
</tr>
  <tr>
    <td>1.2.0</td>
    <td>
      <pre>opensearch-alerting                  1.2.0.0
opensearch-anomaly-detection         1.2.0.0
opensearch-asynchronous-search       1.2.0.0
opensearch-cross-cluster-replication 1.2.0.0
opensearch-index-management          1.2.0.0
opensearch-job-scheduler             1.2.0.0
opensearch-knn                       1.2.0.0
opensearch-observability             1.2.0.0
opensearch-performance-analyzer      1.2.0.0
opensearch-reports-scheduler         1.2.0.0
opensearch-security                  1.2.0.0
opensearch-sql                       1.2.0.0
</pre>
</td>
</tr>
<tr>
  <td>1.1.0</td>
  <td>
    <pre>opensearch-alerting                  1.1.0.0
opensearch-anomaly-detection         1.1.0.0
opensearch-asynchronous-search       1.1.0.0
opensearch-cross-cluster-replication 1.1.0.0
opensearch-index-management          1.1.0.0
opensearch-job-scheduler             1.1.0.0
opensearch-knn                       1.1.0.0
opensearch-notebooks                 1.1.0.0
opensearch-performance-analyzer      1.1.0.0
opensearch-reports-scheduler         1.1.0.0
opensearch-security                  1.1.0.0
opensearch-sql                       1.1.0.0
</pre>
    </td>
  </tr>
  <tr>
    <td>1.0.1</td>
    <td>
      <pre>opensearch-alerting             1.0.0.0
opensearch-anomaly-detection    1.0.0.0
opensearch-asynchronous-search  1.0.0.0
opensearch-index-management     1.0.1.0
opensearch-job-scheduler        1.0.0.0
opensearch-knn                  1.0.0.0
opensearch-notebooks            1.0.0.0
opensearch-performance-analyzer 1.0.1.0
opensearch-reports-scheduler    1.0.0.0
opensearch-security             1.0.1.0
opensearch-sql                  1.0.0.0
</pre>
    </td>
  </tr>
  <tr>
    <td>1.0.0</td>
    <td>
      <pre>opensearch-alerting             1.0.0.0
opensearch-anomaly-detection    1.0.0.0
opensearch-asynchronous-search  1.0.0.0
opensearch-index-management     1.0.0.0
opensearch-job-scheduler        1.0.0.0
opensearch-knn                  1.0.0.0
opensearch-notebooks            1.0.0.0
opensearch-performance-analyzer 1.0.0.0
opensearch-reports-scheduler    1.0.0.0
opensearch-security             1.0.0.0
opensearch-sql                  1.0.0.0
</pre>
    </td>
  </tr>
=======
| Plugin Name | Repository | OpenSearch Compatible Versions |
| :--- | :--- | :--- |
| Alerting | [opensearch-alerting](https://github.com/opensearch-project/alerting) | 1.0.0 or newer |
| Anomaly Detection | [opensearch-anomaly-detection](https://github.com/opensearch-project/anomaly-detection) | 1.0.0 or newer |
| Asynchronous Search | [opensearch-asynchronous-search](https://github.com/opensearch-project/asynchronous-search) | 1.0.0 or newer |
| Cross Cluster Replication | [opensearch-cross-cluster-replication](https://github.com/opensearch-project/cross-cluster-replication) | 1.1.0 or newer |
| Dashboard Notebooks<sup>1</sup> | [opensearch-notebooks](https://github.com/opensearch-project/dashboards-notebooks) | 1.0.0 to 1.1.0 |
| Dashboard Reports | [opensearch-reports-scheduler](https://github.com/opensearch-project/dashboards-reports) | 1.0.0 or newer |
| Index Management | [opensearch-index-management](https://github.com/opensearch-project/index-management) | 1.0.0 or newer |
| Job Scheduler | [opensearch-job-scheduler](https://github.com/opensearch-project/job-scheduler) | 1.0.0 or newer |
| k-NN | [opensearch-knn](https://github.com/opensearch-project/k-NN) | 1.0.0 or newer |
| ML Commons | [opensearch-ml](https://github.com/opensearch-project/ml-commons) | 1.3.0 or newer |
| Observability | [opensearch-observability](https://github.com/opensearch-project/observability) | 1.2.0 or newer |
| Performance Analyzer | [opensearch-performance-analyzer](https://github.com/opensearch-project/performance-analyzer) | 1.0.0 or newer |
| Security | [opensearch-security](https://github.com/opensearch-project/security) | 1.0.0 or newer |
| SQL | [opensearch-sql](https://github.com/opensearch-project/sql) | 1.0.0 or newer |

<sup>1</sup>Dashboard Notebooks was merged in to the Observability plugin with the release of OpenSearch 1.2.0.
>>>>>>> 9a6ffd1 (Plugins page revamp (#929))
